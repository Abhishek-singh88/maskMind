import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { email, code, password } = (await request.json()) as {
      email?: string;
      code?: string;
      password?: string;
    };

    if (!email || !code || !password) {
      return Response.json(
        { success: false, message: 'Email, code, and new password are required' },
        { status: 400 }
      );
    }

    const user = await UserModel.findOne({ email });

    if (!user) {
      return Response.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    const isCodeValid = user.resetPasswordCode === code;
    const isCodeNotExpired = user.resetPasswordExpiry && user.resetPasswordExpiry > new Date();

    if (!isCodeValid || !isCodeNotExpired) {
      return Response.json(
        { success: false, message: 'Invalid or expired reset code' },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.authProvider = 'credentials';
    user.resetPasswordCode = undefined as unknown as string;
    user.resetPasswordExpiry = undefined as unknown as Date;
    await user.save();

    return Response.json(
      { success: true, message: 'Password reset successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error resetting password:', error);
    return Response.json(
      { success: false, message: 'Failed to reset password' },
      { status: 500 }
    );
  }
}

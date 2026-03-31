import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User';
import sendPasswordResetEmail from '@/helper/sendPasswordResetEmail';

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { email } = (await request.json()) as { email?: string };

    if (!email) {
      return Response.json(
        { success: false, message: 'Email is required' },
        { status: 400 }
      );
    }

    const user = await UserModel.findOne({ email });

    if (!user) {
      return Response.json(
        { success: false, message: 'No account found with this email.' },
        { status: 404 }
      );
    }

    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetPasswordCode = resetCode;
    user.resetPasswordExpiry = new Date(Date.now() + 60 * 60 * 1000);
    await user.save();

    const emailResponse = await sendPasswordResetEmail(
      user.email,
      user.username,
      resetCode
    );

    if (!emailResponse.success) {
      return Response.json(
        { success: false, message: 'Failed to send password reset email' },
        { status: 500 }
      );
    }

    return Response.json(
      { success: true, message: 'Reset code sent to your email.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error sending reset code:', error);
    return Response.json(
      { success: false, message: 'Failed to send reset code' },
      { status: 500 }
    );
  }
}

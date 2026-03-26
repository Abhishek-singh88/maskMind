import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User';
import { verifySchema } from '@/schemas/verifySchema';

export async function POST(request: Request) {
  await dbConnect();

  try {
    const body = await request.json();
    const result = verifySchema.safeParse(body);

    if (!result.success) {
      return Response.json(
        { success: false, message: result.error.errors[0]?.message || 'Invalid input' },
        { status: 400 }
      );
    }

    const { code } = result.data;
    const { username } = body as { username?: string };

    if (!username) {
      return Response.json(
        { success: false, message: 'Username is required' },
        { status: 400 }
      );
    }

    const user = await UserModel.findOne({ username });

    if (!user) {
      return Response.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    if (user.isVerified) {
      return Response.json(
        { success: false, message: 'User is already verified' },
        { status: 400 }
      );
    }

    const isCodeValid = user.verifyCode === code;
    const isCodeNotExpired = user.verifyCodeExpiry > new Date();

    if (!isCodeValid || !isCodeNotExpired) {
      return Response.json(
        { success: false, message: 'Invalid or expired verification code' },
        { status: 400 }
      );
    }

    user.isVerified = true;
    user.verifyCode = undefined as unknown as string;
    user.verifyCodeExpiry = undefined as unknown as Date;
    await user.save();

    return Response.json(
      { success: true, message: 'Email verified successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error verifying user:', error);
    return Response.json(
      { success: false, message: 'Failed to verify user' },
      { status: 500 }
    );
  }
}

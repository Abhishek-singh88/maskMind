import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User';
import sendVerificationEmail from '@/helper/sendVerificationEmail';

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, email } = (await request.json()) as {
      username?: string;
      email?: string;
    };

    if (!username && !email) {
      return Response.json(
        { success: false, message: 'Username or email is required' },
        { status: 400 }
      );
    }

    const user = await UserModel.findOne({
      ...(username ? { username } : {}),
      ...(email ? { email } : {}),
    });

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

    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    user.verifyCode = verifyCode;
    user.verifyCodeExpiry = new Date(Date.now() + 60 * 60 * 1000);
    await user.save();

    const emailResponse = await sendVerificationEmail(
      user.email,
      user.username,
      verifyCode
    );

    if (!emailResponse.success) {
      return Response.json(
        { success: false, message: 'Failed to send verification email' },
        { status: 500 }
      );
    }

    return Response.json(
      { success: true, message: 'Verification code resent successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error resending verification code:', error);
    return Response.json(
      { success: false, message: 'Failed to resend verification code' },
      { status: 500 }
    );
  }
}

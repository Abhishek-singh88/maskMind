import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User';

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username } = (await request.json()) as { username?: string };

    if (!username) {
      return Response.json(
        { success: false, message: 'Username is required' },
        { status: 400 }
      );
    }

    const user = await UserModel.findOne({ username }).select(
      'isVerified verifyCodeExpiry'
    );

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

    return Response.json(
      {
        success: true,
        message: 'Status fetched',
        verifyCodeExpiry: user.verifyCodeExpiry,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching verification status:', error);
    return Response.json(
      { success: false, message: 'Failed to fetch verification status' },
      { status: 500 }
    );
  }
}

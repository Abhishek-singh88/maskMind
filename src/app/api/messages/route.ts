import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import { getServerSession } from 'next-auth';

export async function GET() {
  await dbConnect();

  const session = await getServerSession(authOptions);
  const userId = session?.user?._id;

  if (!userId) {
    return Response.json(
      { success: false, message: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const user = await UserModel.findById(userId).select('messages isAcceptingMessages username');

    if (!user) {
      return Response.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    const messages = [...user.messages].sort(
      (a, b) => b.createAt.getTime() - a.createAt.getTime()
    );

    return Response.json(
      {
        success: true,
        message: 'Messages fetched successfully',
        messages,
        isAcceptingMessages: user.isAcceptingMessages,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching messages:', error);
    return Response.json(
      { success: false, message: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}

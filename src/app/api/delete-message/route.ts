import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import { getServerSession } from 'next-auth';

export async function POST(request: Request) {
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
    const { messageId } = (await request.json()) as { messageId?: string };

    if (!messageId) {
      return Response.json(
        { success: false, message: 'Message ID is required' },
        { status: 400 }
      );
    }

    const user = await UserModel.findByIdAndUpdate(
      userId,
      { $pull: { messages: { _id: messageId } } },
      { new: true }
    );

    if (!user) {
      return Response.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    return Response.json(
      { success: true, message: 'Message deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting message:', error);
    return Response.json(
      { success: false, message: 'Failed to delete message' },
      { status: 500 }
    );
  }
}

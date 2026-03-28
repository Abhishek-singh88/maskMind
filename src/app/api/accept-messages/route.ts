import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import { getServerSession } from 'next-auth';
import { acceptMessageSchema } from '@/schemas/acceptMessageSchema';

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
    const user = await UserModel.findById(userId).select('isAcceptingMessages');

    if (!user) {
      return Response.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    return Response.json(
      {
        success: true,
        message: 'Status fetched successfully',
        isAcceptingMessages: user.isAcceptingMessages,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching accept messages status:', error);
    return Response.json(
      { success: false, message: 'Failed to fetch status' },
      { status: 500 }
    );
  }
}

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
    const body = await request.json();
    const result = acceptMessageSchema.safeParse(body);

    if (!result.success) {
      return Response.json(
        { success: false, message: result.error.errors[0]?.message || 'Invalid input' },
        { status: 400 }
      );
    }

    const user = await UserModel.findByIdAndUpdate(
      userId,
      { isAcceptingMessages: result.data.acceptMessages },
      { new: true }
    ).select('isAcceptingMessages');

    if (!user) {
      return Response.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    return Response.json(
      {
        success: true,
        message: 'Status updated successfully',
        isAcceptingMessages: user.isAcceptingMessages,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating accept messages status:', error);
    return Response.json(
      { success: false, message: 'Failed to update status' },
      { status: 500 }
    );
  }
}

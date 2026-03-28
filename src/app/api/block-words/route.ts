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
    const user = await UserModel.findById(userId).select('blockedWords');

    if (!user) {
      return Response.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    return Response.json(
      { success: true, message: 'Blocked words fetched', blockedWords: user.blockedWords },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching blocked words:', error);
    return Response.json(
      { success: false, message: 'Failed to fetch blocked words' },
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
    const { blockedWords } = (await request.json()) as { blockedWords?: string[] };

    if (!Array.isArray(blockedWords)) {
      return Response.json(
        { success: false, message: 'blockedWords must be an array of strings' },
        { status: 400 }
      );
    }

    const cleaned = blockedWords
      .map((w) => w.trim())
      .filter(Boolean)
      .slice(0, 50);

    const user = await UserModel.findByIdAndUpdate(
      userId,
      { blockedWords: cleaned },
      { new: true }
    ).select('blockedWords');

    if (!user) {
      return Response.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    return Response.json(
      { success: true, message: 'Blocked words updated', blockedWords: user.blockedWords },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating blocked words:', error);
    return Response.json(
      { success: false, message: 'Failed to update blocked words' },
      { status: 500 }
    );
  }
}

import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User';
import { messageSchema } from '@/schemas/messageSchema';
import { getClientIp, rateLimit } from '@/lib/rateLimit';

const URL_REGEX = /(https?:\/\/|www\.)\S+/i;
const REPEAT_CHAR_REGEX = /(.)\1{7,}/;

export async function POST(request: Request) {
  await dbConnect();

  try {
    const body = await request.json();
    const result = messageSchema.safeParse(body);

    if (!result.success) {
      return Response.json(
        { success: false, message: result.error.errors[0]?.message || 'Invalid input' },
        { status: 400 }
      );
    }

    const { content } = result.data;
    const { username } = body as { username?: string };

    if (!username) {
      return Response.json(
        { success: false, message: 'Username is required' },
        { status: 400 }
      );
    }

    const ip = getClientIp(request);
    const rateKey = `send:${ip}:${username}`;
    const rate = rateLimit(rateKey, 5, 60 * 1000);
    if (!rate.allowed) {
      return Response.json(
        { success: false, message: 'Too many requests. Please slow down.' },
        { status: 429 }
      );
    }

    const user = await UserModel.findOne({ username });

    if (!user) {
      return Response.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    if (!user.isAcceptingMessages) {
      return Response.json(
        { success: false, message: 'This user is not accepting messages' },
        { status: 403 }
      );
    }

    const blocked = user.blockedWords?.some((word) =>
      content.toLowerCase().includes(word.toLowerCase())
    );
    if (blocked) {
      return Response.json(
        { success: false, message: 'Message blocked by recipient filters' },
        { status: 403 }
      );
    }

    if (URL_REGEX.test(content) || REPEAT_CHAR_REGEX.test(content)) {
      return Response.json(
        { success: false, message: 'Message looks like spam' },
        { status: 400 }
      );
    }

    user.messages.push({ content, createAt: new Date() });
    await user.save();

    return Response.json(
      { success: true, message: 'Message sent successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error sending message:', error);
    return Response.json(
      { success: false, message: 'Failed to send message' },
      { status: 500 }
    );
  }
}

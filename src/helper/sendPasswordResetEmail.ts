import { resend } from '@/lib/resend';
import ResetPasswordEmail from '../../email/resetPasswordEmail';
import { ApiResponse } from '../types/ApiResponse';

export default async function sendPasswordResetEmail(
  email: string,
  username: string,
  resetCode: string
): Promise<ApiResponse> {
  try {
    const fromAddress = process.env.RESEND_FROM || 'onboarding@resend.dev';
    await resend.emails.send({
      from: fromAddress,
      to: email,
      subject: 'Reset your MaskMind password',
      react: ResetPasswordEmail({ username, otp: resetCode }),
    });

    return { success: true, message: 'Password reset email sent.' };
  } catch (emailError) {
    console.log('Error sending password reset email:', emailError);
    return { success: false, message: 'Failed to send password reset email.' };
  }
}

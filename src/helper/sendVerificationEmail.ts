import {resend} from '@/lib/resend';
import VerificationEmail from '../../email/verificationEmail';
import { ApiResponse} from "../types/ApiResponse";

export default async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string
): Promise<ApiResponse>{
    try{
        await resend.emails.send({
            from:'onboarding@resend.dev',
            to: email,
            subject: 'MaskMind Verification Code',
            react: VerificationEmail({username, otp: verifyCode}),
        });


        return{success: true, message: "verification email send successfully."};

    }catch(emaileError){
        console.log("Error sending verification email:", emaileError);
        return{success: false, message: "Failed to send verification email."};
    }
}
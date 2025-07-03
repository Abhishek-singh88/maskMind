import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User';
import bcrypt from 'bcryptjs';

import sendVerificationEmail from '@/helper/sendVerificationEmail';


export async function POST(request: Request) {
    await dbConnect();

    try{
        const {username,email,password} = await request.json();s

    }catch(error){
        console.error("Error Registering User:", error);
        return  Response.json({
            success: false,
            message: "Failed to register user."
        },
    {
            status: 500
    })
    }
}
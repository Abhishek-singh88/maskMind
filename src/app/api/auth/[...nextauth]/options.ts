import {NextAuthOptions} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnet from "@/lib/dbConnect";
import UserModel from "@/model/User";

export const authOptions:NextAuthOptions = {
    providers:[
        CredentialsProvider({
            id:"credentials",
            name:"Credentials",
            credentials:{
                    email: { label: "Email", type: "text" },
                    password: { label: "Password", type: "password" }
            },
            async authorize(credentials:any):Promise<any> {
                await dbConnet();
                try{
                    const user = await UserModel.findOne({
                        $or:[
                            {email:credentials.identifier},
                            {username:credentials.identifier},
                        ]
                    })
                    if(!user){
                        throw new Error("No user found with this username or email")
                    }

                     if(!user.isVerified){
                        throw new Error("Please verify your email before logging in");
                    }

                   const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password)

                    if(isPasswordCorrect){
                        return user;
                    }
                    else{
                        throw new Error("Incorrect Password");
                    }

                }catch(error:any){
                    throw new Error(error);

                }

            }
        })
    ], 
    callbacks:{
          async session({ session, token }) {
            if(token){
                session.user._id = token._id
            }
      return session
        },
        async jwt({ token, user}) {
            if(user){
                token._id = user._id?.toString()
                token.isVerified = user.isVerified
                token.isAcceptingMessage = user.isAcceptingMessage
                token.username = user.username
            }

      return token
        }
    },
    pages:{
        signIn: '/sign-in'
    },
    session:{
        strategy: "jwt"
    },
    secret:process.env.SECRET,

}
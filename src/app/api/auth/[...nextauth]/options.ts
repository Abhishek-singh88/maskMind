import {NextAuthOptions} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import dbConnet from "@/lib/dbConnect";
import UserModel from "@/model/User";

export const authOptions:NextAuthOptions = {
    providers:[
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || '',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || ''
        }),
        CredentialsProvider({
            id:"credentials",
            name:"Credentials",
            credentials:{
                    identifier: { label: "Email or Username", type: "text" },
                    password: { label: "Password", type: "password" }
            },
            async authorize(
                credentials: Record<"identifier" | "password", string> | undefined
            ):Promise<import("next-auth").User | null> {
                await dbConnet();
                try{
                    if(!credentials?.identifier || !credentials?.password){
                        throw new Error("Missing credentials");
                    }
                    const user = await UserModel.findOne({
                        $or:[
                            {email:credentials.identifier},
                            {username:credentials.identifier},
                        ]
                    })
                    if(!user){
                        throw new Error("No user found with this username or email")
                    }

                    if(user.authProvider !== 'credentials'){
                        throw new Error("Use Google sign in for this account");
                    }

                     if(!user.isVerified){
                        throw new Error("Please verify your email before logging in");
                    }

                   const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password)

                    if(isPasswordCorrect){
                        return user as unknown as import("next-auth").User;
                    }
                    else{
                        throw new Error("Incorrect Password");
                    }

                }catch(error: unknown){
                    const err = error instanceof Error ? error.message : "Login failed";
                    console.error("Authorize error:", err);
                    throw new Error(err);

                }

            }
        })
    ], 
    callbacks:{
          async signIn({ user, account }) {
            if (account?.provider !== 'google') return true;

            await dbConnet();

            const email = user.email;
            if (!email) return false;

            const existing = await UserModel.findOne({ email });
            if (existing) {
                if (!existing.isVerified) {
                    existing.isVerified = true;
                    await existing.save();
                }
                return true;
            }

            const baseUsername = email.split('@')[0]?.replace(/[^a-zA-Z0-9_]/g, '') || 'user';
            let username = baseUsername;
            let counter = 0;
            while (await UserModel.findOne({ username })) {
                counter += 1;
                username = `${baseUsername}${counter}`;
            }

            const newUser = new UserModel({
                username,
                email,
                password: '',
                verifyCode: '',
                verifyCodeExpiry: new Date(0),
                isVerified: true,
                isAcceptingMessages: true,
                authProvider: 'google',
                messages: []
            });
            await newUser.save();

            return true;
          },
          async session({ session, token }) {
            if(token){
                session.user._id = token._id
                session.user.isVerified = token.isVerified
                session.user.isAcceptingMessages = token.isAcceptingMessages
                session.user.username = token.username
            }
            return session
        },
        async jwt({ token, user}) {
            if(user){
                token._id = user._id?.toString()
                token.isVerified = user.isVerified
                token.isAcceptingMessages = user.isAcceptingMessages
                token.username = user.username
            }

            if(!token._id && token.email){
                await dbConnet();
                const dbUser = await UserModel.findOne({ email: token.email });
                if(dbUser){
                    token._id = dbUser._id?.toString();
                    token.isVerified = dbUser.isVerified;
                    token.isAcceptingMessages = dbUser.isAcceptingMessages;
                    token.username = dbUser.username;
                }
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

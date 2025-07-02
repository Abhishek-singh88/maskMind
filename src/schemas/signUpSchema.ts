import {z} from 'zod';

export const usernameValidation = z
    .string()
    .min(4,"Username must be atleast 4 characters long")
    .max(20, "Username must be at most 20 characters long")
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores");

export const signUpSchema = z.object({
    username: usernameValidation,
    email: z.string().email({message: "Invalid email address"}).min(1, "Email is required"),
    password: z.string().min(6,{message: "password must be atleast 6 characters"})
})    



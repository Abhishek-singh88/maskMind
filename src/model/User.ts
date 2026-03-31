import mongoose,{Schema, Document} from 'mongoose';

export interface Message extends Document {
    content: string,
    createAt: Date
}

const MessageSchema: Schema<Message> = new Schema({
    content :{
        type: String,
        required: true
    }
    ,
    createAt: {
        type: Date,
        default: Date.now
    }
})

export interface User extends Document {
    username: string,
    email: string,
    password: string,
    verifyCode: string,
    verifyCodeExpiry: Date,
    isVerified : boolean,
    isAcceptingMessages: boolean,
    authProvider: 'credentials' | 'google',
    resetPasswordCode?: string,
    resetPasswordExpiry?: Date,
    blockedWords: string[],
    messages: Message[]
}

const UserSchema: Schema<User> = new Schema({
    username: {
        type: String,
        required: [true,"Username is required"],
        unique: true,
        trim:true,
    },
    email: {
        type: String,
        required: [true,"Email is required"],
        unique: true,
        match: [/.+\@.+\..+/, 'Please enter a valid email address'],
    },
    password: {
        type: String,
        required: [function (this: User) { return this.authProvider === 'credentials'; }, "Password is required"],
    },
    verifyCode: {
        type: String,
        required: [function (this: User) { return !this.isVerified; }, "Verification code is required"],
    },
    verifyCodeExpiry: {
        type: Date,
        required: [function (this: User) { return !this.isVerified; }, "Verification code expiry is required"],
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isAcceptingMessages: {
        type: Boolean,
        default: true
    },
    authProvider: {
        type: String,
        enum: ['credentials', 'google'],
        default: 'credentials'
    },
    resetPasswordCode: {
        type: String,
        required: false,
    },
    resetPasswordExpiry: {
        type: Date,
        required: false,
    },
    blockedWords: {
        type: [String],
        default: []
    },
    messages: [MessageSchema]
    
});

const UserModel = (mongoose.models.User as mongoose.Model<User> || mongoose.model<User>('User', UserSchema));

export default UserModel;

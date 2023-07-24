import mongoose, {Model, Document} from "mongoose";

export interface IUser {
    email: string;
    password: string
}

const UserSchema = new mongoose.Schema <IUser> (
    {
        email: {
            type: String,
            unique: true,
            lowercase: true
        },
        password: {
            type: String,
        }
    }
)

export const UserModel: Model<IUser> = mongoose.model<IUser>('pwdUsers', UserSchema); 


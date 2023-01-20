import mongoose, { Date, Document, Model } from "mongoose";
import { customError } from "../utils/customError";

export interface IUser {
    username: string;
    email: string;
    password:string;
    image?: string;
    subscribers?: number;
    subscribedUsers?: Array<string>;

}

export interface IUserDoc extends IUser, Document{}

export interface IUserLeanDoc extends IUser {
    _id: mongoose.Types.ObjectId,
}

const userSchema = new mongoose.Schema<IUser>({
    username: {
        required: true,
        type: String,
        unique: true
    },
    email: {
        required: true,
        type: String,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    image: {
        type: String,
    },
    subscribers: {
        type: Number,
        default: 0,
    },
    subscribedUsers: {
        type: [String],
        default: []
    }
}, {
    timestamps: true
})


const userModel= mongoose.model<IUserDoc>("User", userSchema);
export default userModel
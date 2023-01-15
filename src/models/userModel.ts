import mongoose, { Model } from "mongoose";

interface IUser {
    username: string;
    email: string;
    password:string;
    image: string;
    subscribers: number;
    subscribedUsers: Array<string>;

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

const userModel: Model<IUser> = mongoose.model("User", userSchema);
export default userModel
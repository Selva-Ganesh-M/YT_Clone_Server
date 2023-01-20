import mongoose, { Document } from "mongoose";
import { IUser } from "./userModel";

export interface IVideo {
    title: string
    desc: string
    imgUrl: string
    videoUrl: string
    views: number
    tags: Array<string>
    likes: Array<string>
    dislikes: Array<string>
    userId: string;
  }

export interface IVideoDoc extends IVideo, Document{}

export interface IVideoLeanDoc extends IUser{
  _id: string
}
  
const VideoSchema = new mongoose.Schema<IVideo>(
  {
      userId: {
        type: String,
        required: true,
      },
      title: {
        type: String,
        required: true,
      },
      desc: {
        type: String,
        required: true,
      },
      imgUrl: {
        type: String,
        required: true,
      },
      videoUrl: {
        type: String,
        required: true,
      },
      views: {
        type: Number,
        default: 0,
      },
      tags: {
        type: [String],
        default: [],
      },
      likes: {
        type: [String],
        default: [],
      },
      dislikes: {
        type: [String],
        default: [],
      },
  },
  { timestamps: true }
);

const videoModel = mongoose.model<mongoose.Schema<IVideo>>("Video", VideoSchema)

export default videoModel

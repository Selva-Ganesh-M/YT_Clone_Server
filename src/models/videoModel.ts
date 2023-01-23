import mongoose, { Document } from "mongoose";

export interface IVideo {
    userId: string;
    title: string
    desc: string
    imgUrl: string
    videoUrl: string
    views: number
    tags: Array<string>
    likes: Array<string>
    dislikes: Array<string>
  }

export interface IVideoDoc extends IVideo, Document{}

export interface IVideoLeanDoc extends IVideo{
  _id: mongoose.Types.ObjectId
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

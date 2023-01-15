import mongoose from "mongoose";

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

const VideoSchema = new mongoose.Schema<IVideo>(
  {
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
    userId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const videoModel = mongoose.model<mongoose.Schema<IVideo>>("Video", VideoSchema)

export default videoModel

import mongoose from "mongoose"

export interface IComment {
    content: string
    userId: string
    videoId: string
}

const commentSchema = new mongoose.Schema<IComment>({
    content: {
        type: String,
        required: true,
    },
    userId: {
        require: true,
        type: String
    },
    videoId: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})

const commentModel = mongoose.model<mongoose.Schema<IComment>>("Comment", commentSchema)

export default commentModel;
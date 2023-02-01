import { Request, response, Response } from "express"
import asyncHandler from "express-async-handler"
import commentModel, { IComment } from "../models/commentModel";
import videoModel from "../models/videoModel";
import { customError } from "../utils/customError";
import hasPrivilege from "../utils/hasPrivilege";
import { commentSchema } from "../validationSchemas/comment.schema";


// adding a new comment
const addAComment = asyncHandler(
    async (req: Request<{id:string},{},{content: string}>, res:Response) => {
        const self = req.user!;
        
        // checking if video exists
        const {id: videoId} = req.params;
        const video = await videoModel.findById(videoId).lean();
        if (!video) throw new customError(404, "commenting failed: requested video not found.")

        // creating new comment
        const comment = new commentModel({
            content: req.body.content,
            userId: self._id,
            videoId,
        })
        const savedComment = await comment.save()
        if (!savedComment) throw new customError(500, "commenting failed: adding new comment to mongoose failed.")

        // response
        res.status(201).json({
        status:"success",
        message: "comment created",
        payload: savedComment
        })
    }
)


// deleting a comment
const deleteComment = asyncHandler(
    async (req: Request<{id: string}>, res:Response) => {
        const user = req.user!

        // if comment exists
        const {id: commentId} = req.params;
        const comment = await commentModel.findById(commentId).lean();
        if (!comment) throw new customError(404, "comment delete failed: requested comment not found");


        // checking if operation is possible
        hasPrivilege(user._id.toString(), comment.userId.toString());

        // deleting comment
        const deletedComment = await commentModel.findByIdAndDelete(commentId);
        if (!deletedComment) throw new customError(500, "comment deletion failed: mongoose delete request returned null")

        // response
        res.status(200).json({
        status:"success",
        message: "comment is deleted.",
        payload: deletedComment
        })

    }
)


// updating a comment
const updateComment = asyncHandler(
    async (req: Request<{id: string}, {}, IComment>, res:Response) => {
        const user = req.user!

        // if comment exists
        const {id: commentId} = req.params;
        const comment = await commentModel.findById(commentId).lean();
        if (!comment) throw new customError(404, "comment update failed: requested comment not found");


        // checking if operation is possible
        hasPrivilege(user._id.toString(), comment.userId.toString());

        // updating comment
        const updatedComment = await commentModel.findByIdAndUpdate(
            commentId,
            {
                $set: req.body
            },
            {
                new: true
            }
            );
        if (!updatedComment) throw new customError(500, "comment updating failed: mongoose update request returned null")

        // response
        res.status(200).json({
        status:"success",
        message: "comment is updated.",
        payload: updatedComment
        })

    }
)

// get all comments
const getAllComments = asyncHandler(
    async (req: Request<{id:string}>, res: Response) => {
        const videoId = req.params.id
        
        // check if video exists
        const video = await videoModel.findById(videoId).lean()
        if (!video) throw new customError(404, "fetch comments failed: requested video not found");

        // get comments
        const comments = await commentModel.find({videoId}).lean();
        
        // response
        res.status(200).json({
        status:"success",
        message: comments.length? "comments feched.": "no comments are recorded for this video",
        payload: comments,
        })
    }
)


export const commentCtrl = {
    addAComment, deleteComment, getAllComments, updateComment
}
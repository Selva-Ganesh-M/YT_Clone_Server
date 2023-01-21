import { Request, Response } from "express"
import asyncHandler from "express-async-handler"
import videoModel from "../models/videoModel"
import { customError } from "../utils/customError"
import hasPrivilege from "../utils/hasPrivilege"

// get a video

const getAVideo = asyncHandler (
    async (req: Request, res: Response) => {

    }
)


// create video

type TCVbody = {
    title: string,
    desc: string,
    imgUrl: string,
    videoUrl: string,
}
const createVideo = asyncHandler(
   async (req: Request<{id: string}, {}, TCVbody>, res:Response) => {
    const self = req.user!;
    const video = new videoModel({userId: self._id, ...req.body })
    const createdVideo =  await video.save();
    res.status(201).json({
        status: "success",
        message: "new video created.",
        payload: createdVideo
    })
   }
)

// update video
export type TUpdateVideo = {
    title?:string,
    desc?:string,
    imgUrl?:string,
    videoUrl?:string,
}
const updateVideo = asyncHandler(
    async (req:Request<{id:string}, {}, TUpdateVideo>, res:Response) => {
        const self = req.user!
        const videoId = req.params.id

        // check if the video exists
        const videoLean = await videoModel.findById(videoId).lean()
        if (!videoLean) throw new customError(404, "udpate failed: requested video not found.")
        
        // check if allowed to perform this action
        hasPrivilege(self._id.toString(), videoLean.userId.toString())

        // update the user
        const updatedVideo = await videoModel.findOneAndUpdate({_id:videoId}, {$set: req.body}, {new: true}).lean()

        if (!updatedVideo) throw new customError(500, "update failed: Error occured when tried to update data at mongoose db.")

        // send the response
        res.status(200).json({
            status: "success",
            message: "video update successful.",
            payload: updatedVideo
        })

    }
)


export const videoController = {
    createVideo,
    updateVideo
}
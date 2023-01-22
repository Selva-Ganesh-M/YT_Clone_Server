import { Request, Response } from "express"
import asyncHandler from "express-async-handler"
import videoModel from "../models/videoModel"
import { customError } from "../utils/customError"
import hasPrivilege from "../utils/hasPrivilege"

// get a video
const getAVideo = asyncHandler (
    async (req: Request<{id: string}>, res: Response) => {
        const {id} = req.params
        const video = await videoModel.findById(id)
        if (!video) throw new customError(404, "get a video failed: requested video not found.")
        
        res.status(200).json({
            status: "success",
            message: "resource attached as payload",
            payload: video
        })
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


// delete a video
const deleteVideo = asyncHandler(
async (req: Request<{id: string}>, res:Response) => {
    const {id: videoId} = req.params
    const self = req.user!

    // check if video exits
    const video = await videoModel.findById(videoId).lean();
    if (!video) throw new customError(404, "video deletion failed: requested video not found.")

    // does user has previlage?
    hasPrivilege(self._id.toString(), video.userId);

    // deletion operation
    const deletedVideo = await videoModel.findByIdAndDelete(videoId).lean()
    if (!deletedVideo) throw new customError(500, "video deletion failed: mongoose deletion failed.")

    // response
    res.status(200).json({
    status:"success",
    message: "video deleted succesfully",
    payload: deletedVideo
    })

}
)


// get random videos
const getRandomVids = asyncHandler(
    async (req: Request, res:Response) => {

        // fetch videos
        const videos = await videoModel.aggregate([{$sample: {size: 40}}])
        if (!videos) throw new customError(500, "fetching random videos failed: No videos in the database.")

        // response
        res.status(200).json({
        status:"success",
        message: "fetched random videos",
        payload: videos
        })
    }
    )

// view a video
const incViewOfVideo = asyncHandler(
async (req: Request<{id: string}>, res:Response) => {
    const{id: videoId} = req.params;

    // is video exists
    const video = await videoModel.findById(videoId).lean();
    if (!video) throw new customError(404, "view increase failed: requested video not found.")

    // increment view count
    const updatedVideo = await videoModel.findByIdAndUpdate(videoId, {
        $inc: {
            views: 1
        }
    },{
        new: true
    })
    if (!updatedVideo) throw new customError(500, "increment view failed: mongoose returned null")

    // response
    res.status(200).json({
    status:"success",
    message: "view count increased",
    payload: updatedVideo
    })
}
)


// search
const searchVideo = asyncHandler(
async (req: Request<{},{},{},{src: string}>, res:Response) => {
    const {src} = req.query

    // find matching videos
    const videos = await videoModel.find({
        title: {
            $regex:src,
            $options: "i",
        }
    }).limit(40).lean();

    // if no videos send
    if (!videos) {
        res.status(200).json({
        status:"success",
        message: "found no videos related to the search query",
        payload: []
        })
    }

    // response
    res.status(200).json({
    status:"success",
    message: "fetch successful",
    payload: videos
    })
    
}
)

// subscribed users videos
const subscribedUsersVideo = asyncHandler(
    async (req: Request, res:Response) => {
        const self = req.user!;

        // get videos from subscribedUsers
        const videos = await Promise.all(
            self.subscribedUsers!.map(id=>{
                return videoModel.find({
                    userId: id
                })
            })
        )

        // response
        res.status(200).json({
        status:"success",
        message: videos ? "videos fetch successful": "no videos from subscribed users.",
        payload: videos ? videos : []
        })
    }
    )

// filter by tags
const searchByTags = asyncHandler(
    async (req: Request, res:Response) => {
        
    }
    )

// get trend vids
const trendVideos = asyncHandler(
    async (req: Request, res:Response) => {
        
    }
    )



// all exports
export const videoController = {
    createVideo,
    updateVideo,
    getAVideo,
    deleteVideo,
    getRandomVids,
    incViewOfVideo,
    searchVideo,
    subscribedUsersVideo,
    searchByTags,
    trendVideos,
}
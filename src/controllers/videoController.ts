import { Request, Response } from "express"
import asyncHandler from "express-async-handler"
import { LeanDocument } from "mongoose"
import commentModel from "../models/commentModel"
import videoModel, { IVideo, IVideoLeanDoc } from "../models/videoModel"
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

    // delete respective comments
    const deletedComments = await commentModel.deleteMany({
        videoId
    })
    if (!deletedComments) throw new customError(500, "video deletion partially failed: video deleted but comments not deleted. mongoose returned null.")

    // response
    res.status(200).json({
    status:"success",
    message: "video deleted succesfully",
    payload: {deletedVideo, deletedComments}
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
        
        // "Promise.all" returns an array and "map" returns and array as well,
        // so we're looking at something like 
        // [
        //     [
        //         {
        //             item: 1
        //         },
        //         {
        //             item: 2
        //         },
        //     ]
        // ]
        // so, we have to erase the outer array
        const payload = videos.flat()

        // response
        res.status(200).json({
        status:"success",
        message: payload.length ? "videos fetch successful": "no videos from subscribed users.",
        payload: payload
        })
    }
    )

// filter by tags
const searchByTags = asyncHandler(
    async (req: Request<{},{},{},{tags:string}>, res:Response) => {
        const tags = req.query.tags.split(",")
        const videos = await videoModel.find({
            tags: {
                $in: tags
            }
        })

        // response
        res.status(200).json({
            status:"success",
            message: videos.length ? "videos fetch successful": "no videos matching the tags found.",
            payload: videos
            })

    }
    )

// get trend vids
const trendVideos = asyncHandler(
    async (req: Request, res:Response) => {

        // fetching
        const videos = await videoModel.find().lean().sort({views: -1})
        
        // response
        res.status(200).json({
        status:"success",
        message: videos.length ? "fetched trending videos" : "no trending videos found",
        payload: videos
        })
    }
    )


// like video
const likeVideo = asyncHandler(
    async (req: Request<{id: string}>, res:Response) => {
        const {id: videoId} = req.params;
        const self = req.user!;

        // check if video exists
        const video = await videoModel.findById(videoId).lean();
        if (!video) throw new customError(404, "like operation failed: video not found")

        // prep response  
        let response: IVideoLeanDoc;
        response = await videoModel.findByIdAndUpdate(videoId, {
                $addToSet: {
                    likes: self._id
                },
                $pull: {
                    dislikes: self._id
                }
        }, {new: true}).lean()

        if (!response) throw new customError(500, "like op failed: mongoose returned null.")

        // response
        res.status(200).json({
        status:"success",
        message: "liked a video",
        payload: response
        })
    }
)


// dislike a video

const dislike = asyncHandler(
    async (req: Request<{id:string}>, res:Response) => {
        const self = req.user!;
        const videoId = req.params.id;

        // check if video exists
        const video = await videoModel.findById(videoId).lean();
        if (!video) throw new customError(404, "dislike op failed: requested video not found.");

        // update db
        const updatedVideo = await videoModel.findByIdAndUpdate(videoId, {
            // remove from likes
            $pull: {likes:self._id},
            // append to dislikes
            $addToSet: {dislikes:self._id}
        })

        if (!updatedVideo) throw new customError(500, "dislike failed: mongoose returned null");

        // send response
        res.status(200).json({
        status:"success",
        message: "dislike successful",
        payload: updatedVideo
        })
    }
)

// const 

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
    likeVideo,
    dislike
}
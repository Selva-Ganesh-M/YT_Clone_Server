import mongoose from "mongoose";
import { string, z } from "zod";
import { IVideoDoc, IVideoLeanDoc } from "../models/videoModel";
import { paramsMongooseIdCheck } from "./userSchema";


// get a video schema

// const getAVideoSchema = paramsMongooseIdCheck
const getAVideoSchema = z.object({
    params: z.object({
        id: z.string().refine((id)=>{
            if(!mongoose.isValidObjectId(id)){
                console.log({message: `not a valid mongoose id: ${id}`});
                return false
            }
            return true

        }, {
            message: `not a valid mongoose id`
        })
    })
})



// create video schema '''''''''''''
type T_cvSchema_body = {
    title: z.ZodString,
    desc: z.ZodString,
    imgUrl: z.ZodString,
    videoUrl: z.ZodString,
}

const createVideoSchema = z.object({
    body: z.object<T_cvSchema_body>({
        title: z.string({
            required_error: "title is required."
        }),
        desc: z.string({
            required_error: "desc is required."
        }),
        imgUrl: z.string({
            required_error: "imgUrl is required."
        }).url("please enter a valid image url"),
        videoUrl: z.string({
            required_error: "videoUrl is required."
        }).url("please enter a valid video url"),
    })
})



// update video schema '''''''''''''''
const updateVideoSchema = paramsMongooseIdCheck.extend({
    body: z.object({
        title: z.string({
            required_error: "title is required."
        }).optional(),
        desc: z.string({
            required_error: "desc is required."
        }).optional(),
        imgUrl: z.string({
            required_error: "imgUrl is required."
        })
        .url("please enter a valid image url")
        .optional(),
        videoUrl: z.string({
            required_error: "videoUrl is required."
        })
        .url("please enter a valid video url")
        .optional(),
    })
})

// delete a video
const deleterUserSchema = paramsMongooseIdCheck

// view a video
const viewAVideoSchema = paramsMongooseIdCheck

// get trend videos
const trendVideosSchema = paramsMongooseIdCheck

// getVideosByTagsSchema
const getVideosByTagsSchema = z.object({
    query: z.object({
        tags: string({required_error: "tags must be mentioned in the query string"}).refine(
            (data)=>{
                if(!data.length) return false
                return true
            },{
                message: "tags in query string can't be empty."
            }
        )
    })
})

// search functionality
const searchVideo = z.object({
    query: z.object({
        src: string({required_error: "query paramameter must have src attribute"}).refine(
            (src)=>{
                if (!src.length) return false
                return true
            },
            {
                message: "src attribute in query parameter can't by empty"
            }
        )
    })
})


export const videoSchema = {
    createVideoSchema,
    updateVideoSchema,
    getAVideoSchema,
    deleterUserSchema,
    viewAVideoSchema,
    trendVideosSchema,
    getVideosByTagsSchema,
    searchVideo
}
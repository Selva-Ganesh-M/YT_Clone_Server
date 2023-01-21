import { z } from "zod";
import { IVideoDoc, IVideoLeanDoc } from "../models/videoModel";
import { paramsMongooseIdCheck } from "./userSchema";


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

const getvideoSchema = paramsMongooseIdCheck

export const videoSchema = {
    createVideoSchema,
    updateVideoSchema,
    getvideoSchema
}
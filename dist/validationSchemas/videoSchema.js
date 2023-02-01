"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.videoSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const zod_1 = require("zod");
const userSchema_1 = require("./userSchema");
// get a video schema
// const getAVideoSchema = paramsMongooseIdCheck
const getAVideoSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().refine((id) => {
            if (!mongoose_1.default.isValidObjectId(id)) {
                console.log({ message: `not a valid mongoose id: ${id}` });
                return false;
            }
            return true;
        }, {
            message: `not a valid mongoose id`
        })
    })
});
const createVideoSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string({
            required_error: "title is required."
        }),
        desc: zod_1.z.string({
            required_error: "desc is required."
        }),
        imgUrl: zod_1.z.string({
            required_error: "imgUrl is required."
        }).url("please enter a valid image url"),
        videoUrl: zod_1.z.string({
            required_error: "videoUrl is required."
        }).url("please enter a valid video url"),
    })
});
// update video schema '''''''''''''''
const updateVideoSchema = userSchema_1.paramsMongooseIdCheck.extend({
    body: zod_1.z.object({
        title: zod_1.z.string({
            required_error: "title is required."
        }).optional(),
        desc: zod_1.z.string({
            required_error: "desc is required."
        }).optional(),
        imgUrl: zod_1.z.string({
            required_error: "imgUrl is required."
        })
            .url("please enter a valid image url")
            .optional(),
        videoUrl: zod_1.z.string({
            required_error: "videoUrl is required."
        })
            .url("please enter a valid video url")
            .optional(),
    })
});
// delete a video
const deleterUserSchema = userSchema_1.paramsMongooseIdCheck;
// view a video
const viewAVideoSchema = userSchema_1.paramsMongooseIdCheck;
// get trend videos
const trendVideosSchema = userSchema_1.paramsMongooseIdCheck;
// getVideosByTagsSchema
const getVideosByTagsSchema = zod_1.z.object({
    query: zod_1.z.object({
        tags: (0, zod_1.string)({ required_error: "tags must be mentioned in the query string" }).refine((data) => {
            if (!data.length)
                return false;
            return true;
        }, {
            message: "tags in query string can't be empty."
        })
    })
});
// search functionality
const searchVideo = zod_1.z.object({
    query: zod_1.z.object({
        src: (0, zod_1.string)({ required_error: "query paramameter must have src attribute" }).refine((src) => {
            if (!src.length)
                return false;
            return true;
        }, {
            message: "src attribute in query parameter can't by empty"
        })
    })
});
// like a video
const likeAVideoSchema = userSchema_1.paramsMongooseIdCheck;
exports.videoSchema = {
    createVideoSchema,
    updateVideoSchema,
    getAVideoSchema,
    deleterUserSchema,
    viewAVideoSchema,
    trendVideosSchema,
    getVideosByTagsSchema,
    searchVideo,
    likeAVideoSchema
};

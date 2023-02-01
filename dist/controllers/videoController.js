"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.videoController = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const commentModel_1 = __importDefault(require("../models/commentModel"));
const videoModel_1 = __importDefault(require("../models/videoModel"));
const customError_1 = require("../utils/customError");
const hasPrivilege_1 = __importDefault(require("../utils/hasPrivilege"));
// get a video
const getAVideo = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const video = yield videoModel_1.default.findById(id);
    if (!video)
        throw new customError_1.customError(404, "get a video failed: requested video not found.");
    res.status(200).json({
        status: "success",
        message: "resource attached as payload",
        payload: video
    });
}));
const createVideo = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const self = req.user;
    const video = new videoModel_1.default(Object.assign({ userId: self._id }, req.body));
    const createdVideo = yield video.save();
    res.status(201).json({
        status: "success",
        message: "new video created.",
        payload: createdVideo
    });
}));
const updateVideo = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const self = req.user;
    const videoId = req.params.id;
    // check if the video exists
    const videoLean = yield videoModel_1.default.findById(videoId).lean();
    if (!videoLean)
        throw new customError_1.customError(404, "udpate failed: requested video not found.");
    // check if allowed to perform this action
    (0, hasPrivilege_1.default)(self._id.toString(), videoLean.userId.toString());
    // update the user
    const updatedVideo = yield videoModel_1.default.findOneAndUpdate({ _id: videoId }, { $set: req.body }, { new: true }).lean();
    if (!updatedVideo)
        throw new customError_1.customError(500, "update failed: Error occured when tried to update data at mongoose db.");
    // send the response
    res.status(200).json({
        status: "success",
        message: "video update successful.",
        payload: updatedVideo
    });
}));
// delete a video
const deleteVideo = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: videoId } = req.params;
    const self = req.user;
    // check if video exits
    const video = yield videoModel_1.default.findById(videoId).lean();
    if (!video)
        throw new customError_1.customError(404, "video deletion failed: requested video not found.");
    // does user has previlage?
    (0, hasPrivilege_1.default)(self._id.toString(), video.userId);
    // deletion operation
    const deletedVideo = yield videoModel_1.default.findByIdAndDelete(videoId).lean();
    if (!deletedVideo)
        throw new customError_1.customError(500, "video deletion failed: mongoose deletion failed.");
    // delete respective comments
    const deletedComments = yield commentModel_1.default.deleteMany({
        videoId
    });
    if (!deletedComments)
        throw new customError_1.customError(500, "video deletion partially failed: video deleted but comments not deleted. mongoose returned null.");
    // response
    res.status(200).json({
        status: "success",
        message: "video deleted succesfully",
        payload: { deletedVideo, deletedComments }
    });
}));
// get random videos
const getRandomVids = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // fetch videos
    const videos = yield videoModel_1.default.aggregate([{ $sample: { size: 40 } }]);
    if (!videos)
        throw new customError_1.customError(500, "fetching random videos failed: No videos in the database.");
    // response
    res.status(200).json({
        status: "success",
        message: "fetched random videos",
        payload: videos
    });
}));
// view a video
const incViewOfVideo = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: videoId } = req.params;
    // is video exists
    const video = yield videoModel_1.default.findById(videoId).lean();
    if (!video)
        throw new customError_1.customError(404, "view increase failed: requested video not found.");
    // increment view count
    const updatedVideo = yield videoModel_1.default.findByIdAndUpdate(videoId, {
        $inc: {
            views: 1
        }
    }, {
        new: true
    });
    if (!updatedVideo)
        throw new customError_1.customError(500, "increment view failed: mongoose returned null");
    // response
    res.status(200).json({
        status: "success",
        message: "view count increased",
        payload: updatedVideo
    });
}));
// search
const searchVideo = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { src } = req.query;
    // find matching videos
    const videos = yield videoModel_1.default.find({
        title: {
            $regex: src,
            $options: "i",
        }
    }).limit(40).lean();
    // if no videos send
    if (!videos) {
        res.status(200).json({
            status: "success",
            message: "found no videos related to the search query",
            payload: []
        });
    }
    // response
    res.status(200).json({
        status: "success",
        message: "fetch successful",
        payload: videos
    });
}));
// subscribed users videos
const subscribedUsersVideo = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const self = req.user;
    // get videos from subscribedUsers
    const videos = yield Promise.all(self.subscribedUsers.map(id => {
        return videoModel_1.default.find({
            userId: id
        });
    }));
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
    const payload = videos.flat();
    // response
    res.status(200).json({
        status: "success",
        message: payload.length ? "videos fetch successful" : "no videos from subscribed users.",
        payload: payload
    });
}));
// filter by tags
const searchByTags = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const tags = req.query.tags.split(",");
    const videos = yield videoModel_1.default.find({
        tags: {
            $in: tags
        }
    });
    // response
    res.status(200).json({
        status: "success",
        message: videos.length ? "videos fetch successful" : "no videos matching the tags found.",
        payload: videos
    });
}));
// get trend vids
const trendVideos = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // fetching
    const videos = yield videoModel_1.default.find().lean().sort({ views: -1 });
    // response
    res.status(200).json({
        status: "success",
        message: videos.length ? "fetched trending videos" : "no trending videos found",
        payload: videos
    });
}));
// like video
const likeVideo = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: videoId } = req.params;
    const self = req.user;
    // check if video exists
    const video = yield videoModel_1.default.findById(videoId).lean();
    if (!video)
        throw new customError_1.customError(404, "like operation failed: video not found");
    // prep response  
    let response;
    response = yield videoModel_1.default.findByIdAndUpdate(videoId, {
        $addToSet: {
            likes: self._id
        },
        $pull: {
            dislikes: self._id
        }
    }, { new: true }).lean();
    if (!response)
        throw new customError_1.customError(500, "like op failed: mongoose returned null.");
    // response
    res.status(200).json({
        status: "success",
        message: "liked a video",
        payload: response
    });
}));
// dislike a video
const dislike = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const self = req.user;
    const videoId = req.params.id;
    // check if video exists
    const video = yield videoModel_1.default.findById(videoId).lean();
    if (!video)
        throw new customError_1.customError(404, "dislike op failed: requested video not found.");
    // update db
    const updatedVideo = yield videoModel_1.default.findByIdAndUpdate(videoId, {
        // remove from likes
        $pull: { likes: self._id },
        // append to dislikes
        $addToSet: { dislikes: self._id }
    });
    if (!updatedVideo)
        throw new customError_1.customError(500, "dislike failed: mongoose returned null");
    // send response
    res.status(200).json({
        status: "success",
        message: "dislike successful",
        payload: updatedVideo
    });
}));
// all exports
exports.videoController = {
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
};

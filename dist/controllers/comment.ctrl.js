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
exports.commentCtrl = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const commentModel_1 = __importDefault(require("../models/commentModel"));
const videoModel_1 = __importDefault(require("../models/videoModel"));
const customError_1 = require("../utils/customError");
const hasPrivilege_1 = __importDefault(require("../utils/hasPrivilege"));
// adding a new comment
const addAComment = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const self = req.user;
    // checking if video exists
    const { id: videoId } = req.params;
    const video = yield videoModel_1.default.findById(videoId).lean();
    if (!video)
        throw new customError_1.customError(404, "commenting failed: requested video not found.");
    // creating new comment
    const comment = new commentModel_1.default({
        content: req.body.content,
        userId: self._id,
        videoId,
    });
    const savedComment = yield comment.save();
    if (!savedComment)
        throw new customError_1.customError(500, "commenting failed: adding new comment to mongoose failed.");
    // response
    res.status(201).json({
        status: "success",
        message: "comment created",
        payload: savedComment
    });
}));
// deleting a comment
const deleteComment = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    // if comment exists
    const { id: commentId } = req.params;
    const comment = yield commentModel_1.default.findById(commentId).lean();
    if (!comment)
        throw new customError_1.customError(404, "comment delete failed: requested comment not found");
    // checking if operation is possible
    (0, hasPrivilege_1.default)(user._id.toString(), comment.userId.toString());
    // deleting comment
    const deletedComment = yield commentModel_1.default.findByIdAndDelete(commentId);
    if (!deletedComment)
        throw new customError_1.customError(500, "comment deletion failed: mongoose delete request returned null");
    // response
    res.status(200).json({
        status: "success",
        message: "comment is deleted.",
        payload: deletedComment
    });
}));
// updating a comment
const updateComment = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    // if comment exists
    const { id: commentId } = req.params;
    const comment = yield commentModel_1.default.findById(commentId).lean();
    if (!comment)
        throw new customError_1.customError(404, "comment update failed: requested comment not found");
    // checking if operation is possible
    (0, hasPrivilege_1.default)(user._id.toString(), comment.userId.toString());
    // updating comment
    const updatedComment = yield commentModel_1.default.findByIdAndUpdate(commentId, {
        $set: req.body
    }, {
        new: true
    });
    if (!updatedComment)
        throw new customError_1.customError(500, "comment updating failed: mongoose update request returned null");
    // response
    res.status(200).json({
        status: "success",
        message: "comment is updated.",
        payload: updatedComment
    });
}));
// get all comments
const getAllComments = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const videoId = req.params.id;
    // check if video exists
    const video = yield videoModel_1.default.findById(videoId).lean();
    if (!video)
        throw new customError_1.customError(404, "fetch comments failed: requested video not found");
    // get comments
    const comments = yield commentModel_1.default.find({ videoId }).lean();
    // response
    res.status(200).json({
        status: "success",
        message: comments.length ? "comments feched." : "no comments are recorded for this video",
        payload: comments,
    });
}));
exports.commentCtrl = {
    addAComment, deleteComment, getAllComments, updateComment
};

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentSchema = void 0;
const zod_1 = require("zod");
const userSchema_1 = require("./userSchema");
// adding new comment
const addNewCommentSchema = userSchema_1.paramsMongooseIdCheck.extend({
    body: zod_1.z.object({
        content: (0, zod_1.string)({
            required_error: "comment content is missing/empty."
        })
    })
});
// updating new comment
const updateComment = addNewCommentSchema;
// deleting a comment
const deleteAComment = userSchema_1.paramsMongooseIdCheck;
// getAllComments
const getAllComments = userSchema_1.paramsMongooseIdCheck;
exports.commentSchema = {
    addNewCommentSchema,
    deleteAComment,
    getAllComments,
    updateComment
};

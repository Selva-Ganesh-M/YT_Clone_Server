import { string, z } from "zod";
import { paramsMongooseIdCheck } from "./userSchema";


// adding new comment
const addNewCommentSchema = paramsMongooseIdCheck.extend({
    body: z.object({
        content: string({
            required_error: "comment content is missing/empty."
        })
    })
})

// updating new comment
const updateComment = addNewCommentSchema

// deleting a comment
const deleteAComment = paramsMongooseIdCheck

// getAllComments
const getAllComments = paramsMongooseIdCheck

export const commentSchema = {
    addNewCommentSchema,
    deleteAComment,
    getAllComments,
    updateComment
}
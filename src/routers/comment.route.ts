import express from "express"
import { commentCtrl } from "../controllers/comment.ctrl"
import { authorization } from "../middlewares/authorization"
import { validator } from "../middlewares/validation/auth.validation"
import { commentSchema } from "../validationSchemas/comment.schema"

const router = express.Router()


router
    .route("/:id")
        // get All Comments
        .get(
            validator(commentSchema.getAllComments), 
            commentCtrl.getAllComments
            ) 
        // add a new comment
        .post(
            authorization,
            validator(commentSchema.addNewCommentSchema), 
            commentCtrl.addAComment
            )
        // add a new comment
        .put(
            authorization,
            validator(commentSchema.updateComment), 
            commentCtrl.updateComment
            )
        // delete a comment
        .delete(
            authorization,
            validator(commentSchema.deleteAComment), 
            commentCtrl.deleteComment
            )


const commentsRouter = router
export default commentsRouter
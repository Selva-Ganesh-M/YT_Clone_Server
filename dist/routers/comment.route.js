"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const comment_ctrl_1 = require("../controllers/comment.ctrl");
const authorization_1 = require("../middlewares/authorization");
const auth_validation_1 = require("../middlewares/validation/auth.validation");
const comment_schema_1 = require("../validationSchemas/comment.schema");
const router = express_1.default.Router();
router
    .route("/:id")
    // get All Comments
    .get((0, auth_validation_1.validator)(comment_schema_1.commentSchema.getAllComments), comment_ctrl_1.commentCtrl.getAllComments)
    // add a new comment
    .post(authorization_1.authorization, (0, auth_validation_1.validator)(comment_schema_1.commentSchema.addNewCommentSchema), comment_ctrl_1.commentCtrl.addAComment)
    // add a new comment
    .put(authorization_1.authorization, (0, auth_validation_1.validator)(comment_schema_1.commentSchema.updateComment), comment_ctrl_1.commentCtrl.updateComment)
    // delete a comment
    .delete(authorization_1.authorization, (0, auth_validation_1.validator)(comment_schema_1.commentSchema.deleteAComment), comment_ctrl_1.commentCtrl.deleteComment);
const commentsRouter = router;
exports.default = commentsRouter;

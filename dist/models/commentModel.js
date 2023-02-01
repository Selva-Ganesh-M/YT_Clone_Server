"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const commentSchema = new mongoose_1.default.Schema({
    content: {
        type: String,
        required: true,
    },
    userId: {
        require: true,
        type: String
    },
    videoId: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});
const commentModel = mongoose_1.default.model("Comment", commentSchema);
exports.default = commentModel;

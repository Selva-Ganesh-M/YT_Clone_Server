"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    username: {
        required: true,
        type: String,
        unique: true
    },
    email: {
        required: true,
        type: String,
        unique: true
    },
    password: {
        type: String,
        // here password is not required for a user that signs up using google auth
        // But other users must have a password
        // must be handle this in the validation phase
    },
    image: {
        type: String,
        default: "https://w7.pngwing.com/pngs/831/88/png-transparent-user-profile-computer-icons-user-interface-mystique-miscellaneous-user-interface-design-smile-thumbnail.png"
    },
    subscribers: {
        type: Number,
        default: 0,
    },
    subscribedUsers: {
        type: [String],
        default: []
    },
    isGoogleCreated: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});
const userModel = mongoose_1.default.model("User", userSchema);
exports.default = userModel;

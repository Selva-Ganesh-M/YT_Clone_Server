"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSchema = exports.paramsMongooseIdCheck = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const zod_1 = require("zod");
// params mongoose id check
exports.paramsMongooseIdCheck = zod_1.z.object({
    params: zod_1.z.object({
        id: (0, zod_1.string)().refine((id) => mongoose_1.default.isValidObjectId(id), {
            message: "not a valid mongoose id."
        })
    })
});
// update user
const userUpdateSchema = exports.paramsMongooseIdCheck.extend({
    body: (0, zod_1.object)({
        // username
        username: (0, zod_1.string)({
            required_error: "username is a required field."
        }).optional(),
        // password
        password: (0, zod_1.string)()
            .regex(new RegExp(".*[A-Z].*"), "One uppercase character")
            .regex(new RegExp(".*[a-z].*"), "One lowercase character")
            .regex(new RegExp(".*\\d.*"), "One number")
            .regex(new RegExp(".*[`~<>?,./!@#$%^&*()\\-_+=\"'|{}\\[\\];:\\\\].*"), "One special character")
            .min(8, "Must be at least 8 characters in length").optional(),
        // email
        email: (0, zod_1.string)({
            required_error: "Email is a required field",
        }).email("Invalid email addresss.").optional(),
        // image
        image: (0, zod_1.string)({
            required_error: "Email is a required field",
        }).optional(),
    }),
});
exports.userSchema = {
    userUpdateSchema,
    paramsMongooseIdCheck: exports.paramsMongooseIdCheck
};

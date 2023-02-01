"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authSchema = void 0;
const zod_1 = require("zod");
// signup
const signup = (0, zod_1.object)({
    body: (0, zod_1.object)({
        // username
        username: (0, zod_1.string)({
            required_error: "username is a required field."
        }),
        // password
        password: (0, zod_1.string)({ required_error: "password is a required field." })
            .regex(new RegExp(".*[A-Z].*"), "One uppercase character")
            .regex(new RegExp(".*[a-z].*"), "One lowercase character")
            .regex(new RegExp(".*\\d.*"), "One number")
            .regex(new RegExp(".*[`~<>?,./!@#$%^&*()\\-_+=\"'|{}\\[\\];:\\\\].*"), "One special character")
            .min(8, "Must be at least 8 characters in length"),
        // email
        email: (0, zod_1.string)({
            required_error: "Email is a required field",
        }).email("Invalid email addresss."),
        // image
        image: (0, zod_1.string)({
            required_error: "Email is a required field",
        }).optional(),
    })
});
// google signup
const googleSignUp = (0, zod_1.object)({
    body: (0, zod_1.object)({
        // username
        username: (0, zod_1.string)({
            required_error: "username is a required field."
        }),
        // email
        email: (0, zod_1.string)({
            required_error: "Email is a required field",
        }).email("Invalid email addresss."),
        // image
        image: (0, zod_1.string)({
            required_error: "Email is a required field",
        }).optional(),
    })
});
// signin   
const signin = (0, zod_1.object)({
    body: (0, zod_1.object)({
        email: (0, zod_1.string)({
            required_error: "Email is a required field",
        }).email("Invalid email addresss."),
        password: (0, zod_1.string)()
            .regex(new RegExp(".*[A-Z].*"), "One uppercase character")
            .regex(new RegExp(".*[a-z].*"), "One lowercase character")
            .regex(new RegExp(".*\\d.*"), "One number")
            .regex(new RegExp(".*[`~<>?,./!@#$%^&*()\\-_+=\"'|{}\\[\\];:\\\\].*"), "One special character")
            .min(8, "Must be at least 8 characters in length"),
    })
});
// exports
exports.authSchema = {
    signup, signin, googleSignUp
};

import mongoose from "mongoose";
import {z, object, string} from "zod";


// params mongoose id check
export const paramsMongooseIdCheck = z.object({
    params: z.object({
        id: string().refine((id)=>mongoose.isValidObjectId(id), {
            message: "not a valid mongoose id."
        })
    })
})

// update user
const userUpdateSchema = paramsMongooseIdCheck.extend({
    body: object({
        // username
        username: string({
            required_error: "username is a required field."
        }).optional(),
        
        // password
        password: string()
        .regex(new RegExp(".*[A-Z].*"), "One uppercase character")
        .regex(new RegExp(".*[a-z].*"), "One lowercase character")
        .regex(new RegExp(".*\\d.*"), "One number")
        .regex(
          new RegExp(".*[`~<>?,./!@#$%^&*()\\-_+=\"'|{}\\[\\];:\\\\].*"),
          "One special character"
        )
        .min(8, "Must be at least 8 characters in length").optional(),

        // email
        email: string({
            required_error: "Email is a required field",
          }).email("Invalid email addresss.").optional(),

        // image
        image: string({
            required_error: "Email is a required field",
          }).optional(),
    }),
})

export const userSchema = {
    userUpdateSchema,
    paramsMongooseIdCheck
}
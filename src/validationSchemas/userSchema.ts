import mongoose from "mongoose";
import {z, object, string} from "zod";



// update user
const userUpdateSchema = z.object({
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
    params: z.object({
        id: z.string({
            required_error: "id in parameter is a required field"
        })
    })
})

// delete user
const userDeleteSchema = z.object({
    params: z.object({
        id: string().refine((id)=>mongoose.isValidObjectId(id), {
            message: "not a valid mongoose id."
        })
    })
})

// get user
const getUserSchema = z.object({
    params: z.object({
        id: string().refine((id)=>mongoose.isValidObjectId(id), {
            message: "not a valid mongoose id."
        })
    })
})

// subscribe user schema
const subscribeUserSchema = z.object({
    params: z.object({
        id: string().refine((id)=>mongoose.isValidObjectId(id), {
            message: "not a valid mongoose id."
        })
    })
})


export const userSchema = {
    userUpdateSchema,
    userDeleteSchema,
    getUserSchema,
    subscribeUserSchema
}
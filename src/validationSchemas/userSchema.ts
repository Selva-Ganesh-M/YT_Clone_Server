import {z, object, string} from "zod";


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



export const userSchema = {
    userUpdateSchema
}
import {z, object, string, TypeOf} from "zod"


// signup


const signup = object({
    body: object({
        // username
        username: string({
            required_error: "username is a required field."
        }),
        
        // password
        password: string()
        .regex(new RegExp(".*[A-Z].*"), "One uppercase character")
        .regex(new RegExp(".*[a-z].*"), "One lowercase character")
        .regex(new RegExp(".*\\d.*"), "One number")
        .regex(
          new RegExp(".*[`~<>?,./!@#$%^&*()\\-_+=\"'|{}\\[\\];:\\\\].*"),
          "One special character"
        )
        .min(8, "Must be at least 8 characters in length"),

        // email
        email: string({
            required_error: "Email is a required field",
          }).email("Invalid email addresss."),

        // image
        image: string({
            required_error: "Email is a required field",
          }).optional(),
    })
})


export type TAuthSignURequest = TypeOf<typeof signup>






// signin   


const signin = object({
    body: object({
        email: string({
            required_error: "Email is a required field",
          }).email("Invalid email addresss."),
        password: string()
        .regex(new RegExp(".*[A-Z].*"), "One uppercase character")
        .regex(new RegExp(".*[a-z].*"), "One lowercase character")
        .regex(new RegExp(".*\\d.*"), "One number")
        .regex(
          new RegExp(".*[`~<>?,./!@#$%^&*()\\-_+=\"'|{}\\[\\];:\\\\].*"),
          "One special character"
        )
        .min(8, "Must be at least 8 characters in length"),
    })
})

export type TAuthSigninRequest = TypeOf<typeof signin>

export type TAuthSigninRequestBody = TAuthSigninRequest["body"]




// exports

export const authSchema = {
    signup, signin
}

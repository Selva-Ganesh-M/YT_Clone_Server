import { NextFunction, Request, Response } from "express";
import userModel, { IUser } from "../models/userModel";
import bcrypt, { genSalt, genSaltSync } from "bcryptjs";
import asyncHandler from "express-async-handler";
import { customError } from "../utils/customError";

// signup user
const signup = asyncHandler(
    async (req: Request<{}, {}, IUser>, res:Response, next: NextFunction)=>{
        const b = req.body;
        const salt = bcrypt.genSaltSync(10)
        const hashedPassword = bcrypt.hashSync(req.body.password, salt)
        const user = new userModel<IUser>({...req.body, password: hashedPassword});
        await user.save();
        const createdUser = await userModel.findOne({username: req.body.username}).select("-password")
        if (!createdUser) {
            throw new customError(422, "user creation is successful. user fetch failed.")
        }
        res.status(201).json({
            status: "success",
            message: "new user is created.",
            payload: createdUser
        })
}
);


// @sign in

export type TSignInReqBody = {username: string, password: string}

const signin = asyncHandler(
    async (req: Request<{}, {}, TSignInReqBody>, res:Response, next: NextFunction) => {

    }
)



const authController = {
    signup,
    signin
}

export default authController
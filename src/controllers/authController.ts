import { NextFunction, Request, Response } from "express";
import userModel, { IUser } from "../models/userModel";
import bcrypt, { genSalt, genSaltSync } from "bcryptjs";
import asyncHandler from "express-async-handler";
import { customError } from "../utils/customError";
import { TAuthSigninRequest } from "../validationSchemas/authSchema";
import jwt from "jsonwebtoken"
import { JWT_SECRET } from "../utils/config";
import hashPassword from "../utils/hashPassword";

// signup user
const signup = asyncHandler(
    async (req: Request<{}, {}, IUser>, res:Response, next: NextFunction)=>{
        const b = req.body;

        // hashing the password
        const hashedPassword = hashPassword(req.body.password)

        // creating new user
        const user = new userModel<IUser>({...req.body, password: hashedPassword});
        await user.save();

        // fetching newly created user
        const createdUser = await userModel.findOne({username: req.body.username}).select("-password")
        if (!createdUser) {
            throw new customError(422, "user creation is successful. user fetch failed.")
        }

        console.log(typeof createdUser._id, createdUser._id);
        

        // response
        res.status(201).json({
            status: "success",
            message: "new user is created.",
            payload: createdUser
        })
}
);


// @sign in

const signin = asyncHandler(
    async (req: Request<{}, {}, TAuthSigninRequest["body"]>, res:Response, next: NextFunction) => {
        const {email} = req.body;

        // fetching user
        const user = await userModel.findOne({email});
        if (!user){
            throw new customError(404, "user not found.")
        }

        // password verification
        const isValidPassword = bcrypt.compareSync(req.body.password, user.password);
        if (!isValidPassword) {
            throw new customError(400, "password mismatch found")
        }

        // jwt prep
        const token = jwt.sign({email, _id:user._id}, JWT_SECRET!)
        // const {password, ...others} = user._doc

        // response prep
        const response = user as Partial<IUser>;
        response.password = undefined;

        // response
        res
        .cookie("access_token", token, {
            httpOnly: true
        })
        .status(200)
        .json({
            status: "success",
            message: "user sign in successful.",
            payload: response
        })
    }
)



const authController = {
    signup,
    signin
}

export default authController
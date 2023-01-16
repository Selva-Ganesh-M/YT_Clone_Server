import { NextFunction, Request, Response } from "express";
import userModel, { IUser } from "../models/userModel";
import bcrypt, { genSalt, genSaltSync } from "bcryptjs";
import asyncHandler from "express-async-handler";
import { customError } from "../utils/customError";
import { TAuthSigninRequest } from "../validationSchemas/authSchema";
import jwt from "jsonwebtoken"
import { JWT_SECRET } from "../utils/config";

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

const signin = asyncHandler(
    async (req: Request<{}, {}, TAuthSigninRequest["body"]>, res:Response, next: NextFunction) => {
        const {email, password} = req.body;
        const user = await userModel.findOne({email}).exec();
        if (!user){
            throw new customError(404, "user not found.")
        }
        const isValidPassword = bcrypt.compareSync(password, user.password);
        if (!isValidPassword) {
            throw new customError(400, "password mismatch found")
        }
        const token = jwt.sign({email, _id:user._id}, JWT_SECRET!)
        const response = {email, token}
        res.status(200).json({
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
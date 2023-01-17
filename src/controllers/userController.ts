import { NextFunction, Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { IUser } from "../models/userModel";
import userModel from "../models/userModel";
import { userServices } from "../services/userServices";

const updateUser = asyncHandler(
    async (req: Request<{id:string}, {}, IUser>, res:Response, next:NextFunction)=>{

        // getting id from req params
        const {id} = req.params;

        // is operation possible check
        await userServices.isUpdateAllowed(id, req.body, req.user!)

        const updatedUser = await userModel.findByIdAndUpdate(
            {_id: id},
            {
                $set: req.body
            },
            {
                new: true
            }
            ).lean().select("-password");
        
        res.status(200).json({
            status: "success",
            message: "user update success",
            payload: updatedUser
        })
        
        
        
    }
)

export const userController = {
    updateUser
}
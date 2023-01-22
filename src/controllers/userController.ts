import { NextFunction, Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { IUser } from "../models/userModel";
import userModel from "../models/userModel";
import { userServices } from "../services/userServices";
import hasPrivilege from "../utils/hasPrivilege";
import { customError } from "../utils/customError";
import hashPassword from "../utils/hashPassword";


// get a user'''''''''''''''''''''''''''''''''''''''''''
const getUser = asyncHandler(
    async (req: Request<{id:string}, {}, {}>, res:Response, next:NextFunction)=>{

        // getting id from req params
        const {id} = req.params;

        const user = await userModel.findOne(
            {_id: id},
            ).lean().select("-password");

        if(!user) throw new customError(404, "requested user not found.")
        
        res.status(200).json({
            status: "success",
            message: "user obtained.",
            payload: user
        })
               
    }
)


// updating a user'''''''''''''''''''''''''''''''''''''
const updateUser = asyncHandler(
    async (req: Request<{id:string}, {}, IUser>, res:Response, next:NextFunction)=>{

        // getting id from req params
        const {id} = req.params;

        // is operation possible check
        await userServices.isUpdateAllowed(id, req.body, req.user!)

        // yet to update content
        const content = req.body

        // hash the password if any
        if (req.body.password) {
            content.password = hashPassword(content.password)
        }

        const updatedUser = await userModel.findByIdAndUpdate(
            {_id: id},
            {
                $set: content
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


// delete an user'''''''''''''''''''''''''''''''''''''''
const deleteUser = asyncHandler(
    async (req: Request<{id:string}>, res:Response, next:NextFunction)=>{

        // getting id from req params
        const {id} = req.params;

        // is operation possible check
        hasPrivilege(id, req.user!._id.toString())

        const deletedUser = await userModel.findByIdAndDelete(
            {_id: id},
            ).lean().select("-password");
        
        res.status(200).json({
            status: "success",
            message: "user delete success",
            payload: deletedUser
        })
               
    }
)

// subscribe an user
const subscribeUser = asyncHandler(
    async (req:Request<{id: string}>, res:Response, next:NextFunction)=>{
        const self = req.user!;
        const {id} = req.params;

        // updating self on subscribed Users
        await userModel.findByIdAndUpdate(self._id, {
            $push: {
                subscribedUsers: id
            },
        })

        // updating subscribed channel's subscriber count
        await userModel.findByIdAndUpdate(id, {
            $inc: {
                subscribers: 1
            }
        })

        // sending response
        res.status(200).json({
            status: "success",
            message: "subscription added.",
        })
    }
)
// un-subscribe an user
const unSubscribeUser = asyncHandler(
    async (req:Request<{id: string}>, res:Response, next:NextFunction)=>{
        const self = req.user!;
        const {id} = req.params;

        // updating self on subscribed Users
        await userModel.findByIdAndUpdate(self._id, {
            $pull: {
                subscribedUsers: id
            },
        })

        // updating subscribed channel's subscriber count
        await userModel.findByIdAndUpdate(id, {
            $inc: {
                subscribers: -1
            }
        })

        // sending response
        res.status(200).json({
            status: "success",
            message: "user unsubscribed.",
        })
    }
)


export const userController = {
    updateUser,
    deleteUser,
    getUser,
    subscribeUser,
    unSubscribeUser
}
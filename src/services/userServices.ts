import mongoose from "mongoose";
import userModel, { IUser, IUserDoc } from "../models/userModel";
import { customError } from "../utils/customError";
import hasPrivilege from "../utils/hasPrivilege";


const isUpdateAllowed = async (id: string, body: IUser, user:IUserDoc): Promise<Boolean> => {
    const {username, email} = body;

    // restricting access to change others user's details
    hasPrivilege(id, user._id.toString())

    // username pre-exists check
    const existingUsername = await userModel.findOne({username}).lean();
    if (existingUsername) throw new customError(409, "update failed: username not available.");

    // email pre-exists check
    const existingEmail = await userModel.findOne({email}).lean();
    if (existingEmail) throw new customError(409, "update failed: email not available.");

    return true;
}

export const userServices = {
    isUpdateAllowed
}
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken"
import userModel, { IUser } from "../models/userModel";
import { JWT_SECRET } from "../utils/config";
import { customError } from "../utils/customError";

// interface IReq extends Request , {user: IUser} {}

const authorization = async (req: Request, res:Response, next: NextFunction)=>{

    type Tjwt = {
        _id: string,
        email: string,
        iat: number
    }

    // token verification
    const token = req.cookies.access_token;
    const {email, _id, iat} = jwt.verify(token, JWT_SECRET!) as Tjwt;
    if (!_id) throw new customError(401, "You're not authorized.")


    // user fetching 
    const user = await userModel.findById(_id);
    // req.user = user
}
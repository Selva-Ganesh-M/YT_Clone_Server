import { NextFunction, Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { AnyZodObject } from "zod";
import { IUser } from "../../models/userModel";

const signup = (schema: AnyZodObject)=> asyncHandler ( async (req: Request<{}, {}, IUser>, res:Response, next:NextFunction) => {
    schema.parse({
        body: req.body,
        params: req.params,
        query: req.query,
      });
      next();
})


const authValidation = {
    signup,
} 

export default authValidation
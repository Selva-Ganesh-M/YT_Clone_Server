import { NextFunction, Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { AnyZodObject, TypeOf } from "zod";
import { IUser } from "../../models/userModel";
import { TAuthSigninRequestBody } from "../../validationSchemas/authSchema";


export const authValidator = (schema: AnyZodObject)=> asyncHandler ( async (req: Request, res:Response, next:NextFunction) => {
    req.body
    schema.parse({
        body: req.body,
        params: req.params,
        query: req.query,
      });
      next();
})

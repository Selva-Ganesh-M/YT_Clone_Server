import { NextFunction, Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { AnyZodObject, TypeOf, z } from "zod";
import { customError } from "../../utils/customError";


export const validator = (schema: AnyZodObject)=> (req: Request, res:Response, next:NextFunction) => {
  try {
    schema.parse({
      body: req.body,
      params: req.params,
      query: req.query,
    });
        next();
  } catch (error) {
    if (error instanceof z.ZodError){
      next(new customError(400, error.flatten()))
    }
  }
}

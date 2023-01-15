import { NextFunction, Request, Response } from "express";

export const customErrorHandler = async (err: any, req: Request, res:Response, next: NextFunction) => {
    const errstatus = err.status ? err.status : 500
    const message = err.message
    const stack = err.stack ? err.stack : "no stack is provided."
    res.status(errstatus).json({
        errstatus, message, stack
    })
}
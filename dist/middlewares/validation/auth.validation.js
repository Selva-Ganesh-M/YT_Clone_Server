"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validator = void 0;
const zod_1 = require("zod");
const customError_1 = require("../../utils/customError");
const validator = (schema) => (req, res, next) => {
    try {
        schema.parse({
            body: req.body,
            params: req.params,
            query: req.query,
        });
        next();
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            next(new customError_1.customError(400, error.flatten()));
        }
    }
};
exports.validator = validator;

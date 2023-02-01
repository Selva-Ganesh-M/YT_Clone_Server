"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorization = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userModel_1 = __importDefault(require("../models/userModel"));
const config_1 = require("../utils/config");
const customError_1 = require("../utils/customError");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
exports.authorization = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // token verification
    const token = req.cookies.access_token;
    console.log("cookie: ", req.cookies);
    if (!token)
        throw new customError_1.customError(401, "authorization failed: missing access_token.");
    const { email, _id, iat } = jsonwebtoken_1.default.verify(token, config_1.JWT_SECRET);
    if (!_id)
        throw new customError_1.customError(400, "authorization failed: invalid access_token.");
    // user fetching 
    const user = yield userModel_1.default.findById(_id).lean();
    if (!user)
        throw new customError_1.customError(404, "authorization failed: user doesn't exist.");
    // attaching user with the request
    req.user = user;
    next();
}));

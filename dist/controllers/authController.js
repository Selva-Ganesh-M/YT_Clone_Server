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
const userModel_1 = __importDefault(require("../models/userModel"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const customError_1 = require("../utils/customError");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../utils/config");
const hashPassword_1 = __importDefault(require("../utils/hashPassword"));
// google auth
const googleSignUp = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email, image } = req.body;
    // check if user already exists
    const user = yield userModel_1.default.findOne({ email }).lean();
    if (user) {
        // LOGIN
        // jwt prep
        const token = jsonwebtoken_1.default.sign({ email, _id: user._id }, config_1.JWT_SECRET);
        // const {password, ...others} = user._doc
        // response prep
        const response = user;
        response.password = undefined;
        // response
        res
            .cookie("access_token", token, {
            httpOnly: true
        })
            .status(200)
            .json({
            status: "success",
            message: "user sign in successful.",
            payload: response
        });
    }
    else {
        // SIGN UP
        // creating new user
        const user = new userModel_1.default(Object.assign(Object.assign({}, req.body), { isGoogleCreated: true }));
        yield user.save();
        // fetching newly created user
        const createdUser = yield userModel_1.default.findOne({ email: req.body.email }).select("-password").lean();
        if (!createdUser) {
            throw new customError_1.customError(422, "user creation is successful. user fetch failed.");
        }
        // response
        res.status(201).json({
            status: "success",
            message: "new user is created.",
            payload: createdUser
        });
    }
}));
// signup user
const signup = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const b = req.body;
    // hashing the password
    const hashedPassword = (0, hashPassword_1.default)(req.body.password);
    // creating new user
    const user = new userModel_1.default(Object.assign(Object.assign({}, req.body), { password: hashedPassword }));
    yield user.save();
    // fetching newly created user
    const createdUser = yield userModel_1.default.findOne({ email: req.body.email }).select("-password");
    if (!createdUser) {
        throw new customError_1.customError(422, "user creation is successful. user fetch failed.");
    }
    // response
    res.status(201).json({
        status: "success",
        message: "new user is created.",
        payload: createdUser
    });
}));
// @sign in
const signin = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    // fetching user
    const user = yield userModel_1.default.findOne({ email });
    if (!user) {
        throw new customError_1.customError(404, "user not found.");
    }
    // if google created ignore password verification
    if (!user.isGoogleCreated) {
        // password verification
        const isValidPassword = bcryptjs_1.default.compareSync(req.body.password, user.password);
        if (!isValidPassword) {
            throw new customError_1.customError(400, "password mismatch found");
        }
    }
    // jwt prep
    const token = jsonwebtoken_1.default.sign({ email, _id: user._id }, config_1.JWT_SECRET);
    // const {password, ...others} = user._doc
    // response prep
    const response = user;
    response.password = undefined;
    // response
    res
        .cookie("access_token", token, {
        httpOnly: true
    })
        .status(200)
        .json({
        status: "success",
        message: "user sign in successful.",
        payload: response
    });
}));
const authController = {
    signup,
    signin,
    googleSignUp
};
exports.default = authController;

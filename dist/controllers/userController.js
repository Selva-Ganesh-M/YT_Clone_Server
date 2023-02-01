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
exports.userController = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const userModel_1 = __importDefault(require("../models/userModel"));
const userServices_1 = require("../services/userServices");
const hasPrivilege_1 = __importDefault(require("../utils/hasPrivilege"));
const customError_1 = require("../utils/customError");
const hashPassword_1 = __importDefault(require("../utils/hashPassword"));
// get a user'''''''''''''''''''''''''''''''''''''''''''
const getUser = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // getting id from req params
    const { id } = req.params;
    const user = yield userModel_1.default.findOne({ _id: id }).lean().select("-password");
    if (!user)
        throw new customError_1.customError(404, "requested user not found.");
    res.status(200).json({
        status: "success",
        message: "user obtained.",
        payload: user
    });
}));
// updating a user'''''''''''''''''''''''''''''''''''''
const updateUser = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // getting id from req params
    const { id } = req.params;
    // is operation possible check
    yield userServices_1.userServices.isUpdateAllowed(id, req.body, req.user);
    // yet to update content
    const content = req.body;
    // hash the password if any
    if (req.body.password) {
        content.password = (0, hashPassword_1.default)(content.password);
    }
    const updatedUser = yield userModel_1.default.findByIdAndUpdate({ _id: id }, {
        $set: content
    }, {
        new: true
    }).lean().select("-password");
    res.status(200).json({
        status: "success",
        message: "user update success",
        payload: updatedUser
    });
}));
// delete an user'''''''''''''''''''''''''''''''''''''''
const deleteUser = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // getting id from req params
    const { id } = req.params;
    // is operation possible check
    (0, hasPrivilege_1.default)(id, req.user._id.toString());
    const deletedUser = yield userModel_1.default.findByIdAndDelete({ _id: id }).lean().select("-password");
    res.status(200).json({
        status: "success",
        message: "user delete success",
        payload: deletedUser
    });
}));
// subscribe an user
const subscribeUser = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const self = req.user;
    const { id } = req.params;
    // updating self on subscribed Users
    yield userModel_1.default.findByIdAndUpdate(self._id, {
        $push: {
            subscribedUsers: id
        },
    });
    // updating subscribed channel's subscriber count
    yield userModel_1.default.findByIdAndUpdate(id, {
        $inc: {
            subscribers: 1
        }
    });
    // sending response
    res.status(200).json({
        status: "success",
        message: "subscription added.",
    });
}));
// un-subscribe an user
const unSubscribeUser = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const self = req.user;
    const { id } = req.params;
    // updating self on subscribed Users
    yield userModel_1.default.findByIdAndUpdate(self._id, {
        $pull: {
            subscribedUsers: id
        },
    });
    // updating subscribed channel's subscriber count
    yield userModel_1.default.findByIdAndUpdate(id, {
        $inc: {
            subscribers: -1
        }
    });
    // sending response
    res.status(200).json({
        status: "success",
        message: "user unsubscribed.",
    });
}));
exports.userController = {
    updateUser,
    deleteUser,
    getUser,
    subscribeUser,
    unSubscribeUser
};

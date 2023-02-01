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
exports.userServices = void 0;
const userModel_1 = __importDefault(require("../models/userModel"));
const customError_1 = require("../utils/customError");
const hasPrivilege_1 = __importDefault(require("../utils/hasPrivilege"));
const isUpdateAllowed = (id, body, user) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email } = body;
    // restricting access to change others user's details
    (0, hasPrivilege_1.default)(id, user._id.toString());
    // username pre-exists check
    const existingUsername = yield userModel_1.default.findOne({ username }).lean();
    if (existingUsername)
        throw new customError_1.customError(409, "update failed: username not available.");
    // email pre-exists check
    const existingEmail = yield userModel_1.default.findOne({ email }).lean();
    if (existingEmail)
        throw new customError_1.customError(409, "update failed: email not available.");
    return true;
});
exports.userServices = {
    isUpdateAllowed
};

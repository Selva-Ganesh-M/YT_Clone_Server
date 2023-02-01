"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const authorization_1 = require("../middlewares/authorization");
const auth_validation_1 = require("../middlewares/validation/auth.validation");
const userSchema_1 = require("../validationSchemas/userSchema");
const router = express_1.default.Router();
router
    // get user
    .get("/:id", (0, auth_validation_1.validator)(userSchema_1.userSchema.paramsMongooseIdCheck), userController_1.userController.getUser)
    // update user
    .put("/update/:id", authorization_1.authorization, (0, auth_validation_1.validator)(userSchema_1.userSchema.userUpdateSchema), userController_1.userController.updateUser)
    // delete user
    .delete("/delete/:id", authorization_1.authorization, (0, auth_validation_1.validator)(userSchema_1.userSchema.paramsMongooseIdCheck), userController_1.userController.deleteUser)
    // subscribe user
    .patch("/subscribe/:id", authorization_1.authorization, (0, auth_validation_1.validator)(userSchema_1.userSchema.paramsMongooseIdCheck), userController_1.userController.subscribeUser)
    // unsubscribe an user
    .patch("/unsubscribe/:id", authorization_1.authorization, (0, auth_validation_1.validator)(userSchema_1.userSchema.paramsMongooseIdCheck), userController_1.userController.unSubscribeUser);
exports.userRouter = router;

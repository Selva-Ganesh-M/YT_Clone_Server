import express from "express";
import { userController } from "../controllers/userController";
import { authorization } from "../middlewares/authorization";
import { validator } from "../middlewares/validation/auth.validation";
import { userSchema } from "../validationSchemas/userSchema";

const router = express.Router();

router
// get user
.get("/:id", validator(userSchema.getUserSchema), userController.getUser)
// update user
.put("/update/:id", authorization, validator(userSchema.userUpdateSchema), userController.updateUser)
// delete user
.delete("/delete/:id", authorization, validator(userSchema.userDeleteSchema), userController.deleteUser)
// subscribe user
.patch("/subscribe/:id", authorization, validator(userSchema.subscribeUserSchema), userController.subscribeUser)


export const userRouter = router
import express from "express";
import { userController } from "../controllers/userController";
import { authorization } from "../middlewares/authorization";
import { validator } from "../middlewares/validation/auth.validation";
import { userSchema } from "../validationSchemas/userSchema";

const router = express.Router();

router.put("/:id", authorization, validator(userSchema.userUpdateSchema), userController.updateUser)

export const userRouter = router
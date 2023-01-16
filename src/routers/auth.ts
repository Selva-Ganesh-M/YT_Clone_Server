import express from "express";
import authController from "../controllers/authController";
import { authValidator } from "../middlewares/validation/auth.validation";
import { authSchema } from "../validationSchemas/authSchema";



const router = express.Router();

// signup - create user

router.post("/signup", authValidator(authSchema.signup),authController.signup)
router.post("/signin", authValidator(authSchema.signin),authController.signin)

// signin

// google auth

export default router;

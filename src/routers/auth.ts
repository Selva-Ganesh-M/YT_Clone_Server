import express from "express";
import authController from "../controllers/authController";

import authValidation from "../middlewares/validation/auth.validation";
import { authSignupSchema } from "../validationSchemas/auth/signupSchema";

const router = express.Router();

// signup - create user

router.post("/signup", authValidation.signup(authSignupSchema),authController.signup)

// signin

// google auth

export default router;

import express from "express";
import authController from "../controllers/authController";
import { validator } from "../middlewares/validation/auth.validation";
import { authSchema } from "../validationSchemas/authSchema";



const router = express.Router();

// signup - create user
router.post("/signup", validator(authSchema.signup),authController.signup)

// signin
router.post("/signin", validator(authSchema.signin),authController.signin)

// google auth
router.post("/google", validator(authSchema.googleSignUp),authController.googleSignUp)



export default router;

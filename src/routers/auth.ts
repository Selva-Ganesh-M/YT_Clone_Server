import express from "express";
import { signup } from "../controllers/authController";

const router = express.Router();

// signup - create user

router.post("/signup", signup)

// signin

// google auth

export default router;

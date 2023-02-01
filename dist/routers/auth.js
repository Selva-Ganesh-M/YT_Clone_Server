"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = __importDefault(require("../controllers/authController"));
const auth_validation_1 = require("../middlewares/validation/auth.validation");
const authSchema_1 = require("../validationSchemas/authSchema");
const router = express_1.default.Router();
// signup - create user
router.post("/signup", (0, auth_validation_1.validator)(authSchema_1.authSchema.signup), authController_1.default.signup);
// signin
router.post("/signin", (0, auth_validation_1.validator)(authSchema_1.authSchema.signin), authController_1.default.signin);
// google auth
router.post("/google", (0, auth_validation_1.validator)(authSchema_1.authSchema.googleSignUp), authController_1.default.googleSignUp);
exports.default = router;

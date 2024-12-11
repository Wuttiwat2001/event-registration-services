import { Router } from "express";
import { registerUser, loginUser } from "../controllers/auth.controller.js";
import validateResult from "../middlewares/validation.middleware.js";
import { validateLogin, validateRegister } from "../validators/auth.validator.js";
const authRouter = Router();

authRouter.post("/login", validateLogin, validateResult, loginUser);
authRouter.post("/register",validateRegister ,validateRegister, registerUser);

export default authRouter;

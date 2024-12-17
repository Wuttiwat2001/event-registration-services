import { Router } from "express";
import { registerUser, loginUser,loginAdmin } from "../controllers/auth.controller.js";
import validateResult from "../middlewares/validation.middleware.js";
import { validateLogin, validateRegister } from "../validators/auth.validator.js";
const authRouter = Router();

authRouter.post("/login", validateLogin, validateResult, loginUser);
authRouter.post("/loginAdmin", validateLogin, validateResult, loginAdmin);
authRouter.post("/register",validateRegister ,validateResult, registerUser);

export default authRouter;

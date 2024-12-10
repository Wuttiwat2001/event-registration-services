import { Router } from "express";
// import authRouter from './auth.js';import 
import authRouter from './auth.routes.js';


const rootRouter = Router();

rootRouter.use("/auth", authRouter);

export default rootRouter;
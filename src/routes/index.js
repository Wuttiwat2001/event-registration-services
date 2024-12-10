import { Router } from "express";
// import authRouter from './auth.js';import 
import authRouter from './auth.routes.js';
import eventRouter from "./event.routes.js";


const rootRouter = Router();

rootRouter.use("/auth", authRouter);
rootRouter.use("/events", eventRouter);

export default rootRouter;
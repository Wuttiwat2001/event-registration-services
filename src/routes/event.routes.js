import { Router } from "express";
import {
  create,
  findAll,
  findOne,
  update,
  remove,
} from "../controllers/event.controller.js";

const eventRouter = Router();

eventRouter.post("/", create);
eventRouter.post("/findAll", findAll);
eventRouter.get("/:id", findOne);
eventRouter.put("/update/:id", update);
eventRouter.delete("/remove/:id", remove);

export default eventRouter;

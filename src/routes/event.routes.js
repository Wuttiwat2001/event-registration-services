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
eventRouter.get("/", findAll);
eventRouter.get("/:id", findOne);
eventRouter.put("/:id", update);
eventRouter.delete("/:id", remove);

export default eventRouter;

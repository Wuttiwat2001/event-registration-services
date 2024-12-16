import { Router } from "express";
import {
  create,
  findAll,
  findOne,
  update,
  remove,
} from "../controllers/event.controller.js";
import validateResult from "../middlewares/validation.middleware.js";
import { validateCreate } from "../validators/event.validator.js";

const eventRouter = Router();

eventRouter.post("/", validateResult, validateCreate, create);
eventRouter.post("/findAll", findAll);
eventRouter.get("/:id", findOne);
eventRouter.put("/update/:id", update);
eventRouter.delete("/remove/:id", remove);

export default eventRouter;

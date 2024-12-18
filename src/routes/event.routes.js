import { Router } from "express";
import {
  create,
  findAll,
  findOne,
  update,
  remove,
  findRegisteredUsers,
  joinEvent,
} from "../controllers/event.controller.js";
import validateResult from "../middlewares/validation.middleware.js";
import {
  validateCreate,
  validateUpdate,
} from "../validators/event.validator.js";
import {
  authMiddleware,
  authorizeMiddleware,
} from "../middlewares/auth.middleware.js";

const eventRouter = Router();

eventRouter.post(
  "/",
  authMiddleware,
  authorizeMiddleware(["ADMIN"]),
  validateResult,
  validateCreate,
  create
);
eventRouter.post("/findAll", findAll);
eventRouter.post("/registered-users", findRegisteredUsers);
eventRouter.post(
  "/join/:eventId",
  authMiddleware,
  authorizeMiddleware(["ADMIN", "USER"]),
  joinEvent
);
eventRouter.get("/:id", findOne);
eventRouter.put(
  "/update/:id",
  authMiddleware,
  authorizeMiddleware(["ADMIN"]),
  validateResult,
  validateUpdate,
  update
);
eventRouter.delete(
  "/remove/:id",
  authMiddleware,
  authorizeMiddleware(["ADMIN"]),
  remove
);
export default eventRouter;

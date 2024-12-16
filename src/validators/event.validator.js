import { body } from "express-validator";

const validateCreate = [
  body("title").notEmpty().withMessage("Title is required"),
  body("description").notEmpty().withMessage("Description is required"),
  body("location").notEmpty().withMessage("Location is required"),
  body("totalSeats").notEmpty().withMessage("Total seats is required"),
  body("remainingSeats").notEmpty().withMessage("Remaining seats is required"),
  body("createdBy").notEmpty().withMessage("Created by is required"),
];

const validateUpdate = [
  body("title").notEmpty().withMessage("Title is required"),
  body("description").notEmpty().withMessage("Description is required"),
  body("location").notEmpty().withMessage("Location is required"),
  body("totalSeats").notEmpty().withMessage("Total seats is required"),
  body("remainingSeats").notEmpty().withMessage("Remaining seats is required"),
  body("createdBy").notEmpty().withMessage("Created by is required"),
];

export { validateCreate, validateUpdate };

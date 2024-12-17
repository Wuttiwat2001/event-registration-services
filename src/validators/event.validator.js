import { body } from "express-validator";

const validateCreate = [
  body("title")
    .notEmpty()
    .withMessage("Title is required")
    .matches(/^[A-Za-z0-9\s]+$/)
    .withMessage(
      "Title should contain only alphanumeric characters and spaces"
    ),
  body("description")
    .notEmpty()
    .withMessage("Description is required")
    .matches(/^[A-Za-z0-9\s]+$/)
    .withMessage(
      "Description should contain only alphanumeric characters and spaces"
    ),
  body("location")
    .notEmpty()
    .withMessage("Location is required")
    .matches(/^[A-Za-z0-9\s]+$/)
    .withMessage(
      "Location should contain only alphanumeric characters and spaces"
    ),
  body("totalSeats").notEmpty().withMessage("Total seats is required"),
  body("remainingSeats").notEmpty().withMessage("Remaining seats is required"),
  body("createdBy").notEmpty().withMessage("Created by is required"),
];

const validateUpdate = [
  body("title")
    .notEmpty()
    .withMessage("Title is required")
    .matches(/^[A-Za-z0-9\s]+$/)
    .withMessage(
      "Title should contain only alphanumeric characters and spaces"
    ),
  body("description")
    .notEmpty()
    .withMessage("Description is required")
    .matches(/^[A-Za-z0-9\s]+$/)
    .withMessage(
      "Description should contain only alphanumeric characters and spaces"
    ),
  body("location")
    .notEmpty()
    .withMessage("Location is required")
    .matches(/^[A-Za-z0-9\s]+$/)
    .withMessage(
      "Location should contain only alphanumeric characters and spaces"
    ),
  body("totalSeats").notEmpty().withMessage("Total seats is required"),
  body("remainingSeats").notEmpty().withMessage("Remaining seats is required"),
];

export { validateCreate, validateUpdate };

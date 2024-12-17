import { body } from "express-validator";

const validateLogin = [
  body("username").notEmpty().withMessage("Username is required"),
  body("password").notEmpty().withMessage("Password is required"),
];

const validateRegister = [
  body("username")
    .isLength({ min: 4 })
    .withMessage("Username should be at least 4 characters")
    .matches(/^[A-Za-z0-9]+$/)
    .withMessage("Username should contain only alphanumeric characters"),
  body("password")
    .isLength({ min: 5 })
    .withMessage("Password should be at least 5 characters"),
  body("firstName")
    .notEmpty()
    .withMessage("First name is required")
    .matches(/^[A-Za-z]+$/)
    .withMessage("First name should contain only alphabetic characters"),
  body("lastName")
    .notEmpty()
    .withMessage("Last name is required")
    .matches(/^[A-Za-z]+$/)
    .withMessage("Last name should contain only alphabetic characters"),
  body("phone")
    .isLength({ min: 12, max: 12 })
    .withMessage("Phone number should be exactly 10 digits"),
];

export { validateLogin, validateRegister };

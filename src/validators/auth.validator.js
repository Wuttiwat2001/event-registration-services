import { body } from "express-validator";

const validateLogin = [
  body("username").notEmpty().withMessage("Username is required"),
  body("password").notEmpty().withMessage("Password is required"),
];

const validateRegister = [
  body("username")
    .isLength({ min: 4 })
    .withMessage("Username should be at least 4 characters"),
  body("password")
    .isLength({ min: 5 })
    .withMessage("Password should be at least 5 characters"),
  body("firstName").notEmpty().withMessage("First name is required"),
  body("lastName").notEmpty().withMessage("Last name is required"),
  body("phone")
    .isLength({ min: 10, max: 10 })
    .withMessage("Phone number should be exactly 10 digits"),
];

export { validateLogin,validateRegister };

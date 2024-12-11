import { validationResult } from "express-validator";
import HttpError from "../utils/HttpError.js";

const validateResult = (req, res, next) => {
  const errors = validationResult(req).array();
  if (errors.length > 0) {
    return next(new HttpError(400, `${errors[0].msg}`));
  }
  next();
};

export default validateResult;

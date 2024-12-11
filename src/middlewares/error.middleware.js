
import HttpError from '../utils/HttpError.js';

const errorMiddleware = (err, req, res, next) => {
  if (!(err instanceof HttpError)) {
    err = new HttpError(500, "Something went wrong");
  }
  const message = err.message || "Internal Server Error";
  const statusCode = err.statusCode || 500;
  res.status(statusCode);
  res.json({
    success: false,
    error: message,
  });
};

export default errorMiddleware;

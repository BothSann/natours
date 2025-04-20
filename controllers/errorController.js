import { AppError } from "./../utils/appError.js";

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const sendErrorDev = (err, req, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProduction = (err, req, res) => {
  // In production, we don't want to expose the stack trace to the client
  // So we send a generic error message instead
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    // For programming errors, we log the error and send a generic message
    console.error("ERROR 💥", err);
    res.status(500).json({
      status: "error",
      message: "Something went very wrong!",
    });
  }
};

function globalErrorHandler(err, req, res, next) {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    // In development, we want to expose the stack trace to the client
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === "production") {
    // Create a hard copy of the error
    let error = Object.create(Object.getPrototypeOf(err));
    Object.assign(error, err);

    // Handle CastError (invalid MongoDB ObjectId)
    if (err.name === "CastError") error = handleCastErrorDB(err);

    // Send the error response
    sendErrorProduction(error, req, res);
  }
}

export default globalErrorHandler;

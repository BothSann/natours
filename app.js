import express from "express";
import morgan from "morgan";
import tourRouter from "./routes/tourRoutes.js";
import userRouter from "./routes/userRoutes.js";
import { AppError } from "./utils/appError.js";
import globalErrorHandler from "./controllers/errorController.js";
import { rateLimit } from "express-rate-limit";

const app = express();

const limiter = rateLimit({
  max: 100, // 100 request from the same IP
  windowMs: 60 * 60 * 1000, // 1hour
  message: "Too many requests, please try again later.",
  legacyHeaders: true,
});

app.use("/api", limiter);

// Middleware
app.use(morgan("dev"));
app.use(express.json());
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

// Error handling middleware
app.all("*", (req, res, next) => {
  const err = new AppError(
    `Can't find ${req.originalUrl} on this server!`,
    404
  );

  next(err);
});

app.use(globalErrorHandler);

export default app;

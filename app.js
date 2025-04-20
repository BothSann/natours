import express from "express";
import morgan from "morgan";
import tourRouter from "./routes/tourRoutes.js";
import userRouter from "./routes/userRoutes.js";

const app = express();

// Middleware
app.use(morgan("dev"));
app.use(express.json());
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

// Error handling middleware
app.all("*", (req, res, next) => {
  res.status(404).json({
    status: "fail",
    message: `Can't find ${req.originalUrl} on this server!`,
  });
  next();
});

export default app;

import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
dotenv.config();

const app = express();

// CONNECTION TO MONGODB
mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("connected to database");
  })
  .catch((err) => {
    console.error(`connection error: ${err}`);
  });

// RUN SERVER
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

// Middleware for JSON parsing and CORS
app.use(express.json());

// ROUTES
app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);


app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

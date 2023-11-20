import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
import listingRouter from "./routes/listing.route.js"
import searchRouter from "./routes/search.route.js"
import cookieParser from "cookie-parser";
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

// Middleware for JSON parsing and CORS
app.use(express.json());
app.use(cookieParser());

// RUN SERVER
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

// ROUTES
app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/listing", listingRouter);
app.use("/api/search", searchRouter)

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

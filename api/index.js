import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
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

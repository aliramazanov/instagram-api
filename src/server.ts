import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import authRoute from "./routes/authRoute";
import postRouter from "./routes/postRoute";
import userRouter from "./routes/userRoute";
import { configureAuthentication } from "./auth";

dotenv.config();

const startServer = async () => {
  const app = configureAuthentication(express());

  const port: number = parseInt(process.env.PORT || "4000", 10);
  const hostname: string = process.env.HOST || "localhost";
  const uri = process.env.URI || "";

  try {
    await mongoose.connect(uri);
    console.log("Application successfully connected to the Database");

    app.use(authRoute);
    app.use(userRouter);
    app.use(postRouter);

    app.listen(port, () => {
      console.log(`Server is up & running on http://${hostname}:${port}`);
    });
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

startServer();

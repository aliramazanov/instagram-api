import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import authRoute from "./routes/authRoute";
import { configureAuthentication } from "./auth";
import postRouter from "./routes/postRoute";
import userRouter from "./routes/userRoute";
import cors from "cors";

const app = configureAuthentication();
app.use(express.json());
dotenv.config();

const port: number = parseInt(process.env.PORT || "4000", 10);
const hostname: string = process.env.HOST || "localhost";
const uri = process.env.URI || "";

mongoose
  .connect(uri)
  .then(() => {
    console.log("Application successfully connected to the Database");

    app.use(cors);
    app.use(authRoute);
    app.use(userRouter);
    app.use(postRouter);
    // app.use(instagramRouter);

    app.listen(port, () => {
      console.log(`Server is up & running on http://${hostname}:${port}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  });

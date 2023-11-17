import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import authRoute from "./routes/authRoute";
import instagramRouter from "./routes/mainRoute";
import { configureAuthentication } from "./auth";

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

    app.use(authRoute);
    app.use(instagramRouter);

    app.listen(port, () => {
      console.log(`Server is up & running on http://${hostname}:${port}.`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  });

// yes

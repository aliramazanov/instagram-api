import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import http from "http";
import mongoose from "mongoose";
import { configureAuthentication } from "./auth";
import authRoute from "./routes/authRoute";
import postRouter from "./routes/postRoute";
import userRouter from "./routes/userRoute";
import { startSocket } from "./socket";

dotenv.config();

const startServer = async () => {
  const app = configureAuthentication(express());
  const server = http.createServer(app);

  app.use(cors());

  const port: number = parseInt(process.env.PORT as string);
  const hostname: string = process.env.HOST as string;
  const uri = process.env.URI as string;

  try {
    await mongoose.connect(uri);

    console.log("Application successfully connected to the Database");
    app.use(authRoute);
    app.use(userRouter);
    app.use(postRouter);

    server.listen(port, () => {
      console.log(`Server is up & running on http://${hostname}:${port}`);
    });

    startSocket(server);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

startServer();

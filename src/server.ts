import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import instagramRouter from "./routes/newsroute";

const app = express();
app.use(express.json());
dotenv.config();

const port: number = parseInt(process.env.PORT || "4000", 10);
const hostname: string = process.env.HOST || "localhost";
const uri = process.env.URI || "";

mongoose
  .connect(uri)
  .then(() => {
    console.log("Application successfully connected to the Database");
    app.listen(port, () => {
      console.log(`Server is up & running on http://${hostname}:${port}.`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  });

app.use(instagramRouter);

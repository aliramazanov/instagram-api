import express from "express";
import passport from "passport";
import bcrypt from "bcrypt";
import { User } from "../models/userModel";
import jwt from "jsonwebtoken";

const authRoute = express.Router();

authRoute.post("/api/register", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = new User({
      username: req.body.username,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).send("User registered successfully");
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).send("Registration failed");
  }
});

authRoute.post("/api/login", passport.authenticate("local"), (req, res) => {
  res.send("Login successful");
});

export default authRoute;

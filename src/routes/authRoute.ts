import express, { NextFunction, Request, Response } from "express";
import passport from "passport";
import bcrypt from "bcrypt";
import { User } from "../models/userModel";
import jwt from "jsonwebtoken";
import cors from "cors";

const authRoute = express.Router();
authRoute.use(cors());

const signToken = (id: string) => {
  const access = jwt.sign({ id }, process.env.SECRET_KEY as string, {
    expiresIn: "7d",
  });

  return access;
};

authRoute.post("/api/auth/register", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = new User({
      username: req.body.username,
      password: hashedPassword,
      email: req.body.email,
      fullname: req.body.fullname,
    });

    await newUser.save();
    res.status(201).send("User registered successfully");
  } catch (error: any) {
    console.error("Registration error:", error);
    res
      .status(500)
      .json({ error: "Registration failed", details: error.message });
  }
});

authRoute.post(
  "/api/auth/login",
  passport.authenticate("local", { failWithError: true }),
  (req: Request, res: Response) => {
    const { id }: any = req.user;
    const token = signToken(id);
    res.status(200).json({
      status: "Successfully logged in",
      token,
    });
  },
  (err: any, req: Request, res: Response, next: NextFunction) => {
    res.status(401).json({
      status: "Authentication failed",
      error: err.message,
    });
  }
);

export default authRoute;

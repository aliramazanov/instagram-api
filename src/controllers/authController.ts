import { Request, Response, NextFunction } from "express";
import passport from "passport";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/userModel";

const signToken = (id: string, username: string) => {
  const access = jwt.sign({ id, username }, process.env.SECRET_KEY as string, {
    expiresIn: "7d",
  });

  return access;
};

export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
};

export const loginUser = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate("local", { failWithError: true })(
    req,
    res,
    async () => {
      const { id, username }: any = req.user;
      const token = signToken(id, username);
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
};

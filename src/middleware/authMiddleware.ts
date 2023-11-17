import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/userModel";

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // 1) Getting token and check of it's there
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        status: "fail",
        message: "You are not logged in",
      });
    }

    // 2) Verification token
    const decoded = await jwt.verify(token, process.env.SECRET_KEY as string);

    // 3) Check if user still exists
    //@ts-ignore
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return res.status(401).json({
        status: "fail",
        message: "User doesn't exsists",
      });
    }

    // 4) Check if user changed password after the token was issued

    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser;

    next();
  } catch (error) {
    return res.status(401).json({
      status: "fail",
      error,
    });
  }
};

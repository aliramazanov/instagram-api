import express, { NextFunction, Request, Response } from "express";
import passport from "passport";
import { loginUser, registerUser } from "../controllers/authController";

const authRoute = express.Router();

authRoute.post("/auth/register", registerUser);
authRoute.post("/auth/login", loginUser);

authRoute.get(
  "/auth/google",
  (req: Request, res: Response, next: NextFunction) => {
    if (req.isAuthenticated()) {
      return res.redirect("/");
    }
    return passport.authenticate("google", {
      scope: ["profile", "email"],
    })(req, res, next);
  }
);

authRoute.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req: Request, res: Response) => {
    res.redirect("/");
  }
);

export default authRoute;

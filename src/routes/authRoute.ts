import express from "express";
import { loginUser, registerUser } from "../controllers/authController";

const authRoute = express.Router();

authRoute.post("/auth/register", registerUser);
authRoute.post("/auth/login", loginUser);

export default authRoute;

import express from "express";
import cors from "cors";
import { registerUser, loginUser } from "../controllers/authController";

const authRoute = express.Router();
authRoute.use(cors());

authRoute.post("/api/auth/register", registerUser);
authRoute.post("/api/auth/login", loginUser);

export default authRoute;

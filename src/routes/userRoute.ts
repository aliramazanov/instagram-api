import { Router } from "express";
import {
  getAllUsers,
  getAuthenticatedUser,
  updateUser,
  deleteUser,
} from "../controllers/userController";

const userRouter = Router();

userRouter.get("/api/users", getAllUsers);
userRouter.get("/api/users/user", getAuthenticatedUser);
userRouter.patch("/api/users/modify/:username", updateUser);
userRouter.delete("/api/users", deleteUser);

export default userRouter;

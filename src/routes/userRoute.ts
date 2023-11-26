import { Router } from "express";
import {
  getAllUsers,
  getAuthenticatedUser,
  updateUsername,
  updatePassword,
  updateEmail,
  updateFullName,
  deleteUser,
} from "../controllers/userController";

const userRouter = Router();

userRouter.get("/users/all", getAllUsers);
userRouter.get("/users/signedin", getAuthenticatedUser);
userRouter.patch("/users/modify/username", updateUsername);
userRouter.patch("/users/modify/email", updateEmail);
userRouter.patch("/users/modify/fullname", updateFullName);
userRouter.patch("/users/modify/password", updatePassword);
userRouter.delete("/users/delete", deleteUser);

export default userRouter;

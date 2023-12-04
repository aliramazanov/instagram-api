import { Router } from "express";
import {
  deleteUser,
  getAllUsers,
  getAuthenticatedUser,
  updateEmail,
  updateFullName,
  updatePassword,
  updateUsername,
  uploadProfilePhoto,
} from "../controllers/userController";

const userRouter = Router();

userRouter.get("/users/all", getAllUsers);
userRouter.get("/users/signedin", getAuthenticatedUser);
userRouter.patch("/users/modify/username", updateUsername);
userRouter.patch("/users/modify/email", updateEmail);
userRouter.patch("/users/modify/fullname", updateFullName);
userRouter.patch("/users/modify/password", updatePassword);
userRouter.post("/users/upload/photo", uploadProfilePhoto);
userRouter.delete("/users/delete", deleteUser);

export default userRouter;

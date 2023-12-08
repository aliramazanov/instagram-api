import { Router } from "express";
import {
  getAllUsers,
  getUserDetailsByUsername,
  getAuthenticatedUser,
  updateUsername,
  updateEmail,
  updateFullName,
  updatePassword,
  uploadProfilePhoto,
  followUser,
  unfollowUser,
  deleteUser,
} from "../controllers/userController";

const userRouter = Router();

userRouter.get("/users/all", getAllUsers);
userRouter.get("/users/get/:username", getUserDetailsByUsername);
userRouter.post("/users/signedin", getAuthenticatedUser);
userRouter.patch("/users/modify/username", updateUsername);
userRouter.patch("/users/modify/email", updateEmail);
userRouter.patch("/users/modify/fullname", updateFullName);
userRouter.patch("/users/modify/password", updatePassword);
userRouter.post("/users/upload/photo", uploadProfilePhoto);
userRouter.post("/users/follow", followUser);
userRouter.post("/users/unfollow", unfollowUser);
userRouter.delete("/users/delete", deleteUser);

export default userRouter;

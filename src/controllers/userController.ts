import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/userModel";
import { signToken } from "./authController";

dotenv.config();

interface DecodedToken {
  id: string;
  username: string;
}

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const allUsers = await User.find({}, "_id username email fullname posts");
    res.status(200).json({ users: allUsers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An unknown error occurred." });
  }
};

export const getUserDetailsByUsername = async (req: Request, res: Response) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username }).select("-password");
    if (!user) {
      res
        .status(404)
        .json({ error: "getUserDetailsByUsername: User not found" });
      return;
    }

    res.status(200).json({
      id: user._id,
      username: user.username,
      fullName: user.fullname,
      email: user.email,
      profilePhoto: user.profilePhoto,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "getUserDetailsByUsername: An error occurred on response",
    });
  }
};

export const getAuthenticatedUser = async (req: Request, res: Response) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    } else {
      res.status(404).json({ error: "error" });
      return;
    }

    const decodedToken = jwt.verify(
      token,
      process.env.SECRET_KEY || ""
    ) as DecodedToken;

    const user = await User.findById(decodedToken.id);

    if (!user) {
      res.status(404).json({ error: "getAuthenticatedUser: User not found" });
      return;
    }

    res.status(200).json({
      id: user._id,
      username: user.username,
      fullName: user.fullname,
      email: user.email,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "getAuthenticatedUser: An error occurred on response" });
  }
};

export const updateUsername = async (req: Request, res: Response) => {
  try {
    const { username, newUsername } = req.body;

    console.log("Received request", req.body);

    const trimmedUsername = newUsername ? newUsername.trim() : "";

    if (!trimmedUsername || typeof trimmedUsername !== "string") {
      console.error(
        "updateUsername: Invalid username in request body",
        trimmedUsername
      );
      return res
        .status(400)
        .send({ message: "updateUsername: Invalid username in request body" });
    }

    console.log("Processed newUsername", trimmedUsername);

    const existingUser = await User.findOne({ username });

    if (!existingUser) {
      console.error("User not found");
      return res
        .status(404)
        .send({ message: "updateUsername: User not found" });
    }

    const userId = existingUser._id;

    const updatedUser = await User.findOneAndUpdate(
      { username, _id: userId },
      { username: trimmedUsername },
      { new: true }
    );

    if (!updatedUser) {
      console.error("updateUsername: User not found after update");
      return res
        .status(404)
        .send({ message: "updateUsername: User not found" });
    }

    console.log("Username updated successfully");
    const newToken = signToken(updatedUser.id, updatedUser.username as string);
    return res.status(200).send({ updatedUser: updatedUser, token: newToken });
  } catch (error: Error | any) {
    console.error(error);

    if (error.name === "ValidationError") {
      return res
        .status(400)
        .send({ message: "Validation error", errors: error.errors });
    }

    if (error.name === "CastError" && error.kind === "ObjectId") {
      return res.status(400).send({ message: "Invalid user ID" });
    }

    console.error("An unknown error occurred");
    return res.status(500).send({
      message: "updateUsername: An unknown error occurred on response",
    });
  }
};

export const updateEmail = async (req: Request, res: Response) => {
  try {
    const { username, newEmail } = req.body;

    if (!newEmail || typeof newEmail !== "string") {
      return res.status(400).send({ message: "Invalid email in request body" });
    }

    const existingUser = await User.findOne({ username });

    if (!existingUser) {
      return res.status(404).send({ message: "updateEmail: User not found " });
    }

    const userId = existingUser._id;

    const updatedUser = await User.findOneAndUpdate(
      { username, _id: userId },
      { email: newEmail },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).send({ message: "updateEmail: User not found" });
    }

    console.log("Email updated successfully");
    const newToken = signToken(updatedUser.id, updatedUser.username as string);
    return res.status(200).send({ updatedUser: updatedUser, token: newToken });
  } catch (error: Error | any) {
    console.error(error);

    if (error.name === "ValidationError") {
      return res
        .status(400)
        .send({ message: "Validation error", errors: error.errors });
    }

    if (error.name === "CastError" && error.kind === "ObjectId") {
      return res.status(400).send({ message: "Invalid user ID" });
    }

    console.log("updateEmail: An unknown error occurred");
    res
      .status(500)
      .send({ message: "updateEmail: An unknown error occurred on response" });
  }
};

export const updateFullName = async (req: Request, res: Response) => {
  try {
    const { username, newFullname } = req.body;

    if (!newFullname || typeof newFullname !== "string") {
      return res
        .status(400)
        .send({ message: "updateFullName: Invalid full name in request body" });
    }

    const existingUser = await User.findOne({ username });

    if (!existingUser) {
      return res
        .status(404)
        .send({ message: "updateFullName: User not found" });
    }

    const userId = existingUser._id;

    const updatedUser = await User.findOneAndUpdate(
      { username, _id: userId },
      { fullname: newFullname },
      { new: true }
    );

    if (!updatedUser) {
      return res
        .status(404)
        .send({ message: "updateFullName: User not found" });
    }

    console.log("Full name updated successfully");
    const newToken = signToken(updatedUser.id, updatedUser.username as string);
    return res.status(200).send({ updatedUser: updatedUser, token: newToken });
  } catch (error: Error | any) {
    console.error(error);

    if (error.name === "ValidationError") {
      return res
        .status(400)
        .send({ message: "Validation error", errors: error.errors });
    }

    if (error.name === "CastError" && error.kind === "ObjectId") {
      return res.status(400).send({ message: "Invalid user ID" });
    }

    console.log("updateFullName: An unknown error occurred");
    res
      .status(500)
      .send({ message: "updateFullName: An unknown error occurred." });
  }
};

export const updatePassword = async (req: Request, res: Response) => {
  try {
    const { username, newPassword } = req.body;

    if (!newPassword || typeof newPassword !== "string") {
      return res
        .status(400)
        .send({ message: "Invalid password in request body" });
    }

    const existingUser = await User.findOne({ username });

    if (!existingUser) {
      return res.status(404).send({ message: "User not found" });
    }

    const userId = existingUser._id;

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const updatedUser = await User.findOneAndUpdate(
      { username, _id: userId },
      { password: hashedPassword },
      { new: true }
    );

    if (!updatedUser) {
      return res
        .status(404)
        .send({ message: "updatePassword: User not found" });
    }

    console.log("Password updated successfully");
    const newToken = signToken(updatedUser.id, updatedUser.username as string);
    return res.status(200).send({ updatedUser: updatedUser, token: newToken });
  } catch (error: Error | any) {
    console.error(error);

    if (error.name === "ValidationError") {
      return res
        .status(400)
        .send({ message: "Validation error", errors: error.errors });
    }

    if (error.name === "CastError" && error.kind === "ObjectId") {
      return res.status(400).send({ message: "Invalid user ID" });
    }

    console.log("updatePassword: An unknown error occurred");
    res.status(500).send({
      message: "updatePassword: An unknown error occurred on response",
    });
  }
};

export const uploadProfilePhoto = async (req: Request, res: Response) => {
  try {
    const { username, base64Image } = req.body;

    const existingUser = await User.findOne({ username });

    if (!existingUser) {
      return res
        .status(404)
        .send({ message: "uploadProfilePhoto: User not found" });
    }

    const userId = existingUser._id;

    if (base64Image) {
      const updatedUser = await User.findOneAndUpdate(
        { username, _id: userId },
        { profilePhoto: base64Image },
        { new: true }
      );

      if (!updatedUser) {
        return res
          .status(404)
          .send({ message: "uploadProfilePhoto: User not found" });
      }

      console.log("Profile photo uploaded successfully");
      const newToken = signToken(
        updatedUser.id,
        updatedUser.username as string
      );
      return res
        .status(200)
        .send({ updatedUser: updatedUser, token: newToken });
    } else {
      return res.status(400).send({ message: "No base64Image received" });
    }
  } catch (error: any) {
    console.error(error);
    return res.status(500).send({
      message: "uploadProfilePhoto: An unknown error occurred on response",
    });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    let token = "";

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    } else {
      return res
        .status(401)
        .json({ message: "deleteUser: User not authenticated" });
    }

    const decodedToken = jwt.verify(token, process.env.SECRET_KEY || "") as {
      id: string;
    };

    const userId = decodedToken.id;

    if (!userId) {
      return res
        .status(401)
        .json({ message: "deleteUser: User not authenticated" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "deleteUser: User not found" });
    }

    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: "deleteUser: User not found" });
    }

    return res.status(200).json({ message: "User has been deleted" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "deleteUser: An unknown error occurred on response" });
  }
};

export const followUser = async (req: Request, res: Response) => {
  try {
    const { username, usernameToFollow } = req.body;

    if (!username || !usernameToFollow) {
      return res.status(400).json({
        message: "followUser: Missing required information in the request body",
      });
    }

    const authToken = req.headers.authorization?.split(" ")[1] || "";
    const decodedToken = jwt.verify(
      authToken,
      process.env.SECRET_KEY || ""
    ) as DecodedToken;
    const authenticatedUserId = decodedToken.id;

    if (username !== decodedToken.username) {
      return res
        .status(401)
        .json({ message: "followUser: Unauthorized action: Invalid username" });
    }

    const userToFollow = await User.findOne({ username: usernameToFollow });

    if (!userToFollow) {
      return res
        .status(404)
        .json({ message: "followUser: User to follow not found" });
    }

    const updatedAuthenticatedUser = await User.findByIdAndUpdate(
      authenticatedUserId,
      { $addToSet: { following: userToFollow._id } },
      { new: true }
    );

    if (!updatedAuthenticatedUser) {
      return res
        .status(404)
        .json({ message: "followUser: Authenticated user not found" });
    }

    const updatedUserToFollow = await User.findByIdAndUpdate(
      userToFollow._id,
      { $addToSet: { followers: authenticatedUserId } },
      { new: true }
    );

    if (!updatedUserToFollow) {
      return res
        .status(404)
        .json({ message: "followUser: User to follow not found after update" });
    }

    const newToken = signToken(
      updatedAuthenticatedUser.id,
      updatedAuthenticatedUser.username as string
    );
    res.status(200).json({
      authenticatedUser: updatedAuthenticatedUser,
      userToFollow: updatedUserToFollow,
      token: newToken,
    });
  } catch (error: any) {
    console.error(error);

    if (error.name === "JsonWebTokenError") {
      return res
        .status(401)
        .json({ message: "Invalid token: Authentication failed" });
    }

    res.status(500).json({
      message: error.message || "followUser: An unknown error occurred.",
    });
  }
};

export const unfollowUser = async (req: Request, res: Response) => {
  try {
    const { username, usernameToUnfollow } = req.body;

    if (!username || !usernameToUnfollow) {
      return res.status(400).json({
        message:
          "unfollowUser: Missing required information in the request body",
      });
    }

    const authToken = req.headers.authorization?.split(" ")[1] || "";
    const decodedToken = jwt.verify(
      authToken,
      process.env.SECRET_KEY || ""
    ) as DecodedToken;
    const authenticatedUserId = decodedToken.id;

    if (username !== decodedToken.username) {
      return res.status(401).json({
        message: "unfollowUser: Unauthorized action: Invalid username",
      });
    }

    const userToUnfollow = await User.findOne({ username: usernameToUnfollow });

    if (!userToUnfollow) {
      return res
        .status(404)
        .json({ message: "unfollowUser: User to unfollow not found" });
    }

    const updatedAuthenticatedUser = await User.findByIdAndUpdate(
      authenticatedUserId,
      { $pull: { following: userToUnfollow._id } },
      { new: true }
    );

    if (!updatedAuthenticatedUser) {
      return res
        .status(404)
        .json({ message: "unfollowUser: Authenticated user not found" });
    }

    const updatedUserToUnfollow = await User.findByIdAndUpdate(
      userToUnfollow._id,
      { $pull: { followers: authenticatedUserId } },
      { new: true }
    );

    if (!updatedUserToUnfollow) {
      return res.status(404).json({
        message: "unfollowUser: User to unfollow not found after update",
      });
    }

    const newToken = signToken(
      updatedAuthenticatedUser.id,
      updatedAuthenticatedUser.username as string
    );
    res.status(200).json({
      authenticatedUser: updatedAuthenticatedUser,
      userToUnfollow: updatedUserToUnfollow,
      token: newToken,
    });
  } catch (error: any) {
    console.error(error);

    if (error.name === "JsonWebTokenError") {
      return res
        .status(401)
        .json({ message: "Invalid token: Authentication failed" });
    }

    res
      .status(500)
      .json({
        message: error.message || "unfollowUser: An unknown error occurred.",
      });
  }
};

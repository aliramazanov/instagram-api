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

export const getAuthenticatedUser = async (req: Request, res: Response) => {
  try {
    let token = "";

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
      res.status(404).json({ error: "User not found" });
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
    res.status(500).json({ error: "An error occurred" });
  }
};

export const updateUsername = async (req: Request, res: Response) => {
  try {
    const { username, newUsername } = req.body;

    console.log("Received updateUsername request", req.body);

    const trimmedUsername = newUsername ? newUsername.trim() : "";

    if (!trimmedUsername || typeof trimmedUsername !== "string") {
      console.error("Invalid username in request body", trimmedUsername);
      return res
        .status(400)
        .send({ message: "Invalid username in request body" });
    }

    console.log("Processed newUsername", trimmedUsername);

    const existingUser = await User.findOne({ username });

    if (!existingUser) {
      console.error("User not found");
      return res.status(404).send({ message: "User not found" });
    }

    const userId = existingUser._id;

    const updatedUser = await User.findOneAndUpdate(
      { username, _id: userId },
      { username: trimmedUsername },
      { new: true }
    );

    if (!updatedUser) {
      console.error("User not found after update");
      return res.status(404).send({ message: "User not found" });
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
    return res.status(500).send({ message: "An unknown error occurred." });
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
      return res.status(404).send({ message: "User not found" });
    }

    const userId = existingUser._id;

    const updatedUser = await User.findOneAndUpdate(
      { username, _id: userId },
      { email: newEmail },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).send({ message: "User not found" });
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

    console.log("An unknown error occurred");
    res.status(500).send({ message: "An unknown error occurred." });
  }
};

export const updateFullName = async (req: Request, res: Response) => {
  try {
    const { username, newFullname } = req.body;

    if (!newFullname || typeof newFullname !== "string") {
      return res
        .status(400)
        .send({ message: "Invalid full name in request body" });
    }

    const existingUser = await User.findOne({ username });

    if (!existingUser) {
      return res.status(404).send({ message: "User not found" });
    }

    const userId = existingUser._id;

    const updatedUser = await User.findOneAndUpdate(
      { username, _id: userId },
      { fullname: newFullname },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).send({ message: "User not found" });
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

    console.log("An unknown error occurred");
    res.status(500).send({ message: "An unknown error occurred." });
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
      return res.status(404).send({ message: "User not found" });
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

    console.log("An unknown error occurred");
    res.status(500).send({ message: "An unknown error occurred." });
  }
};

export const uploadProfilePhoto = async (req: Request, res: Response) => {
  try {
    const { username } = req.body;

    const existingUser = await User.findOne({ username });

    if (!existingUser) {
      return res.status(404).send({ message: "User not found" });
    }

    const userId = existingUser._id;

    if (req.file) {
      const base64Image = req.file.buffer.toString("base64");

      const updatedUser = await User.findOneAndUpdate(
        { username, _id: userId },
        { profilePhoto: base64Image },
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).send({ message: "User not found" });
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
      return res.status(400).send({ message: "No file received" });
    }
  } catch (error: any) {
    console.error(error);
    return res.status(500).send({ message: "An unknown error occurred." });
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
      return res.status(401).json({ message: "User not authenticated" });
    }

    const decodedToken = jwt.verify(token, process.env.SECRET_KEY || "") as {
      id: string;
    };

    const userId = decodedToken.id;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ message: "User has been deleted" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "An unknown error occurred." });
  }
};

import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { User } from "../models/userModel";
import { signToken } from "./authController";

dotenv.config();

interface DecodedToken {
  id: string;
  username: string;
}

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const allUsers = await User.find({}, "username");
    res.send({ users: allUsers });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "An unknown error occurred." });
  }
};

export const getAuthenticatedUser = async (req: Request, res: Response) => {
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
  res
    .status(200)
    .json({ id: decodedToken.id, username: decodedToken.username });
  return;
};

export const updateUsername = async (req: Request, res: Response) => {
  try {
    const { username, newUsername } = req.body;

    if (!newUsername || typeof newUsername !== "string") {
      return res
        .status(400)
        .send({ message: "Invalid username in request body" });
    }

    const existingUser = await User.findOne({ username });

    if (!existingUser) {
      return res.status(404).send({ message: "User not found" });
    }

    const userId = existingUser._id;

    const updatedUser = await User.findOneAndUpdate(
      { username, _id: userId },
      { username: newUsername },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).send({ message: "User not found" });
    }

    console.log("Username updated successfully");
    const newToken = signToken(updatedUser.id, updatedUser.username);
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
    const newToken = signToken(updatedUser.id, updatedUser.username);
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
    const newToken = signToken(updatedUser.id, updatedUser.username);
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
    const { username, newFullName } = req.body;

    if (!newFullName || typeof newFullName !== "string") {
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
      { fullname: newFullName },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).send({ message: "User not found" });
    }

    console.log("Full name updated successfully");
    const newToken = signToken(updatedUser.id, updatedUser.username);
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

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const userId = (req.user as any)?.id;

    if (!userId) {
      return res.status(401).send({ message: "User not authenticated" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { password } = req.body;

    if (!password) {
      return res.status(401).json({ message: "Password missing" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).send({ message: "User has been deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "An unknown error occurred." });
  }
};

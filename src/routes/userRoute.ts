import { Router, Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";
import { User } from "../models/userModel";

const userRouter = Router();

// The request for searching and finding users based on params:

userRouter.get("/api/users/:username", async (req: Request, res: Response) => {
  try {
    const { username } = req.params;

    if (!username || typeof username !== "string") {
      return res.status(400).send({ message: "Invalid username parameter" });
    }

    if (username.trim() === "") {
      return res.status(400).send({ message: "Username cannot be empty" });
    }

    const matchingUsers = await User.find(
      { username: new RegExp(username, "i") },
      "username"
    );

    if (matchingUsers.length === 0) {
      return res.status(404).send({ message: "No matching users found" });
    }

    const usernames = matchingUsers.map((user) => user.username);

    res.send(usernames);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "An unknown error occurred." });
  }
});

// The request for updating user data after checking:

userRouter.patch(
  "/api/users/modify/:username",
  async (req: Request, res: Response) => {
    try {
      const { username } = req.params;

      console.log("Updating user with username:", username);

      const { username: newUsername, password } = req.body;

      if (!newUsername || typeof newUsername !== "string") {
        return res
          .status(400)
          .send({ message: "Invalid username in request body" });
      }

      console.log("Updated user data:", { username: newUsername, password });

      const existingUser = await User.findOne({ username });

      if (!existingUser) {
        console.log("User not found");
        return res.status(404).send({ message: "User not found" });
      }

      const userId = existingUser._id;

      const updatedUserData: { username: string; password?: string } = {
        username: newUsername,
      };

      if (password && typeof password === "string") {
        updatedUserData.password = password;
      }

      const updatedUser = await User.findOneAndUpdate(
        { username, _id: userId },
        updatedUserData,
        { new: true }
      );

      if (!updatedUser) {
        console.log("User not found");
        return res.status(404).send({ message: "User not found" });
      }

      console.log("User updated successfully");
      return res.status(200).send(updatedUser);
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
  }
);

// The request for seleting your own account based on token and after password validation

userRouter.delete("/api/users", async (req: Request, res: Response) => {
  try {
    const userId = (req.user as any)?.id;
    const { password } = req.body;

    if (!userId || !password) {
      return res
        .status(401)
        .send({ message: "User not authenticated or password missing" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
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
});

export default userRouter;

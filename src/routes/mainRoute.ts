import { Router, Request, Response } from "express";
import { User } from "../models/userModel";
import { Post } from "../models/postModel";

const instagramRouter = Router();

instagramRouter.get("/api", async (req: Request, res: Response) => {
  try {
    const allUsers = await User.find({});
    res.send(allUsers);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "An unknown error occurred." });
  }
});

instagramRouter.get("/api/posts/:id", async (req: Request, res: Response) => {
  try {
    const post = await Post.findById(req.params.id);
    res.send(post);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "An unknown error occurred." });
  }
});

instagramRouter.post("/api", async (req: Request, res: Response) => {
  try {
    const newUser = {
      username: req.body.username,
      password: req.body.password,
    };
    const user = await User.create(newUser);
    return res.status(201).send(user);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "An unknown error occurred." });
  }
});

instagramRouter.delete("/api/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await User.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).json({ message: "User has not been found" });
    }
    return res.status(200).send({ message: "User has been deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "An unknown error occurred." });
  }
});

instagramRouter.post("/api/:id", async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;

    const newPost = new Post({
      user: userId,
      title: req.body.title,
      postUrl: req.body.url,
    });

    const savedPost = await newPost.save();

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $push: { posts: savedPost._id } },
      { new: true }
    );

    console.log(`Post added to user's posts: ${updatedUser}`);
    res.status(200).send({ message: "Post created successfully" });
  } catch (error) {
    console.error(`Error creating post: ${error}`);
    res.status(500).send({ message: "An unknown error occurred." });
  }
});

export default instagramRouter;

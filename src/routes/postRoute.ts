import { Request, Response, Router } from "express";
import { Post } from "../models/postModel";
import { protect } from "../middleware/authMiddleware";
import { User } from "../models/userModel";

const postRouter = Router();

// The request for fetching all the posts

postRouter.get("/api/posts", async (req: Request, res: Response) => {
  try {
    const allPosts = await Post.find({}, "title postUrl");

    if (allPosts.length === 0) {
      return res.status(404).send({ message: "No posts found" });
    }

    res.send(allPosts);
  } catch (error) {
    console.error(`Error fetching posts: ${error}`);
    res.status(500).send({ message: "An unknown error occurred." });
  }
});

postRouter.post("/api/posts", protect, async (req: Request, res: Response) => {
  try {
    const { id } = req.user as { id: any };
    const { title, url } = req.body;

    if (!title || !url) {
      return res.status(400).send({ message: "Title and URL are required." });
    }

    const newPost = new Post({
      user: id,
      title,
      postUrl: url,
    });

    const savedPost = await newPost.save();

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $push: { posts: savedPost._id } },
      { new: true }
    );

    if (!updatedUser) {
      throw new Error("User not found");
    }

    console.log(`Post added to user's posts: ${updatedUser}`);
    res.status(200).send({ message: "Post created successfully" });
  } catch (error) {
    console.error(`Error creating post: ${error}`);
    res.status(500).send({ message: "An unknown error occurred." });
  }
});

postRouter.delete("/api/posts/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await Post.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).json({ message: "Post has not been found" });
    }
    return res.status(200).send({ message: "Post has been deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "An unknown error occurred." });
  }
});

export default postRouter;

import { Request, Response, Router } from "express";
import { Post } from "../models/postModel";

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

export default postRouter;

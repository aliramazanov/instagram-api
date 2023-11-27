import { Router } from "express";
import {
  getAllPosts,
  createPost,
  deletePost,
  likePost,
} from "../controllers/postController";
import { protect } from "../middleware/authMiddleware";

const postRouter = Router();

postRouter.get("/api/posts", getAllPosts);
postRouter.post("/api/posts", protect, createPost);
postRouter.delete("/api/posts/:id", deletePost);
postRouter.post("/api/posts/:postId/like", likePost);

export default postRouter;

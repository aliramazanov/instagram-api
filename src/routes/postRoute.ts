import { Router } from "express";
import {
  getAllPosts,
  createPost,
  deletePost,
  likePost,
  addCommentToPost,
  uploadPost,
} from "../controllers/postController";
import { protect } from "../middleware/authMiddleware";

const postRouter = Router();

postRouter.get("/api/posts", getAllPosts);
postRouter.post("/api/posts", protect, createPost);
postRouter.post("/posts/upload", protect, uploadPost);
postRouter.delete("/api/posts/:id", deletePost);
postRouter.post("/api/posts/:postId/like", likePost);
postRouter.post("/api/posts/:postId/comment", addCommentToPost);

export default postRouter;

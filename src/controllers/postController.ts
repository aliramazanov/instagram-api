import { Request, Response } from "express";
import { Post } from "../models/postModel";
import { User } from "../models/userModel";

export async function getAllPosts(req: Request, res: Response) {
  try {
    const allPosts = await Post.find({}, "user title postUrl likes comments")
      .populate({
        path: "user",
        select: "username profilePhoto",
      })
      .populate({
        path: "comments.user",
        select: "username profilePhoto",
      });

    if (allPosts.length === 0) {
      return res.status(404).send({ message: "No posts found" });
    }

    res.send(allPosts);
  } catch (error) {
    console.error(`Error fetching posts: ${error}`);
    res.status(500).send({ message: "An unknown error occurred." });
  }
}

export async function createPost(req: Request, res: Response) {
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
}

export async function uploadPost(req: Request, res: Response) {
  try {
    const { id } = req.user as { id: any };
    const { title, base64Image } = req.body;

    if (!title || !base64Image) {
      return res.status(400).send({ message: "Title and Image are required." });
    }

    const newPost = new Post({
      user: id,
      title,
      postPhoto: base64Image,
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
}

export async function deletePost(req: Request, res: Response) {
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
}

export async function likePost(req: Request, res: Response) {
  try {
    const { postId } = req.params;
    const { userId } = req.body;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).send({ message: "Post not found" });
    }

    const userIndex = post.likes.indexOf(userId);

    if (userIndex === -1) {
      post.likes.push(userId);
    } else {
      post.likes.splice(userIndex, 1);
    }

    await post.save();

    res.status(200).send({ message: "Like toggled successfully", post });
  } catch (error) {
    console.error(`Error toggling like: ${error}`);
    res.status(500).send({ message: "An unknown error occurred." });
  }
}

export async function addCommentToPost(req: Request, res: Response) {
  try {
    const { postId } = req.params;
    const { userId, comment } = req.body;

    if (!userId || !comment) {
      return res
        .status(400)
        .send({ message: "User ID and comment text are required." });
    }

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).send({ message: "Post not found." });
    }

    const newComment = {
      user: userId,
      comment,
    };

    if (!post.comments) {
      post.comments = [];
    }

    post.comments.push(newComment);
    await post.save();

    res
      .status(201)
      .send({ message: "Comment added successfully", comment: newComment });
  } catch (error) {
    console.error(`Error adding comment: ${error}`);
    res.status(500).send({ message: "An unknown error occurred." });
  }
}

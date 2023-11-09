import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  postUrl: {
    type: String,
    required: true,
  },
});

export const Post = mongoose.model("post", postSchema);

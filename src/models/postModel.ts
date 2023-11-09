import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },
  title: {
    type: String,
    required: false,
  },
  postUrl: {
    type: String,
    required: false,
  },
});

export const Post = mongoose.model("post", postSchema);

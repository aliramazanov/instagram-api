import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    min: 4,
    max: 20,
  },
  password: {
    type: String,
    required: true,
    min: 8,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    max: 35,
  },
  fullname: {
    type: String,
    required: false,
  },
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
  ],
});

export const User = mongoose.model("user", userSchema);

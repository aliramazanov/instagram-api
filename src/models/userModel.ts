import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: function (): boolean {
      return !(this as any).googleId;
    },
    unique: true,
    min: 4,
    max: 20,
  },
  password: {
    type: String,
    required: function (): boolean {
      return !(this as any).googleId;
    },
    min: 8,
  },
  email: {
    type: String,
    required: false,
    unique: true,
    max: 35,
  },
  fullname: {
    type: String,
    required: false,
  },
  googleId: {
    type: String,
    required: false,
  },
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
  ],
  profilePhoto: {
    type: String,
    default: null,
  },
});

export const User = mongoose.model("User", userSchema);

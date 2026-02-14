const mongoose = require("mongoose");

const GoogleUserSchema = new mongoose.Schema(
  {
    googleId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    photo: {
      type: String,
      default: "",
    },
    refreshToken: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);
const GoogleUser=mongoose.model("GoogleUser", GoogleUserSchema);
module.exports = GoogleUser

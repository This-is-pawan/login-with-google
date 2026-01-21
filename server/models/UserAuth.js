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
      index: true,
    },

    photo: {
      type: String, 
      default: "",
    },

    isVerified: {
      type: Boolean,
      default: true, 
    },

    provider: {
      type: String,
      default: "google",
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
  {
    timestamps: true, 
  }
);

module.exports = mongoose.model("GoogleUser", GoogleUserSchema);

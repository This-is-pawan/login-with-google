const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/UserAuth");

const isrouter = express.Router();

// 🔒 JWT AUTH MIDDLEWARE
const isAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "No token provided",
      });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.ACCESS_SECRET);

    req.userId = decoded.userId;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

// 👤 CURRENT LOGGED-IN USER (REAL WORLD)
isrouter.get("/me", isAuth, async (req, res) => {
  const user = await User.findById(req.userId).select(
    "name email photo"
  );

  res.json({
    success: true,
    user,
  });
});

module.exports = isrouter;

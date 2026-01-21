const express = require("express");
const isrouter = express.Router();

// 🔒 Auth middleware
const isAuth = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({
      success: false,
      message: "Not authenticated",
    });
  }
  next();
};

// 👤 CURRENT LOGGED-IN USER
isrouter.get("/me", isAuth, (req, res) => {
  const { name, email, photo } = req.user;

  res.json({
    success: true,
    user: {
      name,
      email,
      photo,
    },
  });
});

module.exports = isrouter;

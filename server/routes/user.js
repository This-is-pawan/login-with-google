const express = require("express");
const jwt = require("jsonwebtoken");
const GoogleUser = require("../models/UserAuth");

const router = express.Router();

const isAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.sendStatus(401);

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.ACCESS_SECRET);

    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.sendStatus(401);
  }
};

router.get("/me", isAuth, async (req, res) => {
  const user = await GoogleUser.findById(req.userId).select(
    "name email photo role"
  );

  res.json({ success: true, user });
});

module.exports = router;

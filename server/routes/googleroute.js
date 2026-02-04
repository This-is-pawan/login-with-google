const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const GoogleUser = require("../models/UserAuth");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/generateTokens");

const router = express.Router();

/* =========================
   GOOGLE LOGIN
========================= */

router.get(
  "/login",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })
);

/* =========================
   GOOGLE CALLBACK
========================= */
router.get(
  "/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/login",
  }),
  async (req, res) => {
    try {
      const user = req.user;
       generateAccessToken(user._id);
  
      const refreshToken = generateRefreshToken(user._id);
   
      
      user.refreshToken = refreshToken;
      await user.save();

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.redirect(`${process.env.FRONTEND_URL}/auth-success`);
    } catch (err) {
      console.error(err);
      res.redirect(`${process.env.FRONTEND_URL}`);
    }
  }
);

/* =========================
   REFRESH TOKEN
========================= */
router.post("/refresh", async (req, res) => {
  try {
    const token = req?.cookies?.refreshToken;
    if (!token) return res.sendStatus(401);

    const payload = jwt.verify(token, process.env.REFRESH_SECRET);

    const user = await GoogleUser.findById(payload.userId);
    if (!user || user.refreshToken !== token) {
      return res.sendStatus(403);
    }

    const newAccessToken = generateAccessToken(user._id);
    res.json({ accessToken: newAccessToken });
  } catch (err) {
    res.sendStatus(403);
  }
});

/* =========================
   LOGOUT
========================= */
router.post("/logout", async (req, res) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });
  res.sendStatus(200);
});

module.exports = router;

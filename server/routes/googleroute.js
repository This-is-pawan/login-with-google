const express = require("express");
const passport = require("passport");
const router = express.Router();
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/generateTokens");


// 🔐 GOOGLE LOGIN
router.get(
  "/login-with-google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

// 🔁 GOOGLE CALLBACK
router.get(
  "/login-with-google/callback",
  passport.authenticate("google", { session: false }),
  async (req, res) => {
    try {
      const user = req.user;

      // 🔑 Generate tokens
      const accessToken = generateAccessToken(user._id);
      const refreshToken = generateRefreshToken(user._id);

      // 💾 Save refresh token in DB
      user.refreshToken = refreshToken;
      await user.save();

      // 🍪 Send refresh token as HTTP-only cookie
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,      // REQUIRED on Render / HTTPS
        sameSite: "none",  // REQUIRED for cross-site
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      // 🚀 Redirect frontend with access token
      res.redirect(
        `${process.env.FRONTEND_URL}`
      );
    } catch (error) {
      console.error(error);
      res.redirect(process.env.FRONTEND_URL + "/login");
    }
  }
);

// 🔄 REFRESH ACCESS TOKEN
router.post("/refresh", async (req, res) => {
  try {
    const token = req?.cookies?.refreshToken;
    if (!token) return res.sendStatus(401);

    const payload = require("jsonwebtoken").verify(
      token,
      process.env.REFRESH_SECRET
    );

    const newAccessToken = generateAccessToken(payload.userId);
    res.json({ accessToken: newAccessToken });
  } catch (err) {
    res.sendStatus(403);
  }
});

// 🚪 LOGOUT (REAL WORLD)
router.post("/logout", async (req, res) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });
  res.sendStatus(200);
});

module.exports = router;

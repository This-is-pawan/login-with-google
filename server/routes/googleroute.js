const express = require("express");
const passport = require("passport");
const router = express.Router();

// 🔐 Google Login
router.get(
  "/login-with-google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

// 🔁 Callback
router.get(
  "/login-with-google/callback",
  passport.authenticate("google", {
    successRedirect: process.env.FRONTEND_URL,
    failureRedirect: "/",
  })
);
router.get("/logout", (req, res, next) => {
  req.logout(err => {
    if (err) return next(err);
      res.redirect(process.env.FRONTEND_URL);
  });
});


module.exports = router;

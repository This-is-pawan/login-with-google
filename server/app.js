require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const passport = require("./config/passport");

const googleRoutes = require("./routes/googleroute");
const userRoutes = require("./routes/user");

const app = express();

app.set("trust proxy", 1);

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

app.use(passport.initialize());

app.use("/api/google", googleRoutes);
app.use("/api/user", userRoutes);

app.get("/", (req, res) => {
  res.json({ success: true, message: "Server running 🚀" });
});

module.exports = app;

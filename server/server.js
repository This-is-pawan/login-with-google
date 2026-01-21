require("dotenv").config(); // 🔥 MUST be first

const express = require("express");
const cors = require("cors");
const passport = require("passport");
const cookieParser = require("cookie-parser");

const router = require("./routes/googleroute");
const isrouter = require("./routes/user");
const connection = require("./config/db");

require("./config/passport"); // passport google strategy

const app = express();

// 🔗 DB CONNECTION
connection();

// 🌍 TRUST PROXY (Render / HTTPS)
app.set("trust proxy", 1);

// 🍪 COOKIE PARSER
app.use(cookieParser());

// 🌐 CORS
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

// 🔐 PASSPORT INIT (NO SESSION)
app.use(passport.initialize());

// 🛣 ROUTES
app.use("/", router);
app.use("/user", isrouter);

// 🏠 TEST ROUTE
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Server running successfully",
  });
});

// 🚀 START SERVER
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

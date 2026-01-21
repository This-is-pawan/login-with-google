const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
const session = require("express-session");
const express = require("express");
const app = express();
const passport=require('passport');
const router = require("./routes/googleroute");
const isrouter = require("./routes/user");
const connection = require("./config/db");
require('./config/passport')


connection();
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  }),
);
app.use(passport.initialize());
app.use(passport.session());

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);
app.use('/',router)
app.use('/user',isrouter)
app.get("/", (req, res) => {
  res.json({ success: false, message: "Home page is run successfully" });
});
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`server is listen on Port:${port}`);
});

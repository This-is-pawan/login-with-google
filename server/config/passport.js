const passport = require("passport");
const GoogleUser = require("../models/UserAuth");
const GoogleStrategy = require("passport-google-oauth20").Strategy;


passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.CALLBACK_URL_GOOGLE ,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await GoogleUser.findOne({ googleId: profile.id });

        if (!user) {
          user = await GoogleUser.create({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
            photo: profile.photos[0].value,
          });
        }

        user.lastLogin = new Date();
        await user.save();

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

module.exports = passport;

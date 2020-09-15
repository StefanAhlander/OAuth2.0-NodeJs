const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20");
const KEYS = require("./keys");
const User = require("../models/user-model");

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

passport.use(
  new GoogleStrategy(
    {
      // options for google strat
      clientID: KEYS.google.client_id,
      clientSecret: KEYS.google.client_secret,
      callbackURL: "/auth/google/redirect ",
    },
    async (accessToken, refreshToken, profile, done) => {
      let user;
      user = await User.findOne({ googleId: profile.id });
      if (user) {
        // already have user
      } else {
        user = await new User({
          googleId: profile.id,
          userName: profile.displayName,
          thumbnail: profile._json.picture,
        }).save();
      }
      done(null, user);
    }
  )
);

const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const { User } = require("../models/user"); // Ensure this path is correct
require("dotenv").config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
          // Create a new user if one doesn't exist
          user = new User({
            name: profile.displayName,
            email: profile.emails[0].value,
            googleId: profile.id,
            type: 'buyer', // Set the type according to your logic (e.g., buyer, seller)
          });
          await user.save();
        } else {
          // Optionally update user details if needed (e.g., refresh token, profile changes)
          user.name = profile.displayName;
          user.email = profile.emails[0].value; // Update email if necessary
          await user.save();
        }

        // Pass the user to the done callback, along with the access token
        done(null, { id: user.id, email: user.email, type: user.type, accessToken });
      } catch (error) {
        done(error, null);
      }
    }
  )
);

// Serialize and deserialize user for session support
passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser((id, done) => {
  User.findById(id)
    .then((user) => done(null, user))
    .catch((error) => done(error, null));
});

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('./models/User'); // Adjust the path as needed

passport.use(new GoogleStrategy({
  clientID: '948804205305-4icgftablgekvc0a9bl0b9lbc8mjru20.apps.googleusercontent.com',
  clientSecret: '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',
  callbackURL: 'http://localhost:3000/auth/google/callback'
},
async (accessToken, refreshToken, profile, done) => {
  try {
    // Check if user already exists in the database
    let user = await User.findOne({ googleId: profile.id });
    if (!user) {
      // If user doesn't exist, create a new user
      user = new User({
        googleId: profile.id,
        username: profile.emails[0].value,
        name: profile.displayName,
        profilePhoto: profile.photos[0].value
      });
      await user.save();
    }
    done(null, user);
  } catch (err) {
    done(err, null);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});
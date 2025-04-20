const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const session = require('express-session');
const cors = require('cors');
const app = express();
const port = 3000;

require('./passportConfig'); // Import the Passport configuration

app.use(express.json()); // for parsing application/json
app.use(cors());
app.use(session({ secret: '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', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// MongoDB connection URI
const uri = "mongodb+srv://elinakocarslan:uwGUyz0xsZSUeN6m@befit.8omrs.mongodb.net/?retryWrites=true&w=majority&appName=BeFit";

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverSelectionTimeoutMS: 20000 })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// User Schema, everything that needs to be conencted to a user
const UserSchema = new mongoose.Schema({
  googleId: { type: String, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String },
  name: { type: String },
  bio: { type: String },
  profilePhoto: { type: String } // profile image URL
});

const User = mongoose.model('User', UserSchema);

// Sign-up endpoint
app.post('/signup', async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log('Signup request received:', req.body); // Log the received data

    // Check if user exists
    const userExists = await User.findOne({ username });
    if (userExists) {
      console.log('User already exists');
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save new user
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();
    console.log('User created successfully');

    res.status(201).json({ message: 'User created' });
  } catch (err) {
    console.error('Error during signup:', err); // Log the full error
    res.status(500).json({ message: 'Server error' });
  }
});

// Login endpoint
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log('Login request received:', req.body); // Log the received data

    // Check if user exists
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    // If login is successful, return userId
    res.status(200).json({ message: 'Login successful', userId: user._id });
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Google OAuth endpoints
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    // Successful authentication, redirect to profile
    res.redirect('/profile');
  }
);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// New endpoint, when users login they can now edit their profile information
app.put('/profile', async (req, res) => {
  try {
    const { userId, name, bio, profilePhoto } = req.body;

    // Locate the user by ID and update their info
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, bio, profilePhoto },
      { new: true }
    );

    res.json({ message: 'Profile updated!', user: updatedUser });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
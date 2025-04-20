

const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const app = express();
const port = 3000;


app.use(express.json()); // for parsing application/json

// MongoDB connection URI
const uri = "mongodb+srv://elinakocarslan:uwGUyz0xsZSUeN6m@befit.8omrs.mongodb.net/?retryWrites=true&w=majority&appName=BeFit";

const cors = require('cors');
app.use(cors());

mongoose.connect(uri, { serverSelectionTimeoutMS: 20000 })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String },
  bio: { type: String }, 
  profilePhoto: { type: String },
  numberOfPosts: { type: Number, default: 0 },
  friends: { type: Number, default: 0 },
  followers: { type: Number, default: 0 }
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
    const user = await User.findOne({ username }, { name: 1, _id: 1, password: 1 });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }
    console.log('User found:', user);

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    // If login is successful
    res.status(200).json({ 
      userId: user._id,   // Send back the user ID
      userName: user.name 
    });
    console.log(user._id, "server.js");
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

//new endpoint, when users login they can now edit their profile information 
app.put('/profile', async (req, res) => {
  try {
    const { userId, name, bio, profilePhoto } = req.body;

    // locate the user by ID and update their info
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

app.get('/profile/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Find user by ID
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Send user data
    res.status(200).json({
      username: user.username,
      bio: user.bio,
      photo: user.profilePhoto,
      numberOfPosts: 0, // Replace with actual post count logic if needed
      friends: 0, // Replace with actual friends count logic if needed
    });
  } catch (err) {
    console.error('Error fetching profile:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

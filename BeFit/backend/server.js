
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const port = 3000;
const { getIpAddress } = require('../app/(login)/ipConfig'); 

const app = express();
// const ip = 'http://10.136.226.222:3000';
const ip = getIpAddress();

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');  // Store uploaded images in the 'uploads' folder
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));  // Generate a unique filename
  },
});

const upload = multer({ storage: storage });

app.use(express.json()); // for parsing application/json
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve the uploads directory

// MongoDB connection URI
const uri = "mongodb+srv://elinakocarslan:uwGUyz0xsZSUeN6m@befit.8omrs.mongodb.net/?retryWrites=true&w=majority&appName=BeFit";

mongoose.connect(uri, { serverSelectionTimeoutMS: 20000 })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// User Schema, everything that needs to be conencted to a user
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String },
  bio: { type: String }, 
  profilePhoto: { type: String }, // profile image URL
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]

});

const User = mongoose.model('User', UserSchema);

// Post Schema for storing user posts
const PostSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  imageUrl: { type: String, required: true },
  caption: { type: String },
  createdAt: { type: Date, default: Date.now },
  createdAtFormatted: {type: String}
});


const Post = mongoose.model('Post', PostSchema);

//save photo files to folder in database
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

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

// Search for users by username (for friend search)
app.get('/users', async (req, res) => {
  try {
    const search = req.query.search || '';
    const users = await User.find({
      username: { $regex: search, $options: 'i' }
    }).select('username _id'); // Return only username and _id

    res.json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ message: 'Server error' });
  }
});



app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


// Create a new post endpoint
app.post('/posts', upload.single('image'), async (req, res) => {
  try {
    const { userId, caption } = req.body;

    const imageUrl = `${ip}/uploads/${req.file.filename}`; 

    // Create new post
    const newPost = new Post({
      userId,
      imageUrl,
      caption
    });

    await newPost.save();
    res.status(201).json({ message: 'Post created successfully', post: newPost });
  } catch (err) {
    console.error('Error creating post:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

//get user specific posts
app.get('/posts/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    const posts = await Post.find({ userId }) // filter by logged-in user's ID
      .sort({ createdAt: -1 })
      .populate('userId', 'username');

    res.json(posts);
  } catch (err) {
    console.error('Error fetching user-specific posts:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/posts', async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate('userId', 'username');

    console.log(`Fetched ${posts.length} posts`);
    
    // Log a sample post for debugging
    if (posts.length > 0) {
      console.log('Sample post imageUrl:', posts[0].imageUrl);
    }
    
    res.json(posts);
  } catch (err) {
    console.error('Error fetching posts:', err);
    res.status(500).json({ message: 'Server error' });
  }
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




// Search for users by username (for friend search)
app.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate('friends', 'username _id profilePhoto'); // Populate friends data

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/posts/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    const posts = await Post.find({ userId }) // filter by logged-in user's ID
      .sort({ createdAt: -1 })
      .populate('userId', 'username');

    res.json(posts);
  } catch (err) {
    console.error('Error fetching user-specific posts:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST friends to your array
app.post('/users/:userId/friends/:friendId', async (req, res) => {
  const { userId, friendId } = req.params;

  console.log(`Request to add friend: userId = ${userId}, friendId = ${friendId}`);

  try {
    // Find both user and friend in the database
    const user = await User.findById(userId);
    const friend = await User.findById(friendId);
    
    // Log the found users
    console.log('User found:', user);
    console.log('Friend found:', friend);

    // Check if both user and friend exist
    if (!user || !friend) {
      console.error('User or friend not found.');
      return res.status(404).json({ message: 'User or friend not found' });
    }

    // Check if friend is already in the user's friend list
    if (!user.friends.some(f => f.toString() === friendId)) {
      console.log(`Adding friend with ID: ${friendId} to user with ID: ${userId}`);
      user.friends.push(friendId);
      await user.save();
      console.log('User after adding friend:', user);
    } else {
      console.log(`Friend with ID: ${friendId} already exists in user ${userId}'s friends list.`);
    }

    res.status(200).json(user); // Send the updated user object back to the client
  } catch (err) {
    console.error('Error adding friend:', err);
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

    // Use exactly the same query as in the posts/:userId endpoint
    const postCount = await Post.countDocuments({ userId });
    // use the friends array from users to get the number of friends 
    const friendCount = user.friends.length;
    
    // Send user data
    res.status(200).json({
      username: user.username,
      bio: user.bio,
      photo: user.profilePhoto,
      numberOfPosts: postCount,
      friends: friendCount, 
    });
  } catch (err) {
    console.error('Error fetching profile:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


app.get('/users', async (req, res) => {
  try {
    const search = req.query.search || '';

    // Use regex for case-insensitive partial match
    const users = await User.find({
      username: { $regex: search, $options: 'i' }
    }).select('_id username');

    res.json(users);
  } catch (err) {
    console.error('Error searching users:', err);
    res.status(500).json({ message: 'Server error' });
  }
});



app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.get('/posts/friends/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).populate('friends');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const friendIds = user.friends.map(friend => friend._id);
    friendIds.push(user._id); // include user's own posts

    const posts = await Post.find({ userId: { $in: friendIds } })
      .sort({ createdAt: -1 })
      .populate('userId', 'username');

    res.json(posts);
  } catch (err) {
    console.error('Error fetching feed posts:', err);
    res.status(500).json({ message: 'Server error' });
  }
});
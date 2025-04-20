
// const { MongoClient } = require('mongodb');
// const uri = "mongodb+srv://elinakocarslan:uwGUyz0xsZSUeN6m@befit.8omrs.mongodb.net/?retryWrites=true&w=majority&appName=BeFit";

// // Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(uri);

// async function listDatabases(client){
//     databasesList = await client.db().admin().listDatabases();
//     console.log("Databases:");
//     databasesList.databases.forEach(db => console.log(` - ${db.name}`));
// };

// async function run() {
//   try {
//     const database = client.db('sample_mflix');
//     const movies = database.collection('movies');
//     // Query for a movie that has the title 'Back to the Future'
//     const query = { title: 'Back to the Future' };
//     const movie = await movies.findOne(query);
//     console.log(movie);
//     // Connect the client to the server	(optional starting in v4.7)
//     // await client.connect();
//     // // Send a ping to confirm a successful connection
//     // await client.db("admin").command({ ping: 1 });
//     // console.log("Pinged your deployment. You successfully connected to MongoDB!");
//     // await  listDatabases(client);
//   } finally {
//     // Ensures that the client will close when you finish/error
//     await client.close();
//   }
// }
// run().catch(console.dir);

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

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverSelectionTimeoutMS: 20000 })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// User Schema, everything that needs to be conencted to a user
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
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
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    res.json({ userId: user._id, username: user.username, bio: user.bio });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});


app.get('/api/profile', async (req, res) => {
  const user = await User.findOne(); // Change this to find by user ID
  res.json(user);
});

// Update user profile
app.put('/api/profile', async (req, res) => {
  const { username, bio, photo } = req.body;
  await User.findOneAndUpdate({}, { username, bio, photo }); // Adjust query based on user ID
  res.json({ message: 'Profile updated' });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


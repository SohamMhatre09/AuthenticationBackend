const jwt = require('jsonwebtoken');
const express = require('express');

const { authenticateJwt, SECRET } = require("../middleware/auth");
const { User} = require("../db");
const router = express.Router();

router.post('/signup', async (req, res) => {
  const { fname, lname, username, password, email } = req.body;
  const existingUsername = await User.findOne({ username });
  if (existingUsername) {
    return res.status(403).json({ message: 'Username already exists' });
  }
  const existingEmail = await User.findOne({ email });
  if (existingEmail) {
    return res.status(403).json({ message: 'Email already exists' });
  }
  const newUser = new User({ fname, lname, username, password, email });
  await newUser.save();
  const token = jwt.sign({ username }, SECRET, { expiresIn: '1h' });
  res.json({ message: 'User created successfully', token });
});


router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });

  if (user) {
    if (password === user.password) {
      const token = jwt.sign({ username }, SECRET, { expiresIn: '1h' });
      res.json({ message: 'Logged in successfully', token });
    } else {
      res.status(403).json({ message: 'Invalid username or password' });
    }
  } else {
    res.status(403).json({ message: 'Invalid username or password' });
  }
});


router.get("/me", authenticateJwt, async (req, res) => {
  try {
    const user = await User.findOne({ username: req.user.username });
    if (!user) {
      return res.status(403).json({ msg: "User not found" });
    }
    res.json({
      name: user.fname,
      id: user._id
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving user' });
  }
});


module.exports = router;

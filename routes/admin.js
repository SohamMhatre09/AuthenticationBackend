const jwt = require('jsonwebtoken');
const express = require('express');
const bcrypt = require('bcrypt');
const { authenticateJwt, SECRET } = require("../middleware/auth");
const { Admin } = require("../db");
const router = express.Router();
// Signup route
router.post('/signup', async (req, res) => {
  const { username, password } = req.body;
  try {
    // Check if username already exists
    const existingUser = await Admin.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }
    // Create a new admin user
    const newUser = new Admin({ username, password });
    await newUser.save();
    res.status(201).json({ message: 'Admin user created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating admin user' });
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await Admin.findOne({ username });
    if (user) {
      // Compare passwords directly without hashing
      if (password === user.password) {
        const token = jwt.sign({ username }, SECRET, { expiresIn: '1h' });
        return res.json({ message: 'Logged in successfully', token });
      } else {
        return res.status(403).json({ message: 'Invalid username or password' });
      }
    } else {
      return res.status(403).json({ message: 'Invalid username or password' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error logging in' });
  }
});


router.get("/me", authenticateJwt, async (req, res) => {
  try {
    const user = await Admin.findOne({ username: req.user.username });
    if (!user) {
      return res.status(403).json({ message: "User not found" });
    }
    res.json({
      name: user.username,
      id: user._id
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving user' });
  }
});

module.exports = router;

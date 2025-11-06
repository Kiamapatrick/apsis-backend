const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/users');

// GET all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find().select('-password'); // Exclude password
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET a user by ID
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST add a new user
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    const newUser = new User({ name, email, phone, password });
    await newUser.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT update a user
router.put('/:id', async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Only update password if it's provided
    if (password) user.password = password;
    if (name) user.name = name;
    if (email) user.email = email;
    if (phone) user.phone = phone;

    await user.save();
    res.json({ message: 'User updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE a user
router.delete('/:id', async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ error: 'User not found' });
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/users/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    res.status(200).json({ message: 'Login successful', user });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

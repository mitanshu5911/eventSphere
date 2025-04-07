const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

const { authenticateUser } = require('../middlewares/auth');
const {
  createOrUpdateProfile,
  getProfile,
  deleteProfile,
} = require('../controllers/EventManagerController');

const JWT_SECRET = process.env.JWT_SECRET;

router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, userType } = req.body;

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({ name, email, password: hashedPassword, userType });
    await user.save();

    res.status(201).json({ msg: 'User registered successfully' });
  } catch (error) {
    console.error('Signup error:', error.message);
    res.status(500).send('Server error');
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    const payload = { user: { id: user._id, userType: user.userType, email: user.email } };

    jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
      if (err) throw err;
      // Return the complete user object with _id, email, and userType
      res.json({ token, user: { _id: user._id, email: user.email, userType: user.userType } });
    });
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).send('Server error');
  }
});



// Profile Routes
router.post('/event-managers-data', createOrUpdateProfile);
// router.get('/event-managers-data/:userId', getProfile);

// Uncomment and implement when ready
// router.delete('/event-managers-data/:userId', authenticateUser, deleteProfile);

module.exports = router;

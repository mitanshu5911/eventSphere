const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();
const Booking = require('../models/Booking');
// const EventManagerProfile = require('../models/EventManagerProfile');
const { authenticateUser } = require('../middlewares/auth');
const {
  createOrUpdateProfile,
  getEventManagers
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
      res.json({ token, user: { _id: user._id, email: user.email, userType: user.userType, name:user.name } });
    });
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).send('Server error');
  }
});

router.post('/bookings', async (req, res) => {
  try {
    const { eventManagerId, userId, email, name, phone, eventType, dateFrom, dateTo, description } = req.body;

    const newBooking = new Booking({
      eventManagerId,
      userId,
      email,
      name,
      phone,
      eventType,
      dateFrom,
      dateTo,
      description,
    });

    await newBooking.save();
    res.status(201).json(newBooking);
  } catch (err) {
    console.error('Error creating booking:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});



router.get('/event-manager/:eventManagerId', async (req, res) => {
  try {
    const { eventManagerId } = req.params;

    const bookings = await Booking.find({ eventManagerId }).populate('userId', 'name email phone');

    if (!bookings.length) {
      return res.status(404).json({ msg: 'No bookings found for this Event Manager' });
    }

    res.json(bookings);
  } catch (err) {
    console.error('Error fetching bookings:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

router.post('/event-managers-data', createOrUpdateProfile);
router.get('/event-managers', getEventManagers);


module.exports = router;

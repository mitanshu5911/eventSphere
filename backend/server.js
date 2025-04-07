const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const cloudinary = require('cloudinary').v2;
require('dotenv').config();

const app = express();

// Cloudinary Configuration (from .env)
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(cors());



// Routes
app.use('/api/auth', require('./routes/auth'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

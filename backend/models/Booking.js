const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  eventManagerId: {type: String, required: true},
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  email: { type: String, required: true },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  eventType: { type: String, required: true },
  dateFrom: { type: Date, required: true },
  dateTo: { type: Date, required: true },
  description: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
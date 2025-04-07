const mongoose = require('mongoose');

const eventManagerProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  businessName: { type: String, required: true },
  headOfOrganization: { type: String, required: true },
  address: { type: String },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  website: { type: String },
  description: { type: String },
  services: { type: [String] },
  priceRange: { type: String },
  experienceYears: { type: Number },
  cities: { type: [String] },
  availability: { type: String },
  otherCity: { type: String },
  images: { type: [String] },
  logo: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('EventManagerProfile', eventManagerProfileSchema);
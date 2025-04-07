const EventManagerProfile = require('../models/EventManager');

exports.createOrUpdateProfile = async (req, res) => {
  const {
    userId,
    businessName,
    headOfOrganization,
    address,
    phone,
    email,
    website,
    description,
    services,
    priceRange,
    experienceYears,
    cities,
    availability,
    otherCity,
    images,
    logo
  } = req.body;

  // ✅ Simple Manual Validation
  if (!userId || typeof userId !== 'string') {
    return res.status(400).json({ msg: 'Invalid or missing userId' });
  }

  if (!businessName || typeof businessName !== 'string') {
    return res.status(400).json({ msg: 'Invalid or missing businessName' });
  }

  if (!phone || typeof phone !== 'string') {
    return res.status(400).json({ msg: 'Invalid or missing phone' });
  }

  if (experienceYears && isNaN(Number(experienceYears))) {
    return res.status(400).json({ msg: 'experienceYears must be a number' });
  }

  if (services && !Array.isArray(services)) {
    return res.status(400).json({ msg: 'services must be an array of strings' });
  }

  if (cities && !Array.isArray(cities)) {
    return res.status(400).json({ msg: 'cities must be an array of strings' });
  }

  if (images && !Array.isArray(images)) {
    return res.status(400).json({ msg: 'images must be an array of strings' });
  }

  // All good, proceed to save/update profile
  const profileData = {
    businessName,
    headOfOrganization,
    address,
    phone,
    email,
    website,
    description,
    services,
    priceRange,
    experienceYears,
    cities,
    availability,
    otherCity,
    images,
    logo
  };

  try {
    const profile = await EventManagerProfile.findOneAndUpdate(
      { userId },
      profileData,
      { new: true, upsert: true, runValidators: true }
    );
    res.json(profile);
  } catch (err) {
    console.error("Error saving profile:", err);
    res.status(500).json({ msg: "Failed to save profile. Please try again." });
  }
};

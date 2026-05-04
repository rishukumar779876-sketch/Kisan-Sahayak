const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  email: String,
  location: { type: String, default: 'Mithapur, Bihar' },
  language: { type: String, default: 'en' },
  aadhaar: String,
  bankAccount: String,
  crops: [{
    name: String,
    icon: String,
    area: String,
    season: String,
    sowingDate: Date,
    growthStage: String,
    progress: Number,
    advice: String
  }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);

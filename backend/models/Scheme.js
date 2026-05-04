const mongoose = require('mongoose');

const schemeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  icon: String,
  category: { type: String, enum: ['सहायता', 'बीमा', 'उपकरण'] },
  benefit: String,
  description: String,
  eligibility: String,
  documents: String,
  deadline: String
});

module.exports = mongoose.model('Scheme', schemeSchema);

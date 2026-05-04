const express = require('express');
const Scheme = require('../models/Scheme');
const router = express.Router();

// Seed data (run once)
router.get('/seed', async (req, res) => {
  try {
    await Scheme.deleteMany({});
    const schemes = [
      { title: 'PM-KISAN', icon: '💰', category: 'सहायता', benefit: '₹6,000/वर्ष', description: 'छोटे किसानों के लिए', eligibility: '2 एकड़ तक', documents: 'आधार', deadline: 'हमेशा' },
      { title: 'फसल बीमा', icon: '🌾', category: 'बीमा', benefit: '90% सब्सिडी', description: 'प्राकृतिक आपदा सुरक्षा', eligibility: 'सभी किसान', documents: 'आधार', deadline: '30 जून' },
      { title: 'सोलर पंप', icon: '☀️', category: 'उपकरण', benefit: '75% सब्सिडी', description: 'सोलर वाटर पंप', eligibility: '5 एकड़ से कम', documents: 'आधार', deadline: '31 दिसंबर' }
    ];
    await Scheme.insertMany(schemes);
    res.json({ success: true, message: '3 schemes seeded' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/schemes - All schemes
router.get('/', async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = {};
    
    if (category) query.category = category;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const schemes = await Scheme.find(query).limit(20);
    res.json({ success: true, data: schemes });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/schemes/recommended
router.get('/recommended', async (req, res) => {
  try {
    const recommended = await Scheme.find({ category: 'सहायता' }).limit(3);
    res.json({ success: true, data: recommended });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;

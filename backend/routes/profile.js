const express = require('express');
const User = require('../models/User');
const router = express.Router();

// GET /api/profile
router.get('/', async (req, res) => {
  try {
    let user = await User.findOne({ phone: '+91 98765 43210' });
    if (!user) {
      user = await User.create({
        name: 'Ram Prasad Yadav',
        phone: '+91 98765 43210',
        email: 'ram@example.com',
        location: 'Mithapur, Bihar',
        crops: [
          { name: 'गेहूं', icon: '🌾', area: '2.5 एकड़', season: 'रबी 2024' },
          { name: 'धान', icon: '🌱', area: '1.5 एकड़', season: 'खरीफ 2024' }
        ]
      });
    }
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;

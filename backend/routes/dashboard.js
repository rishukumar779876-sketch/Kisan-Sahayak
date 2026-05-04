const express = require('express');
const User = require('../models/User');
const Alert = require('../models/Alert');
const router = express.Router();

// Mock market data (can connect to real API later)
const mockMarket = [
  { name: 'Wheat', icon: '🌾', price: '₹2,240', change: '▲ +₹40', color: 'green' },
  { name: 'Paddy', icon: '🍚', price: '₹1,850', change: '▼ -₹20', color: 'blue' },
  { name: 'Maize', icon: '🌽', price: '₹1,680', change: 'Stable', color: 'yellow' }
];

// Mock weather
const axios = require('axios');

// GET Real Weather - OpenWeatherMap API
async function getRealWeather() {
  try {
    const apiKey = '9c35b3f7c371f0005552d8b91947d022';
    const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=Mithapur,IN&appid=${apiKey}&units=metric&lang=hi`);
    return {
      temp: Math.round(response.data.main.temp),
      condition: response.data.weather[0].description,
      humidity: response.data.main.humidity,
      wind: Math.round(response.data.wind.speed)
    };
  } catch (error) {
    console.error('Weather API Error:', error.message);
    return { temp: 32, condition: 'Light Rain', humidity: 78, wind: 12 }; // Fallback
  }
}

// GET /api/dashboard - Main dashboard data with real weather
router.get('/', async (req, res) => {
  try {
    const weather = await getRealWeather();
    
    // Demo user (find by phone or create demo)
    let user = await User.findOne({ phone: '+91 98765 43210' });
    if (!user) {
      user = await User.create({
        name: 'Ram Prasad Yadav',
        phone: '+91 98765 43210',
        location: 'मिथापुर, बिहार',
        crops: [
          { name: 'गेहूं (Wheat)', icon: '🌾', area: '2.5 एकड़', season: 'रबी 2024', progress: 65 },
          { name: 'धान (Paddy)', icon: '🌱', area: '1.5 एकड़', season: 'खरीफ 2024', progress: 90 }
        ]
      });
    }

    const alerts = await Alert.find({ userId: user._id }).limit(5).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: {
        weather,
        crops: user.crops,
        alerts: alerts.length || 4,
        market: mockMarket
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/dashboard/market
router.get('/market', (req, res) => {
  res.json({ success: true, data: mockMarket });
});

module.exports = router;

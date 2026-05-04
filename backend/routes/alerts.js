const express = require('express');
const Alert = require('../models/Alert');
const router = express.Router();

// GET /api/alerts - Get alerts (unread by default)
router.get('/', async (req, res) => {
  try {
    const { unreadOnly } = req.query;
    let query = {};
    
    if (unreadOnly === 'true') {
      query.read = false;
    }

    const alerts = await Alert.find(query).sort({ createdAt: -1 }).limit(10);
    res.json({ success: true, data: alerts });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/alerts/mark-read
router.post('/mark-read', async (req, res) => {
  try {
    const { alertIds } = req.body;
    await Alert.updateMany({ _id: { $in: alertIds } }, { read: true });
    res.json({ success: true, message: 'Alerts marked as read' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Seed demo alerts
router.get('/seed', async (req, res) => {
  try {
    const demoAlerts = [
      {
        title: 'अगले 2 दिन बारिश',
        category: 'मौसम',
        description: 'आज सुबह 9 बजे',
        suggestion: 'आज-कल खाद डालने से बचें।',
        type: 'weather',
        color: 'blue'
      },
      {
        title: 'गेहूं में एफिड कीट का हमला',
        category: 'कीट जोखिम',
        description: 'कल दोपहर 2 बजे',
        suggestion: 'नीम आधारित दवा 5 ml/L पानी में मिलाकर छिड़काव करें।',
        type: 'pest',
        color: 'amber'
      }
    ];
    await Alert.insertMany(demoAlerts);
    res.json({ success: true, message: 'Demo alerts seeded' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;

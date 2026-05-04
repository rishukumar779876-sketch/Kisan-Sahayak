const express = require('express');
const router = express.Router();

const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// POST /api/chat/send - Gemini AI Integration
router.post('/send', async (req, res) => {
  try {
    const { message, language = 'hi' } = req.body;
    
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = `You are Kisan Sahayak AI (farmer assistant). Respond in ${language === 'hi' ? 'Hindi' : 'English'} about farming/crops/schemes. Keep answers short (2-3 sentences), practical, use simple language. Question: ${message}`;
    
    const result = await model.generateContent(prompt);
    const aiResponse = await result.response.text();
    
    res.json({
      success: true,
      data: { message: aiResponse }
    });
  } catch (error) {
    console.error('Gemini AI Error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'AI service unavailable. Try again.' 
    });
  }
});

router.get('/quick-suggestions', (req, res) => {
  res.json({
    success: true,
    data: [
      'गेहूं की फसल में पीले पत्ते क्यों आ रहे हैं?',
      'धान की फसल में कीट लग गए हैं',
      'PM-Kisan की 15वीं किश्त कब आएगी?'
    ]
  });
});

module.exports = router;

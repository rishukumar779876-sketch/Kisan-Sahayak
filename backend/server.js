require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: 'http://localhost:5174',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  tls: true,
  family: 4
})
  .then(() => console.log('✅ MongoDB Connected - kisan_sahayak DB'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// Import Routes (will create next)
app.get('/health', (req, res) => res.json({ success: true, message: 'Kisan Sahayak API Live' }));

// Basic Routes Matching Frontend
app.use('/api/chat', require('./routes/chat'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/schemes', require('./routes/schemes'));
app.use('/api/alerts', require('./routes/alerts'));
app.use('/api/profile', require('./routes/profile'));

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
});

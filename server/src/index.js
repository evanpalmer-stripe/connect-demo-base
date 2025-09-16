const express = require('express');
const cors = require('cors');

// Load environment variables FIRST
require('dotenv').config();

// Debug environment variables immediately after loading
console.log('Environment variables loaded:');
console.log('PORT:', process.env.PORT);
console.log('CLIENT_BASE_URL:', process.env.CLIENT_BASE_URL);

// Import database configuration (this will initialize SQLite)
require('./config/database');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Import routes AFTER environment variables are loaded
const settingsRoutes = require('./routes/settingsRoutes');
const onboardingRoutes = require('./routes/onboardingRoutes');
const userRoutes = require('./routes/userRoutes');

// Routes
app.use('/api/settings', settingsRoutes);
app.use('/api/onboarding', onboardingRoutes);
app.use('/api/users', userRoutes);

app.get('/api/data', (req, res) => {
  res.json({
    message: 'Hello from the MERN stack server!',
    timestamp: new Date().toISOString(),
    status: 'success'
  });
});

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

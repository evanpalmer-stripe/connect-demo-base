const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import database configuration (this will initialize SQLite)
require('./config/database');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Debug environment variables
console.log('Environment variables:');
console.log('PORT:', process.env.PORT);

// Import routes
const settingsRoutes = require('./routes/settingsRoutes');

// Routes
app.use('/api/settings', settingsRoutes);

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

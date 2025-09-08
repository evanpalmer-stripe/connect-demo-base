const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Debug environment variables
console.log('Environment variables:');
console.log('PORT:', process.env.PORT);
console.log('MONGODB_URI:', process.env.MONGODB_URI);

// MongoDB connection
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/mern-demo';
console.log('Using MongoDB URI:', mongoUri);

mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB successfully');
})
.catch((error) => {
  console.error('MongoDB connection error:', error);
});

// Routes
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

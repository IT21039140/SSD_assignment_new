const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();
const connection = require('./dbconnection/dbconnection');
const orderRoutes = require('./routes/orders');

// Create an Express app
const app = express();

// Middleware
app.use(helmet()); // Use Helmet to secure your app
app.use(express.json());
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*', // Use a specific origin in production
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify allowed methods
  credentials: true, // Allow credentials if needed
}));

// Log requests
app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

// Routes
app.use('/api/orders', orderRoutes);

// Database connection
connection.once('open', () => {
  console.log('Order Service DB connected successfully!!');
});

// Handle database connection errors
connection.on('error', (err) => {
  console.error('Database connection error:', err);
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
  });
});

// Start the server
const PORT = process.env.PORT || 5005;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

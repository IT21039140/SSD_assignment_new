const express = require('express');
const cors = require('cors');
const proxy = require('express-http-proxy');
const helmet = require('helmet');
const cookieParser = require('cookie-parser'); // Import cookie parser
const csrf = require('csurf'); // Import CSRF protection middleware
require('dotenv').config();

// Create an Express app
const app = express();

// Use Helmet middleware to secure your app
app.use(helmet());

// CORS configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000', // Update this to your frontend's origin
  credentials: true,
  maxAge: 3600,
};

// Middleware
app.use(express.json());
app.use(cookieParser()); // Use cookie parser for handling cookies
app.use(cors(corsOptions));

// CSRF protection middleware
const csrfProtection = csrf({ cookie: true });
app.use(csrfProtection); // Enable CSRF protection

// CSRF token endpoint
app.get('/api/csrf-token', (req, res) => {
  res.json({ csrfToken: req.csrfToken() }); // Send CSRF token to the client
});

// Log incoming requests
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.path}`);
  next();
});

// Proxy routes
app.use('/api/stripe', proxy('http://localhost:5002'));
app.use('/api/orders', proxy('http://localhost:5003'));
app.use('/api/products', proxy('http://localhost:5004'));
app.use('/api/users', proxy('http://localhost:5005'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ message: 'Service is up and running' });
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error('Error occurred:', err.message);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
  });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

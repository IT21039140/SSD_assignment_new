require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const csrf = require('csurf'); // Import the CSRF middleware
const cookieParser = require('cookie-parser'); // Required for parsing cookies
const reviewRoutes = require('./routes/review');

// Create an Express app
const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(cookieParser()); // Use cookie-parser middleware
app.use(csrf({ cookie: true })); // Configure CSRF protection to use cookies

// Log requests
app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

// CSRF error handler middleware
app.use((err, req, res, next) => {
  if (err.code === 'EBADCSRFTOKEN') {
    // CSRF token validation failed
    res.status(403).json({ message: 'Invalid CSRF token' });
  } else {
    next(err);
  }
});

// Example route showing CSRF token
app.get('/api/csrf-token', (req, res) => {
  res.json({ csrfToken: req.csrfToken() }); // Send CSRF token to client
});

// Use review routes
app.use('/api/review', reviewRoutes);

// Connect to the database and start the server
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    // Listen for requests
    app.listen(process.env.PORT, () => {
      console.log('Connected to the database and listening on port', process.env.PORT);
    });
  })
  .catch((error) => {
    console.log(error);
  });

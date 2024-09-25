const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const cookieParser = require('cookie-parser'); // Import cookie parser
const csrf = require('csurf'); // Import CSRF protection middleware
const stripe = require('./routes/checkoutRoute');
const connection = require('./dbconnection/dbconnection');

dotenv.config();

const app = express();

// Use Helmet middleware to secure your app
app.use(helmet());

// Middleware
app.use(express.json());
app.use(cookieParser()); // Use cookie parser for handling cookies
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000', // Update this to your frontend's origin
  credentials: true,
}));

// CSRF protection middleware
const csrfProtection = csrf({ cookie: true });
app.use(csrfProtection); // Enable CSRF protection

// CSRF token endpoint
app.get('/api/csrf-token', (req, res) => {
  res.json({ csrfToken: req.csrfToken() }); // Send CSRF token to the client
});

// Serve static files
app.use(express.static('public'));

const PORT = process.env.PORT || 5002;

// Routes
app.use("/api/stripe", stripe);

// Database connection
connection.once('open', () => {
    console.log('Checkout Service DB connected successfully!!');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is up and running on PORT : ${PORT}`);
});

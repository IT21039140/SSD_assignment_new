require("dotenv").config();

const express = require("express");
const cors = require("cors");
const productsRout = require("./routes/products");
const connection = require("./dbconnection/dbconnection");
const helmet = require("helmet");

// Create an Express app
const app = express();

// Use Helmet middleware to secure your app
app.use(helmet());

// CORS configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN || "http://localhost:3000", // Set your frontend URL here
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"], // Specify allowed methods
};

// Middleware
app.use(express.json());
app.use(cors(corsOptions));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.path}`);
  next();
});

// Routes
app.use("/api/products", productsRout);

// Connect to the database
connection.once("open", () => {
  console.log("Product Service DB connected successfully!!");
});

// Handle connection errors
connection.on("error", (err) => {
  console.error("Database connection error:", err);
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error("Error occurred:", err.message);
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
});

// Start the server
const PORT = process.env.PORT || 5000; // Default to 5000 if PORT is not set
app.listen(PORT, () => {
  console.log("Listening on port", PORT);
});

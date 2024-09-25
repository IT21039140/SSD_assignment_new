const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const csrf = require("csurf"); // Import CSRF protection middleware
const cookieParser = require("cookie-parser"); // For handling cookies

const userRouter = require("./routes/userRouter");

dotenv.config();

const app = express();

// Middleware for security
app.use(helmet());
app.use(express.json());
app.use(cookieParser()); // Use cookie parser for CSRF token handling
app.use(cors({
  origin: true, // Set specific origins in production
  methods: ["POST"],
  credentials: true,
  maxAge: 3600,
}));

// CSRF protection
const csrfProtection = csrf({ cookie: true });
app.use(csrfProtection);

// CSRF token endpoint for client-side use
app.get("/api/csrf-token", (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

// Routes
app.use("/api/users", userRouter);

// Connect to MongoDB
const PORT = process.env.PORT || 5005;
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true, // Add this option for better connection management
}).then(() => {
  console.log("MongoDB connected successfully");
}).catch((error) => {
  console.error("MongoDB connection error:", error);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is up and running on port: ${PORT}`);
});

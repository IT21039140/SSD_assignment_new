const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const csrf = require("csurf");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const session = require("express-session");
require("./routes/authRouter"); // Ensure passportSetup.js is configured correctly
const userRouter = require("./routes/userRouter");

dotenv.config();

const app = express();

// Middleware for security
app.use(helmet());
app.use(express.json());
app.use(cookieParser()); // Use cookie parser before CSRF middleware

// CORS configuration to allow credentials and specific origins
app.use(
  cors({
    origin: "http://localhost:3000", // Replace with your frontend URL
    methods: ["GET", "POST", "PUT", "DELETE"], // Include necessary methods
    credentials: true, // Allow credentials to be included in requests
  })
);

// Session configuration for passport authentication
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// CSRF protection setup
const csrfProtection = csrf({ cookie: true });
app.use(csrfProtection);

// Endpoint to provide the CSRF token to the client
app.get("/api/csrf-token", (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

// Google Authentication Routes
app.get(
  "/api/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google OAuth callback route
app.get(
  "/api/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: false,
  }),
  (req, res) => {
    const token = req.user.token;
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: false,
      sameSite: "Lax",
    });
    res.redirect("http://localhost:3000/"); // Redirect to the frontend after login
  }
);

// User routes
app.use("/api/users", userRouter);

// Connect to MongoDB
const PORT = process.env.PORT || 5005;
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((error) => {
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

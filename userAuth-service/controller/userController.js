const { User, validate } = require("../models/user");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const bcrypt = require("bcrypt");
require("dotenv").config();

const validator = require("validator");
// Define validateUserCreation function for user input validation
const validateUserCreation = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required().label("Email"),
    password: Joi.string().min(6).required().label("Password"), // Minimum length for password
  });
  return schema.validate(data);
};
// Create a user
const createUser = async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error)
      return res.status(400).send({ message: error.details[0].message });


    // Check for the expected properties in req.body
    const { name,email, password ,type} = req.body;

    // Ensure email and password are of the correct type
    if (typeof email !== "string" || typeof password !== "string") {
      return res
        .status(400)
        .send({ message: "Email and password must be strings." });
    }

    // Sanitize and validate email input
    const trimmedEmail = email.trim(); // Trim whitespace
    if (!validator.isEmail(trimmedEmail)) {
      return res.status(400).send({ message: "Invalid email format" }); // Validate email format
    }
    const sanitizedEmail = validator.normalizeEmail(trimmedEmail); // Normalize the email (e.g., lowercasing)

    const userExists = await User.findOne({ email: sanitizedEmail });
    if (userExists) {
      return res
        .status(409)
        .send({ message: "User with given email already exists!" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(Number(process.env.SALT) || 10); // Default salt if not defined
    const hashPassword = await bcrypt.hash(password, salt);

    // Save only validated and sanitized data
    const newUser = new User({ name,email: sanitizedEmail, password: hashPassword ,type});
    await newUser.save();
    res.status(201).send({ message: "User created successfully" });
  } catch (error) {
    console.error(error); // Log error details
    res.status(500).send({ message: "Internal Server Error" });
  }
};

// Authenticate user
const authenticateUser = async (req, res) => {
  try {
    const { error } = validateAuth(req.body);
    if (error) return res.status(400).send({ message: "Invalid input" }); // Generic error message

    // Sanitize and validate email input
    const email = req.body.email; // Trim whitespace
    if (!validator.isEmail(email)) {
      return res.status(400).send({ message: "Invalid email format" }); // Validate email format
    }
    const sanitizedEmail = validator.normalizeEmail(email); // Normalize the email

    const user = await User.findOne({ email: sanitizedEmail }); // Use sanitized input
    if (!user)
      return res.status(401).send({ message: "Invalid Email or Password" });

    // Use bcrypt to compare hashed passwords
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch)
      return res.status(401).send({ message: "Invalid Email or Password" });

    const accessToken = jwt.sign(
      {
        UserInfo: {
          username: user.email,
          roles: user.type,
        },
      },
      process.env.ACCESS_TOKEN_SECRET, // Use an environment variable for the secret
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { username: user.email },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Ensure cookie is secure in production
      sameSite: "None", // Cross-site cookie
    });

    res.status(200).send({
      data: user,
      accesstoken: accessToken,
      message: "Login is successful",
    });
  } catch (error) {
    console.error(error); // Log error details for debugging
    res.status(500).send({ message: "Internal Server Error" });
  }
};

// Refresh token
// Refresh token
const refresh = (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204); // No content

  const refreshToken = cookies.jwt;

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, decoded) => {
      if (err) return res.status(403).json({ message: "Forbidden" });

      const sanitizedUsername = validator.normalizeEmail(decoded.username); // Normalize the email for consistency
      const foundUser = await User.findOne({ email: sanitizedUsername }).exec(); // Use sanitized email
      if (!foundUser)
        return res.status(401).json({ message: "Unauthorized user" });

      const accessToken = jwt.sign(
        {
          UserInfo: {
            username: foundUser.email,
            roles: foundUser.type,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "15m" }
      );

      res.json({ accessToken });
    }
  );
};

// Logout
const logout = (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204); // No content
  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
  res.json({ message: "Cookie cleared" });
};

// Validate user authentication
const validateAuth = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required().label("Email"),
    password: Joi.string().min(6).required().label("Password"), // Minimum length for password
  });
  return schema.validate(data);
};

module.exports = {
  createUser,
  authenticateUser,
  refresh,
  logout,
};

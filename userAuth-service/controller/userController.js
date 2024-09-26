const { User, validate } = require("../models/user");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const bcrypt = require("bcrypt");
const validator = require("validator");
require("dotenv").config();

// Validate user creation data
const validateUserCreation = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required().label("Email"),
    password: Joi.string().min(6).required().label("Password"),
  });
  return schema.validate(data);
};

// Create a user
const createUser = async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    const { name, email, password, type } = req.body;

    const trimmedEmail = email.trim();
    if (!validator.isEmail(trimmedEmail)) {
      return res.status(400).send({ message: "Invalid email format" });
    }
    const sanitizedEmail = validator.normalizeEmail(trimmedEmail);

    const userExists = await User.findOne({ email: sanitizedEmail });
    if (userExists) {
      return res
        .status(409)
        .send({ message: "User with given email already exists!" });
    }

    const salt = await bcrypt.genSalt(Number(process.env.SALT) || 10);
    const hashPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email: sanitizedEmail,
      password: hashPassword,
      type,
    });
    await newUser.save();
    res.status(201).send({ message: "User created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
};

// Authenticate user
const authenticateUser = async (req, res) => {
  try {
    const { error } = validateAuth(req.body);
    if (error) return res.status(400).send({ message: "Invalid input" });

    const email = req.body.email;
    if (!validator.isEmail(email)) {
      return res.status(400).send({ message: "Invalid email format" });
    }
    const sanitizedEmail = validator.normalizeEmail(email);

    const user = await User.findOne({ email: sanitizedEmail });
    if (!user)
      return res.status(401).send({ message: "Invalid Email or Password" });

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
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { username: user.email },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "None",
    });

    res.status(200).send({
      data: user,
      accesstoken: accessToken,
      message: "Login is successful",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
};

// Refresh token
const refresh = (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204);

  const refreshToken = cookies.jwt;

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, decoded) => {
      if (err) return res.status(403).json({ message: "Forbidden" });

      const sanitizedUsername = validator.normalizeEmail(decoded.username);
      const foundUser = await User.findOne({ email: sanitizedUsername }).exec();
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
  if (!cookies?.jwt) return res.sendStatus(204); // No content if no cookie

  // Clear the JWT cookie
  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });

  // Handle Google logout if there's any session
  // Example: If you're storing Google user info in a session
  req.session = null; // or delete req.session if using express-session

  res.json({ message: "Successfully logged out." });
};

// Validate user authentication data
const validateAuth = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required().label("Email"),
    password: Joi.string().min(6).required().label("Password"),
  });
  return schema.validate(data);
};

module.exports = {
  createUser,
  authenticateUser,
  refresh,
  logout,
};

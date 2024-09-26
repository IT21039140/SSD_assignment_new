const express = require("express");
const router = express.Router();
const passport = require("passport");
require("../controller/authController");

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get("/google/callback", passport.authenticate("google", { session: false }), (req, res) => {
  // If authentication was successful, send the user data and token
  if (req.user) {
    res.cookie("jwt", req.user.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "None",
    });
    res.status(200).json({ data: req.user.user, message: "Google login successful" });
  } else {
    res.status(401).send({ message: "Authentication failed" });
  }
});

module.exports = router;



const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const saltRounds = 10;

const { User } = require("../models");

// Login function
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.json({ success: false, message: "Invalid password" });
    }
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({ success: true, token, user });
  } catch (err) {
    next(err);
  }
});

// Sign Up Function
router.post("/signup", async function (req, res, next) {
  const { email, password, name } = req.body;
  const hash = await bcrypt.hash(password, saltRounds);
  console.log(hash);
  try {
    const user = await User.create({
      email,
      password: hash,
      name,
    });
    res.json({ success: true, user });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

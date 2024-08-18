const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

//register endpoint
router.post("/register", async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const exitingUser = await User.findOne({ email });
    if (exitingUser) {
      return res.status(400).send("User already exists");
    }
    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = new User({ name : name.charAt(0).toUpperCase()+name.slice(1), email, password: hashedPassword, role });
    await newUser.save();
    res.status(200).send("User registered successdully");
  } catch (error) {
    res.status(400).send("Error in regsitering User");
  }
});

//login endpoint
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!user || !isMatch)
      return res.status(400).json({ message: "invalid credentials" });
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.status(200).json({ token });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//get user endpoint

router.get("/getUser", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    res
      .status(200)
      .json({ name: user.name, role: user.role, userId: user._id });
  } catch (error) {
    res.status(400).json("Access denied !!!");
  }
});

// get all users endpoint
router.get("/getAllUsers",async(req,res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.json("Error in fetching all users")
  }
});

module.exports = router;

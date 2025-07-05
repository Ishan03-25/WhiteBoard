const userModel = require("../models/userSchema");
const jwt = require("jsonwebtoken");
// Register a new user
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const user = await userModel.register(name, email, password);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Login a user

const loginUser = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const user = await userModel.login(email, password);
  
      // Create token
      const token = jwt.sign(
        { _id: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE }
      );
  
      res.status(200).json({
        message: "Login successful",
        token,
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
};

// Get user profile
const getProfile = async (req, res) => {
    try {
      // Get user data from auth middleware
      const { email } = req.user;
      
      const user = await userModel.getAllUser(email);
      
      if (!user || user.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }
  
      res.status(200).json({
        message: "User Profile retrieved successfully",
        profile: user[0]
      });
    } catch (error) {
      console.error("Profile fetch error:", error);
      res.status(500).json({ message: "Failed to fetch profile" });
    }
};

module.exports = { registerUser, loginUser, getProfile };

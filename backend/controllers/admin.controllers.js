import User from "../models/admin.model.js";
import bcrypt from "bcryptjs"; 
import jwt from "jsonwebtoken";

export const admin = async (_req, res) => {
  try {
    const exists = await User.findOne({ email: "admin@exammate.com" });
    if (!exists) {
      const hashed = await bcrypt.hash("123456", 10);
      await User.create({ email: "admin@exammate.com", password: hashed });
    }
    res.json({ success: true, message: "Admin user ready" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid email" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      success: true,
      message: "Login successful",
      token,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

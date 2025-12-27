import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { generateToken, verify } from "../utils/jwt.js";

export const register = async (req, res) => {
  const { name, email, password } = req.body;

  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ message: "User exists" });

  const hashed = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashed,
  });
  const { password: _, ...userWithoutPassword } = user._doc;

  res.json({
    user: userWithoutPassword,
    token: generateToken(user._id),
  });
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "Invalid credentials" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ message: "Invalid credentials" });

  res.json({
    user,
    token: generateToken(user._id),
  });
};

export const verigyToken = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    console.log(token);
    if (!token) return res.status(401).json({ message: "No token" });
    const decoded = verify(token);
    console.log(decoded);
    const user = await User.findById(decoded.id).select("-password");
    res.status(200).json({
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: "Something went wrong" });
  }
};

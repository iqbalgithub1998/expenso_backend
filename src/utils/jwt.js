import jwt from "jsonwebtoken";

export const generateToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "365d",
  });

export const verify = (token) => jwt.verify(token, process.env.JWT_SECRET);

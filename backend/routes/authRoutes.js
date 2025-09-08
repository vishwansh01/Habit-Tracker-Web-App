import express from "express";
import jwt from "jsonwebtoken";
export const router = express.Router();
import { Users } from "../db/db.js";
import bcrypt from "bcryptjs";

router.post("/signup", async (req, res) => {
  const existingUser = await Users.findOne({ email: req.body.email });
  if (existingUser) {
    return res.status(400).json({ error: "Email already exists" });
  }
  const user = new Users({
    name: req.body.name,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 10),
  });
  user.save();
  res.json({ message: "User created successfully" });
});
router.post("/signin", async (req, res) => {
  const existingUser = await Users.findOne({ email: req.body.email });
  if (
    !existingUser ||
    !bcrypt.compareSync(req.body.password, existingUser.password)
  ) {
    return res.status(401).json({ error: "Invalid credentials" });
  }
  const token = jwt.sign({ email: req.body.email }, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });
  res.json({ token });
});
// router.post("/logout", (req, res) => {
//   res.json({ message: "Logout successful" });
// });

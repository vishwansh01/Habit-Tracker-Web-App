import express from "express";
import { Users } from "../db/db.js";
import { jwt } from "jsonwebtoken";
export const router = express.Router();

router.get("/signup", async (req, res) => {
  const existingUser = await Users.findOne({ email: req.body.username });
  if (existingUser) {
    return res.status(400).json({ message: "Username already exists" });
  }
  const user = new Users({
    name: req.body.name,
    email: req.body.username,
    password: bcrypt.hashSync(process.env.BCRYPT_PASS, req.body.password, 8),
  });
  user.save();
  res.json({ message: "User created successfully" });
});
router.get("/signin", async (req, res) => {
  const existingUser = await Users.findOne({ email: req.body.username });
  if (
    !existingUser ||
    !bcrypt.compareSync(req.body.password, existingUser.password)
  ) {
    return res.status(401).json({ error: "Invalid credentials" });
  }
  const token = jwt.sign({ username }, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });
  res.json({ token });
});
router.get("/logout", (req, res) => {
  res.json();
});

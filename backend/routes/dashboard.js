import express from "express";
import authMiddleware from "../middleware.js";
import { Habits, Users } from "../db/db.js";
// import { habbits } from "./habbitsRoutes.js";

export const dashboard = express.Router();
dashboard.get("/", authMiddleware, (req, res) => {
  // console.log("AJRJKn");
  return res.json({ message: "Welcome to the dashboard" });
});
dashboard.get("/habits", authMiddleware, async (req, res) => {
  // console.log("AJRJKn");
  const existingUser = await Users.findOne({ email: req.user.email });
  const habits = await Habits.find({ user: existingUser._id });
  return res.json(habits);
  // return res.json({ message: "Welcome to the dashboard" });
});

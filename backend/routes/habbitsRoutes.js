import express from "express";
import authMiddleware from "../middleware.js";
import { CheckIn, Habits, Users } from "../db/db.js";

export const habbits = express.Router();

habbits.post("/create", authMiddleware, async (req, res) => {
  try {
    const title = req.body.title;
    const freq = req.body.frequency;
    const category = req.body.category;
    const existingUser = await Users.findOne({ email: req.user.email });
    // console.log(existingUser);
    const habbit = new Habits({
      title: title,
      category: category,
      frequency: freq,
      user: existingUser._id,
    });
    habbit.save();
    return res.json({ message: "Habbit created" });
  } catch (err) {
    console.log(err);
    return res.json({ error: "Timeout! Please try again" });
  }
});
habbits.post("/complete", authMiddleware, async (req, res) => {
  try {
    const habitId = req.body.habitId;
    // console.log(habitId);
    const habit = await Habits.findByIdAndUpdate(habitId, { isActive: false });
    // console.log(habit);
    return res.json({ message: "Habbit Successfully changed" });
  } catch (err) {
    console.log(err);
    return res.json({ error: "Timeout! Please try again" });
  }
});
habbits.post("/:id/check", authMiddleware, async (req, res) => {
  try {
    const habitId = req.params.id;
    console.log(req.user);
    const existingUser = await Users.findOne({ email: req.user.email });
    const habit = await Habits.findOne({
      _id: habitId,
      user: existingUser._id,
      isActive: true,
    });
    console.log(existingUser);

    if (!habit) {
      return res.status(404).json({ error: "Habit not found" });
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    // Check if already checked in today
    const existingCheckIn = await CheckIn.findOne({
      habit: habitId,
      date: today,
    });
    if (existingCheckIn) {
      return res.status(400).json({ error: "Already checked in for today" });
    }
    const checkIn = new CheckIn({
      habit: habitId,
      user: existingUser._id,
      date: today,
    });
    await checkIn.save();
    res.json({
      message: "Check-in successful",
      checkIn,
    });
  } catch (error) {
    console.log(error);
    res.json(error);
  }
});

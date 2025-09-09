import express from "express";
import { body, validationResult } from "express-validator";
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
      title: title.trim(),
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
habbits.get("/:id", authMiddleware, async (req, res) => {
  try {
    const habitId = req.params.id;
    const existingUser = await Users.findOne({ email: req.user.email });
    // console.log(existingUser);
    console.log("Asje");
    const habit = await Habits.findById(habitId);
    if (!habitId) {
      return res.json({ error: "No such habits" });
    }
    // habbit.save();
    return res.json({ habit });
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
habbits.put(
  "/:id/change",
  [
    body("name")
      .optional()
      .trim()
      .isLength({ min: 1, max: 100 })
      .withMessage("Habit name must be between 1 and 100 characters"),
    body("category")
      .optional()
      .isIn([
        "Health",
        "Fitness",
        "Learning",
        "Productivity",
        "Mindfulness",
        "Social",
        "Other",
      ])
      .withMessage("Invalid category"),
    body("frequency")
      .optional()
      .isIn(["daily", "weekly"])
      .withMessage("Frequency must be daily or weekly"),
  ],
  authMiddleware,
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array()[0].msg });
      }

      const { title, category, frequency } = req.body;
      const habitId = req.params.id;
      const existingUser = await Users.findOne({ email: req.user.email });

      const habit = await Habits.findOne({
        _id: habitId,
        user: existingUser._id,
      });
      if (!habit) {
        return res.status(404).json({ error: "Habit not found" });
      }

      // Check for duplicate name if name is being updated
      if (title && title.trim() !== habit.title) {
        const existingHabit = await Habits.findOne({
          user: existingUser._id,
          title: title.trim(),
          isActive: true,
          _id: { $ne: habitId },
        });

        if (existingHabit) {
          return res
            .status(400)
            .json({ error: "You already have a habit with this name" });
        }
      }

      // Update fields
      if (title) habit.title = title.trim();
      if (category) habit.category = category;
      if (frequency) habit.frequency = frequency;

      await habit.save();

      res.json({
        message: "Habit updated successfully",
        habit,
      });
    } catch (error) {
      console.log(error);
    }
  }
);
habbits.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const habitId = req.params.id;
    const existingUser = await Users.findOne({ email: req.user.email });
    const habit = await Habits.findOne({
      _id: habitId,
      user: existingUser._id,
    });
    if (!habit) {
      return res.status(404).json({ error: "Habit not found" });
    }

    // Soft delete by marking as inactive
    habit.isActive = false;
    await habit.save();

    res.json({ message: "Habit deleted successfully" });
  } catch (error) {
    console.log(error);
  }
});

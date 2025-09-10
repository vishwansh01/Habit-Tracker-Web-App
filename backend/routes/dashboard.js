import express from "express";
import authMiddleware from "../middleware.js";
import { CheckIn, Habits, Users } from "../db/db.js";
// import { habbits } from "./habbitsRoutes.js";

export const dashboard = express.Router();
dashboard.get("/", authMiddleware, (req, res) => {
  // console.log("AJRJKn");
  return res.json({ message: "Welcome to the dashboard" });
});
dashboard.get("/habits", authMiddleware, async (req, res) => {
  // console.log("AJRJKn");
  const existingUser = await Users.findOne({ email: req.user.email });
  const habits = await Habits.find({ user: existingUser._id, isActive: true });
  // return res.json(habits);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const habitIds = habits.map((h) => h._id);
  const todayCheckIns = await CheckIn.find({
    habit: { $in: habitIds },
    date: { $gte: today },
  });

  // Calculate streaks and completion rates for each habit
  const habitsWithStats = await Promise.all(
    habits.map(async (habit) => {
      const checkIns = await CheckIn.find({ habit: habit._id }).sort({
        date: -1,
      });

      // Calculate current streak
      let streak = 0;
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      let checkDate = new Date(today);

      // First check: if today has no check-in, start from yesterday
      const todayCheckIn = checkIns.find(
        (ci) => ci.date.toDateString() === today.toDateString()
      );

      if (!todayCheckIn) {
        checkDate.setDate(checkDate.getDate() - 1);
      }

      while (true) {
        const checkIn = checkIns.find(
          (ci) => ci.date.toDateString() === checkDate.toDateString()
        );

        if (checkIn && checkIn.completed) {
          streak++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          break;
        }
      }

      // Calculate completion rate (last 30 days)
      const thirtyDaysAgo = new Date(today);
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const recentCheckIns = checkIns.filter((ci) => ci.date >= thirtyDaysAgo);
      const completionRate =
        recentCheckIns.length > 0
          ? (recentCheckIns.filter((ci) => ci.completed).length /
              recentCheckIns.length) *
            100
          : 0;

      // Check if completed today
      const completedToday = todayCheckIns.some(
        (ci) => ci.habit.toString() === habit._id.toString() && ci.completed
      );

      return {
        ...habit.toObject(),
        streak,
        completionRate: Math.round(completionRate),
        completedToday,
        totalCheckIns: checkIns.length,
      };
    })
  );

  res.json({ habits: habitsWithStats });
  // return res.json({ message: "Welcome to the dashboard" });
});

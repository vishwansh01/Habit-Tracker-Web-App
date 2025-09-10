import express from "express";
import { CheckIn, Habits, Users } from "../db/db.js";
import authMiddleware from "../middleware.js";
// import { Users } from "../db/db";
export const social = express.Router();

social.get("/users/search", authMiddleware, async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.trim().length < 2) {
      return res
        .status(400)
        .json({ error: "Search query must be at least 2 characters" });
    }

    const users = await Users.find({
      $and: [
        { _id: { $ne: req.userId } }, // Exclude current user
        {
          $or: [
            // { username: { $regex: q.trim(), $options: "i" } },
            { email: { $regex: q.trim(), $options: "i" } },
          ],
        },
      ],
    })
      .select("email")
      .limit(20);

    // Check which users the current user is already following
    const currentUser = await Users.findOne({ email: req.user.email }).select(
      "following"
    );
    const followingIds = currentUser.following.map((id) => id.toString());

    const usersWithFollowStatus = users.map((user) => ({
      ...user.toObject(),
      isFollowing: followingIds.includes(user._id.toString()),
      currUser: req.user.email,
    }));

    res.json({ users: usersWithFollowStatus });
  } catch (error) {
    console.log(error);
  }
});
social.post("/users/:email/follow", authMiddleware, async (req, res) => {
  try {
    const targetUserEmail = req.params.email;

    if (targetUserEmail === req.user.email) {
      return res.status(400).json({ error: "You cannot follow yourself" });
    }

    const targetUser = await Users.findOne({ email: targetUserEmail });
    if (!targetUser) {
      return res.status(404).json({ error: "User not found" });
    }

    const currentUser = await Users.findOne({ email: req.user.email });

    // Check if already following
    if (currentUser.following.includes(targetUser._id)) {
      return res.status(400).json({ error: "Already following this user" });
    }

    // Add to following/followers
    currentUser.following.push(targetUser._id);
    targetUser.followers.push(currentUser._id);

    await currentUser.save();
    await targetUser.save();

    res.json({
      message: `Successfully followed ${targetUser.name}`,
      user: {
        id: targetUser._id,
        username: targetUser.name,
        isFollowing: true,
      },
    });
  } catch (error) {
    console.log(error);
  }
});
social.delete("/users/:email/follow", authMiddleware, async (req, res) => {
  try {
    const targetUserEmail = req.params.email;

    const targetUser = await Users.findOne({ email: targetUserEmail });
    if (!targetUser) {
      return res.status(404).json({ error: "User not found" });
    }

    console.log(targetUserEmail);
    const currentUser = await Users.findOne({ email: req.user.email });

    // Check if actually following
    if (!currentUser.following.includes(targetUser._id)) {
      return res.status(400).json({ error: "Not following this user" });
    }

    // Remove from following/followers
    currentUser.following = currentUser.following.filter(
      (id) => id.toString() !== targetUser._id.toString()
    );
    targetUser.followers = targetUser.followers.filter(
      (id) => id.toString() !== currentUser._id.toString()
    );
    // targetUser.followers.map((id) => {
    //   console.log();
    // });
    console.log(targetUser._id);
    // console.log(currentUser.following);
    // console.log(targetUser.followers);

    await currentUser.save();
    await targetUser.save();

    res.json({
      message: `Unfollowed ${targetUser.name}`,
      user: {
        id: targetUser._id,
        username: targetUser.name,
        isFollowing: false,
      },
    });
  } catch (error) {
    console.log(error);
  }
});

social.get("/feed", authMiddleware, async (req, res) => {
  try {
    const currentUser = await Users.findOne({ email: req.user.email }).populate(
      "following",
      "name"
    );

    if (currentUser.following.length === 0) {
      return res.json({ activities: [] });
    }

    const followingIds = currentUser.following.map((user) => user._id);

    // Get recent check-ins from followed users (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentCheckIns = await CheckIn.find({
      user: { $in: followingIds },
      createdAt: { $gte: sevenDaysAgo },
    })
      .populate("user", "name email")
      .populate("habit", "category")
      .sort({ createdAt: -1 })
      .limit(50);

    // Get current streaks for each user's habits
    const activities = await Promise.all(
      recentCheckIns.map(async (checkIn) => {
        // Calculate streak for this habit
        const habitCheckIns = await CheckIn.find({
          habit: checkIn.habit._id,
        }).sort({ date: -1 });

        let streak = 0;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        let checkDate = new Date(today);
        while (true) {
          const habitCheckIn = habitCheckIns.find(
            (ci) => ci.date.toDateString() === checkDate.toDateString()
          );

          if (habitCheckIn && habitCheckIn.completed) {
            streak++;
            checkDate.setDate(checkDate.getDate() - 1);
          } else {
            break;
          }
        }

        return {
          id: checkIn._id,
          user: {
            id: checkIn.user._id,
            // name: checkIn.user.name,
            email: checkIn.user.email,
          },
          habit: {
            id: checkIn.habit._id,
            name: checkIn.habit.name,
            category: checkIn.habit.category,
          },
          date: checkIn.date,
          createdAt: checkIn.createdAt,
          streak: streak,
          type: "check-in",
        };
      })
    );

    // Also get newly created habits from followed users
    const recentHabits = await Habits.find({
      user: { $in: followingIds },
      createdAt: { $gte: sevenDaysAgo },
    })
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .limit(20);

    const habitActivities = recentHabits.map((habit) => ({
      id: habit._id,
      user: {
        id: habit.user._id,
        email: habit.user.email,
      },
      habit: {
        id: habit._id,
        name: habit.name,
        category: habit.category,
      },
      createdAt: habit.createdAt,
      type: "new-habit",
    }));

    // Combine and sort all activities
    const allActivities = [...activities, ...habitActivities]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 30);

    res.json({ activities: allActivities });
  } catch (error) {
    console.log(error);
  }
});

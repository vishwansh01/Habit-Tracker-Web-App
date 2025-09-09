import mongoose from "mongoose";

// console.log(process.env.PORT);
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL);
    // console.log(process.env.DATABASE_URL);
    console.log("Database connected");
  } catch (err) {
    console.log(err);
  }
};
export default connectDB;

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  followers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  following: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

export const Users = mongoose.model("User", userSchema);

const habitsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Habit name is required"],
      trim: true,
      maxlength: [100, "Habit name cannot exceed 100 characters"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: [
        "Health",
        "Fitness",
        "Learning",
        "Productivity",
        "Mindfulness",
        "Social",
        "Other",
      ],
      default: "Other",
    },
    frequency: {
      type: String,
      required: [true, "Frequency is required"],
      enum: ["daily", "weekly"],
      default: "daily",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);
habitsSchema.index({ user: 1, name: 1 }, { unique: true });
export const Habits = mongoose.model("Habit", habitsSchema);
const checkInSchema = new mongoose.Schema({
  habit: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Habit",
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  completed: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
checkInSchema.index({ habit: 1, date: 1 }, { unique: true });
export const CheckIn = mongoose.model("CheckIn", checkInSchema);

import dotenv from "dotenv";
dotenv.config();
import express from "express";
const app = express();
import bodyParser from "body-parser";
import { dashboard } from "./routes/dashboard.js";
import cors from "cors";
import { router } from "./routes/authRoutes.js";
import connectDB, { Habits } from "./db/db.js";
import { habbits } from "./routes/habbitsRoutes.js";
import { social } from "./routes/social.js";
// import authMiddleware from "./middleware.js";
app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://habit-tracker-web-app-pi.vercel.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// // Make sure OPTIONS requests are handled
// // app.options("/*", cors());
app.use(express.urlencoded({ extended: true }));
await connectDB();

app.use(bodyParser.json());
app.use("/auth", router);
app.use("/dashboard", dashboard);
app.use("/habits", habbits);
app.use("/social", social);
// // import connectDB from "";
// // import { Habits } from "./models.js"; // adjust path if needed
// // import { connect } from "mongoose";

// const fixIndexes = async () => {
//   try {
//     await connectDB();

//     // Drop the wrong index if it exists
//     try {
//       await Habits.collection.dropIndex("user_1_name_1");
//       console.log("Dropped wrong index: user_1_name_1");
//     } catch (err) {
//       if (err.codeName === "IndexNotFound") {
//         console.log("Index user_1_name_1 does not exist, skipping");
//       } else {
//         throw err;
//       }
//     }

//     // Sync indexes with your schema (creates { user, title } unique index)
//     await Habits.syncIndexes();
//     console.log("Indexes synced successfully ✅");

//     process.exit(0);
//   } catch (err) {
//     console.error("Error fixing indexes:", err);
//     process.exit(1);
//   }
// };

// fixIndexes();

app.listen(process.env.PORT, () => {
  console.log("server is running");
});

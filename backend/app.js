import dotenv from "dotenv";
dotenv.config();
import express from "express";
const app = express();
import bodyParser from "body-parser";
import { dashboard } from "./routes/dashboard.js";
import cors from "cors";
import { router } from "./routes/authRoutes.js";
import connectDB from "./db/db.js";
import { habbits } from "./routes/habbitsRoutes.js";
import { social } from "./routes/social.js";
// import authMiddleware from "./middleware.js";
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
await connectDB();

app.use(bodyParser.json());
app.use("/auth", router);
app.use("/dashboard", dashboard);
app.use("/habits", habbits);
app.use("/social", social);

app.listen(process.env.PORT, () => {
  console.log("server is running");
});

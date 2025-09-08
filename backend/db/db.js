import mongoose from "mongoose";

mongoose.connect(process.env.DATABASE_URL);

export const Users = mongoose.model("Users", { name: String, email: String });

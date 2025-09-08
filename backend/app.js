import express from "express";
import { router } from "./routes/authRoutes";
import bodyParser from "body-parser";
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(bodyParser.json());
app.use("/auth", router);

app.listen(process.env.PORT, () => {
  console.log("server is running");
});

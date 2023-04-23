import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { router as IndexRoute } from "./routes/index.routes.js";

dotenv.config();
const app = express();
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("Connected to db"))
  .catch((err) => console.log(err));

app.use(bodyParser.json());
app.use(cors());
app.get((req, res) => {
  res.send("We are at home");
});
app.use("/api/", IndexRoute);
app.use((error, req, res, next) => {
  console.log(error);
  res.status(500).json({ error: error.message });
});
app.listen(5000, () => {
  console.log("Server Running on port 5000");
});

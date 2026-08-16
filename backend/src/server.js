import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { connectDatabase } from "./config/database.js";
import alertsRoutes from "./routes/alerts.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/alerts", alertsRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "Production Quality Tracker API is running"
  });
});

connectDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
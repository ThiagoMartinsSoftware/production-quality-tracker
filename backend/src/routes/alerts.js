import express from "express";

import {
  createAlert,
  getPendingAlerts,
  markAlertAsAlerted,
  getAlertSummary
} from "../controllers/alertController.js";

const router = express.Router();

router.post("/", createAlert);

router.get("/", getPendingAlerts);

router.get("/summary", getAlertSummary);

router.patch("/:id", markAlertAsAlerted);

export default router;
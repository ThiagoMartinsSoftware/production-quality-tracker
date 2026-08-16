import express from "express";

import {
  createAlert,
  getPendingAlerts,
  markAlertAsAlerted,
  getAlertSummary,
  getTodayAlertCount,
  resetAlertCount
} from "../controllers/alertController.js";

const router = express.Router();

router.post("/", createAlert);

router.get("/", getPendingAlerts);

router.get("/summary", getAlertSummary);

router.get("/today", getTodayAlertCount);

router.post("/reset", resetAlertCount);

router.patch("/:id", markAlertAsAlerted);

export default router;
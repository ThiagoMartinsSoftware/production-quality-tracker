import Alert from "../models/alert.js";
import ShiftCounter from "../models/ShiftCounter.js";

export async function createAlert(req, res) {
  try {
    const { problem, brand } = req.body;

    if (!problem) {
      return res.status(400).json({
        message: "Problem is required"
      });
    }

    if (
      brand &&
      !["Electrolux", "Whirlpool"].includes(brand)
    ) {
      return res.status(400).json({
        message: "Invalid brand"
      });
    }

    const alert = await Alert.create({
      problem,
      brand: brand || null
    });

    return res.status(201).json(alert);
  } catch (error) {
    console.error("Error creating alert:", error);

    return res.status(500).json({
      message: "Error creating alert"
    });
  }
}

export async function getPendingAlerts(req, res) {
  try {
    const alerts = await Alert.find({
      status: "pending"
    }).sort({
      createdAt: -1
    });

    return res.json(alerts);
  } catch (error) {
    console.error("Error fetching alerts:", error);

    return res.status(500).json({
      message: "Error fetching alerts"
    });
  }
}

export async function markAlertAsAlerted(req, res) {
  try {
    const { id } = req.params;

    const alert = await Alert.findByIdAndUpdate(
      id,
      {
        status: "alerted"
      },
      {
        new: true
      }
    );

    if (!alert) {
      return res.status(404).json({
        message: "Alert not found"
      });
    }

    return res.json(alert);
  } catch (error) {
    console.error(
      "Error updating alert:",
      error
    );

    return res.status(500).json({
      message: "Error updating alert"
    });
  }
}

export async function getAlertSummary(req, res) {
  try {
    let counter = await ShiftCounter.findOne();

    if (!counter) {
      counter = await ShiftCounter.create({
        startedAt: new Date()
      });
    }

    const filter = {
      createdAt: {
        $gte: counter.startedAt
      }
    };

    const total = await Alert.countDocuments(
      filter
    );

    const pending = await Alert.countDocuments({
      ...filter,
      status: "pending"
    });

    const alerted = await Alert.countDocuments({
      ...filter,
      status: "alerted"
    });

    return res.json({
      total,
      pending,
      alerted
    });
  } catch (error) {
    console.error(
      "Error fetching alert summary:",
      error
    );

    return res.status(500).json({
      message: "Error fetching alert summary"
    });
  }
}

export async function getTodayAlertCount(req, res) {
  try {
    let counter = await ShiftCounter.findOne();

    if (!counter) {
      counter = await ShiftCounter.create({
        startedAt: new Date()
      });
    }

    const total = await Alert.countDocuments({
      createdAt: {
        $gte: counter.startedAt
      }
    });

    return res.json({
      total,
      startedAt: counter.startedAt
    });
  } catch (error) {
    console.error(
      "Error fetching shift alert count:",
      error
    );

    return res.status(500).json({
      message: "Error fetching shift alert count"
    });
  }
}

export async function resetAlertCount(req, res) {
  try {
    const now = new Date();

    let counter = await ShiftCounter.findOne();

    if (!counter) {
      counter = await ShiftCounter.create({
        startedAt: now
      });
    } else {
      counter.startedAt = now;

      await counter.save();
    }

    return res.json({
      message: "Shift counter reset successfully",
      startedAt: counter.startedAt
    });
  } catch (error) {
    console.error(
      "Error resetting shift counter:",
      error
    );

    return res.status(500).json({
      message: "Error resetting shift counter"
    });
  }
}
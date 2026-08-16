import Alert from "../models/Alert.js";

export async function createAlert(req, res) {
  try {
    const { problem, brand } = req.body;

    if (!problem) {
      return res.status(400).json({
        message: "Problem is required"
      });
    }

    if (brand && !["Electrolux", "Whirlpool"].includes(brand)) {
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
    console.error("Error updating alert:", error);

    return res.status(500).json({
      message: "Error updating alert"
    });
  }
}

export async function getAlertSummary(req, res) {
  try {
    const total = await Alert.countDocuments();

    const pending = await Alert.countDocuments({
      status: "pending"
    });

    const alerted = await Alert.countDocuments({
      status: "alerted"
    });

    return res.json({
      total,
      pending,
      alerted
    });
  } catch (error) {
    console.error("Error fetching alert summary:", error);

    return res.status(500).json({
      message: "Error fetching alert summary"
    });
  }
}
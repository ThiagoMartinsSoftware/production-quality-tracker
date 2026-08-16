import mongoose from "mongoose";

const alertSchema = new mongoose.Schema(
  {
    problem: {
      type: String,
      required: true,
      trim: true
    },

    brand: {
      type: String,
      enum: ["Electrolux", "Whirlpool"],
      default: null
    },

    status: {
      type: String,
      enum: ["pending", "alerted"],
      default: "pending"
    }
  },
  {
    timestamps: true
  }
);

const Alert = mongoose.model("Alert", alertSchema);

export default Alert;
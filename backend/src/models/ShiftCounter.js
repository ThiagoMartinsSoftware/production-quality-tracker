import mongoose from "mongoose";

const shiftCounterSchema = new mongoose.Schema(
  {
    startedAt: {
      type: Date,
      required: true
    }
  },
  {
    timestamps: true
  }
);

const ShiftCounter = mongoose.model(
  "ShiftCounter",
  shiftCounterSchema
);

export default ShiftCounter;
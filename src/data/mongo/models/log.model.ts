import { Schema, model } from "mongoose";

// rules for the object
const LogSchema = new Schema({
  message: {
    type: String,
    required: true,
  },
  level: {
    type: String,
    enum: ["low", "medium", "high"],
    default: "low",
  },
  origin: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

export const LogModel = model("Log", LogSchema);

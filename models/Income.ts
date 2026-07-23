import mongoose, { Schema, models, model } from "mongoose";

const IncomeSchema = new Schema(
  {
    userId:    { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    amount:    { type: Number, required: true, min: 0 },   // pence
    source:    { type: String, default: "Salary", trim: true },
    month:     { type: String, required: true },           // "2026-08"
    date:      { type: Date, required: true },
    note:      { type: String, trim: true },
    isRecurring: { type: Boolean, default: true },
  },
  { timestamps: true }
);

IncomeSchema.index({ userId: 1, month: 1 });

export default models.Income || model("Income", IncomeSchema);
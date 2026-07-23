import mongoose, { Schema, models, model } from "mongoose";

const SavingsGoalSchema = new Schema(
  {
    userId:        { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    month:         { type: String, required: true },       // "2026-08"

    mode:          { type: String, enum: ["percent", "fixed"], default: "percent" },
    percentTarget: { type: Number, min: 0, max: 100, default: 20 },
    fixedTarget:   { type: Number, min: 0, default: 0 },   // pence
    resolvedTarget:{ type: Number, min: 0, default: 0 },   // pence — computed

    savedAmount:   { type: Number, min: 0, default: 0 },   // pence
    label:         { type: String, default: "Monthly savings", trim: true },
  },
  { timestamps: true }
);

SavingsGoalSchema.index({ userId: 1, month: 1 }, { unique: true });

SavingsGoalSchema.virtual("progress").get(function () {
  if (!this.resolvedTarget) return 0;
  return Math.min(100, Math.round((this.savedAmount / this.resolvedTarget) * 100));
});

SavingsGoalSchema.set("toJSON", { virtuals: true });

export default models.SavingsGoal || model("SavingsGoal", SavingsGoalSchema);
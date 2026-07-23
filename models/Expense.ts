import mongoose, { Schema, models, model } from "mongoose";

const ExpenseSchema = new Schema(
  {
    userId:     { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    categoryId: { type: Schema.Types.ObjectId, ref: "Category", required: true, index: true },

    amount:     { type: Number, required: true, min: 0 },  // pence
    note:       { type: String, trim: true, maxlength: 200 },
    date:       { type: Date, required: true },
    month:      { type: String, required: true },          // "2026-08" — denormalised for fast queries

    // premium only
    receiptUrl:      { type: String },
    receiptPublicId: { type: String },   // Cloudinary, needed for deletion

    source:     { type: String, enum: ["manual", "pdf-import"], default: "manual" },
  },
  { timestamps: true }
);

ExpenseSchema.index({ userId: 1, month: 1, date: -1 });
ExpenseSchema.index({ userId: 1, categoryId: 1, month: 1 });

export default models.Expense || model("Expense", ExpenseSchema);
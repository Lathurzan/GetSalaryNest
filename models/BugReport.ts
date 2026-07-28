import mongoose, { Schema, models, model } from "mongoose";

const BugReportSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    userName: { type: String, required: true },
    userEmail: { type: String, required: true },

    title: { type: String, required: true, trim: true, maxlength: 120 },
    description: { type: String, required: true, trim: true, maxlength: 2000 },
    area: {
      type: String,
      enum: ["expenses", "income", "reports", "billing", "import", "other"],
      default: "other",
    },

    // client context, auto-captured to help debugging
    pageUrl: String,
    userAgent: String,

    status: {
      type: String,
      enum: ["new", "in_progress", "resolved"],
      default: "new",
      index: true,
    },
  },
  { timestamps: true }
);

export default models.BugReport || model("BugReport", BugReportSchema);
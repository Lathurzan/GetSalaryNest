import mongoose, { Schema, models, model } from "mongoose";

const ReviewSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    userName: { type: String, required: true },   // snapshot, so it survives if user is deleted
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, trim: true, maxlength: 500 },

    // moderation
    status: {
      type: String,
      enum: ["pending", "approved", "hidden"],
      default: "pending",
      index: true,
    },
    moderatedAt: Date,
  },
  { timestamps: true }
);

// one review per user — they edit rather than stack
ReviewSchema.index({ userId: 1 }, { unique: true });

export default models.Review || model("Review", ReviewSchema);
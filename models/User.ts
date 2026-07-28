import mongoose, { Schema, models, model } from "mongoose";

const UserSchema = new Schema(
  {
    email:        { type: String, required: true, unique: true, lowercase: true, trim: true },
    name:         { type: String, trim: true },
    passwordHash: { type: String, select: false },
    image:        { type: String },

    plan:         { type: String, enum: ["free", "premium"], default: "free" },
    planExpiresAt:{ type: Date },
    customerId:   { type: String },   // Razorpay/Stripe customer ref

    currency:     { type: String, default: "GBP" },
    salaryDay:    { type: Number, min: 1, max: 31, default: 1 },
    onboarded:    { type: Boolean, default: false },

    subscriptionId:  { type: String },
    subscriptionStatus: { type: String },   // active | past_due | cancelled
    billingProvider: { type: String, enum: ["stripe", "razorpay"] },

    // email verification
    emailVerified: { type: Boolean, default: false },
    provider: { type: String, enum: ["credentials", "google"], default: "credentials" },

    // magic-link token (hashed)
    verifyTokenHash: { type: String, select: false },
    verifyTokenExpires: { type: Date, select: false },

    // pending email change (verified before it becomes active)
    pendingEmail: { type: String, lowercase: true, trim: true },
  },
  { timestamps: true }
);

UserSchema.virtual("isPremium").get(function () {
  if (this.plan !== "premium") return false;
  return !this.planExpiresAt || this.planExpiresAt > new Date();
});

UserSchema.set("toJSON", { virtuals: true });

export default models.User || model("User", UserSchema);
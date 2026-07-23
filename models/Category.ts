import mongoose, { Schema, models, model } from "mongoose";

const CategorySchema = new Schema(
  {
    userId:    { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    name:      { type: String, required: true, trim: true },
    icon:      { type: String, default: "Wallet" },     // lucide-react icon name
    color:     { type: String, default: "#14b8a6" },
    type:      { type: String, enum: ["expense", "savings"], default: "expense" },
    isDefault: { type: Boolean, default: false },
    archived:  { type: Boolean, default: false },
  },
  { timestamps: true }
);

CategorySchema.index({ userId: 1, name: 1 }, { unique: true });

export default models.Category || model("Category", CategorySchema);
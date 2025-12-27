import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    amount: { type: Number, required: true },
    category: { type: String },
    description: { type: String },
    date: { type: Date, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Expense", expenseSchema);

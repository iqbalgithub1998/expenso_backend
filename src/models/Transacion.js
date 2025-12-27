import mongoose from "mongoose";
import { required } from "zod/mini";

const transactionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    friendId: { type: mongoose.Schema.Types.ObjectId, ref: "Friend" },
    amount: { type: Number, required: true },
    type: {
      type: String,
      enum: ["lend", "borrow", "settlement"],
      required: true,
    },
    note: String,
    date: { type: Date, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Transaction", transactionSchema);

import mongoose from "mongoose";

const friendSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    name: { type: String, required: true },
    phone: { type: String },
    balance: { type: Number, default: 0 }, // +take / -pay
  },
  { timestamps: true }
);

export default mongoose.model("Friend", friendSchema);

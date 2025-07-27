import mongoose from "mongoose";
const txSchema = new mongoose.Schema({
  player: { type: mongoose.Schema.Types.ObjectId, ref: "Player" },
  type: { type: String, enum: ["bet", "cashout"] },
  cryptoType: String,
  amount: Number,
  multiplier: Number,
  roundNumber: Number,
  mockTxHash: String,
  timestamp: { type: Date, default: Date.now }
});
export default mongoose.model("Transaction", txSchema);

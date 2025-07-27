import mongoose from "mongoose";

const playerSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  btcBalance: { type: Number, default: 0 },
  ethBalance: { type: Number, default: 0 },
  usdEquivalent: { type: Number, default: 0 },
  txHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: "Transaction" }]
});

export default mongoose.model("Player", playerSchema);

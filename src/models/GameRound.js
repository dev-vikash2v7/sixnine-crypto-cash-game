import mongoose from "mongoose";

const betSchema = new mongoose.Schema({
  player: { type: mongoose.Schema.Types.ObjectId, ref: "Player" },
  amountUSD: Number,
  cryptoType: String,
  amountCrypto: Number,
  cashoutMultiplier: Number,
  cashedOut: Boolean,
  cashoutTime: Number // milliseconds since round start
}, { _id: false });

const gameRoundSchema = new mongoose.Schema({
  roundNumber: Number,
  status: { type: String, enum: ["waiting", "in-progress", "crashed", "finished"], default: "waiting" },
  startTime: Date,
  crashPoint: Number,
  serverSeed: String,
  serverSeedHash: String,
  bets: [betSchema]
});

export default mongoose.model("GameRound", gameRoundSchema);

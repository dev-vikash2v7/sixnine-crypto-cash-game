import mongoose from "mongoose";
import dotenv from "dotenv";
import Player from "../models/Player.js";
dotenv.config();

const data = [
  { name: "Alice", btcBalance: 0.01, ethBalance: 0.5 },
  { name: "Bob", btcBalance: 0.02, ethBalance: 1.0 },
  { name: "Carol", btcBalance: 0.005, ethBalance: 0.2 }
];

(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  await Player.deleteMany({});
  await Player.insertMany(data);
  console.log("Seeded players!");
  process.exit(0);
})();

import Player from "../models/Player.js";
import GameRound from "../models/GameRound.js";
import Transaction from "../models/Transaction.js";
import { getPrices } from "../services/cryptoService.js";
import crypto from "crypto";

export async function placeBet(req, res) {
  try {
    // { playerName, amountUSD, cryptoType }
    const { playerName, amountUSD, cryptoType } = req.body;

    if (!["btc", "eth"].includes(cryptoType)) return res.status(400).json({ error: "Invalid crypto type" });

    const player = await Player.findOne({ name: playerName });
    if (!player) return res.status(404).json({ error: "Player not found" });

    // Find waiting round
    const round = await GameRound.findOne({ status: "waiting" }).sort({ roundNumber: -1 });
    if (!round) return res.status(400).json({ error: "No open round" });

    const { btc, eth } = await getPrices();

    console.log(btc, eth);

    const price = cryptoType === "btc" ? btc : eth;
    const amountCrypto = amountUSD / price;

    console.log({amountCrypto});

    // Check balance
    if (cryptoType === "btc" && player.btcBalance < amountCrypto)
      return res.status(400).json({ error: "Insufficient BTC" });
    if (cryptoType === "eth" && player.ethBalance < amountCrypto)
      return res.status(400).json({ error: "Insufficient ETH" });

    // Deduct balance
    if (cryptoType === "btc") player.btcBalance -= amountCrypto;
    else player.ethBalance -= amountCrypto;

    // Add bet to round
    round.bets.push({
      player: player._id, amountUSD, cryptoType, amountCrypto,
      cashedOut: false, cashoutMultiplier: null, cashoutTime: null
    });

    // Log transaction
    const tx = await Transaction.create({
      player: player._id, type: "bet", amount: amountCrypto,
      cryptoType, multiplier: 1, roundNumber: round.roundNumber,
      mockTxHash: crypto.randomBytes(16).toString("hex")
    });
    player.txHistory.push(tx._id);
    await Promise.all([player.save(), round.save()]);
    res.json({ success: true, bet: { amountUSD, cryptoType, amountCrypto } });
  } catch (e) { res.status(500).json({ error: e.message }); }
}

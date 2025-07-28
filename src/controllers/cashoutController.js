import Player from "../models/Player.js";
import GameRound from "../models/GameRound.js";
import Transaction from "../models/Transaction.js";
import crypto from "crypto";

export async function cashout(req, res) {
  try {
    const { playerName } = req.body;
    const player = await Player.findOne({ name: playerName });

console.log(`Cashout request for player: ${playerName}`);

    if (!player) return res.status(404).json({ error: "Player not found" });

    const round = await GameRound.findOne({ status: "in-progress" }).sort({ roundNumber: -1 });


    if (!round) return res.status(400).json({ error: "No in-progress round" });

    const bet = round.bets.find(x => x.player.toString() === player._id.toString() && !x.cashedOut);
    
    if (!bet) return res.status(400).json({ error: "No active bet" });

    const now = Date.now();
    const elapsed = (now - round.startTime.getTime()) / 1000;
    const multiplier = 1 + elapsed * 0.1;

    if (round.crashPoint && multiplier >= round.crashPoint)
      return res.status(400).json({ error: "Round crashed, cashout failed" });

    bet.cashedOut = true;
    bet.cashoutMultiplier = multiplier;
    bet.cashoutTime = elapsed;

    const payout = bet.amountCrypto * multiplier;
    if (bet.cryptoType === "btc") player.btcBalance += payout;
    else player.ethBalance += payout;

    const tx = await Transaction.create({
      player: player._id, type: "cashout", amount: payout,
      cryptoType: bet.cryptoType, multiplier, roundNumber: round.roundNumber,
      mockTxHash: crypto.randomBytes(16).toString("hex")
    });
    player.txHistory.push(tx._id);

    await Promise.all([player.save(), round.save()]);
    res.json({ success: true, payout, multiplier: multiplier.toFixed(2) });
  } catch (e) { res.status(500).json({ error: e.message }); }
}

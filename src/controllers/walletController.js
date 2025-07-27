import Player from "../models/Player.js";
import { getPrices } from "../services/cryptoService.js";

export async function getWallet(req, res) {
  try {
    const { name } = req.params;
    const player = await Player.findOne({ name });
    if (!player) return res.status(404).json({ error: "Player not found" });
    const prices = await getPrices();

    const usdEq = player.btcBalance * prices.btc + player.ethBalance * prices.eth;
    res.json({
      btc: player.btcBalance,
      eth: player.ethBalance,
      usdEquivalent: usdEq
    });
  } catch (e) { res.status(500).json({ error: e.message }); }
}

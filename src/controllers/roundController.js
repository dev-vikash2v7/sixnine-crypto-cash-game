import GameRound from "../models/GameRound.js";
export async function roundHistory(req, res) {
  try {
    const rounds = await GameRound.find({ status: "crashed" }).sort({ roundNumber: -1 }).limit(10);
    res.json(rounds.map(rd => ({
      roundNumber: rd.roundNumber,
      crashPoint: rd.crashPoint,
      serverSeedHash: rd.serverSeedHash,
      bets: rd.bets
    })));
  } catch (e) { res.status(500).json({ error: e.message }); }
}

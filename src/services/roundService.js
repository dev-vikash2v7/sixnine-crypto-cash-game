import GameRound from "../models/GameRound.js";
import { generateSeed, hashSeed, getCrashPoint } from "../utils/provablyFair.js";

let roundNumber = 1;

export function startGameLoop(io) {
  async function startNextRound() {

    const serverSeed = generateSeed();
    const serverSeedHash = hashSeed(serverSeed);
    const crashPoint = getCrashPoint(serverSeed);

    const round = await GameRound.create({
      roundNumber: roundNumber++,
      status: "waiting",
      crashPoint,
      serverSeed, serverSeedHash,
      startTime: null,
      bets: []
    });

    io.emit("round_start", { roundNumber: round.roundNumber, serverSeedHash, crashPoint: null });

    setTimeout(async () => {
      round.status = "in-progress";
      round.startTime = new Date();
      await round.save();

      let multiplier = 1.0;
      const stepMs = 100;
      const growth = 0.008;
      let crashed = false;
      const startTs = Date.now();

      const sendUpdate = setInterval(() => {
        const elapsed = (Date.now() - startTs) / 1000;
        multiplier = +(1 + elapsed * growth).toFixed(2);
        io.emit("multiplier_update", { roundNumber: round.roundNumber, multiplier });

        if (multiplier >= crashPoint && !crashed) {
          crashed = true;
          clearInterval(sendUpdate);
          round.status = "crashed";
          io.emit("round_crash", { roundNumber: round.roundNumber, crashPoint, serverSeed, multiplier });
          round.crashPoint = multiplier;
          round.save();
          setTimeout(startNextRound, 5000); // Start next after 5s
        }
      }, stepMs);
    }, 10000); 
  }
  startNextRound();
}

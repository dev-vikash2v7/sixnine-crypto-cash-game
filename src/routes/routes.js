import { Router } from "express";

import { placeBet } from "../controllers/betController.js";
import { roundHistory } from "../controllers/roundController.js";
import { cashout } from "../controllers/cashoutController.js";
import { getWallet } from "../controllers/walletController.js";

const router = Router();

router.post("/", placeBet);
router.get("/history", roundHistory);
router.get("/:name", getWallet);
router.post("/cashout", cashout);

export default router;

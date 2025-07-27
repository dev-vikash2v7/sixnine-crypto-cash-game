import { Router } from "express";
import { getWallet } from "../controllers/walletController.js";
const router = Router();
router.get("/:name", getWallet);
export default router;

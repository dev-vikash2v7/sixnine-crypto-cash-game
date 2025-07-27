import { Router } from "express";
import { placeBet } from "../controllers/betController.js";
const router = Router();
router.post("/", placeBet);
export default router;

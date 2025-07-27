import { Router } from "express";
import { roundHistory } from "../controllers/roundController.js";
const router = Router();
router.get("/history", roundHistory);
export default router;

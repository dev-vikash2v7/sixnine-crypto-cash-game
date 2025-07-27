import { Router } from "express";
import { cashout } from "../controllers/cashoutController.js";
const router = Router();
router.post("/", cashout);
export default router;

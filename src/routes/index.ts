import { Router } from "express";
import { calculate, q2, resetStock } from "../controllers/stocks.controller";

const router = Router();

router.post("/calculate", calculate);
router.post("/reset", resetStock);
router.post("/q2", q2);

export default router;
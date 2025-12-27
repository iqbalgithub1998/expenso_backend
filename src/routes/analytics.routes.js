import express from "express";
import {
  overviewAnalytics,
  monthlyExpenseAnalytics,
  lendBorrowAnalytics,
} from "../controllers/analytics.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();
router.use(protect);

router.get("/overview", overviewAnalytics);
router.get("/monthly-expense", monthlyExpenseAnalytics);
router.get("/lend-borrow", lendBorrowAnalytics);

export default router;

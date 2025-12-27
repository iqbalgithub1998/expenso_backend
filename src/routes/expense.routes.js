import express from "express";
import {
  addExpense,
  getExpenses,
  deleteExpense,
  monthlyExpense,
} from "../controllers/expense.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(protect);

router.post("/", addExpense);
router.get("/", getExpenses);
router.delete("/:id", deleteExpense);
router.get("/monthly", monthlyExpense);

export default router;

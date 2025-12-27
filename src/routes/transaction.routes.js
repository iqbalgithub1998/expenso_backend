import express from "express";
import {
  addTransaction,
  getTransactionsByFriend,
} from "../controllers/transaction.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();
router.use(protect);

router.post("/", addTransaction);
router.get("/:friendId", getTransactionsByFriend);

export default router;

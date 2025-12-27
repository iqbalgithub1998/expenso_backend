import express from "express";
import {
  addFriend,
  getFriends,
  deleteFriend,
} from "../controllers/friend.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();
router.use(protect);

router.post("/", addFriend);
router.get("/", getFriends);
router.delete("/:id", deleteFriend);

export default router;

import express from "express";
import {
  login,
  register,
  verigyToken,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.get("/refresh", verigyToken);
router.post("/register", register);
router.post("/login", login);

export default router;

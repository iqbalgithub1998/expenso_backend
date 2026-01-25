import express from "express";
import cors from "cors";
import authRoutes from "./src/routes/auth.routes.js";
import expenseRoutes from "./src/routes/expense.routes.js";
import friendRoutes from "./src/routes/friend.routes.js";
import transactionRoutes from "./src/routes/transaction.routes.js";
import analyticsRoutes from "./src/routes/analytics.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/friends", friendRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/analytics", analyticsRoutes);
app.get("/health", (req, res) =>
  res.json({ status: "ok", message: "Healthy", data: new Date().toString() }),
);

export default app;

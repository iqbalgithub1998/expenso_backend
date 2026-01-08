import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import expenseRoutes from "./routes/expense.routes.js";
import friendRoutes from "./routes/friend.routes.js";
import transactionRoutes from "./routes/transaction.routes.js";
import analyticsRoutes from "./routes/analytics.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/friends", friendRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/analytics", analyticsRoutes);
app.get("/health", (req, res) =>
  res.json({ status: "ok", message: "Healthy", data: new Date().toString() })
);

export default app;

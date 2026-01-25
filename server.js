import dotenv from "dotenv";
dotenv.config();
import { connect } from "mongoose";
import express from "express";
import cors from "cors";
import authRoutes from "./src/routes/auth.routes.js";
import expenseRoutes from "./src/routes/expense.routes.js";
import friendRoutes from "./src/routes/friend.routes.js";
import transactionRoutes from "./src/routes/transaction.routes.js";
import analyticsRoutes from "./src/routes/analytics.routes.js";

const app = express();
let isConnected = false;

async function connectToMongoDb() {
  try {
    const conn = await connect(process.env.MONGODB_URI, {});
    isConnected = true;
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
}

app.use((req, res, next) => {
  if (!isConnected) {
    connectToMongoDb();
  }
  next();
});

app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
  res.json({
    message: "app running.",
  });
});
app.use("/api/auth", authRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/friends", friendRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/analytics", analyticsRoutes);
app.get("/health", (req, res) =>
  res.json({ status: "ok", message: "Healthy", data: new Date().toString() }),
);

// app.listen(process.env.PORT, () =>
//   console.log(`Server running on port ${process.env.PORT}`),
// );

export default app;

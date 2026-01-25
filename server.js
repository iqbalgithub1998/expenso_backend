import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import connectDB from "./src/config/db.js";
import { connect } from "mongoose";

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

// app.listen(process.env.PORT, () =>
//   console.log(`Server running on port ${process.env.PORT}`),
// );

module.exports = app;

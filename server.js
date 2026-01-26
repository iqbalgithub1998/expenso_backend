import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import connectDB from "./src/config/db.js";

const PORT = process.env.PORT || 3000;
console.log("Environment:", process.env.PORT, process.env.MONGODB_URI);

await connectDB();

app.listen(PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`),
);

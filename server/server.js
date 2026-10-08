import "dotenv/config";
import express from "express";
import cors from "cors";
import dataRoutes from "./routes/dataRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import db from "./db.js";



const app = express();

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api/data", dataRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/ai",aiRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "DataLens API is running",
  });
});

db.query("SELECT 1")
  .then(() => {
    console.log("MySQL connected successfully");
  })
  .catch((error) => {
    console.error("MySQL connection failed:", error.message);
  });

app.listen(PORT, "0.0.0.0", () => {
  console.log(`DataLens server running on ${PORT}`);
});
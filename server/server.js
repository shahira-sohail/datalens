import express from "express";
import cors from "cors";

import dataRoutes from "./routes/dataRoutes.js";

const app = express();

const PORT = 5000;

app.use(cors());
app.use(express.json());

app.use("/api/data", dataRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "DataLens API is running",
  });
});

app.listen(PORT, () => {
  console.log(`DataLens server running on http://localhost:${PORT}`);
});
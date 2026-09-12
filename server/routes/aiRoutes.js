import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { generateAIInsight } from "../services/geminiService.js";

const router = express.Router();

router.post("/insights", authMiddleware, async (req, res) => {
  try {
    const { analysis } = req.body;

    if (!analysis) {
      return res.status(400).json({
        success: false,
        message: "Analysis data is required.",
      });
    }

    const insight = await generateAIInsight(analysis);

    res.json({
      success: true,
      insight,
    });
  } catch (error) {
    console.error("AI insight error:", error);

    res.status(500).json({
      success: false,
      message: "Could not generate AI insights.",
    });
  }
});

export default router;
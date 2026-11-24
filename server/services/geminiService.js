
import { GoogleGenAI } from "@google/genai";

export async function generateAIInsight(analysisData) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("AI insights are currently unavailable.");
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
You are a data analysis assistant for DataLens.

Analyze the dataset analysis results and provide clear,
practical insights for a non-technical user.

Focus on:
- Important patterns
- Data quality issues
- Missing values
- Anomalies
- Useful observations
- Possible business recommendations

Do not invent facts that are not present in the analysis.

Dataset analysis:
${JSON.stringify(analysisData)}
`;

  const response = await ai.models.generateContent({
    model: "gemini-3.6-flash",
    contents: prompt,
  });

  return response.text;
}

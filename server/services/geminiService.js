import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function generateAIInsight(analysisData) {
  const prompt = `
You are a data analysis assistant for a platform called DataLens.

Analyze the following dataset analysis results and provide clear,
practical insights for a non-technical user.

Focus on:
- Important patterns
- Data quality issues
- Missing values
- Anomalies
- Useful observations
- Possible business recommendations

Do not invent facts that are not present in the analysis.

Return the response in simple, concise language.

Dataset analysis:
${JSON.stringify(analysisData)}
`;

  const response = await ai.models.generateContent({
    model: "gemini-flash-latest",
    contents: prompt,
  });

  return response.text;
}
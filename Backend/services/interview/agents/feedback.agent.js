import llm from "../config/llm.js";
import feedbackPrompt from "../prompts/feedbackPrompt.js";


export const feedbackAgent = async (data)=>{
  try {
    const prompt = feedbackPrompt(data)

    const result = await llm.invoke(prompt)
    const cleaned = result.content
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(cleaned)

  } catch (error) {
    console.error("Feedback Agent error:", error?.message || error)
    throw new Error("failed to generate feedback")
  }
}
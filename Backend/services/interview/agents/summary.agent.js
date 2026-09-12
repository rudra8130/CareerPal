import llm from "../config/llm.js";
import summaryPrompt from "../prompts/summaryPrompt.js";


export const summaryAgent = async (data)=>{
  try {
    const prompt = summaryPrompt(data)

    const result = await llm.invoke(prompt)
    const cleaned = result.content
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(cleaned)

  } catch (error) {
    console.error("Summary Agent error:", error?.message || error)
    throw new Error("failed to generate summary")
  }
}
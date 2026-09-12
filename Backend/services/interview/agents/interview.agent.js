import llm from "../config/llm.js"
import hrinterviewPrompt from "../prompts/hrinterviewPrompt.js"
import technicalinterviewPrompt from "../prompts/technicalinterviewPrompt.js"


export const interviewAgent = async (data)=>{
  try {
    const prompt = data.type?.toLowerCase() === "hr" ? hrinterviewPrompt(data) :
technicalinterviewPrompt(data)

    const result = await llm.invoke(prompt)
    const cleaned = result.content
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(cleaned)

  } catch (error) {
    console.error("Interview Agent error:", error?.message || error)
    throw new Error("failed to generate interview questions")
  }
}
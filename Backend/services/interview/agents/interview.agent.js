import { response } from "express"
import llm from "../config/llm.js"
import hrinterviewPrompt from "../prompts/hrinterviewPrompt.js"
import technicalinterviewPrompt from "../prompts/technicalinterviewPrompt.js"


export const interviewAgent = async (data)=>{
  try {
    const prompt = data.type?.toLowerCase() === "hr" ? hrinterviewPrompt(data) :
technicalinterviewPrompt(data)

const response = await llm.invoke(prompt)
const cleaned =  response.content
.replace(/```json/g, "")
.replace(/```/g, "")
.trim();

return JSON.parse(cleaned)

} catch (error) {
  console.log("Interview Agent parse error")
  console.log(response.content)

  throw new Error("failed to generate interview questions")
    
  }
}
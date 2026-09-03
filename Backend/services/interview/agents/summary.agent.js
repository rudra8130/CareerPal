import { response } from "express";
import llm from "../config/llm";
import summaryPrompt from "../prompts/summaryPrompt.js";



export const summaryAgent = async (data)=>{
  try {
    const prompt = summaryPrompt(data)


const response = await llm.invoke(prompt)
const cleaned =  response.content
.replace(/```json/g, "")
.replace(/```/g, "")
.trim();

return JSON.parse(cleaned)

} catch (error) {
  console.log("summary Agent parse error")
  console.log(response.content)

  throw new Error("failed to generate summary")
    
  }
}
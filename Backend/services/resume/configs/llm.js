import { ChatGroq } from "@langchain/groq"
import dotenv from "dotenv";
dotenv.config();

const llm = new ChatGroq({
    model: "openai/gpt-oss-20b",
    temperature: 0.2,
    maxTokens: 2500,
    maxRetries: 2,
    apiKey:process.env.GROQ_API_KEY
    
})

export default llm
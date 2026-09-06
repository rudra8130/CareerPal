import express from "express"
import dotenv from "dotenv"
import { connectDB } from "./config/db.js"
import interviewRouter from "./routes/interview.route.js"

dotenv.config()

let PORT = process.env.PORT || 6003

let app = express()

app.use(express.json())

app.get("/", (req,res)=>{
  res.send("hello from interview service")
})

app.use("/", interviewRouter)


app.listen(PORT, ()=>{
  console.log(`Resume service started on port ${PORT}`)
  connectDB()
})
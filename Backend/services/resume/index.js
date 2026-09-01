import express from "express"
import dotenv from "dotenv"
import { connectDB } from "./configs/db.js"
import resumeRouter from "./routes/resume.route.js"

dotenv.config()

let PORT = process.env.PORT || 6002

let app = express()

app.use(express.json())

app.get("/", (req,res)=>{
  res.send("hello from resume service")
})

app.use("/", resumeRouter)


app.listen(PORT, ()=>{
  console.log(`Resume service started on port ${PORT}`)
  connectDB()
})
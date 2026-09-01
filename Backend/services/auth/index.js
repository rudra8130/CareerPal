import express from "express"
import dotenv from "dotenv"
import { connectDB } from "./configs/db.js"
import authRouter from "./routes/auth.route.js"
import cookieParser from "cookie-parser"

dotenv.config()

let PORT = process.env.PORT || 6001

let app = express()

app.use(express.json())
app.use(cookieParser())

app.get("/", (req,res)=>{
  res.send("hello from auth service")
})

app.use("/", authRouter)

app.listen(PORT, ()=>{
  console.log(`Auth service started on port ${PORT}`)
  connectDB()
})
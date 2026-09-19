import express from "express"
import dotenv from "dotenv"
import proxy from "express-http-proxy"
import cors from "cors"
import morgan from "morgan"
import cookieParser from "cookie-parser"
import { isAuth } from "./middleware/isAuth.js"
import { getCurrentUser } from "./controller/user.controller.js"
import { proxyWithHeaders } from "./utils/proxyWithHeaders.js"
dotenv.config()

let PORT = process.env.PORT || 6000

let app = express()

app.use(express.json())

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}))

app.use(morgan("dev"))

app.use(cookieParser())

app.get("/", (req, res) => {
  res.send("hello rudra")
})

app.use("/api/auth", proxy(process.env.AUTH_URL))

app.use("/api/resume", isAuth, proxyWithHeaders(process.env.RESUME_URL))

app.use("/api/interview", isAuth, proxyWithHeaders(process.env.INTERVIEW_URL))
app.use("/api/roadmap", isAuth, proxyWithHeaders(process.env.ROADMAP_URL))
app.get("/api/me", isAuth, getCurrentUser)


app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`)
})
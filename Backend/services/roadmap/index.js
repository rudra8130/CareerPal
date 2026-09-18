import express from "express"
import dotenv from "dotenv"
import { connectDB } from "./configs/db.js"
import roadmapRouter from "./routes/roadmap.route.js"

dotenv.config()

let PORT = process.env.PORT || 6004

let app = express()

app.use(express.json())

app.use("/", roadmapRouter)




app.listen(PORT, () => {
    console.log(`Roadmap service started on port ${PORT}`)
    connectDB()

})
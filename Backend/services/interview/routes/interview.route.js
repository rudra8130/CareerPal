import express from "express"
import { getInterview, startInterview, submitAnswer } from "../controller/interview.controller.js"

const interviewRouter = express.Router()

interviewRouter.post("/start", startInterview)

interviewRouter.post("/answer",submitAnswer)

interviewRouter.get("/:id",getInterview)

export default interviewRouter
import graph from "../graph/graph.js";
import Interview from "../models/interview.model";

export const startInterview = async (req, res)=>{
  try {
    const userId = req.headers["x-user-id"]
    const{
      type,
      role,
      useResume = false,
      resume = {}
    } = req.body;


    if(!type && !role){
      return res.status(400).json({
        success:false,
        message:"Interview type and role are required"
      })
    }

    const result = await graph.invoke({
      action:"start",
      role, type,
      useResume,
      resume
    })

    const questions = result.questions;

    if(!questions || questions.length === 0){
      return res.status(500).json({
        success:false,
        message:"Failed to generate interview questions"
      })
    }

    const interview = await interview.create({
      userId,
      type, role, useResume, questions, currentQuestions:0, status:"in-progress"
    })

    return res.status(200).json({
      success:true,
      interviewId:interview._id,
      currentQuestions:0,
      totalQuestions:interview.questions.length,
      question:interview.questions[0]
    })
  } catch (error) {
    console.log(error)
    
    return res.status(500).json({
      success:false,
      message:error.message
    })
  }
}


export const submitAnswer = async (req,res)=>{
  try {
    const userId = req.headers["x-user-id"]

    const {interviewId, answer} = req.body

    if(!interviewId && !answer){
      return res.status(400).json({
        success:false,
        message:"Interview id and answer are required"
      })
    }

    const interview = await Interview.findOne({
      _id:interviewId,
      userId
    })

    if(!interview){
      return res.status(404).json({
        success:false,
        message:"Interview not found"
      })
    }

    if(interview.status === "completed"){
      return res.status(400).json({
        success:false,
        message:"Interview already completed"
      })
    }

    const index = interview.currentQuestions

    const currentQuestion = interview.questions[index]

    if(!currentQuestions){
      return res.status(400).json({
        success:false,
        message:"Invalid question index"
      })
    }

    currentQuestion.userAnswer =  answer

    const completed = interview.currentQuestion + 1 >= interview.questions.length;

    const result = await graph.invoke({
      action:"feedback",
      question:currentQuestion.question,
      answer,
      difficulty:currentQuestion.difficulty,
      completed,
      role:interview.role,
      type:interview.type,
      questions:interview.questions
    })

    currentQuestion.feedback = result.feedback;
    interview.currentQuestion++;
  } catch (error) {
    
  }
}
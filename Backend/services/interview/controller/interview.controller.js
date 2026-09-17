import graph from "../graph/graph.js";
import InterviewState from "../graph/state.js";
import Interview from "../models/interview.model.js";
import redis from "../../../shared/redis/redis.js";

export const startInterview = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"];
    const {
      type,
      role,
      useResume = false,
      resume = {},
    } = req.body;

    if (!type || !role) {
      return res.status(400).json({
        success: false,
        message: "Interview type and role are required",
      });
    }

    const result = await graph.invoke({
      action: "start",
      role,
      type,
      useResume,
      resume,
    });

    const questions = result.questions;

    if (!questions || questions.length === 0) {
      return res.status(500).json({
        success: false,
        message: "Failed to generate interview questions",
      });
    }

    const interview = await Interview.create({
      userId,
      type,
      role,
      useResume,
      questions,
      currentQuestion: 0,
      status: "in progress",
    });

    await redis.del(`interviews:${userId}`);

    return res.status(200).json({
      success: true,
      interviewId: interview._id,
      currentQuestion: 0,
      totalQuestions: interview.questions.length,
      question: interview.questions[0],
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const submitAnswer = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"];

    const { interviewId, answer } = req.body;

    if (!interviewId || !answer) {
      return res.status(400).json({
        success: false,
        message: "Interview id and answer are required",
      });
    }

    const interview = await Interview.findOne({
      _id: interviewId,
      userId,
    });

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview not found",
      });
    }

    if (interview.status === "completed") {
      return res.status(400).json({
        success: false,
        message: "Interview already completed",
      });
    }

    const index = interview.currentQuestion;

    const currentQuestion = interview.questions[index];

    if (!currentQuestion) {
      return res.status(400).json({
        success: false,
        message: "Invalid question index",
      });
    }

    currentQuestion.userAnswer = answer;

    const completed = interview.currentQuestion + 1 >= interview.questions.length;

    const result = await graph.invoke({
      action: "feedback",
      question: currentQuestion.question,
      answer,
      difficulty: currentQuestion.difficulty,
      completed,
      role: interview.role,
      type: interview.type,
      questions: interview.questions,
    });

    currentQuestion.feedback = result.feedback;
    interview.currentQuestion++;

    if (completed) {
      interview.status = "completed";

      interview.overallScore = result.report?.overallScore ?? 0;
      interview.summary = result.report?.summary ?? "";
      interview.strengths = result.report?.strengths ?? [];
      interview.weaknesses = result.report?.weaknesses ?? [];
      interview.recommendations = result.report?.recommendations ?? [];

      await interview.save();
      await redis.del(`interviews:${userId}`);

      return res.status(200).json({
        success: true,
        completed: true,
        interview,
      });
    }

    await interview.save();
    await redis.del(`interviews:${userId}`);

    return res.status(200).json({
      success: true,
      completed: false,
      currentQuestion: interview.currentQuestion,
      question: interview.questions[interview.currentQuestion],
      feedback: result.feedback,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getInterview = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"];
    const { id } = req.params;

    const interview = await Interview.findOne({
      _id: id,
      userId,
    });

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview not found",
      });
    }

    return res.status(200).json({
      success: true,
      interview,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Builds the 8-axis radar object the frontend chart expects:
// { correctness, clarity, relevance, detail, efficiency, communication, problemsolving, creativity }
const EMPTY_RADAR = {
  correctness: 0,
  clarity: 0,
  relevance: 0,
  detail: 0,
  efficiency: 0,
  communication: 0,
  problemsolving: 0,
  creativity: 0,
};

function getAverageData(list) {
  if (!list.length) {
    return { ...EMPTY_RADAR };
  }

  const total = { ...EMPTY_RADAR };
  let count = 0;

  list.forEach((interview) => {
    interview.questions.forEach((q) => {
      if (!q.feedback) return;
      total.correctness += q.feedback.correctness || 0;
      total.clarity += q.feedback.clarity || 0;
      total.relevance += q.feedback.relevance || 0;
      total.detail += q.feedback.detail || 0;
      total.efficiency += q.feedback.efficiency || 0;
      total.communication += q.feedback.communication || 0;
      total.problemsolving += q.feedback.problemSolving || 0;
      total.creativity += q.feedback.creativity || 0;
      count++;
    });
  });

  if (count === 0) {
    return { ...EMPTY_RADAR };
  }

  return {
    correctness: Math.round(total.correctness / count),
    clarity: Math.round(total.clarity / count),
    relevance: Math.round(total.relevance / count),
    detail: Math.round(total.detail / count),
    efficiency: Math.round(total.efficiency / count),
    communication: Math.round(total.communication / count),
    problemsolving: Math.round(total.problemsolving / count),
    creativity: Math.round(total.creativity / count),
  };
}

export const getAllInterviews = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"];

    const cacheKey = `interviews:${userId}`;
    const cache = await redis.get(cacheKey);

    if (cache) {
      console.log("Data served from redis");
      return res.status(200).json(JSON.parse(cache));
    }

    const interviews = await Interview.find({ userId }).sort({ createdAt: -1 });

    const completed = interviews.filter((item) => item.status === "completed");

    const questionsSolved = interviews.reduce(
      (sum, item) => sum + item.questions.length,
      0
    );

    const averageScore =
      completed.length > 0
        ? Number(
          (
            completed.reduce((sum, item) => sum + item.overallScore, 0) /
            completed.length
          ).toFixed(1)
        )
        : 0;

    const stats = {
      totalInterviews: interviews.length,
      questionsSolved,
      completed: completed.length,
      averageScore,
    };

    const technicalInterviews = completed.filter((item) => item.type === "technical");
    const hrInterviews = completed.filter((item) => item.type === "hr");

    const technicalData = getAverageData(technicalInterviews);
    const hrData = getAverageData(hrInterviews);
    const technicalCount = technicalInterviews.length;
    const hrCount = hrInterviews.length;

    const payload = {
      success: true,
      interviews,
      stats,
      technicalData,
      hrData,
      technicalCount,
      hrCount,
    };

    await redis.set(cacheKey, JSON.stringify(payload), "EX", 600);

    return res.status(200).json(payload);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
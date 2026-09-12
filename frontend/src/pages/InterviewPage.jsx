import React from "react";
import Step2interview from "../components/interview/Step2interview";
import { useNavigate, useParams } from "react-router";
import { useState, useEffect } from "react";
import { getInterview, submitAnswer } from "../apis/interview.api";

function InterviewPage({ user, setuser: setUser }) {
  const { id } = useParams();
  const [loading, setloading] = useState(true);
  const [interview, setInterview] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInterview = async () => {
      try {
        const response = await getInterview(id);
        const data = response?.interview;
        if (!data) {
          navigate("/interview", { replace: true });
          return;
        }
        if (data.status === "completed") {
          navigate(`/interview/${id}/report`, { replace: true });
          return;
        }
        setInterview(data);
      } catch (err) {
        console.error(err);
      } finally {
        setloading(false);
      }
    };

    fetchInterview();
  }, [id, navigate]);

  // Called by Step2interview on each answer submission
  const handleSubmitAnswer = async ({ answer, index, auto }) => {
    const result = await submitAnswer({
      interviewId: id,
      answer: answer || "",
    });

    // If interview is now completed, navigate to report
    if (result?.completed) {
      navigate(`/interview/${id}/report`, { replace: true });
    }

    return result;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen w-full bg-[#0a0a0b]">
        <div
          className="animate-spin inline-block size-8 border-2 border-white/20 border-t-white rounded-full"
          role="status"
          aria-label="loading"
        >
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  if (!interview) {
    return (
      <div className="flex items-center justify-center min-h-screen w-full bg-[#0a0a0b]">
        <p className="text-white/50 text-sm">Interview not found.</p>
      </div>
    );
  }

  return (
    <Step2interview
      interviewData={{
        interviewId: interview._id,
        currentQuestion: interview.currentQuestion ?? 0,
        totalQuestions: interview.questions.length,
        question: interview.questions[interview.currentQuestion ?? 0],
        questions: interview.questions,
        difficulty: interview.questions[interview.currentQuestion ?? 0]?.difficulty,
      }}
      user={user}
      onSubmitAnswer={handleSubmitAnswer}
    />
  );
}

export default InterviewPage;

import React from "react";
import Step3report from "../components/interview/Step3report";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { getInterview } from "../apis/interview.api";

function InterviewReport({ user, setUser }) {
  const { id } = useParams();
  const [loading, setloading] = useState(true);
  const [report, setReport] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await getInterview(id);
        const data = response?.interview;
        if (!data) {
          navigate("/interview", { replace: true });
          return;
        }

        setReport(data);
      } catch (err) {
        console.error(err);
      } finally {
        setloading(false);
      }
    };

    fetchReport();
  }, [id, navigate]);

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

  if (!report) {
    return null
  }

  return (
    <Step3report user={user} setUser={setUser} report={report} />
  );
}

export default InterviewReport
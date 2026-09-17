import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router";
import api from "../utils/axios";
import Sidebar from "../components/Sidebar";
import Statbox from "../components/Statbox";
import InterviewGraph from "../components/InterviewGraph";

function Dashboard({ user, setuser }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  const [stats, setStats] = useState({
    totalInterviews: 0,
    questionsSolved: 0,
    completed: 0,
    averageScore: 0,
  });
  const [technicalData, setTechnicalData] = useState({});
  const [hrData, setHrData] = useState({});
  const [technicalCount, setTechnicalCount] = useState(0);
  const [hrCount, setHrCount] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const response = await api.get("/api/interview/all");
        const data = response.data;

        setStats(data.stats);
        setTechnicalData(data.technicalData);
        setHrData(data.hrData);
        setTechnicalCount(data.technicalCount);
        setHrCount(data.hrCount);
      } catch (error) {
        console.log(error);
      }
    };

    fetchInterviews();
  }, []);

  const handleLogout = async () => {
    try {
      const response = await api.get("/api/auth/logout");

      if (response.data.success) {
        setuser(null);
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const statCards = [
    {
      label: "Total Interviews",
      value: stats.totalInterviews,
      subHighlight: "All Time",
      sub: "Interviews Created",
    },
    {
      label: "Questions Solved",
      value: stats.questionsSolved,
      subHighlight: "Answered",
      sub: "Across All Interviews",
    },
    {
      label: "Completed",
      value: stats.completed,
      subHighlight: `${stats.totalInterviews} Total`,
      sub: "Interviews Finished",
    },
    {
      label: "Average Score",
      value: `${stats.averageScore}/100`,
      subHighlight: "Completed Only",
      sub: "Average Performance",
    },
  ];

  return (
    <div className="bg-white min-h-screen text-black font-sans flex">
      <Sidebar
        user={user}
        onNewInterview={() => {
          navigate("/interview");
        }}
        onLogout={handleLogout}
        sidebarOpen={sidebarOpen}
        setSideBarOpen={setSidebarOpen}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <motion.main
        animate={{ marginLeft: sidebarOpen ? 260 : 72 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className={`flex-1 min-h-screen px-3 sm:px-4 md:px-6 py-4 md:py-6 transition-all duration-300 ${sidebarOpen ? "md:ml-65" : "md:ml-18"
          }`}
      >
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="mb-6"
        >
          <span className="text-xs tracking-wide text-neutral-400">
            Overview
          </span>
          <h1 className="text-2xl font-semibold mt-1">
            Hello, {user?.name || "there"} 👋
          </h1>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((card, i) => (
            <Statbox
              key={card.label}
              label={card.label}
              value={card.value}
              sub={card.sub}
              subHighlight={card.subHighlight}
              index={i}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="mb-4"
        >
          <span className="text-xs tracking-wide text-neutral-400">
            Performance
          </span>
          <h2 className="text-lg font-semibold mt-1">Interview History</h2>
        </motion.div>

        <InterviewGraph
          stats={stats}
          technicalData={technicalData}
          hrData={hrData}
          technicalCount={technicalCount}
          hrCount={hrCount}
        />
      </motion.main>
    </div>
  );
}

export default Dashboard;
import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiArrowLeft,
  FiDownload,
  FiCheckCircle,
  FiAlertTriangle,
  FiTrendingUp,
  FiMessageSquare,
  FiAward,
  FiTarget,
  FiZap,
} from "react-icons/fi";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const DIFFICULTY_COLORS = {
  easy: { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/20" },
  medium: { bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/20" },
  hard: { bg: "bg-red-500/10", text: "text-red-400", border: "border-red-500/20" },
};

const METRIC_LABELS = [
  { key: "correctness", label: "Correctness" },
  { key: "clarity", label: "Clarity" },
  { key: "relevance", label: "Relevance" },
  { key: "detail", label: "Detail" },
  { key: "efficiency", label: "Efficiency" },
  { key: "communication", label: "Communication" },
  { key: "problemSolving", label: "Problem Solving" },
  { key: "creativity", label: "Creativity" },
];

function ScoreRing({ score, size = 120, strokeWidth = 8 }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const safeScore = Math.min(100, Math.max(0, score || 0));
  const offset = circumference - (safeScore / 100) * circumference;

  const color =
    safeScore >= 70
      ? "stroke-emerald-400"
      : safeScore >= 40
        ? "stroke-amber-400"
        : "stroke-red-400";

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          className={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold text-white">{safeScore}</span>
        <span className="text-[10px] text-white/40 uppercase tracking-wider">Score</span>
      </div>
    </div>
  );
}

function MetricBar({ label, value }) {
  const safeValue = Math.min(10, Math.max(0, value || 0));
  const pct = (safeValue / 10) * 100;
  const color =
    safeValue >= 7
      ? "bg-emerald-400"
      : safeValue >= 4
        ? "bg-amber-400"
        : "bg-red-400";

  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-white/50 w-28 shrink-0 text-right">{label}</span>
      <div className="flex-1 h-1.5 rounded-full bg-white/5 overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${color}`}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
        />
      </div>
      <span className="text-xs text-white/60 w-6 text-right font-medium">{safeValue}</span>
    </div>
  );
}

function TagList({ items, icon: Icon, color = "emerald" }) {
  if (!items || items.length === 0) return null;
  const colors = {
    emerald: { bg: "bg-emerald-500/8", border: "border-emerald-500/15", text: "text-emerald-400", icon: "text-emerald-400" },
    red: { bg: "bg-red-500/8", border: "border-red-500/15", text: "text-red-400", icon: "text-red-400" },
    blue: { bg: "bg-blue-500/8", border: "border-blue-500/15", text: "text-blue-400", icon: "text-blue-400" },
  };
  const c = colors[color];

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 * i }}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border ${c.bg} ${c.border} ${c.text}`}
        >
          <Icon size={12} className={c.icon} />
          {item}
        </motion.span>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------
function Step3report({ user, setUser, report }) {
  const navigate = useNavigate();
  const reportRef = useRef();

  const questions = report?.questions || [];
  const overallScore = report?.overallScore || 0;
  const avgQuestionScore =
    questions.length > 0
      ? Math.round(
        questions.reduce((sum, q) => sum + (q.feedback?.score || 0), 0) /
        questions.length
      )
      : 0;

  // Aggregate metrics across all questions
  const aggregatedMetrics = METRIC_LABELS.map(({ key, label }) => {
    const total = questions.reduce((s, q) => s + (q.feedback?.[key] || 0), 0);
    const avg = questions.length > 0 ? Math.round((total / questions.length) * 10) / 10 : 0;
    return { key, label, value: avg };
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen w-full bg-[#0a0a0b] text-white">
      <div ref={reportRef} className="max-w-5xl mx-auto px-4 sm:px-8 py-8 sm:py-12">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-10"
        >
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ x: -3 }}
              onClick={() => navigate("/dashboard")}
              className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors"
            >
              <FiArrowLeft size={16} />
            </motion.button>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Interview Report</h1>
              <p className="text-xs text-white/35 mt-0.5">
                {report?.role} • {report?.type?.toUpperCase()} • {questions.length} Questions
              </p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white/70 hover:text-white transition-colors print:hidden"
          >
            <FiDownload size={14} />
            Export
          </motion.button>
        </motion.div>

        {/* Score Overview Card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border border-white/8 bg-[#111113] p-6 sm:p-8 mb-6"
        >
          <div className="flex flex-col sm:flex-row items-center gap-8">
            <ScoreRing score={overallScore} />

            <div className="flex-1 w-full">
              <div className="flex items-center gap-2 mb-3">
                <FiAward size={16} className="text-white/40" />
                <span className="text-sm font-semibold text-white/70">Performance Overview</span>
              </div>

              {report?.summary && (
                <p className="text-sm text-white/50 leading-relaxed mb-5">
                  {report.summary}
                </p>
              )}

              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-xl bg-white/3 border border-white/5 p-3 text-center">
                  <span className="text-lg font-bold text-white">{overallScore}</span>
                  <p className="text-[10px] text-white/35 mt-0.5">Overall</p>
                </div>
                <div className="rounded-xl bg-white/3 border border-white/5 p-3 text-center">
                  <span className="text-lg font-bold text-white">{avgQuestionScore}</span>
                  <p className="text-[10px] text-white/35 mt-0.5">Avg / Question</p>
                </div>
                <div className="rounded-xl bg-white/3 border border-white/5 p-3 text-center">
                  <span className="text-lg font-bold text-white">{questions.length}</span>
                  <p className="text-[10px] text-white/35 mt-0.5">Questions</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Metrics Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl border border-white/8 bg-[#111113] p-6 sm:p-8 mb-6"
        >
          <div className="flex items-center gap-2 mb-5">
            <FiTarget size={16} className="text-white/40" />
            <span className="text-sm font-semibold text-white/70">Skill Metrics</span>
          </div>
          <div className="space-y-3">
            {aggregatedMetrics.map((m) => (
              <MetricBar key={m.key} label={m.label} value={m.value} />
            ))}
          </div>
        </motion.div>

        {/* Strengths / Weaknesses / Recommendations */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Strengths */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-2xl border border-white/8 bg-[#111113] p-5"
          >
            <div className="flex items-center gap-2 mb-4">
              <FiCheckCircle size={14} className="text-emerald-400" />
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Strengths</span>
            </div>
            {report?.strengths?.length > 0 ? (
              <ul className="space-y-2">
                {report.strengths.map((s, i) => (
                  <li key={i} className="text-xs text-white/60 leading-relaxed flex items-start gap-2">
                    <span className="w-1 h-1 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                    {s}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-white/25">No data available</p>
            )}
          </motion.div>

          {/* Weaknesses */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="rounded-2xl border border-white/8 bg-[#111113] p-5"
          >
            <div className="flex items-center gap-2 mb-4">
              <FiAlertTriangle size={14} className="text-red-400" />
              <span className="text-xs font-semibold text-red-400 uppercase tracking-wider">Weaknesses</span>
            </div>
            {report?.weaknesses?.length > 0 ? (
              <ul className="space-y-2">
                {report.weaknesses.map((w, i) => (
                  <li key={i} className="text-xs text-white/60 leading-relaxed flex items-start gap-2">
                    <span className="w-1 h-1 rounded-full bg-red-400 mt-1.5 shrink-0" />
                    {w}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-white/25">No data available</p>
            )}
          </motion.div>

          {/* Recommendations */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="rounded-2xl border border-white/8 bg-[#111113] p-5"
          >
            <div className="flex items-center gap-2 mb-4">
              <FiTrendingUp size={14} className="text-blue-400" />
              <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">Recommendations</span>
            </div>
            {report?.recommendations?.length > 0 ? (
              <ul className="space-y-2">
                {report.recommendations.map((r, i) => (
                  <li key={i} className="text-xs text-white/60 leading-relaxed flex items-start gap-2">
                    <span className="w-1 h-1 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                    {r}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-white/25">No data available</p>
            )}
          </motion.div>
        </div>

        {/* Per-Question Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 mb-4">
            <FiMessageSquare size={16} className="text-white/40" />
            <span className="text-sm font-semibold text-white/70">Question Breakdown</span>
          </div>

          <div className="space-y-4">
            {questions.map((q, idx) => {
              const dc = DIFFICULTY_COLORS[q.difficulty] || DIFFICULTY_COLORS.easy;
              const fb = q.feedback || {};

              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + idx * 0.08 }}
                  className="rounded-2xl border border-white/8 bg-[#111113] overflow-hidden"
                >
                  {/* Question Header */}
                  <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-xs font-bold text-white/50">
                        {idx + 1}
                      </span>
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase ${dc.bg} ${dc.text} ${dc.border} border`}>
                        {q.difficulty}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FiZap size={12} className="text-white/30" />
                      <span className="text-sm font-bold text-white">{fb.score || 0}</span>
                      <span className="text-[10px] text-white/30">/100</span>
                    </div>
                  </div>

                  <div className="px-5 py-4 space-y-4">
                    {/* Question */}
                    <div>
                      <span className="text-[10px] text-white/25 uppercase tracking-wider block mb-1">Question</span>
                      <p className="text-sm text-white/80 leading-relaxed">{q.question}</p>
                    </div>

                    {/* User Answer */}
                    <div>
                      <span className="text-[10px] text-white/25 uppercase tracking-wider block mb-1">Your Answer</span>
                      <p className="text-sm text-white/50 leading-relaxed bg-white/2 rounded-lg p-3 border border-white/5">
                        {q.userAnswer || <span className="italic text-white/20">No answer provided</span>}
                      </p>
                    </div>

                    {/* AI Feedback */}
                    {fb.feedback && (
                      <div>
                        <span className="text-[10px] text-emerald-400/60 uppercase tracking-wider block mb-1">AI Feedback</span>
                        <p className="text-sm text-white/60 leading-relaxed bg-emerald-500/5 rounded-lg p-3 border border-emerald-500/10">
                          {fb.feedback}
                        </p>
                      </div>
                    )}

                    {/* Improvements */}
                    {fb.improvements && fb.improvements.length > 0 && (
                      <div>
                        <span className="text-[10px] text-amber-400/60 uppercase tracking-wider block mb-2">Suggested Improvements</span>
                        <TagList items={fb.improvements} icon={FiTrendingUp} color="blue" />
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Bottom Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex items-center justify-between pt-4 border-t border-white/5 print:hidden"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/interview")}
            className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white/60 hover:text-white transition-colors"
          >
            New Interview
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/dashboard")}
            className="px-5 py-2.5 rounded-xl bg-white text-black text-xs font-semibold"
          >
            Back to Dashboard
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}

export default Step3report;

import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
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
  FiChevronDown,
} from "react-icons/fi";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

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
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
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
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold text-white tracking-tighter">{safeScore}</span>
        <span className="text-[10px] text-white/40 uppercase tracking-widest mt-0.5">Score</span>
      </div>
    </div>
  );
}

function TagList({ items, icon: Icon, color = "emerald" }) {
  if (!items || items.length === 0) return null;
  const colors = {
    emerald: { bg: "bg-emerald-500/10", border: "border-emerald-500/20", text: "text-emerald-300", icon: "text-emerald-400" },
    red: { bg: "bg-red-500/10", border: "border-red-500/20", text: "text-red-300", icon: "text-red-400" },
    blue: { bg: "bg-blue-500/10", border: "border-blue-500/20", text: "text-blue-300", icon: "text-blue-400" },
    amber: { bg: "bg-amber-500/10", border: "border-amber-500/20", text: "text-amber-300", icon: "text-amber-400" },
  };
  const c = colors[color] || colors.emerald;

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item, i) => (
        <span
          key={i}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border ${c.bg} ${c.border} ${c.text} shadow-sm backdrop-blur-sm`}
        >
          {Icon && <Icon size={12} className={c.icon} />}
          {item}
        </span>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Animations
// ---------------------------------------------------------------------------
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#111113]/90 border border-white/10 backdrop-blur-md p-3 rounded-xl shadow-xl">
        <p className="text-white/80 text-xs font-medium mb-1">{payload[0].payload.label}</p>
        <p className="text-emerald-400 text-sm font-bold">{payload[0].value} <span className="text-white/40 text-[10px] font-normal">/ 10</span></p>
      </div>
    );
  }
  return null;
};

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------
function Step3report({ user, setUser, report }) {
  const navigate = useNavigate();
  const reportRef = useRef();
  const [expandedQuestion, setExpandedQuestion] = React.useState(0);

  const questions = report?.questions || [];
  
  const avgQuestionScore =
    questions.length > 0
      ? Math.round(
        questions.reduce((sum, q) => sum + (q.feedback?.score || 0), 0) /
        questions.length
      )
      : 0;

  // Sometimes feedback is nested in report.feedback depending on the backend structure
  const overallScore = report?.overallScore || report?.feedback?.overallScore || avgQuestionScore || 0;
  const summary = report?.summary || report?.feedback?.summary || "";
  const strengths = report?.strengths || report?.feedback?.strengths || [];
  const weaknesses = report?.weaknesses || report?.feedback?.weaknesses || [];
  const recommendations = report?.recommendations || report?.feedback?.recommendations || [];

  // Aggregate metrics across all questions
  const aggregatedMetrics = METRIC_LABELS.map(({ key, label }) => {
    const total = questions.reduce((s, q) => s + (q.feedback?.[key] || 0), 0);
    const avg = questions.length > 0 ? Math.round((total / questions.length) * 10) / 10 : 0;
    return { key, label, value: avg, fullMark: 10 };
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen w-full bg-[#050505] text-white overflow-x-hidden selection:bg-white/20">
      {/* Background Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden flex items-center justify-center">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-500/5 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/5 blur-[120px]" />
      </div>

      <div ref={reportRef} className="max-w-6xl mx-auto px-4 sm:px-8 py-8 sm:py-12 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/dashboard")}
                className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all shadow-lg backdrop-blur-sm"
              >
                <FiArrowLeft size={18} />
              </motion.button>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
                  Interview Report
                </h1>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase bg-white/10 text-white/70 border border-white/5">
                    {report?.role || "Role"}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {report?.type || "Type"}
                  </span>
                  <span className="text-xs text-white/40">{questions.length} Questions</span>
                </div>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handlePrint}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 transition-all shadow-lg backdrop-blur-sm print:hidden self-start sm:self-auto"
            >
              <FiDownload size={16} />
              Export PDF
            </motion.button>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Score Overview Card */}
            <motion.div variants={itemVariants} className="lg:col-span-7 rounded-3xl border border-white/10 bg-[#111113]/80 backdrop-blur-md p-6 sm:p-8 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500/0 via-emerald-500/50 to-emerald-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8">
                <div className="shrink-0 drop-shadow-[0_0_15px_rgba(52,211,153,0.1)]">
                   <ScoreRing score={overallScore} size={140} strokeWidth={10} />
                </div>
                
                <div className="flex-1 w-full text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start gap-2 mb-4">
                    <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
                       <FiAward size={18} />
                    </div>
                    <h2 className="text-base font-semibold text-white/90">Performance Summary</h2>
                  </div>

                  {summary && (
                    <p className="text-sm text-white/60 leading-relaxed mb-6 font-medium">
                      {summary}
                    </p>
                  )}

                  <div className="grid grid-cols-3 gap-3">
                    <div className="rounded-2xl bg-white/5 border border-white/10 p-3 sm:p-4 hover:bg-white/10 transition-colors">
                      <span className="text-xl font-bold text-white tracking-tight">{overallScore}</span>
                      <p className="text-[10px] text-white/40 uppercase tracking-widest mt-1">Overall</p>
                    </div>
                    <div className="rounded-2xl bg-white/5 border border-white/10 p-3 sm:p-4 hover:bg-white/10 transition-colors">
                      <span className="text-xl font-bold text-white tracking-tight">{avgQuestionScore}</span>
                      <p className="text-[10px] text-white/40 uppercase tracking-widest mt-1">Avg Score</p>
                    </div>
                    <div className="rounded-2xl bg-white/5 border border-white/10 p-3 sm:p-4 hover:bg-white/10 transition-colors">
                      <span className="text-xl font-bold text-white tracking-tight">{questions.length}</span>
                      <p className="text-[10px] text-white/40 uppercase tracking-widest mt-1">Questions</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Radar Chart */}
            <motion.div variants={itemVariants} className="lg:col-span-5 rounded-3xl border border-white/10 bg-[#111113]/80 backdrop-blur-md p-6 sm:p-8 shadow-2xl flex flex-col">
              <div className="flex items-center gap-2 mb-4">
                 <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400">
                    <FiTarget size={18} />
                 </div>
                 <h2 className="text-base font-semibold text-white/90">Skill Analysis</h2>
              </div>
              <div className="flex-1 w-full min-h-[250px] relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="75%" data={aggregatedMetrics}>
                      <PolarGrid stroke="rgba(255,255,255,0.1)" />
                      <PolarAngleAxis 
                         dataKey="label" 
                         tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10, fontWeight: 500 }} 
                      />
                      <PolarRadiusAxis angle={30} domain={[0, 10]} tick={false} axisLine={false} />
                      <Tooltip content={<CustomTooltip />} />
                      <Radar
                        name="Skills"
                        dataKey="value"
                        stroke="#34d399"
                        strokeWidth={2}
                        fill="#34d399"
                        fillOpacity={0.2}
                        isAnimationActive={true}
                        animationBegin={400}
                        animationDuration={1500}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
              </div>
            </motion.div>
          </div>

          {/* Strengths / Weaknesses / Recommendations */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div variants={itemVariants} className="rounded-3xl border border-emerald-500/10 bg-emerald-500/[0.02] p-6 shadow-xl relative overflow-hidden group hover:bg-emerald-500/[0.04] transition-colors">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-[50px] rounded-full translate-x-1/2 -translate-y-1/2" />
              <div className="flex items-center gap-3 mb-5 relative z-10">
                <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                   <FiCheckCircle size={16} />
                </div>
                <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-widest">Strengths</h3>
              </div>
              {strengths?.length > 0 ? (
                <ul className="space-y-3 relative z-10">
                  {strengths.map((s, i) => (
                    <li key={i} className="text-sm text-white/70 leading-relaxed flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 shrink-0 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                      {s}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-white/30 italic">No data available</p>
              )}
            </motion.div>

            <motion.div variants={itemVariants} className="rounded-3xl border border-red-500/10 bg-red-500/[0.02] p-6 shadow-xl relative overflow-hidden group hover:bg-red-500/[0.04] transition-colors">
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 blur-[50px] rounded-full translate-x-1/2 -translate-y-1/2" />
              <div className="flex items-center gap-3 mb-5 relative z-10">
                <div className="p-2 rounded-xl bg-red-500/20 text-red-400">
                   <FiAlertTriangle size={16} />
                </div>
                <h3 className="text-sm font-bold text-red-400 uppercase tracking-widest">Areas to Improve</h3>
              </div>
              {weaknesses?.length > 0 ? (
                <ul className="space-y-3 relative z-10">
                  {weaknesses.map((w, i) => (
                    <li key={i} className="text-sm text-white/70 leading-relaxed flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 shrink-0 shadow-[0_0_8px_rgba(248,113,113,0.8)]" />
                      {w}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-white/30 italic">No data available</p>
              )}
            </motion.div>

            <motion.div variants={itemVariants} className="rounded-3xl border border-blue-500/10 bg-blue-500/[0.02] p-6 shadow-xl relative overflow-hidden group hover:bg-blue-500/[0.04] transition-colors">
               <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-[50px] rounded-full translate-x-1/2 -translate-y-1/2" />
              <div className="flex items-center gap-3 mb-5 relative z-10">
                <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400">
                   <FiTrendingUp size={16} />
                </div>
                <h3 className="text-sm font-bold text-blue-400 uppercase tracking-widest">Action Plan</h3>
              </div>
              {recommendations?.length > 0 ? (
                <ul className="space-y-3 relative z-10">
                  {recommendations.map((r, i) => (
                    <li key={i} className="text-sm text-white/70 leading-relaxed flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 shrink-0 shadow-[0_0_8px_rgba(96,165,250,0.8)]" />
                      {r}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-white/30 italic">No data available</p>
              )}
            </motion.div>
          </div>

          {/* Per-Question Breakdown */}
          <motion.div variants={itemVariants} className="mt-10">
            <div className="flex items-center gap-3 mb-6">
               <div className="p-2 rounded-xl bg-white/5 border border-white/10 text-white/60">
                 <FiMessageSquare size={18} />
               </div>
               <h2 className="text-xl font-bold text-white/90 tracking-tight">Detailed Breakdown</h2>
            </div>

            <div className="space-y-4">
              {questions.map((q, idx) => {
                const dc = DIFFICULTY_COLORS[q.difficulty] || DIFFICULTY_COLORS.easy;
                const fb = q.feedback || {};
                const isExpanded = expandedQuestion === idx;

                return (
                  <motion.div
                    key={idx}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * idx, duration: 0.4 }}
                    className="rounded-3xl border border-white/10 bg-[#111113]/60 backdrop-blur-md overflow-hidden hover:border-white/20 transition-colors shadow-lg"
                  >
                    {/* Question Header - Clickable */}
                    <div 
                       onClick={() => setExpandedQuestion(isExpanded ? null : idx)}
                       className="px-6 py-5 cursor-pointer flex items-center justify-between bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
                    >
                      <div className="flex items-center gap-4 flex-1 pr-4">
                        <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-sm font-bold text-white/70 border border-white/10 shrink-0 shadow-inner">
                          {idx + 1}
                        </div>
                        <div className="flex flex-col gap-1.5 max-w-full">
                           <div className="flex items-center gap-2">
                             <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${dc.bg} ${dc.text} ${dc.border} border tracking-wider`}>
                               {q.difficulty}
                             </span>
                           </div>
                           <p className="text-sm font-medium text-white/90 line-clamp-1">{q.question}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-6 shrink-0">
                         <div className="flex flex-col items-end">
                            <span className="text-[10px] text-white/40 uppercase tracking-widest mb-0.5">Score</span>
                            <div className="flex items-baseline gap-1">
                               <FiZap size={14} className={fb.score >= 70 ? "text-emerald-400" : fb.score >= 40 ? "text-amber-400" : "text-red-400"} />
                               <span className="text-lg font-bold text-white">{fb.score || 0}</span>
                            </div>
                         </div>
                         <motion.div
                            animate={{ rotate: isExpanded ? 180 : 0 }}
                            transition={{ duration: 0.3 }}
                            className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/40 border border-white/5"
                         >
                            <FiChevronDown size={16} />
                         </motion.div>
                      </div>
                    </div>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                          className="border-t border-white/5"
                        >
                          <div className="px-6 py-6 space-y-6">
                            {/* Full Question */}
                            <div>
                              <span className="text-[10px] text-white/30 uppercase tracking-widest font-semibold block mb-2">Question</span>
                              <p className="text-base text-white/90 leading-relaxed font-medium">{q.question}</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              {/* User Answer */}
                              <div>
                                <span className="text-[10px] text-white/30 uppercase tracking-widest font-semibold block mb-2">Your Answer</span>
                                <div className="bg-white/5 rounded-2xl p-5 border border-white/10 h-full">
                                  <p className="text-sm text-white/70 leading-relaxed whitespace-pre-wrap">
                                    {q.userAnswer || <span className="italic text-white/30">No answer provided</span>}
                                  </p>
                                </div>
                              </div>

                              {/* AI Feedback */}
                              {fb.feedback && (
                                <div className="flex flex-col h-full">
                                  <span className="text-[10px] text-emerald-400/70 uppercase tracking-widest font-semibold block mb-2">Expert Feedback</span>
                                  <div className="bg-emerald-500/5 rounded-2xl p-5 border border-emerald-500/10 flex-1 relative overflow-hidden">
                                     <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 blur-[30px] rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />
                                    <p className="text-sm text-emerald-100/80 leading-relaxed whitespace-pre-wrap relative z-10">
                                      {fb.feedback}
                                    </p>
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Improvements */}
                            {fb.improvements && fb.improvements.length > 0 && (
                              <div className="pt-2">
                                <span className="text-[10px] text-blue-400/70 uppercase tracking-widest font-semibold block mb-3">Key Improvements</span>
                                <TagList items={fb.improvements} icon={FiTrendingUp} color="blue" />
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Bottom Actions */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-10 border-t border-white/10 print:hidden"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/interview")}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-sm font-semibold text-white/80 hover:text-white hover:bg-white/10 transition-all shadow-lg backdrop-blur-sm"
            >
              Start New Interview
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/dashboard")}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-400 to-emerald-500 text-black text-sm font-bold shadow-[0_0_20px_rgba(52,211,153,0.3)] hover:shadow-[0_0_30px_rgba(52,211,153,0.5)] transition-shadow"
            >
              Return to Dashboard
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default Step3report;

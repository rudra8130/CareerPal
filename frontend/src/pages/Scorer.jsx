import React, { useState } from "react";
import { motion } from "framer-motion"; // Changed from motion/react for standard import
import { useNavigate } from "react-router";
import {
  HiOutlineCloudUpload,
  HiOutlineDocumentText,
  HiOutlineCheckCircle,
  HiOutlineExclamationCircle,
  HiOutlineLightningBolt,
  HiOutlineTrendingUp,
  HiOutlineUser,
  HiOutlineRefresh,
} from "react-icons/hi";
import api from "../utils/axios";
import { useDispatch, useSelector } from "react-redux";
import { setResume } from "../redux/resumeSlice";
import { usecoins } from "../apis/user.api";

// ---- helpers -------------------------------------------------------------

const getVerdict = (score) => {
  if (score > 75) return { label: "Strong", color: "#7c3aed" };
  if (score >= 50) return { label: "Average", color: "#f59e0b" };
  return { label: "Needs Work", color: "#ef4444" };
};

const ScoreRing = ({ score = 0 }) => {
  const { label, color } = getVerdict(score);
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative flex h-24 w-24 shrink-0 items-center justify-center sm:h-28 sm:w-28">
      <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="7"
        />
        <motion.circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-xl font-bold text-white sm:text-2xl">
          {score}
          <span className="text-xs font-medium text-neutral-500">/100</span>
        </span>
      </div>
    </div>
  );
};

const TAG_STYLES = {
  green: "bg-emerald-950/60 text-emerald-400 border-emerald-900",
  yellow: "bg-amber-950/60 text-amber-400 border-amber-900",
  red: "bg-red-950/60 text-red-400 border-red-900",
  purple: "bg-purple-950/60 text-purple-300 border-purple-900",
};

const Tag = ({ text, color = "purple" }) => (
  <span
    className={`inline-block rounded-lg border px-3 py-1.5 text-xs font-medium ${TAG_STYLES[color]}`}
  >
    {text}
  </span>
);

const SectionCard = ({ icon, iconColor, title, children }) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, y: 40 },
      show: { opacity: 1, y: 0 },
    }}
    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    className="rounded-2xl border border-neutral-800 bg-neutral-900 p-5"
  >
    <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
      <span className={iconColor}>{icon}</span>
      {title}
    </div>
    <div className="flex flex-wrap gap-2">{children}</div>
  </motion.div>
);

// ---- navbar ---------------------------------------------------

const Navbar = ({ label }) => {
  const navigate = useNavigate();
  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed inset-x-0 top-0 z-20 border-b border-black/8 bg-white/80 backdrop-blur-xl"
    >
      <div className="mx-auto flex h-12 max-w-7xl items-center justify-between px-3 sm:px-5">
        <div
          onClick={() => navigate("/dashboard")}
          className="flex cursor-pointer items-center gap-2 font-bold text-neutral-900"
        >
          <div className="w-6 h-6 bg-black rounded-lg flex items-center justify-center text-white text-xs">
            C
          </div>
          <span>CareerPal</span>
          {label && (
            <span className="text-xs font-medium text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded-md border border-neutral-200">
              {label}
            </span>
          )}
        </div>
      </div>
    </motion.nav>
  );
};

// ---- main component --------------------------------------------------------

function Scorer({ user, setuser: setUser }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const dispatch = useDispatch();
  const { resume } = useSelector((state) => state.resume);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.type === "application/pdf") {
        setFile(selectedFile);
      } else {
        alert("Please upload a valid .pdf file only.");
      }
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      if (droppedFile.type === "application/pdf") {
        setFile(droppedFile);
      } else {
        alert("Please upload a valid .pdf file only.");
      }
    }
  };

  const uploadResume = async () => {
    if (!file) {
      alert("Please select a PDF file first.");
      return;
    }
    try {
      setLoading(true);

      const coinresponse = await usecoins({
        coins: 10,
        action: "resume-scorer",
      });

      if (typeof setUser === "function") {
        setUser((prev) => ({
          ...prev,
          interviewCoin: coinresponse?.interviewCoin,
        }));
      }

      const formdata = new FormData();
      formdata.append("resume", file);

      const response = await api.post("/api/resume/upload", formdata);
      dispatch(setResume(response?.data?.data));
      setLoading(false);
      alert("Resume uploaded successfully!");
    } catch (error) {
      console.log(error);
      alert("Upload failed");
      setLoading(false);
    }
  };

  const handleReupload = () => {
    setFile(null);
    dispatch(setResume(null));
  };

  // ---- result view -------------------------------------------------------

  if (resume) {
    const { label } = getVerdict(resume.score);

    const containerVariants = {
      hidden: {},
      show: {
        transition: { staggerChildren: 0.12, delayChildren: 0.15 },
      },
    };

    return (
      <div className="min-h-screen bg-white pb-16 pt-20 sm:pt-24">
        <Navbar label="Resume Scorer" />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="mx-auto flex w-full max-w-3xl flex-col gap-5 px-4 sm:px-6"
        >
          {/* Header */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 40 },
              show: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center justify-between"
          >
            <div>
              <p className="text-xs font-medium text-neutral-400">
                Resume Analysis
              </p>
              <h1 className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">
                {resume.name || "Your Resume"}
              </h1>
            </div>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleReupload}
              className="flex shrink-0 items-center gap-1.5 rounded-lg border border-neutral-200 px-3 py-1.5 text-xs font-medium text-neutral-600 hover:bg-neutral-50"
            >
              <HiOutlineRefresh size={14} />
              Re-upload
            </motion.button>
          </motion.div>

          {/* Score card */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 40 },
              show: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center gap-4 rounded-2xl border border-neutral-800 bg-neutral-900 p-6 sm:flex-row sm:gap-6 sm:p-7"
          >
            <ScoreRing score={resume.score} />
            <div className="flex flex-col items-center gap-1 text-center sm:items-start sm:text-left">
              <span className="text-xs font-medium text-neutral-400">
                Resume Score
              </span>
              <span className="text-2xl font-bold text-white">{label}</span>
              {resume.suggestedRole && (
                <span className="mt-1 flex items-center gap-1.5 text-sm text-neutral-300">
                  <HiOutlineUser size={15} className="text-purple-400" />
                  {resume.suggestedRole}
                </span>
              )}
            </div>
          </motion.div>

          {/* Strengths & Weaknesses */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {resume.strengths?.length > 0 && (
              <SectionCard
                title="Strengths"
                icon={<HiOutlineCheckCircle size={17} />}
                iconColor="text-emerald-400"
              >
                {resume.strengths.map((s, i) => (
                  <Tag key={i} text={s} color="green" />
                ))}
              </SectionCard>
            )}

            {resume.weaknesses?.length > 0 && (
              <SectionCard
                title="Weaknesses"
                icon={<HiOutlineExclamationCircle size={17} />}
                iconColor="text-amber-400"
              >
                {resume.weaknesses.map((w, i) => (
                  <Tag key={i} text={w} color="yellow" />
                ))}
              </SectionCard>
            )}
          </div>

          {/* Missing Skills */}
          {resume.missingSkills?.length > 0 && (
            <SectionCard
              title="Missing Skills"
              icon={<HiOutlineLightningBolt size={17} />}
              iconColor="text-red-400"
            >
              {resume.missingSkills.map((m, i) => (
                <Tag key={i} text={m} color="red" />
              ))}
            </SectionCard>
          )}

          {/* Recommendations */}
          {resume.recommendations?.length > 0 && (
            <SectionCard
              title="Recommendations"
              icon={<HiOutlineTrendingUp size={17} />}
              iconColor="text-purple-400"
            >
              {resume.recommendations.map((r, i) => (
                <Tag key={i} text={r} color="purple" />
              ))}
            </SectionCard>
          )}
        </motion.div>
      </div>
    );
  }

  // ---- upload view --------------------------------------------

  return (
    <div className="min-h-screen bg-white pt-24 pb-12 flex flex-col items-center justify-center select-none">
      <Navbar label="Resume Scorer" />

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md bg-neutral-900 text-white rounded-3xl p-6 shadow-2xl border border-neutral-800 flex flex-col justify-between"
      >
        <div>
          <div className="flex justify-between items-center text-xs text-neutral-400 font-medium uppercase tracking-wider mb-2">
            <span>Step {file ? "2" : "1"} of 2</span>
            <span>{file ? "Ready to Analyze" : "Upload File"}</span>
          </div>

          <div className="w-full h-1 bg-neutral-800 rounded-full overflow-hidden mb-6">
            <motion.div
              className="h-full bg-white rounded-full"
              initial={{ width: "50%" }}
              animate={{ width: file ? "100%" : "50%" }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            />
          </div>

          <h2 className="text-xl font-bold tracking-tight mb-1">
            Upload Your Resume
          </h2>
          <p className="text-xs text-neutral-400 mb-6">
            We'll score it and give you actionable feedback
          </p>

          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            className={`relative border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center text-center transition-all bg-neutral-950/50 ${
              dragOver
                ? "border-white bg-neutral-900"
                : "border-neutral-700 hover:border-neutral-500"
            }`}
          >
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
            />

            {file ? (
              <div className="flex flex-col items-center gap-2 z-0">
                <div className="w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center">
                  <HiOutlineDocumentText size={22} />
                </div>
                <span className="text-sm font-semibold text-white max-w-60 truncate">
                  {file.name}
                </span>
                <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                  <HiOutlineCheckCircle size={14} /> PDF attached successfully
                </span>
                <span className="text-[10px] text-neutral-500 underline mt-1">
                  Click or drag to replace
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 z-0 pointer-events-none">
                <div className="w-12 h-12 rounded-full bg-neutral-800 text-neutral-300 flex items-center justify-center shadow-inner">
                  <HiOutlineCloudUpload size={24} />
                </div>
                <div className="text-xs font-medium text-neutral-200">
                  Click or drag PDF here
                </div>
                <span className="text-[10px] text-neutral-500">
                  PDF only · Max 20MB
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8">
          <motion.button
            whileHover={{ scale: file ? 1.02 : 1 }}
            whileTap={{ scale: file ? 0.98 : 1 }}
            onClick={uploadResume}
            disabled={!file || loading}
            className={`w-full py-3.5 rounded-xl text-xs font-semibold tracking-wide transition-all shadow-lg ${
              file
                ? "bg-white text-black hover:bg-neutral-200 cursor-pointer"
                : "bg-neutral-800 text-neutral-500 cursor-not-allowed"
            }`}
          >
            {loading ? "Analyzing..." : "Analyze Resume"}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}

export default Scorer;

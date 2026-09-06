import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { usecoins } from "../../apis/user.api.js";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../utils/axios.js";
import { setResume } from "../../redux/resumeSlice";
import { startInterview } from "../../apis/interview.api.js";

import {
  HiArrowLeft,
  HiOutlineCheck,
  HiOutlineBriefcase,
  HiOutlineUpload,
  HiOutlineDocumentText,
  HiOutlineCheckCircle,
} from "react-icons/hi";

function Step1setup({ user, setuser: setUser }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [role, setrole] = useState("");
  const [type, settype] = useState("technical");
  const [file, setfile] = useState(null);
  const [uploading, setuploading] = useState(false);
  const [starting, setstarting] = useState(false);

  const { resume } = useSelector((state) => state.resume);
  const [useResume, setuseResume] = useState(!!resume);

  // PDF File validation
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.type === "application/pdf") {
        setfile(selectedFile);
      } else {
        alert("Please upload a valid .pdf file only.");
      }
    }
  };

  // Upload Resume handler
  const uploadResume = async () => {
    if (!file) {
      alert("Please select a PDF file first.");
      return;
    }
    try {
      setuploading(true);

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
      setuploading(false);
      alert("Resume uploaded successfully!");
    } catch (error) {
      console.log(error);
      alert("Upload failed");
      setuploading(false);
    }
  };

  // Start Interview handler
  const start = async () => {
    if (!role.trim()) {
      alert("Please enter a target job role.");
      return;
    }

    try {
      setstarting(true);
      const response = await startInterview({ role, type, useResume, resume });

      if (response) {
        const coinresponse = await usecoins({
          coins: 50,
          action: "start-interview",
        });

        if (typeof setUser === "function") {
          setUser((prev) => ({
            ...prev,
            interviewCoin: coinresponse?.interviewCoin,
          }));
        }

        navigate(`/interview/${response.interviewId}`);
      }
    } catch (error) {
      console.log(error);
      alert("Failed to start interview");
    } finally {
      setstarting(false);
    }
  };

  const features = [
    "Personalized AI Questions",
    "Resume Based Interview",
    "Detailed Performance Report",
    "Real Interview Experience",
  ];

  return (
    <div className="min-h-screen bg-[#0d0d0e] text-white flex items-center justify-center p-4 sm:p-6 select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-5xl bg-[#121316] border border-neutral-800 rounded-2xl p-6 sm:p-10 shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12"
      >
        {/* Left Side: Information */}
        <div className="lg:col-span-5 flex flex-col justify-between">
          <div>
            <motion.button
              whileHover={{ x: -3 }}
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-xs text-neutral-400 hover:text-white bg-neutral-900 border border-neutral-800 rounded-full px-3.5 py-1.5 mb-8 w-fit transition-colors"
            >
              <HiArrowLeft size={14} /> Back
            </motion.button>

            <h1 className="text-3xl font-bold tracking-tight text-white mb-2">
              Welcome back,
              <br />
              <span className="text-white">{user?.name || "Candidate"}</span>
            </h1>

            <p className="text-xs text-neutral-400 leading-relaxed mb-8">
              Practice realistic AI interviews, receive instant feedback, and
              improve before your next job interview.
            </p>

            <div className="space-y-3">
              {features.map((feature, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ x: 4 }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * idx }}
                  className="flex items-center gap-3 bg-[#18191d] border border-neutral-800/80 px-4 py-3 rounded-xl text-xs font-medium text-neutral-200"
                >
                  <div className="w-5 h-5 rounded-full bg-white text-black flex items-center justify-center shrink-0">
                    <HiOutlineCheck size={13} strokeWidth={2.5} />
                  </div>
                  <span>{feature}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Form Controls */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-bold tracking-tight text-white">
                Start Interview
              </h2>
              <p className="text-xs text-neutral-400">
                Configure your interview preferences.
              </p>
            </div>

            <div className="space-y-5">
              {/* Target Role */}
              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-2">
                  Target Role
                </label>
                <div className="relative">
                  <HiOutlineBriefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500 text-base" />
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setrole(e.target.value)}
                    placeholder="Backend Developer"
                    className="w-full bg-[#18191d] border border-neutral-800 rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-neutral-600 transition-all"
                  />
                </div>
              </div>

              {/* Interview Type */}
              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-2">
                  Interview Type
                </label>
                <div className="grid grid-cols-2 gap-2 bg-[#18191d] p-1 rounded-xl border border-neutral-800">
                  <button
                    type="button"
                    onClick={() => settype("technical")}
                    className={`py-2.5 rounded-lg text-xs font-medium capitalize transition-all ${
                      type === "technical"
                        ? "bg-white text-black font-semibold shadow-sm"
                        : "text-neutral-400 hover:text-white"
                    }`}
                  >
                    Technical
                  </button>
                  <button
                    type="button"
                    onClick={() => settype("hr")}
                    className={`py-2.5 rounded-lg text-xs font-medium capitalize transition-all ${
                      type === "hr"
                        ? "bg-white text-black font-semibold shadow-sm"
                        : "text-neutral-400 hover:text-white"
                    }`}
                  >
                    Hr
                  </button>
                </div>
              </div>

              {/* Use Resume Toggle */}
              <div className="flex items-center justify-between pt-2">
                <div>
                  <span className="text-xs font-semibold text-white block">
                    Use Resume
                  </span>
                  <span className="text-[11px] text-neutral-400">
                    AI will personalize questions using your resume.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setuseResume(!useResume)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                    useResume ? "bg-white" : "bg-neutral-800"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full shadow transition duration-200 ease-in-out ${
                      useResume
                        ? "translate-x-5 bg-black"
                        : "translate-x-0 bg-neutral-400"
                    }`}
                  />
                </button>
              </div>

              {/* Conditional Resume Card / Upload Box */}
              <AnimatePresence>
                {useResume && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4 pt-1 overflow-hidden"
                  >
                    {/* Resume Ready Status Badge */}
                    {resume && (
                      <div className="flex items-center justify-between bg-[#13231b] border border-emerald-900/60 p-3.5 rounded-xl">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                            <HiOutlineDocumentText size={18} />
                          </div>
                          <div>
                            <span className="text-xs font-bold text-white block">
                              Resume Ready
                            </span>
                            <span className="text-[10px] text-emerald-400">
                              Resume detected successfully.
                            </span>
                          </div>
                        </div>
                        <HiOutlineCheckCircle className="text-emerald-400 text-lg" />
                      </div>
                    )}

                    {/* Upload Card */}
                    <div className="bg-[#18191d] border border-neutral-800 rounded-xl p-5 flex flex-col items-center justify-center text-center">
                      <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-200 flex items-center justify-center mb-2">
                        <HiOutlineUpload size={18} />
                      </div>
                      <span className="text-xs font-semibold text-white mb-0.5">
                        Upload Resume
                      </span>
                      <span className="text-[10px] text-neutral-400 mb-4 max-w-xs">
                        Resume detected. Upload a new resume anytime to update
                        your interview questions.
                      </span>

                      {/* PDF File Selector Input */}
                      <div className="w-full mb-3">
                        <input
                          type="file"
                          accept=".pdf"
                          id="pdf-upload"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                        <label
                          htmlFor="pdf-upload"
                          className="w-full block bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-xs text-neutral-300 py-2.5 px-3 rounded-lg truncate cursor-pointer transition-colors"
                        >
                          {file ? file.name : "Select PDF Resume"}
                        </label>
                      </div>

                      <motion.button
                        whileHover={{ scale: file ? 1.01 : 1 }}
                        whileTap={{ scale: file ? 0.98 : 1 }}
                        onClick={uploadResume}
                        disabled={!file || uploading}
                        className={`w-full py-2.5 rounded-lg text-xs font-semibold transition-all ${
                          file && !uploading
                            ? "bg-white text-black hover:bg-neutral-200 cursor-pointer"
                            : "bg-neutral-800 text-neutral-500 cursor-not-allowed"
                        }`}
                      >
                        {uploading ? "Uploading..." : "Upload"}
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Start Action Button */}
          <div className="pt-4">
            <motion.button
              whileHover={{ scale: starting ? 1 : 1.01 }}
              whileTap={{ scale: starting ? 1 : 0.98 }}
              onClick={start}
              disabled={starting}
              className="w-full py-3.5 rounded-xl bg-white text-black font-bold text-xs tracking-wide transition-all shadow-lg hover:bg-neutral-200 cursor-pointer disabled:opacity-50"
            >
              {starting ? "Initializing Interview..." : "Start Interview"}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default Step1setup;

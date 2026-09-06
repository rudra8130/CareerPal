import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiMic,
  FiMicOff,
  FiVideo,
  FiVideoOff,
  FiCode,
  FiClock,
  FiMessageSquare,
  FiSend,
  FiUser,
  FiCheckCircle,
} from "react-icons/fi";

import malevideo from "../../assets/male-ai.mp4";
import femalevideo from "../../assets/female-ai.mp4";
import Timer from "./Timer";
import CodeEditor from "./CodeEditor";

// ---------------------------------------------------------------------------
// Static config
// ---------------------------------------------------------------------------
const LANG_OPTIONS = [
  { label: "JavaScript", value: "javascript" },
  { label: "Python", value: "python" },
  { label: "Java", value: "java" },
  { label: "C++", value: "cpp" },
];

const DEFAULT_CODE = {
  javascript: `function solve() {\n  // write your code here\n}\n`,
  python: `def solve():\n    # write your code here\n    pass\n`,
  java: `public class Main {\n    public static void main(String[] args) {\n        // write your code here\n    }\n}\n`,
  cpp: `#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    // write your code here\n    return 0;\n}\n`,
};

function Step2interview({ interviewData, user, onSubmitAnswer }) {
  // -- State --
  const [question, setQuestion] = useState(interviewData.question);
  const [currentIndex, setCurrentIndex] = useState(
    interviewData.currentQuestion || 0,
  );
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);
  const [finished, setFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(interviewData.question.timer || 60);
  const [timerActive, setTimerActive] = useState(true); // paused once the answer is submitted

  const totalQuestions =
    interviewData.totalQuestions ?? interviewData.totalQuestion ?? 1;

  // UI toggles
  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(false);
  const [codeOpen, setCodeOpen] = useState(false);

  // Speech
  const [isAIPlaying, setIsAIPlaying] = useState(false);
  const [subtitle, setSubtitle] = useState("");
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [introSpoken, setIntroSpoken] = useState(false);
  const [voiceGender, setVoiceGender] = useState("female");

  // Refs
  const aiVideoRef = useRef(null);
  const userVideoRef = useRef(null);
  const recognitionRef = useRef(null);
  const streamRef = useRef(null);

  const totalTime = question?.timer || 60;
  const progress = ((currentIndex + 1) / totalQuestions) * 100;
  const isLastQuestion = currentIndex + 1 >= totalQuestions;
  const videoSource = voiceGender === "female" ? femalevideo : malevideo;
  const showMicOn = micOn && !isAIPlaying;

  // ---------------------------------------------------------------------
  // Reset local state ONLY when the parent hands us a genuinely new
  // interview session (different interviewId). We do NOT reset on every
  // `interviewData.currentQuestion` change here — that used to be the only
  // trigger that moved the UI to the next question, and if the parent never
  // re-passes a fresh `interviewData` after submit, the component just sits
  // there forever. Question advancement now happens locally in
  // `advanceToNextQuestion`, right after a successful submit.
  // ---------------------------------------------------------------------
  useEffect(() => {
    setQuestion(interviewData.question);
    setCurrentIndex(interviewData.currentQuestion || 0);
    setTimeLeft(interviewData.question?.timer || 60);
    setTimerActive(true);
    setAnswer("");
    setFeedback(null);
    setFinished(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interviewData.interviewId ?? interviewData._id]);

  // ---------------------------------------------------------------------
  // Speech recognition (mic -> answer textarea)
  // ---------------------------------------------------------------------
  useEffect(() => {
    if (!("webkitSpeechRecognition" in window)) return;
    const rec = new window.webkitSpeechRecognition();
    rec.lang = "en-US";
    rec.continuous = true;
    rec.interimResults = false;
    rec.onresult = (e) => {
      const t = e.results[e.results.length - 1][0].transcript;
      setAnswer((prev) => (prev ? prev + " " + t : t));
    };
    rec.onerror = () => {};
    recognitionRef.current = rec;

    return () => {
      try {
        rec.stop();
      } catch (_) {}
    };
  }, []);

  const startMic = () => {
    try {
      recognitionRef.current?.start();
    } catch (_) {}
  };
  const stopMic = () => {
    try {
      recognitionRef.current?.stop();
    } catch (_) {}
  };

  const toggleMic = () => {
    if (micOn) stopMic();
    else if (!isAIPlaying) startMic();
    setMicOn((p) => !p);
  };

  useEffect(() => {
    if (!micOn) return;
    if (isAIPlaying) stopMic();
    else startMic();
  }, [isAIPlaying, micOn]);

  // ---------------------------------------------------------------------
  // Camera
  // ---------------------------------------------------------------------
  const toggleCamera = async () => {
    if (cameraOn) {
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
      setCameraOn(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        streamRef.current = stream;
        setCameraOn(true);
        setTimeout(() => {
          if (userVideoRef.current) userVideoRef.current.srcObject = stream;
        }, 100);
      } catch (error) {
        setCameraOn(false);
      }
    }
  };

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  // ---------------------------------------------------------------------
  // AI speaks the question
  // --------------------------
  const speakQuestion = (text) => {
    if (!text || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();

    const utter = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    const voice =
      voices.find((v) =>
        voiceGender === "female"
          ? /female|zira|samantha/i.test(v.name)
          : /male|david|daniel/i.test(v.name),
      ) || voices[0];
    if (voice) utter.voice = voice;

    utter.onstart = () => {
      setIsAIPlaying(true);
      setSubtitle(text);
      aiVideoRef.current?.play().catch(() => {});
    };
    utter.onend = () => {
      setIsAIPlaying(false);
      if (micOn) startMic();
      aiVideoRef.current?.pause();
      setTimeout(() => {
        setSubtitle("");
      }, 300);
    };
    setSubtitle(text);

    window.speechSynthesis.speak(utter);
  };

  useEffect(() => {
    if (finished) return;
    speakQuestion(question?.text || question?.question || "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question, finished]);

  // ---------------------------------------------------------------------
  useEffect(() => {
    if (timeLeft <= 0 || !timerActive) {
      if (timeLeft <= 0 && timerActive) handleSubmit(true);
      return;
    }
    const t = setInterval(() => {
      setTimeLeft((p) => p - 1);
    }, 1000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, timerActive]);

  // ---------------------------------------------------------------------
  // Code editor
  // ---------------------------------------------------------------------
  const handleSubmitCode = (code) => {
    setAnswer((prev) => {
      const separator = prev.trim() ? "\n\n--- Code ---\n" : "--- Code ---\n";
      return prev + separator + code;
    });
    setCodeOpen(false);
  };

  const advanceToNextQuestion = (result) => {
    const nextIndex = currentIndex + 1;

    const nextQuestion =
      result?.question ??
      result?.nextQuestion ??
      result?.interview?.questions?.[nextIndex] ??
      result?.questions?.[nextIndex] ??
      interviewData.questions?.[nextIndex] ??
      null;

    const reportedTotal =
      result?.totalQuestions ??
      result?.interview?.questions?.length ??
      result?.questions?.length ??
      totalQuestions;

    if (nextQuestion && nextIndex < reportedTotal) {
      setQuestion(nextQuestion);
      setCurrentIndex(nextIndex);
      setAnswer("");
      setFeedback(null);
      setTimeLeft(nextQuestion.timer || 60);
      setTimerActive(true);
    } else {
      setFinished(true);
      setTimerActive(false);
    }
  };

  // ---------------------------------------------------------------------
  // Answer submission
  // ---------------------------------------------------------------------
  const handleSubmit = async (auto = false) => {
    if (loading || finished) return;
    setTimerActive(false);
    setLoading(true);

    try {
      let result = null;
      if (onSubmitAnswer) {
        result = await onSubmitAnswer({
          question,
          answer,
          index: currentIndex,
          auto,
        });
      }
      setFeedback(result?.feedback ?? null);
      advanceToNextQuestion(result);
    } catch (err) {
      console.error("Failed to submit answer:", err);
      setTimerActive(true); // let them retry instead of getting stuck silently
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSubmit(false);
    }
  };

  useEffect(() => {
    const load = () => {
      const voices = window.speechSynthesis.getVoices();
      if (!voices.length) return;
      const female = voices.find((v) => /zira|samantha|female/i.test(v.name));
      const male = voices.find((v) => /david|mark|male/i.test(v.name));
      if (female) {
        setSelectedVoice(female);
        setVoiceGender("female");
      } else if (male) {
        setSelectedVoice(male);
        setVoiceGender("male");
      } else {
        setSelectedVoice(voices[0]);
        setVoiceGender("female");
      }
    };
    load();
    window.speechSynthesis.onvoiceschanged = load;
  }, []);

  const speakText = (text) => {
    new Promise((resolve) => {
      if (!window.speechSynthesis || !selectedVoice || !text?.trim()) {
        resolve();
        return;
      }

      window.speechSynthesis.cancel();

      setTimeout(() => {
        const utter = new SpeechSynthesisUtterance(
          text.replace(/,/g, ", ... ").replace(/\./g, ". ... "),
        );
        utter.voice = selectedVoice;
        utter.rate = 0.92;
        utter.pitch = 1.05;
        utter.volume = 1;
        utter.onstart = () => {
          setIsAIPlaying(true);
          stopMic();
          aiVideoRef.current?.play();
        };
        utter.onend = () => {
          aiVideoRef.current?.pause();
          setIsAIPlaying(false);
          if (micOn) startMic();
          setTimeout(() => {
            setSubtitle("");
            resolve();
          }, 300);
        };
        setSubtitle(text);
        window.speechSynthesis.speak(utter);
      }, 150);
    });
  };

  useEffect(() => {
    if (!selectedVoice || introSpoken) {
      return;
    }
    const runIntro = async () => {
      setIntroSpoken(true);
      await new Promise((r) => setTimeout(r, 1200));
      await speakText(
        `Welcome ${userName.split(" ")[0]}! Let's begin your interview `,
      );
      await new Promise((r) => setTimeout(r, 900));
      await speakText(interviewData.question.question);
    };
  });

  return (
    <div className="min-h-screen w-full bg-[#0a0a0b] flex items-center justify-center p-4 sm:p-8">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-6xl rounded-3xl border border-white/10 bg-[#111113] shadow-[0_0_60px_rgba(0,0,0,0.4)] p-5 sm:p-7 grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {/* LEFT COLUMN */}
        <div className="flex flex-col gap-4">
          <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-white/10 bg-black">
            <video
              ref={aiVideoRef}
              src={videoSource}
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
            />
            <AnimatePresence>
              {subtitle && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent px-4 py-3"
                >
                  <p className="text-xs sm:text-sm text-white/90 leading-relaxed">
                    {subtitle}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
            {isAIPlaying && (
              <span className="absolute top-3 left-3 flex items-center gap-1.5 bg-black/60 px-2.5 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] text-white/80">Speaking</span>
              </span>
            )}
          </div>

          <div className="flex-1 min-h-[180px] rounded-2xl border border-white/5 bg-[#161618] flex flex-col items-center justify-center gap-3 p-6 relative overflow-hidden">
            {cameraOn ? (
              <video
                ref={userVideoRef}
                autoPlay
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              <>
                <div className="w-20 h-20 rounded-full bg-[#2a2a2d] flex items-center justify-center text-white text-2xl font-semibold border border-white/10">
                  {user?.name ? user.name[0].toUpperCase() : <FiUser />}
                </div>
                <p className="text-white/80 text-sm">{user?.name || "You"}</p>
              </>
            )}
          </div>

          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.94 }}
              onClick={toggleMic}
              disabled={isAIPlaying}
              className={`w-11 h-11 rounded-xl flex items-center justify-center border transition-colors ${
                showMicOn
                  ? "bg-white/10 border-white/15 text-white"
                  : "bg-red-500/10 border-red-500/30 text-red-400"
              } disabled:opacity-40`}
              title={micOn ? "Mute microphone" : "Unmute microphone"}
            >
              {showMicOn ? <FiMic size={18} /> : <FiMicOff size={18} />}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.94 }}
              onClick={toggleCamera}
              className={`w-11 h-11 rounded-xl flex items-center justify-center border transition-colors ${
                cameraOn
                  ? "bg-white/10 border-white/15 text-white"
                  : "bg-[#1c1c1f] border-white/10 text-white/50"
              }`}
              title={cameraOn ? "Turn camera off" : "Turn camera on"}
            >
              {cameraOn ? <FiVideo size={18} /> : <FiVideoOff size={18} />}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.94 }}
              onClick={() => setCodeOpen(true)}
              className="w-11 h-11 rounded-xl flex items-center justify-center border bg-[#1c1c1f] border-white/10 text-white/70 hover:text-white"
              title="Open code editor"
            >
              <FiCode size={18} />
            </motion.button>

            <p className="text-[11px] text-white/35 ml-1">
              Coding question? Use{" "}
              <span className="text-white/60">&lt;/&gt;</span> to write &amp;
              add code
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="flex flex-col gap-4">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-white text-xl font-semibold">AI Interview</h1>
              <p className="flex items-center gap-1.5 text-white/40 text-xs mt-1 capitalize">
                <FiClock size={12} />
                {interviewData.difficulty || question?.difficulty || "easy"}
              </p>
            </div>
            {!finished && <Timer timeLeft={timeLeft} totalTime={totalTime} />}
          </div>

          {finished ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex-1 rounded-2xl border border-white/5 bg-[#161618] flex flex-col items-center justify-center gap-3 p-10 text-center"
            >
              <FiCheckCircle size={36} className="text-emerald-400" />
              <h2 className="text-white text-lg font-semibold">
                Interview complete
              </h2>
              <p className="text-white/40 text-sm max-w-xs">
                You've answered all {totalQuestions} questions. Your results
                will be ready shortly.
              </p>
            </motion.div>
          ) : (
            <>
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="rounded-2xl border border-white/5 bg-[#161618] p-5"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-7 h-7 rounded-lg bg-white flex items-center justify-center">
                    <FiMessageSquare size={14} className="text-black" />
                  </span>
                  <span className="text-white/50 text-xs font-medium">
                    Question {currentIndex + 1}
                  </span>
                </div>
                <p className="text-white text-base sm:text-lg font-medium leading-snug">
                  {question?.text || question?.question}
                </p>
              </motion.div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-white/40 text-xs">Progress</span>
                  <span className="text-white/40 text-xs">
                    {currentIndex + 1}/{totalQuestions}
                  </span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-white"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                  />
                </div>
              </div>

              <div className="flex-1 flex flex-col">
                <span className="text-white/40 text-xs mb-1.5">
                  Your Answer
                </span>
                <textarea
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Write your answer here... or speak if mic is on"
                  className="flex-1 min-h-[160px] w-full rounded-2xl border border-white/5 bg-[#161618] p-4 text-sm text-white placeholder-white/25 outline-none focus:border-white/20 resize-none transition-colors"
                />
              </div>

              <div className="flex items-center justify-between">
                <p className="text-white/30 text-xs">
                  Press{" "}
                  <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white/60 text-[10px]">
                    Ctrl+Enter
                  </kbd>{" "}
                  to submit
                </p>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleSubmit(false)}
                  disabled={loading || !answer.trim()}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-black text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
                >
                  {loading ? (
                    <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  ) : (
                    <FiSend size={14} />
                  )}
                  {isLastQuestion ? "Finish" : "Submit Answer"}
                </motion.button>
              </div>
            </>
          )}
        </div>
      </motion.div>

      <AnimatePresence>
        {codeOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-4xl"
            >
              <CodeEditor
                langOptions={LANG_OPTIONS}
                defaultCode={DEFAULT_CODE}
                onClose={() => setCodeOpen(false)}
                onSubmitCode={handleSubmitCode}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            className="rounded-xl border border-gray-500/20 bg-green-500/5 p-4 max-h-40 overflow-y-auto"
          >
            <p className="text-xs uppercase tracking-widest text-green-400 mb-2">
              AI Feedback
            </p>
            <p className="text-sm text-zinc-300 leading-6">
              {feedback.feedback}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Step2interview;

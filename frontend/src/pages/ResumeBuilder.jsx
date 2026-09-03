import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import initialData from "../components/resume/initialData.js";
import ResumeForm from "../components/resume/ResumeForm.jsx";
import PreviewResume from "../components/resume/PreviewResume.jsx";

// Icons
import { GiArtificialHive } from "react-icons/gi";
import { FiEye, FiArrowLeft, FiArrowRight } from "react-icons/fi";

const STEPS = [
  {
    step: 1,
    title: "Personal Information",
    subtitle: "Your basic contact details",
  },
  {
    step: 2,
    title: "Professional Summary",
    subtitle: "A quick intro about yourself",
  },
  {
    step: 3,
    title: "Skills",
    subtitle: "Your technical skills",
  },
  {
    step: 4,
    title: "Work Experience",
    subtitle: "Your past jobs & internships",
  },
  {
    step: 5,
    title: "Projects",
    subtitle: "Projects you have built",
  },
  {
    step: 6,
    title: "Education",
    subtitle: "Your academic background",
  },
];

function ResumeBuilder({ user, setuser }) {
  const [currentstep, setCurrentStep] = useState(1);
  const [data, setdata] = useState(initialData);
  const [showPreview, setshowPreview] = useState(false);

  const totalSteps = STEPS.length;
  const currentStepData = STEPS[currentstep - 1];
  const progressPercentage = Math.round((currentstep / totalSteps) * 100);
  const isLastStep = currentstep === totalSteps;

  const handleNext = () => {
    if (currentstep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
    } else {
      setshowPreview(true);
    }
  };

  const handlePrev = () => {
    if (currentstep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  if (showPreview) {
    return (
      <PreviewResume
        data={data}
        user={user}
        setuser={setuser}
        onback={() => setshowPreview(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50/50 text-neutral-800 flex flex-col justify-between selection:bg-neutral-900 selection:text-white">
      {/* 1. Sticky Navigation Bar */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="sticky top-0 z-50 h-16 bg-white/80 backdrop-blur-md border-b border-neutral-200/80 px-4 sm:px-8 flex items-center justify-between"
      >
        {/* Brand Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-neutral-900 flex items-center justify-center shadow-xs">
            <GiArtificialHive size={18} className="text-white" />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-base tracking-tight text-neutral-900">
              FresherAI
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-500 font-medium border border-neutral-200/60">
              Resume Builder
            </span>
          </div>
        </div>

        {/* Top Right Preview Eye Button */}
        <button
          onClick={() => setshowPreview(true)}
          className="p-2.5 text-neutral-600 hover:text-neutral-900 bg-neutral-100 hover:bg-neutral-200/70 rounded-xl transition-all duration-200 border border-neutral-200/80 active:scale-95 flex items-center gap-2 text-xs font-semibold"
          title="Preview Resume"
        >
          <FiEye className="w-4 h-4" />
          <span className="hidden sm:inline">Preview</span>
        </button>
      </motion.nav>

      {/* 2. Main Form Container */}
      <main className="max-w-2xl w-full mx-auto px-4 py-8 flex-1 flex flex-col justify-center">
        {/* Progress Header Info */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-xs font-bold tracking-wider text-neutral-400 uppercase mb-2">
            <span>
              STEP {currentstep} OF {totalSteps}
            </span>
            <span>{progressPercentage}% COMPLETE</span>
          </div>

          {/* Animated Progress Bar */}
          <div className="w-full h-1.5 bg-neutral-200/80 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-neutral-900 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
            />
          </div>
        </div>

        {/* Title & Subtitle Section */}
        <div className="mb-8">
          <motion.h1
            key={currentStepData.title}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight"
          >
            {currentStepData.title}
          </motion.h1>
          <motion.p
            key={currentStepData.subtitle}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-neutral-500 font-medium mt-1"
          >
            {currentStepData.subtitle}
          </motion.p>
        </div>

        {/* Dynamic Form Step */}
        <div className="min-h-75">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentstep}
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              transition={{ duration: 0.25 }}
            >
              <ResumeForm step={currentstep} data={data} setdata={setdata} />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* 3. Bottom Controls Bar */}
        <div className="mt-10 pt-6 border-t border-neutral-200/60 flex items-center justify-between">
          {/* Previous Button */}
          <button
            onClick={handlePrev}
            disabled={currentstep === 1}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
              currentstep === 1
                ? "opacity-30 cursor-not-allowed bg-neutral-100 text-neutral-400"
                : "bg-white hover:bg-neutral-100 text-neutral-700 border border-neutral-200 shadow-2xs active:scale-95"
            }`}
          >
            <FiArrowLeft className="w-3.5 h-3.5" /> Previous
          </button>

          {/* Dots Navigation */}
          <div className="flex items-center gap-2">
            {STEPS.map((s) => (
              <button
                key={s.step}
                onClick={() => setCurrentStep(s.step)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentstep === s.step
                    ? "w-6 bg-neutral-900"
                    : "w-2 bg-neutral-300 hover:bg-neutral-400"
                }`}
                title={`Go to ${s.title}`}
              />
            ))}
          </div>

          {/* Next / Preview Button */}
          <button
            onClick={handleNext}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 shadow-md transition-all duration-200 active:scale-95"
          >
            {isLastStep ? (
              <>
                <FiEye className="w-4 h-4" /> Preview Resume
              </>
            ) : (
              <>
                Next <FiArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </main>
    </div>
  );
}

export default ResumeBuilder;

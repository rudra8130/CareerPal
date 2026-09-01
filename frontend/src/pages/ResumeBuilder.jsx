import React from "react";
import { useState } from "react";
import { motion } from "motion/react";
import initialData from "../components/resume/initialData.js";
import ResumeForm from "../components/resume/ResumeForm.jsx";
import { GiArtificialHive } from "react-icons/gi";
import { FaArrowRight } from "react-icons/fa6";

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
  { step: 3, title: "Skills", subtitle: "Your technical skills" },
  {
    step: 4,
    title: "Work Experience",
    subtitle: "Your past jobs & internships",
  },
  { step: 5, title: "Projects", subtitle: "Projects you have built" },
  { step: 6, title: "Education", subtitle: "Your academic background" },
];

function ResumeBuilder({ user, setuser }) {
  const [currentstep, setCurrentStep] = useState(3);
  const [data, setdata] = useState(initialData);

  return (
    <div className="min-h-screen max-w-2xl w-full mx-auto m-5">
      <motion.nav
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50 h-13 flex items-center justify-between px-5 bg-white/70 backdrop-blur-xl border-b border-black/5"
      >
        {/* Left Section: Logo & Brand Name */}
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-amber-950 flex items-center justify-center shadow-2xs">
            <GiArtificialHive size={16} color="white" />
          </div>
          <span className="font-extrabold text-base tracking-tight text-neutral-900">
            CareerPal
          </span>
          <label className="text-black/70 font-light text-shadow-2xs">
            Resume Builder
          </label>
        </div>

        {/* Right Section: Classy Professional Login Button */}
        <div>
          <motion.button
            onClick={() => setshowlogin(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="px-4 py-1.5 text-xs font-semibold tracking-wide text-neutral-800 bg-neutral-100 hover:bg-neutral-900 hover:text-white rounded-full transition-all duration-200 border border-neutral-200/80 shadow-2xs flex items-center gap-2"
          >
            Log In
            <div>
              <FaArrowRight />
            </div>
          </motion.button>
        </div>
      </motion.nav>

      <ResumeForm step={currentstep} data={data} setdata={setdata} />
    </div>
  );
}

export default ResumeBuilder;

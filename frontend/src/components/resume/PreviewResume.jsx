import React, { useEffect, useState, useRef } from "react";
import { FiArrowLeft } from "react-icons/fi";
import ATSTemplate from "./ATSTemplate";
import Downloadbtn from "./Downloadbtn";

function PreviewResume({ data, onback, user, setuser }) {
  const resumeRef = useRef(null);
  const [scale, setscale] = useState(1);

  useEffect(() => {
    const updateScale = () => {
      if (window.innerWidth < 640) {
        setscale(0.42);
      } else if (window.innerWidth < 768) {
        setscale(0.58);
      } else if (window.innerWidth < 1024) {
        setscale(0.72);
      } else {
        setscale(0.9);
      }
    };

    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center">
      {/* Floating Top Header Bar */}
      <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-slate-200 px-4 py-3 flex items-center justify-between shadow-xs">
        <button
          onClick={onback}
          className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
        >
          <FiArrowLeft className="w-4 h-4" /> Back to Editor
        </button>

        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Resume Preview
        </span>

        <Downloadbtn docRef={resumeRef} user={user} setuser={setuser} />
      </header>

      {/* Main Resume Container */}
      <main className="flex-1 w-full flex items-start justify-center py-8 overflow-x-auto">
        <div
          className="transition-transform duration-200 origin-top shadow-xl rounded-sm"
          style={{ transform: `scale(${scale})` }}
        >
          <div ref={resumeRef}>
            <ATSTemplate data={data} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default PreviewResume;

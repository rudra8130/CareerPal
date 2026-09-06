import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaJs, FaJava, FaPython } from "react-icons/fa";
import { SiCplusplus } from "react-icons/si";
import { IoClose } from "react-icons/io5";
import { FiPlay } from "react-icons/fi";

const LANGUAGES = [
  { id: "javascript", label: "JavaScript", icon: FaJs, color: "#F0DB4F" },
  { id: "python", label: "Python", icon: FaPython, color: "#4B8BBE" },
  { id: "java", label: "Java", icon: FaJava, color: "#E76F00" },
  { id: "cpp", label: "C++", icon: SiCplusplus, color: "#659AD2" },
];

const DEFAULT_CODE = {
  javascript:
    "// Write your solution here\nfunction solution() {\n  // your code\n}\n",
  python:
    "# Write your solution here\ndef solution():\n    # your code\n    pass\n",
  java: "// Write your solution here\nclass Solution {\n    void solution() {\n        // your code\n    }\n}\n",
  cpp: "// Write your solution here\nvoid solution() {\n    // your code\n}\n",
};

function CodeEditor({ onClose = () => {}, onSubmitCode = () => {} }) {
  const [lang, setLang] = useState("javascript");
  const [code, setCode] = useState(DEFAULT_CODE["javascript"]);

  const handleLangChange = (id) => {
    setLang(id);
    setCode(DEFAULT_CODE[id]);
  };

  const lineCount = code.split("\n").length;
  const lineNumbers = Array.from(
    { length: Math.max(lineCount, 12) },
    (_, i) => i + 1,
  );

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="w-full max-w-4xl rounded-xl overflow-hidden shadow-2xl border border-neutral-800"
        style={{ background: "#161616" }}
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 12 }}
        transition={{ type: "spring", stiffness: 320, damping: 28 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-800">
          <div className="flex items-center gap-2 text-neutral-300">
            <span className="text-sm font-mono tracking-wide">{">_"}</span>
            <h2 className="text-sm font-semibold text-neutral-100">
              Code Editor
            </h2>
          </div>

          <div className="flex items-center gap-1 bg-neutral-900 rounded-lg p-1">
            {LANGUAGES.map(({ id, label, icon: Icon, color }) => {
              const active = lang === id;
              return (
                <button
                  key={id}
                  onClick={() => handleLangChange(id)}
                  className="relative px-3 py-1.5 text-xs font-medium rounded-md flex items-center gap-1.5"
                  style={{ color: active ? "#161616" : "#a3a3a3" }}
                >
                  {active && (
                    <motion.div
                      layoutId="lang-pill"
                      className="absolute inset-0 rounded-md"
                      style={{ background: "#f5f5f5" }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 30,
                      }}
                    />
                  )}
                  <span className="relative flex items-center gap-1.5">
                    <Icon
                      size={13}
                      style={{ color: active ? color : "#737373" }}
                    />
                    {label}
                  </span>
                </button>
              );
            })}
          </div>

          <button
            onClick={onClose}
            className="text-neutral-500 hover:text-neutral-200 transition-colors p-1 rounded-md hover:bg-neutral-800"
            aria-label="Close editor"
          >
            <IoClose size={20} />
          </button>
        </div>

        {/* Editor body */}
        <div
          className="flex"
          style={{ background: "#1e1e1e", minHeight: "360px" }}
        >
          <div className="select-none text-right py-4 pr-3 pl-4 font-mono text-xs leading-6 text-neutral-600 border-r border-neutral-800">
            {lineNumbers.map((n) => (
              <div key={n}>{n}</div>
            ))}
          </div>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck={false}
            className="flex-1 resize-none bg-transparent outline-none py-4 px-4 font-mono text-sm leading-6 text-neutral-100"
            style={{ minHeight: "360px" }}
          />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-neutral-800 bg-[#161616]">
          <p className="text-xs text-neutral-500">
            Editing in{" "}
            <span className="text-neutral-300">
              {LANGUAGES.find((l) => l.id === lang)?.label}
            </span>
          </p>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onSubmitCode({ language: lang, code })}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium"
            style={{ background: "#f5f5f5", color: "#161616" }}
          >
            <FiPlay size={13} />
            Run &amp; Submit
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default CodeEditor;

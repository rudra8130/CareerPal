import React, { useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { LuChevronDown, LuX, LuClock3, LuListChecks, LuGauge } from "react-icons/lu"
import { FaPlay } from "react-icons/fa"
import { HiOutlineBookOpen } from "react-icons/hi2"

const DIFFICULTY_STYLES = {
    Easy: "text-emerald-400",
    Medium: "text-violet-400",
    Hard: "text-rose-400",
}

const RoadmapResult = ({ roadmap, onClose }) => {
    const [openModule, setOpenModule] = useState(null)

    if (!roadmap) return null

    const {
        title,
        targetPackage,
        level,
        duration,
        modules = [],
    } = roadmap

    const toggleModule = (idx) => {
        setOpenModule((prev) => (prev === idx ? null : idx))
    }

    const handleWatchTutorial = (url) => {
        if (!url) return
        window.open(url, "_blank", "noopener,noreferrer")
    }

    const handleReadArticle = (url) => {
        if (!url) return
        window.open(url, "_blank", "noopener,noreferrer")
    }

    return (
        <div className="w-full max-w-2xl mx-auto">
            {/* Header card */}
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="relative bg-zinc-900 rounded-3xl p-6 sm:p-7"
            >
                {onClose && (
                    <button
                        onClick={onClose}
                        className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                    >
                        <LuX size={16} />
                    </button>
                )}

                <p className="text-xs font-semibold tracking-wide text-zinc-500 mb-2">
                    Your roadmap
                </p>
                <h1 className="text-2xl font-bold text-white mb-1.5">
                    {title || "Your Roadmap"}
                </h1>
                {targetPackage && (
                    <p className="text-sm text-zinc-400 mb-6">
                        Target: <span className="text-violet-400 font-medium">{targetPackage}</span>
                    </p>
                )}

                <div className="grid grid-cols-3 gap-3">
                    <div className="bg-zinc-800/70 rounded-2xl px-4 py-3">
                        <div className="flex items-center gap-1.5 text-zinc-500 text-xs mb-1.5">
                            <LuGauge size={13} />
                            Difficulty
                        </div>
                        <p className="text-white font-semibold text-sm">{level || "—"}</p>
                    </div>
                    <div className="bg-zinc-800/70 rounded-2xl px-4 py-3">
                        <div className="flex items-center gap-1.5 text-zinc-500 text-xs mb-1.5">
                            <LuClock3 size={13} />
                            Duration
                        </div>
                        <p className="text-white font-semibold text-sm">{duration || "—"}</p>
                    </div>
                    <div className="bg-zinc-800/70 rounded-2xl px-4 py-3">
                        <div className="flex items-center gap-1.5 text-zinc-500 text-xs mb-1.5">
                            <LuListChecks size={13} />
                            Modules
                        </div>
                        <p className="text-white font-semibold text-sm">{modules.length} topics</p>
                    </div>
                </div>
            </motion.div>

            {/* Modules list */}
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.15 }}
                className="text-xs font-semibold tracking-wide text-zinc-500 mt-7 mb-3"
            >
                Learning modules
            </motion.p>

            <div className="flex flex-col gap-3">
                {modules.map((module, idx) => {
                    const isOpen = openModule === idx
                    const difficultyClass = DIFFICULTY_STYLES[module.difficulty] || "text-zinc-400"

                    return (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: idx * 0.04 }}
                            className="bg-zinc-900 rounded-2xl overflow-hidden"
                        >
                            <button
                                onClick={() => toggleModule(idx)}
                                className="w-full flex items-center gap-4 px-5 py-4 text-left"
                            >
                                <span className="w-8 h-8 shrink-0 rounded-lg bg-zinc-800 text-emerald-400 font-semibold text-sm flex items-center justify-center">
                                    {idx + 1}
                                </span>

                                <div className="flex-1 min-w-0">
                                    <h3 className="text-white font-semibold text-[15px] truncate">
                                        {module.title}
                                    </h3>
                                    {module.duration && (
                                        <p className="flex items-center gap-1 text-zinc-500 text-xs mt-0.5">
                                            <LuClock3 size={12} />
                                            {module.duration}
                                        </p>
                                    )}
                                </div>

                                <span className={`text-sm font-medium shrink-0 ${difficultyClass}`}>
                                    {module.difficulty}
                                </span>

                                <motion.span
                                    animate={{ rotate: isOpen ? 180 : 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="text-zinc-500 shrink-0"
                                >
                                    <LuChevronDown size={16} />
                                </motion.span>
                            </button>

                            <AnimatePresence initial={false}>
                                {isOpen && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.25, ease: "easeInOut" }}
                                        className="overflow-hidden"
                                    >
                                        <div className="px-5 pb-5">
                                            {module.description && (
                                                <p className="text-zinc-400 text-sm leading-relaxed mb-4">
                                                    {module.description}
                                                </p>
                                            )}

                                            <div className="flex flex-wrap gap-2.5">
                                                <motion.button
                                                    whileHover={{ scale: module.youtube ? 1.03 : 1 }}
                                                    whileTap={{ scale: module.youtube ? 0.97 : 1 }}
                                                    onClick={() => handleWatchTutorial(module.youtube)}
                                                    disabled={!module.youtube}
                                                    className="flex items-center gap-2 text-sm font-medium bg-rose-600/90 hover:bg-rose-600 disabled:opacity-40 disabled:cursor-not-allowed text-white px-3.5 py-2 rounded-xl transition-colors"
                                                >
                                                    <FaPlay size={11} />
                                                    Watch Tutorial
                                                </motion.button>

                                                <motion.button
                                                    whileHover={{ scale: module.article ? 1.03 : 1 }}
                                                    whileTap={{ scale: module.article ? 0.97 : 1 }}
                                                    onClick={() => handleReadArticle(module.article)}
                                                    disabled={!module.article}
                                                    className="flex items-center gap-2 text-sm font-medium bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed text-white px-3.5 py-2 rounded-xl transition-colors"
                                                >
                                                    <HiOutlineBookOpen size={15} />
                                                    Read Article
                                                </motion.button>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    )
                })}
            </div>
        </div>
    )
}

export default RoadmapResult
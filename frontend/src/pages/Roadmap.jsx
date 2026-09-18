import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useNavigate } from 'react-router-dom'
import { GiArtificialHive } from 'react-icons/gi'
import { HiOutlineRocketLaunch } from 'react-icons/hi2'
import { LuHistory, LuChevronDown, LuFileText, LuSend, LuX } from 'react-icons/lu'
import { usecoins } from '../apis/user.api'
import api from '../utils/axios'
import { useSelector } from 'react-redux'
import RoadmapResult from '../components/roadmap/RoadmapResult'

const PACKAGE_OPTIONS = ["10 LPA", "20 LPA", "30 LPA", "40 LPA", "50 LPA", "60 LPA", "70 LPA", "80 LPA", "90 LPA", "100 LPA"]
const ROLE_OPTIONS = ["Frontend Dev", "Backend Eng", "ML Engineer"]

const Roadmap = ({ user, setUser }) => {

    const navigate = useNavigate()
    const [historyOpen, setHistoryOpen] = useState(false)
    const [roadmap, setRoadmap] = useState(null)
    const [role, setRole] = useState("")
    const [targetPackage, setTargetPackage] = useState(PACKAGE_OPTIONS[1]) // default "20 LPA"
    const [packageOpen, setPackageOpen] = useState(false)
    const [useResume, setUseResume] = useState(false)
    const [loading, setLoading] = useState(false)
    const [historyLoading, setHistoryLoading] = useState(false)
    const [history, setHistory] = useState([])
    const [error, setError] = useState("")

    const { resume } = useSelector((state) => state.resume)

    // Fetch previous roadmaps whenever the sidebar is opened
    useEffect(() => {
        if (!historyOpen) return

        const fetchHistory = async () => {
            setHistoryLoading(true)
            try {
                const res = await api.get("/api/roadmap/all")
                setHistory(res.data?.data || [])
            } catch (err) {
                console.log("Failed to load history", err)
            } finally {
                setHistoryLoading(false)
            }
        }

        fetchHistory()
    }, [historyOpen])

    const handleGenerate = async () => {
        if (!role.trim() || loading) return
        setLoading(true)
        setError("")
        try {
            try {
                const coinResponse = await usecoins({
                    coins: 20,
                    action: "roadmap-builder"
                })
                setUser((prev) => ({
                    ...prev, interviewCoin: coinResponse?.interviewCoin,
                }))
            } catch (err) {
                setLoading(false)
                console.log(err)
                alert("Failed to use coins.")
                return
            }

            const response = await api.post("/api/roadmap/generate", {
                role: role.trim(),
                targetPackage,
                useResume,
                resume
            })

            setRoadmap(response.data?.data || null)

        } catch (err) {
            console.log("Failed to generate roadmap", err)
            setError("Something went wrong while generating your roadmap. Please try again")
        } finally {
            setLoading(false)
        }
    }

    // Load a previously generated roadmap from the sidebar
    const handleSelectHistory = (item) => {
        setRoadmap(item || null)
        let extractedRole = item.title ? item.title.replace(/ Roadmap$/i, "") : ""
        setRole(extractedRole || "")
        setTargetPackage(item.targetPackage || PACKAGE_OPTIONS[1])
        setHistoryOpen(false)
    }

    return (
        <div className='min-h-screen bg-white text-black flex flex-col relative overflow-hidden'>
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
                            CareerPal
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-500 font-medium border border-neutral-200/60">
                            Roadmap Builder
                        </span>
                    </div>
                </div>

                <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setHistoryOpen(true)}
                    className="flex items-center gap-1.5 text-sm font-medium px-3.5 py-1.5 rounded-full border border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50 transition-colors"
                >
                    <LuHistory size={15} />
                    History
                </motion.button>
            </motion.nav>

            {/* Main content */}
            <div className="flex-1 flex items-center justify-center px-4 pb-32">
                <AnimatePresence mode="wait">
                    {!roadmap ? (
                        <motion.div
                            key="hero"
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -16 }}
                            transition={{ duration: 0.35, ease: "easeOut" }}
                            className="flex flex-col items-center text-center max-w-lg"
                        >
                            <motion.div
                                initial={{ scale: 0.7, opacity: 0, rotate: -8 }}
                                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                                transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
                                className="mb-6"
                            >
                                <HiOutlineRocketLaunch size={56} className="text-neutral-900" />
                            </motion.div>

                            <motion.h1
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: 0.2 }}
                                className="text-3xl font-bold tracking-tight text-neutral-900 mb-3"
                            >
                                AI Roadmap Generator
                            </motion.h1>

                            <motion.p
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: 0.3 }}
                                className="text-neutral-500 mb-10 leading-relaxed"
                            >
                                Generate a personalised roadmap for your dream job.
                                Choose a role and let AI build a complete learning path.
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: 0.4 }}
                                className="flex flex-wrap items-center justify-center gap-3"
                            >
                                {ROLE_OPTIONS.map((option) => {
                                    const active = role === option
                                    return (
                                        <motion.button
                                            key={option}
                                            whileHover={{ scale: 1.04 }}
                                            whileTap={{ scale: 0.96 }}
                                            onClick={() => setRole(option)}
                                            className={`px-5 py-2.5 rounded-full text-sm font-medium transition-colors ${active
                                                ? "bg-neutral-900 text-white"
                                                : "bg-neutral-900 text-white/90 hover:bg-neutral-800"
                                                } ${active ? "ring-2 ring-offset-2 ring-neutral-900" : ""}`}
                                        >
                                            {option}
                                        </motion.button>
                                    )
                                })}
                            </motion.div>

                            {error && (
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-sm text-red-500 mt-6"
                                >
                                    {error}
                                </motion.p>
                            )}
                        </motion.div>
                    ) : (
                        <RoadmapResult
                            roadmap={roadmap}
                            onClose={() => setRoadmap(null)}
                        />
                    )}
                </AnimatePresence>
            </div>

            {/* Bottom control bar */}
            <motion.div
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.5, ease: "easeOut" }}
                className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[95%] max-w-2xl bg-neutral-900 text-white rounded-full px-3 py-2 flex items-center justify-between gap-2 shadow-xl shadow-neutral-900/10 z-40"
            >
                <span className="pl-3 text-sm font-medium truncate">
                    {role || "Select a role"}
                </span>

                <div className="flex items-center gap-2 relative">
                    {/* Package dropdown */}
                    <div className="relative">
                        <motion.button
                            whileTap={{ scale: 0.96 }}
                            onClick={() => setPackageOpen((prev) => !prev)}
                            className="flex items-center gap-1 text-sm font-medium bg-white/10 hover:bg-white/15 px-3.5 py-1.5 rounded-full transition-colors"
                        >
                            {targetPackage}
                            <LuChevronDown
                                size={14}
                                className={`transition-transform ${packageOpen ? "rotate-180" : ""}`}
                            />
                        </motion.button>

                        <AnimatePresence>
                            {packageOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                                    transition={{ duration: 0.15 }}
                                    className="absolute bottom-full mb-2 right-0 bg-white text-neutral-900 rounded-2xl shadow-xl border border-neutral-200 p-1.5 w-32 max-h-56 overflow-y-auto"
                                >
                                    {PACKAGE_OPTIONS.map((option) => (
                                        <button
                                            key={option}
                                            onClick={() => {
                                                setTargetPackage(option)
                                                setPackageOpen(false)
                                            }}
                                            className={`w-full text-left text-sm px-3 py-1.5 rounded-xl transition-colors ${option === targetPackage
                                                ? "bg-neutral-900 text-white"
                                                : "hover:bg-neutral-100"
                                                }`}
                                        >
                                            {option}
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Resume toggle */}
                    <motion.button
                        whileTap={{ scale: 0.96 }}
                        onClick={() => setUseResume((prev) => !prev)}
                        className={`flex items-center gap-1.5 text-sm font-medium px-3.5 py-1.5 rounded-full transition-colors ${useResume ? "bg-white text-neutral-900" : "bg-white/10 hover:bg-white/15"
                            }`}
                    >
                        <LuFileText size={15} />
                        Resume
                    </motion.button>

                    {/* Generate */}
                    <motion.button
                        whileHover={{ scale: role ? 1.03 : 1 }}
                        whileTap={{ scale: role ? 0.97 : 1 }}
                        onClick={handleGenerate}
                        disabled={!role || loading}
                        className="flex items-center gap-1.5 text-sm font-semibold bg-white text-neutral-900 disabled:opacity-40 disabled:cursor-not-allowed px-4 py-1.5 rounded-full transition-opacity"
                    >
                        {loading ? (
                            <motion.span
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                                className="w-3.5 h-3.5 border-2 border-neutral-300 border-t-neutral-900 rounded-full"
                            />
                        ) : (
                            <LuSend size={14} />
                        )}
                        {loading ? "Generating" : "Generate"}
                    </motion.button>
                </div>
            </motion.div>

            {/* History sidebar */}
            <AnimatePresence>
                {historyOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            onClick={() => setHistoryOpen(false)}
                            className="fixed inset-0 bg-black/30 backdrop-blur-[2px] z-50"
                        />

                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                            className="fixed top-0 right-0 h-full w-full sm:w-[380px] bg-white z-50 shadow-2xl flex flex-col"
                        >
                            <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-100">
                                <h2 className="font-semibold text-neutral-900">Previous Roadmaps</h2>
                                <button
                                    onClick={() => setHistoryOpen(false)}
                                    className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-neutral-100 transition-colors"
                                >
                                    <LuX size={16} />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
                                {historyLoading && (
                                    <p className="text-sm text-neutral-400 text-center mt-6">Loading…</p>
                                )}

                                {!historyLoading && history.length === 0 && (
                                    <p className="text-sm text-neutral-400 text-center mt-6">
                                        No roadmaps yet. Generate one to see it here.
                                    </p>
                                )}

                                {history.map((item, idx) => (
                                    <motion.button
                                        key={item._id || idx}
                                        whileHover={{ scale: 1.015 }}
                                        whileTap={{ scale: 0.985 }}
                                        onClick={() => handleSelectHistory(item)}
                                        className="text-left bg-neutral-900 text-white rounded-2xl p-4 transition-colors hover:bg-neutral-800"
                                    >
                                        <h3 className="font-semibold text-[15px]">
                                            {item.title || "Roadmap"}
                                        </h3>
                                        <div className="flex items-center justify-between mt-2">
                                            <span className="text-sm font-medium text-indigo-400">
                                                {item.targetPackage}
                                            </span>
                                            <span className="text-xs text-neutral-400">
                                                {item.duration || "12 Months"}
                                            </span>
                                        </div>
                                        <p className="text-xs text-neutral-500 mt-1.5">
                                            {item.createdAt
                                                ? new Date(item.createdAt).toLocaleDateString("en-GB")
                                                : ""}
                                        </p>
                                    </motion.button>
                                ))}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    )
}

export default Roadmap
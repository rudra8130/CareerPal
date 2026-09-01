import React from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  HiOutlineDocumentText,
  HiOutlineStar,
  HiOutlineMap,
  HiOutlinePlus,
  HiOutlineChevronDoubleLeft,
  HiOutlineChevronDoubleRight,
  HiOutlineCurrencyRupee,
  HiOutlineLogout,
} from "react-icons/hi";
import { useNavigate } from "react-router";

function Sidebar({
  user,
  onNewInterview,
  onLogout,
  sidebarOpen,
  setSideBarOpen,
  mobileOpen,
  setMobileOpen,
}) {
  const navigate = useNavigate();
  const navItems = [
    {
      label: "Resume Builder",
      icon: HiOutlineDocumentText,
      onClick: () => navigate("/resume"),
    },
    {
      label: "Resume Scorer",
      icon: HiOutlineStar,
      onClick: () => navigate("/scorer"),
    },
    {
      label: "Roadmap Builder",
      icon: HiOutlineMap,
      onClick: () => navigate("/roadmap"),
    },
  ];

  const userName = user?.name || "Rudra";
  const userEmail = user?.email || "rudra25102002@gmail.com";

  const nameParts = userName.trim().split(" ");
  const initials =
    nameParts.length > 1
      ? `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase()
      : nameParts[0][0].toUpperCase();

  // Small reusable wrapper so every label fades/collapses the same way
  const Label = ({ children, className = "" }) => (
    <AnimatePresence initial={false}>
      {sidebarOpen && (
        <motion.span
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: "auto" }}
          exit={{ opacity: 0, width: 0 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className={`overflow-hidden whitespace-nowrap ${className}`}
        >
          {children}
        </motion.span>
      )}
    </AnimatePresence>
  );

  const inner = (
    <div className="flex flex-col h-full justify-between p-3 select-none">
      {/* Top Header: Brand & Collapse Toggle */}
      <div
        className={`flex items-center h-10 border-b border-black/8 pb-3 ${
          sidebarOpen ? "justify-between" : "justify-center"
        }`}
      >
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="w-7 h-7 bg-black rounded-lg flex items-center justify-center text-white shrink-0 shadow-sm font-bold text-xs">
            C
          </div>
          <Label className="font-bold text-base tracking-tight text-neutral-900">
            CareerPal
          </Label>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setSideBarOpen(!sidebarOpen)}
          className={`p-1.5 rounded-lg hover:bg-neutral-100 text-neutral-600 transition-colors shrink-0 ${
            sidebarOpen ? "" : "absolute left-1/2 -translate-x-1/2 mt-14"
          }`}
          title={sidebarOpen ? "Collapse Sidebar" : "Expand Sidebar"}
        >
          <motion.div
            animate={{ rotate: sidebarOpen ? 0 : 180 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <HiOutlineChevronDoubleLeft size={18} />
          </motion.div>
        </motion.button>
      </div>

      {/* Main Navigation Area */}
      <div className="flex-1 py-4 flex flex-col gap-6 overflow-y-auto overflow-x-hidden">
        {/* Create Interview Button with Motion Effects */}
        <motion.button
          layout
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onNewInterview}
          className={`flex items-center bg-black text-white rounded-xl shadow-md hover:bg-neutral-800 transition-colors shrink-0 ${
            sidebarOpen
              ? "px-3.5 py-2.5 gap-3 w-full justify-start"
              : "w-10 h-10 mx-auto justify-center"
          }`}
          title="Create Interview"
        >
          <HiOutlinePlus size={18} className="shrink-0" />
          <Label className="text-xs font-semibold tracking-wide">
            Create Interview
          </Label>
        </motion.button>

        {/* Agents / Nav Items Section */}
        <div className="flex flex-col gap-1.5">
          <Label className="px-3 text-[10px] font-bold tracking-wider text-neutral-400 uppercase">
            Agents
          </Label>
          {navItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.button
                key={idx}
                layout
                whileHover={{
                  x: sidebarOpen ? 4 : 0,
                  scale: sidebarOpen ? 1 : 1.05,
                }}
                whileTap={{ scale: 0.95 }}
                onClick={item.onClick}
                className={`flex items-center rounded-xl text-neutral-600 hover:text-black hover:bg-neutral-100 transition-colors group relative text-sm font-medium ${
                  sidebarOpen
                    ? "px-3 py-2.5 gap-3 w-full justify-start"
                    : "w-10 h-10 mx-auto justify-center"
                }`}
                title={item.label}
              >
                <Icon size={18} className="shrink-0" />
                <Label>{item.label}</Label>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Bottom Footer Area: Coins & User Profile */}
      <div className="flex flex-col gap-3 pt-3 border-t border-black/8 shrink-0">
        {/* Interview Coins Widget */}
        <motion.div
          layout
          whileHover={{ scale: 1.01 }}
          className={`flex items-center bg-neutral-900 text-white rounded-xl shadow-inner transition-colors ${
            sidebarOpen
              ? "p-3 justify-between"
              : "w-10 h-10 mx-auto justify-center rounded-full"
          }`}
        >
          <div
            className="flex items-center gap-2 overflow-hidden"
            onClick={() => navigate("/coins")}
          >
            <HiOutlineCurrencyRupee
              size={18}
              className="text-amber-400 shrink-0"
            />
            <Label className="flex flex-col leading-tight">
              <span className="text-[9px] uppercase tracking-wider text-neutral-400 font-semibold">
                Interview Coins
              </span>
              <span className="text-sm font-bold tracking-tight">
                {user?.interviewCoin || 3590}
              </span>
            </Label>
          </div>
          {sidebarOpen && (
            <motion.button
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-5 h-5 bg-neutral-800 hover:bg-neutral-700 rounded-full flex items-center justify-center text-xs shrink-0 transition-colors"
            >
              +
            </motion.button>
          )}
        </motion.div>

        {/* User Profile Card with Dynamic Initials Avatar */}
        <motion.div
          layout
          className={`flex items-center rounded-xl hover:bg-neutral-100 transition-colors ${
            sidebarOpen ? "p-2 gap-2 justify-between" : "p-1 justify-center"
          }`}
        >
          <div className="flex items-center gap-2.5 overflow-hidden">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="w-8 h-8 rounded-full bg-neutral-900 text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-sm"
              title={userName}
            >
              {initials}
            </motion.div>
            <Label className="flex flex-col leading-tight">
              <span className="text-xs font-semibold text-neutral-900 truncate">
                {userName}
              </span>
              <span className="text-[10px] text-neutral-500 truncate">
                {userEmail}
              </span>
            </Label>
          </div>
          {sidebarOpen && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              whileHover={{ scale: 1.1, color: "#dc2626" }}
              whileTap={{ scale: 0.9 }}
              onClick={onLogout}
              className="p-1.5 text-neutral-400 rounded-lg transition-colors shrink-0"
              title="Logout"
            >
              <HiOutlineLogout size={16} />
            </motion.button>
          )}
        </motion.div>
      </div>
    </div>
  );

  return (
    <motion.aside
      animate={{ width: sidebarOpen ? 260 : 72 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="hidden md:flex top-0 left-0 fixed h-screen bg-white border-r border-black/8 flex-col z-40 overflow-hidden shadow-sm"
    >
      {inner}
    </motion.aside>
  );
}

export default Sidebar;

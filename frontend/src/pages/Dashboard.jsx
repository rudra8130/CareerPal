import React, { useState } from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router";
import api from "../utils/axios";
import Sidebar from "../components/Sidebar";

function Dashboard({ user, setuser }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await api.get("/api/auth/logout");

      if (response.data.success) {
        setuser(null);
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-white min-h-screen text-black font-sans flex">
      <Sidebar
        user={user}
        onNewInterview={() => {
          navigate("/interview");
        }}
        onLogout={handleLogout}
        sidebarOpen={sidebarOpen}
        setSideBarOpen={setSidebarOpen}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Main content shifts in sync with sidebar width */}
      <motion.main
        animate={{ marginLeft: sidebarOpen ? 260 : 72 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className={`flex-1 min-h-screen px-3 sm:px-4 md:px-6 py-4 md:py-6 transition-all duration-300 ${sidebarOpen ? "md:ml-65" : "md:ml-18"}`}
      >
        {/* page content goes here */}
      </motion.main>
    </div>
  );
}

export default Dashboard;

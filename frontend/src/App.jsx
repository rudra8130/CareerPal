import React from "react";
import { Navigate, Route, Routes } from "react-router";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import { useState } from "react";
import { useEffect } from "react";
import { getCurrentUser } from "./apis/user.api";
import Scorer from "./pages/Scorer";
import { getResume } from "./apis/resume.api";
import { useDispatch } from "react-redux";
import { setResume } from "./redux/resumeSlice";
import ResumeBuilder from "./pages/ResumeBuilder";
import InterviewStart from "./pages/InterviewStart";
import InterviewPage from "./pages/InterviewPage";
import InterviewReport from "./pages/InterviewReport";

function App() {
  const [user, setuser] = useState(null);
  const [loading, setloading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const getuser = async () => {
      const data = await getCurrentUser();
      setuser(data?.user);
      setloading(false);
    };
    getuser();
  }, []);

  useEffect(() => {
    try {
      const getresumedata = async () => {
        const result = await getResume();
        dispatch(setResume(result.data));
      };
      getresumedata();
    } catch (error) {
      console.log(error);
    }
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen w-full bg-white">
        <div
          className="animate-spin inline-block size-6 border-3 border-current border-t-transparent rounded-[999px] text-muted-foreground"
          role="status"
          aria-label="loading"
        >
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            user ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Home setuser={setuser} />
            )
          }
        />
        <Route
          path="/dashboard"
          element={
            user ? (
              <Dashboard user={user} setuser={setuser} />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/scorer"
          element={
            user ? (
              <Scorer user={user} setuser={setuser} />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/resume"
          element={
            user ? (
              <ResumeBuilder user={user} setuser={setuser} />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/interview"
          element={
            user ? (
              <InterviewStart user={user} setuser={setuser} />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/interview/:id"
          element={
            user ? (
              <InterviewPage user={user} setuser={setuser} />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/interview/:id/report"
          element={
            user ? (
              <InterviewReport user={user} setUser={setuser} />
            ) : (
              <Navigate to="/" />
            )
          }
        />
      </Routes>
    </>
  );
}

export default App;

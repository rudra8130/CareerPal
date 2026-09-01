import React from "react";
import { motion, scale } from "motion/react";
import { GiArtificialHive } from "react-icons/gi";
import { FaArrowRight } from "react-icons/fa6";
import LoginModel from "../components/LoginModel";
import dashboard from "../assets/image.png";
import { HiDocumentText } from "react-icons/hi2";
import { BsMicFill } from "react-icons/bs";
import { IoStatsChart } from "react-icons/io5";
import logo from "../assets/logo.png";
import { FaMapSigns } from "react-icons/fa";
import { useState } from "react";

function Home({ setuser }) {
  const agentCards = [
    {
      id: 1,
      icon: <HiDocumentText size={22} className="text-white" />,
      title: "Resume Builder Agent",
      description:
        "Crafts professional, ATS-friendly resumes tailored to specific job descriptions.",
    },
    {
      id: 2,
      icon: <BsMicFill size={20} className="text-white" />,
      title: "Mock Interviewer",
      description:
        "Conducts realistic voice-based technical and behavioral practice sessions.",
    },
    {
      id: 3,
      icon: <IoStatsChart size={20} className="text-white" />,
      title: "Feedback Analyzer",
      description:
        "Evaluates your answers with deep analytics, scoring, and improvement tips.",
    },
    {
      id: 4,
      icon: <FaMapSigns size={20} className="text-white" />,
      title: "Roadmap Planner",
      description:
        "Generates a personalized step-by-step learning path to bridge your skill gaps.",
    },
  ];
  const [showLogin, setshowlogin] = useState(false);
  return (
    <>
      <div className="bg-white text-black font-sans min-h-screen overflow-x-hidden">
        {/*Navbar*/}

        <motion.nav
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="fixed top-0 left-0 right-0 z-50 h-[52px] flex items-center justify-between px-5 bg-white/70 backdrop-blur-xl border-b border-black/5"
        >
          {/* Left Section: Logo & Brand Name */}
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-amber-950 flex items-center justify-center shadow-2xs">
              <GiArtificialHive size={16} color="white" />
            </div>
            <span className="font-extrabold text-base tracking-tight text-neutral-900">
              CareerPal
            </span>
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

        {/*main area*/}

        <section className="relative pt-20 pb-14 overflow-hidden bg-white">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 rounded-full bg-black/[0.09] blur-[90px] pointer-events-none " />
          <div className="max-w-4xl mx-auto px-6 text-center flex flex-col items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 border border-neutral-200 text-xs font-medium text-neutral-600 mb-6 shadow-2xs"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-900 animate-pulse"></span>
              Multi-Agent Interview Platform
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-neutral-900 leading-[1.1] mb-6"
            >
              Job Interviews <br />
              <span className="text-neutral-400">Don't Have to Suck</span>{" "}
              <br />
              Anymore!
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-base md:text-lg text-neutral-500 max-w-xl mb-8 font-normal"
            >
              CareerPal is an innovative AI-powered interview preparation
              platform designed to help job seekers excel in their interviews.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <motion.button
                onClick={() => setshowlogin(true)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="px-6 py-3 rounded-xl bg-neutral-900 text-white font-medium text-sm shadow-lg hover:bg-neutral-800 transition-all flex items-center gap-2.5 group"
              >
                Get Started For Free
                <FaArrowRight
                  className="group-hover:translate-x-1 transition-transform"
                  size={12}
                />
              </motion.button>
            </motion.div>
          </div>
        </section>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl mx-auto px-6 mt-16"
        >
          <div className="rounded-2xl border border-neutral-200 bg-white shadow-2xl overflow-hidden p-2 md:p-3">
            <img src={dashboard} />
          </div>
        </motion.div>
        <section className="py-24 bg-white relative overflow-hidden border-t border-neutral-100">
          <div className="max-w-6xl mx-auto px-6 text-center">
            {/* Section Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 border border-neutral-200 text-xs font-medium text-neutral-600 mb-4 shadow-2xs"
            >
              AI Powered Agents
            </motion.div>

            {/* Section Heading */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-3xl md:text-5xl font-black tracking-tight text-neutral-900 mb-4"
            >
              Specialized Agents For <br />
              <span className="text-neutral-400">Every Interview Stage</span>
            </motion.h2>

            {/* Section Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-sm md:text-base text-neutral-500 max-w-2xl mx-auto mb-16 font-normal"
            >
              CareerPal combines multiple AI agents that work together to help
              you build your resume, practice interviews, receive detailed
              feedback, and follow a personalized roadmap to land your dream
              job.
            </motion.p>

            {/* Dark Cards Grid using Map and Motion */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
              {agentCards.map((card, index) => (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  whileHover={{ y: -6 }}
                  className="bg-neutral-900 text-white p-6 rounded-2xl shadow-xl flex flex-col justify-between border border-neutral-800 min-h-[220px]"
                >
                  <div className="w-10 h-10 rounded-xl bg-neutral-800 flex items-center justify-center border border-neutral-700/50 mb-6 shadow-inner">
                    {card.icon}
                  </div>
                  <div>
                    <h3 className="text-base font-bold tracking-tight mb-2 text-white">
                      {card.title}
                    </h3>
                    <p className="text-xs text-neutral-400 leading-relaxed font-normal">
                      {card.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {showLogin && (
          <LoginModel onclose={() => setshowlogin(false)} setuser={setuser} />
        )}

        <footer className="bg-neutral-primary-soft">
          <div className="mx-auto w-full max-w-screen-xl p-4 py-6 lg:py-8">
            <div className="md:flex md:justify-between">
              <div className="mb-6 md:mb-0">
                <a href="/" className="flex gap-2 items-center">
                  <div className="w-7 h-7 rounded-lg bg-amber-950 flex items-center justify-center shadow-2xs">
                    <GiArtificialHive size={16} color="white" />
                  </div>
                  <span className="text-heading self-center text-2xl font-semibold whitespace-nowrap">
                    CareerPal
                  </span>
                </a>
              </div>
              <div className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3">
                <div>
                  <h2 className="mb-6 text-sm font-semibold text-heading uppercase">
                    Follow us
                  </h2>
                  <ul className="text-body font-medium">
                    <li className="mb-4">
                      <a
                        href="https://github.com/themesberg/flowbite"
                        className="hover:underline "
                      >
                        Github
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://discord.gg/4eeurUVvTy"
                        className="hover:underline"
                      >
                        Discord
                      </a>
                    </li>
                  </ul>
                </div>
                <div>
                  <h2 className="mb-6 text-sm font-semibold text-heading uppercase">
                    Legal
                  </h2>
                  <ul className="text-body font-medium">
                    <li className="mb-4">
                      <a href="#" className="hover:underline">
                        Privacy Policy
                      </a>
                    </li>
                    <li>
                      <a href="#" className="hover:underline">
                        Terms &amp; Conditions
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <hr className="my-6 border-default sm:mx-auto lg:my-8" />
            <div className="sm:flex sm:items-center sm:justify-between">
              <span className="text-sm text-body sm:text-center">
                © 2026{" "}
                <a href="https://flowbite.com/" className="hover:underline">
                  CareerPal
                </a>
                . All Rights Reserved.
              </span>
              <div className="flex mt-4 sm:justify-center sm:mt-0">
                <a href="#" className="text-body hover:text-heading">
                  <svg
                    className="w-5 h-5"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fillRule="evenodd"
                      d="M13.135 6H15V3h-1.865a4.147 4.147 0 0 0-4.142 4.142V9H7v3h2v9.938h3V12h2.021l.592-3H12V6.591A.6.6 0 0 1 12.592 6h.543Z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="sr-only">Facebook page</span>
                </a>
                <a href="#" className="text-body hover:text-heading ms-5">
                  <svg
                    className="w-5 h-5"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M18.942 5.556a16.3 16.3 0 0 0-4.126-1.3 12.04 12.04 0 0 0-.529 1.1 15.175 15.175 0 0 0-4.573 0 11.586 11.586 0 0 0-.535-1.1 16.274 16.274 0 0 0-4.129 1.3 17.392 17.392 0 0 0-2.868 11.662 15.785 15.785 0 0 0 4.963 2.521c.41-.564.773-1.16 1.084-1.785a10.638 10.638 0 0 1-1.706-.83c.143-.106.283-.217.418-.331a11.664 11.664 0 0 0 10.118 0c.137.114.277.225.418.331-.544.328-1.116.606-1.71.832a12.58 12.58 0 0 0 1.084 1.785 16.46 16.46 0 0 0 5.064-2.595 17.286 17.286 0 0 0-2.973-11.59ZM8.678 14.813a1.94 1.94 0 0 1-1.8-2.045 1.93 1.93 0 0 1 1.8-2.047 1.918 1.918 0 0 1 1.8 2.047 1.929 1.929 0 0 1-1.8 2.045Zm6.644 0a1.94 1.94 0 0 1-1.8-2.045 1.93 1.93 0 0 1 1.8-2.047 1.919 1.919 0 0 1 1.8 2.047 1.93 1.93 0 0 1-1.8 2.045Z" />
                  </svg>
                  <span class="sr-only">Discord community</span>
                </a>
                <a href="#" class="text-body hover:text-heading ms-5">
                  <svg
                    className="w-5 h-5"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M13.795 10.533 20.68 2h-3.073l-5.255 6.517L7.69 2H1l7.806 10.91L1.47 22h3.074l5.705-7.07L15.31 22H22l-8.205-11.467Zm-2.38 2.95L9.97 11.464 4.36 3.627h2.31l4.528 6.317 1.443 2.02 6.018 8.409h-2.31l-4.934-6.89Z" />
                  </svg>
                  <span className="sr-only">Twitter page</span>
                </a>
                <a href="#" className="text-body hover:text-heading ms-5">
                  <svg
                    className="w-5 h-5"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.006 2a9.847 9.847 0 0 0-6.484 2.44 10.32 10.32 0 0 0-3.393 6.17 10.48 10.48 0 0 0 1.317 6.955 10.045 10.045 0 0 0 5.4 4.418c.504.095.683-.223.683-.494 0-.245-.01-1.052-.014-1.908-2.78.62-3.366-1.21-3.366-1.21a2.711 2.711 0 0 0-1.11-1.5c-.907-.637.07-.621.07-.621.317.044.62.163.885.346.266.183.487.426.647.71.135.253.318.476.538.655a2.079 2.079 0 0 0 2.37.196c.045-.52.27-1.006.635-1.37-2.219-.259-4.554-1.138-4.554-5.07a4.022 4.022 0 0 1 1.031-2.75 3.77 3.77 0 0 1 .096-2.713s.839-.275 2.749 1.05a9.26 9.26 0 0 1 5.004 0c1.906-1.325 2.74-1.05 2.74-1.05.37.858.406 1.828.101 2.713a4.017 4.017 0 0 1 1.029 2.75c0 3.939-2.339 4.805-4.564 5.058a2.471 2.471 0 0 1 .679 1.897c0 1.372-.012 2.477-.012 2.814 0 .272.18.592.687.492a10.05 10.05 0 0 0 5.388-4.421 10.473 10.473 0 0 0 1.313-6.948 10.32 10.32 0 0 0-3.39-6.165A9.847 9.847 0 0 0 12.007 2Z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="sr-only">GitHub account</span>
                </a>
                <a href="#" className="text-body hover:text-heading ms-5">
                  <svg
                    className="w-5 h-5"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 2a10 10 0 1 0 10 10A10.009 10.009 0 0 0 12 2Zm6.613 4.614a8.523 8.523 0 0 1 1.93 5.32 20.093 20.093 0 0 0-5.949-.274c-.059-.149-.122-.292-.184-.441a23.879 23.879 0 0 0-.566-1.239 11.41 11.41 0 0 0 4.769-3.366ZM10 3.707a8.82 8.82 0 0 1 2-.238 8.5 8.5 0 0 1 5.664 2.152 9.608 9.608 0 0 1-4.476 3.087A45.755 45.755 0 0 0 10 3.707Zm-6.358 6.555a8.57 8.57 0 0 1 4.73-5.981 53.99 53.99 0 0 1 3.168 4.941 32.078 32.078 0 0 1-7.9 1.04h.002Zm2.01 7.46a8.51 8.51 0 0 1-2.2-5.707v-.262a31.641 31.641 0 0 0 8.777-1.219c.243.477.477.964.692 1.449-.114.032-.227.067-.336.1a13.569 13.569 0 0 0-6.942 5.636l.009.003ZM12 20.556a8.508 8.508 0 0 1-5.243-1.8 11.717 11.717 0 0 1 6.7-5.332.509.509 0 0 1 .055-.02 35.65 35.65 0 0 1 1.819 6.476 8.476 8.476 0 0 1-3.331.676Zm4.772-1.462A37.232 37.232 0 0 0 15.113 13a12.513 12.513 0 0 1 5.321.364 8.56 8.56 0 0 1-3.66 5.73h-.002Z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="sr-only">Dribbble account</span>
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

export default Home;

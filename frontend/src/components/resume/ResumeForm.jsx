import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiTrash2,
  FiPlus,
  FiFolder,
  FiBookOpen,
  FiBriefcase,
} from "react-icons/fi";

// Reusable Input Component
function Input({ label, value, onChange, placeholder, type = "text" }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        value={value || ""}
        className="bg-white border border-slate-200 text-slate-800 text-sm rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full px-3.5 py-2.5 shadow-xs transition-all duration-200 outline-none placeholder:text-slate-400"
      />
    </div>
  );
}

// Reusable Textarea Component
function Textarea({ label, value, onChange, placeholder, rows = 3 }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
        {label}
      </label>
      <textarea
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        value={value || ""}
        rows={rows}
        className="bg-white border border-slate-200 text-slate-800 text-sm rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 block resize-none w-full px-3.5 py-2.5 shadow-xs transition-all duration-200 outline-none placeholder:text-slate-400"
      />
    </div>
  );
}

// Styled Card Container with Delete Action
function Entrycard({ children, onRemove, title }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="relative bg-slate-50/50 border border-slate-200/80 rounded-xl p-4 sm:p-5 shadow-xs transition-all duration-200 hover:border-slate-300"
    >
      <div className="flex items-center justify-between mb-4 border-b border-slate-200/60 pb-2.5">
        <span className="text-xs font-semibold text-indigo-600 tracking-wide uppercase">
          {title}
        </span>
        <button
          type="button"
          onClick={onRemove}
          className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-150"
          title="Remove entry"
        >
          <FiTrash2 className="w-4 h-4" />
        </button>
      </div>
      <div className="flex flex-col gap-3.5">{children}</div>
    </motion.div>
  );
}

// Main Form Component
function ResumeForm({ step, data, setdata }) {
  // --- Step 1: Personal Details ---
  if (step === 1) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex flex-col gap-3.5"
      >
        <Input
          label="Full Name"
          placeholder="Rudra Bhardwaj"
          onChange={(v) => setdata({ ...data, name: v })}
          value={data.name}
        />
        <Input
          label="Email"
          placeholder="rudra@example.com"
          onChange={(v) => setdata({ ...data, email: v })}
          value={data.email}
        />
        <Input
          label="Phone"
          placeholder="+91 7931827107"
          onChange={(v) => setdata({ ...data, phone: v })}
          value={data.phone}
        />
        <Input
          label="Location"
          placeholder="Noida, UP"
          onChange={(v) => setdata({ ...data, location: v })}
          value={data.location}
        />
        <Input
          label="Linkedin URL"
          placeholder="linkedin.com/in/user"
          onChange={(v) => setdata({ ...data, linkedin: v })}
          value={data.linkedin}
        />
        <Input
          label="Github URL"
          placeholder="github.com/user"
          onChange={(v) => setdata({ ...data, github: v })}
          value={data.github}
        />
      </motion.div>
    );
  }

  // --- Step 2: Summary ---
  if (step === 2) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex flex-col gap-3.5"
      >
        <Textarea
          label="Professional Summary"
          placeholder="Backend developer with 2+ years of experience building scalable Node.js and MongoDB applications..."
          rows={6}
          onChange={(v) => setdata({ ...data, summary: v })}
          value={data.summary}
        />
      </motion.div>
    );
  }

  // --- Step 3: Skills ---
  if (step === 3) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex flex-col gap-2"
      >
        <Textarea
          label="Skills (comma separated)"
          placeholder="JavaScript, TypeScript, React, Node.js, Express, MongoDB"
          rows={5}
          onChange={(v) => setdata({ ...data, skills: v })}
          value={data.skills}
        />
        <p className="text-[11px] text-slate-400 font-medium">
          Leave empty to skip this section.
        </p>
      </motion.div>
    );
  }

  // --- Step 4: Experience ---
  if (step === 4) {
    const experiences = data.experience || [];

    const addExp = () => {
      setdata({
        ...data,
        experience: [
          ...experiences,
          { company: "", role: "", duration: "", description: "" },
        ],
      });
    };

    const removeExp = (index) => {
      setdata({
        ...data,
        experience: experiences.filter((_, i) => i !== index),
      });
    };

    const updateExp = (index, field, value) => {
      const updated = experiences.map((exp, i) =>
        i === index ? { ...exp, [field]: value } : exp,
      );
      setdata({ ...data, experience: updated });
    };

    return (
      <div className="flex flex-col gap-4">
        {experiences.length === 0 ? (
          <div className="text-center py-8 px-4 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
            <FiBriefcase className="w-8 h-8 mx-auto text-slate-300 mb-2" />
            <p className="text-xs text-slate-500 font-medium">
              No experience added yet. Click below to add your work history.
            </p>
          </div>
        ) : (
          <AnimatePresence>
            {experiences.map((exp, index) => (
              <Entrycard
                key={index}
                title={`Experience #${index + 1}`}
                onRemove={() => removeExp(index)}
              >
                <Input
                  label="Company Name"
                  placeholder="Google"
                  value={exp.company}
                  onChange={(v) => updateExp(index, "company", v)}
                />
                <Input
                  label="Role"
                  placeholder="Frontend Developer"
                  value={exp.role}
                  onChange={(v) => updateExp(index, "role", v)}
                />
                <Input
                  label="Duration"
                  placeholder="Jan 2022 - Present"
                  value={exp.duration}
                  onChange={(v) => updateExp(index, "duration", v)}
                />
                <Textarea
                  label="Description"
                  placeholder="Built scalable UI components..."
                  rows={3}
                  value={exp.description}
                  onChange={(v) => updateExp(index, "description", v)}
                />
              </Entrycard>
            ))}
          </AnimatePresence>
        )}

        <button
          type="button"
          onClick={addExp}
          className="flex items-center justify-center gap-2 w-full py-3 px-4 text-xs font-semibold text-slate-700 bg-slate-100/80 hover:bg-slate-200/80 active:scale-[0.99] rounded-xl border border-slate-200/80 transition-all duration-150"
        >
          <FiPlus className="w-4 h-4" /> Add Experience
        </button>
      </div>
    );
  }

  // --- Step 5: Projects ---
  if (step === 5) {
    const projects = data.projects || [];

    const addProject = () => {
      setdata({
        ...data,
        projects: [
          ...projects,
          { name: "", techStack: "", githubLink: "", description: "" },
        ],
      });
    };

    const removeProject = (index) => {
      setdata({
        ...data,
        projects: projects.filter((_, i) => i !== index),
      });
    };

    const updateProject = (index, field, value) => {
      const updated = projects.map((proj, i) =>
        i === index ? { ...proj, [field]: value } : proj,
      );
      setdata({ ...data, projects: updated });
    };

    return (
      <div className="flex flex-col gap-4">
        {projects.length === 0 ? (
          <div className="text-center py-8 px-4 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
            <FiFolder className="w-8 h-8 mx-auto text-slate-300 mb-2" />
            <p className="text-xs text-slate-500 font-medium">
              No projects added yet. Click below to showcase your work.
            </p>
          </div>
        ) : (
          <AnimatePresence>
            {projects.map((proj, index) => (
              <Entrycard
                key={index}
                title={`Project #${index + 1}`}
                onRemove={() => removeProject(index)}
              >
                <Input
                  label="Project Name"
                  placeholder="Portfolio Website"
                  value={proj.name}
                  onChange={(v) => updateProject(index, "name", v)}
                />
                <Input
                  label="Tech Stack"
                  placeholder="React, Tailwind CSS, Node.js"
                  value={proj.techStack}
                  onChange={(v) => updateProject(index, "techStack", v)}
                />
                <Input
                  label="GitHub / Demo Link"
                  placeholder="github.com/user/project"
                  value={proj.githubLink}
                  onChange={(v) => updateProject(index, "githubLink", v)}
                />
                <Textarea
                  label="Description"
                  placeholder="Briefly describe what you built and key achievements..."
                  rows={3}
                  value={proj.description}
                  onChange={(v) => updateProject(index, "description", v)}
                />
              </Entrycard>
            ))}
          </AnimatePresence>
        )}

        <button
          type="button"
          onClick={addProject}
          className="flex items-center justify-center gap-2 w-full py-3 px-4 text-xs font-semibold text-slate-700 bg-slate-100/80 hover:bg-slate-200/80 active:scale-[0.99] rounded-xl border border-slate-200/80 transition-all duration-150"
        >
          <FiPlus className="w-4 h-4" /> Add Project
        </button>
      </div>
    );
  }

  // --- Step 6: Education ---
  if (step === 6) {
    const education = data.education || [];

    const addEdu = () => {
      setdata({
        ...data,
        education: [
          ...education,
          { degree: "", institution: "", year: "", grade: "" },
        ],
      });
    };

    const removeEdu = (index) => {
      setdata({
        ...data,
        education: education.filter((_, i) => i !== index),
      });
    };

    const updateEdu = (index, field, value) => {
      const updated = education.map((edu, i) =>
        i === index ? { ...edu, [field]: value } : edu,
      );
      setdata({ ...data, education: updated });
    };

    return (
      <div className="flex flex-col gap-4">
        {education.length === 0 ? (
          <div className="text-center py-8 px-4 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
            <FiBookOpen className="w-8 h-8 mx-auto text-slate-300 mb-2" />
            <p className="text-xs text-slate-500 font-medium">
              No education details added yet. Click below to add.
            </p>
          </div>
        ) : (
          <AnimatePresence>
            {education.map((edu, index) => (
              <Entrycard
                key={index}
                title={`Education #${index + 1}`}
                onRemove={() => removeEdu(index)}
              >
                <Input
                  label="Degree / Course"
                  placeholder="B.Tech in Computer Science"
                  value={edu.degree}
                  onChange={(v) => updateEdu(index, "degree", v)}
                />
                <Input
                  label="Institution / University"
                  placeholder="Delhi Technological University"
                  value={edu.institution}
                  onChange={(v) => updateEdu(index, "institution", v)}
                />
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="Year / Duration"
                    placeholder="2020 - 2024"
                    value={edu.year}
                    onChange={(v) => updateEdu(index, "year", v)}
                  />
                  <Input
                    label="CGPA / Percentage"
                    placeholder="8.5 CGPA"
                    value={edu.grade}
                    onChange={(v) => updateEdu(index, "grade", v)}
                  />
                </div>
              </Entrycard>
            ))}
          </AnimatePresence>
        )}

        <button
          type="button"
          onClick={addEdu}
          className="flex items-center justify-center gap-2 w-full py-3 px-4 text-xs font-semibold text-slate-700 bg-slate-100/80 hover:bg-slate-200/80 active:scale-[0.99] rounded-xl border border-slate-200/80 transition-all duration-150"
        >
          <FiPlus className="w-4 h-4" /> Add Education
        </button>
      </div>
    );
  }

  return null;
}

export default ResumeForm;

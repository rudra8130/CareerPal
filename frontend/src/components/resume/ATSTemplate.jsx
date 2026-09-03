import React from "react";

function ATSTemplate({ data }) {
  const {
    name = "",
    email = "",
    phone = "",
    location = "",
    linkedin = "",
    github = "",
    summary = "",
    skills = "",
    experience = [],
    projects = [],
    education = [],
  } = data || {};

  // Formats skills string or array into a clean comma-separated list
  const formattedSkills = Array.isArray(skills) ? skills.join(", ") : skills;

  return (
    <div className="box-border w-[210mm] min-h-[297mm] bg-white p-[18mm] text-slate-900 font-sans leading-normal mx-auto shadow-sm print:shadow-none">
      {/* Header / Personal Info */}
      <header className="border-b border-slate-300 pb-4 mb-4 text-center">
        <h1 className="text-2xl font-bold uppercase tracking-wide text-slate-900 mb-1">
          {name || "Your Name"}
        </h1>
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs text-slate-600">
          {email && <span>{email}</span>}
          {phone && <span>• {phone}</span>}
          {location && <span>• {location}</span>}
          {linkedin && <span>• {linkedin}</span>}
          {github && <span>• {github}</span>}
        </div>
      </header>

      {/* Professional Summary */}
      {summary && (
        <section className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-1 mb-2">
            Professional Summary
          </h2>
          <p className="text-xs text-slate-700 leading-relaxed">{summary}</p>
        </section>
      )}

      {/* Skills */}
      {formattedSkills && (
        <section className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-1 mb-2">
            Skills
          </h2>
          <p className="text-xs text-slate-700">{formattedSkills}</p>
        </section>
      )}

      {/* Work Experience */}
      {experience.length > 0 && (
        <section className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-1 mb-2">
            Work Experience
          </h2>
          <div className="flex flex-col gap-3">
            {experience.map((exp, index) => (
              <div key={index} className="flex flex-col">
                <div className="flex justify-between items-baseline text-xs font-semibold text-slate-800">
                  <span>
                    {exp.role} {exp.company && `— ${exp.company}`}
                  </span>
                  <span className="text-slate-500 font-normal">
                    {exp.duration}
                  </span>
                </div>
                {exp.description && (
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {exp.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <section className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-1 mb-2">
            Projects
          </h2>
          <div className="flex flex-col gap-3">
            {projects.map((proj, index) => (
              <div key={index} className="flex flex-col">
                <div className="flex justify-between items-baseline text-xs font-semibold text-slate-800">
                  <span>
                    {proj.name}
                    {proj.techStack && (
                      <span className="font-normal text-slate-500">
                        {" "}
                        ({proj.techStack})
                      </span>
                    )}
                  </span>
                  {proj.githubLink && (
                    <span className="text-slate-500 font-normal">
                      {proj.githubLink}
                    </span>
                  )}
                </div>
                {proj.description && (
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {proj.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {education.length > 0 && (
        <section className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-1 mb-2">
            Education
          </h2>
          <div className="flex flex-col gap-2">
            {education.map((edu, index) => (
              <div
                key={index}
                className="flex justify-between items-baseline text-xs"
              >
                <div>
                  <span className="font-semibold text-slate-800">
                    {edu.degree}
                  </span>
                  {edu.institution && (
                    <span className="text-slate-600">, {edu.institution}</span>
                  )}
                  {edu.grade && (
                    <span className="text-slate-500"> ({edu.grade})</span>
                  )}
                </div>
                <span className="text-slate-500">{edu.year}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default ATSTemplate;

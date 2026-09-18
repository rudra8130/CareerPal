import llm from "../configs/llm.js";
import { SystemMessage, HumanMessage } from "@langchain/core/messages";
import roadmapPrompt from "../configs/roadmap.prompt.js";

export const roadmapAgent = async (state) => {
    try {
        const resume = state.useResume ? {
            skills: state.resume.skills,
            missingSkills: state.resume.missingSkills,
            projects: state.resume.projects,
            experience: state.resume.experience,
            score: state.resume.score,
            suggestedRole: state.resume.suggestedRole,
            recommendations: state.resume.recommendations
        } : null;

        const response = await llm.invoke([
            new SystemMessage(roadmapPrompt),
            new HumanMessage(`
                Target Role: ${state.role}
                Target Package: ${state.targetPackage}
                
                Resume:${JSON.stringify(resume, null, 2)}`)
        ]);

        const roadmap = JSON.parse(
            response.content.replace(/```json/g, "").replace(/```/g, "").trim()
        );

        const capitalize = (value) =>
            value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();

        roadmap.level = capitalize(roadmap.level);

        roadmap.modules = (roadmap.modules || []).map((module) => ({
            ...module,
            difficulty: capitalize(module.difficulty)
        }));

        return {
            ...state,
            roadmap
        };

    } catch (error) {
        console.log("Roadmap Agent error");
        console.log(error);
        throw error;
    }
};
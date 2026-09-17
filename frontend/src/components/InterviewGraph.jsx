import { motion } from "motion/react";
import {
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    ResponsiveContainer,
} from "recharts";

const SKILLS = [
    "Correctness",
    "Clarity",
    "Relevance",
    "Detail",
    "Efficiency",
    "Communication",
    "Problem solving",
    "Creativity",
];

// Turns a raw { correctness: 4, clarity: 3, ... } object (or undefined)
// into the array recharts expects, always in a fixed clockwise order.
function toRadarData(raw = {}) {
    return SKILLS.map((skill) => ({
        skill,
        value: raw?.[skill.toLowerCase().replace(" ", "")] ?? raw?.[skill] ?? 0,
    }));
}

function RadarCard({ title, data, color = "#ffffff", index = 0 }) {
    const chartData = toRadarData(data);
    const hasScore = chartData.some((d) => d.value > 0);

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -3 }}
            className="bg-black rounded-2xl p-6 flex flex-col items-center"
        >
            <div className="w-full h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={chartData} outerRadius="70%">
                        <PolarGrid stroke="#333333" />
                        <PolarAngleAxis
                            dataKey="skill"
                            tick={{ fill: "#9ca3af", fontSize: 11 }}
                        />
                        <Radar
                            dataKey="value"
                            stroke={color}
                            strokeWidth={2}
                            fill={color}
                            fillOpacity={hasScore ? 0.15 : 0}
                            isAnimationActive
                            animationDuration={900}
                            animationEasing="ease-out"
                        />
                    </RadarChart>
                </ResponsiveContainer>
            </div>

            <span className="mt-2 text-sm font-semibold text-white">{title}</span>
        </motion.div>
    );
}

function InterviewGraph({
    technicalData,
    hrData,
    technicalCount = 0,
    hrCount = 0,
}) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <RadarCard
                title={`Technical Interviews (${technicalCount})`}
                data={technicalData}
                color="#ffffff"
                index={0}
            />
            <RadarCard
                title={`HR Interviews (${hrCount})`}
                data={hrData}
                color="#ffffff"
                index={1}
            />
        </div>
    );
}

export default InterviewGraph;
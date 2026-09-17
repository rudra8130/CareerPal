import React from "react";
import { motion } from "motion/react";

function Statbox({ label, value, sub, subHighlight, index = 0 }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -3 }}
            className="bg-black rounded-2xl p-5 flex flex-col gap-3 min-w-0"
        >
            <span className="text-[11px] tracking-wide text-neutral-400 uppercase">
                {label}
            </span>

            <span className="text-3xl font-semibold text-white leading-none">
                {value}
            </span>

            <div className="flex items-center gap-2 flex-wrap">
                {subHighlight && (
                    <span className="text-[11px] font-medium bg-neutral-800 text-neutral-200 px-2 py-0.5 rounded-md">
                        {subHighlight}
                    </span>
                )}
                {sub && <span className="text-[11px] text-neutral-500">{sub}</span>}
            </div>
        </motion.div>
    );
}

export default Statbox;
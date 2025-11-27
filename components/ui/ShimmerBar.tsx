"use client"

import { motion } from "framer-motion"

export function ShimmerBar({ className = "" }: { className?: string }) {
    return (
        <div className={`relative h-1.5 bg-slate-800 rounded-full overflow-hidden ${className}`}>
            <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-violet-500 to-transparent"
                animate={{ x: ["-100%", "100%"] }}
                transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            />
        </div>
    )
}

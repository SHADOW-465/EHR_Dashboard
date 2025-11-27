"use client"

import { motion } from "framer-motion"
import { GlassCard } from "./GlassCard"
import { AnimatedNumber } from "./AnimatedNumber"

interface RiskGaugeProps {
    value: number
    label: string
    description: string
    color?: "violet" | "red" | "emerald" | "amber"
}

export function RiskGauge({ value, label, description, color = "violet" }: RiskGaugeProps) {
    const colorMap = {
        violet: { gradient: "from-violet-500 to-purple-600", dot: "bg-violet-500" },
        red: { gradient: "from-red-500 to-rose-600", dot: "bg-red-500" },
        emerald: { gradient: "from-emerald-500 to-green-600", dot: "bg-emerald-500" },
        amber: { gradient: "from-amber-500 to-yellow-600", dot: "bg-amber-500" },
    }

    const colors = colorMap[color] || colorMap.violet

    return (
        <GlassCard className="p-4" hoverEffect borderBeam beamColor={color}>
            <div className="flex items-start justify-between mb-2">
                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">{label}</span>
                <motion.div
                    className={`w-2 h-2 rounded-full ${colors.dot}`}
                    animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                />
            </div>
            <div className={`text-4xl font-bold bg-gradient-to-r ${colors.gradient} bg-clip-text text-transparent`}>
                <AnimatedNumber value={value} suffix="%" />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">{description}</p>
        </GlassCard>
    )
}

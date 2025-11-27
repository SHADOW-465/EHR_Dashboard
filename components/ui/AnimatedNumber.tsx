"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"

interface AnimatedNumberProps {
    value: number
    suffix?: string
    duration?: number
}

export function AnimatedNumber({ value, suffix = "", duration = 1.5 }: AnimatedNumberProps) {
    const [displayValue, setDisplayValue] = useState(0)

    useEffect(() => {
        let startTime: number
        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp
            const progress = Math.min((timestamp - startTime) / (duration * 1000), 1)
            const eased = 1 - Math.pow(1 - progress, 3)
            setDisplayValue(Math.floor(eased * value))
            if (progress < 1) {
                requestAnimationFrame(animate)
            }
        }
        requestAnimationFrame(animate)
    }, [value, duration])

    return (
        <motion.span
            key={value}
            initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.4 }}
            className="tabular-nums"
        >
            {displayValue}
            {suffix}
        </motion.span>
    )
}

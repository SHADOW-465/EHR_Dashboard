"use client"

import { motion } from "framer-motion"

export function StreamingText({ text, delay = 0 }: { text: string; delay?: number }) {
    const words = text.split(" ")
    return (
        <span>
            {words.map((word, i) => (
                <motion.span
                    key={i}
                    initial={{ opacity: 0, filter: "blur(4px)" }}
                    animate={{ opacity: 1, filter: "blur(0px)" }}
                    transition={{ delay: delay + i * 0.05, duration: 0.3 }}
                    className="inline-block mr-1"
                >
                    {word}
                </motion.span>
            ))}
        </span>
    )
}

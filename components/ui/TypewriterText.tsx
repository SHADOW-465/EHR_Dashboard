"use client"

import { useState, useEffect } from "react"

export const useTypewriter = (text: string | null, speed = 30) => {
    const [displayedText, setDisplayedText] = useState("")

    useEffect(() => {
        setDisplayedText("")
        if (!text) return

        let i = 0
        const timer = setInterval(() => {
            if (i < text.length) {
                setDisplayedText((prev) => prev + text.charAt(i))
                i++
            } else {
                clearInterval(timer)
            }
        }, speed)
        return () => clearInterval(timer)
    }, [text, speed])

    return displayedText
}

export function TypewriterText({ text }: { text: string | null }) {
    const displayed = useTypewriter(text, 15)
    return <span>{displayed}</span>
}

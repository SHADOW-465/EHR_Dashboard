"use client"

import { useState, useEffect } from "react"

const useCountUp = (end: number, duration = 2000) => {
    const [count, setCount] = useState(0)
    useEffect(() => {
        let startTime: number
        const animate = (time: number) => {
            if (!startTime) startTime = time
            const progress = time - startTime
            const percentage = Math.min(progress / duration, 1)
            const ease = 1 - Math.pow(1 - percentage, 4)
            setCount(Math.floor(ease * end))
            if (progress < duration) requestAnimationFrame(animate)
        }
        requestAnimationFrame(animate)
    }, [end, duration])
    return count
}

export function AnimatedCount({ end, duration = 2000 }: { end: number; duration?: number }) {
    const count = useCountUp(end, duration)
    return <>{count}</>
}

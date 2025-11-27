"use client"

import { useState, useEffect } from "react"

interface BezierConnectionProps {
    startRef: React.RefObject<HTMLElement>
    endId: string | null
    containerRef: React.RefObject<HTMLElement>
}

export function BezierConnection({ startRef, endId, containerRef }: BezierConnectionProps) {
    const [path, setPath] = useState("")

    useEffect(() => {
        if (!startRef.current || !endId || !containerRef.current) {
            setPath("")
            return
        }

        const updatePath = () => {
            const endEl = document.getElementById(endId)
            if (!endEl) return

            const containerRect = containerRef.current!.getBoundingClientRect()
            const startRect = startRef.current!.getBoundingClientRect()
            const endRect = endEl.getBoundingClientRect()

            const startX = startRect.right - containerRect.left
            const startY = startRect.top - containerRect.top + startRect.height / 2
            const endX = endRect.left - containerRect.left
            const endY = endRect.top - containerRect.top + endRect.height / 2

            const cp1X = startX + (endX - startX) / 2
            const cp1Y = startY
            const cp2X = startX + (endX - startX) / 2
            const cp2Y = endY

            setPath(`M ${startX} ${startY} C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${endX} ${endY}`)
        }

        updatePath()
        window.addEventListener("resize", updatePath)

        const rightScroll = document.getElementById("report-container")
        const leftScroll = document.getElementById("left-panel-container")

        if (rightScroll) rightScroll.addEventListener("scroll", updatePath)
        if (leftScroll) leftScroll.addEventListener("scroll", updatePath)

        return () => {
            window.removeEventListener("resize", updatePath)
            if (rightScroll) rightScroll.removeEventListener("scroll", updatePath)
            if (leftScroll) leftScroll.removeEventListener("scroll", updatePath)
        }
    }, [startRef, endId, containerRef])

    if (!path) return null

    return (
        <svg className="absolute inset-0 pointer-events-none z-50 w-full h-full overflow-visible">
            <defs>
                <linearGradient id="beamGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#a855f7" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.8" />
                </linearGradient>
                <filter id="glow">
                    <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                    <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>
            <path
                d={path}
                fill="none"
                stroke="url(#beamGradient)"
                strokeWidth="3"
                strokeLinecap="round"
                filter="url(#glow)"
                className="animate-draw"
            />
            <circle
                cx={path.split(" ")[path.split(" ").length - 2]}
                cy={path.split(" ")[path.split(" ").length - 1]}
                r="4"
                fill="#3b82f6"
                className="animate-pulse"
            />
        </svg>
    )
}

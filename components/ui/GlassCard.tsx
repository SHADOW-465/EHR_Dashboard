"use client"

import type React from "react"

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode
    hoverEffect?: boolean
    borderBeam?: boolean
    dark?: boolean
}

export function GlassCard({
    children,
    className = "",
    hoverEffect = false,
    borderBeam = false,
    onClick,
    dark = false,
    ...props
}: GlassCardProps) {
    return (
        <div
            onClick={onClick}
            className={`
      group relative rounded-3xl overflow-hidden
      ${dark ? "glass-panel-dark" : "glass-panel"}
      ${hoverEffect ? "tilt-card cursor-pointer" : ""}
      ${className}
    `}
            {...props}
        >
            <div
                className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay"
                style={{
                    backgroundImage:
                        'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")',
                }}
            ></div>

            {borderBeam && (
                <div className="simple-beam-container opacity-100 transition-opacity duration-500">
                    <div className="simple-beam"></div>
                </div>
            )}

            <div className="relative z-10 h-full flex flex-col">{children}</div>
        </div>
    )
}

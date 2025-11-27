"use client"

export function HolographicBody({ activeRegion }: { activeRegion?: string }) {
    return (
        <div className="relative w-full h-64 flex items-center justify-center pointer-events-none select-none perspective-1000">
            <svg
                viewBox="0 0 100 200"
                className="h-full w-auto drop-shadow-[0_0_25px_rgba(59,130,246,0.6)] transform rotate-y-12"
            >
                <defs>
                    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="2" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                </defs>
                <path
                    d="M50 10 C 60 10 70 15 70 25 C 70 30 65 35 65 40 C 80 45 85 55 85 80 C 85 110 75 140 70 190 L 30 190 C 25 140 15 110 15 80 C 15 55 20 45 35 40 C 35 35 30 30 30 25 C 30 15 40 10 50 10"
                    fill="none"
                    stroke="rgba(59, 130, 246, 0.4)"
                    strokeWidth="0.5"
                />
                <path
                    id="heart"
                    d="M52 55 Q 60 50 62 58 Q 62 65 52 70 Q 42 65 42 58 Q 44 50 52 55"
                    fill={activeRegion === "heart" ? "#f43f5e" : "rgba(59,130,246,0.1)"}
                    stroke={activeRegion === "heart" ? "#fb7185" : "rgba(59,130,246,0.4)"}
                    strokeWidth="0.5"
                    className={`transition-all duration-500 ${activeRegion === "heart" ? "animate-pulse" : ""}`}
                    filter="url(#glow)"
                />
            </svg>
            <div className="absolute bottom-0 w-32 h-32 border border-purple-500/20 rounded-full transform rotateX(70deg) translate-y-12 animate-spin-slow"></div>
        </div>
    )
}

"use client"

export function LogoShield() {
    return (
        <div className="relative w-10 h-10 flex items-center justify-center filter drop-shadow-[0_0_8px_rgba(139,92,246,0.5)]">
            <svg viewBox="0 0 100 100" className="w-full h-full">
                <defs>
                    <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#a855f7" />
                        <stop offset="100%" stopColor="#3b82f6" />
                    </linearGradient>
                </defs>
                <path
                    d="M50 5 L90 20 C90 55 80 80 50 95 C20 80 10 55 10 20 L50 5Z"
                    fill="none"
                    stroke="url(#shieldGrad)"
                    strokeWidth="4"
                />
                <path
                    d="M30 50 L45 65 L70 35"
                    fill="none"
                    stroke="#fff"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <circle cx="50" cy="50" r="35" stroke="url(#shieldGrad)" strokeWidth="1" strokeDasharray="4 4" opacity="0.5">
                    <animateTransform
                        attributeName="transform"
                        type="rotate"
                        from="0 50 50"
                        to="360 50 50"
                        dur="10s"
                        repeatCount="indefinite"
                    />
                </circle>
            </svg>
        </div>
    )
}

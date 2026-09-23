"use client"

import React from "react"

interface HolographicBodyProps {
  activeRegion?: "abdomen" | "heart" | "lungs" | "brain" | "limbs" | "general" | string
}

export function HolographicBody({ activeRegion = "general" }: HolographicBodyProps) {
  const isHeart = activeRegion === "heart"
  const isAbdomen = activeRegion === "abdomen"
  const isLungs = activeRegion === "lungs"
  const isBrain = activeRegion === "brain"
  const isLimbs = activeRegion === "limbs"

  return (
    <div className="relative w-full h-72 flex items-center justify-center select-none perspective-1000 overflow-visible">
      {/* Dynamic Scan Bar */}
      <div className="absolute inset-x-8 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-40 blur-xs animate-bounce" style={{ animationDuration: "4s" }} />

      <svg
        viewBox="0 0 140 220"
        className="h-full w-auto drop-shadow-[0_0_25px_rgba(59,130,246,0.5)] transform transition-transform duration-700 hover:scale-105"
      >
        <defs>
          <filter id="neon-glow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <radialGradient id="organ-pulse" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#be123c" stopOpacity="0.2" />
          </radialGradient>
        </defs>

        {/* Holographic Grid Lines */}
        <g stroke="rgba(59, 130, 246, 0.15)" strokeWidth="0.5" strokeDasharray="2 2">
          <line x1="10" y1="40" x2="130" y2="40" />
          <line x1="10" y1="80" x2="130" y2="80" />
          <line x1="10" y1="120" x2="130" y2="120" />
          <line x1="10" y1="160" x2="130" y2="160" />
          <line x1="70" y1="10" x2="70" y2="210" />
        </g>

        {/* Human Body Wireframe Contour */}
        {/* Head */}
        <path
          d="M 58 20 C 58 12 82 12 82 20 C 82 28 78 34 78 38 L 62 38 C 62 34 58 28 58 20 Z"
          fill="none"
          stroke={isBrain ? "#c084fc" : "rgba(59, 130, 246, 0.4)"}
          strokeWidth={isBrain ? "1.5" : "0.75"}
          filter={isBrain ? "url(#neon-glow)" : undefined}
          className={isBrain ? "animate-pulse" : ""}
        />

        {/* Torso & Arms & Legs */}
        <path
          d="
            M 62 38 L 44 48 L 30 90 L 36 94 L 46 62 L 48 115 
            L 52 160 L 50 205 L 64 205 L 68 150 L 70 125 
            L 72 150 L 76 205 L 90 205 L 88 160 L 92 115 
            L 94 62 L 104 94 L 110 90 L 96 48 L 78 38 Z
          "
          fill="rgba(15, 23, 42, 0.6)"
          stroke="rgba(59, 130, 246, 0.35)"
          strokeWidth="0.75"
        />

        {/* ORGAN: BRAIN / CRANIAL */}
        <circle
          cx="70"
          cy="22"
          r="7"
          fill={isBrain ? "#a855f7" : "rgba(168, 85, 247, 0.05)"}
          stroke={isBrain ? "#d8b4fe" : "rgba(168, 85, 247, 0.3)"}
          strokeWidth={isBrain ? "1.5" : "0.5"}
          className={isBrain ? "animate-pulse" : ""}
          filter={isBrain ? "url(#neon-glow)" : undefined}
        />

        {/* ORGAN: LUNGS (Bilateral) */}
        <g
          filter={isLungs ? "url(#neon-glow)" : undefined}
          className={isLungs ? "animate-pulse" : ""}
        >
          {/* Left Lung */}
          <path
            d="M 60 52 C 54 52 50 62 52 74 C 54 82 62 82 63 76 L 63 56 Z"
            fill={isLungs ? "#06b6d4" : "rgba(6, 182, 212, 0.08)"}
            stroke={isLungs ? "#67e8f9" : "rgba(6, 182, 212, 0.3)"}
            strokeWidth={isLungs ? "1.5" : "0.5"}
          />
          {/* Right Lung */}
          <path
            d="M 80 52 C 86 52 90 62 88 74 C 86 82 78 82 77 76 L 77 56 Z"
            fill={isLungs ? "#06b6d4" : "rgba(6, 182, 212, 0.08)"}
            stroke={isLungs ? "#67e8f9" : "rgba(6, 182, 212, 0.3)"}
            strokeWidth={isLungs ? "1.5" : "0.5"}
          />
        </g>

        {/* ORGAN: HEART */}
        <path
          d="M 72 62 Q 77 57 80 62 Q 81 68 73 75 Q 67 68 68 62 Q 70 58 72 62"
          fill={isHeart ? "url(#organ-pulse)" : "rgba(244, 63, 94, 0.1)"}
          stroke={isHeart ? "#fb7185" : "rgba(244, 63, 94, 0.4)"}
          strokeWidth={isHeart ? "2" : "0.5"}
          filter={isHeart ? "url(#neon-glow)" : undefined}
          className={isHeart ? "animate-pulse" : ""}
        />

        {/* ORGAN: ABDOMEN / APPENDIX (RLQ Focus) */}
        <g
          filter={isAbdomen ? "url(#neon-glow)" : undefined}
          className={isAbdomen ? "animate-pulse" : ""}
        >
          {/* General Peritoneal outline */}
          <ellipse
            cx="70"
            cy="95"
            rx="16"
            ry="12"
            fill={isAbdomen ? "rgba(234, 88, 12, 0.15)" : "rgba(234, 88, 12, 0.04)"}
            stroke={isAbdomen ? "#fb923c" : "rgba(234, 88, 12, 0.3)"}
            strokeWidth="0.5"
            strokeDasharray="2 1"
          />
          {/* McBurney's Point / Appendix Accent in Right Lower Quadrant */}
          <circle
            cx="63"
            cy="100"
            r={isAbdomen ? "5" : "2"}
            fill={isAbdomen ? "#f43f5e" : "rgba(244, 63, 94, 0.3)"}
            stroke={isAbdomen ? "#fda4af" : "none"}
            strokeWidth="1"
          />
          {isAbdomen && (
            <circle
              cx="63"
              cy="100"
              r="9"
              fill="none"
              stroke="#f43f5e"
              strokeWidth="0.75"
              className="animate-ping"
              style={{ animationDuration: "2s" }}
            />
          )}
        </g>

        {/* ORGAN: LIMBS Focus */}
        {isLimbs && (
          <g filter="url(#neon-glow)" className="animate-pulse">
            <line x1="57" y1="165" x2="57" y2="195" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" />
            <line x1="83" y1="165" x2="83" y2="195" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" />
          </g>
        )}
      </svg>

      {/* Rotating Holographic Projection Ring at Base */}
      <div className="absolute bottom-1 w-36 h-12 border border-purple-500/25 rounded-full transform rotateX(70deg) animate-spin-slow pointer-events-none" />
      <div className="absolute bottom-1 w-24 h-8 border border-cyan-400/30 rounded-full transform rotateX(70deg) pointer-events-none" />
    </div>
  )
}

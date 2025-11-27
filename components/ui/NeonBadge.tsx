"use client"

export function NeonBadge({ type, children }: { type: string; children: React.ReactNode }) {
    const colors: Record<string, string> = {
        Critical: "bg-rose-500/20 text-rose-200 border-rose-500/40 shadow-[0_0_15px_rgba(244,63,94,0.4)]",
        High: "bg-rose-500/20 text-rose-200 border-rose-500/40 shadow-[0_0_15px_rgba(244,63,94,0.4)]",
        Medium: "bg-orange-500/20 text-orange-200 border-orange-500/40 shadow-[0_0_15px_rgba(249,115,22,0.4)]",
        Low: "bg-emerald-500/20 text-emerald-200 border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.4)]",
        Plan: "bg-blue-500/20 text-blue-200 border-blue-500/40 shadow-[0_0_15px_rgba(59,130,246,0.4)]",
        Diagnosis: "bg-purple-500/20 text-purple-200 border-purple-500/40 shadow-[0_0_15px_rgba(168,85,247,0.4)]",
        default: "bg-slate-700/30 text-slate-300 border-slate-600/30",
    }
    const style = colors[type] || colors.default
    return (
        <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest border ${style}`}>
            {children}
        </span>
    )
}

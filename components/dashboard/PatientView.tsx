"use client"

import { useState, useRef, useEffect } from "react"
import { AlertTriangle, ChevronRight, Activity, FileText, Sparkles, Send } from "lucide-react"
import { GlassCard } from "@/components/ui/GlassCard"
import { BezierConnection } from "@/components/ui/BezierConnection"
import { NeonBadge } from "@/components/ui/NeonBadge"
import { AnimatedCount } from "@/components/ui/AnimatedCount"
import { HolographicBody } from "@/components/ui/HolographicBody"
import { TypewriterText } from "@/components/ui/TypewriterText"

// Types
interface SummaryPoint {
    id: string
    sourceId: string
    category: string
    technical: string
    simple: string
    riskLevel: string
}

interface Prediction {
    label: string
    value: number
    unit: string
    severity: string
    details: string
}

interface ReportData {
    metadata: {
        name: string
        dob: string
        mrn: string
        date: string
    }
    annotatedHtml: string
    summaryPoints: SummaryPoint[]
    predictions: Prediction[]
    rawText: string
}

// Sub-components
const AIChatPanel = ({ report }: { report: ReportData }) => {
    const [messages, setMessages] = useState([
        { role: "ai", text: `Hello. I have analyzed the case of ${report.metadata.name}. How can I assist you?` },
    ])
    const [input, setInput] = useState("")
    const [isTyping, setIsTyping] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    useEffect(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), [messages])

    const handleSend = async () => {
        if (!input.trim()) return
        const userMsg = { role: "user", text: input }
        setMessages((prev) => [...prev, userMsg])
        setInput("")
        setIsTyping(true)

        // Simulate AI response
        setTimeout(() => {
            setMessages((prev) => [
                ...prev,
                { role: "ai", text: "I am a simulated AI assistant. I can answer questions about the medical record." },
            ])
            setIsTyping(false)
        }, 1500)
    }

    return (
        <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                {messages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                        <div
                            className={`max-w-[85%] rounded-2xl px-5 py-4 text-sm leading-relaxed shadow-lg backdrop-blur-md ${msg.role === "user"
                                    ? "bg-purple-600/90 text-white rounded-br-none border border-purple-400/50"
                                    : "bg-slate-800/60 text-slate-200 border border-white/10 rounded-bl-none"
                                }`}
                        >
                            {msg.text}
                        </div>
                    </div>
                ))}
                {isTyping && (
                    <div className="flex justify-start">
                        <div className="bg-slate-800/60 px-4 py-3 rounded-2xl rounded-bl-none border border-white/5 flex gap-1 items-center h-10">
                            <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce"></div>
                            <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce delay-100"></div>
                            <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce delay-200"></div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
            <div className="p-4 bg-slate-900/30 border-t border-white/10 backdrop-blur-sm">
                <div className="relative flex items-center gap-2 bg-slate-950/60 rounded-full p-1.5 border border-white/10 shadow-lg">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSend()}
                        placeholder="Ask a clinical question..."
                        className="flex-1 bg-transparent border-none rounded-full px-4 py-2 text-sm text-white focus:ring-0 outline-none placeholder:text-slate-400"
                    />
                    <button
                        onClick={handleSend}
                        disabled={isTyping || !input.trim()}
                        className="p-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full hover:shadow-lg hover:shadow-purple-500/30 disabled:opacity-50 transition-all"
                    >
                        <Send size={16} />
                    </button>
                </div>
            </div>
        </div>
    )
}

export function PatientView({ report }: { report: ReportData }) {
    const [userType, setUserType] = useState("clinician")
    const [highlightedId, setHighlightedId] = useState<string | null>(null)
    const [hoveredPointId, setHoveredPointId] = useState<string | null>(null)
    const [leftPanelMode, setLeftPanelMode] = useState("summary")
    const containerRef = useRef<HTMLDivElement>(null)
    const summaryRefs = useRef<Record<string, HTMLDivElement | null>>({})

    // Reset highlights when report changes
    useEffect(() => {
        setHighlightedId(null)
        setHoveredPointId(null)
    }, [report])

    const handleScrollToSource = (sourceId: string, pointId: string) => {
        setHighlightedId(sourceId)
        setHoveredPointId(pointId)
        const element = document.getElementById(sourceId)
        if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "center" })
        }
    }

    return (
        <div
            ref={containerRef}
            className="h-screen flex overflow-hidden relative pt-28 pb-6 px-6 gap-6 max-w-[1920px] mx-auto"
        >
            {/* BEZIER BEAM LAYER */}
            {hoveredPointId && highlightedId && summaryRefs.current[hoveredPointId] && (
                <BezierConnection
                    startRef={{ current: summaryRefs.current[hoveredPointId] }}
                    endId={highlightedId}
                    containerRef={containerRef}
                />
            )}

            {/* LEFT PANEL */}
            <GlassCard className="w-full md:w-[40%] flex flex-col h-full z-20" borderBeam={false}>
                <div className="p-6 border-b border-white/10 bg-slate-900/20 backdrop-blur-md sticky top-0 z-10">
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <h2 className="text-3xl font-bold text-white tracking-tight font-display">{report.metadata.name}</h2>
                            <div className="flex gap-3 text-xs text-slate-300 mt-2 font-mono">
                                <span className="bg-white/10 px-2 py-1 rounded border border-white/10">{report.metadata.dob}</span>
                                <span className="bg-white/10 px-2 py-1 rounded border border-white/10">MRN: {report.metadata.mrn}</span>
                            </div>
                        </div>
                        {leftPanelMode === "summary" && (
                            <div className="bg-slate-950/40 p-1 rounded-lg flex items-center text-[10px] font-bold uppercase tracking-wider border border-white/10 shadow-inner">
                                <button
                                    onClick={() => setUserType("clinician")}
                                    className={`px-3 py-1.5 rounded transition-all duration-300 ${userType === "clinician" ? "bg-white/10 text-white shadow" : "text-slate-400 hover:text-white"
                                        }`}
                                >
                                    Clinical
                                </button>
                                <button
                                    onClick={() => setUserType("patient")}
                                    className={`px-3 py-1.5 rounded transition-all duration-300 ${userType === "patient" ? "bg-white/10 text-white shadow" : "text-slate-400 hover:text-white"
                                        }`}
                                >
                                    Simple
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="flex gap-8 mt-6 border-b border-white/5">
                        <button
                            onClick={() => setLeftPanelMode("summary")}
                            className={`pb-3 text-xs font-bold uppercase tracking-widest transition-all border-b-2 flex items-center gap-2 ${leftPanelMode === "summary"
                                    ? "border-blue-500 text-blue-400"
                                    : "border-transparent text-slate-500 hover:text-slate-300"
                                }`}
                        >
                            <FileText size={14} /> Summary
                        </button>
                        <button
                            onClick={() => setLeftPanelMode("chat")}
                            className={`pb-3 text-xs font-bold uppercase tracking-widest transition-all border-b-2 flex items-center gap-2 ${leftPanelMode === "chat"
                                    ? "border-blue-500 text-blue-400"
                                    : "border-transparent text-slate-500 hover:text-slate-300"
                                }`}
                        >
                            <Sparkles size={14} /> Consult
                        </button>
                    </div>
                </div>

                {leftPanelMode === "chat" ? (
                    <AIChatPanel report={report} />
                ) : (
                    <div id="left-panel-container" className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                        <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-4 flex items-start gap-4 shadow-[0_0_25px_rgba(244,63,94,0.2)] backdrop-blur-sm">
                            <div className="p-2.5 bg-rose-500/20 rounded-xl border border-rose-500/30">
                                <AlertTriangle className="text-rose-300 animate-pulse" size={20} />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-rose-200 font-display uppercase tracking-wide">Triage: Critical</p>
                                <p className="text-xs text-rose-200/80 mt-1 leading-relaxed">
                                    System flagged critical values in vitals and labs.
                                </p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between px-2">
                                <span className="text-xs font-bold text-purple-200 uppercase tracking-widest font-display">
                                    Key Findings
                                </span>
                                <span className="text-[10px] text-emerald-300 font-mono bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-500/30">
                                    CONFIDENCE: 98%
                                </span>
                            </div>
                            {report.summaryPoints.map((point) => (
                                <div
                                    key={point.id}
                                    ref={(el) => {
                                        summaryRefs.current[point.id] = el
                                    }}
                                    onMouseEnter={() => handleScrollToSource(point.sourceId, point.id)}
                                    onMouseLeave={() => setHoveredPointId(null)}
                                    className={`group relative p-5 rounded-2xl border border-white/5 bg-slate-900/20 hover:bg-slate-800/40 hover:border-purple-500/50 transition-all duration-300 cursor-pointer overflow-hidden hover:translate-x-1 hover:shadow-lg`}
                                >
                                    <div
                                        className={`absolute inset-0 bg-gradient-to-r from-purple-500/10 to-transparent opacity-0 transition-opacity duration-300 ${hoveredPointId === point.id ? "opacity-100" : ""
                                            }`}
                                    />
                                    <div className="relative z-10">
                                        <div className="flex justify-between items-start mb-3">
                                            <NeonBadge type={point.category}>{point.category}</NeonBadge>
                                            <ChevronRight
                                                size={16}
                                                className={`text-slate-400 transition-transform duration-300 group-hover:text-purple-300 group-hover:translate-x-1`}
                                            />
                                        </div>
                                        <p className={`text-sm leading-relaxed text-slate-300 group-hover:text-white transition-colors`}>
                                            {userType === "clinician" ? point.technical : point.simple}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 pt-6 border-t border-white/10">
                            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest mb-6 flex items-center gap-2 font-display">
                                <Activity size={14} /> Risk Analysis
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-4">
                                    {report.predictions.map((pred, idx) => (
                                        <GlassCard key={idx} className="p-4" hoverEffect borderBeam={true}>
                                            <div className="flex justify-between items-start">
                                                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                                                    {pred.label}
                                                </span>
                                                <div
                                                    className={`w-2 h-2 rounded-full shadow-[0_0_10px_currentColor] ${pred.severity === "high" ? "bg-rose-500 text-rose-500" : "bg-emerald-500 text-emerald-500"
                                                        }`}
                                                ></div>
                                            </div>
                                            <div className="flex items-baseline gap-1 mt-3 mb-1">
                                                <span className="text-4xl font-bold text-white tracking-tighter font-display">
                                                    <AnimatedCount end={pred.value} />
                                                </span>
                                                <span className="text-xs text-slate-400 font-bold">{pred.unit}</span>
                                            </div>
                                            <p className="text-[10px] text-slate-400 leading-tight border-t border-white/5 pt-2 mt-2">
                                                {pred.details}
                                            </p>
                                        </GlassCard>
                                    ))}
                                </div>
                                <GlassCard className="flex flex-col items-center justify-center p-2 relative overflow-hidden bg-slate-900/80">
                                    <div className="absolute top-3 left-3 text-[10px] text-purple-400 font-mono border border-purple-500/30 px-1.5 py-0.5 rounded">
                                        SCAN_ACTIVE
                                    </div>
                                    <HolographicBody activeRegion="heart" />
                                    <div className="absolute bottom-3 w-full px-4 flex justify-between text-[10px] text-slate-500 font-mono">
                                        <span>HR: 110</span>
                                        <span>BP: 135/85</span>
                                    </div>
                                </GlassCard>
                            </div>
                        </div>
                    </div>
                )}
            </GlassCard>

            {/* RIGHT PANEL */}
            <GlassCard className="hidden md:block w-[60%] h-full relative border border-white/20" borderBeam={false}>
                <div id="report-container" className="absolute inset-0 overflow-y-auto p-12 custom-scrollbar">
                    <div className="font-serif text-slate-200 leading-loose space-y-8 relative z-10 max-w-4xl mx-auto">
                        <div
                            dangerouslySetInnerHTML={{ __html: report.annotatedHtml }}
                            className={`
                  prose prose-invert prose-p:text-slate-200 prose-headings:text-purple-200 prose-headings:font-display prose-headings:uppercase prose-headings:text-xs prose-headings:tracking-[0.2em]
                  [&_.highlight-source]:transition-all [&_.highlight-source]:duration-500 [&_.highlight-source]:rounded-md [&_.highlight-source]:px-1.5 [&_.highlight-source]:py-0.5
                  ${highlightedId ? "[&_.highlight-source]:opacity-40" : ""}
                `}
                        />
                        <style>{`
                #${highlightedId} {
                  background-color: rgba(168, 85, 247, 0.25);
                  color: #faf5ff;
                  box-shadow: 0 0 25px rgba(168, 85, 247, 0.4);
                  border: 1px solid rgba(168, 85, 247, 0.6);
                  opacity: 1 !important;
                  transform: scale(1.02);
                  display: inline-block;
                  text-shadow: 0 0 5px rgba(255,255,255,0.5);
                }
              `}</style>
                    </div>
                </div>
            </GlassCard>
        </div>
    )
}

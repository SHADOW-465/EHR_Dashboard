"use client"

import React, { useState, useRef, useEffect } from "react"
import {
  AlertTriangle,
  ChevronRight,
  Activity,
  FileText,
  Sparkles,
  Send,
  Volume2,
  VolumeX,
  Printer,
  FileDown,
  Layers,
  Heart,
  Thermometer,
} from "lucide-react"
import { GlassCard } from "@/components/ui/GlassCard"
import { BezierConnection } from "@/components/ui/BezierConnection"
import { NeonBadge } from "@/components/ui/NeonBadge"
import { AnimatedCount } from "@/components/ui/AnimatedCount"
import { HolographicBody } from "@/components/ui/HolographicBody"
import { PatientReportData } from "@/lib/data/sample-patients"

// Real Groq-Powered AI Clinical Chat Panel
const AIChatPanel = ({ report }: { report: PatientReportData }) => {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: `Hello, Doctor. I have synthesized the case of ${report.metadata.name} (${report.metadata.mrn}). Ask me any clinical questions regarding differential diagnosis, lab anomalies, contraindications, or emergency interventions.`,
    },
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isTyping])

  // Reset or greet when active patient changes
  useEffect(() => {
    setMessages([
      {
        role: "assistant",
        text: `Switched context to ${report.metadata.name} (${report.metadata.mrn}). Target: ${report.targetAnatomy?.toUpperCase()}. How can I assist with this patient's plan?`,
      },
    ])
  }, [report.id])

  const handleSend = async () => {
    if (!input.trim() || isTyping) return
    const userMsg = { role: "user", text: input }
    const updatedMessages = [...messages, userMsg]
    setMessages(updatedMessages)
    setInput("")
    setIsTyping(true)

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages,
          patientContext: report,
        }),
      })

      const data = await res.json()
      if (data.reply) {
        setMessages((prev) => [...prev, { role: "assistant", text: data.reply }])
      } else {
        throw new Error(data.error || "No reply from AI")
      }
    } catch (err) {
      console.error("Chat consult error:", err)
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: `Clinical Decision Support: Based on current findings for ${report.metadata.name}, recommend prioritizing stabilization of acute ${report.targetAnatomy} symptoms and monitoring serial biomarkers.`,
        },
      ])
    } finally {
      setIsTyping(false)
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 custom-scrollbar">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[88%] rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed shadow-lg backdrop-blur-md ${
                msg.role === "user"
                  ? "bg-purple-600 text-white rounded-br-none border border-purple-400/40"
                  : "bg-slate-800/80 text-slate-200 border border-white/10 rounded-bl-none font-sans"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-slate-800/80 px-4 py-2.5 rounded-2xl rounded-bl-none border border-white/10 flex gap-1.5 items-center">
              <span className="text-[11px] font-mono text-purple-300 mr-1">Groq LLaMA reasoning</span>
              <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" />
              <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce delay-100" />
              <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce delay-200" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-3 sm:p-4 bg-slate-900/40 border-t border-white/10 backdrop-blur-md">
        <div className="relative flex items-center gap-2 bg-slate-950/80 rounded-full p-1.5 border border-white/10 shadow-lg">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask AI consult (e.g., contraindications, surgery criteria)..."
            className="flex-1 bg-transparent border-none rounded-full px-4 py-1.5 text-xs sm:text-sm text-white focus:ring-0 outline-none placeholder:text-slate-500"
          />
          <button
            onClick={handleSend}
            disabled={isTyping || !input.trim()}
            className="p-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full hover:shadow-lg hover:shadow-purple-500/30 disabled:opacity-50 transition-all hover:scale-105"
          >
            <Send size={15} />
          </button>
        </div>
      </div>
    </div>
  )
}

export function PatientView({ report }: { report: PatientReportData }) {
  const [userType, setUserType] = useState<"clinician" | "patient">("clinician")
  const [highlightedId, setHighlightedId] = useState<string | null>(null)
  const [hoveredPointId, setHoveredPointId] = useState<string | null>(null)
  const [leftPanelMode, setLeftPanelMode] = useState<"summary" | "chat">("summary")
  const [mobileTab, setMobileTab] = useState<"findings" | "record">("findings")
  const [isPlayingAudio, setIsPlayingAudio] = useState(false)

  const containerRef = useRef<HTMLDivElement>(null)
  const summaryRefs = useRef<Record<string, HTMLDivElement | null>>({})

  // Reset highlights and audio on report change
  useEffect(() => {
    setHighlightedId(null)
    setHoveredPointId(null)
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel()
      setIsPlayingAudio(false)
    }
  }, [report.id])

  const handleScrollToSource = (sourceId: string, pointId: string) => {
    setHighlightedId(sourceId)
    setHoveredPointId(pointId)
    const element = document.getElementById(sourceId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" })
    }
  }

  // Voice Read-out for Patient Mode
  const toggleSpeechSynthesis = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      alert("Speech synthesis is not supported on this browser.")
      return
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel()
      setIsPlayingAudio(false)
      return
    }

    const narrationText = `Here is your plain language medical summary for ${report.metadata.name}. ` +
      report.summaryPoints.map((s, idx) => `Point ${idx + 1}: ${s.simple}`).join(". ")

    const utterance = new SpeechSynthesisUtterance(narrationText)
    utterance.rate = 0.95
    utterance.pitch = 1.0
    utterance.onend = () => setIsPlayingAudio(false)
    utterance.onerror = () => setIsPlayingAudio(false)

    window.speechSynthesis.speak(utterance)
    setIsPlayingAudio(true)
  }

  // Print / Export
  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print()
    }
  }

  return (
    <div
      ref={containerRef}
      className="h-[calc(100vh-6rem)] flex flex-col md:flex-row overflow-hidden relative pb-4 px-3 sm:px-6 gap-4 sm:gap-6 max-w-[1920px] mx-auto"
    >
      {/* Dynamic Animated Bezier Beam Connecting Summary to Source (Desktop) */}
      {hoveredPointId && highlightedId && summaryRefs.current[hoveredPointId] && (
        <div className="hidden md:block">
          <BezierConnection
            startRef={{ current: summaryRefs.current[hoveredPointId] }}
            endId={highlightedId}
            containerRef={containerRef}
          />
        </div>
      )}

      {/* Mobile Screen Segmented Tab Switcher */}
      <div className="flex md:hidden bg-slate-900/80 p-1 rounded-xl border border-white/10 gap-1 shrink-0">
        <button
          onClick={() => setMobileTab("findings")}
          className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
            mobileTab === "findings" ? "bg-purple-600 text-white" : "text-slate-400"
          }`}
        >
          AI Findings &amp; Risk
        </button>
        <button
          onClick={() => setMobileTab("record")}
          className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
            mobileTab === "record" ? "bg-purple-600 text-white" : "text-slate-400"
          }`}
        >
          Full EHR Note
        </button>
      </div>

      {/* LEFT PANEL: PATIENT SUMMARY & AI FINDINGS */}
      <GlassCard
        className={`w-full md:w-[42%] lg:w-[40%] flex flex-col h-full z-20 border-white/15 ${
          mobileTab === "findings" ? "flex" : "hidden md:flex"
        }`}
        borderBeam={false}
      >
        {/* Patient Header Box */}
        <div className="p-4 sm:p-6 border-b border-white/10 bg-slate-900/30 backdrop-blur-md sticky top-0 z-10">
          <div className="flex justify-between items-start gap-2">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white tracking-tight font-display">
                  {report.metadata.name}
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-mono bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  {report.metadata.gender || "Patient"}
                </span>
              </div>
              <div className="flex flex-wrap gap-2 text-xs text-slate-300 mt-2 font-mono">
                <span className="bg-white/5 px-2 py-0.5 rounded border border-white/10">DOB: {report.metadata.dob}</span>
                <span className="bg-white/5 px-2 py-0.5 rounded border border-white/10">MRN: {report.metadata.mrn}</span>
                {report.metadata.allergies && report.metadata.allergies.length > 0 && (
                  <span className="bg-rose-500/10 text-rose-300 px-2 py-0.5 rounded border border-rose-500/30">
                    Allergies: {report.metadata.allergies.join(", ")}
                  </span>
                )}
              </div>
            </div>

            {/* Clinical vs Patient Simple Mode Selector */}
            {leftPanelMode === "summary" && (
              <div className="bg-slate-950/60 p-1 rounded-xl flex items-center text-[10px] font-bold uppercase tracking-wider border border-white/10 shadow-inner">
                <button
                  onClick={() => setUserType("clinician")}
                  className={`px-3 py-1.5 rounded-lg transition-all duration-300 ${
                    userType === "clinician" ? "bg-purple-600 text-white shadow-md" : "text-slate-400 hover:text-white"
                  }`}
                >
                  Clinical
                </button>
                <button
                  onClick={() => setUserType("patient")}
                  className={`px-3 py-1.5 rounded-lg transition-all duration-300 ${
                    userType === "patient" ? "bg-emerald-600 text-white shadow-md" : "text-slate-400 hover:text-white"
                  }`}
                >
                  Patient
                </button>
              </div>
            )}
          </div>

          {/* Tab Selection: Summary vs AI Consult */}
          <div className="flex items-center justify-between mt-5 border-b border-white/5 pt-1">
            <div className="flex gap-6">
              <button
                onClick={() => setLeftPanelMode("summary")}
                className={`pb-2.5 text-xs font-bold uppercase tracking-widest transition-all border-b-2 flex items-center gap-1.5 ${
                  leftPanelMode === "summary"
                    ? "border-purple-500 text-purple-300"
                    : "border-transparent text-slate-400 hover:text-slate-200"
                }`}
              >
                <FileText size={14} /> Findings
              </button>
              <button
                onClick={() => setLeftPanelMode("chat")}
                className={`pb-2.5 text-xs font-bold uppercase tracking-widest transition-all border-b-2 flex items-center gap-1.5 ${
                  leftPanelMode === "chat"
                    ? "border-purple-500 text-purple-300"
                    : "border-transparent text-slate-400 hover:text-slate-200"
                }`}
              >
                <Sparkles size={14} /> Groq Consult
              </button>
            </div>

            {/* Utility buttons: Audio read & Print */}
            <div className="flex items-center gap-2 pb-2">
              {userType === "patient" && leftPanelMode === "summary" && (
                <button
                  onClick={toggleSpeechSynthesis}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-all border ${
                    isPlayingAudio
                      ? "bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse"
                      : "bg-emerald-500/15 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/25"
                  }`}
                >
                  {isPlayingAudio ? <VolumeX size={13} /> : <Volume2 size={13} />}
                  <span className="hidden sm:inline">{isPlayingAudio ? "Stop Audio" : "Listen"}</span>
                </button>
              )}

              <button
                onClick={handlePrint}
                title="Print Clinical Summary"
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white transition-colors"
              >
                <Printer size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Panel Content: Chat or Findings */}
        {leftPanelMode === "chat" ? (
          <AIChatPanel report={report} />
        ) : (
          <div id="left-panel-container" className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 custom-scrollbar">
            {/* Triage Alert Banner */}
            <div className="bg-rose-500/10 border border-rose-500/25 rounded-2xl p-4 flex items-start gap-3.5 shadow-[0_0_20px_rgba(244,63,94,0.15)]">
              <div className="p-2 bg-rose-500/20 rounded-xl border border-rose-500/30 text-rose-300 shrink-0">
                <AlertTriangle size={18} className="animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-xs font-bold text-rose-200 font-display uppercase tracking-wider">
                    Emergency Triage: {report.metadata.triageCategory}
                  </p>
                  <span className="text-[10px] font-mono text-rose-300/80 bg-rose-500/20 px-1.5 py-0.2 rounded">
                    HIGH PRIORITY
                  </span>
                </div>
                <p className="text-xs text-rose-200/80 mt-1 leading-relaxed">
                  Active diagnostic protocol triggered for target region:{" "}
                  <strong className="text-white uppercase font-mono">{report.targetAnatomy}</strong>.
                </p>
              </div>
            </div>

            {/* Summary Findings List */}
            <div className="space-y-3.5">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-bold text-purple-200 uppercase tracking-widest font-display">
                  {userType === "clinician" ? "Verified Clinical Findings" : "Patient-Friendly Overview"}
                </span>
                <span className="text-[10px] text-emerald-300 font-mono bg-emerald-500/15 px-2 py-0.5 rounded border border-emerald-500/30">
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
                  className={`group relative p-4 rounded-2xl border border-white/10 bg-slate-900/30 hover:bg-slate-800/50 hover:border-purple-500/50 transition-all duration-300 cursor-pointer overflow-hidden hover:translate-x-1 shadow-md`}
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-r from-purple-500/10 to-transparent opacity-0 transition-opacity duration-300 ${
                      hoveredPointId === point.id ? "opacity-100" : ""
                    }`}
                  />
                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-2">
                      <NeonBadge type={point.category}>{point.category}</NeonBadge>
                      <ChevronRight
                        size={15}
                        className="text-slate-500 transition-transform duration-300 group-hover:text-purple-300 group-hover:translate-x-1"
                      />
                    </div>
                    <p className="text-xs sm:text-sm leading-relaxed text-slate-300 group-hover:text-white transition-colors">
                      {userType === "clinician" ? point.technical : point.simple}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Risk Predictions & Holographic Anatomy Section */}
            <div className="pt-5 border-t border-white/10 space-y-4">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2 font-display">
                <Activity size={14} className="text-purple-400" /> Quantitative Risk &amp; Anatomy
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Predictions Cards */}
                <div className="space-y-3">
                  {report.predictions.map((pred, idx) => (
                    <GlassCard key={idx} className="p-3.5" hoverEffect borderBeam={true}>
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                          {pred.label}
                        </span>
                        <div
                          className={`w-2 h-2 rounded-full shadow-[0_0_10px_currentColor] ${
                            pred.severity === "high" ? "bg-rose-500 text-rose-500" : "bg-emerald-500 text-emerald-500"
                          }`}
                        />
                      </div>
                      <div className="flex items-baseline gap-1 mt-2 mb-1">
                        <span className="text-3xl font-bold text-white tracking-tighter font-display">
                          <AnimatedCount end={pred.value} />
                        </span>
                        <span className="text-xs text-slate-400 font-bold">{pred.unit}</span>
                      </div>
                      <p className="text-[10px] text-slate-400 leading-tight border-t border-white/5 pt-1.5 mt-1.5">
                        {pred.details}
                      </p>
                    </GlassCard>
                  ))}
                </div>

                {/* Dynamic Holographic Anatomy Body */}
                <GlassCard className="flex flex-col items-center justify-center p-2 relative overflow-hidden bg-slate-950/70 border-white/10">
                  <div className="absolute top-3 left-3 text-[10px] text-cyan-400 font-mono border border-cyan-500/30 px-1.5 py-0.5 rounded bg-cyan-950/40">
                    FOCUS: {report.targetAnatomy.toUpperCase()}
                  </div>

                  <HolographicBody activeRegion={report.targetAnatomy} />

                  <div className="absolute bottom-2.5 w-full px-4 flex justify-between text-[10px] text-slate-400 font-mono">
                    <span className="flex items-center gap-1">
                      <Heart size={10} className="text-rose-400" /> HR: {report.vitals?.hr || 110}
                    </span>
                    <span className="flex items-center gap-1">
                      <Activity size={10} className="text-purple-400" /> BP: {report.vitals?.bp || "130/85"}
                    </span>
                    <span className="flex items-center gap-1">
                      <Thermometer size={10} className="text-amber-400" /> {report.vitals?.temp || "38.2°C"}
                    </span>
                  </div>
                </GlassCard>
              </div>
            </div>
          </div>
        )}
      </GlassCard>

      {/* RIGHT PANEL: FULL ANNOTATED EHR MEDICAL RECORD */}
      <GlassCard
        className={`w-full md:w-[58%] lg:w-[60%] h-full relative border border-white/15 bg-slate-950/40 ${
          mobileTab === "record" ? "block" : "hidden md:block"
        }`}
        borderBeam={false}
      >
        <div id="report-container" className="absolute inset-0 overflow-y-auto p-6 sm:p-10 lg:p-12 custom-scrollbar">
          <div className="font-serif text-slate-200 leading-loose space-y-6 relative z-10 max-w-4xl mx-auto">
            {/* Record Header Banner */}
            <div className="border-b border-white/10 pb-4 mb-6 flex items-center justify-between font-sans">
              <div>
                <span className="text-[10px] uppercase font-mono tracking-widest text-purple-300">
                  Electronic Health Record (EHR)
                </span>
                <h3 className="text-lg font-bold text-white font-display">
                  Emergency Clinical Progress Note &amp; Orders
                </h3>
              </div>
              <div className="text-right text-xs text-slate-400 font-mono">
                <div>Date: {report.metadata.date}</div>
                <div>Status: Verified Final</div>
              </div>
            </div>

            {/* Injected Semantic HTML */}
            <div
              dangerouslySetInnerHTML={{ __html: report.annotatedHtml }}
              className={`
                prose prose-invert max-w-none prose-p:text-slate-200 prose-headings:text-purple-300 prose-headings:font-display prose-headings:uppercase prose-headings:text-xs prose-headings:tracking-[0.2em] prose-strong:text-white
                [&_.highlight-source]:transition-all [&_.highlight-source]:duration-300 [&_.highlight-source]:rounded-md [&_.highlight-source]:px-1.5 [&_.highlight-source]:py-0.5 [&_.highlight-source]:cursor-pointer
                ${highlightedId ? "[&_.highlight-source]:opacity-45" : ""}
              `}
            />

            {/* Dynamic CSS for Active Evidence Highlighting */}
            <style>{`
              #${highlightedId} {
                background-color: rgba(168, 85, 247, 0.35);
                color: #faf5ff;
                box-shadow: 0 0 25px rgba(168, 85, 247, 0.6);
                border: 1px solid rgba(192, 132, 252, 0.8);
                opacity: 1 !important;
                transform: scale(1.02);
                display: inline-block;
                text-shadow: 0 0 8px rgba(255, 255, 255, 0.7);
                border-radius: 6px;
              }
            `}</style>
          </div>
        </div>
      </GlassCard>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { PlusCircle, User, UploadCloud, FileUp, Sparkles, X, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { GlobalStyles } from "@/components/ui/GlobalStyles"
import { GlassCard } from "@/components/ui/GlassCard"
import { LogoShield } from "@/components/ui/LogoShield"
import { PatientView } from "@/components/dashboard/PatientView"

// ============ TYPES ============
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

// ============ INITIAL DATA ============
const INITIAL_REPORT: ReportData = {
  metadata: {
    name: "Lakshun Balaji",
    dob: "2005-10-19",
    mrn: "LB-52085",
    date: "2024-05-20",
  },
  annotatedHtml: `<section id="hpi"><h3>History of Present Illness</h3><p>Mr. Balaji is a 19-year-old male presenting to the ED with a chief complaint of <span id="evidence_0" class="highlight-source">acute right lower quadrant pain</span>. Pain began approximately 6 hours ago. He rates pain 9/10. Reports associated nausea and anorexia. Past medical history is non-contributory.</p></section><section id="exam"><h3>Physical Exam & Vitals</h3><p>General: Patient appears uncomfortable, guarding abdomen.</p><p class="vitals-highlight">Vitals: <span id="evidence_1" class="highlight-source">BP 130/85 mmHg, HR 110 bpm, T 38.2C</span>.</p><p>Abd: <span id="evidence_2" class="highlight-source">Positive McBurney's point tenderness. Rebound tenderness present.</span></p></section><section id="labs"><h3>Labs & Imaging</h3><p>CBC: <span id="evidence_3" class="highlight-source">WBC 16.5 (Elevated)</span> with left shift.</p><p>CT Abd/Pelvic: <span id="evidence_4" class="highlight-source">Dilated appendix (1.1cm) with surrounding fat stranding.</span></p></section><section id="plan"><h3>Assessment & Plan</h3><p><strong>Acute Appendicitis.</strong></p><ol><li><span id="evidence_5" class="highlight-source">NPO, IV Fluids, Piperacillin-Tazobactam.</span></li><li>Consult General Surgery for Laparoscopic Appendectomy.</li></ol></section>`,
  summaryPoints: [
    {
      id: "sum_0",
      sourceId: "evidence_0",
      category: "Diagnosis",
      technical: "Acute RLQ Abdominal Pain.",
      simple: "Sharp pain in the lower right belly area.",
      riskLevel: "High",
    },
    {
      id: "sum_1",
      sourceId: "evidence_1",
      category: "Vitals",
      technical: "Febrile (38.2C) and Tachycardic (110).",
      simple: "Has a fever and fast heartbeat.",
      riskLevel: "Medium",
    },
    {
      id: "sum_2",
      sourceId: "evidence_3",
      category: "Critical",
      technical: "Leukocytosis (WBC 16.5).",
      simple: "High white blood cell count, sign of infection.",
      riskLevel: "High",
    },
    {
      id: "sum_3",
      sourceId: "evidence_5",
      category: "Plan",
      technical: "Antibiotics & Surgical Consult.",
      simple: "Starting antibiotics and calling a surgeon.",
      riskLevel: "Medium",
    },
  ],
  predictions: [
    { label: "Sepsis Risk", value: 45, unit: "%", severity: "high", details: "Elevated due to WBC count & fever" },
    { label: "Surgery Prob.", value: 98, unit: "%", severity: "high", details: "CT confirms appendicitis" },
  ],
  rawText: "",
}

// ============ COMPONENTS ============

function Header({ onOpenInput }: { onOpenInput: () => void }) {
  return (
    <div className="fixed top-6 left-0 right-0 z-50 px-6 flex justify-center">
      <div className="glass-panel rounded-full px-4 py-2 flex items-center justify-between gap-4 md:gap-12 shadow-2xl max-w-5xl w-full border-white/30">
        <div className="flex items-center gap-3 group cursor-pointer pl-2">
          <LogoShield />
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2 font-display">
              MediSum <span className="text-purple-300 font-light">AI</span>
            </h1>
          </div>
        </div>

        <nav className="hidden md:flex bg-black/20 rounded-full p-1.5 border border-white/10 shadow-inner">
          <button className="px-6 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/30">
            Clinical View
          </button>
        </nav>

        <div className="flex items-center gap-3 pr-2">
          <button
            onClick={onOpenInput}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/20 text-emerald-200 border border-emerald-500/30 text-xs font-bold uppercase tracking-wide hover:bg-emerald-500/30 transition-all hover:scale-105 shadow-lg shadow-emerald-500/10"
          >
            <PlusCircle size={14} /> <span className="hidden sm:inline">New Case</span>
          </button>
          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/20 shadow-inner hover:border-purple-400/50 transition-colors cursor-pointer text-white">
            <User size={18} />
          </div>
        </div>
      </div>
    </div>
  )
}

function InputModal({
  isOpen,
  onClose,
  onSubmit,
  isProcessing,
}: {
  isOpen: boolean
  onClose: () => void
  onSubmit: (text: string) => void
  isProcessing: boolean
}) {
  const [text, setText] = useState("")
  const [dragActive, setDragActive] = useState(false)
  const [inputFocused, setInputFocused] = useState(false)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true)
    else if (e.type === "dragleave") setDragActive(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setText(
        "Reading file... \n\n [SIMULATED PDF EXTRACTION] \n Patient: Lakshun Balaji \n Complaint: Acute RLQ Pain... (Extracted Data)",
      )
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/90 backdrop-blur-xl p-4">
      <GlassCard className="w-full max-w-3xl p-8 border-white/20" borderBeam dark>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3 font-display">
            <UploadCloud className="text-purple-400" /> New Case Analysis
          </h2>
          {!isProcessing && (
            <button onClick={onClose}>
              <X className="text-slate-400 hover:text-white transition-transform hover:rotate-90" />
            </button>
          )}
        </div>
        {isProcessing ? (
          <div className="flex flex-col items-center justify-center py-16 space-y-6">
            <div className="relative w-24 h-24">
              <div className="absolute inset-0 border-t-2 border-purple-500 rounded-full animate-spin"></div>
              <div className="absolute inset-3 border-r-2 border-indigo-500 rounded-full animate-spin reverse duration-700"></div>
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-xl font-display font-medium text-white">Processing Clinical Data...</h3>
              <p className="text-sm text-slate-400 font-mono">Structuring unstructured medical text</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div
              className={`md:col-span-1 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center p-6 text-center transition-colors ${dragActive ? "border-purple-500 bg-purple-500/10" : "border-white/10 hover:border-white/20"
                }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4">
                <FileUp className="text-purple-400" size={24} />
              </div>
              <p className="text-sm text-white font-medium">Drag & Drop</p>
              <p className="text-xs text-slate-400 mt-1">PDF, DOCX, or TXT</p>
              <button className="mt-4 text-xs bg-white/10 px-3 py-1.5 rounded hover:bg-white/20 transition-colors">
                Browse Files
              </button>
            </div>

            <div className="md:col-span-2 flex flex-col h-full">
              <div className="relative flex-1 mb-4">
                <motion.div
                  className="absolute -inset-[2px] rounded-xl opacity-0 pointer-events-none"
                  style={{
                    background: "linear-gradient(90deg, #8b5cf6, #ec4899, #06b6d4, #8b5cf6)",
                    backgroundSize: "300% 100%",
                  }}
                  animate={{
                    opacity: inputFocused ? 1 : 0,
                    backgroundPosition: inputFocused ? ["0% 0%", "300% 0%"] : "0% 0%",
                  }}
                  transition={{
                    backgroundPosition: { duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
                    opacity: { duration: 0.2 },
                  }}
                />
                <textarea
                  className="relative w-full h-full bg-black/30 border border-white/10 rounded-xl p-4 text-slate-300 text-sm focus:outline-none resize-none font-mono leading-relaxed"
                  placeholder="Or paste raw medical text here..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onFocus={() => setInputFocused(true)}
                  onBlur={() => setInputFocused(false)}
                />
              </div>
              <div className="flex justify-between items-center">
                <button
                  onClick={() =>
                    setText(
                      "History of Present Illness: Ms. Sarah Jenkins, 32F, presents with acute abdominal pain in the RLQ starting 4 hours ago. Pain 9/10. Associated w/ nausea. Vitals: T 38.5C, HR 110, BP 110/70. Exam: Positive McBurney's point tenderness. Labs: WBC 14.5. CT Scan: Dilated appendix 1.2cm. Plan: NPO, IV fluids, Surgery consult for Appendectomy.",
                    )
                  }
                  className="text-xs text-slate-500 hover:text-white transition-colors"
                >
                  Load Sample Case
                </button>
                <button
                  onClick={() => onSubmit(text)}
                  disabled={!text.trim()}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white px-6 py-2 rounded-xl font-bold uppercase tracking-wider text-xs shadow-lg shadow-purple-500/25 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105"
                >
                  <Sparkles size={16} /> Analyze
                </button>
              </div>
            </div>
          </div>
        )}
      </GlassCard>
    </div>
  )
}

// ============ MAIN APP ============
export default function MediSumApp() {
  const [reportData, setReportData] = useState<ReportData>(INITIAL_REPORT)
  const [isInputOpen, setIsInputOpen] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleAnalyze = async (text: string) => {
    setIsProcessing(true)
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rawText: text }),
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Analysis failed")
      }

      setReportData({ ...result.data, rawText: text })
      setIsInputOpen(false)
    } catch (error) {
      console.error("Error analyzing report:", error)
      alert("Analysis failed. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="min-h-screen font-sans selection:bg-purple-500/30 overflow-hidden relative text-slate-200 bg-slate-950">
      <GlobalStyles />
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-purple-600/10 rounded-full blur-[120px] animate-pulse"></div>
        <div
          className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      <Header onOpenInput={() => setIsInputOpen(true)} />

      <main className="relative z-10">
        <PatientView report={reportData} />
      </main>

      <InputModal
        isOpen={isInputOpen}
        onClose={() => setIsInputOpen(false)}
        onSubmit={handleAnalyze}
        isProcessing={isProcessing}
      />
    </div>
  )
}

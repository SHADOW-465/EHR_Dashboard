"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  PlusCircle,
  User,
  UploadCloud,
  FileUp,
  Sparkles,
  X,
  Activity,
  Layers,
  Database,
  CheckCircle2,
  FileText,
} from "lucide-react"
import { GlobalStyles } from "@/components/ui/GlobalStyles"
import { GlassCard } from "@/components/ui/GlassCard"
import { LogoShield } from "@/components/ui/LogoShield"
import { PatientView } from "@/components/dashboard/PatientView"
import { OperationsView } from "@/components/dashboard/OperationsView"
import { TriageBar } from "@/components/dashboard/TriageBar"
import { SAMPLE_PATIENTS, PatientReportData } from "@/lib/data/sample-patients"
import { isSupabaseConfigured } from "@/lib/supabase/client"
import { fetchAllPatients, savePatientReport } from "@/lib/supabase/service"

// Navigation Header
function Header({
  activeView,
  onSelectView,
  onOpenInput,
  isSupabaseLive,
}: {
  activeView: "clinical" | "operations"
  onSelectView: (view: "clinical" | "operations") => void
  onOpenInput: () => void
  isSupabaseLive: boolean
}) {
  return (
    <div className="fixed top-4 left-0 right-0 z-50 px-4 sm:px-6 flex justify-center">
      <div className="glass-panel rounded-full px-4 py-2 flex items-center justify-between gap-4 md:gap-8 shadow-2xl max-w-6xl w-full border-white/20 bg-slate-950/80 backdrop-blur-2xl">
        {/* Logo Shield & Title */}
        <div className="flex items-center gap-3 cursor-pointer pl-1" onClick={() => onSelectView("clinical")}>
          <LogoShield />
          <div>
            <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-1.5 font-display">
              MediSum <span className="text-purple-400 font-light">AI</span>
            </h1>
            <div className="flex items-center gap-1 text-[9px] font-mono text-purple-300/80">
              <span>GROQ LLaMA-3.3</span>
              <span>•</span>
              <span className={isSupabaseLive ? "text-emerald-400" : "text-amber-400"}>
                {isSupabaseLive ? "SUPABASE LIVE" : "LOCAL CACHE"}
              </span>
            </div>
          </div>
        </div>

        {/* View Switcher: Clinical View vs. Operations Command Center */}
        <nav className="flex bg-slate-900/90 rounded-full p-1 border border-white/10 shadow-inner">
          <button
            onClick={() => onSelectView("clinical")}
            className={`px-4 sm:px-6 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-1.5 ${
              activeView === "clinical"
                ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <FileText size={13} />
            <span className="hidden sm:inline">Clinical</span> Diagnostic
          </button>
          <button
            onClick={() => onSelectView("operations")}
            className={`px-4 sm:px-6 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-1.5 ${
              activeView === "operations"
                ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Activity size={13} />
            <span className="hidden sm:inline">Hospital</span> Operations
          </button>
        </nav>

        {/* Right CTA buttons */}
        <div className="flex items-center gap-2 pr-1">
          <button
            onClick={onOpenInput}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-500/20 text-emerald-200 border border-emerald-500/30 text-xs font-bold uppercase tracking-wide hover:bg-emerald-500/30 transition-all hover:scale-105 shadow-md shadow-emerald-500/10"
          >
            <PlusCircle size={14} />
            <span className="hidden md:inline">Ingest Record</span>
          </button>
        </div>
      </div>
    </div>
  )
}

// Ingest Medical Record Modal with Real File Ingestion & Groq Pipeline
function IngestModal({
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
  const [fileName, setFileName] = useState<string | null>(null)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true)
    else if (e.type === "dragleave") setDragActive(false)
  }

  const handleFileRead = (file: File) => {
    setFileName(file.name)
    const reader = new FileReader()
    reader.onload = (event) => {
      const content = event.target?.result as string
      setText(content || "")
    }
    reader.readAsText(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileRead(e.dataTransfer.files[0])
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileRead(e.target.files[0])
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/90 backdrop-blur-2xl p-4 overflow-y-auto">
      <GlassCard className="w-full max-w-3xl p-6 sm:p-8 border-white/20 bg-slate-900/90" borderBeam dark>
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
              <UploadCloud size={20} />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white font-display">
                Ingest Medical Record
              </h2>
              <p className="text-xs text-slate-400">
                Processed via Groq LLaMA-3.3-70B with clinical evidence mapping
              </p>
            </div>
          </div>
          {!isProcessing && (
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {isProcessing ? (
          <div className="flex flex-col items-center justify-center py-16 space-y-6">
            <div className="relative w-20 h-20">
              <div className="absolute inset-0 border-3 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
              <div
                className="absolute inset-2 border-3 border-indigo-500/20 border-r-indigo-500 rounded-full animate-spin"
                style={{ animationDirection: "reverse", animationDuration: "1.2s" }}
              />
            </div>
            <div className="text-center space-y-1.5">
              <h3 className="text-lg font-display font-medium text-white">
                Synthesizing Clinical Intelligence...
              </h3>
              <p className="text-xs text-purple-300 font-mono">
                Extracting ICD/SNOMED findings, risk levels, and evidence spans
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* File Drag & Drop Upload Zone */}
            <div
              className={`md:col-span-1 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center p-6 text-center transition-all cursor-pointer ${
                dragActive
                  ? "border-purple-500 bg-purple-500/15"
                  : "border-white/15 hover:border-purple-400/50 hover:bg-white/5"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".txt,.md,.json,.csv"
                onChange={handleFileInputChange}
                className="hidden"
              />
              <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center mb-3 text-purple-400">
                <FileUp size={22} />
              </div>
              <p className="text-xs font-bold text-white uppercase tracking-wider">
                {fileName ? fileName : "Upload Document"}
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                Drop .txt, .md, or clinical notes here
              </p>
              <span className="mt-3 text-[10px] bg-white/10 px-3 py-1 rounded-full text-slate-300 border border-white/10">
                Browse System Files
              </span>
            </div>

            {/* Direct Paste Text Area & Sample Ingest Buttons */}
            <div className="md:col-span-2 flex flex-col">
              <textarea
                className="w-full h-44 bg-slate-950/70 border border-white/10 rounded-xl p-3.5 text-slate-200 text-xs font-mono leading-relaxed focus:outline-none focus:border-purple-500/50 resize-none placeholder:text-slate-500"
                placeholder="Paste raw unstructured clinical text, ED admission note, or discharge summary here..."
                value={text}
                onChange={(e) => setText(e.target.value)}
              />

              {/* Sample Note Fast-Fill Shortcuts */}
              <div className="flex flex-wrap items-center gap-1.5 mt-3">
                <span className="text-[10px] text-slate-500 font-mono">Load Sample:</span>
                <button
                  type="button"
                  onClick={() =>
                    setText(
                      "History of Present Illness: Mrs. Sarah Jenkins, a 34-year-old female, presents to ED with severe 9/10 RLQ abdominal pain for 5 hours. Nausea, low-grade fever. Vitals: BP 128/82, HR 108, Temp 38.4C. Exam: Positive McBurney's sign, localized rebound tenderness. Labs: WBC 15.8 with left shift. CT Scan: Dilated appendix 1.2cm with periappendiceal stranding. Plan: Acute Appendicitis. NPO, IV fluids, Piperacillin-Tazobactam. Urgent appendectomy consult."
                    )
                  }
                  className="text-[10px] px-2 py-0.5 rounded bg-white/5 hover:bg-white/15 text-slate-300 border border-white/10 transition-colors"
                >
                  Appendicitis
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setText(
                      "History of Present Illness: Mr. David Miller, 67-year-old male with hypertension, presents with sudden onset crushing substernal chest pressure radiating to jaw, duration 60 mins. Vitals: BP 172/100, HR 98, SpO2 93%. ECG: 4mm ST elevations in leads V1-V4. High-sensitivity Troponin I critically high at 5,200 ng/L. Assessment: Acute Anterior STEMI. Plan: Code STEMI activated. Aspirin 324mg, Ticagrelor 180mg, Heparin bolus. Immediate Primary PCI in Cath Lab."
                    )
                  }
                  className="text-[10px] px-2 py-0.5 rounded bg-white/5 hover:bg-white/15 text-slate-300 border border-white/10 transition-colors"
                >
                  Acute STEMI
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setText(
                      "History of Present Illness: Ms. Karen Young, 45-year-old female with asthma/COPD, presents with acute severe wheezing, orthopnea, and SpO2 86% on room air. Accessory muscle use, audible expiratory wheezing bilaterally. ABG: pH 7.29, pCO2 64 mmHg. Plan: Acute severe bronchospasm with respiratory acidosis. Continuous nebulized albuterol/ipratropium, IV methylprednisolone 125mg, BiPAP trial."
                    )
                  }
                  className="text-[10px] px-2 py-0.5 rounded bg-white/5 hover:bg-white/15 text-slate-300 border border-white/10 transition-colors"
                >
                  COPD Crisis
                </button>
              </div>

              {/* Submit CTA */}
              <div className="flex justify-between items-center mt-5 pt-3 border-t border-white/10">
                <span className="text-[10px] text-slate-400 font-mono">
                  {text.length} characters parsed
                </span>
                <button
                  onClick={() => onSubmit(text)}
                  disabled={!text.trim()}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white px-5 py-2 rounded-xl font-bold uppercase tracking-wider text-xs shadow-lg shadow-purple-500/25 flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed transition-all hover:scale-105"
                >
                  <Sparkles size={15} /> Analyze with Groq
                </button>
              </div>
            </div>
          </div>
        )}
      </GlassCard>
    </div>
  )
}

// MAIN APP COMPONENT
export default function MediSumApp() {
  const [patients, setPatients] = useState<PatientReportData[]>(SAMPLE_PATIENTS)
  const [activePatientId, setActivePatientId] = useState<string>(SAMPLE_PATIENTS[0].id)
  const [activeView, setActiveView] = useState<"clinical" | "operations">("clinical")
  const [isInputOpen, setIsInputOpen] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSupabaseLive, setIsSupabaseLive] = useState(false)

  // Load patients from Supabase or fallback
  useEffect(() => {
    async function loadData() {
      const live = isSupabaseConfigured()
      setIsSupabaseLive(live)
      if (live) {
        try {
          const loaded = await fetchAllPatients()
          if (loaded && loaded.length > 0) {
            setPatients(loaded)
            setActivePatientId(loaded[0].id)
          }
        } catch (e) {
          console.warn("Failed to load from Supabase, using local demo patients:", e)
        }
      }
    }
    loadData()
  }, [])

  const activePatient = patients.find((p) => p.id === activePatientId) || patients[0]

  const handleAnalyzeNewNote = async (rawText: string) => {
    setIsProcessing(true)
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rawText }),
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Analysis failed")
      }

      const newReport: PatientReportData = {
        id: `patient-${Date.now()}`,
        metadata: {
          ...result.data.metadata,
          triageCategory: "Urgent (Orange)",
        },
        targetAnatomy: result.data.targetAnatomy || "abdomen",
        vitals: {
          hr: 104,
          bp: "125/80",
          temp: "37.8°C",
          spo2: "98%",
        },
        annotatedHtml: result.data.annotatedHtml,
        summaryPoints: result.data.summaryPoints,
        predictions: result.data.predictions,
        rawText,
      }

      // Add to local state
      setPatients((prev) => [newReport, ...prev])
      setActivePatientId(newReport.id)
      setActiveView("clinical")
      setIsInputOpen(false)

      // Persist to Supabase if connected
      if (isSupabaseLive) {
        savePatientReport(newReport).then((saved) => {
          if (saved) console.log("New report successfully persisted to Supabase!")
        })
      }
    } catch (error: any) {
      console.error("Error analyzing report:", error)
      alert(`Analysis failed: ${error?.message || "Please check your network connection."}`)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="min-h-screen font-sans selection:bg-purple-500/30 overflow-x-hidden relative text-slate-200 bg-slate-950">
      <GlobalStyles />

      {/* Ambient Cyberpunk Glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-15%] left-[-10%] w-[65%] h-[65%] bg-purple-600/10 rounded-full blur-[140px] animate-pulse" />
        <div
          className="absolute bottom-[-15%] right-[-10%] w-[55%] h-[55%] bg-blue-600/10 rounded-full blur-[140px] animate-pulse"
          style={{ animationDelay: "1.5s" }}
        />
      </div>

      {/* Navigation Header */}
      <Header
        activeView={activeView}
        onSelectView={setActiveView}
        onOpenInput={() => setIsInputOpen(true)}
        isSupabaseLive={isSupabaseLive}
      />

      {/* Main View Switching: Clinical Patient Reader vs. Operations Command Center */}
      <main className="relative z-10">
        {activeView === "clinical" ? (
          <div>
            {/* Triage Patient Queue Bar */}
            <TriageBar
              patients={patients}
              activePatientId={activePatientId}
              onSelectPatient={setActivePatientId}
              onNewAdmission={() => setIsInputOpen(true)}
              isSupabaseLive={isSupabaseLive}
            />

            {/* Split Screen Patient View with Evidence Linking */}
            <PatientView report={activePatient} />
          </div>
        ) : (
          <OperationsView />
        )}
      </main>

      {/* Document Ingestion Modal */}
      <IngestModal
        isOpen={isInputOpen}
        onClose={() => setIsInputOpen(false)}
        onSubmit={handleAnalyzeNewNote}
        isProcessing={isProcessing}
      />
    </div>
  )
}

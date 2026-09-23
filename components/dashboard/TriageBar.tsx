"use client"

import React from "react"
import { AlertCircle, Heart, Wind, Stethoscope, Activity, UserPlus, CheckCircle2 } from "lucide-react"
import { PatientReportData } from "@/lib/data/sample-patients"

interface TriageBarProps {
  patients: PatientReportData[]
  activePatientId: string
  onSelectPatient: (patientId: string) => void
  onNewAdmission: () => void
  isSupabaseLive: boolean
}

export function TriageBar({
  patients,
  activePatientId,
  onSelectPatient,
  onNewAdmission,
  isSupabaseLive,
}: TriageBarProps) {
  const getAnatomyIcon = (anatomy: string) => {
    switch (anatomy) {
      case "heart":
        return <Heart size={14} className="text-rose-400" />
      case "lungs":
        return <Wind size={14} className="text-cyan-400" />
      case "abdomen":
        return <Stethoscope size={14} className="text-amber-400" />
      default:
        return <Activity size={14} className="text-purple-400" />
    }
  }

  const getTriagePillColor = (category: string) => {
    if (category.includes("Red") || category.includes("Immediate")) {
      return "bg-rose-500/20 text-rose-300 border-rose-500/40"
    }
    if (category.includes("Orange") || category.includes("Urgent")) {
      return "bg-amber-500/20 text-amber-300 border-amber-500/40"
    }
    return "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-2 z-30">
      <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-2 sm:p-3 shadow-xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Left: Queue Title and DB indicator */}
        <div className="flex items-center justify-between md:justify-start gap-3 px-2">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-200 font-display">
              ED Triage Queue
            </span>
          </div>

          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono border bg-slate-950/40">
            {isSupabaseLive ? (
              <>
                <CheckCircle2 size={11} className="text-emerald-400" />
                <span className="text-emerald-300">Supabase Connected</span>
              </>
            ) : (
              <>
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span className="text-amber-300/90">Local Mode</span>
              </>
            )}
          </div>
        </div>

        {/* Center: Scrollable Patient Cards */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 custom-scrollbar flex-1 max-w-4xl px-1">
          {patients.map((p) => {
            const isActive = p.id === activePatientId
            return (
              <button
                key={p.id}
                onClick={() => onSelectPatient(p.id)}
                className={`flex-shrink-0 text-left px-3.5 py-2 rounded-xl transition-all duration-300 border flex items-center gap-3 ${
                  isActive
                    ? "bg-purple-600/30 border-purple-400 shadow-lg shadow-purple-500/20 scale-[1.02]"
                    : "bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/20 opacity-80 hover:opacity-100"
                }`}
              >
                <div className="p-1.5 rounded-lg bg-slate-950/60 border border-white/10">
                  {getAnatomyIcon(p.targetAnatomy)}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white tracking-tight font-display">
                      {p.metadata.name}
                    </span>
                    <span className={`text-[9px] px-1.5 py-0.2 rounded border font-mono ${getTriagePillColor(p.metadata.triageCategory)}`}>
                      {p.metadata.triageCategory.split(" ")[0]}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono mt-0.5">
                    <span>{p.metadata.mrn}</span>
                    <span>•</span>
                    <span className="text-purple-300">{p.vitals ? `HR ${p.vitals.hr}` : "Active"}</span>
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        {/* Right: New Admission Trigger */}
        <div className="flex items-center justify-end px-1">
          <button
            onClick={onNewAdmission}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-purple-600/40 to-indigo-600/40 hover:from-purple-600 hover:to-indigo-600 text-purple-200 hover:text-white border border-purple-500/40 text-xs font-bold tracking-wide transition-all shadow-md hover:scale-105"
          >
            <UserPlus size={14} />
            <span className="whitespace-nowrap">Ingest Record</span>
          </button>
        </div>
      </div>
    </div>
  )
}

"use client"

import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  Activity,
  AlertTriangle,
  Bed,
  Clock,
  Ambulance,
  Users,
  Sparkles,
  TrendingUp,
  RefreshCw,
  Building2,
  CheckCircle,
  ShieldAlert,
} from "lucide-react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts"
import { GlassCard } from "@/components/ui/GlassCard"
import { OperationalSummary, INITIAL_HOSPITAL_OPERATIONS } from "@/lib/data/hospital-metrics"

export function OperationsView() {
  const [operations, setOperations] = useState<OperationalSummary>(INITIAL_HOSPITAL_OPERATIONS)
  const [insights, setInsights] = useState<any[]>([])
  const [isLoadingInsights, setIsLoadingInsights] = useState(false)
  const [selectedDeptId, setSelectedDeptId] = useState<string>("dept-icu")

  const fetchAIInsights = async () => {
    setIsLoadingInsights(true)
    try {
      const res = await fetch("/api/operations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ metrics: operations }),
      })
      const data = await res.json()
      if (data.insights) {
        setInsights(data.insights)
      }
    } catch (err) {
      console.error("Failed to fetch operations insights:", err)
    } finally {
      setIsLoadingInsights(false)
    }
  }

  useEffect(() => {
    fetchAIInsights()
  }, [])

  return (
    <div className="pt-24 pb-16 px-4 sm:px-8 max-w-7xl mx-auto space-y-8">
      {/* Top Banner & KPI Stat Tiles */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-mono uppercase tracking-widest text-emerald-300">
              Live System Telemetry
            </span>
          </div>
          <h2 className="text-3xl font-bold text-white tracking-tight font-display mt-1">
            Hospital Operations Command Center
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Real-time department capacity, emergency wait time surveillance, and Groq AI surge forecasting.
          </p>
        </div>

        <button
          onClick={fetchAIInsights}
          disabled={isLoadingInsights}
          className="self-start md:self-auto flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 border border-purple-400/40 text-purple-200 text-xs font-bold uppercase tracking-wider transition-all hover:scale-105 shadow-lg shadow-purple-500/20"
        >
          <RefreshCw size={14} className={isLoadingInsights ? "animate-spin" : ""} />
          <span>{isLoadingInsights ? "Synthesizing Insights..." : "Run AI Surge Advisory"}</span>
        </button>
      </div>

      {/* 4 Key KPI Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <GlassCard className="p-5" borderBeam={false}>
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total System Occupancy</span>
            <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <Bed size={18} />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mt-4">
            <span className="text-4xl font-bold text-white font-display tracking-tight">
              {operations.systemOccupancyPct}%
            </span>
            <span className="text-xs text-slate-400 font-mono">
              ({operations.occupiedBeds}/{operations.totalBeds} Beds)
            </span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 mt-3 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"
              style={{ width: `${operations.systemOccupancyPct}%` }}
            />
          </div>
        </GlassCard>

        <GlassCard className="p-5" borderBeam={false}>
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Average ED Wait Time</span>
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Clock size={18} />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mt-4">
            <span className="text-4xl font-bold text-white font-display tracking-tight">
              {operations.averageTriageWaitMins}
            </span>
            <span className="text-xs text-amber-300 font-mono">Minutes (Door-to-Doctor)</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-3 flex items-center gap-1">
            <TrendingUp size={12} className="text-rose-400" /> +8 min vs morning baseline
          </p>
        </GlassCard>

        <GlassCard className="p-5" borderBeam={false}>
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Critical Alerts</span>
            <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
              <AlertTriangle size={18} />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mt-4">
            <span className="text-4xl font-bold text-rose-400 font-display tracking-tight">
              {operations.criticalAlertsCount}
            </span>
            <span className="text-xs text-rose-300/80 font-mono">Active Red Alerts</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-3">ICU threshold &amp; 3 STEMI activations</p>
        </GlassCard>

        <GlassCard className="p-5" borderBeam={false}>
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Ambulances En Route</span>
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <Ambulance size={18} />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mt-4">
            <span className="text-4xl font-bold text-white font-display tracking-tight">
              {operations.activeAmbulancesEnRoute}
            </span>
            <span className="text-xs text-cyan-300 font-mono">Inbound Units</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-3">Estimated arrival: 4m, 11m, 19m</p>
        </GlassCard>
      </div>

      {/* Main Operations Split: Departments & Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Department Capacity Grid & Flow Chart */}
        <div className="lg:col-span-2 space-y-8">
          {/* Department Capacity Tiles */}
          <GlassCard className="p-6" borderBeam={false}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-white font-display flex items-center gap-2">
                <Building2 size={18} className="text-purple-400" /> Inpatient Department Capacities
              </h3>
              <span className="text-xs text-slate-400 font-mono">Real-Time Bed Census</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {operations.departments.map((dept) => {
                const occupancyPct = Math.round((dept.currentPatients / dept.capacity) * 100)
                const isCritical = dept.status === "critical"
                const isWarning = dept.status === "warning"
                const isSelected = dept.id === selectedDeptId

                return (
                  <button
                    key={dept.id}
                    onClick={() => setSelectedDeptId(dept.id)}
                    className={`text-left p-4 rounded-2xl border transition-all duration-300 ${
                      isSelected
                        ? "bg-purple-600/20 border-purple-400 shadow-lg shadow-purple-500/10 scale-[1.02]"
                        : "bg-slate-900/40 border-white/5 hover:border-white/20 hover:bg-slate-800/30"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-sm font-bold text-white font-display">{dept.name}</span>
                      <span
                        className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded border ${
                          isCritical
                            ? "bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse"
                            : isWarning
                            ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                            : "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                        }`}
                      >
                        {dept.status}
                      </span>
                    </div>

                    <div className="flex items-baseline justify-between mt-3 mb-1.5">
                      <span className="text-2xl font-bold text-white font-display">{occupancyPct}%</span>
                      <span className="text-xs text-slate-400 font-mono">
                        {dept.currentPatients}/{dept.capacity} Beds
                      </span>
                    </div>

                    <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          isCritical
                            ? "bg-rose-500"
                            : isWarning
                            ? "bg-amber-500"
                            : "bg-emerald-500"
                        }`}
                        style={{ width: `${Math.min(occupancyPct, 100)}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 mt-3 pt-2 border-t border-white/5 font-mono">
                      <span>Wait: {dept.waitTimeMinutes}m</span>
                      <span>Staff: {dept.staffOnDuty} RNs</span>
                    </div>
                  </button>
                )
              })}
            </div>
          </GlassCard>

          {/* Hourly Influx & Wait Times Chart */}
          <GlassCard className="p-6" borderBeam={false}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-white font-display flex items-center gap-2">
                  <Activity size={18} className="text-cyan-400" /> 24-Hour Patient Influx vs. ED Wait Time
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Admissions volume correlated with emergency wait times</p>
              </div>
              <div className="flex items-center gap-4 text-xs font-mono">
                <span className="flex items-center gap-1.5 text-purple-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-500" /> Admissions
                </span>
                <span className="flex items-center gap-1.5 text-amber-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Wait (Mins)
                </span>
              </div>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={operations.hourlyTrends}>
                  <defs>
                    <linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="amberGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} />
                  <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(15, 23, 42, 0.9)",
                      border: "1px solid rgba(255, 255, 255, 0.15)",
                      borderRadius: "12px",
                      color: "#f8fafc",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="admissions"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#purpleGradient)"
                    name="Admissions"
                  />
                  <Area
                    type="monotone"
                    dataKey="edWait"
                    stroke="#f59e0b"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#amberGradient)"
                    name="ED Wait (Mins)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </div>

        {/* Right 1 Col: Groq AI Surge Advisory & Action Recommendations */}
        <div className="space-y-6">
          <GlassCard className="p-6" borderBeam={true}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white font-display flex items-center gap-2">
                <Sparkles size={16} className="text-purple-400" /> Groq AI Surge Advisory
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                LLaMA 3.3-70B
              </span>
            </div>

            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Automated operational triage models analyzing bed turnover, shift ratios, and historical surge patterns.
            </p>

            <div className="space-y-3.5">
              {insights.map((insight, idx) => {
                const isCrit = insight.severity === "critical"
                const isWarn = insight.severity === "warning"

                return (
                  <div
                    key={idx}
                    className={`p-4 rounded-2xl border transition-all ${
                      isCrit
                        ? "bg-rose-500/10 border-rose-500/30 text-rose-200"
                        : isWarn
                        ? "bg-amber-500/10 border-amber-500/30 text-amber-200"
                        : "bg-emerald-500/10 border-emerald-500/30 text-emerald-200"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1.5">
                      <span className="text-xs font-bold font-display uppercase tracking-wide">
                        {insight.title}
                      </span>
                      <span className="text-[10px] font-mono opacity-80">{insight.department}</span>
                    </div>

                    <div className="text-xs font-mono font-bold mb-2">
                      Metric: {insight.metric}
                    </div>

                    <p className="text-xs leading-relaxed text-slate-300 border-t border-white/10 pt-2">
                      <strong className="text-white">Action:</strong> {insight.recommendation}
                    </p>
                  </div>
                )
              })}
            </div>
          </GlassCard>

          {/* Quick Incident Action Panel */}
          <GlassCard className="p-6" borderBeam={false}>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 font-display">
              Command Actions
            </h4>
            <div className="space-y-2.5">
              <button
                onClick={() => alert("Simulated: Ambulance Diversion protocol broadcasted to County Dispatch.")}
                className="w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-rose-500/20 hover:border-rose-500/40 border border-white/10 text-xs font-bold text-slate-300 hover:text-rose-200 transition-all flex items-center justify-between"
              >
                <span>Declare Ambulance Diversion</span>
                <ShieldAlert size={14} />
              </button>
              <button
                onClick={() => alert("Simulated: Float nurse pool dispatched to Emergency Department.")}
                className="w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-purple-500/20 hover:border-purple-500/40 border border-white/10 text-xs font-bold text-slate-300 hover:text-purple-200 transition-all flex items-center justify-between"
              >
                <span>Dispatch Shift Float Pool (2 RNs)</span>
                <Users size={14} />
              </button>
              <button
                onClick={() => alert("Simulated: Discharge lounge opened with 6 observation reassignments.")}
                className="w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-emerald-500/20 hover:border-emerald-500/40 border border-white/10 text-xs font-bold text-slate-300 hover:text-emerald-200 transition-all flex items-center justify-between"
              >
                <span>Open Discharge Lounge</span>
                <CheckCircle size={14} />
              </button>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  )
}

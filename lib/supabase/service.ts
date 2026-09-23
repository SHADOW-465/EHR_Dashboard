import { createClient, isSupabaseConfigured } from "./client"
import { SAMPLE_PATIENTS, PatientReportData } from "@/lib/data/sample-patients"
import { INITIAL_HOSPITAL_OPERATIONS, OperationalSummary } from "@/lib/data/hospital-metrics"

export async function fetchAllPatients(): Promise<PatientReportData[]> {
  if (!isSupabaseConfigured()) {
    return SAMPLE_PATIENTS
  }

  try {
    const supabase = createClient()
    if (!supabase) return SAMPLE_PATIENTS

    // Query patients with records and ai_analyses
    const { data: patients, error } = await supabase
      .from("patients")
      .select(`
        id,
        name,
        dob,
        mrn,
        gender,
        allergies,
        medical_records (
          id,
          record_date,
          raw_text,
          annotated_html,
          record_type,
          target_anatomy,
          ai_analyses (
            id,
            summary_points,
            predictions,
            risk_level,
            critical_alerts,
            precautions
          )
        )
      `)
      .order("created_at", { ascending: false })

    if (error || !patients || patients.length === 0) {
      console.warn("Supabase query returned no patients or failed, using sample patients:", error)
      return SAMPLE_PATIENTS
    }

    // Map Supabase rows to PatientReportData
    return patients.map((p: any) => {
      const record = p.medical_records?.[0]
      const analysis = record?.ai_analyses?.[0]

      return {
        id: p.id,
        metadata: {
          name: p.name,
          dob: p.dob,
          mrn: p.mrn,
          date: record?.record_date || new Date().toISOString().split("T")[0],
          gender: p.gender || "Not specified",
          allergies: p.allergies || [],
          triageCategory: (analysis?.risk_level === "Critical" ? "Immediate (Red)" : "Urgent (Orange)") as any,
        },
        targetAnatomy: (record?.target_anatomy || "abdomen") as any,
        vitals: {
          hr: 100,
          bp: "120/80",
          temp: "37.5°C",
          spo2: "97%",
        },
        annotatedHtml: record?.annotated_html || "<p>No report available</p>",
        summaryPoints: analysis?.summary_points || [],
        predictions: analysis?.predictions || [],
        rawText: record?.raw_text || "",
      }
    })
  } catch (err) {
    console.error("Error connecting to Supabase, falling back to local dataset:", err)
    return SAMPLE_PATIENTS
  }
}

export async function savePatientReport(report: PatientReportData): Promise<boolean> {
  if (!isSupabaseConfigured()) {
    return false
  }

  try {
    const supabase = createClient()
    if (!supabase) return false

    // 1. Insert or update patient
    const { data: patient, error: pError } = await supabase
      .from("patients")
      .upsert({
        name: report.metadata.name,
        dob: report.metadata.dob,
        mrn: report.metadata.mrn,
        gender: report.metadata.gender || "Unknown",
        allergies: report.metadata.allergies || [],
      }, { onConflict: "mrn" })
      .select("id")
      .single()

    if (pError || !patient) {
      console.error("Error inserting patient to Supabase:", pError)
      return false
    }

    // 2. Insert medical record
    const { data: medRecord, error: rError } = await supabase
      .from("medical_records")
      .insert({
        patient_id: patient.id,
        raw_text: report.rawText,
        annotated_html: report.annotatedHtml,
        record_type: "Emergency Admission",
        target_anatomy: report.targetAnatomy,
      })
      .select("id")
      .single()

    if (rError || !medRecord) {
      console.error("Error inserting medical record to Supabase:", rError)
      return false
    }

    // 3. Insert AI analysis
    const { error: aError } = await supabase
      .from("ai_analyses")
      .insert({
        medical_record_id: medRecord.id,
        summary_points: report.summaryPoints,
        predictions: report.predictions,
        risk_level: report.summaryPoints.some(s => s.riskLevel === "High") ? "High" : "Medium",
        model_used: "llama-3.3-70b-versatile",
      })

    if (aError) {
      console.error("Error inserting AI analysis to Supabase:", aError)
      return false
    }

    return true
  } catch (err) {
    console.error("Failed to save patient report to Supabase:", err)
    return false
  }
}

export async function fetchHospitalOperations(): Promise<OperationalSummary> {
  if (!isSupabaseConfigured()) {
    return INITIAL_HOSPITAL_OPERATIONS
  }

  try {
    const supabase = createClient()
    if (!supabase) return INITIAL_HOSPITAL_OPERATIONS

    const { data: depts, error } = await supabase
      .from("department_occupancy")
      .select("*")

    if (error || !depts || depts.length === 0) {
      return INITIAL_HOSPITAL_OPERATIONS
    }

    let totalCapacity = 0
    let occupied = 0

    const mappedDepts = depts.map((d: any) => {
      totalCapacity += d.total_capacity || 0
      occupied += d.current_patients || 0

      return {
        id: d.id,
        name: d.department,
        currentPatients: d.current_patients,
        capacity: d.total_capacity,
        waitTimeMinutes: d.wait_time_minutes,
        staffOnDuty: d.staff_on_duty || 6,
        status: (d.status || "normal") as any,
        specialty: d.department + " Inpatient Care",
      }
    })

    return {
      ...INITIAL_HOSPITAL_OPERATIONS,
      departments: mappedDepts,
      totalBeds: totalCapacity || INITIAL_HOSPITAL_OPERATIONS.totalBeds,
      occupiedBeds: occupied || INITIAL_HOSPITAL_OPERATIONS.occupiedBeds,
      systemOccupancyPct: totalCapacity > 0 ? Math.round((occupied / totalCapacity) * 1000) / 10 : 85,
    }
  } catch (err) {
    console.error("Error fetching hospital operations from Supabase:", err)
    return INITIAL_HOSPITAL_OPERATIONS
  }
}

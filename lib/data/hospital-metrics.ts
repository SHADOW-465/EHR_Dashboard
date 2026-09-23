export interface DepartmentStatus {
  id: string
  name: string
  currentPatients: number
  capacity: number
  waitTimeMinutes: number
  staffOnDuty: number
  status: "normal" | "warning" | "critical"
  specialty: string
}

export interface HourlyTrend {
  time: string
  admissions: number
  discharges: number
  edWait: number
}

export interface OperationalSummary {
  departments: DepartmentStatus[]
  hourlyTrends: HourlyTrend[]
  totalBeds: number
  occupiedBeds: number
  systemOccupancyPct: number
  activeAmbulancesEnRoute: number
  averageTriageWaitMins: number
  criticalAlertsCount: number
}

export const INITIAL_HOSPITAL_OPERATIONS: OperationalSummary = {
  totalBeds: 176,
  occupiedBeds: 149,
  systemOccupancyPct: 84.6,
  activeAmbulancesEnRoute: 3,
  averageTriageWaitMins: 38,
  criticalAlertsCount: 4,
  departments: [
    {
      id: "dept-ed",
      name: "Emergency (ED)",
      currentPatients: 46,
      capacity: 50,
      waitTimeMinutes: 42,
      staffOnDuty: 14,
      status: "warning",
      specialty: "Level 1 Trauma & Triage",
    },
    {
      id: "dept-icu",
      name: "Intensive Care (ICU)",
      currentPatients: 19,
      capacity: 20,
      waitTimeMinutes: 10,
      staffOnDuty: 8,
      status: "critical",
      specialty: "Critical Care & Hemodynamics",
    },
    {
      id: "dept-cardio",
      name: "Cardiology / CCU",
      currentPatients: 28,
      capacity: 35,
      waitTimeMinutes: 25,
      staffOnDuty: 6,
      status: "normal",
      specialty: "Invasive & Non-Invasive Cardiac",
    },
    {
      id: "dept-surgery",
      name: "Surgery & Post-Op",
      currentPatients: 14,
      capacity: 16,
      waitTimeMinutes: 30,
      staffOnDuty: 9,
      status: "warning",
      specialty: "OR Suites & PACU Recovery",
    },
    {
      id: "dept-oncology",
      name: "Oncology Floor",
      currentPatients: 24,
      capacity: 30,
      waitTimeMinutes: 20,
      staffOnDuty: 5,
      status: "normal",
      specialty: "Medical & Radiation Oncology",
    },
    {
      id: "dept-pediatrics",
      name: "Pediatrics (Peds)",
      currentPatients: 18,
      capacity: 25,
      waitTimeMinutes: 15,
      staffOnDuty: 5,
      status: "normal",
      specialty: "General Inpatient Pediatrics",
    },
  ],
  hourlyTrends: [
    { time: "00:00", admissions: 4, discharges: 1, edWait: 22 },
    { time: "03:00", admissions: 3, discharges: 0, edWait: 18 },
    { time: "06:00", admissions: 6, discharges: 2, edWait: 28 },
    { time: "09:00", admissions: 14, discharges: 8, edWait: 45 },
    { time: "12:00", admissions: 16, discharges: 12, edWait: 52 },
    { time: "15:00", admissions: 13, discharges: 14, edWait: 48 },
    { time: "18:00", admissions: 15, discharges: 7, edWait: 56 },
    { time: "21:00", admissions: 11, discharges: 4, edWait: 42 },
    { time: "Now", admissions: 12, discharges: 5, edWait: 38 },
  ],
}

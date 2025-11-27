-- MediSum Medical Records Database Schema
-- Creates tables for patients, medical records, AI analyses, and hospital metrics

-- Patients table
CREATE TABLE IF NOT EXISTS patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  dob DATE NOT NULL,
  mrn TEXT UNIQUE NOT NULL,
  gender TEXT,
  blood_type TEXT,
  allergies TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Medical records table
CREATE TABLE IF NOT EXISTS medical_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  record_date DATE NOT NULL DEFAULT CURRENT_DATE,
  raw_text TEXT NOT NULL,
  annotated_html TEXT,
  record_type TEXT DEFAULT 'general',
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI analysis results table
CREATE TABLE IF NOT EXISTS ai_analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  medical_record_id UUID NOT NULL REFERENCES medical_records(id) ON DELETE CASCADE,
  summary_points JSONB NOT NULL DEFAULT '[]',
  predictions JSONB NOT NULL DEFAULT '[]',
  risk_level TEXT DEFAULT 'low',
  critical_alerts TEXT[],
  precautions TEXT[],
  model_used TEXT DEFAULT 'gemini-2.0-flash',
  processing_time_ms INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Hospital metrics table for dashboard
CREATE TABLE IF NOT EXISTS hospital_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_type TEXT NOT NULL,
  department TEXT,
  value NUMERIC NOT NULL,
  unit TEXT,
  recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Department occupancy table
CREATE TABLE IF NOT EXISTS department_occupancy (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  department TEXT NOT NULL,
  current_patients INTEGER DEFAULT 0,
  total_capacity INTEGER NOT NULL,
  wait_time_minutes INTEGER DEFAULT 0,
  recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_medical_records_patient ON medical_records(patient_id);
CREATE INDEX IF NOT EXISTS idx_ai_analyses_record ON ai_analyses(medical_record_id);
CREATE INDEX IF NOT EXISTS idx_hospital_metrics_type ON hospital_metrics(metric_type);
CREATE INDEX IF NOT EXISTS idx_hospital_metrics_recorded ON hospital_metrics(recorded_at);
CREATE INDEX IF NOT EXISTS idx_department_occupancy_dept ON department_occupancy(department);

-- Enable Row Level Security (RLS)
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE hospital_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE department_occupancy ENABLE ROW LEVEL SECURITY;

-- Public read policies for demo (in production, restrict to authenticated users)
CREATE POLICY "Allow public read on patients" ON patients FOR SELECT USING (true);
CREATE POLICY "Allow public insert on patients" ON patients FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on patients" ON patients FOR UPDATE USING (true);

CREATE POLICY "Allow public read on medical_records" ON medical_records FOR SELECT USING (true);
CREATE POLICY "Allow public insert on medical_records" ON medical_records FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on medical_records" ON medical_records FOR UPDATE USING (true);

CREATE POLICY "Allow public read on ai_analyses" ON ai_analyses FOR SELECT USING (true);
CREATE POLICY "Allow public insert on ai_analyses" ON ai_analyses FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read on hospital_metrics" ON hospital_metrics FOR SELECT USING (true);
CREATE POLICY "Allow public insert on hospital_metrics" ON hospital_metrics FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read on department_occupancy" ON department_occupancy FOR SELECT USING (true);
CREATE POLICY "Allow public insert on department_occupancy" ON department_occupancy FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on department_occupancy" ON department_occupancy FOR UPDATE USING (true);

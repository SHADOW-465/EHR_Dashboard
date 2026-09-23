-- ==============================================================================
-- MediSum AI - Complete Supabase Database Schema & Seed Data
-- Run this entire script in your Supabase Project -> SQL Editor -> Run
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PATIENTS TABLE
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

-- 2. MEDICAL RECORDS TABLE
CREATE TABLE IF NOT EXISTS medical_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  record_date DATE NOT NULL DEFAULT CURRENT_DATE,
  raw_text TEXT NOT NULL,
  annotated_html TEXT,
  record_type TEXT DEFAULT 'Emergency Admission',
  status TEXT DEFAULT 'analyzed',
  target_anatomy TEXT DEFAULT 'abdomen',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. AI ANALYSES TABLE
CREATE TABLE IF NOT EXISTS ai_analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  medical_record_id UUID NOT NULL REFERENCES medical_records(id) ON DELETE CASCADE,
  summary_points JSONB NOT NULL DEFAULT '[]',
  predictions JSONB NOT NULL DEFAULT '[]',
  risk_level TEXT DEFAULT 'High',
  critical_alerts TEXT[] DEFAULT ARRAY[]::TEXT[],
  precautions TEXT[] DEFAULT ARRAY[]::TEXT[],
  model_used TEXT DEFAULT 'llama-3.3-70b-versatile',
  processing_time_ms INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. HOSPITAL METRICS TABLE
CREATE TABLE IF NOT EXISTS hospital_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_type TEXT NOT NULL,
  department TEXT,
  value NUMERIC NOT NULL,
  unit TEXT,
  recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. DEPARTMENT OCCUPANCY TABLE
CREATE TABLE IF NOT EXISTS department_occupancy (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  department TEXT NOT NULL UNIQUE,
  current_patients INTEGER DEFAULT 0,
  total_capacity INTEGER NOT NULL,
  wait_time_minutes INTEGER DEFAULT 0,
  staff_on_duty INTEGER DEFAULT 10,
  status TEXT DEFAULT 'normal',
  recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- CREATE INDEXES
CREATE INDEX IF NOT EXISTS idx_medical_records_patient ON medical_records(patient_id);
CREATE INDEX IF NOT EXISTS idx_ai_analyses_record ON ai_analyses(medical_record_id);
CREATE INDEX IF NOT EXISTS idx_hospital_metrics_type ON hospital_metrics(metric_type);
CREATE INDEX IF NOT EXISTS idx_department_occupancy_dept ON department_occupancy(department);

-- ENABLE ROW LEVEL SECURITY
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE hospital_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE department_occupancy ENABLE ROW LEVEL SECURITY;

-- PUBLIC DEMO POLICIES (Read & Write permitted for the application demo)
DROP POLICY IF EXISTS "Allow public read on patients" ON patients;
CREATE POLICY "Allow public read on patients" ON patients FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow public insert on patients" ON patients;
CREATE POLICY "Allow public insert on patients" ON patients FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Allow public update on patients" ON patients;
CREATE POLICY "Allow public update on patients" ON patients FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Allow public read on medical_records" ON medical_records;
CREATE POLICY "Allow public read on medical_records" ON medical_records FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow public insert on medical_records" ON medical_records;
CREATE POLICY "Allow public insert on medical_records" ON medical_records FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Allow public update on medical_records" ON medical_records;
CREATE POLICY "Allow public update on medical_records" ON medical_records FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Allow public read on ai_analyses" ON ai_analyses;
CREATE POLICY "Allow public read on ai_analyses" ON ai_analyses FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow public insert on ai_analyses" ON ai_analyses;
CREATE POLICY "Allow public insert on ai_analyses" ON ai_analyses FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read on hospital_metrics" ON hospital_metrics;
CREATE POLICY "Allow public read on hospital_metrics" ON hospital_metrics FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow public insert on hospital_metrics" ON hospital_metrics;
CREATE POLICY "Allow public insert on hospital_metrics" ON hospital_metrics FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read on department_occupancy" ON department_occupancy;
CREATE POLICY "Allow public read on department_occupancy" ON department_occupancy FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow public insert on department_occupancy" ON department_occupancy;
CREATE POLICY "Allow public insert on department_occupancy" ON department_occupancy FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Allow public update on department_occupancy" ON department_occupancy;
CREATE POLICY "Allow public update on department_occupancy" ON department_occupancy FOR UPDATE USING (true);


-- ==============================================================================
-- SEED DATA: 4 DIVERSE CLINICAL EMERGENCY CASES
-- ==============================================================================

-- Case 1: Lakshun Balaji (Acute Appendicitis)
INSERT INTO patients (id, name, dob, mrn, gender, blood_type, allergies)
VALUES (
  '11111111-1111-1111-1111-111111111111',
  'Lakshun Balaji',
  '2005-10-19',
  'LB-52085',
  'Male',
  'O+',
  ARRAY['Penicillin']
) ON CONFLICT (mrn) DO UPDATE SET name = EXCLUDED.name;

INSERT INTO medical_records (id, patient_id, record_date, raw_text, annotated_html, record_type, target_anatomy)
VALUES (
  '22222222-2222-2222-2222-222222222221',
  '11111111-1111-1111-1111-111111111111',
  '2024-05-20',
  E'History of Present Illness: Mr. Balaji is a 19-year-old male presenting to the ED with acute right lower quadrant abdominal pain for 6 hours. Rates pain 9/10, associated with nausea and anorexia.\n\nPhysical Exam & Vitals: BP 130/85, HR 110, T 38.2C. Abdomen shows McBurney point tenderness and localized rebound tenderness.\n\nLabs & Imaging: WBC 16.5 with left shift. CT abdomen/pelvis confirms dilated appendix 1.1cm with periappendiceal fat stranding.\n\nPlan: Acute Appendicitis. NPO, IV fluids, Piperacillin-Tazobactam. General Surgery consult for urgent laparoscopic appendectomy.',
  E'<section id="hpi"><h3>History of Present Illness</h3><p>Mr. Balaji is a 19-year-old male presenting to the ED with a chief complaint of <span id="evidence_0" class="highlight-source">acute right lower quadrant pain</span>. Pain began approximately 6 hours ago. He rates pain 9/10. Reports associated nausea and anorexia. Past medical history is non-contributory.</p></section><section id="exam"><h3>Physical Exam & Vitals</h3><p>General: Patient appears uncomfortable, guarding abdomen.</p><p class="vitals-highlight">Vitals: <span id="evidence_1" class="highlight-source">BP 130/85 mmHg, HR 110 bpm, T 38.2C</span>.</p><p>Abd: <span id="evidence_2" class="highlight-source">Positive McBurney''s point tenderness. Rebound tenderness present.</span></p></section><section id="labs"><h3>Labs & Imaging</h3><p>CBC: <span id="evidence_3" class="highlight-source">WBC 16.5 (Elevated)</span> with left shift.</p><p>CT Abd/Pelvic: <span id="evidence_4" class="highlight-source">Dilated appendix (1.1cm) with surrounding fat stranding.</span></p></section><section id="plan"><h3>Assessment & Plan</h3><p><strong>Acute Appendicitis.</strong></p><ol><li><span id="evidence_5" class="highlight-source">NPO, IV Fluids, Piperacillin-Tazobactam.</span></li><li>Consult General Surgery for Laparoscopic Appendectomy.</li></ol></section>',
  'Emergency Admission',
  'abdomen'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO ai_analyses (id, medical_record_id, summary_points, predictions, risk_level, critical_alerts, precautions, model_used)
VALUES (
  '33333333-3333-3333-3333-333333333331',
  '22222222-2222-2222-2222-222222222221',
  '[
    {"id": "sum_0", "sourceId": "evidence_0", "category": "Diagnosis", "technical": "Acute RLQ Abdominal Pain.", "simple": "Sharp, sudden pain in the lower right abdomen.", "riskLevel": "High"},
    {"id": "sum_1", "sourceId": "evidence_1", "category": "Vitals", "technical": "Febrile (38.2C) and Tachycardic (110).", "simple": "Running a fever and heart is beating quickly.", "riskLevel": "Medium"},
    {"id": "sum_2", "sourceId": "evidence_3", "category": "Critical", "technical": "Leukocytosis (WBC 16.5).", "simple": "Elevated white blood cells indicating active acute infection.", "riskLevel": "High"},
    {"id": "sum_3", "sourceId": "evidence_5", "category": "Plan", "technical": "Antibiotics & Surgical Consult.", "simple": "Initiating intravenous antibiotics and preparing for surgery.", "riskLevel": "Medium"}
  ]'::jsonb,
  '[
    {"label": "Sepsis Risk", "value": 45, "unit": "%", "severity": "high", "details": "Elevated WBC (16.5) with systemic fever response"},
    {"label": "Surgery Prob.", "value": 98, "unit": "%", "severity": "high", "details": "CT scan confirms acute appendicitis dilation"}
  ]'::jsonb,
  'High',
  ARRAY['Leukocytosis with Left Shift', 'Surgical Abdomen Requiring Immediate NPO'],
  ARRAY['Keep NPO', 'Start IV Fluid Resuscitation', 'Pre-op Antibiotics Administered'],
  'llama-3.3-70b-versatile'
) ON CONFLICT (id) DO NOTHING;


-- Case 2: Elena Rostova (Acute STEMI - Cardiac)
INSERT INTO patients (id, name, dob, mrn, gender, blood_type, allergies)
VALUES (
  '11111111-1111-1111-1111-111111111112',
  'Elena Rostova',
  '1962-04-12',
  'ER-89412',
  'Female',
  'A+',
  ARRAY['Aspirin (Mild GI distress)', 'Iodinated Contrast (Pre-medicate)']
) ON CONFLICT (mrn) DO UPDATE SET name = EXCLUDED.name;

INSERT INTO medical_records (id, patient_id, record_date, raw_text, annotated_html, record_type, target_anatomy)
VALUES (
  '22222222-2222-2222-2222-222222222222',
  '11111111-1111-1111-1111-111111111112',
  '2024-05-20',
  E'History of Present Illness: Mrs. Rostova is a 62-year-old female presenting with crushing substernal chest pressure radiating to left jaw and diaphoresis for 90 minutes. History of hypertension and hyperlipidemia.\n\nPhysical Exam & Vitals: BP 168/98, HR 96, SpO2 94% on room air. Pale, cool clammy skin.\n\nLabs & Diagnostics: 12-lead ECG demonstrates 3.5mm ST-segment elevation in leads II, III, and aVF with reciprocal depressions in I and aVL. High-sensitivity Troponin I critically elevated at 4,820 ng/L.\n\nAssessment & Plan: Acute Inferior STEMI. Code STEMI activated. Aspirin 324mg chewed, Ticagrelor 180mg loading dose, Heparin bolus. Immediate transfer to Cardiac Catheterization Lab for primary PCI.',
  E'<section id="hpi"><h3>History of Present Illness</h3><p>Mrs. Rostova is a 62-year-old female presenting with <span id="evidence_0" class="highlight-source">crushing substernal chest pressure radiating to left jaw</span> and profuse diaphoresis for 90 minutes. Past medical history notable for hypertension.</p></section><section id="exam"><h3>Physical Exam & Vitals</h3><p>General: Diaphoretic, pale, distress from pain.</p><p class="vitals-highlight">Vitals: <span id="evidence_1" class="highlight-source">BP 168/98 mmHg, HR 96 bpm, SpO2 94% on room air</span>.</p></section><section id="labs"><h3>Diagnostics & Cardiac Biomarkers</h3><p>12-Lead ECG: <span id="evidence_2" class="highlight-source">3.5mm ST-segment elevation in leads II, III, and aVF</span> with reciprocal depressions.</p><p>Cardiac Markers: <span id="evidence_3" class="highlight-source">High-sensitivity Troponin I critically elevated at 4,820 ng/L</span>.</p></section><section id="plan"><h3>Assessment & Emergent Plan</h3><p><strong>Acute Inferior STEMI. Door-to-balloon target &lt; 90 min.</strong></p><ol><li><span id="evidence_4" class="highlight-source">Aspirin 324mg, Ticagrelor 180mg, IV Heparin bolus.</span></li><li><span id="evidence_5" class="highlight-source">Immediate transfer to Cardiac Catheterization Laboratory for Primary PCI.</span></li></ol></section>',
  'Emergency Cardiology',
  'heart'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO ai_analyses (id, medical_record_id, summary_points, predictions, risk_level, critical_alerts, precautions, model_used)
VALUES (
  '33333333-3333-3333-3333-333333333332',
  '22222222-2222-2222-2222-222222222222',
  '[
    {"id": "sum_0", "sourceId": "evidence_0", "category": "Critical", "technical": "Acute Coronary Syndrome / Substernal Pressure.", "simple": "Severe crushing chest pain spreading to jaw from blocked heart artery.", "riskLevel": "High"},
    {"id": "sum_1", "sourceId": "evidence_2", "category": "Diagnosis", "technical": "Inferior ST-Elevation Myocardial Infarction (STEMI).", "simple": "Heart attack confirmed by electrical heart tracing.", "riskLevel": "High"},
    {"id": "sum_2", "sourceId": "evidence_3", "category": "Critical", "technical": "Myocardial Necrosis Marker (Troponin 4,820 ng/L).", "simple": "High levels of heart muscle damage protein detected in blood.", "riskLevel": "High"},
    {"id": "sum_3", "sourceId": "evidence_5", "category": "Plan", "technical": "Immediate Cath Lab Primary Angioplasty (PCI).", "simple": "Rushing patient to stent lab to reopen blocked blood vessel.", "riskLevel": "High"}
  ]'::jsonb,
  '[
    {"label": "Cardiogenic Shock", "value": 38, "unit": "%", "severity": "high", "details": "Elevated due to extensive inferior wall territory at risk"},
    {"label": "Revascularization Success", "value": 94, "unit": "%", "severity": "low", "details": "High likelihood of vessel patency with rapid catheter intervention"}
  ]'::jsonb,
  'Critical',
  ARRAY['Code STEMI Activated', 'Critical Troponin Elevation (4820 ng/L)', 'Door-to-Balloon Timer Active'],
  ARRAY['Continuous 12-lead cardiac monitoring', 'Dual antiplatelet therapy loaded', 'Defibrillator pads placed'],
  'llama-3.3-70b-versatile'
) ON CONFLICT (id) DO NOTHING;


-- Case 3: Marcus Vance (Severe COPD Exacerbation - Respiratory)
INSERT INTO patients (id, name, dob, mrn, gender, blood_type, allergies)
VALUES (
  '11111111-1111-1111-1111-111111111113',
  'Marcus Vance',
  '1966-08-23',
  'MV-74301',
  'Male',
  'B-',
  ARRAY['None Known']
) ON CONFLICT (mrn) DO UPDATE SET name = EXCLUDED.name;

INSERT INTO medical_records (id, patient_id, record_date, raw_text, annotated_html, record_type, target_anatomy)
VALUES (
  '22222222-2222-2222-2222-222222222223',
  '11111111-1111-1111-1111-111111111113',
  '2024-05-20',
  E'History of Present Illness: Mr. Vance is a 58-year-old male with severe GOLD Stage 3 COPD presenting with marked dyspnea and productive green sputum for 3 days. Unable to complete full sentences.\n\nPhysical Exam & Vitals: BP 142/88, HR 118, RR 32, SpO2 84% on ambient air. Marked use of accessory sternocleidomastoid muscles, diffuse expiratory wheezes and decreased air movement bilaterally.\n\nArterial Blood Gas: pH 7.28, pCO2 68 mmHg (hypercapnia), pO2 54 mmHg, HCO3 31 mEq/L. Chest X-ray: Hyperinflated lungs with flattened diaphragms, no focal consolidation.\n\nAssessment & Plan: Acute COPD Exacerbation with Acute Hypercapnic Respiratory Failure. Initiate Non-Invasive Positive Pressure Ventilation (BiPAP: IPAP 12 / EPAP 5). Continuous nebulized Albuterol/Ipratropium, IV Methylprednisolone 125mg, Ceftriaxone + Azithromycin. Admit to Step-Down Respiratory ICU.',
  E'<section id="hpi"><h3>History of Present Illness</h3><p>Mr. Vance is a 58-year-old male with severe COPD presenting with <span id="evidence_0" class="highlight-source">severe dyspnea, wheezing, and inability to speak in sentences</span> for 3 days.</p></section><section id="exam"><h3>Physical Exam & Vitals</h3><p class="vitals-highlight">Vitals: <span id="evidence_1" class="highlight-source">HR 118 bpm, RR 32 breaths/min, SpO2 84% on ambient air</span>.</p><p>Pulmonary: <span id="evidence_2" class="highlight-source">Accessory muscle use with diffuse high-pitched expiratory wheezing</span>.</p></section><section id="labs"><h3>Arterial Blood Gas (ABG)</h3><p>Blood Gas: <span id="evidence_3" class="highlight-source">pH 7.28, pCO2 68 mmHg (Severe Hypercapnic Acidosis), pO2 54 mmHg</span>.</p></section><section id="plan"><h3>Respiratory Intervention & ICU Plan</h3><p><strong>Acute Hypercapnic Respiratory Failure secondary to COPD Exacerbation.</strong></p><ol><li><span id="evidence_4" class="highlight-source">Immediate BiPAP initiation (IPAP 12 / EPAP 5 cmH2O)</span> to blow off retained CO2.</li><li><span id="evidence_5" class="highlight-source">Nebulized Bronchodilators, IV Methylprednisolone 125mg, Ceftriaxone.</span></li><li>Admit to Pulmonary Step-Down Unit.</li></ol></section>',
  'Pulmonary / Critical Care',
  'lungs'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO ai_analyses (id, medical_record_id, summary_points, predictions, risk_level, critical_alerts, precautions, model_used)
VALUES (
  '33333333-3333-3333-3333-333333333333',
  '22222222-2222-2222-2222-222222222223',
  '[
    {"id": "sum_0", "sourceId": "evidence_0", "category": "Diagnosis", "technical": "Severe Acute COPD Exacerbation.", "simple": "Severe flare-up of lung disease causing dangerous shortness of breath.", "riskLevel": "High"},
    {"id": "sum_1", "sourceId": "evidence_1", "category": "Vitals", "technical": "Profound Hypoxemia (84%) & Tachypnea (32/min).", "simple": "Very low oxygen levels in the blood with rapid labored breathing.", "riskLevel": "High"},
    {"id": "sum_2", "sourceId": "evidence_3", "category": "Critical", "technical": "Acute Respiratory Acidosis (pCO2 68, pH 7.28).", "simple": "Lungs failing to expel carbon dioxide, making the blood acidic.", "riskLevel": "High"},
    {"id": "sum_3", "sourceId": "evidence_4", "category": "Plan", "technical": "Non-Invasive BiPAP Pressure Support.", "simple": "Biphasic oxygen mask machine to assist breathing and rest tired muscles.", "riskLevel": "Medium"}
  ]'::jsonb,
  '[
    {"label": "Intubation Risk", "value": 32, "unit": "%", "severity": "high", "details": "Risk of invasive mechanical ventilation if BiPAP fails to clear CO2"},
    {"label": "ICU Stay Prob.", "value": 85, "unit": "%", "severity": "high", "details": "Requires close arterial gas monitoring in intermediate care"}
  ]'::jsonb,
  'High',
  ARRAY['Severe Hypercapnic Acidosis (pCO2 68)', 'Refractory Hypoxemia (SpO2 84%)'],
  ARRAY['BiPAP continuous monitoring', 'Check repeat ABG in 60 minutes', 'Intubation kit at bedside'],
  'llama-3.3-70b-versatile'
) ON CONFLICT (id) DO NOTHING;


-- Case 4: Amina Chen (Acute Pyelonephritis & Sepsis Protocol)
INSERT INTO patients (id, name, dob, mrn, gender, blood_type, allergies)
VALUES (
  '11111111-1111-1111-1111-111111111114',
  'Amina Chen',
  '1995-11-04',
  'AC-31908',
  'Female',
  'AB+',
  ARRAY['Ciprofloxacin']
) ON CONFLICT (mrn) DO UPDATE SET name = EXCLUDED.name;

INSERT INTO medical_records (id, patient_id, record_date, raw_text, annotated_html, record_type, target_anatomy)
VALUES (
  '22222222-2222-2222-2222-222222222224',
  '11111111-1111-1111-1111-111111111114',
  '2024-05-20',
  E'History of Present Illness: Ms. Chen is a 29-year-old female presenting with high fevers, rigors, nausea, and severe right flank pain radiating to groin for 24 hours.\n\nPhysical Exam & Vitals: BP 98/58 (hypotension), HR 122 (tachycardia), T 39.4C (fever), RR 20. Significant right costovertebral angle (CVA) tenderness to percussion.\n\nLabs & Urinalysis: Urinalysis shows positive leukocyte esterase, nitrites, >100 WBC/hpf, bacteria. Blood Lactate elevated at 2.6 mmol/L. Serum Creatinine 1.4 mg/dL (baseline 0.7).\n\nAssessment & Plan: Acute Pyelonephritis complicated by Sepsis criteria (SIRS + source). Fluid resuscitation with 30 mL/kg Normal Saline bolus. Blood cultures x2, urine culture. IV Ceftriaxone 2g daily. Admit to Medical Floor under Sepsis Watch.',
  E'<section id="hpi"><h3>History of Present Illness</h3><p>Ms. Chen is a 29-year-old female presenting with <span id="evidence_0" class="highlight-source">high fevers (39.4C), shaking chills, and acute right flank pain</span> lasting 24 hours.</p></section><section id="exam"><h3>Physical Exam & Vitals</h3><p class="vitals-highlight">Vitals: <span id="evidence_1" class="highlight-source">BP 98/58 mmHg (borderline low), HR 122 bpm, T 39.4C</span>.</p><p>Abdomen/Back: <span id="evidence_2" class="highlight-source">Pronounced right Costovertebral Angle (CVA) tenderness</span>.</p></section><section id="labs"><h3>Labs & Sepsis Biomarkers</h3><p>Urinalysis: <span id="evidence_3" class="highlight-source">Pyuria with &gt;100 WBC/hpf, Nitrites positive, gross bacteriuria</span>.</p><p>Sepsis Markers: <span id="evidence_4" class="highlight-source">Blood Lactate 2.6 mmol/L, Serum Creatinine 1.4 mg/dL</span>.</p></section><section id="plan"><h3>Emergency Sepsis Protocol</h3><p><strong>Acute Uncomplicated Pyelonephritis with Sepsis Criteria.</strong></p><ol><li><span id="evidence_5" class="highlight-source">30 mL/kg IV Crystalloid fluid bolus, Blood Cultures x2.</span></li><li><span id="evidence_6" class="highlight-source">Broad-spectrum IV Ceftriaxone 2g STAT.</span></li><li>Inpatient admission with serial lactate surveillance.</li></ol></section>',
  'Infectious Disease',
  'abdomen'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO ai_analyses (id, medical_record_id, summary_points, predictions, risk_level, critical_alerts, precautions, model_used)
VALUES (
  '33333333-3333-3333-3333-333333333334',
  '22222222-2222-2222-2222-222222222224',
  '[
    {"id": "sum_0", "sourceId": "evidence_0", "category": "Diagnosis", "technical": "Acute Right Pyelonephritis.", "simple": "Severe kidney infection causing fever, back pain, and chills.", "riskLevel": "High"},
    {"id": "sum_1", "sourceId": "evidence_1", "category": "Vitals", "technical": "SIRS Tachycardia (122 bpm) & High Fever (39.4C).", "simple": "Very high fever and rapid heart rate fighting off infection.", "riskLevel": "Medium"},
    {"id": "sum_2", "sourceId": "evidence_4", "category": "Critical", "technical": "Elevated Lactate (2.6) & Prerenal AKI (Cr 1.4).", "simple": "Early signs of body-wide strain and mild kidney stress.", "riskLevel": "High"},
    {"id": "sum_3", "sourceId": "evidence_5", "category": "Plan", "technical": "IV Fluid Resuscitation & Ceftriaxone.", "simple": "Fast hydration drip and targeted intravenous antibiotics.", "riskLevel": "Medium"}
  ]'::jsonb,
  '[
    {"label": "Septic Shock Risk", "value": 28, "unit": "%", "severity": "high", "details": "Borderline blood pressure responding to 30mL/kg crystalloid"},
    {"label": "Recovery Rate", "value": 96, "unit": "%", "severity": "low", "details": "High antibiotic sensitivity expected with Ceftriaxone"}
  ]'::jsonb,
  'High',
  ARRAY['Sepsis Protocol Activated (Lactate 2.6)', 'Borderline Hypotension (BP 98/58)'],
  ARRAY['30 mL/kg fluid bolus', 'Serial lactate checks every 4h', 'Input/Output catheter monitoring'],
  'llama-3.3-70b-versatile'
) ON CONFLICT (id) DO NOTHING;


-- ==============================================================================
-- SEED DATA: LIVE DEPARTMENT OCCUPANCY & HOSPITAL METRICS
-- ==============================================================================

INSERT INTO department_occupancy (department, current_patients, total_capacity, wait_time_minutes, staff_on_duty, status)
VALUES
  ('Emergency', 46, 50, 42, 14, 'warning'),
  ('ICU', 19, 20, 10, 8, 'critical'),
  ('Cardiology', 28, 35, 25, 6, 'normal'),
  ('Oncology', 24, 30, 20, 5, 'normal'),
  ('Surgery', 14, 16, 30, 9, 'warning'),
  ('Pediatrics', 18, 25, 15, 5, 'normal')
ON CONFLICT (department) DO UPDATE SET
  current_patients = EXCLUDED.current_patients,
  total_capacity = EXCLUDED.total_capacity,
  wait_time_minutes = EXCLUDED.wait_time_minutes,
  status = EXCLUDED.status;

INSERT INTO hospital_metrics (metric_type, department, value, unit) VALUES
  ('hourly_admissions', 'Emergency', 12, 'patients/hr'),
  ('hourly_discharges', 'Hospital-wide', 8, 'patients/hr'),
  ('average_ed_wait', 'Emergency', 38, 'minutes'),
  ('bed_turnover_rate', 'Hospital-wide', 91.5, 'percent'),
  ('ambulance_diversion', 'Emergency', 0, 'status_code');

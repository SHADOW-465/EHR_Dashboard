-- Seed demo data for MediSum

-- Insert demo patient
INSERT INTO patients (id, name, dob, mrn, gender, blood_type, allergies)
VALUES (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'Lakshun Balaji',
  '2005-03-15',
  'LB-92085',
  'Male',
  'O+',
  ARRAY['Penicillin', 'Sulfa drugs']
) ON CONFLICT (mrn) DO NOTHING;

-- Insert demo medical record
INSERT INTO medical_records (id, patient_id, record_date, raw_text, annotated_html, record_type, status)
VALUES (
  'b2c3d4e5-f6a7-8901-bcde-f23456789012',
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  '2024-05-20',
  E'History of Present Illness\n\nMr. Balaji is a 19-year-old male presenting to the ED with a chief complaint of acute right lower quadrant pain. Pain began approximately 6 hours ago. He rates pain 9/10. Reports associated nausea and anorexia. Past medical history is non-contributory.\n\nPhysical Exam & Vitals\nGeneral: Patient appears uncomfortable, guarding abdomen.\nVitals: BP 130/85 mmHg, HR 110 bpm, T 38.2C.\nAbd: Positive McBurney''s point tenderness. Rebound tenderness present.\n\nLabs & Imaging\nCBC: WBC 16.5 (Elevated) with left shift.\nCT Abd/Pelvic: Dilated appendix (1.1cm) with surrounding fat stranding.\n\nAssessment & Plan\nAcute Appendicitis.\n1. NPO, IV Fluids, Piperacillin-Tazobactam.\n2. Consult General Surgery for Laparoscopic Appendectomy.',
  E'<section id="hpi"><h3>History of Present Illness</h3><p>Mr. Balaji is a 19-year-old male presenting to the ED with a chief complaint of <span id="evidence_0" class="highlight-source">acute right lower quadrant pain</span>. Pain began approximately 6 hours ago. He rates pain 9/10. Reports associated nausea and anorexia. Past medical history is non-contributory.</p></section><section id="exam"><h3>Physical Exam & Vitals</h3><p>General: Patient appears uncomfortable, guarding abdomen.</p><p class="vitals-highlight">Vitals: <span id="evidence_1" class="highlight-source">BP 130/85 mmHg, HR 110 bpm, T 38.2C</span>.</p><p>Abd: <span id="evidence_2" class="highlight-source">Positive McBurney''s point tenderness. Rebound tenderness present.</span></p></section><section id="labs"><h3>Labs & Imaging</h3><p>CBC: <span id="evidence_3" class="highlight-source">WBC 16.5 (Elevated)</span> with left shift.</p><p>CT Abd/Pelvic: <span id="evidence_4" class="highlight-source">Dilated appendix (1.1cm) with surrounding fat stranding.</span></p></section><section id="plan"><h3>Assessment & Plan</h3><p><strong>Acute Appendicitis.</strong></p><ol><li><span id="evidence_5" class="highlight-source">NPO, IV Fluids, Piperacillin-Tazobactam.</span></li><li>Consult General Surgery for Laparoscopic Appendectomy.</li></ol></section>',
  'emergency',
  'analyzed'
) ON CONFLICT DO NOTHING;

-- Insert AI analysis for the record
INSERT INTO ai_analyses (id, medical_record_id, summary_points, predictions, risk_level, critical_alerts, precautions)
VALUES (
  'c3d4e5f6-a7b8-9012-cdef-345678901234',
  'b2c3d4e5-f6a7-8901-bcde-f23456789012',
  '[
    {"id": "sum_0", "sourceId": "evidence_0", "category": "Diagnosis", "technical": "Acute RLQ Abdominal Pain.", "simple": "Sharp pain in the lower right belly area.", "riskLevel": "High"},
    {"id": "sum_1", "sourceId": "evidence_1", "category": "Vitals", "technical": "Febrile (38.2C) and Tachycardic (110).", "simple": "Has a fever and fast heartbeat.", "riskLevel": "Medium"},
    {"id": "sum_2", "sourceId": "evidence_3", "category": "Critical", "technical": "Leukocytosis (WBC 16.5).", "simple": "High white blood cell count, sign of infection.", "riskLevel": "High"},
    {"id": "sum_3", "sourceId": "evidence_5", "category": "Plan", "technical": "Antibiotics & Surgical Consult.", "simple": "Starting antibiotics and calling a surgeon.", "riskLevel": "Medium"}
  ]',
  '[
    {"label": "Sepsis Risk", "value": 45, "unit": "%", "severity": "high", "details": "Elevated due to WBC count & fever"},
    {"label": "Surgery Prob.", "value": 98, "unit": "%", "severity": "high", "details": "CT confirms appendicitis"}
  ]',
  'critical',
  ARRAY['Low Hemoglobin: Immediate Attention', 'Elevated WBC indicates infection'],
  ARRAY['NPO status - no food or drink', 'IV antibiotics initiated', 'Surgical team notified', 'Monitor for signs of perforation']
) ON CONFLICT DO NOTHING;

-- Insert sample hospital metrics
INSERT INTO hospital_metrics (metric_type, department, value, unit) VALUES
('wait_time', 'Emergency', 45, 'minutes'),
('wait_time', 'Cardiology', 30, 'minutes'),
('wait_time', 'Oncology', 25, 'minutes'),
('patient_count', 'Emergency', 42, 'patients'),
('patient_count', 'ICU', 18, 'patients'),
('bed_utilization', 'Emergency', 87, 'percent'),
('bed_utilization', 'ICU', 92, 'percent');

-- Insert department occupancy data
INSERT INTO department_occupancy (department, current_patients, total_capacity, wait_time_minutes) VALUES
('Emergency', 42, 50, 45),
('ICU', 18, 20, 15),
('Cardiology', 28, 35, 30),
('Oncology', 22, 30, 25),
('Pediatrics', 15, 25, 20),
('Surgery', 12, 15, 35);

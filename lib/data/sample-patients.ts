export interface SummaryPoint {
  id: string
  sourceId: string
  category: "Critical" | "Diagnosis" | "Vitals" | "Plan" | "Labs"
  technical: string
  simple: string
  riskLevel: "High" | "Medium" | "Low"
}

export interface Prediction {
  label: string
  value: number
  unit: string
  severity: "high" | "low"
  details: string
}

export interface PatientReportData {
  id: string
  metadata: {
    name: string
    dob: string
    mrn: string
    date: string
    gender?: string
    allergies?: string[]
    triageCategory: "Immediate (Red)" | "Urgent (Orange)" | "Delayed (Yellow)"
  }
  annotatedHtml: string
  summaryPoints: SummaryPoint[]
  predictions: Prediction[]
  rawText: string
  targetAnatomy: "abdomen" | "heart" | "lungs" | "brain" | "limbs" | "general"
  vitals: {
    hr: number
    bp: string
    temp: string
    spo2?: string
  }
}

export const SAMPLE_PATIENTS: PatientReportData[] = [
  {
    id: "case-appendicitis",
    metadata: {
      name: "Lakshun Balaji",
      dob: "2005-10-19",
      mrn: "LB-52085",
      date: "2024-05-20",
      gender: "Male (19y)",
      allergies: ["Penicillin"],
      triageCategory: "Urgent (Orange)",
    },
    targetAnatomy: "abdomen",
    vitals: {
      hr: 110,
      bp: "130/85",
      temp: "38.2°C",
      spo2: "98%",
    },
    annotatedHtml: `
      <section id="hpi">
        <h3>History of Present Illness</h3>
        <p>Mr. Balaji is a 19-year-old male presenting to the Emergency Department with a chief complaint of <span id="evidence_0" class="highlight-source">acute right lower quadrant pain</span>. Pain began approximately 6 hours ago, progressing rapidly. He rates severity as 9/10, exacerbated by ambulation. Accompanied by anorexia, low-grade nausea, and one episode of non-bilious emesis.</p>
      </section>
      <section id="exam">
        <h3>Physical Exam & Vitals</h3>
        <p>General: Acute distress, lying still with knees flexed to mitigate peritoneal tension.</p>
        <p class="vitals-highlight">Vitals: <span id="evidence_1" class="highlight-source">BP 130/85 mmHg, HR 110 bpm (sinus tachycardia), Temp 38.2°C (febrile)</span>, RR 18.</p>
        <p>Abdominal: <span id="evidence_2" class="highlight-source">Marked tenderness at McBurney's point. Distinct localized rebound tenderness and voluntary guarding</span> in RLQ. Rovsing sign positive.</p>
      </section>
      <section id="labs">
        <h3>Labs & Diagnostic Imaging</h3>
        <p>CBC: <span id="evidence_3" class="highlight-source">WBC 16.5 x10^3/uL (Leukocytosis) with 84% neutrophils (left shift)</span>. CRP elevated at 48 mg/L.</p>
        <p>CT Abdomen/Pelvis with IV Contrast: <span id="evidence_4" class="highlight-source">Blind-ending aperistaltic dilated appendix measuring 1.1 cm with hyperenhancement and surrounding mesenteric fat stranding</span>. No free air or localized abscess.</p>
      </section>
      <section id="plan">
        <h3>Clinical Impression & Surgical Plan</h3>
        <p><strong>Acute Uncomplicated Appendicitis.</strong></p>
        <ol>
          <li><span id="evidence_5" class="highlight-source">Maintain strict NPO, aggressive IV crystalloid hydration (Lactated Ringer's), and IV Piperacillin-Tazobactam</span>.</li>
          <li>Urgent General Surgery consultation for laparoscopic appendectomy within 6-hour window.</li>
        </ol>
      </section>
    `,
    summaryPoints: [
      {
        id: "sum_0",
        sourceId: "evidence_0",
        category: "Diagnosis",
        technical: "Acute RLQ Peritoneal Signs & Appendiceal Pain.",
        simple: "Sharp, rapidly worsening pain in the lower right belly caused by appendix swelling.",
        riskLevel: "High",
      },
      {
        id: "sum_1",
        sourceId: "evidence_1",
        category: "Vitals",
        technical: "SIRS Criteria Met: Tachycardia (110) and Fever (38.2°C).",
        simple: "Body shows signs of active inflammation with a fever and elevated heart rate.",
        riskLevel: "Medium",
      },
      {
        id: "sum_2",
        sourceId: "evidence_3",
        category: "Critical",
        technical: "Marked Leukocytosis with Left Shift (WBC 16.5).",
        simple: "High infection-fighting white blood cells in blood test confirm acute infection.",
        riskLevel: "High",
      },
      {
        id: "sum_3",
        sourceId: "evidence_4",
        category: "Labs",
        technical: "CT Evidence of Appendiceal Dilation (11mm) & Fat Stranding.",
        simple: "CAT scan physically confirms the swollen appendix is inflamed and enlarged.",
        riskLevel: "High",
      },
      {
        id: "sum_4",
        sourceId: "evidence_5",
        category: "Plan",
        technical: "NPO Status, IV Broad-Spectrum Antibiotics & Urgent Laparoscopic Appendectomy.",
        simple: "No eating/drinking, starting IV antibiotics, and preparing for keyhole surgery to remove the appendix.",
        riskLevel: "Medium",
      },
    ],
    predictions: [
      { label: "Sepsis Risk", value: 42, unit: "%", severity: "high", details: "Elevated due to WBC 16.5, fever 38.2°C, and delayed presentation" },
      { label: "Surgery Prob.", value: 99, unit: "%", severity: "high", details: "Confirmed acute appendiceal enlargement on contrast CT" },
      { label: "Perforation Risk", value: 18, unit: "%", severity: "low", details: "No free air or abscess seen on scan; operative window intact" },
    ],
    rawText: `History of Present Illness: Mr. Balaji is a 19-year-old male presenting to the ED with a chief complaint of acute right lower quadrant pain. Pain began approximately 6 hours ago. He rates pain 9/10. Reports associated nausea and anorexia. Past medical history is non-contributory.

Physical Exam & Vitals: General: Patient appears uncomfortable, guarding abdomen. Vitals: BP 130/85 mmHg, HR 110 bpm, T 38.2C. Abd: Positive McBurney's point tenderness. Rebound tenderness present.

Labs & Imaging: CBC: WBC 16.5 (Elevated) with left shift. CT Abd/Pelvic: Dilated appendix (1.1cm) with surrounding fat stranding.

Assessment & Plan: Acute Appendicitis. 1. NPO, IV Fluids, Piperacillin-Tazobactam. 2. Consult General Surgery for Laparoscopic Appendectomy.`,
  },
  {
    id: "case-stemi",
    metadata: {
      name: "Elena Rostova",
      dob: "1962-04-12",
      mrn: "ER-89412",
      date: "2024-05-20",
      gender: "Female (62y)",
      allergies: ["Aspirin (Mild GI)", "Iodinated Contrast (Pre-treat)"],
      triageCategory: "Immediate (Red)",
    },
    targetAnatomy: "heart",
    vitals: {
      hr: 96,
      bp: "168/98",
      temp: "36.8°C",
      spo2: "94%",
    },
    annotatedHtml: `
      <section id="hpi">
        <h3>History of Present Illness</h3>
        <p>Mrs. Rostova is a 62-year-old female presenting with <span id="evidence_0" class="highlight-source">sudden onset crushing substernal chest pressure radiating to the left jaw and shoulder</span> lasting 75 minutes. Associated with profuse diaphoresis, lightheadedness, and shortness of breath. No prior cardiac history; past history of treated hypertension.</p>
      </section>
      <section id="exam">
        <h3>Physical Exam & Vitals</h3>
        <p>General: Diaphoretic, pale, anxious, clutching chest in severe distress.</p>
        <p class="vitals-highlight">Vitals: <span id="evidence_1" class="highlight-source">BP 168/98 mmHg, HR 96 bpm, SpO2 94% on ambient air</span>, RR 22.</p>
        <p>Cardiovascular: Regular rate, S1/S2 present, no murmurs. JVP flat.</p>
      </section>
      <section id="labs">
        <h3>Emergency Diagnostics & Cardiac Biomarkers</h3>
        <p>12-Lead ECG: <span id="evidence_2" class="highlight-source">3.5 mm ST-segment elevation in leads II, III, and aVF with reciprocal ST depressions in I and aVL</span>. Diagnostic for acute inferior STEMI.</p>
        <p>Cardiac Biomarkers: <span id="evidence_3" class="highlight-source">High-Sensitivity Troponin I critically elevated at 4,820 ng/L</span> (Ref &lt; 14 ng/L). Bedside ECHO confirms inferior wall hypokinesis.</p>
      </section>
      <section id="plan">
        <h3>Immediate Assessment & Cath Lab Activation</h3>
        <p><strong>Code STEMI - Acute Inferior ST-Elevation Myocardial Infarction.</strong></p>
        <ol>
          <li><span id="evidence_4" class="highlight-source">Chewed Aspirin 324 mg, Ticagrelor 180 mg loading dose, and IV unfractionated Heparin 5000 unit bolus</span> administered STAT.</li>
          <li><span id="evidence_5" class="highlight-source">Immediate emergency transfer to Cardiac Catheterization Laboratory for Primary Percutaneous Coronary Intervention (PCI)</span> with door-to-balloon target &lt; 60 minutes.</li>
        </ol>
      </section>
    `,
    summaryPoints: [
      {
        id: "sum_0",
        sourceId: "evidence_0",
        category: "Critical",
        technical: "Acute Coronary Syndrome with Radiation to Left Jaw & Diaphoresis.",
        simple: "Crushing chest pain spreading to neck and arm caused by blocked blood flow to the heart muscle.",
        riskLevel: "High",
      },
      {
        id: "sum_1",
        sourceId: "evidence_2",
        category: "Diagnosis",
        technical: "Inferior ST-Segment Elevation Myocardial Infarction (STEMI).",
        simple: "Heart tracing confirms an active, life-threatening heart attack occurring right now.",
        riskLevel: "High",
      },
      {
        id: "sum_2",
        sourceId: "evidence_3",
        category: "Critical",
        technical: "Profound High-Sensitivity Troponin I Elevation (4,820 ng/L).",
        simple: "Heart muscle injury proteins are critically high, confirming oxygen deprivation to the heart wall.",
        riskLevel: "High",
      },
      {
        id: "sum_3",
        sourceId: "evidence_4",
        category: "Plan",
        technical: "Dual Antiplatelet Therapy (DAPT) & Heparin Anticoagulation.",
        simple: "Given emergency blood-thinning medicines to stop further clot formation.",
        riskLevel: "Medium",
      },
      {
        id: "sum_4",
        sourceId: "evidence_5",
        category: "Plan",
        technical: "Urgent Primary PCI / Angioplasty (Door-to-Balloon &lt; 60 min).",
        simple: "Transferring immediately to the catheter lab to reopen the blocked artery with a stent.",
        riskLevel: "High",
      },
    ],
    predictions: [
      { label: "Cardiogenic Shock", value: 38, unit: "%", severity: "high", details: "Extensive inferior territory risk with right ventricular involvement watch" },
      { label: "Vessel Patency", value: 95, unit: "%", severity: "low", details: "High likelihood of successful revascularization if balloon time &lt; 60m" },
      { label: "Arrhythmia Risk", value: 45, unit: "%", severity: "high", details: "Monitor for AV block or bradycardia common in inferior infarction" },
    ],
    rawText: `History of Present Illness: Mrs. Rostova is a 62-year-old female presenting with crushing substernal chest pressure radiating to left jaw and diaphoresis for 75 minutes. History of hypertension.

Physical Exam & Vitals: Diaphoretic, pale, acute distress. Vitals: BP 168/98 mmHg, HR 96 bpm, SpO2 94% on room air.

Diagnostics & Biomarkers: 12-lead ECG shows 3.5mm ST-segment elevation in leads II, III, and aVF with reciprocal depressions. High-sensitivity Troponin I critically elevated at 4,820 ng/L.

Assessment & Plan: Acute Inferior STEMI. Code STEMI activated. Aspirin 324mg, Ticagrelor 180mg, IV Heparin bolus. Immediate transfer to Cardiac Catheterization Lab for primary PCI.`,
  },
  {
    id: "case-copd",
    metadata: {
      name: "Marcus Vance",
      dob: "1966-08-23",
      mrn: "MV-74301",
      date: "2024-05-20",
      gender: "Male (58y)",
      allergies: ["None Known"],
      triageCategory: "Immediate (Red)",
    },
    targetAnatomy: "lungs",
    vitals: {
      hr: 118,
      bp: "144/90",
      temp: "37.4°C",
      spo2: "84%",
    },
    annotatedHtml: `
      <section id="hpi">
        <h3>History of Present Illness</h3>
        <p>Mr. Vance is a 58-year-old male with severe GOLD Stage 3 Chronic Obstructive Pulmonary Disease presenting with <span id="evidence_0" class="highlight-source">acute, severe shortness of breath, inability to speak in full sentences, and purulent greenish sputum production</span> for the past 72 hours.</p>
      </section>
      <section id="exam">
        <h3>Physical Exam & Vitals</h3>
        <p>General: Tripod positioning, marked diaphoresis, audible expiratory wheezing.</p>
        <p class="vitals-highlight">Vitals: <span id="evidence_1" class="highlight-source">HR 118 bpm, RR 32 breaths/min, SpO2 84% on ambient room air</span>, BP 144/90 mmHg.</p>
        <p>Pulmonary: <span id="evidence_2" class="highlight-source">Marked intercostal retractions, sternocleidomastoid muscle recruitment, diffuse bilateral wheezing</span> with prolonged expiratory phase.</p>
      </section>
      <section id="labs">
        <h3>Arterial Blood Gas & Imaging</h3>
        <p>Arterial Blood Gas (ABG): <span id="evidence_3" class="highlight-source">pH 7.27, pCO2 70 mmHg (severe hypercapnia), pO2 53 mmHg, HCO3 32 mEq/L</span>. Consistent with acute-on-chronic hypercapnic respiratory acidosis.</p>
        <p>Chest Radiograph: Hyperinflated lung fields, flattened diaphragms, no discrete focal lobar consolidation or pneumothorax.</p>
      </section>
      <section id="plan">
        <h3>Emergency Respiratory Interventions</h3>
        <p><strong>Acute Hypercapnic Respiratory Failure secondary to Severe COPD Exacerbation.</strong></p>
        <ol>
          <li><span id="evidence_4" class="highlight-source">Immediate initiation of Non-Invasive Positive Pressure Ventilation (BiPAP) with IPAP 12 cmH2O / EPAP 5 cmH2O</span> targeting SpO2 88-92%.</li>
          <li><span id="evidence_5" class="highlight-source">Continuous nebulized Albuterol/Ipratropium, IV Methylprednisolone 125 mg, and IV Ceftriaxone + Azithromycin</span>.</li>
          <li>Transfer to Medical Intensive Care Unit (MICU) for close serial arterial blood gas surveillance.</li>
        </ol>
      </section>
    `,
    summaryPoints: [
      {
        id: "sum_0",
        sourceId: "evidence_0",
        category: "Diagnosis",
        technical: "Severe Acute Exacerbation of COPD (AECOPD).",
        simple: "Major sudden flare-up of lung disease making it exhausting and difficult to breathe.",
        riskLevel: "High",
      },
      {
        id: "sum_1",
        sourceId: "evidence_1",
        category: "Vitals",
        technical: "Severe Hypoxemia (84% RA) & Marked Tachypnea (32 bpm).",
        simple: "Blood oxygen is dangerously low and breathing rate is over twice normal speed.",
        riskLevel: "High",
      },
      {
        id: "sum_2",
        sourceId: "evidence_3",
        category: "Critical",
        technical: "Acute-on-Chronic Hypercapnic Acidosis (pH 7.27, pCO2 70 mmHg).",
        simple: "Lungs are exhausted and trapping carbon dioxide gas, poisoning the blood with acid.",
        riskLevel: "High",
      },
      {
        id: "sum_3",
        sourceId: "evidence_4",
        category: "Plan",
        technical: "Emergency Non-Invasive BiPAP Pressure Support.",
        simple: "Placed on an airtight breathing machine to push oxygen in and clear out trapped carbon dioxide.",
        riskLevel: "High",
      },
      {
        id: "sum_4",
        sourceId: "evidence_5",
        category: "Plan",
        technical: "IV Corticosteroids, Dual Bronchodilators & Broad Antibiotics.",
        simple: "Given powerful anti-swelling steroids, airway opening breathing mists, and lung antibiotics.",
        riskLevel: "Medium",
      },
    ],
    predictions: [
      { label: "Intubation Risk", value: 34, unit: "%", severity: "high", details: "Requires mechanical ventilator tube if BiPAP fails to normalize pH within 2 hours" },
      { label: "ICU Admission", value: 92, unit: "%", severity: "high", details: "Requires continuous respiratory therapy and blood gas monitoring" },
      { label: "BiPAP Response", value: 78, unit: "%", severity: "low", details: "High likelihood of CO2 washout with prompt non-invasive ventilation" },
    ],
    rawText: `History of Present Illness: Mr. Vance is a 58-year-old male with severe GOLD 3 COPD presenting with acute dyspnea, inability to speak in sentences, and purulent sputum for 3 days.

Physical Exam & Vitals: Tripod positioning, wheezing. Vitals: HR 118 bpm, RR 32, SpO2 84% on room air, BP 144/90. Exam: Intercostal retractions, diffuse wheezes.

Arterial Blood Gas: pH 7.27, pCO2 70 mmHg, pO2 53 mmHg. Chest X-ray: Hyperinflation without focal infiltrate.

Assessment & Plan: Acute Hypercapnic Respiratory Failure secondary to COPD Exacerbation. 1. Immediate BiPAP (IPAP 12 / EPAP 5). 2. Nebulized Albuterol/Ipratropium, IV Methylprednisolone 125mg, Ceftriaxone. 3. Transfer to MICU.`,
  },
  {
    id: "case-sepsis",
    metadata: {
      name: "Amina Chen",
      dob: "1995-11-04",
      mrn: "AC-31908",
      date: "2024-05-20",
      gender: "Female (29y)",
      allergies: ["Ciprofloxacin (Tendonitis)"],
      triageCategory: "Urgent (Orange)",
    },
    targetAnatomy: "abdomen",
    vitals: {
      hr: 124,
      bp: "96/56",
      temp: "39.5°C",
      spo2: "97%",
    },
    annotatedHtml: `
      <section id="hpi">
        <h3>History of Present Illness</h3>
        <p>Ms. Chen is a 29-year-old female presenting with <span id="evidence_0" class="highlight-source">acute high spiking fevers (39.5°C), rigors, nausea, and severe right flank pain</span> radiating into the groin over 24 hours.</p>
      </section>
      <section id="exam">
        <h3>Physical Exam & Vitals</h3>
        <p>General: Flushed, rigors present, ill-appearing but oriented x4.</p>
        <p class="vitals-highlight">Vitals: <span id="evidence_1" class="highlight-source">BP 96/56 mmHg (borderline hypotension), HR 124 bpm (tachycardia), Temp 39.5°C</span>, RR 20.</p>
        <p>Back/Abdomen: <span id="evidence_2" class="highlight-source">Exquisite right costovertebral angle (CVA) punch tenderness</span>. Soft, non-distended abdomen without peritonitis.</p>
      </section>
      <section id="labs">
        <h3>Labs, Urinalysis & Sepsis Workup</h3>
        <p>Urinalysis: <span id="evidence_3" class="highlight-source">Cloudy, leukocyte esterase 3+, nitrites positive, &gt;100 WBC/hpf, gross bacteriuria</span>.</p>
        <p>Sepsis Biomarkers: <span id="evidence_4" class="highlight-source">Serum Lactate 2.8 mmol/L (elevated), WBC 18.2 with bandemia, Creatinine 1.4 mg/dL</span> (baseline 0.7 mg/dL indicating prerenal AKI).</p>
      </section>
      <section id="plan">
        <h3>Emergency Sepsis Resuscitation Plan</h3>
        <p><strong>Acute Right Pyelonephritis with Sepsis Criteria (SIRS + infectious source + elevated lactate).</strong></p>
        <ol>
          <li><span id="evidence_5" class="highlight-source">30 mL/kg IV Crystalloid fluid bolus (2 liters Plasmalyte)</span> for intravascular volume resuscitation.</li>
          <li><span id="evidence_6" class="highlight-source">Blood cultures x2 and urine culture STAT; start IV Ceftriaxone 2g daily</span> within 1 hour of ED arrival.</li>
          <li>Inpatient admission with serial lactate and urinary output monitoring.</li>
        </ol>
      </section>
    `,
    summaryPoints: [
      {
        id: "sum_0",
        sourceId: "evidence_0",
        category: "Diagnosis",
        technical: "Acute Pyelonephritis with Costovertebral Angle Tenderness.",
        simple: "Severe kidney infection causing high fever, chills, and sharp back and side pain.",
        riskLevel: "High",
      },
      {
        id: "sum_1",
        sourceId: "evidence_1",
        category: "Vitals",
        technical: "Severe Tachycardia (124 bpm) & Borderline Hypotension (96/56).",
        simple: "Low blood pressure and fast pulse showing the body is struggling against systemic infection.",
        riskLevel: "High",
      },
      {
        id: "sum_2",
        sourceId: "evidence_4",
        category: "Critical",
        technical: "Elevated L-Lactate (2.8 mmol/L) & Acute Kidney Injury (Cr 1.4).",
        simple: "Blood tests show tissue stress and temporary kidney strain from dehydration and infection.",
        riskLevel: "High",
      },
      {
        id: "sum_3",
        sourceId: "evidence_5",
        category: "Plan",
        technical: "Surviving Sepsis Campaign: 30 mL/kg Fluid Resuscitation Bolus.",
        simple: "Starting rapid IV fluid drips to restore healthy blood pressure and protect internal organs.",
        riskLevel: "Medium",
      },
      {
        id: "sum_4",
        sourceId: "evidence_6",
        category: "Plan",
        technical: "Empiric Broad-Spectrum IV Ceftriaxone within 1 Hour.",
        simple: "Giving heavy-duty vein-delivered antibiotics right away to wipe out the kidney bacteria.",
        riskLevel: "Medium",
      },
    ],
    predictions: [
      { label: "Septic Shock Risk", value: 26, unit: "%", severity: "high", details: "Dependent on blood pressure stabilization after 30mL/kg fluid bolus" },
      { label: "AKI Resolution", value: 94, unit: "%", severity: "low", details: "Prerenal azotemia expected to normalize with fluid hydration" },
      { label: "Hospital Stay", value: 72, unit: "hrs", severity: "low", details: "Anticipated 3-day course with step-down to oral antibiotics upon defervescence" },
    ],
    rawText: `History of Present Illness: Ms. Chen is a 29-year-old female presenting with high fevers (39.5C), rigors, nausea, and severe right flank pain for 24 hours.

Physical Exam & Vitals: BP 96/56, HR 124, T 39.5C. Exquisite right CVA tenderness.

Labs: Urinalysis: leukocyte esterase 3+, nitrites pos, >100 WBC. Blood Lactate 2.8 mmol/L, WBC 18.2, Creatinine 1.4.

Plan: Sepsis secondary to Pyelonephritis. 1. 30 mL/kg IV Crystalloid bolus. 2. Blood cultures, IV Ceftriaxone 2g STAT. 3. Inpatient admission under sepsis protocol.`,
  },
]

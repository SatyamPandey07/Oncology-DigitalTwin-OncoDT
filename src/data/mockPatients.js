export const MOCK_PATIENTS = [
  {
    id: 'PT-2024-00147',
    dob: '1974-03-15', // Matches age ~52
    name: 'Ananya Sharma',
    age: 52,
    gender: 'Female',
    bloodType: 'B+',
    heightCm: 162,
    weightKg: 58.5,
    bmi: 22.3,
    phone: '+91-98765-43210',
    emergencyContact: 'Rajiv Sharma (Spouse, +91-98765-43211)',
    
    // Diagnosis
    cancerType: 'Breast',
    subtype: 'Invasive Ductal Carcinoma (IDC)',
    stage: 'Stage III',
    grade: 'Grade 2 (Moderate)',
    primarySite: 'Left Breast, Upper Outer Quadrant',
    tumorInitialDiameterMm: 45.0,
    lymphNodeInvolvement: '1-3 nodes (pN1a)',
    metastasis: 'None',
    diagnosisDate: '2024-09-15',
    ecogStatus: 1,
    karnofskyScore: 80,

    // Biomarkers
    biomarkers: {
      HER2: 'Positive',
      ER_Status: 'Positive',
      PR_Status: 'Positive',
      BRCA_Mutation: 'Wild-Type',
      Ki67_Index: 45, // Proliferation rate in %
      PD_L1_Expression: 10, // %
      EGFR_Mutation: 'Wild-Type',
      ALK_Rearrangement: 'Wild-Type',
      KRAS_Mutation: 'Wild-Type',
      TP53_Mutation: 'Wild-Type',
      Microsatellite_Instability: 'MSS'
    },

    // Labs (Current)
    labs: {
      wbc: 6.8,
      rbc: 4.1,
      hemoglobin: 11.2, // Low
      hematocrit: 34.8, // Low
      platelets: 198,
      neutrophils: 62,
      alt: 42,
      ast: 38,
      bilirubin: 0.9,
      albumin: 3.8,
      creatinine: 0.9,
      bun: 15,
      egfr: 92,
      ca15_3: 48.2, // Elevated (Normal < 30)
      cea: 3.8,
      ca125: 22.1,
      ldh: 310 // Elevated (Normal < 280)
    },

    // Vitals (Current)
    vitals: {
      bloodPressure: '128/82',
      heartRate: 78,
      spo2: 97,
      temperatureF: 98.4,
      respiratoryRate: 16,
      painScore: 3
    },

    // Treatment History
    treatmentHistory: [
      {
        id: 'tx-001',
        type: 'Surgery',
        regimen: 'Left Modified Radical Mastectomy',
        startDate: '2024-10-02',
        endDate: '2024-10-02',
        cycles: '—',
        response: 'R0 Resection'
      },
      {
        id: 'tx-002',
        type: 'Chemotherapy',
        regimen: 'AC-T (Doxorubicin + Cyclophosphamide → Paclitaxel)',
        startDate: '2024-11-01',
        endDate: '2025-03-15',
        cycles: '8',
        response: 'Partial Response'
      },
      {
        id: 'tx-003',
        type: 'Targeted Therapy',
        regimen: 'Trastuzumab',
        startDate: '2025-01-10',
        endDate: 'Ongoing',
        cycles: '12/18',
        response: 'Stable Disease'
      },
      {
        id: 'tx-004',
        type: 'Radiation',
        regimen: 'EBRT 50Gy in 25 fractions',
        startDate: '2025-04-01',
        endDate: '2025-05-10',
        cycles: '25',
        response: 'Complete Response (Local control)'
      }
    ],

    // Imaging History
    imagingHistory: [
      {
        date: '2024-09-10',
        modality: 'Mammography',
        region: 'Bilateral Breast',
        findings: '4.5cm spicular mass in the left breast upper outer quadrant. BIRADS 5.'
      },
      {
        date: '2024-09-18',
        modality: 'MRI Breast',
        region: 'Left Breast',
        findings: 'Confirmed 4.5cm IDC, extension to pectoralis major fascia not observed. No contralateral malignancy.'
      },
      {
        date: '2024-12-15',
        modality: 'CT Chest/Abdomen',
        region: 'Thorax & Abdomen',
        findings: 'No evidence of distant visceral or nodal metastasis.'
      },
      {
        date: '2025-03-20',
        modality: 'PET-CT',
        region: 'Whole Body',
        findings: 'Metabolic partial response. SUVmax of primary tumor decreased from 3.2 to 1.8. No hypermetabolic distant lesions.'
      },
      {
        date: '2025-06-01',
        modality: 'CT Chest',
        region: 'Thorax',
        findings: 'Stable appearance of left chest wall surgical bed. No new nodules or consolidation.'
      }
    ]
  },
  {
    id: 'PT-2024-00289',
    dob: '1962-08-22', // Matches age ~64
    name: 'Rajesh Patel',
    age: 64,
    gender: 'Male',
    bloodType: 'O+',
    heightCm: 174,
    weightKg: 69.0,
    bmi: 22.8,
    phone: '+91-99887-76655',
    emergencyContact: 'Karan Patel (Son, +91-99887-76656)',
    
    // Diagnosis
    cancerType: 'Lung',
    subtype: 'Lung Adenocarcinoma',
    stage: 'Stage IV',
    grade: 'Grade 3 (High)',
    primarySite: 'Right Upper Lobe',
    tumorInitialDiameterMm: 55.0,
    lymphNodeInvolvement: 'Mediastinal (N2)',
    metastasis: 'Bone (L4 vertebra)',
    diagnosisDate: '2024-11-10',
    ecogStatus: 2,
    karnofskyScore: 70,

    // Biomarkers
    biomarkers: {
      HER2: 'Negative',
      ER_Status: 'Negative',
      PR_Status: 'Negative',
      BRCA_Mutation: 'Wild-Type',
      Ki67_Index: 65,
      PD_L1_Expression: 65, // PD-L1 High
      EGFR_Mutation: 'Detected', // EGFR Sensitive
      ALK_Rearrangement: 'Wild-Type',
      KRAS_Mutation: 'Wild-Type',
      TP53_Mutation: 'Detected',
      Microsatellite_Instability: 'MSS'
    },

    // Labs (Current)
    labs: {
      wbc: 9.2,
      rbc: 3.7, // Low
      hemoglobin: 10.5, // Low
      hematocrit: 32.1, // Low
      platelets: 245,
      neutrophils: 72, // Slightly high
      alt: 35,
      ast: 41, // Slightly high
      bilirubin: 0.8,
      albumin: 3.2, // Low
      creatinine: 1.1,
      bun: 18,
      egfr: 78,
      ca15_3: 15.4,
      cea: 14.2, // Elevated (Normal < 5)
      ca125: 18.2,
      ldh: 420 // Elevated (Normal < 280)
    },

    // Vitals (Current)
    vitals: {
      bloodPressure: '135/88',
      heartRate: 85,
      spo2: 95, // Borderline
      temperatureF: 99.1,
      respiratoryRate: 19,
      painScore: 5
    },

    // Treatment History
    treatmentHistory: [
      {
        id: 'tx-201',
        type: 'Systemic Therapy',
        regimen: 'Erlotinib (EGFR TKI)',
        startDate: '2024-12-01',
        endDate: 'Ongoing',
        cycles: '—',
        response: 'Good Partial Response'
      },
      {
        id: 'tx-202',
        type: 'Radiation',
        regimen: 'Palliative RT 30Gy (L4 bone lesion)',
        startDate: '2024-12-15',
        endDate: '2024-12-28',
        cycles: '10',
        response: 'Pain control achieved'
      }
    ],

    // Imaging History
    imagingHistory: [
      {
        date: '2024-11-05',
        modality: 'CT Chest/Abdomen',
        region: 'Chest',
        findings: '5.5cm mass in the right upper lobe with associated ipsilateral hilar and subcarinal lymphadenopathy.'
      },
      {
        date: '2024-11-12',
        modality: 'MRI Spine',
        region: 'Lumbar Spine',
        findings: 'Osteolytic lesion in the L4 vertebral body. Mild canal stenosis, no cord compression.'
      },
      {
        date: '2025-02-15',
        modality: 'CT Chest',
        region: 'Thorax',
        findings: 'Reduction in diameter of right upper lobe mass from 5.5cm to 3.2cm. Shrinkage of mediastinal nodes.'
      }
    ]
  },
  {
    id: 'PT-2024-00312',
    dob: '1981-05-10', // Matches age ~45
    name: 'Priya Nair',
    age: 45,
    gender: 'Female',
    bloodType: 'A-',
    heightCm: 160,
    weightKg: 52.0,
    bmi: 20.3,
    phone: '+91-91234-56789',
    emergencyContact: 'Vijay Nair (Spouse, +91-91234-56780)',
    
    // Diagnosis
    cancerType: 'Colorectal',
    subtype: 'Colon Adenocarcinoma',
    stage: 'Stage II',
    grade: 'Grade 1 (Well Differentiated)',
    primarySite: 'Sigmoid Colon',
    tumorInitialDiameterMm: 38.0,
    lymphNodeInvolvement: 'None (pN0)',
    metastasis: 'None',
    diagnosisDate: '2024-10-20',
    ecogStatus: 0,
    karnofskyScore: 90,

    // Biomarkers
    biomarkers: {
      HER2: 'Negative',
      ER_Status: 'Negative',
      PR_Status: 'Negative',
      BRCA_Mutation: 'Wild-Type',
      Ki67_Index: 25,
      PD_L1_Expression: 45,
      EGFR_Mutation: 'Wild-Type',
      ALK_Rearrangement: 'Wild-Type',
      KRAS_Mutation: 'Wild-Type', // KRAS Wild-type
      TP53_Mutation: 'Detected',
      Microsatellite_Instability: 'MSI-High' // Immunotherapy responsive
    },

    // Labs (Current)
    labs: {
      wbc: 5.4,
      rbc: 4.2,
      hemoglobin: 12.5,
      hematocrit: 38.2,
      platelets: 285,
      neutrophils: 55,
      alt: 28,
      ast: 24,
      bilirubin: 0.6,
      albumin: 4.1,
      creatinine: 0.7,
      bun: 12,
      egfr: 98,
      ca15_3: 12.1,
      cea: 6.5, // Elevated (Normal < 5)
      ca125: 14.5,
      ldh: 210
    },

    // Vitals (Current)
    vitals: {
      bloodPressure: '118/76',
      heartRate: 72,
      spo2: 99,
      temperatureF: 98.1,
      respiratoryRate: 14,
      painScore: 1
    },

    // Treatment History
    treatmentHistory: [
      {
        id: 'tx-301',
        type: 'Surgery',
        regimen: 'Laparoscopic Sigmoid Colectomy',
        startDate: '2024-11-15',
        endDate: '2024-11-15',
        cycles: '—',
        response: 'R0 Resection, margins clear, 18 lymph nodes negative.'
      },
      {
        id: 'tx-302',
        type: 'Adjuvant Chemotherapy',
        regimen: 'FOLFOX (5-FU + Leucovorin + Oxaliplatin)',
        startDate: '2024-12-20',
        endDate: '2025-05-15',
        cycles: '12',
        response: 'Completed, no evidence of disease recurrence'
      }
    ],

    // Imaging History
    imagingHistory: [
      {
        date: '2024-10-15',
        modality: 'Colonoscopy',
        region: 'Colon',
        findings: 'Obstructive ulcerative lesion in the sigmoid colon. Biopsy confirmed adenocarcinoma.'
      },
      {
        date: '2024-10-25',
        modality: 'CT Chest/Abdomen/Pelvis',
        region: 'Whole Body',
        findings: 'Sigmoid colon thickening. No regional or distant lymphadenopathy. No liver or lung lesions.'
      },
      {
        date: '2025-06-05',
        modality: 'CT Abdomen',
        region: 'Abdomen & Pelvis',
        findings: 'Post-surgical changes in sigmoid colon. No evidence of recurrence or metastasis.'
      }
    ]
  },
  {
    id: 'PT-2024-00451',
    dob: '1968-01-20', // Matches age ~58
    name: 'Meera Sen',
    age: 58,
    gender: 'Female',
    bloodType: 'AB+',
    heightCm: 158,
    weightKg: 64.0,
    bmi: 25.6,
    phone: '+91-95555-12345',
    emergencyContact: 'Arjun Sen (Son, +91-95555-12346)',
    
    // Diagnosis
    cancerType: 'Ovarian',
    subtype: 'High-Grade Serous Ovarian Carcinoma',
    stage: 'Stage III',
    grade: 'Grade 3 (High)',
    primarySite: 'Bilateral Ovaries',
    tumorInitialDiameterMm: 62.0,
    lymphNodeInvolvement: 'Omental & Pelvic nodes (N1)',
    metastasis: 'Peritoneal seeding',
    diagnosisDate: '2024-12-05',
    ecogStatus: 1,
    karnofskyScore: 80,

    // Biomarkers
    biomarkers: {
      HER2: 'Negative',
      ER_Status: 'Positive', // Estrogen positive (weak)
      PR_Status: 'Negative',
      BRCA_Mutation: 'Detected (BRCA1)', // BRCA1 Positive
      Ki67_Index: 55,
      PD_L1_Expression: 15,
      EGFR_Mutation: 'Wild-Type',
      ALK_Rearrangement: 'Wild-Type',
      KRAS_Mutation: 'Wild-Type',
      TP53_Mutation: 'Detected',
      Microsatellite_Instability: 'MSS'
    },

    // Labs (Current)
    labs: {
      wbc: 5.9,
      rbc: 3.9,
      hemoglobin: 10.9, // Low
      hematocrit: 33.5, // Low
      platelets: 185,
      neutrophils: 60,
      alt: 30,
      ast: 32,
      bilirubin: 0.7,
      albumin: 3.4, // Slightly low
      creatinine: 1.0,
      bun: 16,
      egfr: 82,
      ca15_3: 20.3,
      cea: 2.1,
      ca125: 185.0, // Highly Elevated (Normal < 35)
      ldh: 360 // Elevated
    },

    // Vitals (Current)
    vitals: {
      bloodPressure: '124/80',
      heartRate: 80,
      spo2: 98,
      temperatureF: 98.6,
      respiratoryRate: 16,
      painScore: 4
    },

    // Treatment History
    treatmentHistory: [
      {
        id: 'tx-401',
        type: 'Surgery',
        regimen: 'Total Abdominal Hysterectomy + Bilateral Salpingo-Oophorectomy + Omentectomy',
        startDate: '2024-12-28',
        endDate: '2024-12-28',
        cycles: '—',
        response: 'Optimal cytoreduction (residual disease < 1cm)'
      },
      {
        id: 'tx-402',
        type: 'Chemotherapy',
        regimen: 'Intravenous Paclitaxel + Carboplatin',
        startDate: '2025-01-20',
        endDate: '2025-05-30',
        cycles: '6',
        response: 'Complete Clinical Response, CA-125 normalized to 15.0'
      },
      {
        id: 'tx-403',
        type: 'Targeted Therapy',
        regimen: 'Olaparib (PARP Inhibitor Maintenance)',
        startDate: '2025-06-25',
        endDate: 'Ongoing',
        cycles: '—',
        response: 'Currently under maintenance, tolerating well'
      }
    ],

    // Imaging History
    imagingHistory: [
      {
        date: '2024-11-28',
        modality: 'US Pelvis',
        region: 'Pelvis',
        findings: 'Large bilateral complex cystic-solid ovarian masses, 6.2cm on left, 5.0cm on right. Moderate ascites.'
      },
      {
        date: '2024-12-10',
        modality: 'CT Abdomen/Pelvis',
        region: 'Abdomen & Pelvis',
        findings: 'Bilateral ovarian masses. Omental caking noted in upper abdomen. No remote solid organ metastasis.'
      },
      {
        date: '2025-06-10',
        modality: 'CT Abdomen',
        region: 'Abdomen',
        findings: 'Post-surgical and post-chemotherapy status. Resolution of omental caking and ascites. No measurable disease.'
      }
    ]
  },
  {
    id: 'PT-2024-00562',
    dob: '1955-04-10', // Matches age ~71
    name: 'Vikram Malhotra',
    age: 71,
    gender: 'Male',
    bloodType: 'O-',
    heightCm: 178,
    weightKg: 82.5,
    bmi: 26.0,
    phone: '+91-98777-66655',
    emergencyContact: 'Sunita Malhotra (Spouse, +91-98777-66654)',
    
    // Diagnosis
    cancerType: 'Prostate',
    subtype: 'Prostate Adenocarcinoma',
    stage: 'Stage IV',
    grade: 'Gleason Score 9 (4+5) (High Grade)',
    primarySite: 'Prostate Gland',
    tumorInitialDiameterMm: 35.0,
    lymphNodeInvolvement: 'Pelvic Nodes (N1)',
    metastasis: 'Bone (multiple pelvic & spinal osteoblastic lesions)',
    diagnosisDate: '2024-08-10',
    ecogStatus: 1,
    karnofskyScore: 80,

    // Biomarkers
    biomarkers: {
      HER2: 'Negative',
      ER_Status: 'Negative',
      PR_Status: 'Negative',
      BRCA_Mutation: 'Detected (BRCA2)', // BRCA2 Mutation
      Ki67_Index: 30,
      PD_L1_Expression: 5,
      EGFR_Mutation: 'Wild-Type',
      ALK_Rearrangement: 'Wild-Type',
      KRAS_Mutation: 'Wild-Type',
      TP53_Mutation: 'Wild-Type',
      Microsatellite_Instability: 'MSS'
    },

    // Labs (Current)
    labs: {
      wbc: 4.8,
      rbc: 3.5, // Low
      hemoglobin: 9.8, // Low (Anaemic)
      textHint: 'PSA: 42.5 ng/mL (Elevated)', // Special hint for PSA
      hematocrit: 30.2, // Low
      platelets: 165,
      neutrophils: 52,
      alt: 22,
      ast: 25,
      bilirubin: 0.5,
      albumin: 3.6,
      creatinine: 1.3, // Slightly elevated
      bun: 24, // Slightly elevated
      egfr: 54, // Mild Renal Impairment
      ca15_3: 18.2,
      cea: 4.2,
      ca125: 15.2,
      ldh: 290 // Slightly high
    },

    // Vitals (Current)
    vitals: {
      bloodPressure: '138/84',
      heartRate: 74,
      spo2: 97,
      temperatureF: 97.9,
      respiratoryRate: 15,
      painScore: 4
    },

    // Treatment History
    treatmentHistory: [
      {
        id: 'tx-501',
        type: 'Hormone Therapy',
        regimen: 'Androgen Deprivation Therapy (ADT) — LHRH agonist (Leuprolide) + Bicalutamide',
        startDate: '2024-08-20',
        endDate: 'Ongoing',
        cycles: '—',
        response: 'PSA dropped from 124.0 to 4.2 ng/mL. PSA recurrence in 2025-05.'
      },
      {
        id: 'tx-502',
        type: 'Chemotherapy',
        regimen: 'Docetaxel',
        startDate: '2025-05-20',
        endDate: 'Ongoing',
        cycles: '2/6',
        response: 'Currently under treatment for Castration-Resistant Prostate Cancer (CRPC)'
      }
    ],

    // Imaging History
    imagingHistory: [
      {
        date: '2024-08-05',
        modality: 'MRI Prostate',
        region: 'Pelvis',
        findings: '3.5cm tumor restricted within prostatic capsule but with extracapsular extension suspicion. Gleason 9.'
      },
      {
        date: '2024-08-12',
        modality: 'Bone Scan',
        region: 'Whole Body',
        findings: 'Multiple areas of increased radiotracer uptake in the pelvis, L2-L3 vertebrae, and left 8th rib. Osteoblastic metastases.'
      },
      {
        date: '2025-05-10',
        modality: 'CT Chest/Abdomen',
        region: 'Abdomen & Pelvis',
        findings: 'Enlarged pelvic lymph nodes, progressive bone sclerosis. Prostate size stable. PSA increased to 42.5 ng/mL.'
      }
    ]
  },
  {
    id: 'PT-2024-00673',
    dob: '1971-11-25', // Matches age ~55
    name: 'Amit Verma',
    age: 55,
    gender: 'Male',
    bloodType: 'B-',
    heightCm: 170,
    weightKg: 61.2,
    bmi: 21.2,
    phone: '+91-96543-21098',
    emergencyContact: 'Maya Verma (Spouse, +91-96543-21099)',
    
    // Diagnosis
    cancerType: 'Pancreatic',
    subtype: 'Pancreatic Ductal Adenocarcinoma (PDAC)',
    stage: 'Stage III',
    grade: 'Grade 3 (Poorly Differentiated)',
    primarySite: 'Head of Pancreas',
    tumorInitialDiameterMm: 32.0,
    lymphNodeInvolvement: 'Regional peripancreatic nodes (N1)',
    metastasis: 'None',
    diagnosisDate: '2025-02-18',
    ecogStatus: 1,
    karnofskyScore: 80,

    // Biomarkers
    biomarkers: {
      HER2: 'Negative',
      ER_Status: 'Negative',
      PR_Status: 'Negative',
      BRCA_Mutation: 'Wild-Type',
      Ki67_Index: 60,
      PD_L1_Expression: 5,
      EGFR_Mutation: 'Wild-Type',
      ALK_Rearrangement: 'Wild-Type',
      KRAS_Mutation: 'Detected (G12D)', // KRAS Mutated
      TP53_Mutation: 'Detected',
      Microsatellite_Instability: 'MSS'
    },

    // Labs (Current)
    labs: {
      wbc: 7.2,
      rbc: 4.0,
      hemoglobin: 11.0, // Low
      textHint: 'CA 19-9: 340 U/mL (Elevated)',
      hematocrit: 34.1, // Low
      platelets: 210,
      neutrophils: 65,
      alt: 85, // Elevated (Liver duct compression)
      ast: 78, // Elevated (Liver duct compression)
      bilirubin: 2.1, // Elevated (Jaundice)
      albumin: 3.3, // Slightly low
      creatinine: 0.8,
      bun: 14,
      egfr: 90,
      ca15_3: 16.5,
      cea: 8.9, // Elevated
      ca125: 38.4, // Slightly elevated
      ldh: 340 // Elevated
    },

    // Vitals (Current)
    vitals: {
      bloodPressure: '115/72',
      heartRate: 82,
      spo2: 97,
      temperatureF: 98.9,
      respiratoryRate: 17,
      painScore: 6 // Higher pain
    },

    // Treatment History
    treatmentHistory: [
      {
        id: 'tx-601',
        type: 'Procedure',
        regimen: 'ERCP with Biliary Stent placement',
        startDate: '2025-02-25',
        endDate: '2025-02-25',
        cycles: '—',
        response: 'Successful decompression, bilirubin decreased from 6.8 to 2.1.'
      },
      {
        id: 'tx-602',
        type: 'Chemotherapy',
        regimen: 'mFOLFIRINOX',
        startDate: '2025-03-10',
        endDate: 'Ongoing',
        cycles: '6/12',
        response: 'Tumor size stable, CA19-9 decreased from 890 to 340 U/mL.'
      }
    ],

    // Imaging History
    imagingHistory: [
      {
        date: '2025-02-10',
        modality: 'CT Pancreas',
        region: 'Abdomen',
        findings: '3.2cm hypoattenuating mass in the head of the pancreas. Abuts superior mesenteric vein (>180 degrees contact), borderline resectable.'
      },
      {
        date: '2025-05-15',
        modality: 'CT Abdomen',
        region: 'Abdomen',
        findings: 'Post-stent biliary decompression. Primary tumor size stable at 3.0cm. No new lymph node involvement or liver lesions.'
      }
    ]
  }
];

const initializePatients = () => {
  if (typeof window === 'undefined') return MOCK_PATIENTS;
  const saved = localStorage.getItem('onco_patients');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error("Error parsing saved patients, resetting", e);
    }
  }
  localStorage.setItem('onco_patients', JSON.stringify(MOCK_PATIENTS));
  return MOCK_PATIENTS;
};

export const getPatients = () => {
  return initializePatients();
};

export const getPatientById = (id) => {
  const patients = initializePatients();
  return patients.find(p => p.id === id);
};

export const getPatientsByDoctorSpecialty = (specialty) => {
  return initializePatients();
};

export const updatePatient = (updatedPatient) => {
  if (typeof window === 'undefined') return false;
  const patients = initializePatients();
  const index = patients.findIndex(p => p.id === updatedPatient.id);
  if (index !== -1) {
    patients[index] = updatedPatient;
    localStorage.setItem('onco_patients', JSON.stringify(patients));
    // Dispatch event so other components update reactively
    window.dispatchEvent(new Event('onco_patient_updated'));
    return true;
  }
  return false;
};


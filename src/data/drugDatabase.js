export const DRUG_DATABASE = [
  {
    id: 'doxorubicin',
    name: 'Doxorubicin',
    class: 'Anthracycline Chemotherapy',
    mechanism: 'DNA intercalation and topoisomerase II inhibition',
    baseEfficacy: 65,
    toxicityProfile: { general: 65, cardiac: 75, hematologic: 70 },
    biomarkerBoosts: [
      { biomarker: 'BRCA_Mutation', value: 'Detected', multiplier: 1.25 }
    ],
    contraindications: ['Pre-existing cardiomyopathy', 'Recent myocardial infarction'],
    bestFor: ['Breast', 'Ovarian', 'Pancreatic'],
    color: 'rose',
    recommendedCycleFrequencyDays: 21,
    defaultDosageIntensity: 100,
    plannedCycles: 6
  },
  {
    id: 'paclitaxel',
    name: 'Paclitaxel',
    class: 'Taxane Chemotherapy',
    mechanism: 'Microtubule stabilization preventing cell division',
    baseEfficacy: 60,
    toxicityProfile: { general: 55, cardiac: 20, hematologic: 60 },
    biomarkerBoosts: [],
    contraindications: ['Severe neuropathy', 'Neutropenia < 1500 cells/mm³'],
    bestFor: ['Breast', 'Lung', 'Ovarian'],
    color: 'amber',
    recommendedCycleFrequencyDays: 21,
    defaultDosageIntensity: 100,
    plannedCycles: 8
  },
  {
    id: 'cisplatin',
    name: 'Cisplatin',
    class: 'Platinum-based Chemotherapy',
    mechanism: 'Forms intra-strand DNA crosslinks causing apoptosis',
    baseEfficacy: 70,
    toxicityProfile: { general: 70, cardiac: 15, hematologic: 65, renal: 80 },
    biomarkerBoosts: [
      { biomarker: 'BRCA_Mutation', value: 'Detected', multiplier: 1.3 }
    ],
    contraindications: ['Pre-existing renal impairment (eGFR < 50)', 'Hearing loss'],
    bestFor: ['Lung', 'Ovarian', 'Pancreatic'],
    color: 'yellow',
    recommendedCycleFrequencyDays: 21,
    defaultDosageIntensity: 100,
    plannedCycles: 6
  },
  {
    id: '5_fluorouracil',
    name: '5-Fluorouracil (5-FU)',
    class: 'Antimetabolite Chemotherapy',
    mechanism: 'Inhibition of thymidylate synthase blocking DNA synthesis',
    baseEfficacy: 55,
    toxicityProfile: { general: 45, cardiac: 25, hematologic: 50 },
    biomarkerBoosts: [],
    contraindications: ['DPD deficiency'],
    bestFor: ['Colorectal', 'Breast', 'Pancreatic'],
    color: 'orange',
    recommendedCycleFrequencyDays: 14,
    defaultDosageIntensity: 100,
    plannedCycles: 12
  },
  {
    id: 'trastuzumab',
    name: 'Trastuzumab',
    class: 'Monoclonal Antibody (Targeted)',
    mechanism: 'Binds HER2 receptor blocking downstream signaling',
    baseEfficacy: 25, // low on its own, but massive boost for HER2+
    toxicityProfile: { general: 20, cardiac: 45, hematologic: 10 },
    biomarkerBoosts: [
      { biomarker: 'HER2', value: 'Positive', multiplier: 2.8 }
    ],
    contraindications: ['Severe heart failure', 'LVEF < 45%'],
    bestFor: ['Breast'],
    color: 'cyan',
    recommendedCycleFrequencyDays: 21,
    defaultDosageIntensity: 100,
    plannedCycles: 18
  },
  {
    id: 'pertuzumab',
    name: 'Pertuzumab',
    class: 'HER2 Dimerization Inhibitor (Targeted)',
    mechanism: 'Prevents HER2 from pairing with other HER receptors',
    baseEfficacy: 20,
    toxicityProfile: { general: 25, cardiac: 40, hematologic: 15 },
    biomarkerBoosts: [
      { biomarker: 'HER2', value: 'Positive', multiplier: 2.5 }
    ],
    contraindications: ['LVEF < 45%', 'Prior trastuzumab-induced cardiotoxicity'],
    bestFor: ['Breast'],
    color: 'teal',
    recommendedCycleFrequencyDays: 21,
    defaultDosageIntensity: 100,
    plannedCycles: 18
  },
  {
    id: 'pembrolizumab',
    name: 'Pembrolizumab',
    class: 'PD-1 Inhibitor (Immunotherapy)',
    mechanism: 'Releases PD-1 pathway-mediated inhibition of immune response',
    baseEfficacy: 40,
    toxicityProfile: { general: 35, cardiac: 10, hematologic: 15, immuneRelated: 50 },
    biomarkerBoosts: [
      { biomarker: 'PD_L1_Expression', threshold: 50, multiplier: 2.0 },
      { biomarker: 'PD_L1_Expression', threshold: 1, multiplier: 1.4 },
      { biomarker: 'Microsatellite_Instability', value: 'MSI-High', multiplier: 1.8 }
    ],
    contraindications: ['Active autoimmune disease requiring systemic immunosuppression'],
    bestFor: ['Lung', 'Ovarian', 'Colorectal', 'Breast'],
    color: 'indigo',
    recommendedCycleFrequencyDays: 21,
    defaultDosageIntensity: 100,
    plannedCycles: 24
  },
  {
    id: 'olaparib',
    name: 'Olaparib',
    class: 'PARP Inhibitor (Targeted)',
    mechanism: 'Inhibits poly (ADP-ribose) polymerase preventing DNA single-strand repair',
    baseEfficacy: 30,
    toxicityProfile: { general: 30, cardiac: 5, hematologic: 50 },
    biomarkerBoosts: [
      { biomarker: 'BRCA_Mutation', value: 'Detected', multiplier: 2.5 }
    ],
    contraindications: ['Severe renal impairment (eGFR < 30)'],
    bestFor: ['Breast', 'Ovarian', 'Prostate', 'Pancreatic'],
    color: 'violet',
    recommendedCycleFrequencyDays: 28, // Daily oral, but cycle tracker represented as 28-day review
    defaultDosageIntensity: 100,
    plannedCycles: 12
  },
  {
    id: 'erlotinib',
    name: 'Erlotinib',
    class: 'EGFR Tyrosine Kinase Inhibitor (Targeted)',
    mechanism: 'Inhibits EGFR kinase domain to block tumor growth signaling',
    baseEfficacy: 25,
    toxicityProfile: { general: 30, cardiac: 5, hematologic: 10, hepatic: 40 },
    biomarkerBoosts: [
      { biomarker: 'EGFR_Mutation', value: 'Detected', multiplier: 2.7 }
    ],
    contraindications: ['Severe hepatic impairment'],
    bestFor: ['Lung', 'Pancreatic'],
    color: 'sky',
    recommendedCycleFrequencyDays: 28,
    defaultDosageIntensity: 100,
    plannedCycles: 12
  },
  {
    id: 'bevacizumab',
    name: 'Bevacizumab',
    class: 'Anti-VEGF Monoclonal Antibody',
    mechanism: 'Binds VEGF to inhibit tumor angiogenesis and blood supply',
    baseEfficacy: 45,
    toxicityProfile: { general: 40, cardiac: 30, renal: 30, bleedingRisk: 60 },
    biomarkerBoosts: [],
    contraindications: ['Recent major surgery (within 28 days)', 'Uncontrolled hypertension'],
    bestFor: ['Colorectal', 'Lung', 'Ovarian'],
    color: 'emerald',
    recommendedCycleFrequencyDays: 14,
    defaultDosageIntensity: 100,
    plannedCycles: 12
  },
  {
    id: 'tamoxifen',
    name: 'Tamoxifen',
    class: 'Selective Estrogen Receptor Modulator (SERM)',
    mechanism: 'Competitively binds estrogen receptors in breast tissue',
    baseEfficacy: 20,
    toxicityProfile: { general: 20, cardiac: 10, thromboembolic: 50 },
    biomarkerBoosts: [
      { biomarker: 'ER_Status', value: 'Positive', multiplier: 2.8 }
    ],
    contraindications: ['History of DVT/PE', 'Concurrent warfarin therapy'],
    bestFor: ['Breast'],
    color: 'purple',
    recommendedCycleFrequencyDays: 30,
    defaultDosageIntensity: 100,
    plannedCycles: 60 // 5 years monthly checks
  },
  {
    id: 'capecitabine',
    name: 'Capecitabine',
    class: 'Oral Fluoropyrimidine Chemo',
    mechanism: 'Prodrug converted to 5-FU in tumor tissues',
    baseEfficacy: 50,
    toxicityProfile: { general: 40, cardiac: 15, hematologic: 40, dermatologic: 50 },
    biomarkerBoosts: [],
    contraindications: ['Severe renal impairment (eGFR < 30)', 'Known DPD deficiency'],
    bestFor: ['Colorectal', 'Breast', 'Pancreatic'],
    color: 'pink',
    recommendedCycleFrequencyDays: 21,
    defaultDosageIntensity: 100,
    plannedCycles: 8
  }
];

export const getDrugById = (id) => DRUG_DATABASE.find(d => d.id === id);

export const LAB_RANGES = {
  wbc: { min: 4.0, max: 11.0, unit: '×10³/µL', name: 'White Blood Cell Count' },
  rbc: { min: 3.8, max: 5.2, unit: '×10⁶/µL', name: 'Red Blood Cell Count' },
  hemoglobin: { min: 12.0, max: 16.0, unit: 'g/dL', name: 'Hemoglobin' },
  hematocrit: { min: 36.0, max: 46.0, unit: '%', name: 'Hematocrit' },
  platelets: { min: 150, max: 400, unit: '×10³/µL', name: 'Platelets' },
  neutrophils: { min: 40, max: 70, unit: '%', name: 'Neutrophils' },
  alt: { min: 7, max: 56, unit: 'U/L', name: 'Alanine Aminotransferase' },
  ast: { min: 10, max: 40, unit: 'U/L', name: 'Aspartate Aminotransferase' },
  bilirubin: { min: 0.1, max: 1.2, unit: 'mg/dL', name: 'Total Bilirubin' },
  albumin: { min: 3.5, max: 5.0, unit: 'g/dL', name: 'Albumin' },
  creatinine: { min: 0.6, max: 1.2, unit: 'mg/dL', name: 'Creatinine' },
  bun: { min: 7, max: 20, unit: 'mg/dL', name: 'Blood Urea Nitrogen' },
  egfr: { min: 60, max: 150, unit: 'mL/min/1.73m²', name: 'eGFR' },
  ca15_3: { min: 0, max: 30.0, unit: 'U/mL', name: 'CA 15-3' },
  cea: { min: 0, max: 5.0, unit: 'ng/mL', name: 'CEA' },
  ca125: { min: 0, max: 35.0, unit: 'U/mL', name: 'CA-125' },
  ldh: { min: 140, max: 280, unit: 'U/L', name: 'LDH' },
};

export const checkLabStatus = (key, value) => {
  const range = LAB_RANGES[key];
  if (!range) return 'normal';
  if (value < range.min) return 'low';
  if (value > range.max) return 'high';
  return 'normal';
};

/**
 * Oncology Digital Twin Simulation Web Worker
 * Implements Gompertzian tumor growth + pharmacokinetic clearance model
 * Runs on a background thread to keep the main UI thread free.
 */

// Worker code as a template literal string blob — instantiated via URL.createObjectURL
export const SIMULATION_WORKER_CODE = `
self.onmessage = function(e) {
  const { patient, regimen } = e.data;

  // ─── Safety clamp helper ──────────────────────────────────────────────────
  const clamp = (val, min, max) => Math.max(min, Math.min(max, isFinite(val) ? val : min));

  // ─── Unpack patient baseline ──────────────────────────────────────────────
  const {
    age,
    cancerType,
    staging,
    tumorInitialDiameterMm,
    biomarkers: { HER2, ER_PR, BRCA_Mutation, Ki67_Index }
  } = patient;

  // ─── Unpack treatment regimen ─────────────────────────────────────────────
  const {
    regimenType,
    cycleFrequencyDays,
    dosageIntensity,
    plannedCycles,
    adherenceRate
  } = regimen;

  // ─── 1. Baseline Tumor Growth Rate (r) ───────────────────────────────────
  // r = (Ki67 / 100 * 0.015) + stageBonus
  const stageBonus = staging === 'Stage IV' ? 0.005 : 0.002;
  const r = clamp((Ki67_Index / 100) * 0.015 + stageBonus, 0.001, 0.04);

  // ─── 2. Initial Tumor Volume (sphere: V = (4/3)π(d/2)^3) [in cm³] ───────
  // diameter in mm -> radius in cm -> volume in cm³
  const radiusCm = (tumorInitialDiameterMm / 2) / 10;
  let volume = (4 / 3) * Math.PI * Math.pow(radiusCm, 3);
  volume = clamp(volume, 0.001, 10000);

  // ─── 3. Therapeutic Killing Coefficient (K) ──────────────────────────────
  let baseK = 0.04 * (dosageIntensity / 100) * (adherenceRate / 100);

  // Biomarker-driven efficacy amplifiers
  if (HER2 === 'Positive' && regimenType === 'Targeted Therapy') baseK *= 1.4;
  if (BRCA_Mutation === true && regimenType === 'Chemotherapy') baseK *= 1.25;
  // Immunotherapy has immunogenic amplification
  if (regimenType === 'Immunotherapy') baseK *= 1.15;
  // Combination therapy stacks effects
  if (regimenType === 'Combination') baseK *= 1.35;

  baseK = clamp(baseK, 0, 0.12);

  // ─── 4. Carrying capacity for Gompertzian saturation ─────────────────────
  // Tumor can't grow beyond Vmax without treatment halting it
  const Vmax = 3500; // cm³ — lethal threshold

  // ─── 5. Toxicity model state ──────────────────────────────────────────────
  let toxicity = 0;            // 0 to 100
  let cardiacRisk = 0;         // 0 to 100
  let patientHealth = 100;     // 100 to 0

  // Cardiac risk modifier — anthracyclines (chemo) have higher cardiac burden
  const cardiacBurdenRate = regimenType === 'Chemotherapy' ? 0.12 :
                             regimenType === 'Combination' ? 0.09 : 0.04;

  // Total active treatment days
  const totalTreatmentDays = plannedCycles * cycleFrequencyDays;

  // ─── 6. Day-by-day simulation loop (730 days = 24 months) ────────────────
  const DAYS = 730;
  const results = [];
  let nadirVolume = volume;
  let nadirDay = 0;
  let hasDoseFlag = false;

  for (let day = 0; day <= DAYS; day++) {
    // Determine if today is a treatment day
    const isTreatmentActive = day <= totalTreatmentDays;
    const isCycleDay = isTreatmentActive && day > 0 && (day % cycleFrequencyDays === 0);
    
    // Patient adherence stochastic factor — on cycle days, they might miss dose
    const adherenceFactor = Math.random() <= (adherenceRate / 100) ? 1.0 : 0.0;

    // Effective killing on this day step
    let K_eff = 0;
    if (isCycleDay && adherenceFactor > 0) {
      K_eff = baseK;
    } else if (isTreatmentActive && day > 0) {
      // Between cycles: residual drug concentration decays exponentially
      const dayInCycle = day % cycleFrequencyDays;
      const decayFactor = Math.exp(-0.1 * dayInCycle); // PK clearance half-life ~7 days
      K_eff = baseK * decayFactor * 0.3;
    }

    // Gompertzian growth modifier: growth slows as tumor approaches carrying capacity
    const gompertzFactor = Math.log(Vmax / Math.max(volume, 0.001));
    const effectiveR = r * clamp(gompertzFactor / Math.log(Vmax), 0, 1);

    // Net volume change: V(t+1) = V(t) * exp(r_eff - K_eff)
    volume = volume * Math.exp(effectiveR - K_eff);
    volume = clamp(volume, 0.001, Vmax * 1.5);

    // Track nadir (minimum tumor volume reached)
    if (volume < nadirVolume) {
      nadirVolume = volume;
      nadirDay = day;
    }

    // ── Diameter from volume: d = 2 * (3V/4π)^(1/3) * 10 (mm) ──────────────
    const diameterMm = 2 * Math.pow((3 * volume) / (4 * Math.PI), 1 / 3) * 10;

    // ── Toxicity dynamics ─────────────────────────────────────────────────────
    if (isCycleDay && adherenceFactor > 0) {
      toxicity += 8.0; // spike on drug delivery day
      cardiacRisk += cardiacBurdenRate;
    }
    // Natural metabolic clearance decay
    toxicity = Math.max(0, toxicity - 3.0);
    cardiacRisk = Math.max(0, cardiacRisk - 0.05);

    // Cumulative toxicity impact on patient health
    if (toxicity > 75) {
      patientHealth -= 0.15;
      hasDoseFlag = true;
    } else if (toxicity > 50) {
      patientHealth -= 0.03;
    } else if (toxicity < 20 && isTreatmentActive) {
      patientHealth = Math.min(100, patientHealth + 0.05);
    }

    // Clamp all outputs
    toxicity = clamp(toxicity, 0, 100);
    cardiacRisk = clamp(cardiacRisk, 0, 100);
    patientHealth = clamp(patientHealth, 0, 100);

    // Chemo concentration efficacy (normalized 0-1 proxy from K_eff)
    const chemoConcentrationEfficacy = clamp(K_eff / 0.12, 0, 1);

    results.push({
      day,
      tumorDiameterMm: clamp(diameterMm, 0, 300),
      tumorVolumeCm3: clamp(volume, 0, Vmax * 1.5),
      chemoConcentrationEfficacy,
      systemicToxicityScore: toxicity,
      cardiacRiskFactor: cardiacRisk,
      patientVitalsHealth: patientHealth,
    });
  }

  self.postMessage({ results, nadirDay, nadirVolume, hasDoseFlag });
};
`;

/**
 * Factory: Creates a Web Worker from the simulation code string.
 * Disposes old worker if provided.
 */
export function createSimulationWorker() {
  const blob = new Blob([SIMULATION_WORKER_CODE], { type: 'application/javascript' });
  const url = URL.createObjectURL(blob);
  const worker = new Worker(url);
  // Clean up the object URL after worker is created
  URL.revokeObjectURL(url);
  return worker;
}

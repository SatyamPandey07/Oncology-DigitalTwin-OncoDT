import React, { useMemo } from 'react';
import { ShieldAlert, ShieldCheck, AlertTriangle, Activity, CheckCircle2, Info, Dna, FileText } from 'lucide-react';
import { DRUG_DATABASE } from '../data/drugDatabase';

export default function AIDiagnosticsPanel({ patient }) {
  // Compute diagnostic insights based on patient data
  const diagnostics = useMemo(() => {
    const alerts = [];
    const indications = [];
    const contraindications = [];
    let riskScore = 30; // base risk score based on stage

    if (!patient) return null;

    // --- Staging Risk factor ---
    if (patient.stage === 'Stage IV') {
      riskScore += 40;
    } else if (patient.stage === 'Stage III') {
      riskScore += 25;
    } else if (patient.stage === 'Stage II') {
      riskScore += 10;
    }

    // --- Tumor Diameter factor ---
    if (patient.tumorInitialDiameterMm > 50) {
      riskScore += 15;
    } else if (patient.tumorInitialDiameterMm > 30) {
      riskScore += 5;
    }

    // --- 1. Vital Alerts ---
    if (patient.vitals.spo2 < 96) {
      alerts.push({
        type: 'critical',
        category: 'Respiratory',
        title: `Sub-optimal Blood Oxygen Saturation (${patient.vitals.spo2}%)`,
        description: 'Patient shows borderline hypoxia. Monitor pulmonary symptoms, especially if considering taxane therapies.',
      });
      riskScore += 5;
    }
    if (patient.vitals.painScore >= 5) {
      alerts.push({
        type: 'warning',
        category: 'Palliative Care',
        title: `Moderate-to-Severe Pain Reported (${patient.vitals.painScore}/10)`,
        description: 'Ensure active palliative pain management protocols are synced with oncology regimen.',
      });
    }
    if (patient.vitals.heartRate > 90) {
      alerts.push({
        type: 'warning',
        category: 'Cardiovascular',
        title: `Elevated Heart Rate (${patient.vitals.heartRate} bpm)`,
        description: 'Tachycardia detected. Cardiac caution is advised if starting anthracyclines (Doxorubicin).',
      });
    }

    // --- 2. Lab Alerts ---
    // Hemoglobin (Anemia)
    const isFemale = patient.gender.toLowerCase() === 'female';
    const hbLimit = isFemale ? 11.5 : 13.0;
    if (patient.labs.hemoglobin < hbLimit) {
      const severity = patient.labs.hemoglobin < 10.0 ? 'critical' : 'warning';
      alerts.push({
        type: severity,
        category: 'Hematologic',
        title: `Anemia Detected (Hemoglobin: ${patient.labs.hemoglobin} g/dL)`,
        description: `Patient's red blood cell count is low. Chemotherapy cycles may induce myelosuppression. Consider RBC support.`,
      });
      riskScore += severity === 'critical' ? 10 : 5;
    }

    // Kidney Function (eGFR & Creatinine)
    if (patient.labs.egfr < 60) {
      alerts.push({
        type: 'critical',
        category: 'Renal',
        title: `Renal Impairment (eGFR: ${patient.labs.egfr} mL/min/1.73m²)`,
        description: 'Moderate renal insufficiency. Avoid highly nephrotoxic agents. Hydration protocols must be strictly followed.',
      });
      riskScore += 10;
    }

    // Liver Function (ALT/AST/Bilirubin)
    if (patient.labs.alt > 50 || patient.labs.ast > 50) {
      alerts.push({
        type: 'warning',
        category: 'Hepatic',
        title: `Hepatic Transaminase Elevation (ALT: ${patient.labs.alt}, AST: ${patient.labs.ast})`,
        description: 'Signs of liver stress. Monitor hepatic panel weekly. Dose reductions may be necessary for liver-cleared drugs.',
      });
    }
    if (patient.labs.bilirubin > 1.5) {
      alerts.push({
        type: 'critical',
        category: 'Hepatic/Biliary',
        title: `Hyperbilirubinemia Detected (Bilirubin: ${patient.labs.bilirubin} mg/dL)`,
        description: 'Jaundice hazard. Check for biliary tree compression or drug-induced hepatotoxicity immediately.',
      });
      riskScore += 10;
    }

    // Tumor Antigens
    if (patient.cancerType === 'Breast' && patient.labs.ca15_3 > 30) {
      alerts.push({
        type: 'info',
        category: 'Biomarkers',
        title: `Elevated CA 15-3 Antigen (${patient.labs.ca15_3} U/mL)`,
        description: 'Normal range is < 30 U/mL. Track serial values to monitor response to therapy.',
      });
    }
    if (patient.cancerType === 'Ovarian' && patient.labs.ca125 > 35) {
      alerts.push({
        type: 'warning',
        category: 'Biomarkers',
        title: `Significantly Elevated CA-125 Antigen (${patient.labs.ca125} U/mL)`,
        description: 'Normal range is < 35 U/mL. High levels correspond to active disease burden.',
      });
    }
    if (patient.labs.cea > 5) {
      alerts.push({
        type: 'info',
        category: 'Biomarkers',
        title: `Elevated CEA Antigen (${patient.labs.cea} ng/mL)`,
        description: 'Normal range is < 5 ng/mL. Monitor for potential disease progression or metastatic recurrence.',
      });
    }

    // --- 3. Drug Indications ---
    // Match based on biomarkers
    const { HER2, ER_Status, BRCA_Mutation, EGFR_Mutation, PD_L1_Expression, Microsatellite_Instability } = patient.biomarkers;

    if (HER2 === 'Positive') {
      indications.push({
        drugId: 'trastuzumab',
        reason: 'HER2-Positive expression enables high-affinity binding of Trastuzumab monoclonal antibody.',
        efficacyMultiplier: '2.8x'
      });
      indications.push({
        drugId: 'pertuzumab',
        reason: 'HER2 dimerization inhibition synergizes with anti-HER2 targeted therapy.',
        efficacyMultiplier: '2.5x'
      });
    }

    const brcaDetected = BRCA_Mutation && (BRCA_Mutation.includes('Detected') || BRCA_Mutation === 'Positive');
    if (brcaDetected) {
      indications.push({
        drugId: 'olaparib',
        reason: 'BRCA1/2 deficient tumor cells are highly sensitive to synthetic lethality induced by PARP inhibition.',
        efficacyMultiplier: '2.5x'
      });
      indications.push({
        drugId: 'cisplatin',
        reason: 'BRCA-mutated cells exhibit deficient homologous recombination repair, increasing platinum sensitivity.',
        efficacyMultiplier: '1.3x'
      });
    }

    if (EGFR_Mutation === 'Detected') {
      indications.push({
        drugId: 'erlotinib',
        reason: 'EGFR-sensitive mutations drive tumor cell proliferation; TKI Erlotinib blocks this cascade.',
        efficacyMultiplier: '2.7x'
      });
    }

    if (PD_L1_Expression >= 50 || Microsatellite_Instability === 'MSI-High') {
      const basis = PD_L1_Expression >= 50 
        ? `High PD-L1 expression (${PD_L1_Expression}%)` 
        : 'Microsatellite Instability High (MSI-H)';
      indications.push({
        drugId: 'pembrolizumab',
        reason: `${basis} correlates strongly with hypermutated tumors and responsive immune microenvironments.`,
        efficacyMultiplier: PD_L1_Expression >= 50 ? '2.0x' : '1.8x'
      });
    }

    const erDetected = ER_Status && (ER_Status.includes('Positive') || ER_Status === 'Positive');
    if (erDetected) {
      indications.push({
        drugId: 'tamoxifen',
        reason: 'Estrogen Receptor expression drives growth. Tamoxifen hormone blocker inhibits estrogen binding.',
        efficacyMultiplier: '2.8x'
      });
    }

    // --- 4. Contraindications (Safety Guardrails) ---
    DRUG_DATABASE.forEach(drug => {
      let contraindicated = false;
      const reasons = [];

      // Check renal clearance limits
      if (patient.labs.egfr < 50 && drug.id === 'cisplatin') {
        contraindicated = true;
        reasons.push(`Contraindicated for eGFR < 50 mL/min (${patient.labs.egfr} detected). High risk of acute kidney injury.`);
      }
      if (patient.labs.egfr < 30 && (drug.id === 'olaparib' || drug.id === 'capecitabine')) {
        contraindicated = true;
        reasons.push(`Contraindicated in severe renal impairment (eGFR: ${patient.labs.egfr}). Clearance kinetics compromised.`);
      }

      // Check liver clearances
      if (patient.labs.alt > 100 && drug.id === 'erlotinib') {
        contraindicated = true;
        reasons.push('Contraindicated in severe hepatic impairment (elevated transaminases).');
      }

      // Check general notes
      if (patient.labs.hemoglobin < 9.0 && drug.class.toLowerCase().includes('chemotherapy')) {
        contraindicated = true;
        reasons.push('Severe anemia. Chemotherapy administration presents critical myelotoxicity hazard.');
      }

      if (contraindicated) {
        contraindications.push({
          drug,
          reasons
        });
      }
    });

    return {
      alerts,
      indications,
      contraindications,
      riskScore: Math.min(100, riskScore)
    };
  }, [patient]);

  if (!patient || !diagnostics) return null;

  const getRiskBadge = (score) => {
    if (score >= 70) return { label: 'CRITICAL CLINICAL RISK', bg: 'bg-rose-500/10 text-rose-450 border-rose-500/30' };
    if (score >= 45) return { label: 'ELEVATED CLINICAL RISK', bg: 'bg-amber-500/10 text-amber-450 border-amber-500/30' };
    return { label: 'STABLE / CONTROLLED RISK', bg: 'bg-emerald-500/10 text-emerald-450 border-emerald-500/30' };
  };

  const riskBadge = getRiskBadge(diagnostics.riskScore);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
      
      {/* Diagnostics Risk Assessment (Left side) */}
      <div className="lg:col-span-1 bg-slate-900/20 border border-slate-900 rounded-xl p-5 space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-850 pb-2 flex items-center gap-1.5">
          <Activity className="w-4 h-4 text-cyan-400" />
          Health Diagnostics Matrix
        </h3>

        {/* Circular Risk Indicator */}
        <div className="flex flex-col items-center justify-center py-6 text-center">
          <div className="relative w-32 h-32 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="56"
                className="stroke-slate-800"
                strokeWidth="8"
                fill="transparent"
              />
              <circle
                cx="64"
                cy="64"
                r="56"
                className={`${
                  diagnostics.riskScore >= 70 ? 'stroke-rose-500' :
                  diagnostics.riskScore >= 45 ? 'stroke-amber-500' :
                  'stroke-emerald-500'
                } transition-all duration-1000 ease-out`}
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={2 * Math.PI * 56}
                strokeDashoffset={2 * Math.PI * 56 * (1 - diagnostics.riskScore / 100)}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute text-center">
              <span className="text-2xl font-black font-mono text-slate-200">{diagnostics.riskScore}%</span>
              <span className="text-[8px] text-slate-500 block uppercase tracking-wider font-bold">Severity</span>
            </div>
          </div>

          <span className={`inline-flex px-2 py-0.5 mt-4 rounded border text-[9px] font-bold font-mono tracking-wider ${riskBadge.bg}`}>
            {riskBadge.label}
          </span>
        </div>

        {/* Diagnostic Core parameters */}
        <div className="space-y-3 font-mono text-xs">
          <div className="flex justify-between border-t border-slate-900 pt-3">
            <span className="text-slate-500">Active Warning Count</span>
            <span className="text-slate-200 font-bold">{diagnostics.alerts.length}</span>
          </div>
          <div className="flex justify-between border-t border-slate-900 pt-3">
            <span className="text-slate-500">Biomarker Targets</span>
            <span className="text-slate-200 font-bold">{diagnostics.indications.length} identified</span>
          </div>
          <div className="flex justify-between border-t border-slate-900 pt-3">
            <span className="text-slate-500">Contraindicated Drugs</span>
            <span className="text-rose-400 font-bold">{diagnostics.contraindications.length} flagged</span>
          </div>
        </div>
      </div>

      {/* Warning Logs & Indications (Right side) */}
      <div className="lg:col-span-2 space-y-6">
        
        {/* Warning Logs */}
        <div className="bg-slate-900/20 border border-slate-900 rounded-xl p-5 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-850 pb-2 flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-rose-500" />
            Physiological & Lab Diagnostics Alerts ({diagnostics.alerts.length})
          </h3>

          {diagnostics.alerts.length > 0 ? (
            <div className="space-y-3">
              {diagnostics.alerts.map((alert, idx) => (
                <div 
                  key={idx} 
                  className={`flex gap-3 p-3 rounded-lg border text-xs font-mono transition-all duration-300 ${
                    alert.type === 'critical' 
                      ? 'bg-rose-500/5 border-rose-500/20 text-rose-350 hover:bg-rose-500/10' 
                      : alert.type === 'warning' 
                      ? 'bg-amber-500/5 border-amber-500/20 text-amber-350 hover:bg-amber-500/10'
                      : 'bg-slate-950/40 border-slate-850 text-slate-350 hover:bg-slate-900/30'
                  }`}
                >
                  <div className="shrink-0 mt-0.5">
                    {alert.type === 'critical' ? (
                      <AlertTriangle className="w-4 h-4 text-rose-500" />
                    ) : alert.type === 'warning' ? (
                      <AlertTriangle className="w-4 h-4 text-amber-500" />
                    ) : (
                      <Info className="w-4 h-4 text-cyan-400" />
                    )}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className={`text-[8px] font-bold px-1.5 py-0.2 rounded uppercase ${
                        alert.type === 'critical' ? 'bg-rose-500/10 border border-rose-500/30 text-rose-400' :
                        alert.type === 'warning' ? 'bg-amber-500/10 border border-amber-500/30 text-amber-400' :
                        'bg-cyan-500/10 border border-cyan-500/30 text-cyan-400'
                      }`}>
                        {alert.category}
                      </span>
                      <h4 className="font-bold text-slate-200">{alert.title}</h4>
                    </div>
                    <p className="text-[10px] text-slate-400 leading-relaxed">{alert.description}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center gap-2 bg-emerald-500/5 border border-emerald-500/15 text-emerald-450 p-4 rounded-lg text-xs font-mono">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span>All vital and hematologic telemetry records are currently within acceptable clinical safety ranges.</span>
            </div>
          )}
        </div>

        {/* Genomic Matching Panel */}
        <div className="bg-slate-900/20 border border-slate-900 rounded-xl p-5 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-850 pb-2 flex items-center gap-1.5">
            <Dna className="w-4 h-4 text-cyan-400" />
            Biomarker-Driven Therapeutic Suggestions
          </h3>

          {diagnostics.indications.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {diagnostics.indications.map((ind, idx) => {
                const drug = DRUG_DATABASE.find(d => d.id === ind.drugId);
                if (!drug) return null;

                return (
                  <div key={idx} className="bg-slate-950/40 border border-slate-850 hover:border-slate-700 p-4 rounded-lg space-y-3 font-mono transition-all duration-300">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-xs font-bold text-slate-200">{drug.name}</h4>
                        <span className="text-[9px] text-slate-500 block">{drug.class}</span>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/25 text-cyan-400">
                        {ind.efficacyMultiplier} Boost
                      </span>
                    </div>

                    <p className="text-[10px] text-slate-400 leading-relaxed border-t border-slate-900 pt-2">
                      {ind.reason}
                    </p>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-slate-500 font-mono">No biomarker indications matched for the current genomic profile.</p>
          )}
        </div>

        {/* Contraindications Warning */}
        {diagnostics.contraindications.length > 0 && (
          <div className="bg-slate-900/20 border border-slate-900 rounded-xl p-5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-850 pb-2 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-rose-500 animate-pulse" />
              Prescription Safety Guardrails: Active Contraindications
            </h3>
            <div className="space-y-3">
              {diagnostics.contraindications.map((cont, idx) => (
                <div key={idx} className="bg-rose-950/10 border border-rose-900/30 rounded-lg p-3 space-y-1 font-mono text-xs">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-rose-500 shrink-0" />
                    <span className="font-bold text-rose-400">{cont.drug.name}</span>
                    <span className="text-[9px] text-slate-500">• {cont.drug.class}</span>
                  </div>
                  <ul className="list-disc pl-5 text-[10px] text-slate-400 space-y-1 mt-1">
                    {cont.reasons.map((r, rIdx) => (
                      <li key={rIdx}>{r}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

    </div>
  );
}

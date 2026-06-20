import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getPatientById } from '../../data/mockPatients';
import { getDrugById } from '../../data/drugDatabase';
import { createSimulationWorker } from '../../simulationWorker';
import { FileSpreadsheet, ShieldCheck, Activity, Download, List } from 'lucide-react';
import { formatDate } from '../../utils/formatters';

export default function MySimulationsPage() {
  const { user } = useAuth();
  const patient = useMemo(() => getPatientById(user?.id), [user]);
  const [savedSims, setSavedSims] = useState([]);
  const [downloadingId, setDownloadingId] = useState(null);

  useEffect(() => {
    if (!patient) return;
    const key = `saved_simulations_${patient.id}`;
    const data = localStorage.getItem(key);
    if (data) {
      setSavedSims(JSON.parse(data));
    }
  }, [patient]);

  // Run dynamic simulation on the fly to generate full CSV report for the patient
  const handleDownloadCSV = (drugId) => {
    setDownloadingId(drugId);
    const drugObj = getDrugById(drugId);
    const worker = createSimulationWorker();

    let regimenType = 'Combination';
    if (drugObj.class.toLowerCase().includes('targeted')) regimenType = 'Targeted Therapy';
    if (drugObj.class.toLowerCase().includes('chemotherapy')) regimenType = 'Chemotherapy';
    if (drugObj.class.toLowerCase().includes('immunotherapy')) regimenType = 'Immunotherapy';

    const regimenPayload = {
      regimenType,
      cycleFrequencyDays: drugObj.recommendedCycleFrequencyDays,
      dosageIntensity: drugObj.defaultDosageIntensity,
      plannedCycles: drugObj.plannedCycles,
      adherenceRate: 95
    };

    worker.onmessage = (e) => {
      const { results } = e.data;

      // Construct CSV
      let csvContent = 'Day,Tumor Diameter (mm),Tumor Volume (cm3),Systemic Toxicity (%),Cardiac Risk Factor (%),Patient Vitals Health (%)\n';
      results.forEach(row => {
        csvContent += `${row.day},${row.tumorDiameterMm.toFixed(2)},${row.tumorVolumeCm3.toFixed(3)},${row.systemicToxicityScore.toFixed(1)},${row.cardiacRiskFactor.toFixed(2)},${row.patientVitalsHealth.toFixed(1)}\n`;
      });

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `PatientSim_${patient.name.replace(/\s+/g, '_')}_${drugObj.name}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setDownloadingId(null);
      worker.terminate();
    };

    worker.onerror = () => {
      setDownloadingId(null);
      worker.terminate();
    };

    worker.postMessage({ patient, regimen: regimenPayload });
  };

  const doctorRecommendation = useMemo(() => {
    if (savedSims.length === 0) return null;
    const latest = savedSims[0];
    let best = null;
    let maxScore = -1;
    latest.selectedDrugs.forEach(d => {
      if (d.efficacyScore > maxScore) {
        maxScore = d.efficacyScore;
        best = d;
      }
    });

    if (maxScore >= 75) return { drugId: best.id, drugName: best.name, score: maxScore };
    return null;
  }, [savedSims]);

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          My Treatment Projections
          <span className="text-[10px] px-2 py-0.2 rounded border border-slate-800 text-slate-500 font-mono font-normal">
            Simulator Forecasts
          </span>
        </h2>
        <p className="text-xs text-slate-500 font-mono">Therapeutic forecasting reports generated using your digital twin profile.</p>
      </div>

      {/* Intro Advisory */}
      <div className="bg-slate-900/20 border border-slate-900 rounded-xl p-5 space-y-2">
        <h4 className="text-xs font-bold text-slate-350 flex items-center gap-2">
          <Activity className="w-4 h-4 text-violet-400" />
          What is a Digital Twin Simulation?
        </h4>
        <p className="text-xs text-slate-455 leading-relaxed font-mono">
          A digital twin is a virtual computer clone of your tumor's biology, modeled using your specific genomic mutations, lab values, and vital signs. Instead of trial-and-error treatment, your oncologist runs simulations on your digital twin first to forecast which oncology drugs will yield the highest tumor regression rate with minimal side effects.
        </p>
      </div>

      {doctorRecommendation && (
        <div className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-xl">
          <ShieldCheck className="w-5 h-5 shrink-0" />
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider font-mono">Advised Treatment Selection</h4>
            <p className="text-xs mt-1 leading-relaxed font-mono">
              In your latest digital twin assay, the drug regimen <strong>{doctorRecommendation.drugName}</strong> achieved a forecasted success score of <strong>{Math.round(doctorRecommendation.score)}%</strong>. Your medical team has highlighted this as the primary path forward.
            </p>
          </div>
        </div>
      )}

      {savedSims.length > 0 ? (
        <div className="space-y-4 max-w-3xl">
          {savedSims.map((sim) => (
            <div key={sim.id} className="bg-slate-900/30 border border-slate-900 rounded-xl p-5 space-y-4">
              
              <div className="flex justify-between items-center border-b border-slate-850 pb-2.5 text-[11px] font-mono">
                <span className="text-slate-200 font-bold">{sim.name}</span>
                <span className="text-slate-550">Reported on: {formatDate(sim.date)}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {sim.selectedDrugs.map(d => (
                  <div key={d.id} className="bg-slate-950/40 border border-slate-850 rounded-lg p-3 space-y-3 flex flex-col justify-between">
                    <div>
                      <h4 className="text-[11px] font-bold text-slate-350">{d.name}</h4>
                      <span className="text-[8px] text-slate-550 block font-mono uppercase">{d.class.replace('Chemotherapy', 'Chemo')}</span>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-[10px] font-mono">
                        <span className="text-slate-500">Forecast Efficacy:</span>
                        <span className={`font-bold ${d.efficacyScore >= 75 ? 'text-emerald-400' : d.efficacyScore >= 50 ? 'text-amber-400' : 'text-rose-400'}`}>
                          {Math.round(d.efficacyScore)}%
                        </span>
                      </div>

                      {/* Download data button */}
                      <button
                        onClick={() => handleDownloadCSV(d.id)}
                        disabled={downloadingId !== null}
                        className="w-full flex items-center justify-center gap-1.5 py-1 px-2.5 rounded bg-slate-950 border border-slate-800 hover:border-cyan-500/40 text-[9px] font-bold text-cyan-400 hover:bg-cyan-500/5 transition-all"
                      >
                        {downloadingId === d.id ? (
                          <span className="w-2.5 h-2.5 border border-cyan-400 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <>
                            <Download className="w-3 h-3" /> Get CSV Data
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          ))}
        </div>
      ) : (
        <div className="bg-slate-900/10 border border-slate-900/50 rounded-xl p-8 text-center max-w-3xl">
          <p className="text-slate-550 text-xs font-mono">No digital twin simulation runs have been published by your clinician yet.</p>
        </div>
      )}

    </div>
  );
}

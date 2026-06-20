import React, { useState, useMemo, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPatientById, updatePatient } from '../../data/mockPatients';
import { DRUG_DATABASE, getDrugById } from '../../data/drugDatabase';
import { createSimulationWorker } from '../../simulationWorker';
import DrugCard from '../../components/DrugCard';
import DrugComparisonChart from '../../components/DrugComparisonChart';
import BodyDiagram from '../../components/BodyDiagram';
import { ArrowLeft, Play, Save, CheckCircle, ShieldAlert, Award, FileSpreadsheet, Download, Table, ShieldCheck, Info, Activity, Settings, Bell, TrendingUp } from 'lucide-react';

export default function SimulationPage() {
  const { id } = useParams();
  const [patient, setPatient] = useState(() => getPatientById(id));

  // Sync patient if id changes
  useEffect(() => {
    setPatient(getPatientById(id));
  }, [id]);

  const [selectedDrugIds, setSelectedDrugIds] = useState([]);
  const [activeDrugId, setActiveDrugId] = useState('');
  const [dosageIntensity, setDosageIntensity] = useState(100);
  const [cycleFrequencyDays, setCycleFrequencyDays] = useState(14);
  const [plannedCycles, setPlannedCycles] = useState(6);
  const [adherenceRate, setAdherenceRate] = useState(95);

  const [isRunning, setIsRunning] = useState(false);
  const [simData, setSimData] = useState({}); // key: drugId -> results array
  const [simMetrics, setSimMetrics] = useState({}); // key: drugId -> metrics obj
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [simulationName, setSimulationName] = useState('Comparative Assay Run');
  const [viewMode, setViewMode] = useState('chart'); // 'chart' | 'table'

  // Modal State
  const [pendingDrugToApply, setPendingDrugToApply] = useState(null);
  const [pendingMetrics, setPendingMetrics] = useState(null);
  const [prescribeSuccess, setPrescribeSuccess] = useState(false);

  // Set first selected drug as active by default
  useEffect(() => {
    if (selectedDrugIds.length > 0) {
      if (!activeDrugId || !selectedDrugIds.includes(activeDrugId)) {
        const firstId = selectedDrugIds[0];
        setActiveDrugId(firstId);
        const drugObj = getDrugById(firstId);
        if (drugObj) {
          setDosageIntensity(drugObj.defaultDosageIntensity || 100);
          setCycleFrequencyDays(drugObj.recommendedCycleFrequencyDays || 14);
          setPlannedCycles(drugObj.plannedCycles || 6);
          setAdherenceRate(95);
        }
      }
    } else {
      setActiveDrugId('');
    }
  }, [selectedDrugIds, activeDrugId]);

  // When active drug changes, load its default parameters
  const handleActiveDrugChange = (drugId) => {
    setActiveDrugId(drugId);
    const drugObj = getDrugById(drugId);
    if (drugObj) {
      setDosageIntensity(drugObj.defaultDosageIntensity || 100);
      setCycleFrequencyDays(drugObj.recommendedCycleFrequencyDays || 14);
      setPlannedCycles(drugObj.plannedCycles || 6);
    }
  };

  if (!patient) {
    return (
      <div className="text-center py-12">
        <p className="text-rose-455 font-mono text-sm">Patient not found</p>
        <Link to="/doctor/patients" className="text-xs text-cyan-400 hover:underline">Return to directory</Link>
      </div>
    );
  }

  // Toggle selection
  const handleSelectToggle = (drugId) => {
    setSelectedDrugIds(prev => {
      if (prev.includes(drugId)) {
        return prev.filter(id => id !== drugId);
      }
      if (prev.length >= 4) return prev; // Limit to 4
      return [...prev, drugId];
    });
  };

  // Run comparative simulations in parallel workers
  const handleRunSimulations = () => {
    if (selectedDrugIds.length === 0) return;

    setIsRunning(true);
    setSaveSuccess(false);

    const promises = selectedDrugIds.map(drugId => {
      return new Promise((resolve, reject) => {
        const drugObj = getDrugById(drugId);
        const worker = createSimulationWorker();

        // Determine regimen category
        let regimenType = 'Combination';
        if (drugObj.class.toLowerCase().includes('targeted')) regimenType = 'Targeted Therapy';
        if (drugObj.class.toLowerCase().includes('chemotherapy')) regimenType = 'Chemotherapy';
        if (drugObj.class.toLowerCase().includes('immunotherapy')) regimenType = 'Immunotherapy';

        const isCustomRegimen = drugId === activeDrugId;
        const regimenPayload = {
          regimenType,
          cycleFrequencyDays: isCustomRegimen ? Number(cycleFrequencyDays) : drugObj.recommendedCycleFrequencyDays,
          dosageIntensity: isCustomRegimen ? Number(dosageIntensity) : drugObj.defaultDosageIntensity,
          plannedCycles: isCustomRegimen ? Number(plannedCycles) : drugObj.plannedCycles,
          adherenceRate: isCustomRegimen ? Number(adherenceRate) : 95
        };

        // Biomarker-driven boosts calculation
        let boostMultiplier = 1.0;
        if (drugObj.biomarkerBoosts) {
          drugObj.biomarkerBoosts.forEach(b => {
            const patientVal = patient.biomarkers[b.biomarker];
            if (b.threshold !== undefined && typeof patientVal === 'number' && patientVal >= b.threshold) {
              boostMultiplier *= b.multiplier;
            } else if (b.value !== undefined && patientVal === b.value) {
              boostMultiplier *= b.multiplier;
            }
          });
        }

        worker.onmessage = (e) => {
          const { results, nadirDay, nadirVolume, hasDoseFlag } = e.data;

          // Compute clinical efficacy based on final tumor shrinkage relative to start
          const initialVol = results[0].tumorVolumeCm3;
          const finalVol = results[results.length - 1].tumorVolumeCm3;
          const shrinkage = Math.max(0, ((initialVol - finalVol) / initialVol) * 100);
          
          const efficacyScore = Math.min(100, Math.max(0, shrinkage * boostMultiplier));
          const peakToxicity = results.reduce((max, d) => Math.max(max, d.systemicToxicityScore), 0);

          resolve({
            drugId,
            results,
            nadirDay,
            nadirVolume,
            hasDoseFlag,
            efficacyScore,
            peakToxicity
          });
          worker.terminate();
        };

        worker.onerror = (err) => {
          console.error(`Simulation failed for ${drugObj.name}:`, err);
          reject(err);
          worker.terminate();
        };

        worker.postMessage({ patient, regimen: regimenPayload });
      });
    });

    Promise.all(promises)
      .then(outputs => {
        const dataMap = {};
        const metricsMap = {};
        
        outputs.forEach(out => {
          dataMap[out.drugId] = out.results;
          metricsMap[out.drugId] = {
            efficacyScore: out.efficacyScore,
            peakToxicity: out.peakToxicity,
            nadirVolume: out.nadirVolume,
            nadirDay: out.nadirDay,
            hasDoseFlag: out.hasDoseFlag
          };
        });

        setSimData(dataMap);
        setSimMetrics(metricsMap);
        setIsRunning(false);
      })
      .catch(err => {
        console.error(err);
        setIsRunning(false);
      });
  };

  // Export full 730-day simulation telemetry data to CSV file
  const handleExportCSV = (drugId) => {
    const data = simData[drugId];
    if (!data) return;
    const drugObj = getDrugById(drugId);

    let csvContent = 'Day,Tumor Diameter (mm),Tumor Volume (cm3),Systemic Toxicity (%),Cardiac Risk Factor (%),Patient Vitals Health (%)\n';
    
    data.forEach(row => {
      csvContent += `${row.day},${row.tumorDiameterMm.toFixed(2)},${row.tumorVolumeCm3.toFixed(3)},${row.systemicToxicityScore.toFixed(1)},${row.cardiacRiskFactor.toFixed(2)},${row.patientVitalsHealth.toFixed(1)}\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Simulation_${patient.name.replace(/\s+/g, '_')}_${drugObj.name}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Check if drug is indicated or contraindicated
  const getDrugStatus = (drug) => {
    let isContraindicated = false;
    let contrareason = '';
    
    if (drug.contraindications) {
      drug.contraindications.forEach(c => {
        if (c.toLowerCase().includes('renal') && patient.labs.egfr < 60) {
          isContraindicated = true;
          contrareason = `Kidney Function Alert (eGFR: ${patient.labs.egfr})`;
        }
      });
    }

    const isBestFor = drug.bestFor && drug.bestFor.includes(patient.cancerType);
    return { isContraindicated, contrareason, isBestFor };
  };

  // Group drugs
  const categorizedDrugs = useMemo(() => {
    const categories = {
      chemo: [],
      targeted: [],
      immuno: [],
      hormone: []
    };

    DRUG_DATABASE.forEach(d => {
      const { isContraindicated, contrareason, isBestFor } = getDrugStatus(d);
      const drugExtended = { ...d, isContraindicated, contrareason, isBestFor };

      if (d.class.toLowerCase().includes('chemotherapy')) categories.chemo.push(drugExtended);
      else if (d.class.toLowerCase().includes('targeted') || d.class.toLowerCase().includes('monoclonal')) categories.targeted.push(drugExtended);
      else if (d.class.toLowerCase().includes('immunotherapy')) categories.immuno.push(drugExtended);
      else categories.hormone.push(drugExtended);
    });

    return categories;
  }, [patient]);

  // Persist assay results to localStorage
  const handleSaveAssay = () => {
    if (Object.keys(simMetrics).length === 0) return;
    
    const savedRun = {
      id: `sim-${Date.now()}`,
      date: new Date().toISOString(),
      name: simulationName,
      patientId: patient.id,
      selectedDrugs: selectedDrugIds.map(drugId => {
        const drugObj = getDrugById(drugId);
        const metrics = simMetrics[drugId];
        return {
          id: drugId,
          name: drugObj.name,
          class: drugObj.class,
          color: drugObj.color,
          efficacyScore: metrics.efficacyScore,
          peakToxicity: metrics.peakToxicity,
          hasDoseFlag: metrics.hasDoseFlag
        };
      })
    };

    const key = `saved_simulations_${patient.id}`;
    const existing = localStorage.getItem(key);
    const list = existing ? JSON.parse(existing) : [];
    list.unshift(savedRun);
    localStorage.setItem(key, JSON.stringify(list));

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // Find best performing drug
  const recommendedDrug = useMemo(() => {
    if (Object.keys(simMetrics).length === 0) return null;
    let bestId = null;
    let highestEfficacy = -1;

    Object.keys(simMetrics).forEach(id => {
      const m = simMetrics[id];
      if (m.efficacyScore > highestEfficacy) {
        highestEfficacy = m.efficacyScore;
        bestId = id;
      }
    });

    if (highestEfficacy >= 75) {
      return getDrugById(bestId);
    }
    return null;
  }, [simMetrics]);

  // Sample data at specific days for comparison table view
  const sampleIntervals = [0, 90, 180, 360, 540, 720];

  return (
    <div className="space-y-6">
      
      {/* Patient Info Bar */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl px-5 py-3 flex flex-wrap items-center justify-between gap-4 shadow-lg backdrop-blur-md">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-cyan-400 animate-pulse" />
          <span className="text-sm font-bold text-slate-200">
            PATIENT: <span className="text-cyan-400">{patient.name}</span>, Age {patient.age} (ID: {patient.id})
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to={`/doctor/patient/${patient.id}`}
            className="text-xs px-3 py-1.5 rounded-lg border border-slate-800 hover:border-slate-700 bg-slate-950/40 text-slate-400 font-semibold transition-all"
          >
            Patient Profile
          </Link>
          <button className="p-1.5 rounded-lg bg-slate-950 border border-slate-850 hover:border-slate-700 text-slate-400 hover:text-slate-200">
            <Settings className="w-4 h-4" />
          </button>
          <button className="p-1.5 rounded-lg bg-slate-950 border border-slate-850 hover:border-slate-700 text-slate-400 hover:text-slate-200 relative">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full animate-ping" />
          </button>
          <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-750 flex items-center justify-center text-xs font-bold text-cyan-400">
            DR
          </div>
        </div>
      </div>

      {/* Grid of 4 Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Current Status */}
        <div className="bg-slate-900/40 border border-slate-850 rounded-xl p-4 flex flex-col justify-between h-[120px] shadow-md">
          <div className="flex justify-between items-start">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 font-mono">Current Status</span>
            <Activity className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-100">{patient.stage} {patient.cancerType}</h3>
            <span className="text-[10px] text-slate-400 block font-mono">Baseline: {patient.tumorInitialDiameterMm}mm tumor</span>
          </div>
          <div className="flex items-center gap-1.5 pt-1.5 border-t border-slate-850/50 text-[9px] font-mono text-slate-500">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Digital Twin Accuracy: 94.2%
          </div>
        </div>

        {/* Card 2: Treatment Response */}
        <div className="bg-slate-900/40 border border-slate-850 rounded-xl p-4 flex flex-col justify-between h-[120px] shadow-md">
          <div className="flex justify-between items-start">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 font-mono">Treatment Response</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-100">
              {activeDrugId && simMetrics[activeDrugId] ? (
                simMetrics[activeDrugId].efficacyScore > 80 ? 'Complete Response' :
                simMetrics[activeDrugId].efficacyScore > 50 ? 'Partial Response' :
                simMetrics[activeDrugId].efficacyScore > 20 ? 'Stable Disease' : 'Progressive Disease'
              ) : 'Awaiting Run'}
            </h3>
            <span className="text-[10px] text-slate-400 block font-mono">
              {activeDrugId && simMetrics[activeDrugId] 
                ? `Projected Shrinkage: ${Math.round(simMetrics[activeDrugId].efficacyScore)}%`
                : 'Run simulation to project'}
            </span>
          </div>
          <div className="flex items-center gap-1.5 pt-1.5 border-t border-slate-850/50 text-[9px] font-mono text-slate-500">
            Gompertzian Decay Loop
          </div>
        </div>

        {/* Card 3: Predictive Biomarkers */}
        <div className="bg-slate-900/40 border border-slate-850 rounded-xl p-4 flex flex-col justify-between h-[120px] shadow-md">
          <div className="flex justify-between items-start">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 font-mono">Predictive Biomarkers</span>
            <span className="text-[9px] px-1 py-0.1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded uppercase font-mono">NGS</span>
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-200 truncate font-mono">
              {Object.entries(patient.biomarkers)
                .filter(([key, val]) => val === 'Positive' || val === true)
                .map(([key, _]) => key.replace('_', ' '))
                .join(', ') || 'No positive biomarkers'}
            </h3>
            <span className="text-[10px] text-slate-400 block font-mono">Ki-67 Index: {patient.biomarkers.Ki67_Index}%</span>
          </div>
          <div className="flex items-center gap-1.5 pt-1.5 border-t border-slate-850/50 text-[9px] font-mono text-slate-500">
            Targeted Efficacy Indicated
          </div>
        </div>

        {/* Card 4: Adverse Event Risk */}
        <div className="bg-slate-900/40 border border-slate-850 rounded-xl p-4 flex flex-col justify-between h-[120px] shadow-md">
          <div className="flex justify-between items-start">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 font-mono">Adverse Event Risk</span>
            <ShieldAlert className="w-4 h-4 text-amber-500" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-100">
              {activeDrugId && simMetrics[activeDrugId] ? (
                simMetrics[activeDrugId].peakToxicity > 70 ? 'High Risk' :
                simMetrics[activeDrugId].peakToxicity > 40 ? 'Moderate Risk' : 'Low Risk'
              ) : 'Awaiting Run'}
            </h3>
            <span className="text-[10px] text-slate-400 block font-mono">
              {activeDrugId && simMetrics[activeDrugId]
                ? `Peak Toxicity: ${Math.round(simMetrics[activeDrugId].peakToxicity)}%`
                : 'Run simulation to evaluate'}
            </span>
          </div>
          <div className="flex items-center gap-1.5 pt-1.5 border-t border-slate-850/50 text-[9px] font-mono text-slate-500">
            CTCAE v5.0 Baseline
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        
        {/* Left Side: Inputs */}
        <div className="xl:col-span-4 bg-slate-900/20 border border-slate-900 rounded-xl p-4 space-y-5">
          <div>
            <h3 className="text-sm font-bold text-slate-200">Multi-Variable Treatment Inputs</h3>
            <p className="text-[10px] text-slate-550 mt-0.5">Select a drug protocol and adjust dosage variables interactively.</p>
          </div>

          {/* Roster & Select active drug */}
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500 font-mono">
                Active Protocol for Customization
              </label>
              {selectedDrugIds.length > 0 ? (
                <select
                  value={activeDrugId}
                  onChange={(e) => handleActiveDrugChange(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 rounded-lg px-3 py-2 text-xs text-slate-250 focus:outline-none focus:border-cyan-500/40"
                >
                  {selectedDrugIds.map(drugId => {
                    const drugObj = getDrugById(drugId);
                    return (
                      <option key={drugId} value={drugId}>
                        {drugObj.name} ({drugObj.class})
                      </option>
                    );
                  })}
                </select>
              ) : (
                <div className="text-[11px] text-slate-550 italic p-3 bg-slate-950/40 border border-slate-850 rounded-lg text-center font-mono">
                  Select drugs below first to customize
                </div>
              )}
            </div>

            {/* Sliders for the active drug */}
            {activeDrugId && (
              <div className="space-y-4 bg-slate-950/40 border border-slate-855 p-3.5 rounded-xl">
                <div className="flex justify-between items-center text-[10px] font-mono">
                  <span className="text-slate-400 font-semibold uppercase">Dosage Intensity</span>
                  <span className="text-cyan-400 font-bold">{dosageIntensity}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="150"
                  value={dosageIntensity}
                  onChange={(e) => setDosageIntensity(Number(e.target.value))}
                  className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />

                <div className="flex justify-between items-center text-[10px] font-mono">
                  <span className="text-slate-400 font-semibold uppercase">Cycle Frequency</span>
                  <span className="text-cyan-400 font-bold">{cycleFrequencyDays} Days</span>
                </div>
                <input
                  type="range"
                  min="7"
                  max="28"
                  value={cycleFrequencyDays}
                  onChange={(e) => setCycleFrequencyDays(Number(e.target.value))}
                  className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />

                <div className="flex justify-between items-center text-[10px] font-mono">
                  <span className="text-slate-400 font-semibold uppercase">Planned Cycles</span>
                  <span className="text-cyan-400 font-bold">{plannedCycles} Cycles</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="12"
                  value={plannedCycles}
                  onChange={(e) => setPlannedCycles(Number(e.target.value))}
                  className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />

                <div className="flex justify-between items-center text-[10px] font-mono">
                  <span className="text-slate-400 font-semibold uppercase">Patient Adherence</span>
                  <span className="text-cyan-400 font-bold">{adherenceRate}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="100"
                  value={adherenceRate}
                  onChange={(e) => setAdherenceRate(Number(e.target.value))}
                  className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
              </div>
            )}
          </div>

          {/* Oncology Drug Assays (Selection list) */}
          <div className="space-y-3">
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">
                Select Assays (Max 4)
              </h4>
            </div>
            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
              {Object.keys(categorizedDrugs).map(catKey => {
                const list = categorizedDrugs[catKey];
                if (list.length === 0) return null;
                
                const catTitle = catKey === 'chemo' ? 'Chemotherapies' :
                                 catKey === 'targeted' ? 'Targeted Therapeutics' :
                                 catKey === 'immuno' ? 'Immunotherapies' : 'Hormone/Other Agents';
                
                return (
                  <div key={catKey} className="space-y-1.5">
                    <h5 className="text-[9px] font-bold uppercase tracking-wider text-slate-650 font-mono">
                      {catTitle}
                    </h5>
                    <div className="grid grid-cols-1 gap-1.5">
                      {list.map(d => {
                        const isSelected = selectedDrugIds.includes(d.id);
                        const isActive = activeDrugId === d.id;
                        const isMaxSelected = selectedDrugIds.length >= 4;
                        return (
                          <div 
                            key={d.id}
                            onClick={() => !d.isContraindicated && handleSelectToggle(d.id)}
                            className={`flex items-center justify-between p-2.5 rounded-lg border text-xs cursor-pointer transition-all duration-200 ${
                              isSelected 
                                ? isActive
                                  ? 'bg-cyan-500/15 border-cyan-500/50 text-cyan-200 shadow-[0_0_15px_rgba(6,182,212,0.1)]'
                                  : 'bg-cyan-500/5 border-cyan-500/20 text-cyan-300'
                                : d.isContraindicated 
                                  ? 'bg-rose-500/5 border-rose-500/10 text-rose-500/70 cursor-not-allowed' 
                                  : 'bg-slate-950/40 border-slate-850 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                            }`}
                          >
                            <div>
                              <div className="font-semibold flex items-center gap-1.5">
                                {d.name}
                                {d.isBestFor && (
                                  <span className="text-[8px] px-1 py-0.1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 rounded uppercase">Indicated</span>
                                )}
                              </div>
                              <span className="text-[9px] text-slate-500 block">{d.class}</span>
                            </div>
                            <div className="text-right">
                              {d.isContraindicated ? (
                                <span className="text-[8px] font-bold text-rose-400 block">{d.contrareason}</span>
                              ) : (
                                <input 
                                  type="checkbox" 
                                  checked={isSelected}
                                  onChange={() => {}}
                                  disabled={isMaxSelected && !isSelected}
                                  className="rounded border-slate-700 bg-slate-800 text-cyan-500 focus:ring-cyan-500 w-3 h-3"
                                />
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            onClick={handleRunSimulations}
            disabled={selectedDrugIds.length === 0 || isRunning}
            className="w-full py-2.5 rounded-xl border border-cyan-500/30 hover:border-cyan-500/50 bg-cyan-500/10 hover:bg-cyan-500/25 text-cyan-400 font-bold uppercase tracking-wider text-xs transition-all duration-300 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            {isRunning ? 'Running Simulation Loop...' : `Run Simulation (${selectedDrugIds.length})`}
          </button>
        </div>

        {/* Right Side: Charts Overlay & Spatial Visualization */}
        <div className="xl:col-span-8 space-y-6">
          
          {/* Main Chart Card */}
          <div className="bg-slate-900/30 backdrop-blur-md border border-slate-900 rounded-xl p-5">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-200">24-Month Tumor Regression Projections</h3>
                <p className="text-[10px] text-slate-550">Overlay graph displaying tumor diameter reductions per simulated drug regimen.</p>
              </div>

              {/* View mode toggle */}
              {Object.keys(simData).length > 0 && !isRunning && (
                <div className="flex bg-slate-950 p-0.5 border border-slate-850 rounded-lg">
                  <button
                    onClick={() => setViewMode('chart')}
                    className={`flex items-center gap-1 px-3 py-1 rounded text-[10px] font-semibold transition-all ${viewMode === 'chart' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'text-slate-500'}`}
                  >
                    Overlay Chart
                  </button>
                  <button
                    onClick={() => setViewMode('table')}
                    className={`flex items-center gap-1 px-3 py-1 rounded text-[10px] font-semibold transition-all ${viewMode === 'table' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'text-slate-500'}`}
                  >
                    <Table className="w-3 h-3" /> Telemetry Log
                  </button>
                </div>
              )}
            </div>

            <div className="h-[300px] w-full">
              {viewMode === 'chart' || isRunning ? (
                <DrugComparisonChart 
                  simulations={simData} 
                  selectedDrugs={selectedDrugIds.map(getDrugById)} 
                  isRunning={isRunning} 
                />
              ) : (
                <div className="overflow-x-auto h-full max-h-[300px] text-xs">
                  <table className="w-full text-left font-mono">
                    <thead>
                      <tr className="border-b border-slate-800 text-[10px] text-slate-500 font-bold">
                        <th className="py-2 px-3">Simulated Drug</th>
                        {sampleIntervals.map(day => (
                          <th key={day} className="py-2 px-3 text-right">Day {day}</th>
                        ))}
                        <th className="py-2 px-3 text-center">Export</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-850">
                      {selectedDrugIds.map(drugId => {
                        const drugObj = getDrugById(drugId);
                        const results = simData[drugId];
                        if (!results) return null;

                        return (
                          <tr key={drugId} className="hover:bg-slate-900/30">
                            <td className="py-3 px-3 font-semibold text-slate-200">{drugObj.name}</td>
                            {sampleIntervals.map(day => {
                              const match = results.find(r => r.day === day) || results[results.length - 1];
                              return (
                                <td key={day} className="py-3 px-3 text-right text-slate-350">
                                  {match.tumorDiameterMm.toFixed(1)} mm
                                  <span className="text-[8px] text-slate-500 block">Tox: {Math.round(match.systemicToxicityScore)}%</span>
                                </td>
                              );
                            })}
                            <td className="py-3 px-3 text-center">
                              <button 
                                onClick={() => handleExportCSV(drugId)}
                                className="p-1.5 rounded bg-slate-950 border border-slate-850 hover:border-cyan-500/40 text-cyan-400 hover:bg-cyan-500/5 transition-all"
                                title="Download Full CSV Report"
                              >
                                <Download className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Biomedical Visualization Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Body Anatomy Card */}
            <div className="md:col-span-5">
              <BodyDiagram cancerType={patient.cancerType} primarySite={patient.primarySite} />
            </div>

            {/* In Silico Predictive Metrics */}
            <div className="md:col-span-7 bg-slate-900/30 border border-slate-900 rounded-xl p-5 flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-850 pb-2 flex items-center gap-1.5 font-mono">
                  <Activity className="w-4 h-4 text-cyan-400" />
                  Digital Twin Spatial Mapping
                </h3>
                <p className="text-[11px] text-slate-400 leading-relaxed font-mono mt-3">
                  Spatial cell tracking projects local tissue density regressions. During peak concentrations of the simulated protocol, cellular mortality forecasts can be mapped back to the 3D digital model.
                </p>
                <div className="grid grid-cols-2 gap-3 mt-4 text-[10px] font-mono">
                  <div className="bg-slate-950/45 p-3 rounded-lg border border-slate-850">
                    <span className="text-slate-500 block uppercase font-bold text-[8px] tracking-wider">Spatial Density</span>
                    <span className="text-cyan-400 font-bold text-xs mt-1 block">42.19% Activity</span>
                  </div>
                  <div className="bg-slate-950/45 p-3 rounded-lg border border-slate-850">
                    <span className="text-slate-500 block uppercase font-bold text-[8px] tracking-wider">Cell Death Rate</span>
                    <span className="text-emerald-400 font-bold text-xs mt-1 block">18.79% daily max</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-850/50 pt-3 mt-4 text-[9px] text-slate-500 font-mono leading-relaxed">
                *Prediction based on Gompertzian boundary modeling. Values will scale dynamically relative to custom dosage inputs.
              </div>
            </div>
          </div>

          {/* Results Comparison Grid */}
          {Object.keys(simMetrics).length > 0 && !isRunning && (
            <div className="space-y-4">
              
              {recommendedDrug && (
                <div className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-xl">
                  <Award className="w-5 h-5 shrink-0" />
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider font-mono">Clinically Advised Protocol Identified</h4>
                    <p className="text-[11px] mt-0.5 leading-relaxed font-mono">
                      <strong>{recommendedDrug.name}</strong> demonstrated an efficacy of <strong>{Math.round(simMetrics[recommendedDrug.id].efficacyScore)}%</strong> in the digital twin simulation. This regimen is highly advised for prescription.
                    </p>
                  </div>
                </div>
              )}

              {/* Drug details cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedDrugIds.map(drugId => (
                  <DrugCard 
                    key={drugId} 
                    drug={getDrugById(drugId)} 
                    isSelected={true} 
                    onSelectToggle={() => {}} 
                    simulationResult={simMetrics[drugId]}
                    disabled={true}
                    onApply={(drug, metrics) => {
                      setPendingDrugToApply(drug);
                      setPendingMetrics(metrics);
                    }}
                  />
                ))}
              </div>

              {/* Save simulation action card */}
              <div className="bg-slate-900/30 border border-slate-900 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
                <div className="flex-1 min-w-[200px]">
                  <span className="text-[9px] uppercase tracking-wider text-slate-500 block font-mono">Assay Record Name</span>
                  <input
                    type="text"
                    value={simulationName}
                    onChange={(e) => setSimulationName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-850 rounded-lg px-3 py-1.5 text-xs text-slate-350 focus:outline-none focus:border-cyan-500/40 mt-1"
                  />
                </div>
                <button
                  onClick={handleSaveAssay}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 hover:bg-cyan-500/20 text-xs font-bold text-cyan-400 transition-all duration-200"
                >
                  <Save className="w-3.5 h-3.5" />
                  {saveSuccess ? 'Assay Saved ✅' : 'Save Assay Record'}
                </button>
              </div>

            </div>
          )}

        </div>

      </div>

      {/* Verification Modal */}
      {pendingDrugToApply && pendingMetrics && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-6 shadow-2xl relative">
            
            {/* Modal Header */}
            <div>
              <div className="flex items-center gap-2 text-cyan-400">
                <ShieldCheck className="w-6 h-6 animate-pulse" />
                <h3 className="text-base font-bold uppercase tracking-wider font-mono">Digital Twin Regimen Verification</h3>
              </div>
              <p className="text-[10px] text-slate-550 font-mono mt-0.5">
                Authorized Verification Trail for {patient.name} (Twin ID: {patient.id})
              </p>
            </div>

            {/* Explanatory Message */}
            <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-850 space-y-2 text-xs font-mono">
              <span className="text-[9px] uppercase tracking-wider text-slate-550 font-bold block">In Silico Clinical Trial Results</span>
              <p className="text-slate-400 leading-relaxed">
                Running 730-day simulations of <strong>{pendingDrugToApply.name}</strong> on the patient's virtual model projected the following safety and response outcomes:
              </p>
              
              <div className="grid grid-cols-2 gap-3 pt-2 text-[10px]">
                <div className="bg-slate-900/60 p-2.5 rounded border border-slate-850">
                  <span className="text-slate-500 block">Projected Shrinkage</span>
                  <span className="text-emerald-400 font-bold text-sm">{Math.round(pendingMetrics.efficacyScore)}%</span>
                </div>
                <div className="bg-slate-900/60 p-2.5 rounded border border-slate-850">
                  <span className="text-slate-500 block">Peak Toxicity Score</span>
                  <span className={`font-bold text-sm ${pendingMetrics.peakToxicity > 70 ? 'text-rose-400' : 'text-slate-200'}`}>
                    {Math.round(pendingMetrics.peakToxicity)}%
                  </span>
                </div>
                <div className="bg-slate-900/60 p-2.5 rounded border border-slate-850">
                  <span className="text-slate-500 block">Nadir Volume</span>
                  <span className="text-slate-200 font-bold">{pendingMetrics.nadirVolume.toFixed(3)} cm³</span>
                </div>
                <div className="bg-slate-900/60 p-2.5 rounded border border-slate-850">
                  <span className="text-slate-500 block">Min. Tumor Diameter</span>
                  <span className="text-slate-200 font-bold">
                    {(2 * Math.pow((3 * pendingMetrics.nadirVolume) / (4 * Math.PI), 1 / 3) * 10).toFixed(1)} mm
                  </span>
                </div>
              </div>
            </div>

            {/* Validation Banner */}
            <div className="flex gap-3 p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-[11px] font-mono text-cyan-300">
              <Info className="w-4 h-4 shrink-0 mt-0.5 text-cyan-400" />
              <div>
                <strong>Clinical Validation:</strong> By confirming, you verify that this drug regimen has been successfully validated on the patient's digital clone. This profile will be synchronized back to the patient's Electronic Health Record (EHR) and marked as an active prescription.
              </div>
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setPendingDrugToApply(null)}
                disabled={prescribeSuccess}
                className="px-4 py-2 rounded-lg bg-slate-950 border border-slate-800 hover:border-slate-700 text-xs font-semibold text-slate-400 hover:text-slate-200 transition-all disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const dateStr = new Date().toISOString().split('T')[0];
                  const certId = `DT-VER-${Math.floor(100000 + Math.random() * 900000)}`;
                  const newRegimen = {
                    id: `tx-${Date.now()}`,
                    type: pendingDrugToApply.class.includes('Chemo') ? 'Chemotherapy' : 
                          pendingDrugToApply.class.includes('Targeted') ? 'Targeted Therapy' :
                          pendingDrugToApply.class.includes('Immuno') ? 'Immunotherapy' : 'Systemic Therapy',
                    regimen: pendingDrugToApply.name,
                    startDate: dateStr,
                    endDate: 'Ongoing',
                    cycles: `${pendingDrugToApply.plannedCycles} Cycles`,
                    response: `Verified on Digital Twin. Projected Shrinkage: ${Math.round(pendingMetrics.efficacyScore)}%. Toxicity: ${Math.round(pendingMetrics.peakToxicity)}%. Certificate: ${certId}`,
                    isTwinVerified: true,
                    verificationCert: certId,
                    simulatedEfficacy: pendingMetrics.efficacyScore,
                    simulatedToxicity: pendingMetrics.peakToxicity
                  };
                  const updatedHistory = [newRegimen, ...patient.treatmentHistory];
                  const updatedPatient = {
                    ...patient,
                    treatmentHistory: updatedHistory
                  };
                  updatePatient(updatedPatient);
                  setPatient(updatedPatient);
                  setPrescribeSuccess(true);
                  setTimeout(() => {
                    setPrescribeSuccess(false);
                    setPendingDrugToApply(null);
                  }, 2000);
                }}
                disabled={prescribeSuccess}
                className="px-4 py-2 rounded-lg bg-cyan-500/15 border border-cyan-500/40 hover:bg-cyan-500/25 text-xs font-bold text-cyan-400 transition-all flex items-center gap-1.5 active:scale-95 disabled:bg-emerald-500/10 disabled:border-emerald-500/20 disabled:text-emerald-450"
              >
                {prescribeSuccess ? 'Prescribed & Synced! ✅' : 'Verify & Prescribe Regimen'}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

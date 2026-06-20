import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPatientById } from '../../data/mockPatients';
import { ArrowLeft, Calendar, FileText, CheckCircle, AlertTriangle, AlertCircle } from 'lucide-react';
import { formatDate } from '../../utils/formatters';

export default function ResultsPage() {
  const { id } = useParams();
  const patient = useMemo(() => getPatientById(id), [id]);
  const [savedSims, setSavedSims] = useState([]);

  useEffect(() => {
    if (!patient) return;
    const key = `saved_simulations_${patient.id}`;
    const data = localStorage.getItem(key);
    if (data) {
      setSavedSims(JSON.parse(data));
    }
  }, [patient]);

  const handleDelete = (simId) => {
    const updated = savedSims.filter(sim => sim.id !== simId);
    setSavedSims(updated);
    const key = `saved_simulations_${patient.id}`;
    localStorage.setItem(key, JSON.stringify(updated));
  };

  if (!patient) {
    return (
      <div className="text-center py-12">
        <p className="text-rose-450 font-mono text-sm">Patient not found</p>
        <Link to="/doctor/patients" className="text-xs text-cyan-400 hover:underline">Return to directory</Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          to={`/doctor/patient/${patient.id}`}
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Digital Twin
        </Link>
        <span className="text-xs text-slate-500 font-mono">
          Saved Assays Directory
        </span>
      </div>

      <div>
        <h2 className="text-xl font-bold text-slate-100">Saved Simulation Assays</h2>
        <p className="text-xs text-slate-500">Historical comparative treatment records for {patient.name}</p>
      </div>

      {savedSims.length > 0 ? (
        <div className="space-y-4 max-w-3xl">
          {savedSims.map((sim) => (
            <div key={sim.id} className="bg-slate-900/30 backdrop-blur-md border border-slate-900 rounded-xl p-5 space-y-4">
              
              {/* Header */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-850 pb-3">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-bold text-slate-200">{sim.name}</span>
                </div>
                <div className="flex items-center gap-4 text-[10px] text-slate-500 font-mono">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {formatDate(sim.date)}
                  </span>
                  <button 
                    onClick={() => handleDelete(sim.id)}
                    className="text-rose-450 hover:text-rose-350 hover:underline"
                  >
                    Delete Record
                  </button>
                </div>
              </div>

              {/* Grid of Simulated Drugs */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {sim.selectedDrugs.map(d => (
                  <div key={d.id} className="bg-slate-950/40 border border-slate-850 rounded-lg p-3 space-y-2">
                    <div>
                      <h4 className="text-[11px] font-bold text-slate-300">{d.name}</h4>
                      <span className="text-[8px] text-slate-550 block font-mono uppercase">{d.class.replace('Chemotherapy', 'Chemo')}</span>
                    </div>

                    <div className="flex justify-between items-center text-[10px] font-mono">
                      <span className="text-slate-500">Efficacy:</span>
                      <span className={`font-bold ${d.efficacyScore >= 75 ? 'text-emerald-400' : d.efficacyScore >= 50 ? 'text-amber-400' : 'text-rose-400'}`}>
                        {Math.round(d.efficacyScore)}%
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-[10px] font-mono">
                      <span className="text-slate-500">Toxicity:</span>
                      <span className={`font-bold ${d.peakToxicity > 70 ? 'text-rose-400' : 'text-slate-350'}`}>
                        {Math.round(d.peakToxicity)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          ))}
        </div>
      ) : (
        <div className="bg-slate-900/10 border border-dashed border-slate-900 rounded-xl p-8 text-center max-w-3xl">
          <p className="text-slate-550 text-xs font-mono mb-4">No historical assays have been saved for this patient yet.</p>
          <Link
            to={`/doctor/patient/${patient.id}/simulate`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-cyan-500/30 hover:border-cyan-500/50 bg-cyan-500/10 text-xs font-bold text-cyan-400 transition-all duration-200"
          >
            Launch Simulator
          </Link>
        </div>
      )}

    </div>
  );
}

import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getPatientById } from '../../data/mockPatients';
import TreatmentTimeline from '../../components/TreatmentTimeline';
import { Calendar, ShieldCheck, Database, RefreshCw } from 'lucide-react';

export default function TreatmentTimelinePage() {
  const { user } = useAuth();
  const [patient, setPatient] = useState(() => getPatientById(user?.id));

  useEffect(() => {
    setPatient(getPatientById(user?.id));
  }, [user]);

  useEffect(() => {
    const handleUpdate = () => {
      setPatient(getPatientById(user?.id));
    };
    window.addEventListener('onco_patient_updated', handleUpdate);
    return () => window.removeEventListener('onco_patient_updated', handleUpdate);
  }, [user]);

  if (!patient) {
    return (
      <div className="text-center py-12 text-rose-455 font-mono text-xs">
        Timeline records not found.
      </div>
    );
  }

  // Count active vs completed cycles
  const stats = useMemo(() => {
    const total = patient.treatmentHistory.length;
    const ongoing = patient.treatmentHistory.filter(tx => tx.endDate === 'Ongoing').length;
    const completed = total - ongoing;
    return { total, ongoing, completed };
  }, [patient]);

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          My Treatment History
          <span className="text-[10px] px-2 py-0.2 rounded border border-slate-800 text-slate-500 font-mono font-normal">
            Timeline Record
          </span>
        </h2>
        <p className="text-xs text-slate-500 font-mono">Chronological index of clinical interventions, cycles, and tumor responses.</p>
      </div>

      {/* EHR Source Card */}
      <div className="bg-slate-900/40 border border-slate-900 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[9px] uppercase font-bold tracking-wider text-slate-500 block font-mono">Electronic Health Records (EHR) Link</span>
            <span className="text-xs font-semibold text-slate-200">HL7 FHIR API (v4.0.1) Connection</span>
            <span className="text-[10px] text-cyan-400 font-mono block mt-0.5">Source: Metro Cancer Institute Clinical Registry</span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold">
            <ShieldCheck className="w-3.5 h-3.5" /> Verified Sync
          </span>
          <span className="text-slate-500">Last Synced: Today, 08:30 AM</span>
        </div>
      </div>

      {/* Summary KPI */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-slate-900/40 border border-slate-900 rounded-xl p-4">
          <span className="text-[9px] uppercase font-bold tracking-wider text-slate-500 block font-mono">Total Regimens</span>
          <div className="text-lg font-bold text-slate-200 mt-1 font-mono">{stats.total}</div>
        </div>
        <div className="bg-slate-900/40 border border-slate-900 rounded-xl p-4">
          <span className="text-[9px] uppercase font-bold tracking-wider text-slate-500 block font-mono">Completed</span>
          <div className="text-lg font-bold text-emerald-400 mt-1 font-mono">{stats.completed}</div>
        </div>
        <div className="bg-slate-900/40 border border-slate-900 rounded-xl p-4">
          <span className="text-[9px] uppercase font-bold tracking-wider text-slate-500 block font-mono">Ongoing / Active</span>
          <div className="text-lg font-bold text-cyan-400 mt-1 font-mono">{stats.ongoing}</div>
        </div>
      </div>

      {/* Vertical Timeline */}
      <div className="max-w-2xl bg-slate-900/10 border border-slate-900/40 rounded-2xl p-6">
        <TreatmentTimeline history={patient.treatmentHistory} />
      </div>

    </div>
  );
}

import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPatientsByDoctorSpecialty } from '../../data/mockPatients';
import { Search, Filter, ArrowRight, UserPlus } from 'lucide-react';

export default function PatientListPage() {
  const [search, setSearch] = useState('');
  const [cancerFilter, setCancerFilter] = useState('All');
  const [patients, setPatients] = useState(() => getPatientsByDoctorSpecialty('all'));

  useEffect(() => {
    const handleUpdate = () => {
      setPatients(getPatientsByDoctorSpecialty('all'));
    };
    window.addEventListener('onco_patient_updated', handleUpdate);
    return () => window.removeEventListener('onco_patient_updated', handleUpdate);
  }, []);

  // Filter list
  const filteredPatients = useMemo(() => {
    return patients.filter((p) => {
      const matchSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.id.toLowerCase().includes(search.toLowerCase());
      
      const matchFilter =
        cancerFilter === 'All' || p.cancerType === cancerFilter;

      return matchSearch && matchFilter;
    });
  }, [patients, search, cancerFilter]);

  // Color mapping for cancer type badges
  const badgeColors = {
    Breast: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    Lung: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    Colorectal: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    Ovarian: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
    Prostate: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    Pancreatic: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  };

  const stageColors = {
    'Stage I': 'bg-slate-500/10 text-slate-400 border-slate-500/20',
    'Stage II': 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    'Stage III': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    'Stage IV': 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100">Patient Directory</h2>
          <p className="text-xs text-slate-500">Access and simulate clinical digital twin records</p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-wrap items-center gap-4 bg-slate-900/20 border border-slate-900 p-4 rounded-xl">
        <div className="flex-1 min-w-[200px] relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search patient name, ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950 border border-slate-850 rounded-lg pl-10 pr-4 py-2 text-xs text-slate-200 placeholder-slate-650 focus:outline-none focus:border-cyan-500/40"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-500" />
          <select
            value={cancerFilter}
            onChange={(e) => setCancerFilter(e.target.value)}
            className="bg-slate-950 border border-slate-850 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-cyan-500/40"
          >
            <option value="All">All Cancer Types</option>
            <option value="Breast">Breast Oncology</option>
            <option value="Lung">Thoracic Oncology</option>
            <option value="Colorectal">Gastrointestinal (Colorectal)</option>
            <option value="Ovarian">Gyn Oncology (Ovarian)</option>
            <option value="Prostate">Genitourinary (Prostate)</option>
            <option value="Pancreatic">Gastrointestinal (Pancreatic)</option>
          </select>
        </div>
      </div>

      {/* Patient Grid/Table */}
      <div className="bg-slate-900/40 backdrop-blur-md border border-slate-900 rounded-xl overflow-hidden shadow-xl">
        {filteredPatients.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-900 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                  <th className="px-6 py-4">Patient Profile</th>
                  <th className="px-6 py-4">Oncology Classification</th>
                  <th className="px-6 py-4">Biomarkers & Stage</th>
                  <th className="px-6 py-4">Current Vitals</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900/50">
                {filteredPatients.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-900/30 transition-colors">
                    
                    {/* Patient identity */}
                    <td className="px-6 py-4">
                      <div>
                        <span className="font-mono text-[10px] text-slate-500 block mb-0.5">{p.id}</span>
                        <div className="font-bold text-slate-200 text-sm">{p.name}</div>
                        <span className="text-[10px] text-slate-500">{p.gender}, Age {p.age}</span>
                      </div>
                    </td>

                    {/* Cancer classification */}
                    <td className="px-6 py-4">
                      <div>
                        <span className={`inline-flex px-2 py-0.5 rounded border text-[9px] font-bold uppercase tracking-wider mb-1 ${badgeColors[p.cancerType] || 'bg-slate-500/10 border-slate-500/20 text-slate-400'}`}>
                          {p.cancerType}
                        </span>
                        <div className="text-slate-300 font-semibold">{p.subtype}</div>
                        <span className="text-[10px] text-slate-500">{p.primarySite}</span>
                      </div>
                    </td>

                    {/* Biomarkers / Stage */}
                    <td className="px-6 py-4 font-mono">
                      <div className="space-y-1">
                        <div className="flex gap-1.5 flex-wrap">
                          <span className={`inline-flex px-2 py-0.5 rounded border text-[9px] font-bold ${stageColors[p.stage] || 'bg-slate-500/10 border-slate-500/20 text-slate-400'}`}>
                            {p.stage}
                          </span>
                          {p.biomarkers.HER2 === 'Positive' && (
                            <span className="inline-flex px-1.5 py-0.2 rounded border border-rose-500/20 bg-rose-500/5 text-[8px] text-rose-400 font-bold">HER2+</span>
                          )}
                          {p.biomarkers.EGFR_Mutation === 'Detected' && (
                            <span className="inline-flex px-1.5 py-0.2 rounded border border-cyan-500/20 bg-cyan-500/5 text-[8px] text-cyan-400 font-bold">EGFR+</span>
                          )}
                          {p.biomarkers.BRCA_Mutation.includes('Detected') && (
                            <span className="inline-flex px-1.5 py-0.2 rounded border border-violet-500/20 bg-violet-500/5 text-[8px] text-violet-400 font-bold">BRCA+</span>
                          )}
                        </div>
                        <span className="text-[9px] text-slate-500 block">Ki67 Index: {p.biomarkers.Ki67_Index}%</span>
                      </div>
                    </td>

                    {/* Vitals */}
                    <td className="px-6 py-4 font-mono">
                      <div>
                        <div className="text-slate-300">BP: {p.vitals.bloodPressure}</div>
                        <div className="text-[10px] text-slate-500">SpO2: {p.vitals.spo2}% | HR: {p.vitals.heartRate} bpm</div>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-center">
                      <Link
                        to={`/doctor/patient/${p.id}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-800 hover:border-cyan-500/30 bg-slate-950/50 hover:bg-cyan-500/5 text-[10px] font-bold text-slate-350 hover:text-cyan-400 transition-all duration-300 group"
                      >
                        Open Digital Twin
                        <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-slate-550 text-xs font-mono">No patient records found matching the query</p>
          </div>
        )}
      </div>

    </div>
  );
}

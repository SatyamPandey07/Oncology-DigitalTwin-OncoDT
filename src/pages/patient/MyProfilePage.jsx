import React, { useState, useMemo, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getPatientById } from '../../data/mockPatients';
import BodyDiagram from '../../components/BodyDiagram';
import GenomicPanel from '../../components/GenomicPanel';
import LabResultsTable from '../../components/LabResultsTable';
import { User, ClipboardList, TableProperties, Image, ShieldCheck, Heart, Dna, Activity } from 'lucide-react';
import { formatDate } from '../../utils/formatters';

export default function MyProfilePage() {
  const { user } = useAuth();
  const [patient, setPatient] = useState(() => getPatientById(user?.id));
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'genomics' | 'labs' | 'imaging'

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
      <div className="text-center py-12 text-rose-400 font-mono text-xs">
        Clinical record not found for patient identity.
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'My Clinical Profile', icon: User },
    { id: 'genomics', label: 'My Biomarkers', icon: ClipboardList },
    { id: 'labs', label: 'My Lab Results', icon: TableProperties },
    { id: 'imaging', label: 'My Imaging Reports', icon: Image },
  ];

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          Health Profile Dashboard
          <span className="text-[10px] px-2 py-0.2 rounded border border-slate-800 text-slate-500 font-mono font-normal">
            Twin ID: {patient.id}
          </span>
        </h2>
        <p className="text-xs text-slate-500 font-mono">Personalized Digital Twin Clinical Roster</p>
      </div>

      {/* Patient header info */}
      <div className="bg-slate-900/40 backdrop-blur-md border border-slate-900 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-slate-950 border border-slate-850 flex items-center justify-center text-slate-400 font-mono font-bold text-xs">
            {patient.bloodType}
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-200">{patient.name}</h3>
            <p className="text-[10px] text-slate-400">
              {patient.gender} • {patient.age} years • DOB: {formatDate(patient.dob)}
            </p>
          </div>
        </div>

        <div className="flex gap-4 font-mono text-[10px] border-t md:border-t-0 border-slate-850 pt-3 md:pt-0">
          <div>
            <span className="text-slate-500 block">Oncology Category</span>
            <span className="text-slate-300 font-semibold">{patient.cancerType} ({patient.subtype})</span>
          </div>
          <div>
            <span className="text-slate-500 block">Current Stage</span>
            <span className="text-rose-400 font-semibold">{patient.stage}</span>
          </div>
        </div>
      </div>

      {/* Tab Menu */}
      <div className="flex flex-wrap border-b border-slate-900 gap-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold transition-all duration-300 border-b-2 -mb-px ${
                isActive
                  ? 'border-violet-500 text-violet-400'
                  : 'border-transparent text-slate-550 hover:text-slate-350'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Panel */}
      <div className="bg-slate-950/20 rounded-xl">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Demographics details */}
            <div className="bg-slate-900/20 border border-slate-900 rounded-xl p-5 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-850 pb-2">
                Biological Identity
              </h3>
              <div className="space-y-3 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-500">Emergency Contact</span>
                  <span className="text-slate-300 text-right">{patient.emergencyContact}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Height</span>
                  <span className="text-slate-300">{patient.heightCm} cm</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Weight</span>
                  <span className="text-slate-300">{patient.weightKg} kg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">BMI</span>
                  <span className="text-slate-300">{patient.bmi}</span>
                </div>
              </div>
            </div>

            {/* Diagnosis details */}
            <div className="bg-slate-900/20 border border-slate-900 rounded-xl p-5 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-850 pb-2">
                Cancer Diagnosis Profile
              </h3>
              <div className="space-y-3 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-500">Diagnosis Type</span>
                  <span className="text-slate-300">{patient.subtype}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Tumor Grade</span>
                  <span className="text-slate-300">{patient.grade}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Primary Tumor Location</span>
                  <span className="text-slate-300">{patient.primarySite}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Lymph Nodes Status</span>
                  <span className="text-slate-300">{patient.lymphNodeInvolvement}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Distant Metastasis</span>
                  <span className="text-slate-300">{patient.metastasis}</span>
                </div>
              </div>
            </div>

            {/* Anatomical body diagram */}
            <div className="lg:col-span-1">
              <BodyDiagram cancerType={patient.cancerType} primarySite={patient.primarySite} />
            </div>

            {/* NGS Quality Report */}
            <div className="bg-slate-900/20 border border-slate-900 rounded-xl p-5 space-y-4 lg:col-span-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-850 pb-2 flex items-center gap-1.5">
                <Dna className="w-4 h-4 text-cyan-400 animate-pulse" />
                Next-Generation Sequencing (NGS) Quality Report
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
                <div className="bg-slate-950/45 p-3 rounded-lg border border-slate-850">
                  <span className="text-slate-500 block text-[9px] uppercase font-bold">Platform</span>
                  <span className="text-slate-300 font-semibold">Illumina NovaSeq 6000</span>
                </div>
                <div className="bg-slate-950/45 p-3 rounded-lg border border-slate-850">
                  <span className="text-slate-500 block text-[9px] uppercase font-bold">Target Coverage Depth</span>
                  <span className="text-slate-300 font-semibold">350x depth</span>
                </div>
                <div className="bg-slate-950/45 p-3 rounded-lg border border-slate-850">
                  <span className="text-slate-500 block text-[9px] uppercase font-bold">Base Accuracy Score</span>
                  <span className="text-slate-300 font-semibold">98.4% (Q30 score)</span>
                </div>
                <div className="bg-slate-950/45 p-3 rounded-lg border border-slate-850">
                  <span className="text-slate-500 block text-[9px] uppercase font-bold">Registry Validation</span>
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Clinically Certified
                  </span>
                </div>
              </div>
            </div>

          </div>
        )}

        {activeTab === 'genomics' && (
          <GenomicPanel biomarkers={patient.biomarkers} />
        )}

        {activeTab === 'labs' && (
          <LabResultsTable labs={patient.labs} />
        )}

        {activeTab === 'imaging' && (
          <div className="space-y-4">
            {patient.imagingHistory.map((img, idx) => (
              <div key={idx} className="bg-slate-900/40 border border-slate-900 rounded-xl p-4 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-850 pb-2 text-[11px] font-mono">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-300 uppercase">{img.modality}</span>
                    <span className="text-slate-555">•</span>
                    <span className="text-slate-400 font-medium">{img.region}</span>
                  </div>
                  <span className="text-slate-500">{formatDate(img.date)}</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed font-mono">
                  {img.findings}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}

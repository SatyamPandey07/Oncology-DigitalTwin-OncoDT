import React, { useState, useMemo, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPatientById } from '../../data/mockPatients';
import BodyDiagram from '../../components/BodyDiagram';
import GenomicPanel from '../../components/GenomicPanel';
import LabResultsTable from '../../components/LabResultsTable';
import TreatmentTimeline from '../../components/TreatmentTimeline';
import VitalsGauges from '../../components/VitalsGauges';
import AIDiagnosticsPanel from '../../components/AIDiagnosticsPanel';
import { User, ClipboardList, Activity, TableProperties, ShieldCheck, Image, History, ArrowLeft, Play, BarChart2, Dna, ShieldAlert } from 'lucide-react';
import { formatDate } from '../../utils/formatters';

export default function PatientDetailPage() {
  const { id } = useParams();
  const [patient, setPatient] = useState(() => getPatientById(id));
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'diagnostics' | 'vitals' | 'genomics' | 'labs' | 'treatments' | 'imaging'

  useEffect(() => {
    setPatient(getPatientById(id));
  }, [id]);

  useEffect(() => {
    const handleUpdate = () => {
      setPatient(getPatientById(id));
    };
    window.addEventListener('onco_patient_updated', handleUpdate);
    return () => window.removeEventListener('onco_patient_updated', handleUpdate);
  }, [id]);

  if (!patient) {
    return (
      <div className="text-center py-12">
        <p className="text-rose-450 font-mono text-sm">Patient Twin Record ({id}) not found</p>
        <Link to="/doctor/patients" className="text-xs text-cyan-400 hover:underline mt-4 inline-block">
          Return to directory
        </Link>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview Profile', icon: User },
    { id: 'diagnostics', label: 'AI Diagnostics & Insights', icon: ShieldAlert },
    { id: 'vitals', label: 'Body Vitals', icon: Activity },
    { id: 'genomics', label: 'Biomarkers & Genomics', icon: ClipboardList },
    { id: 'labs', label: 'Lab Results', icon: TableProperties },
    { id: 'treatments', label: 'Treatment History', icon: History },
    { id: 'imaging', label: 'Imaging History', icon: Image },
  ];

  return (
    <div className="space-y-6">
      
      {/* Top breadcrumb & navigation bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link
          to="/doctor/patients"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Directory
        </Link>

        <div className="flex gap-2">
          <Link
            to={`/doctor/patient/${patient.id}/simulate`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-cyan-500/30 hover:border-cyan-500/50 bg-cyan-500/10 hover:bg-cyan-500/20 text-xs font-bold text-cyan-400 transition-all duration-200 active:scale-95"
          >
            <Play className="w-3.5 h-3.5 fill-current" /> Run Multi-Drug Simulator
          </Link>
          <Link
            to={`/doctor/patient/${patient.id}/results`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-800 hover:border-slate-700 bg-slate-900/40 text-xs font-bold text-slate-350 transition-all duration-200 active:scale-95"
          >
            <BarChart2 className="w-3.5 h-3.5" /> View Saved Assays
          </Link>
        </div>
      </div>

      {/* Patient header card */}
      <div className="bg-slate-900/40 backdrop-blur-md border border-slate-900 rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-500 font-mono font-bold text-sm">
            {patient.bloodType}
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-200 flex items-center gap-2">
              {patient.name}
              <span className="text-[10px] px-2 py-0.2 rounded border border-slate-800 text-slate-500 font-mono font-normal">
                {patient.id}
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {patient.gender} • {patient.age} years old • DOB: {formatDate(patient.dob)}
            </p>
          </div>
        </div>

        <div className="flex gap-4 md:gap-8 font-mono text-xs border-t md:border-t-0 border-slate-850 pt-4 md:pt-0">
          <div>
            <span className="text-slate-500 block">Diagnosed Site</span>
            <span className="text-slate-300 font-semibold">{patient.primarySite}</span>
          </div>
          <div>
            <span className="text-slate-550 block">Staging</span>
            <span className="text-rose-400 font-semibold">{patient.stage}</span>
          </div>
          <div>
            <span className="text-slate-550 block">ECOG Status</span>
            <span className="text-slate-300 font-semibold">{patient.ecogStatus}</span>
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
                  ? 'border-cyan-500 text-cyan-400'
                  : 'border-transparent text-slate-555 hover:text-slate-300'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab content panel */}
      <div className="bg-slate-950/20 rounded-xl">
        {activeTab === 'diagnostics' && (
          <AIDiagnosticsPanel patient={patient} />
        )}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Demographics details */}
            <div className="bg-slate-900/20 border border-slate-900 rounded-xl p-5 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-850 pb-2">
                Demographics & Identity
              </h3>
              <div className="space-y-3 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-500">Emergency Contact</span>
                  <span className="text-slate-300 text-right">{patient.emergencyContact}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Contact Number</span>
                  <span className="text-slate-300">{patient.phone}</span>
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

            {/* Cancer Diagnosis Profile */}
            <div className="bg-slate-900/20 border border-slate-900 rounded-xl p-5 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-850 pb-2">
                Cancer Diagnosis Profile
              </h3>
              <div className="space-y-3 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-500">Histological Subtype</span>
                  <span className="text-slate-300">{patient.subtype}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Tumor Grade</span>
                  <span className="text-slate-300">{patient.grade}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Initial Size at Diagnosis</span>
                  <span className="text-slate-300">{patient.tumorInitialDiameterMm} mm</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Nodal Involvement</span>
                  <span className="text-slate-300">{patient.lymphNodeInvolvement}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Distant Metastasis</span>
                  <span className="text-slate-300">{patient.metastasis}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">ECOG / Karnofsky Status</span>
                  <span className="text-slate-300">{patient.ecogStatus} / {patient.karnofskyScore}%</span>
                </div>
              </div>
            </div>

            {/* Body Diagram hotspot */}
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
                  <span className="text-slate-550 block text-[9px] uppercase font-bold">Platform</span>
                  <span className="text-slate-300 font-semibold">Illumina NovaSeq 6000</span>
                </div>
                <div className="bg-slate-950/45 p-3 rounded-lg border border-slate-850">
                  <span className="text-slate-550 block text-[9px] uppercase font-bold">Target Coverage Depth</span>
                  <span className="text-slate-300 font-semibold">350x depth</span>
                </div>
                <div className="bg-slate-950/45 p-3 rounded-lg border border-slate-850">
                  <span className="text-slate-550 block text-[9px] uppercase font-bold">Base Accuracy Score</span>
                  <span className="text-slate-300 font-semibold">98.4% (Q30 score)</span>
                </div>
                <div className="bg-slate-950/45 p-3 rounded-lg border border-slate-850">
                  <span className="text-slate-550 block text-[9px] uppercase font-bold">Registry Validation</span>
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Clinically Certified
                  </span>
                </div>
              </div>
            </div>

          </div>
        )}

        {activeTab === 'vitals' && (
          <VitalsGauges vitals={patient.vitals} />
        )}

        {activeTab === 'genomics' && (
          <GenomicPanel biomarkers={patient.biomarkers} />
        )}

        {activeTab === 'labs' && (
          <LabResultsTable labs={patient.labs} />
        )}

        {activeTab === 'treatments' && (
          <div className="max-w-3xl">
            <TreatmentTimeline history={patient.treatmentHistory} />
          </div>
        )}

        {activeTab === 'imaging' && (
          <div className="space-y-4">
            {patient.imagingHistory.map((img, idx) => (
              <div key={idx} className="bg-slate-900/40 border border-slate-900 rounded-xl p-4 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-850 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-300 font-mono uppercase">
                      {img.modality}
                    </span>
                    <span className="text-[10px] text-slate-500">•</span>
                    <span className="text-xs text-slate-400 font-medium">
                      {img.region}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {formatDate(img.date)}
                  </span>
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

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Activity, ShieldAlert, Key, User, Calendar, ClipboardList, Info } from 'lucide-react';

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState('doctor'); // 'doctor' | 'patient'
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [patientId, setPatientId] = useState('');
  const [dob, setDob] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { loginDoctor, loginPatient } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      if (activeTab === 'doctor') {
        const res = loginDoctor(username, password);
        if (res.success) {
          navigate('/doctor/patients');
        } else {
          setError(res.error);
        }
      } else {
        const res = loginPatient(patientId, dob);
        if (res.success) {
          navigate('/patient/profile');
        } else {
          setError(res.error);
        }
      }
      setIsLoading(false);
    }, 600); // Small delay for realistic feel
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-cyan-500/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-80 h-80 rounded-full bg-violet-500/10 blur-[100px] pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-md bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 md:p-8 shadow-2xl relative z-10">
        
        {/* App Title */}
        <div className="text-center mb-6">
          <div className="inline-flex p-3 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded-xl mb-3">
            <Activity className="w-6 h-6 animate-pulse" />
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 via-indigo-400 to-violet-400 bg-clip-text text-transparent">
            ONCOGEN-DT
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Oncology Digital Twin & Multi-Regimen Treatment Simulator
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex bg-slate-950 p-1 border border-slate-850 rounded-xl mb-6">
          <button
            onClick={() => { setActiveTab('doctor'); setError(''); }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all duration-300 ${activeTab === 'doctor' ? 'bg-cyan-500/10 border border-cyan-500/20 text-cyan-400' : 'text-slate-500 hover:text-slate-300'}`}
          >
            Clinician Portal
          </button>
          <button
            onClick={() => { setActiveTab('patient'); setError(''); }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all duration-300 ${activeTab === 'patient' ? 'bg-violet-500/10 border border-violet-500/20 text-violet-400' : 'text-slate-500 hover:text-slate-300'}`}
          >
            Patient Portal
          </button>
        </div>

        {error && (
          <div className="flex items-center gap-2 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs p-3 rounded-lg mb-4">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {activeTab === 'doctor' ? (
            <>
              {/* Doctor inputs */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500 font-mono flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" /> Clinician Username
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. dr.mehta"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500 font-mono flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5" /> Security Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20"
                />
              </div>
            </>
          ) : (
            <>
              {/* Patient inputs */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500 font-mono flex items-center gap-1.5">
                  <ClipboardList className="w-3.5 h-3.5" /> Patient ID
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. PT-2024-00147"
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500 font-mono flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" /> Date of Birth
                </label>
                <input
                  type="date"
                  required
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20"
                />
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-2.5 mt-2 rounded-xl text-xs font-bold border uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 ${
              activeTab === 'doctor'
                ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20 active:scale-95'
                : 'bg-violet-500/10 border-violet-500/30 text-violet-400 hover:bg-violet-500/20 active:scale-95'
            }`}
          >
            {isLoading ? (
              <span className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
            ) : (
              'Authenticate Access'
            )}
          </button>
        </form>
      </div>

      {/* Demo Credentials Help Box */}
      <div className="w-full max-w-md mt-6 bg-slate-900/30 border border-slate-850 rounded-2xl p-4 text-[10px] text-slate-400 font-mono space-y-3 z-10">
        <div className="font-bold text-slate-300 uppercase tracking-wider border-b border-slate-850 pb-1.5 flex items-center gap-1">
          <Info className="w-3.5 h-3.5 text-cyan-400" /> Demo Credentials Guide
        </div>
        <div className="space-y-2">
          <div>
            <span className="text-cyan-400 font-bold block">Clinicians:</span>
            • Username: <span className="text-slate-200">dr.mehta</span> / Password: <span className="text-slate-200">onco2024</span> (Breast specialty)<br/>
            • Username: <span className="text-slate-200">dr.chen</span> / Password: <span className="text-slate-200">onco2024</span> (Thoracic specialty)
          </div>
          <div>
            <span className="text-violet-400 font-bold block">Patients:</span>
            • Patient ID: <span className="text-slate-200">PT-2024-00147</span> / DOB: <span className="text-slate-200 font-bold">1974-03-15</span> (Breast stage III)<br/>
            • Patient ID: <span className="text-slate-200">PT-2024-00289</span> / DOB: <span className="text-slate-200 font-bold">1962-08-22</span> (Lung stage IV)
          </div>
        </div>
      </div>
    </div>
  );
}

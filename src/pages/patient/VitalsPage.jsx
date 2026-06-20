import React, { useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getPatientById } from '../../data/mockPatients';
import VitalsGauges from '../../components/VitalsGauges';
import { Heart, Activity, Wifi, Battery, RefreshCw, Layers, Calendar, Clock, Bell, User, CheckCircle2, ShieldCheck, HelpCircle } from 'lucide-react';

export default function VitalsPage() {
  const { user } = useAuth();
  const patient = useMemo(() => getPatientById(user?.id), [user]);

  if (!patient) {
    return (
      <div className="text-center py-12 text-rose-455 font-mono text-xs">
        Vitals records not found.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Patient Health Dashboard Header Bar */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl px-5 py-3 flex flex-wrap items-center justify-between gap-4 shadow-lg backdrop-blur-md">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 font-mono">Patient Health Dashboard</span>
          <h2 className="text-sm font-bold text-slate-300 font-mono mt-0.5">
            {patient.name} | {patient.age} YRS | {patient.gender === 'Female' ? 'F' : 'M'} | ID: {patient.id}
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-1.5 rounded-lg bg-slate-950 border border-slate-850 hover:border-slate-700 text-slate-400 hover:text-slate-200">
            <Bell className="w-4 h-4" />
          </button>
          <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-750 flex items-center justify-center text-xs font-bold text-violet-400">
            {patient.name.charAt(0)}
          </div>
        </div>
      </div>

      {/* Welcome Back Card */}
      <div className="bg-slate-900/20 border border-slate-900 rounded-xl p-5">
        <h3 className="text-base font-extrabold text-slate-100">Welcome Back, {patient.name.split(' ')[0]}!</h3>
        <p className="text-xs text-slate-400 mt-1 font-mono">Your health summary is stable.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        
        {/* Main/Left Side */}
        <div className="xl:col-span-8 space-y-6">
          {/* Vitals Section */}
          <div className="space-y-3">
            <h4 className="text-[10px] uppercase font-bold tracking-wider text-slate-500 font-mono">Vitals Feeds</h4>
            <VitalsGauges vitals={patient.vitals} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Medication Adherence */}
            <div className="bg-slate-900/30 border border-slate-900 rounded-xl p-5 flex flex-col justify-between min-h-[180px]">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block font-mono">Medication Adherence</span>
                <h3 className="text-2xl font-black text-violet-400 mt-2">95% - Active</h3>
                <div className="w-full bg-slate-955 h-2 rounded-full overflow-hidden mt-3 border border-slate-850">
                  <div className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full" style={{ width: '95%' }} />
                </div>
              </div>
              <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400 mt-4 border-t border-slate-850/50 pt-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Daily schedule completed for today</span>
              </div>
            </div>

            {/* Upcoming Appointment */}
            <div className="bg-slate-900/30 border border-slate-900 rounded-xl p-5 flex flex-col justify-between min-h-[180px]">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block font-mono">Upcoming Appointment</span>
                <h3 className="text-lg font-bold text-slate-200 mt-2">Oct 27, 2:00 PM</h3>
                <span className="text-[10px] text-slate-400 block font-mono mt-0.5">Dr. A. Chen - Cardiology</span>
              </div>
              <div className="pt-3">
                <button className="px-3 py-1.5 rounded-lg bg-violet-500/10 border border-violet-500/30 hover:bg-violet-500/20 text-[10px] font-bold text-violet-450 uppercase tracking-wider transition-all duration-200 active:scale-95">
                  Remind Me
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right/Sidebar Side */}
        <div className="xl:col-span-4 space-y-6">
          {/* Treatment Timeline Calendar */}
          <div className="bg-slate-900/30 border border-slate-900 rounded-xl p-5 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-850 pb-2">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 font-mono">Treatment Timeline</span>
              <span className="text-[10px] text-slate-400 font-mono">OCTOBER 2026</span>
            </div>

            {/* Simple weekly calendar view */}
            <div className="grid grid-cols-7 gap-1 text-center font-mono text-[9px] text-slate-500">
              <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
              <span className="text-slate-400 py-1 bg-slate-950/20 rounded">22</span>
              <span className="text-cyan-400 font-bold py-1 bg-cyan-500/10 border border-cyan-500/25 rounded">23</span>
              <span className="text-slate-400 py-1 bg-slate-950/20 rounded">24</span>
              <span className="text-slate-400 py-1 bg-slate-950/20 rounded">25</span>
              <span className="text-slate-400 py-1 bg-slate-950/20 rounded">26</span>
              <span className="text-slate-400 py-1 bg-slate-950/20 rounded">27</span>
              <span className="text-slate-400 py-1 bg-slate-950/20 rounded">28</span>
            </div>

            {/* Scheduled events list */}
            <div className="space-y-2.5 pt-2">
              <div className="bg-slate-950/50 border border-slate-850 p-2.5 rounded-lg flex gap-3 text-[10px]">
                <Clock className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-300 block">Mon 10:00 AM — Blood Test</strong>
                  <span className="text-slate-500 font-mono text-[9px]">Hematology check-up</span>
                </div>
              </div>
              <div className="bg-slate-950/50 border border-slate-850 p-2.5 rounded-lg flex gap-3 text-[10px]">
                <Clock className="w-4 h-4 text-violet-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-300 block">Wed 10:00 AM — Follow-up Appt</strong>
                  <span className="text-slate-500 font-mono text-[9px]">Clinical review</span>
                </div>
              </div>
              <div className="bg-slate-950/50 border border-slate-850 p-2.5 rounded-lg flex gap-3 text-[10px]">
                <Clock className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-300 block">Fri PM — Med Dosage Change</strong>
                  <span className="text-slate-500 font-mono text-[9px]">Regimen adjustment</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Timeline activities */}
          <div className="bg-slate-900/30 border border-slate-900 rounded-xl p-5 space-y-4">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block font-mono border-b border-slate-850 pb-2">
              Recent Timeline Activity
            </span>
            <div className="space-y-4 relative pl-3 before:content-[''] before:absolute before:left-[4px] before:top-2 before:bottom-2 before:w-[1px] before:bg-slate-800">
              <div className="text-[10px] relative">
                <span className="absolute -left-[12px] top-1.5 w-1.5 h-1.5 rounded-full bg-violet-500" />
                <span className="text-slate-500 font-mono text-[9px] block">Oct 24</span>
                <strong className="text-slate-350 block">New Prescription - Amlodipine</strong>
                <span className="text-slate-500 block font-mono text-[8px] mt-0.5">Progress 2:00 AM</span>
              </div>
              <div className="text-[10px] relative">
                <span className="absolute -left-[12px] top-1.5 w-1.5 h-1.5 rounded-full bg-violet-500" />
                <span className="text-slate-550 font-mono text-[9px] block">Oct 23</span>
                <strong className="text-slate-350 block">Completed Lab Work</strong>
                <span className="text-slate-550 block font-mono text-[8px] mt-0.5">Completed Lab Work</span>
              </div>
              <div className="text-[10px] relative">
                <span className="absolute -left-[12px] top-1.5 w-1.5 h-1.5 rounded-full bg-violet-500" />
                <span className="text-slate-550 font-mono text-[9px] block">Oct 21</span>
                <strong className="text-slate-350 block">Wellness Checkup</strong>
                <span className="text-slate-550 block font-mono text-[8px] mt-0.5">Wellness Checkup</span>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}

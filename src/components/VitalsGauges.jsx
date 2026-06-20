import React from 'react';
import { Heart, Activity, Thermometer, Wind, AlertCircle, ShieldAlert } from 'lucide-react';

export default function VitalsGauges({ vitals }) {
  if (!vitals) return null;

  const list = [
    {
      label: 'Heart Rate',
      value: `${vitals.heartRate} bpm`,
      icon: Heart,
      status: vitals.heartRate > 100 || vitals.heartRate < 60 ? 'warning' : 'normal',
      statusText: vitals.heartRate > 100 ? 'Tachycardia' : vitals.heartRate < 60 ? 'Bradycardia' : 'Normal Sinus',
      color: 'rose',
    },
    {
      label: 'Blood Pressure',
      value: vitals.bloodPressure,
      icon: Activity,
      status: 'normal', // BP status usually standard
      statusText: 'Stable',
      color: 'cyan',
    },
    {
      label: 'Oxygen Saturation',
      value: `${vitals.spo2}%`,
      icon: ShieldAlert,
      status: vitals.spo2 < 95 ? 'critical' : 'normal',
      statusText: vitals.spo2 < 95 ? 'Hypoxia Risk' : 'Adequate',
      color: vitals.spo2 < 95 ? 'rose' : 'emerald',
    },
    {
      label: 'Body Temp',
      value: `${vitals.temperatureF}°F`,
      icon: Thermometer,
      status: vitals.temperatureF > 100.4 ? 'warning' : 'normal',
      statusText: vitals.temperatureF > 100.4 ? 'Febrile' : 'Afebrile',
      color: 'amber',
    },
    {
      label: 'Respiration',
      value: `${vitals.respiratoryRate}/min`,
      icon: Wind,
      status: vitals.respiratoryRate > 20 || vitals.respiratoryRate < 12 ? 'warning' : 'normal',
      statusText: vitals.respiratoryRate > 20 ? 'Tachypnea' : 'Normal',
      color: 'violet',
    },
  ];

  // Helper for pain meter
  const painPercent = (vitals.painScore / 10) * 100;
  const getPainColor = (score) => {
    if (score >= 7) return 'bg-rose-500';
    if (score >= 4) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {list.map((v, idx) => {
          const Icon = v.icon;
          const statusColors = {
            normal: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
            warning: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
            critical: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
          };
          
          return (
            <div key={idx} className="bg-slate-900/40 backdrop-blur-md border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-semibold text-slate-500">{v.label}</span>
                <Icon className={`w-4 h-4 ${v.color === 'rose' ? 'text-rose-400' : v.color === 'cyan' ? 'text-cyan-400' : v.color === 'emerald' ? 'text-emerald-400' : v.color === 'amber' ? 'text-amber-400' : 'text-violet-400'}`} />
              </div>
              <div>
                <div className="text-xl font-bold font-mono text-slate-200 mb-1">{v.value}</div>
                <span className={`text-[9px] px-1.5 py-0.5 rounded font-medium border ${statusColors[v.status]}`}>
                  {v.statusText}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pain score card */}
      <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800 rounded-xl p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4 text-amber-400" />
            Reported Pain Score (Visual Analog Scale)
          </span>
          <span className="text-sm font-bold font-mono text-slate-300">{vitals.painScore} / 10</span>
        </div>
        <div className="w-full bg-slate-850 h-3 rounded-full overflow-hidden p-0.5 border border-slate-800">
          <div 
            className={`h-full rounded-full transition-all duration-550 ${getPainColor(vitals.painScore)}`} 
            style={{ width: `${painPercent}%` }} 
          />
        </div>
        <div className="flex justify-between text-[9px] text-slate-500 mt-2 font-mono">
          <span>0 - No Pain</span>
          <span>5 - Moderate Pain</span>
          <span>10 - Worst Pain</span>
        </div>
      </div>
    </div>
  );
}

import React, { useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getPatientById } from '../../data/mockPatients';
import VitalsGauges from '../../components/VitalsGauges';
import { Heart, Activity, Wifi, Battery, RefreshCw, Layers } from 'lucide-react';

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
      
      {/* Title */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            My Live Body Vitals
            <span className="text-[10px] px-2 py-0.2 rounded border border-slate-800 text-slate-500 font-mono font-normal">
              Realtime Feeds
            </span>
          </h2>
          <p className="text-xs text-slate-500 font-mono">Physiological parameters synced from clinical smart-monitoring twin feeds.</p>
        </div>
      </div>

      {/* Sensor telemetry status header card */}
      <div className="bg-slate-900/40 border border-slate-900 rounded-xl p-5 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <Wifi className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <span className="text-[9px] uppercase font-bold tracking-wider text-slate-500 block font-mono">Data Source</span>
            <span className="text-xs font-semibold text-slate-200">FDA-Cleared Biosensor Patch</span>
            <span className="text-[10px] text-emerald-400 font-mono block mt-0.5">Telemetry Connected</span>
          </div>
        </div>

        <div className="flex items-center gap-8 text-xs font-mono border-t md:border-t-0 md:border-x border-slate-850 py-3 md:py-0 md:px-6">
          <div>
            <span className="text-slate-550 block text-[9px] uppercase font-bold">Signal quality</span>
            <span className="text-slate-350 font-semibold">94% (Excellent)</span>
          </div>
          <div>
            <span className="text-slate-550 block text-[9px] uppercase font-bold">Patch Battery</span>
            <span className="text-slate-350 font-semibold flex items-center gap-1">
              <Battery className="w-3.5 h-3.5 text-emerald-400" /> 88%
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs font-mono">
          <div>
            <span className="text-slate-550 block text-[9px] uppercase font-bold">Last transmission</span>
            <span className="text-slate-350 font-semibold">2 minutes ago</span>
          </div>
          <button className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-950 border border-slate-850 hover:border-slate-700 text-[10px] text-slate-300 font-semibold transition-all">
            <RefreshCw className="w-3 h-3 text-cyan-400" /> Force Refresh
          </button>
        </div>
      </div>

      {/* Main Gauges */}
      <VitalsGauges vitals={patient.vitals} />

      {/* Info card */}
      <div className="bg-slate-900/20 border border-slate-900 rounded-xl p-5 space-y-2">
        <h4 className="text-xs font-bold text-slate-350 flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyan-400" />
          Biosensor Integration & telemetry Guide
        </h4>
        <p className="text-xs text-slate-455 leading-relaxed font-mono">
          Your live vitals are captured continuously through a wearable multi-sensor biosensor patch. The patch records blood oxygen levels, heart rate, skin temperature, and respiratory rates every 15 seconds, uploading them via encrypted Bluetooth to your health app. Clinical events, such as a severe spike in systemic toxicity or pain metrics, are flagged in real-time on your physician's digital twin dashboard for rapid intervention.
        </p>
      </div>

    </div>
  );
}

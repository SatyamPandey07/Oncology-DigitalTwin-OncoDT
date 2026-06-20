import React from 'react';
import { Calendar, ChevronRight, CheckCircle2, Shield, Activity, Flame } from 'lucide-react';
import { formatDate } from '../utils/formatters';

export default function TreatmentTimeline({ history }) {
  if (!history || history.length === 0) {
    return (
      <div className="text-center py-6 text-slate-500 text-xs font-mono">
        No Treatment History Recorded
      </div>
    );
  }

  const getIcon = (type) => {
    switch (String(type).toLowerCase()) {
      case 'surgery':
      case 'procedure':
        return { icon: Shield, color: 'text-rose-400 bg-rose-500/10 border-rose-500/25' };
      case 'chemotherapy':
      case 'adjuvant chemotherapy':
      case 'systemic therapy':
        return { icon: Activity, color: 'text-amber-400 bg-amber-500/10 border-amber-500/25' };
      case 'targeted therapy':
        return { icon: CheckCircle2, color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/25' };
      case 'radiation':
        return { icon: Flame, color: 'text-violet-400 bg-violet-500/10 border-violet-500/25' };
      default:
        return { icon: Calendar, color: 'text-slate-400 bg-slate-500/10 border-slate-500/25' };
    }
  };

  return (
    <div className="relative pl-6 border-l border-slate-800 space-y-6">
      {history.map((tx, idx) => {
        const item = getIcon(tx.type);
        const TxIcon = item.icon;
        
        return (
          <div key={tx.id || idx} className="relative group">
            {/* Timeline node dot */}
            <div className={`absolute -left-[35px] top-1.5 p-1.5 rounded-full border bg-slate-950 ${item.color} transition-all duration-300 group-hover:scale-110`}>
              <TxIcon className="w-3.5 h-3.5" />
            </div>

            <div className="bg-slate-900/30 backdrop-blur-sm border border-slate-900 rounded-xl p-4 transition-all duration-300 hover:border-slate-800/80 hover:bg-slate-900/50">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <span className="text-[10px] font-bold tracking-wider uppercase text-slate-500 font-mono">
                  {tx.type}
                </span>
                <span className="text-[10px] text-slate-400 bg-slate-950 px-2 py-0.5 border border-slate-800 rounded font-mono">
                  {formatDate(tx.startDate)} {tx.endDate && tx.endDate !== 'Ongoing' && tx.endDate !== tx.startDate ? ` - ${formatDate(tx.endDate)}` : tx.endDate === 'Ongoing' ? ' - Ongoing' : ''}
                </span>
              </div>

              <h4 className="text-xs font-semibold text-slate-200 mb-1">{tx.regimen}</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-800/40 text-[11px]">
                <div>
                  <span className="text-slate-500 block">Cycles / Dosage</span>
                  <span className="text-slate-300 font-mono font-medium">{tx.cycles || '—'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Clinical Response</span>
                  <span className="text-emerald-450 font-medium">{tx.response || '—'}</span>
                </div>
              </div>

              {tx.isTwinVerified && (
                <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-cyan-500/10 pt-2.5">
                  <span className="inline-flex items-center gap-1 text-[8px] px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-bold font-mono">
                    <Shield className="w-3 h-3 text-cyan-400" /> Digital Twin Verified
                  </span>
                  <span className="text-[9px] text-slate-500 font-mono">
                    Verification ID: <span className="text-slate-350">{tx.verificationCert}</span>
                  </span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

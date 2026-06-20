import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Info, ShieldCheck } from 'lucide-react';

export default function DrugCard({ drug, isSelected, onSelectToggle, simulationResult, disabled, onApply }) {
  // Determine color theme based on drug color property
  const colorMap = {
    rose: 'border-rose-500/20 hover:border-rose-500/50 text-rose-400 bg-rose-500/5',
    amber: 'border-amber-500/20 hover:border-amber-500/50 text-amber-400 bg-amber-500/5',
    yellow: 'border-yellow-500/20 hover:border-yellow-500/50 text-yellow-400 bg-yellow-500/5',
    orange: 'border-orange-500/20 hover:border-orange-500/50 text-orange-400 bg-orange-500/5',
    cyan: 'border-cyan-500/20 hover:border-cyan-500/50 text-cyan-400 bg-cyan-500/5',
    teal: 'border-teal-500/20 hover:border-teal-500/50 text-teal-400 bg-teal-500/5',
    indigo: 'border-indigo-500/20 hover:border-indigo-500/50 text-indigo-400 bg-indigo-500/5',
    violet: 'border-violet-500/20 hover:border-violet-500/50 text-violet-400 bg-violet-500/5',
    sky: 'border-sky-500/20 hover:border-sky-500/50 text-sky-400 bg-sky-500/5',
    emerald: 'border-emerald-500/20 hover:border-emerald-500/50 text-emerald-400 bg-emerald-500/5',
    purple: 'border-purple-500/20 hover:border-purple-500/50 text-purple-400 bg-purple-500/5',
    pink: 'border-pink-500/20 hover:border-pink-500/50 text-pink-400 bg-pink-500/5',
  };

  const borderClass = isSelected
    ? 'border-cyan-500 bg-slate-900/80 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
    : 'border-slate-800 bg-slate-900/30 hover:border-slate-700 hover:bg-slate-900/50';

  // Get Recommendation Badge based on simulation result
  const getRecommendationBadge = () => {
    if (!simulationResult) return null;
    const { efficacyScore } = simulationResult;
    
    if (efficacyScore >= 75) {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold">
          <CheckCircle2 className="w-3 h-3" /> Recommended ({Math.round(efficacyScore)}%)
        </span>
      );
    } else if (efficacyScore >= 50) {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 font-bold">
          <AlertTriangle className="w-3 h-3" /> Borderline ({Math.round(efficacyScore)}%)
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 font-bold">
          <XCircle className="w-3 h-3" /> Poor Efficacy ({Math.round(efficacyScore)}%)
        </span>
      );
    }
  };

  return (
    <div 
      onClick={() => !disabled && onSelectToggle(drug.id)}
      className={`border rounded-xl p-4 transition-all duration-300 cursor-pointer ${borderClass} flex flex-col justify-between h-full relative overflow-hidden group ${disabled && !isSelected ? 'opacity-40 cursor-not-allowed' : ''}`}
    >
      <div>
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <h4 className="text-xs font-bold text-slate-200 group-hover:text-cyan-400 transition-colors">
              {drug.name}
            </h4>
            <span className="text-[10px] text-slate-500 block">{drug.class}</span>
          </div>
          <div className="flex flex-col items-end gap-1">
            <input 
              type="checkbox" 
              checked={isSelected}
              onChange={() => {}} // Handle on parent div click
              disabled={disabled}
              className="rounded border-slate-700 bg-slate-800 text-cyan-500 focus:ring-cyan-500 w-3.5 h-3.5"
            />
          </div>
        </div>

        <p className="text-[10px] text-slate-400 leading-relaxed mb-3 italic">
          "{drug.mechanism}"
        </p>

        {drug.biomarkerBoosts && drug.biomarkerBoosts.length > 0 && (
          <div className="space-y-1 mb-3">
            <span className="text-[9px] uppercase tracking-wider text-slate-500 block font-mono">Biomarker Targets</span>
            <div className="flex flex-wrap gap-1">
              {drug.biomarkerBoosts.map((b, idx) => (
                <span key={idx} className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-500/10 border border-cyan-500/25 text-cyan-400 font-mono">
                  {b.biomarker.replace('_', ' ')}: {b.value || `>=${b.threshold}%`} (+{Math.round((b.multiplier - 1) * 100)}%)
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="pt-3 border-t border-slate-800/40">
        {simulationResult ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-500 font-mono">Simulated Efficacy:</span>
              <span className={`text-[10px] font-bold font-mono ${simulationResult.efficacyScore >= 75 ? 'text-emerald-400' : simulationResult.efficacyScore >= 50 ? 'text-amber-400' : 'text-rose-400'}`}>
                {Math.round(simulationResult.efficacyScore)}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-500 font-mono">Peak Toxicity:</span>
              <span className={`text-[10px] font-bold font-mono ${simulationResult.peakToxicity > 70 ? 'text-rose-400' : 'text-slate-300'}`}>
                {Math.round(simulationResult.peakToxicity)}%
              </span>
            </div>
            <div className="mt-2 flex justify-center">
              {getRecommendationBadge()}
            </div>
            {onApply && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onApply(drug, simulationResult);
                }}
                className="w-full mt-3 py-1.5 rounded bg-cyan-500/10 hover:bg-cyan-500/20 active:scale-95 border border-cyan-500/30 hover:border-cyan-500/50 text-[10px] font-bold text-cyan-400 uppercase tracking-wider flex items-center justify-center gap-1 transition-all duration-200"
              >
                <ShieldCheck className="w-3.5 h-3.5" /> Verify & Apply
              </button>
            )}
          </div>
        ) : (
          <div className="text-center text-[10px] text-slate-500 py-1 font-mono italic">
            Select to run comparison
          </div>
        )}
      </div>
    </div>
  );
}

import React from 'react';
import { ArrowDown, ArrowUp } from 'lucide-react';

export default function KPICard({ icon: Icon, label, value, subtext, trend, color = 'cyan', alert = false, badge }) {
  const colors = {
    cyan: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
    violet: 'text-violet-400 bg-violet-500/10 border-violet-500/20',
    rose: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
    emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    amber: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    purple: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
  };

  const shimmer = {
    cyan: 'via-cyan-400/40',
    violet: 'via-violet-400/40',
    rose: 'via-rose-400/40',
    emerald: 'via-emerald-400/40',
    amber: 'via-amber-400/40',
    purple: 'via-purple-400/40',
  };

  return (
    <div className={`kpi-card relative ${alert ? 'critical-pulse border-rose-500/30' : ''}`}>
      {/* Shimmer top border */}
      <div className={`absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent ${shimmer[color] || 'via-cyan-400/40'} to-transparent`} />

      <div className="flex items-start justify-between mb-2">
        <div className={`p-2 rounded-lg border ${colors[color] || colors.cyan}`}>
          <Icon className="w-4 h-4" />
        </div>
        {badge && <div>{badge}</div>}
        {trend === 'down' && !alert && (
          <div className="flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-2 py-0.5">
            <ArrowDown className="w-3 h-3 text-emerald-400" />
            <span className="text-xs text-emerald-400">Reducing</span>
          </div>
        )}
        {trend === 'up' && (
          <div className="flex items-center gap-1 bg-rose-500/10 border border-rose-500/20 rounded-full px-2 py-0.5">
            <ArrowUp className="w-3 h-3 text-rose-400" />
            <span className="text-xs text-rose-400">Expanding</span>
          </div>
        )}
      </div>

      <div className={`text-2xl font-bold font-mono mb-0.5 ${
        alert ? 'text-rose-400 text-glow-rose' :
        color === 'cyan' ? 'text-cyan-300' :
        color === 'violet' ? 'text-violet-300' :
        color === 'emerald' ? 'text-emerald-300' :
        color === 'amber' ? 'text-amber-300' : 
        color === 'purple' ? 'text-purple-300' : 'text-rose-300'
      }`}>
        {value}
      </div>
      <div className="text-xs text-slate-400 font-medium">{label}</div>
      {subtext && <div className="text-xs text-slate-600 mt-1">{subtext}</div>}
    </div>
  );
}

import React from 'react';

export default function GenomicPanel({ biomarkers }) {
  if (!biomarkers) return null;

  const markers = [
    { key: 'HER2', label: 'HER2 Status', val: biomarkers.HER2, desc: 'Targeted therapy (Trastuzumab) eligibility indicator.' },
    { key: 'ER_Status', label: 'Estrogen Receptor (ER)', val: biomarkers.ER_Status, desc: 'Hormone receptor status; guides endocrine treatment.' },
    { key: 'PR_Status', label: 'Progesterone Receptor (PR)', val: biomarkers.PR_Status, desc: 'Hormone receptor status; correlates with ER response.' },
    { key: 'BRCA_Mutation', label: 'BRCA Mutation', val: biomarkers.BRCA_Mutation, desc: 'PARP inhibitor (Olaparib) sensitivity marker.' },
    { key: 'Ki67_Index', label: 'Ki67 Proliferation Index', val: typeof biomarkers.Ki67_Index === 'number' ? `${biomarkers.Ki67_Index}%` : biomarkers.Ki67_Index, desc: 'Tumor cellular division speed (growth rate driver).' },
    { key: 'PD_L1_Expression', label: 'PD-L1 Expression', val: typeof biomarkers.PD_L1_Expression === 'number' ? `${biomarkers.PD_L1_Expression}%` : biomarkers.PD_L1_Expression, desc: 'Immunotherapy (Pembrolizumab) response predictor.' },
    { key: 'EGFR_Mutation', label: 'EGFR Mutation', val: biomarkers.EGFR_Mutation, desc: 'EGFR tyrosine kinase inhibitor sensitivity.' },
    { key: 'ALK_Rearrangement', label: 'ALK Rearrangement', val: biomarkers.ALK_Rearrangement, desc: 'ALK inhibitor therapeutic indicator.' },
    { key: 'KRAS_Mutation', label: 'KRAS Mutation', val: biomarkers.KRAS_Mutation, desc: 'Predictor of anti-EGFR mAb resistance (Colorectal).' },
    { key: 'TP53_Mutation', label: 'TP53 Status', val: biomarkers.TP53_Mutation, desc: 'Tumor suppressor gene dysfunction status.' },
    { key: 'Microsatellite_Instability', label: 'MSI Status', val: biomarkers.Microsatellite_Instability, desc: 'MSI-High indicates excellent immunotherapy response.' },
  ];

  const getBadgeStyles = (key, val) => {
    const uppercaseVal = String(val).toUpperCase();
    if (uppercaseVal.includes('POSITIVE') || uppercaseVal.includes('DETECTED') || uppercaseVal.includes('MSI-HIGH')) {
      return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
    }
    if (uppercaseVal.includes('NEGATIVE') || uppercaseVal.includes('WILD-TYPE') || uppercaseVal.includes('MSS')) {
      return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
    // For Ki67 / PD-L1 numbers
    if (key === 'Ki67_Index') {
      const num = parseInt(val);
      if (num > 30) return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
    }
    if (key === 'PD_L1_Expression') {
      const num = parseInt(val);
      if (num >= 50) return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      if (num > 0) return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
      return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
    return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {markers.map((m) => (
        <div key={m.key} className="relative group bg-slate-900/40 backdrop-blur-md rounded-xl border border-slate-800/80 p-4 transition-all duration-300 hover:border-slate-700/80 hover:bg-slate-900/60">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400">{m.label}</span>
            <span className={`text-xs px-2.5 py-0.5 rounded-full border font-mono font-medium ${getBadgeStyles(m.key, m.val)}`}>
              {m.val || 'Not Tested'}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">{m.desc}</p>
        </div>
      ))}
    </div>
  );
}

import React from 'react';
import { LAB_RANGES, checkLabStatus } from '../data/labRanges';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export default function LabResultsTable({ labs }) {
  if (!labs) return null;

  const categories = [
    {
      title: 'Complete Blood Count (CBC)',
      items: [
        { key: 'wbc', label: 'White Blood Cell Count' },
        { key: 'rbc', label: 'Red Blood Cell Count' },
        { key: 'hemoglobin', label: 'Hemoglobin' },
        { key: 'hematocrit', label: 'Hematocrit' },
        { key: 'platelets', label: 'Platelets' },
        { key: 'neutrophils', label: 'Neutrophils' },
      ]
    },
    {
      title: 'Liver Function Panel (LFT)',
      items: [
        { key: 'alt', label: 'ALT (Alanine Aminotransferase)' },
        { key: 'ast', label: 'AST (Aspartate Aminotransferase)' },
        { key: 'bilirubin', label: 'Total Bilirubin' },
        { key: 'albumin', label: 'Albumin' },
      ]
    },
    {
      title: 'Kidney Function Panel',
      items: [
        { key: 'creatinine', label: 'Creatinine' },
        { key: 'bun', label: 'BUN (Blood Urea Nitrogen)' },
        { key: 'egfr', label: 'eGFR (Glomerular Filtration Rate)' },
      ]
    },
    {
      title: 'Tumor Markers & Enzymes',
      items: [
        { key: 'ca15_3', label: 'CA 15-3 (Breast)' },
        { key: 'cea', label: 'CEA (Colorectal/Lung)' },
        { key: 'ca125', label: 'CA-125 (Ovarian)' },
        { key: 'ldh', label: 'LDH (Lactate Dehydrogenase)' },
      ]
    }
  ];

  return (
    <div className="space-y-6">
      {labs.textHint && (
        <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 text-amber-400 p-3 rounded-lg text-sm">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span><strong>Special Clinical Marker Note:</strong> {labs.textHint}</span>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {categories.map((cat, idx) => (
          <div key={idx} className="bg-slate-900/40 backdrop-blur-md border border-slate-800 rounded-xl overflow-hidden">
            <div className="bg-slate-900/80 px-4 py-3 border-b border-slate-800">
              <h3 className="text-sm font-semibold text-slate-300">{cat.title}</h3>
            </div>
            
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800/50 text-slate-500 font-medium">
                  <th className="px-4 py-2.5">Test Name</th>
                  <th className="px-4 py-2.5 text-right">Value</th>
                  <th className="px-4 py-2.5">Reference Range</th>
                  <th className="px-4 py-2.5 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/30">
                {cat.items.map((item) => {
                  const val = labs[item.key];
                  const range = LAB_RANGES[item.key];
                  if (val === undefined || !range) return null;
                  
                  const status = checkLabStatus(item.key, val);
                  
                  return (
                    <tr key={item.key} className="hover:bg-slate-800/20 transition-colors">
                      <td className="px-4 py-2.5 font-medium text-slate-300">{item.label}</td>
                      <td className="px-4 py-2.5 text-right font-mono text-slate-200">{val} <span className="text-[10px] text-slate-500">{range.unit}</span></td>
                      <td className="px-4 py-2.5 text-slate-500 font-mono">{range.min} - {range.max}</td>
                      <td className="px-4 py-2.5 text-center">
                        {status === 'normal' ? (
                          <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/25 text-emerald-400">
                            Normal
                          </span>
                        ) : status === 'high' ? (
                          <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded bg-rose-500/10 border border-rose-500/25 text-rose-400 font-bold">
                            High ⚠️
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/25 text-amber-400 font-bold">
                            Low ⚠️
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
}

import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';

/**
 * Multi-line SVG Chart for Drug Comparison
 * Shows Tumor Diameter (mm) over 730 days for up to 4 selected drugs.
 */
export default function DrugComparisonChart({ simulations, selectedDrugs, isRunning }) {
  const svgRef = useRef(null);
  const containerRef = useRef(null);
  const [tooltip, setTooltip] = useState(null);
  const [dims, setDims] = useState({ width: 800, height: 380 });

  // Responsive size observer
  useEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver(entries => {
      const { width, height } = entries[0].contentRect;
      setDims({ width: Math.max(width, 300), height: Math.max(height, 200) });
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  const MARGIN = { top: 24, right: 32, bottom: 48, left: 48 };
  const chartW = dims.width - MARGIN.left - MARGIN.right;
  const chartH = dims.height - MARGIN.top - MARGIN.bottom;

  // Verify we have active simulation data to plot
  const activeSims = useMemo(() => {
    if (!simulations || Object.keys(simulations).length === 0) return [];
    return selectedDrugs
      .filter(d => simulations[d.id] && simulations[d.id].length > 0)
      .map(d => ({
        drug: d,
        data: simulations[d.id]
      }));
  }, [simulations, selectedDrugs]);

  const hasData = activeSims.length > 0;

  // Find maximum tumor diameter across all datasets for Y-scaling
  const maxDia = useMemo(() => {
    if (!hasData) return 100;
    let max = 0;
    activeSims.forEach(sim => {
      sim.data.forEach(d => {
        if (d.tumorDiameterMm > max) max = d.tumorDiameterMm;
      });
    });
    return max || 100;
  }, [activeSims, hasData]);

  const totalDays = useMemo(() => {
    if (!hasData) return 730;
    return activeSims[0].data[activeSims[0].data.length - 1].day;
  }, [activeSims, hasData]);

  // Scaling helpers
  const xScale = useCallback((day) => (day / Math.max(totalDays, 1)) * chartW, [totalDays, chartW]);
  const yScale = useCallback((mm) => chartH - (mm / (maxDia * 1.1 || 1)) * chartH, [chartH, maxDia]);

  // Tooltip mouse tracker
  const handleMouseMove = useCallback((e) => {
    if (!svgRef.current || !hasData) return;
    const rect = svgRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left - MARGIN.left;
    const fraction = mouseX / chartW;
    const targetDay = Math.round(fraction * totalDays);
    
    // Find closest day in first dataset
    const refData = activeSims[0].data;
    const closest = refData.reduce((prev, curr) =>
      Math.abs(curr.day - targetDay) < Math.abs(prev.day - targetDay) ? curr : prev
    );

    // Get the values for all active simulation tracks on that day
    const dayIndex = closest.day;
    const values = activeSims.map(sim => {
      const match = sim.data.find(d => d.day === dayIndex) || closest;
      return {
        drug: sim.drug,
        tumorDiameterMm: match.tumorDiameterMm,
        toxicity: match.systemicToxicityScore
      };
    });

    setTooltip({
      x: mouseX + MARGIN.left,
      y: e.clientY - rect.top,
      day: dayIndex,
      values
    });
  }, [activeSims, chartW, totalDays, hasData]);

  const handleMouseLeave = useCallback(() => setTooltip(null), []);

  useEffect(() => {
    setTooltip(null);
  }, [simulations]);

  // Compute SVGs Paths
  const paths = useMemo(() => {
    if (!hasData) return [];
    return activeSims.map(sim => {
      // Downsample to max 365 steps for rendering speed
      const step = Math.ceil(sim.data.length / 365);
      const points = sim.data.filter((_, i) => i % step === 0);

      const pathString = points.map((d, i) =>
        `${i === 0 ? 'M' : 'L'} ${xScale(d.day).toFixed(2)},${yScale(d.tumorDiameterMm).toFixed(2)}`
      ).join(' ');

      return {
        drugId: sim.drug.id,
        drugName: sim.drug.name,
        color: sim.drug.color,
        path: pathString
      };
    });
  }, [activeSims, hasData, xScale, yScale]);

  // Color lookup to standard Tailwind stroke colors
  const colorMap = {
    rose: '#f43f5e',
    amber: '#f59e0b',
    yellow: '#eab308',
    orange: '#f97316',
    cyan: '#06b6d4',
    teal: '#14b8a6',
    indigo: '#6366f1',
    violet: '#8b5cf6',
    sky: '#0ea5e9',
    emerald: '#10b981',
    purple: '#a855f7',
    pink: '#ec4899',
  };

  const yTicks = Array.from({ length: 6 }, (_, i) =>
    ((maxDia * 1.1) / 5) * i
  ).reverse();

  const xTicks = Array.from(
    { length: Math.floor(totalDays / 90) + 1 },
    (_, i) => i * 90
  ).filter(d => d <= totalDays);

  if (isRunning) {
    return (
      <div ref={containerRef} className="w-full h-full flex items-center justify-center min-h-[300px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500 mx-auto mb-3" />
          <div className="text-slate-400 text-xs font-mono">Running virtual multi-drug simulation assays...</div>
        </div>
      </div>
    );
  }

  if (!hasData) {
    return (
      <div ref={containerRef} className="w-full h-full flex items-center justify-center min-h-[300px] border border-dashed border-slate-800 rounded-xl bg-slate-950/20">
        <div className="text-slate-500 text-xs font-mono text-center max-w-sm">
          Select chemotherapy, immunotherapy or targeted drugs on the left panel to test and compare tumor regression rates.
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative w-full h-full select-none">
      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 mb-4 text-xs font-mono justify-end">
        {paths.map(p => (
          <div key={p.drugId} className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 rounded" style={{ backgroundColor: colorMap[p.color] || '#06b6d4' }} />
            <span className="text-slate-300 font-semibold">{p.drugName}</span>
          </div>
        ))}
      </div>

      <svg
        ref={svgRef}
        width={dims.width}
        height={dims.height}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="cursor-crosshair"
      >
        {/* Glow Filters */}
        <defs>
          {Object.keys(colorMap).map(col => (
            <filter key={col} id={`glow-${col}`} x="-10%" y="-10%" width="120%" height="120%">
              <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          ))}
        </defs>

        <g transform={`translate(${MARGIN.left}, ${MARGIN.top})`}>
          {/* Y Axis Grid & Labels */}
          {yTicks.map((tick, i) => {
            const y = yScale(tick);
            return (
              <g key={i} className="text-slate-700">
                <line x1="0" y1={y} x2={chartW} y2={y} stroke="currentColor" strokeWidth="0.5" strokeDasharray="3 6" />
                <text x="-10" y={y + 4} textAnchor="end" className="fill-slate-500 font-mono text-[9px]">
                  {tick.toFixed(0)}
                </text>
              </g>
            );
          })}

          {/* X Axis Grid & Labels */}
          {xTicks.map((tick, i) => {
            const x = xScale(tick);
            return (
              <g key={i} className="text-slate-700">
                <line x1={x} y1="0" x2={x} y2={chartH} stroke="currentColor" strokeWidth="0.5" strokeDasharray="3 6" />
                <text x={x} y={chartH + 16} textAnchor="middle" className="fill-slate-500 font-mono text-[9px]">
                  {tick === 0 ? 'Start' : `M${Math.round(tick / 30)}`}
                </text>
              </g>
            );
          })}

          {/* Draw lines for each drug simulation */}
          {paths.map(p => (
            <path
              key={p.drugId}
              d={p.path}
              fill="none"
              stroke={colorMap[p.color] || '#06b6d4'}
              strokeWidth="2"
              filter={`url(#glow-${p.color})`}
              className="transition-all duration-300"
            />
          ))}

          {/* Hover Crosshair indicator */}
          {tooltip && (
            <>
              <line x1={xScale(tooltip.day)} y1="0" x2={xScale(tooltip.day)} y2={chartH} stroke="#475569" strokeWidth="1" strokeDasharray="2 2" />
              {tooltip.values.map((val, idx) => {
                const y = yScale(val.tumorDiameterMm);
                return (
                  <circle
                    key={idx}
                    cx={xScale(tooltip.day)}
                    cy={y}
                    r="4"
                    fill={colorMap[val.drug.color] || '#06b6d4'}
                    stroke="#020617"
                    strokeWidth="1.5"
                  />
                );
              })}
            </>
          )}
        </g>
      </svg>

      {/* Tooltip Overlay */}
      {tooltip && (
        <div
          className="absolute z-30 pointer-events-none bg-slate-950/95 border border-slate-800 rounded-lg p-3 shadow-2xl font-mono text-[10px] text-slate-350 min-w-[200px]"
          style={{
            left: `${tooltip.x + 12}px`,
            top: `${tooltip.y - 12}px`,
            transform: 'translateY(-50%)',
          }}
        >
          <div className="font-bold text-slate-400 border-b border-slate-850 pb-1.5 mb-1.5 flex justify-between">
            <span>DAY {tooltip.day}</span>
            <span className="text-cyan-400">Month {Math.round(tooltip.day / 30)}</span>
          </div>
          <div className="space-y-1.5">
            {tooltip.values.map((v, i) => (
              <div key={i} className="flex justify-between items-center gap-4">
                <span className="font-semibold" style={{ color: colorMap[v.drug.color] || '#fff' }}>
                  {v.drug.name}:
                </span>
                <span className="text-slate-200">
                  {v.tumorDiameterMm.toFixed(1)} mm <span className="text-[8px] text-slate-500">(Tox: {Math.round(v.toxicity)}%)</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

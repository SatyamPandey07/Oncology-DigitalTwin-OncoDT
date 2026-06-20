import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';

/**
 * Dual-axis SVG Line Chart
 * Left axis: Tumor Diameter (mm) — solid cyan line
 * Right axis: Systemic Toxicity (%) — dashed violet line
 * Hover tooltip with day/diameter/toxicity
 *
 * IMPORTANT: All hooks are called unconditionally before any conditional renders
 * to satisfy the React Rules of Hooks.
 */
export default function DualAxisChart({ data, isRunning }) {
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

  const MARGIN = { top: 24, right: 64, bottom: 48, left: 64 };
  const chartW = dims.width - MARGIN.left - MARGIN.right;
  const chartH = dims.height - MARGIN.top - MARGIN.bottom;

  // Downsample data for rendering performance (max 365 points from 730)
  const sampledData = useMemo(() => {
    if (!data || data.length === 0) return [];
    if (data.length <= 365) return data;
    const step = Math.floor(data.length / 365);
    return data.filter((_, i) => i % step === 0);
  }, [data]);

  const hasData = sampledData.length > 0;

  // All derived values — safe when data is empty (defaults to 0 / empty)
  const maxDia = useMemo(
    () => hasData ? sampledData.reduce((m, d) => Math.max(m, d.tumorDiameterMm), 0) : 1,
    [sampledData, hasData]
  );
  const days = hasData ? sampledData[sampledData.length - 1].day : 1;

  const xScale = useCallback((day) => (day / Math.max(days, 1)) * chartW, [days, chartW]);
  const yScaleDia = useCallback((mm) => chartH - (mm / (maxDia * 1.1 || 1)) * chartH, [chartH, maxDia]);
  const yScaleTox = useCallback((pct) => chartH - (pct / 100) * chartH, [chartH]);

  // Mouse event handler — hook called unconditionally
  const handleMouseMove = useCallback((e) => {
    if (!svgRef.current || !hasData) return;
    const rect = svgRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left - MARGIN.left;
    const fraction = mouseX / chartW;
    const targetDay = Math.round(fraction * days);
    const closest = sampledData.reduce((prev, curr) =>
      Math.abs(curr.day - targetDay) < Math.abs(prev.day - targetDay) ? curr : prev
    );
    setTooltip({
      x: mouseX + MARGIN.left,
      y: e.clientY - rect.top,
      data: closest,
    });
  }, [sampledData, chartW, days, hasData]);

  const handleMouseLeave = useCallback(() => setTooltip(null), []);

  // Clear tooltip when data changes
  useEffect(() => {
    setTooltip(null);
  }, [data]);

  // ─── Derived chart geometry (only computed when data exists) ──────────────
  const { diaPath, toxPath, areaPath, yTicksDia, xTicks, nadirPoint } = useMemo(() => {
    if (!hasData) return { diaPath: '', toxPath: '', areaPath: '', yTicksDia: [], xTicks: [], nadirPoint: null };

    const buildPath = (getter) =>
      sampledData.map((d, i) =>
        `${i === 0 ? 'M' : 'L'} ${xScale(d.day).toFixed(2)},${getter(d).toFixed(2)}`
      ).join(' ');

    const dia = buildPath(d => yScaleDia(d.tumorDiameterMm));
    const tox = buildPath(d => yScaleTox(d.systemicToxicityScore));

    const area = [
      ...sampledData.map((d, i) =>
        `${i === 0 ? 'M' : 'L'} ${xScale(d.day).toFixed(2)},${yScaleDia(d.tumorDiameterMm).toFixed(2)}`
      ),
      `L ${xScale(sampledData[sampledData.length - 1].day).toFixed(2)},${chartH}`,
      `L 0,${chartH}`,
      'Z'
    ].join(' ');

    const ytd = Array.from({ length: 6 }, (_, i) =>
      ((maxDia * 1.1) / 5) * i
    ).reverse();

    const xt = Array.from(
      { length: Math.floor(days / 90) + 1 },
      (_, i) => i * 90
    ).filter(d => d <= days);

    const nadir = sampledData.reduce((best, d) =>
      d.tumorDiameterMm < best.tumorDiameterMm ? d : best
    , sampledData[0]);

    return { diaPath: dia, toxPath: tox, areaPath: area, yTicksDia: ytd, xTicks: xt, nadirPoint: nadir };
  }, [sampledData, hasData, xScale, yScaleDia, yScaleTox, chartH, maxDia, days]);

  const yTicksTox = [0, 25, 50, 75, 100];

  // ─── Render ──────────────────────────────────────────────────────────────

  // Empty state (no early return before hooks — hooks are all above)
  if (!hasData) {
    return (
      <div ref={containerRef} className="w-full h-full flex items-center justify-center">
        <div className="text-slate-500 text-sm font-mono animate-pulse">
          Awaiting simulation data…
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative w-full h-full select-none">
      <svg
        ref={svgRef}
        width={dims.width}
        height={dims.height}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="cursor-crosshair"
      >
        <defs>
          {/* Tumor diameter gradient fill */}
          <linearGradient id="diaGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.25" />
            <stop offset="80%" stopColor="#22d3ee" stopOpacity="0.03" />
            <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
          </linearGradient>
          {/* Toxicity gradient */}
          <linearGradient id="toxGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#a78bfa" stopOpacity="0" />
          </linearGradient>
          {/* Glow filter for tumor line */}
          <filter id="glowCyan" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="glowViolet" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          {/* Clip path */}
          <clipPath id="chartClip">
            <rect x="0" y="0" width={chartW} height={chartH} />
          </clipPath>
        </defs>

        <g transform={`translate(${MARGIN.left}, ${MARGIN.top})`}>
          {/* Grid lines */}
          {yTicksDia.map((tick, i) => (
            <line
              key={`hgrid-${i}`}
              x1={0} y1={yScaleDia(tick)}
              x2={chartW} y2={yScaleDia(tick)}
              stroke="rgba(255,255,255,0.05)"
              strokeWidth={1}
            />
          ))}
          {xTicks.map((tick) => (
            <line
              key={`vgrid-${tick}`}
              x1={xScale(tick)} y1={0}
              x2={xScale(tick)} y2={chartH}
              stroke="rgba(255,255,255,0.05)"
              strokeWidth={1}
              strokeDasharray="3,3"
            />
          ))}

          {/* Critical toxicity zone (>75%) highlight band */}
          <rect
            x={0}
            y={yScaleTox(100)}
            width={chartW}
            height={yScaleTox(75) - yScaleTox(100)}
            fill="rgba(251,113,133,0.04)"
          />
          <line
            x1={0} y1={yScaleTox(75)}
            x2={chartW} y2={yScaleTox(75)}
            stroke="rgba(251,113,133,0.25)"
            strokeWidth={1}
            strokeDasharray="5,3"
          />
          <text
            x={chartW + 4}
            y={yScaleTox(75)}
            fill="rgba(251,113,133,0.5)"
            fontSize={9}
            dominantBaseline="middle"
            fontFamily="JetBrains Mono, monospace"
          >75%</text>

          {/* Clip group for chart paths */}
          <g clipPath="url(#chartClip)">
            {/* Tumor diameter gradient fill area */}
            <path d={areaPath} fill="url(#diaGradient)" />

            {/* Tumor diameter line */}
            <path
              d={diaPath}
              fill="none"
              stroke="#22d3ee"
              strokeWidth={2.5}
              strokeLinejoin="round"
              strokeLinecap="round"
              filter="url(#glowCyan)"
              style={{ transition: 'all 0.3s ease' }}
            />

            {/* Toxicity dashed line */}
            <path
              d={toxPath}
              fill="none"
              stroke="#a78bfa"
              strokeWidth={2}
              strokeDasharray="6,4"
              strokeLinejoin="round"
              strokeLinecap="round"
              filter="url(#glowViolet)"
              style={{ transition: 'all 0.3s ease' }}
            />

            {/* Nadir marker */}
            {nadirPoint && (
              <>
                <line
                  x1={xScale(nadirPoint.day)}
                  y1={0}
                  x2={xScale(nadirPoint.day)}
                  y2={chartH}
                  stroke="rgba(52,211,153,0.4)"
                  strokeWidth={1.5}
                  strokeDasharray="4,3"
                />
                <circle
                  cx={xScale(nadirPoint.day)}
                  cy={yScaleDia(nadirPoint.tumorDiameterMm)}
                  r={5}
                  fill="#34d399"
                  stroke="#07080f"
                  strokeWidth={2}
                  filter="url(#glowCyan)"
                />
                <text
                  x={xScale(nadirPoint.day) + 8}
                  y={yScaleDia(nadirPoint.tumorDiameterMm) - 8}
                  fill="#34d399"
                  fontSize={10}
                  fontFamily="JetBrains Mono, monospace"
                  fontWeight="600"
                >NADIR</text>
              </>
            )}
          </g>

          {/* Left Y-axis: Tumor Diameter */}
          <g>
            <line x1={0} y1={0} x2={0} y2={chartH} stroke="rgba(34,211,238,0.2)" strokeWidth={1} />
            {yTicksDia.map((tick, i) => (
              <g key={`ytick-${i}`}>
                <line x1={-4} y1={yScaleDia(tick)} x2={0} y2={yScaleDia(tick)} stroke="rgba(34,211,238,0.3)" strokeWidth={1} />
                <text
                  x={-8}
                  y={yScaleDia(tick)}
                  textAnchor="end"
                  dominantBaseline="middle"
                  fill="rgba(34,211,238,0.7)"
                  fontSize={10}
                  fontFamily="JetBrains Mono, monospace"
                >{tick.toFixed(0)}</text>
              </g>
            ))}
            <text
              transform={`translate(-50, ${chartH / 2}) rotate(-90)`}
              textAnchor="middle"
              fill="rgba(34,211,238,0.6)"
              fontSize={11}
              fontFamily="Inter, sans-serif"
              fontWeight="500"
            >Tumor Diameter (mm)</text>
          </g>

          {/* Right Y-axis: Toxicity */}
          <g transform={`translate(${chartW}, 0)`}>
            <line x1={0} y1={0} x2={0} y2={chartH} stroke="rgba(167,139,250,0.2)" strokeWidth={1} />
            {yTicksTox.map((tick) => (
              <g key={`ytox-${tick}`}>
                <line x1={0} y1={yScaleTox(tick)} x2={4} y2={yScaleTox(tick)} stroke="rgba(167,139,250,0.3)" strokeWidth={1} />
                <text
                  x={8}
                  y={yScaleTox(tick)}
                  dominantBaseline="middle"
                  fill="rgba(167,139,250,0.7)"
                  fontSize={10}
                  fontFamily="JetBrains Mono, monospace"
                >{tick}%</text>
              </g>
            ))}
            <text
              transform={`translate(52, ${chartH / 2}) rotate(90)`}
              textAnchor="middle"
              fill="rgba(167,139,250,0.6)"
              fontSize={11}
              fontFamily="Inter, sans-serif"
              fontWeight="500"
            >Toxicity (%)</text>
          </g>

          {/* X-axis */}
          <g transform={`translate(0, ${chartH})`}>
            <line x1={0} y1={0} x2={chartW} y2={0} stroke="rgba(255,255,255,0.1)" strokeWidth={1} />
            {xTicks.map((tick) => (
              <g key={`xtick-${tick}`}>
                <line x1={xScale(tick)} y1={0} x2={xScale(tick)} y2={4} stroke="rgba(255,255,255,0.2)" strokeWidth={1} />
                <text
                  x={xScale(tick)}
                  y={16}
                  textAnchor="middle"
                  fill="rgba(255,255,255,0.4)"
                  fontSize={10}
                  fontFamily="JetBrains Mono, monospace"
                >D{tick}</text>
              </g>
            ))}
            <text
              x={chartW / 2}
              y={36}
              textAnchor="middle"
              fill="rgba(255,255,255,0.3)"
              fontSize={11}
              fontFamily="Inter, sans-serif"
            >Simulation Timeline (Days)</text>
          </g>

          {/* Hover crosshair */}
          {tooltip && (
            <line
              x1={tooltip.x - MARGIN.left}
              y1={0}
              x2={tooltip.x - MARGIN.left}
              y2={chartH}
              stroke="rgba(255,255,255,0.2)"
              strokeWidth={1}
              strokeDasharray="3,3"
              pointerEvents="none"
            />
          )}
        </g>

        {/* Legend */}
        <g transform={`translate(${MARGIN.left + 10}, ${MARGIN.top + 10})`}>
          <rect x={0} y={0} width={220} height={50} rx={6}
            fill="rgba(7,8,15,0.8)" stroke="rgba(255,255,255,0.06)" />
          <line x1={10} y1={15} x2={35} y2={15} stroke="#22d3ee" strokeWidth={2.5} />
          <circle cx={22} cy={15} r={3} fill="#22d3ee" />
          <text x={42} y={19} fill="rgba(34,211,238,0.9)" fontSize={11} fontFamily="Inter, sans-serif">Tumor Diameter</text>
          <line x1={10} y1={35} x2={35} y2={35} stroke="#a78bfa" strokeWidth={2} strokeDasharray="5,3" />
          <text x={42} y={39} fill="rgba(167,139,250,0.9)" fontSize={11} fontFamily="Inter, sans-serif">Systemic Toxicity</text>
        </g>
      </svg>

      {/* Floating tooltip */}
      {tooltip && (
        <div
          className="chart-tooltip absolute pointer-events-none z-50"
          style={{
            left: Math.min(tooltip.x + 16, dims.width - 230),
            top: Math.max(tooltip.y - 40, 8),
          }}
        >
          <div className="text-slate-400 mb-1">
            <span className="text-cyan-400 font-semibold">Day {tooltip.data.day}</span>
            {tooltip.data.day <= 30 * 24 && (
              <span className="text-slate-500 ml-1">
                (Month {Math.floor(tooltip.data.day / 30) + 1})
              </span>
            )}
          </div>
          <div className="flex flex-col gap-0.5">
            <div>
              <span className="text-slate-500">Diameter: </span>
              <span className="text-cyan-300 font-semibold">{tooltip.data.tumorDiameterMm.toFixed(1)} mm</span>
            </div>
            <div>
              <span className="text-slate-500">Volume: </span>
              <span className="text-cyan-300">{tooltip.data.tumorVolumeCm3.toFixed(2)} cm³</span>
            </div>
            <div>
              <span className="text-slate-500">Toxicity: </span>
              <span className={`font-semibold ${
                tooltip.data.systemicToxicityScore > 75 ? 'text-rose-400' :
                tooltip.data.systemicToxicityScore > 40 ? 'text-amber-400' : 'text-emerald-400'
              }`}>{tooltip.data.systemicToxicityScore.toFixed(1)}%</span>
            </div>
            <div>
              <span className="text-slate-500">Health: </span>
              <span className="text-violet-400">{tooltip.data.patientVitalsHealth.toFixed(1)}%</span>
            </div>
          </div>
        </div>
      )}

      {/* Running indicator */}
      {isRunning && (
        <div className="absolute top-2 right-2 flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full px-3 py-1">
          <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-cyan-400 text-xs font-mono">Computing…</span>
        </div>
      )}
    </div>
  );
}

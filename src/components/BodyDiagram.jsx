import React from 'react';

export default function BodyDiagram({ cancerType, primarySite }) {
  // Map cancerType to x/y coordinates on a standard 200x500 body diagram
  const getHotspot = () => {
    switch (String(cancerType).toLowerCase()) {
      case 'breast':
        return { x: 88, y: 155, color: 'shadow-rose-500 bg-rose-500', label: 'Primary Breast Tumor' };
      case 'lung':
        return { x: 112, y: 145, color: 'shadow-cyan-500 bg-cyan-500', label: 'Primary Lung Tumor' };
      case 'colorectal':
        return { x: 95, y: 245, color: 'shadow-emerald-500 bg-emerald-500', label: 'Primary Colorectal Tumor' };
      case 'ovarian':
        return { x: 90, y: 280, color: 'shadow-violet-500 bg-violet-500', label: 'Bilateral Ovarian Tumors' };
      case 'prostate':
        return { x: 100, y: 290, color: 'shadow-purple-500 bg-purple-500', label: 'Prostate Tumor' };
      case 'pancreatic':
        return { x: 98, y: 185, color: 'shadow-amber-500 bg-amber-500', label: 'Primary Pancreatic Head Tumor' };
      default:
        return null;
    }
  };

  const hotspot = getHotspot();

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-slate-950/40 border border-slate-900 rounded-xl h-full min-h-[420px] relative overflow-hidden">
      {/* Background grids */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-40 pointer-events-none" />

      <h4 className="text-xs font-semibold text-slate-400 mb-4 z-10">Anatomical Digital Twin Mapping</h4>

      <div className="relative w-[200px] h-[340px]">
        {/* SVG outline of human body */}
        <svg
          viewBox="0 0 200 500"
          className="w-full h-full text-slate-800 transition-colors duration-300"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Head & Neck */}
          <path d="M100,70 C112,70 120,60 120,45 C120,30 110,20 100,20 C90,20 80,30 80,45 C80,60 88,70 100,70 Z" className="text-slate-800" />
          <path d="M93,70 L93,82 L107,82 L107,70" />
          
          {/* Shoulders */}
          <path d="M93,82 L70,95 C55,103 45,115 45,130 L45,210 C45,218 52,225 60,225 L65,225 C70,225 73,218 73,210 L73,145" />
          <path d="M107,82 L130,95 C145,103 155,115 155,130 L155,210 C155,218 148,225 140,225 L135,225 C130,225 127,218 127,210 L127,145" />

          {/* Torso */}
          <path d="M73,145 L73,240 C73,255 80,270 90,285 L90,300 C78,320 70,360 70,410 L70,480 C70,488 77,495 85,495 L95,495 C100,495 102,488 102,480 L102,345" />
          <path d="M127,145 L127,240 C127,255 120,270 110,285 L110,300 C122,320 130,360 130,410 L130,480 C130,488 123,495 115,495 L105,495 C100,495 98,488 98,480 L98,345" />

          {/* Connect legs at hips */}
          <path d="M90,300 L110,300" strokeWidth="1.5" />
        </svg>

        {/* Pulsing Hotspot */}
        {hotspot && (
          <div
            className="absolute"
            style={{
              left: `${hotspot.x}%`,
              top: `${hotspot.y / 5}%`, // scale down to 340px height from 500px coordinate system
              transform: 'translate(-50%, -50%)',
            }}
          >
            <div className="relative flex h-5 w-5 items-center justify-center">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${hotspot.color}`} />
              <span className={`relative inline-flex rounded-full h-3.5 w-3.5 border border-slate-950 shadow-lg ${hotspot.color}`} />
            </div>
          </div>
        )}
      </div>

      {hotspot ? (
        <div className="mt-4 text-center z-10">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-300 font-mono">
            {hotspot.label}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">
            {primarySite}
          </div>
        </div>
      ) : (
        <div className="mt-4 text-[10px] text-slate-500 font-mono">
          No Tumor Site Mapped
        </div>
      )}
    </div>
  );
}

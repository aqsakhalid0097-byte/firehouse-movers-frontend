'use client';

import React from 'react';
import { Warehouse, Box } from 'lucide-react';
import { AboutSectionHeader } from './AboutSectionHeader';
import { useReveal, revealBase, revealHidden, revealShown, staggerDelay } from './useReveal';

const comparisonRows = [
  { label: 'Role', station1: 'Operations headquarters', station2: 'Storage & maintenance' },
  { label: 'Primary function', station1: 'Dispatch & crew coordination', station2: 'Climate vault storage' },
  { label: 'Fleet', station1: 'Staging bays & daily dispatch', station2: 'Vehicle maintenance' },
  { label: 'Inventory', station1: 'Packing materials & boxes', station2: 'Palletized wooden vaults' },
  { label: 'Climate control', station1: 'Office & inventory areas', station2: 'Full facility' },
  { label: 'Security', station1: 'Monitored access', station2: '24/7 surveillance' },
  { label: 'Heavy equipment', station1: 'Liftgates & dollies', station2: 'Rigging & safe-moving gear' },
  { label: 'Customer contact', station1: 'Support & operations', station2: 'Scheduled vault access' },
];

const stationHeaders = [
  {
    tag: 'STATION 1',
    name: 'Central Operations & Dispatch',
    icon: <Warehouse className="w-4 h-4" />,
    accent: 'text-red-400 border-red-500/40 bg-red-950/50',
  },
  {
    tag: 'STATION 2',
    name: 'Climate Vault Storage',
    icon: <Box className="w-4 h-4" />,
    accent: 'text-orange-400 border-orange-500/40 bg-orange-950/50',
  },
];

export const AboutStations: React.FC = () => {
  const { ref, isVisible } = useReveal<HTMLDivElement>();

  return (
    <section id="facilities" className="scroll-mt-32 py-16 sm:py-20 bg-[#0b0b0b] border-b border-neutral-800">
      <div className="w-[min(1200px,calc(100%-48px))] sm:w-[min(1200px,calc(100%-80px))] mx-auto">
        <AboutSectionHeader index="05" title="Facilities" meta="TWO LEWISVILLE STATIONS" />

        <div ref={ref} className="rounded-xl border border-neutral-800 overflow-x-auto scrollbar-thin">
          <div className="min-w-[520px] sm:min-w-0">
            {/* Column headers */}
            <div className="grid grid-cols-[140px_1fr_1fr] sm:grid-cols-[200px_1fr_1fr] bg-[#131313] border-b border-neutral-800">
              <div className="px-4 sm:px-5 py-4">
                <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-widest text-neutral-600">
                  Specification
                </span>
              </div>
              {stationHeaders.map((station, i) => (
                <div
                  key={station.tag}
                  className={`px-4 sm:px-5 py-4 border-l border-neutral-800 ${revealBase} ${
                    isVisible ? revealShown : revealHidden
                  }`}
                  style={staggerDelay(i, 110)}
                >
                  <span
                    className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded border font-mono text-[10px] font-bold tracking-widest ${station.accent}`}
                  >
                    {station.icon}
                    {station.tag}
                  </span>
                  <div className="mt-2 text-[13px] sm:text-sm font-black text-white leading-snug uppercase tracking-tight font-['Helvetica_Neue',Helvetica,Arial,sans-serif]">
                    {station.name}
                  </div>
                </div>
              ))}
            </div>

          {/* Rows cascade in */}
          <div className="divide-y divide-neutral-800/80">
            {comparisonRows.map((row, i) => (
              <div
                key={row.label}
                className={`relative grid grid-cols-[140px_1fr_1fr] sm:grid-cols-[200px_1fr_1fr] bg-[#0f0f0f] group ${revealBase} ${
                  isVisible ? revealShown : revealHidden
                }`}
                style={staggerDelay(i, 55)}
              >
                <span
                  aria-hidden="true"
                  className="absolute inset-0 bg-[#151515] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out"
                ></span>

                <div className="relative px-4 sm:px-5 py-3.5">
                  <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-wider text-neutral-500 group-hover:text-red-400 transition-colors duration-200">
                    {row.label}
                  </span>
                </div>
                <div className="relative px-4 sm:px-5 py-3.5 border-l border-neutral-800/80">
                  <span className="text-[13px] text-gray-200 leading-snug">{row.station1}</span>
                </div>
                <div className="relative px-4 sm:px-5 py-3.5 border-l border-neutral-800/80">
                  <span className="text-[13px] text-gray-200 leading-snug">{row.station2}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

        <p className="mt-4 text-[12px] text-neutral-500 leading-relaxed max-w-3xl">
          Both in Lewisville: a short deadhead to DFW jobs, and one staging point for statewide routes.
        </p>
      </div>
    </section>
  );
};

export default AboutStations;

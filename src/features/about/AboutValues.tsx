'use client';

import React, { useState } from 'react';
import { Flame, Shield, Scale, Heart, CheckCircle2, ShieldCheck } from 'lucide-react';
import { AboutSectionHeader } from './AboutSectionHeader';
import { useReveal, revealBase, revealHidden, revealShown, staggerDelay } from './useReveal';

interface Standard {
  id: string;
  code: string;
  category: string;
  title: string;
  promise: string;
  icon: React.ReactNode;
  included: string[];
  accountability: string;
}

const standards: Standard[] = [
  {
    id: 'crew',
    code: 'STD-01',
    category: 'PERSONNEL INTEGRITY',
    title: 'Brotherhood & Discipline',
    promise: 'One assigned unit, with a named lead mover on every job.',
    icon: <Flame className="w-5 h-5" />,
    included: [
      'Employed movers — zero day-labor',
      'Background checks and in-house certification',
      'Named lead owns the job, load to handover',
    ],
    accountability: 'Ask for your lead by name — the same crew finishes the job.',
  },
  {
    id: 'care',
    code: 'STD-02',
    category: 'PROPERTY DEFENSE',
    title: 'Extreme Care & Protection',
    promise: 'Your home is protected before a single box is lifted.',
    icon: <Shield className="w-5 h-5" />,
    included: [
      'Jamb guards and bannister quilts on arrival',
      'Neoprene runners on hardwood, tile and carpet',
      'Quilted blankets and shrink wrap on furniture',
    ],
    accountability: 'Protection is itemised on the estimate, never billed on the day.',
  },
  {
    id: 'pricing',
    code: 'STD-03',
    category: 'ESTIMATE ACCURACY',
    title: 'Radical Honesty On Price',
    promise: 'The number on your written estimate is the number you pay.',
    icon: <Scale className="w-5 h-5" />,
    included: [
      'Written estimate issued before move day',
      'No stair fees, fuel spikes or travel surcharges',
      'Itemised invoice reviewed at handover',
    ],
    accountability: 'If a charge is not on the estimate you approved, you do not pay it.',
  },
  {
    id: 'community',
    code: 'STD-04',
    category: 'CIVIC DEDICATION',
    title: 'Community & First Responders',
    promise: 'We stay accountable to the community our founders serve.',
    icon: <Heart className="w-5 h-5" />,
    included: [
      'Rates for first responders and veterans',
      'North Texas youth athletic sponsorships',
      'Annual local charity partnerships',
    ],
    accountability: 'Responder and veteran rates apply with ID at booking.',
  },
];

export const AboutValues: React.FC = () => {
  const [activeId, setActiveId] = useState<string>(standards[0].id);
  const { ref, isVisible } = useReveal<HTMLDivElement>();

  return (
    <section id="standards" className="scroll-mt-32 py-20 sm:py-24 bg-black border-b border-neutral-800/80 relative overflow-hidden">
      {/* Ambient background glow */}
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-red-600/5 rounded-full blur-[140px] pointer-events-none"
      ></div>

      <div className="w-[min(1200px,calc(100%-32px))] sm:w-[min(1200px,calc(100%-80px))] mx-auto relative z-10">
        <AboutSectionHeader index="03" title="Operating standards" meta="APPLIED TO EVERY JOB" />

        {/* Tactical Subheading Bar */}
        <div className="flex items-center justify-between flex-wrap gap-3 mb-8 pb-4 border-b border-neutral-800/60">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-mono text-xs font-semibold text-neutral-300 uppercase tracking-wider">
              4 Non-Negotiable Operational Directives
            </span>
          </div>
          <div className="font-mono text-[11px] text-neutral-500 uppercase tracking-widest bg-neutral-900/90 border border-neutral-800/90 px-3 py-1 rounded-full">
            Standard Operating Procedures // 100% Enforced
          </div>
        </div>

        {/* 2x2 Tactical Dossier Grid */}
        <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-7">
          {standards.map((standard, i) => {
            const isSelected = activeId === standard.id;
            return (
              <div
                key={standard.id}
                onClick={() => setActiveId(standard.id)}
                className={`group relative rounded-2xl border transition-all duration-300 p-6 sm:p-8 flex flex-col justify-between cursor-pointer select-none ${revealBase} ${
                  isVisible ? revealShown : revealHidden
                } ${
                  isSelected
                    ? 'bg-[#131313] border-red-500/70 shadow-[0_0_35px_rgba(239,68,68,0.18)] -translate-y-1'
                    : 'bg-[#0e0e0e] border-neutral-800/80 hover:bg-[#121212] hover:border-neutral-700 hover:-translate-y-1 hover:shadow-xl'
                }`}
                style={staggerDelay(i, 80)}
              >
                {/* Decorative Cyber Corner Accents */}
                <div
                  aria-hidden="true"
                  className={`absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 rounded-tr-2xl transition-colors duration-300 ${
                    isSelected ? 'border-red-500' : 'border-neutral-800 group-hover:border-red-500/50'
                  }`}
                ></div>

                {/* Top Row: Icon Badge + STD Code & Category */}
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                        isSelected
                          ? 'bg-red-600/20 border border-red-500 text-red-400 shadow-[0_0_20px_rgba(239,68,68,0.3)] scale-105'
                          : 'bg-neutral-900 border border-neutral-800 text-neutral-400 group-hover:text-red-400 group-hover:border-red-500/40 group-hover:bg-red-950/40'
                      }`}
                    >
                      {standard.icon}
                    </div>

                    <div className="text-right">
                      <span className="inline-block font-mono text-xs font-bold text-red-400 bg-red-950/30 border border-red-500/30 px-2.5 py-1 rounded-md tracking-wider">
                        {standard.code}
                      </span>
                      <span className="block font-mono text-[10px] tracking-widest text-neutral-500 uppercase mt-1.5">
                        {standard.category}
                      </span>
                    </div>
                  </div>

                  {/* Standard Title */}
                  <h3 className="text-xl sm:text-2xl font-black uppercase text-white tracking-tight font-['Helvetica_Neue',Helvetica,Arial,sans-serif] mt-5 group-hover:text-red-400 transition-colors">
                    {standard.title}
                  </h3>

                  {/* Core Promise Callout */}
                  <div className="mt-3 p-3.5 rounded-lg bg-neutral-900/60 border-l-2 border-red-500 text-sm text-neutral-200 leading-relaxed font-sans">
                    {standard.promise}
                  </div>

                  {/* Verifiable Requirements */}
                  <div className="mt-6">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-neutral-500 font-semibold mb-2.5 block">
                      Mandatory Protocols
                    </span>
                    <div className="space-y-2">
                      {standard.included.map((item) => (
                        <div
                          key={item}
                          className="flex items-center gap-2.5 text-xs sm:text-[13px] text-neutral-300 py-2 px-3 rounded-lg bg-[#141414] border border-neutral-800/80 group-hover:border-neutral-700/80 transition-colors"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-red-500 shrink-0" />
                          <span className="leading-snug">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Accountability / Hold Us To It Guarantee Box */}
                <div className="mt-6 pt-4 border-t border-neutral-800/80">
                  <div className="flex items-center gap-1.5 font-mono text-[11px] font-bold text-red-500 uppercase tracking-widest mb-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-red-500" />
                    <span>Hold Us To It — Client Guarantee</span>
                  </div>
                  <p className="text-xs sm:text-[13px] text-neutral-400 font-sans leading-relaxed">
                    {standard.accountability}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default AboutValues;

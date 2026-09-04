'use client';

import React, { useState } from 'react';
import { Flame, Shield, Scale, Heart, ChevronRight, CheckCircle2 } from 'lucide-react';
import { AboutSectionHeader } from './AboutSectionHeader';
import { useReveal, revealBase, revealHidden, revealShown, staggerDelay } from './useReveal';

interface Standard {
  id: string;
  code: string;
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
    title: 'Brotherhood & discipline',
    promise: 'One assigned unit, with a named lead mover on every job.',
    icon: <Flame className="w-4 h-4" />,
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
    title: 'Extreme care & protection',
    promise: 'Your home is protected before a single box is lifted.',
    icon: <Shield className="w-4 h-4" />,
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
    title: 'Radical honesty on price',
    promise: 'The number on your written estimate is the number you pay.',
    icon: <Scale className="w-4 h-4" />,
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
    title: 'Community & first responders',
    promise: 'We stay accountable to the community our founders serve.',
    icon: <Heart className="w-4 h-4" />,
    included: [
      'Rates for first responders and veterans',
      'North Texas youth athletic sponsorships',
      'Annual local charity partnerships',
    ],
    accountability: 'Responder and veteran rates apply with ID at booking.',
  },
];

export const AboutValues: React.FC = () => {
  const [openId, setOpenId] = useState<string>(standards[0].id);
  const { ref, isVisible } = useReveal<HTMLDivElement>();

  return (
    <section id="standards" className="scroll-mt-32 py-16 sm:py-20 bg-black border-b border-neutral-800">
      <div className="w-[min(1200px,calc(100%-32px))] sm:w-[min(1200px,calc(100%-80px))] mx-auto">
        <AboutSectionHeader index="04" title="Operating standards" meta="APPLIED TO EVERY JOB" />

        <div ref={ref} className="rounded-xl border border-neutral-800 overflow-hidden divide-y divide-neutral-800">
          {standards.map((standard, i) => {
            const isOpen = openId === standard.id;
            return (
              <div
                key={standard.id}
                className={`transition-colors duration-300 ${revealBase} ${
                  isVisible ? revealShown : revealHidden
                } ${isOpen ? 'bg-[#131313]' : 'bg-[#0f0f0f]'}`}
                style={staggerDelay(i, 80)}
              >
                <button
                  type="button"
                  onClick={() => setOpenId(isOpen ? '' : standard.id)}
                  aria-expanded={isOpen}
                  className="relative w-full text-left px-4 sm:px-6 py-3.5 sm:py-4 flex items-center gap-3 sm:gap-6 group cursor-pointer"
                >
                  {/* Hover sweep */}
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 bg-[#161616] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out"
                  ></span>

                  <span
                    className={`relative shrink-0 w-9 h-9 rounded-lg border flex items-center justify-center transition-all duration-300 ${
                      isOpen
                        ? 'bg-red-600/15 border-red-500/50 text-red-400 scale-105'
                        : 'bg-neutral-900 border-neutral-800 text-neutral-500 group-hover:text-neutral-300'
                    }`}
                  >
                    {standard.icon}
                  </span>

                  <span className="relative hidden sm:block font-mono text-[11px] tracking-widest text-neutral-600 shrink-0 w-16">
                    {standard.code}
                  </span>

                  <span className="relative min-w-0 flex-1">
                    <span className="block text-sm sm:text-base font-black text-white tracking-tight uppercase font-['Helvetica_Neue',Helvetica,Arial,sans-serif]">
                      {standard.title}
                    </span>
                    <span className="block text-[12px] sm:text-[13px] text-neutral-400 mt-0.5 leading-snug">
                      {standard.promise}
                    </span>
                  </span>

                  <ChevronRight
                    className={`relative w-4 h-4 shrink-0 transition-all duration-300 ${
                      isOpen ? 'rotate-90 text-red-500' : 'text-neutral-500 group-hover:translate-x-0.5'
                    }`}
                  />
                </button>

                <div
                  className={`grid transition-all duration-[400ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="px-4 sm:px-6 pb-4 sm:pb-5 sm:pl-[124px] grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2.5">
                      {standard.included.map((item, ii) => (
                        <div
                          key={item}
                          className="flex items-start gap-2.5 transition-[opacity,transform] duration-500 ease-out"
                          style={{
                            opacity: isOpen ? 1 : 0,
                            transform: isOpen ? 'translateY(0)' : 'translateY(6px)',
                            transitionDelay: isOpen ? `${100 + ii * 60}ms` : '0ms',
                          }}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-red-500 shrink-0 mt-[3px]" />
                          <span className="text-[13px] text-gray-300 leading-snug">{item}</span>
                        </div>
                      ))}

                      <p
                        className="md:col-span-2 mt-2 pt-3 border-t border-neutral-800 text-[12px] font-mono text-neutral-500 leading-relaxed transition-[opacity,transform] duration-500 ease-out"
                        style={{
                          opacity: isOpen ? 1 : 0,
                          transform: isOpen ? 'translateY(0)' : 'translateY(6px)',
                          transitionDelay: isOpen ? '300ms' : '0ms',
                        }}
                      >
                        HOLD US TO IT → {standard.accountability}
                      </p>
                    </div>
                  </div>
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

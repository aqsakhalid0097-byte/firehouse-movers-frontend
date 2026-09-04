'use client';

import React from 'react';
import { FileCheck, ShieldCheck, ClipboardList, UserCheck } from 'lucide-react';
import { AboutSectionHeader } from './AboutSectionHeader';
import { useReveal, revealBase, revealHidden, revealShown, staggerDelay } from './useReveal';

const credentials = [
  {
    icon: <FileCheck className="w-4 h-4" />,
    title: 'Licensed household goods carrier',
    lines: ['Registered to move household goods in Texas', 'Interstate authority for out-of-state moves'],
  },
  {
    icon: <ShieldCheck className="w-4 h-4" />,
    title: 'Insurance & valuation',
    lines: ['Cargo and general liability carried at all times', 'Certificate of insurance for commercial buildings'],
  },
  {
    icon: <UserCheck className="w-4 h-4" />,
    title: 'Crew vetting',
    lines: ['Background checks before job assignment', 'In-house handling and equipment certification'],
  },
  {
    icon: <ClipboardList className="w-4 h-4" />,
    title: 'Documentation',
    lines: ['Written estimate approved before load day', 'Signed handover sheet and itemised invoice'],
  },
];

export const AboutCredentials: React.FC = () => {
  const { ref, isVisible } = useReveal<HTMLDivElement>();

  return (
    <section id="credentials" className="scroll-mt-32 py-16 sm:py-20 bg-[#0b0b0b] border-b border-neutral-800">
      <div className="w-[min(1200px,calc(100%-32px))] sm:w-[min(1200px,calc(100%-80px))] mx-auto">
        <AboutSectionHeader index="06" title="Credentials & paperwork" meta="ISSUED IN WRITING" />

        <div
          ref={ref}
          className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-neutral-800/70 border border-neutral-800 rounded-xl overflow-hidden"
        >
          {credentials.map((credential, i) => (
            <div
              key={credential.title}
              className={`bg-[#0f0f0f] hover:bg-[#141414] transition-colors duration-300 p-4 sm:p-6 group ${revealBase} ${
                isVisible ? revealShown : revealHidden
              }`}
              style={staggerDelay(i, 90)}
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-800 text-red-400 flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110">
                  {credential.icon}
                </span>
                <h3 className="text-sm font-black uppercase text-white tracking-tight font-['Helvetica_Neue',Helvetica,Arial,sans-serif]">{credential.title}</h3>
              </div>

              <ul className="space-y-2 border-t border-neutral-800 pt-4">
                {credential.lines.map((line) => (
                  <li key={line} className="flex items-start gap-2.5">
                    <span className="mt-[7px] w-1 h-1 rounded-full bg-red-500 shrink-0"></span>
                    <span className="text-[13px] text-gray-300 leading-snug">{line}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="mt-4 text-[12px] text-neutral-500 leading-relaxed max-w-3xl">
          License, authority and policy numbers appear on your written estimate and certificate of
          insurance — in writing, not verbally.
        </p>
      </div>
    </section>
  );
};

export default AboutCredentials;

'use client';

import React from 'react';
import { Quote } from 'lucide-react';
import { AboutSectionHeader } from './AboutSectionHeader';
import { useReveal, revealBase, revealHidden, revealShown, staggerDelay } from './useReveal';

const industryProblems = [
  {
    problem: 'Quotes that moved on move day',
    response: 'Written estimate agreed before loading. No stair, fuel or travel surcharges.',
  },
  {
    problem: 'Strangers hired that morning',
    response: 'Employed crews only — background checked, uniformed, trained in-house.',
  },
  {
    problem: 'Damage blamed on settling',
    response: 'Home protected first: jamb guards, floor runners, blanket-wrapped furniture.',
  },
  {
    problem: 'Shipments sitting in a warehouse',
    response: 'Direct routes — the same crew loads, drives and unloads.',
  },
];

export const AboutStory: React.FC = () => {
  const copy = useReveal<HTMLDivElement>();
  const table = useReveal<HTMLDivElement>();

  return (
    <section id="story" className="scroll-mt-32 py-16 sm:py-20 bg-black border-b border-neutral-800">
      <div className="w-[min(1200px,calc(100%-32px))] sm:w-[min(1200px,calc(100%-80px))] mx-auto">
        <AboutSectionHeader index="02" title="Origin" meta="2004 — LEWISVILLE, TEXAS" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          {/* Narrative */}
          <div ref={copy.ref} className="lg:col-span-6 space-y-5">
            <p
              className={`text-base sm:text-lg text-gray-200 leading-relaxed ${revealBase} ${
                copy.isVisible ? revealShown : revealHidden
              }`}
            >
              Firehouse Movers started at the kitchen table of a North Texas fire station. On off-duty days
              our founders moved neighbors — and kept hearing the same complaints about the crews those
              families had hired before.
            </p>

            <p
              className={`text-sm sm:text-base text-neutral-400 leading-relaxed ${revealBase} ${
                copy.isVisible ? revealShown : revealHidden
              }`}
              style={staggerDelay(1, 110)}
            >
              A quote that changed on move day. A crew nobody had vetted. Damage that became someone
              else&rsquo;s problem. Every policy below traces back to one of those complaints.
            </p>

            <figure className="relative mt-8 pl-5 py-1">
              {/* Rule draws downward on arrival */}
              <span
                aria-hidden="true"
                className="absolute left-0 top-0 bottom-0 w-[2px] bg-red-600 origin-top transition-transform duration-[700ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
                style={{
                  transform: copy.isVisible ? 'scaleY(1)' : 'scaleY(0)',
                  transitionDelay: '220ms',
                }}
              ></span>

              <div
                className={`${revealBase} ${copy.isVisible ? revealShown : revealHidden}`}
                style={staggerDelay(3, 110)}
              >
                <Quote className="w-4 h-4 text-red-500 mb-2" />
                <blockquote className="text-base sm:text-lg text-white font-medium leading-snug">
                  We took what fire service ingrains — integrity, strength, selfless service,
                  accountability — and made it how a moving company operates.
                </blockquote>
                <figcaption className="mt-3 text-[11px] font-mono uppercase tracking-widest text-neutral-500">
                  Founding principle
                </figcaption>
              </div>
            </figure>
          </div>

          {/* Problem → response */}
          <div className="lg:col-span-6" ref={table.ref}>
            <div
              className={`rounded-xl border border-neutral-800 overflow-hidden ${revealBase} ${
                table.isVisible ? revealShown : revealHidden
              }`}
            >
              <div className="hidden sm:grid grid-cols-2 px-5 py-3 bg-[#131313] border-b border-neutral-800 gap-4">
                <span className="font-mono text-[11px] uppercase tracking-widest text-neutral-500">
                  What we heard
                </span>
                <span className="font-mono text-[11px] uppercase tracking-widest text-red-500">
                  What we built
                </span>
              </div>

              <div className="divide-y divide-neutral-800/80">
                {industryProblems.map((row, i) => (
                  <div
                    key={row.problem}
                    className={`grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 px-4 sm:px-5 py-4 bg-[#0f0f0f] hover:bg-[#141414] transition-colors duration-200 ${revealBase} ${
                      table.isVisible ? revealShown : revealHidden
                    }`}
                    style={staggerDelay(i, 90)}
                  >
                    <div>
                      <span className="font-mono text-[10px] uppercase tracking-widest text-neutral-500 block sm:hidden mb-1">
                        What we heard:
                      </span>
                      <p className="relative inline-block text-[13px] text-neutral-500 leading-snug w-fit">
                        {row.problem}
                        {/* Strike sweeps across once the row lands */}
                        <span
                          aria-hidden="true"
                          className="absolute left-0 top-1/2 h-px w-full bg-neutral-600 origin-left transition-transform duration-[500ms] ease-out"
                          style={{
                            transform: table.isVisible ? 'scaleX(1)' : 'scaleX(0)',
                            transitionDelay: `${300 + i * 90}ms`,
                          }}
                        ></span>
                      </p>
                    </div>
                    <div>
                      <span className="font-mono text-[10px] uppercase tracking-widest text-red-500 block sm:hidden mb-1">
                        What we built:
                      </span>
                      <p className="text-[13px] text-gray-200 leading-snug">{row.response}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutStory;

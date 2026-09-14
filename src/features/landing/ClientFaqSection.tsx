'use client';

import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { TextReveal } from '@/components/TextReveal';

const CITIES = [
  'Lewisville', 'Frisco', 'Plano', 'Carrollton',
  'Flower Mound', 'Allen', 'McKinney', 'Denton',
  'The Colony', 'Coppell', 'Little Elm', 'Prosper'
];

const FAQS = [
  {
    q: 'How accurate is the price estimate I receive?',
    a: 'We provide itemized, binding estimates based on your inventory walkthrough or survey. The rate we quote is the rate you pay on move day — with zero hidden fuel charges, stair fees, or surprise equipment surcharges.',
  },
  {
    q: 'Are your trucks and movers licensed and insured?',
    a: 'Yes. Firehouse Movers is fully licensed under TxDMV #000570404B and federally certified with USDOT #1939062. We carry comprehensive cargo insurance, general liability, and commercial auto policies.',
  },
  {
    q: 'How do you protect hardwood floors, carpets, and doorframes?',
    a: 'Before any furniture moves an inch, our crew rolls out heavy neoprene floor runners across high-traffic hallways and puts padded door jamb guards on entryways to eliminate dents, scuffs, and dirt.',
  },
  {
    q: 'Can you handle commercial and after-hours office moves?',
    a: 'Absolutely. We regularly coordinate corporate relocations on Friday evenings and weekends so your employees finish work in one office and resume at 9 AM Monday without downtime.',
  },
];

export const ClientFaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="relative bg-black text-white py-28 px-6 sm:px-10 lg:px-16 border-t border-neutral-800">
      <div className="max-w-7xl mx-auto">
        {/* Service Area Grid - flush against the page rather than boxed in a
            card, matching the client site's flatter, un-boxed panels */}
        <div className="mb-20 pt-10 sm:pt-12 border-t border-neutral-800">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-3 text-red-400 font-mono text-xs font-bold tracking-[0.18em] uppercase mb-3">
                <span>SERVICE AREA</span>
                <span className="h-px flex-1 max-w-[120px] bg-current opacity-30" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Where We Operate Across North Texas
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-neutral-400 max-w-md">
              Dedicated regional dispatch from Lewisville HQ serving all major Denton and Collin County communities.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {CITIES.map((city) => (
              <div
                key={city}
                className="flex items-center justify-center p-3 rounded-xl bg-neutral-900/60 border border-neutral-800 text-xs sm:text-sm font-semibold text-neutral-300 hover:text-white hover:border-red-500/40 hover:bg-neutral-900 transition-all cursor-default"
              >
                {city}
              </div>
            ))}
          </div>
        </div>

        {/* FAQs Accordion */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3 text-red-400 font-mono text-xs font-bold tracking-[0.18em] uppercase">
              <span>FREQUENT QUESTIONS</span>
              <span className="h-px flex-1 max-w-[120px] bg-current opacity-30" />
            </div>

            <TextReveal as="h2" className="display-heading display-heading--sub text-white leading-[0.92]" variant="flip">
              Clear answers <br />
              <span className="text-red-500">before you book.</span>
            </TextReveal>

            <p className="text-neutral-400 text-sm sm:text-base leading-relaxed pt-2">
              Everything you need to know about our crew, pricing, and relocation protocols. Have a custom requirement? Our team is available 7 days a week.
            </p>
          </div>

          <div className="lg:col-span-7 space-y-3">
            {FAQS.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-white/[0.08] bg-neutral-950/60 overflow-hidden transition-colors hover:border-white/15"
                >
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between p-5 sm:p-6 text-left transition-colors"
                  >
                    <span className="font-bold text-sm sm:text-base text-white pr-4">
                      {faq.q}
                    </span>
                    <span className="shrink-0 w-8 h-8 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-red-500">
                      {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="px-5 sm:px-6 pb-6 pt-1 text-xs sm:text-sm text-neutral-300 leading-relaxed border-t border-white/[0.04]">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClientFaqSection;

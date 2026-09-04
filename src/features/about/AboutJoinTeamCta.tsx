'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Phone, Briefcase } from 'lucide-react';
import { TextReveal } from '@/components/TextReveal';
import { useReveal, revealBase, revealHidden, revealShown, staggerDelay } from './useReveal';

export const AboutJoinTeamCta: React.FC = () => {
  const { ref, isVisible } = useReveal<HTMLDivElement>();

  return (
    <section className="py-16 sm:py-20 bg-black">
      <div className="w-[min(1200px,calc(100%-32px))] sm:w-[min(1200px,calc(100%-80px))] mx-auto">
        <div
          ref={ref}
          className={`rounded-2xl border border-neutral-800 bg-gradient-to-br from-[#1a0d0d] via-[#0f0f0f] to-[#0f0f0f] overflow-hidden ${revealBase} ${
            isVisible ? revealShown : revealHidden
          }`}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Customer */}
            <div
              className={`lg:col-span-7 p-5 sm:p-10 border-b lg:border-b-0 lg:border-r border-neutral-800 ${revealBase} ${
                isVisible ? revealShown : revealHidden
              }`}
              style={staggerDelay(1, 120)}
            >
              <span className="font-mono text-[11px] uppercase tracking-widest text-red-500 font-bold">
                Moving with us
              </span>
              <TextReveal
                as="h2"
                className="display-heading display-heading--editorial text-white mt-3 leading-tight"
                start="top 85%"
              >
                Get the estimate in writing first.
              </TextReveal>
              <p className="mt-3 text-sm text-neutral-400 leading-relaxed max-w-xl">
                Tell us what you are moving and where. You get a written number, a named lead mover, and an
                arrival window we hold ourselves to.
              </p>

              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <Link
                  href="/landing#estimate-calculator"
                  className="group inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-sm transition-all duration-200 hover:-translate-y-0.5 cursor-pointer w-full sm:w-auto text-center"
                >
                  <span>Request an estimate</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
                <a
                  href="tel:9725399588"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg border border-neutral-700 hover:border-neutral-500 text-neutral-200 hover:text-white font-semibold text-sm transition-all duration-200 hover:-translate-y-0.5 cursor-pointer w-full sm:w-auto text-center"
                >
                  <Phone className="w-4 h-4 text-red-500" />
                  <span>(972) 539-9588</span>
                </a>
              </div>
            </div>

            {/* Careers */}
            <div
              className={`lg:col-span-5 p-5 sm:p-10 bg-[#0c0c0c] ${revealBase} ${
                isVisible ? revealShown : revealHidden
              }`}
              style={staggerDelay(2, 120)}
            >
              <span className="font-mono text-[11px] uppercase tracking-widest text-neutral-500 font-bold">
                Working with us
              </span>
              <TextReveal
                as="h3"
                className="display-heading display-heading--compact text-white mt-3 leading-tight"
                start="top 85%"
              >
                We hire movers, not day labor.
              </TextReveal>
              <p className="mt-3 text-[13px] text-neutral-400 leading-relaxed">
                Full-time roles, benefits and in-house training.
              </p>

              <a
                href="tel:9725399588"
                className="group mt-6 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-600 text-white font-semibold text-[13px] transition-all duration-200 hover:-translate-y-0.5 cursor-pointer w-full sm:w-auto text-center"
              >
                <Briefcase className="w-4 h-4 text-red-500 transition-transform duration-200 group-hover:scale-110" />
                <span>Ask about openings</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutJoinTeamCta;

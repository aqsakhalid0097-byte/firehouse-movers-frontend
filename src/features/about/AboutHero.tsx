'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Phone, MapPin } from 'lucide-react';
import { TextReveal } from '@/components/TextReveal';
import { revealBase, revealHidden, revealShown, staggerDelay } from './useReveal';

const headerFacts = [
  { label: 'Founded', value: '2004' },
  { label: 'Headquarters', value: 'Lewisville, TX' },
  { label: 'Facilities', value: '2 Stations' },
  { label: 'Crews', value: '40+ In-House' },
  { label: 'Coverage', value: 'DFW + Statewide' },
];

export const AboutHero: React.FC = () => {
  const [mounted, setMounted] = useState(false);

  // Entrance runs on mount rather than on scroll — this block is above the fold.
  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const show = (delay: number) => ({
    className: `${revealBase} ${mounted ? revealShown : revealHidden}`,
    style: { transitionDelay: `${delay}ms` },
  });

  return (
    <section className="relative bg-black text-white overflow-hidden pt-32 pb-14 sm:pt-36 sm:pb-16 border-b border-neutral-800">
      {/* Technical grid backdrop, fading up as the page settles */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none transition-opacity duration-[1400ms] ease-out"
        style={{
          opacity: mounted ? 0.16 : 0,
          backgroundImage:
            'linear-gradient(to right, #3f3f46 1px, transparent 1px), linear-gradient(to bottom, #3f3f46 1px, transparent 1px)',
          backgroundSize: '64px 64px',
          maskImage: 'radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 100%)',
        }}
      ></div>

      <div className="w-[min(1200px,calc(100%-32px))] sm:w-[min(1200px,calc(100%-80px))] mx-auto relative z-10">
        {/* File-header line */}
        <div
          {...show(0)}
          className={`flex flex-wrap items-center gap-x-3 gap-y-2 text-[10px] sm:text-[11px] font-mono uppercase tracking-widest text-neutral-500 mb-7 pb-5 border-b border-neutral-800/80 ${revealBase} ${
            mounted ? revealShown : revealHidden
          }`}
        >
          <span className="text-red-500 font-bold">Company Profile</span>
          <span className="text-neutral-700">/</span>
          <span>Firehouse Movers Inc.</span>
          <span className="text-neutral-700">/</span>
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="w-3 h-3" />
            North Texas
          </span>
          <span className="ml-auto inline-flex items-center gap-1.5 text-emerald-400/90">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Since 2004
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-end">
          {/* Identity */}
          <div className="lg:col-span-7">
            <TextReveal
              as="h1"
              className="display-heading display-heading--section text-white"
              delay={0.12}
            >
              <span className="block text-white">Firefighters who got</span>
              <span className="block text-white">tired of watching movers</span>
              <span className="block text-red-500">cut corners.</span>
            </TextReveal>

            <p
              {...show(420)}
              className={`mt-6 text-sm sm:text-base text-neutral-400 leading-relaxed max-w-xl ${revealBase} ${
                mounted ? revealShown : revealHidden
              }`}
            >
              We started in 2004 on off-duty days from a North Texas fire station — prepared, accountable,
              on time. Everything below is the detail behind that.
            </p>

            <div
              {...show(500)}
              className={`mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto ${revealBase} ${
                mounted ? revealShown : revealHidden
              }`}
            >
              <Link
                href="/landing#estimate-calculator"
                className="group inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-sm transition-all duration-200 hover:-translate-y-0.5 cursor-pointer w-full sm:w-auto text-center"
              >
                <span>Get a written estimate</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
              <a
                href="tel:9725399588"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg border border-neutral-800 hover:border-neutral-600 text-neutral-300 hover:text-white font-semibold text-sm transition-all duration-200 hover:-translate-y-0.5 cursor-pointer w-full sm:w-auto text-center"
              >
                <Phone className="w-4 h-4 text-red-500" />
                <span>(972) 539-9588</span>
              </a>
            </div>
          </div>

          {/* Fact strip */}
          <div className="lg:col-span-5 w-full">
            <dl className="divide-y divide-neutral-800/80 border-y border-neutral-800/80">
              {headerFacts.map((fact, i) => (
                <div
                  key={fact.label}
                  className={`relative flex items-baseline justify-between gap-6 py-3 px-1 group overflow-hidden ${revealBase} ${
                    mounted ? revealShown : revealHidden
                  }`}
                  style={staggerDelay(i, 70)}
                >
                  {/* Hover sweep */}
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 bg-neutral-900/50 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out"
                  ></span>
                  <dt className="relative text-[11px] font-mono uppercase tracking-widest text-neutral-500 group-hover:text-red-400 transition-colors duration-200">
                    {fact.label}
                  </dt>
                  <dd className="relative text-sm sm:text-base font-bold text-white text-right">
                    {fact.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutHero;

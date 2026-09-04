'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Info } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AboutSectionHeader } from './AboutSectionHeader';
import { useReveal, revealBase, revealHidden, revealShown, staggerDelay } from './useReveal';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface Metric {
  id: string;
  value: string;
  label: string;
  detail: string;
  method: string;
}

const metrics: Metric[] = [
  {
    id: 'years',
    value: '20+',
    label: 'Years in service',
    detail: 'Operating in North Texas since 2004.',
    method: 'From company formation — not a rebrand.',
  },
  {
    id: 'moves',
    value: '50,000+',
    label: 'Moves completed',
    detail: 'Residential, corporate, specialty and storage jobs.',
    method: 'Completed dispatches with a signed handover sheet.',
  },
  {
    id: 'ontime',
    value: '99.4%',
    label: 'On-time arrival',
    detail: 'Crews arriving inside the booked window.',
    method: 'Tracked per dispatch, trailing twelve months.',
  },
  {
    id: 'rating',
    value: '4.9 ★',
    label: 'Customer rating',
    detail: 'Averaged across 3,500+ published reviews.',
    method: 'Public platforms — unfiltered, never gated.',
  },
  {
    id: 'crew',
    value: '100%',
    label: 'In-house crews',
    detail: 'Every mover is employed, vetted and trained by us.',
    method: 'Zero day-labor. No subcontracted crews.',
  },
  {
    id: 'fleet',
    value: '26 FT',
    label: 'Air-ride fleet',
    detail: 'Air-ride trailers with E-track securing and liftgates.',
    method: 'Owned in-house, inspected before every dispatch.',
  },
];

const profileRows = [
  { label: 'Legal name', value: 'Firehouse Movers Inc.' },
  { label: 'Founded', value: '2004 — Lewisville, Texas' },
  { label: 'Founders', value: 'Active North Texas firefighters' },
  { label: 'Headquarters', value: 'Station 1 — Lewisville, TX' },
  { label: 'Second facility', value: 'Station 2 — vault storage' },
  { label: 'Service lines', value: 'Residential · Corporate · Specialty · Storage' },
  { label: 'Primary coverage', value: 'Dallas, Denton & Collin counties' },
  { label: 'Extended coverage', value: 'Statewide direct routes' },
  { label: 'Crew model', value: 'Employed, background checked' },
  { label: 'Pricing model', value: 'Written estimate, no surcharges' },
];

export const AboutAtAGlance: React.FC = () => {
  const [activeMetric, setActiveMetric] = useState<Metric>(metrics[0]);
  const [faded, setFaded] = useState(true);
  const sectionRef = useRef<HTMLElement | null>(null);
  const gridRef = useRef<HTMLDivElement | null>(null);
  const metricRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const profile = useReveal<HTMLDivElement>();

  // Quick crossfade whenever the selected metric changes
  useEffect(() => {
    setFaded(false);
    const id = requestAnimationFrame(() => setFaded(true));
    return () => cancelAnimationFrame(id);
  }, [activeMetric.id]);

  // Entrance stagger animation & count-up rolling numbers
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      if (metricRefs.current['years']) metricRefs.current['years'].textContent = '20+';
      if (metricRefs.current['moves']) metricRefs.current['moves'].textContent = '50,000+';
      if (metricRefs.current['ontime']) metricRefs.current['ontime'].textContent = '99.4%';
      if (metricRefs.current['rating']) metricRefs.current['rating'].textContent = '4.9 ★';
      if (metricRefs.current['crew']) metricRefs.current['crew'].textContent = '100%';
      if (metricRefs.current['fleet']) metricRefs.current['fleet'].textContent = '26 FT';
      return;
    }

    const ctx = gsap.context(() => {
      // 1. Entrance animation for stat cards
      gsap.fromTo(
        '.about-stat-card',
        { opacity: 0, y: 22, scale: 0.96 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.65,
          stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: gridRef.current,
            start: 'top 85%',
            once: true,
          },
        }
      );

      // 2. Rolling count-up animation
      const stats = {
        years: 0,
        moves: 0,
        ontime: 0,
        rating: 0,
        crew: 0,
        fleet: 0,
      };

      gsap.to(stats, {
        years: 20,
        moves: 50000,
        ontime: 99.4,
        rating: 4.9,
        crew: 100,
        fleet: 26,
        duration: 2.2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: gridRef.current,
          start: 'top 85%',
          once: true,
        },
        onUpdate: () => {
          if (metricRefs.current['years']) {
            metricRefs.current['years'].textContent = `${Math.floor(stats.years)}+`;
          }
          if (metricRefs.current['moves']) {
            metricRefs.current['moves'].textContent = `${Math.floor(stats.moves).toLocaleString()}+`;
          }
          if (metricRefs.current['ontime']) {
            metricRefs.current['ontime'].textContent = `${stats.ontime.toFixed(1)}%`;
          }
          if (metricRefs.current['rating']) {
            metricRefs.current['rating'].textContent = `${stats.rating.toFixed(1)} ★`;
          }
          if (metricRefs.current['crew']) {
            metricRefs.current['crew'].textContent = `${Math.floor(stats.crew)}%`;
          }
          if (metricRefs.current['fleet']) {
            metricRefs.current['fleet'].textContent = `${Math.floor(stats.fleet)} FT`;
          }
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="glance"
      className="scroll-mt-32 py-16 sm:py-20 bg-[#0b0b0b] border-b border-neutral-800"
    >
      <div className="w-[min(1200px,calc(100%-32px))] sm:w-[min(1200px,calc(100%-80px))] mx-auto">
        <AboutSectionHeader index="01" title="At a glance" meta="SELECT A METRIC FOR METHODOLOGY" />

        {/* Balanced, Symmetrical 2-Column Grid (50% / 50% split with equal height alignment) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-stretch">
          {/* Left Column: Stat Cards (2x3 grid) + Methodology & Verification Card */}
          <div className="flex flex-col justify-between h-full space-y-4">
            {/* 6 Stat Cards in 2x3 Grid */}
            <div
              ref={gridRef}
              className="grid grid-cols-2 gap-px bg-neutral-800/70 border border-neutral-800 rounded-xl overflow-hidden shadow-xl"
            >
              {metrics.map((metric) => {
                const isActive = activeMetric.id === metric.id;
                return (
                  <button
                    key={metric.id}
                    type="button"
                    onClick={() => setActiveMetric(metric)}
                    onMouseEnter={() => setActiveMetric(metric)}
                    aria-pressed={isActive}
                    className={`about-stat-card relative text-left p-4 sm:p-5 transition-all duration-300 cursor-pointer group overflow-hidden ${
                      isActive ? 'bg-[#181818] shadow-inner' : 'bg-[#0f0f0f] hover:bg-[#141414]'
                    }`}
                  >
                    {/* Active marker line on top with smooth scale transition */}
                    <span
                      aria-hidden="true"
                      className="absolute top-0 left-0 h-[2px] bg-red-600 origin-left transition-transform duration-[400ms] ease-[cubic-bezier(0.22,1,0.36,1)] w-full"
                      style={{ transform: isActive ? 'scaleX(1)' : 'scaleX(0)' }}
                    ></span>

                    {/* Ambient active glow */}
                    {isActive && (
                      <div className="absolute inset-0 bg-red-600/[0.04] pointer-events-none"></div>
                    )}

                    <div
                      ref={(el) => {
                        metricRefs.current[metric.id] = el;
                      }}
                      className={`display-heading text-2xl xs:text-3xl sm:text-4xl transition-colors duration-300 font-black tracking-tight ${
                        isActive ? 'text-red-500' : 'text-white group-hover:text-neutral-100'
                      }`}
                    >
                      {metric.value}
                    </div>
                    <div
                      className={`text-[10px] sm:text-[11px] font-mono uppercase tracking-widest mt-1 sm:mt-1.5 transition-colors duration-200 ${
                        isActive ? 'text-red-400/90 font-bold' : 'text-neutral-500 group-hover:text-neutral-400'
                      }`}
                    >
                      {metric.label}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Methodology & Verification Card — Symmetrically anchors the bottom of the left portion */}
            <div className="flex-1 rounded-xl border border-neutral-800 bg-[#0f0f0f] p-4 sm:p-5 flex flex-col justify-between shadow-md min-h-[140px]">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-800/80">
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-red-500 shrink-0" />
                  <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-widest text-neutral-400">
                    Methodology &amp; Standards
                  </span>
                </div>
                <span className="text-[10px] font-mono text-red-400 bg-red-950/50 border border-red-900/60 px-2 py-0.5 rounded tracking-wider uppercase">
                  {activeMetric.label}
                </span>
              </div>

              <div className="py-3 flex-1 flex flex-col justify-center">
                <div
                  className={`space-y-1.5 transition-[opacity,transform] duration-300 ease-out ${
                    faded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-1'
                  }`}
                >
                  <p className="text-xs sm:text-sm text-gray-200 leading-relaxed font-medium">
                    {activeMetric.detail}
                  </p>
                  <p className="text-[11px] sm:text-xs text-neutral-400 leading-relaxed font-mono">
                    {activeMetric.method}
                  </p>
                </div>
              </div>

              <div className="pt-2.5 border-t border-neutral-800/80 flex items-center justify-between text-[10px] sm:text-[11px] font-mono text-neutral-500">
                <span>VERIFIED DISPATCH LOGS</span>
                <span className="text-neutral-600">LEWISVILLE HQ</span>
              </div>
            </div>
          </div>

          {/* Right Column: Company Profile */}
          <div className="flex flex-col h-full" ref={profile.ref}>
            <div
              className={`rounded-xl border border-neutral-800 bg-[#0f0f0f] overflow-hidden h-full flex flex-col shadow-xl ${revealBase} ${
                profile.isVisible ? revealShown : revealHidden
              }`}
            >
              <div className="px-4 sm:px-5 py-3 border-b border-neutral-800 bg-[#131313]">
                <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-widest text-neutral-400">
                  Company profile
                </span>
              </div>
              <dl className="divide-y divide-neutral-800/80 flex-1 flex flex-col justify-between">
                {profileRows.map((row, i) => (
                  <div
                    key={row.label}
                    className={`relative grid grid-cols-1 xs:grid-cols-5 gap-1 xs:gap-3 px-4 sm:px-5 py-2.5 flex-1 items-center group overflow-hidden ${revealBase} ${
                      profile.isVisible ? revealShown : revealHidden
                    }`}
                    style={staggerDelay(i, 35)}
                  >
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 bg-neutral-900/60 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out"
                    ></span>
                    <dt className="relative xs:col-span-2 text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-neutral-500 group-hover:text-red-400 transition-colors duration-200 self-center">
                      {row.label}
                    </dt>
                    <dd className="relative xs:col-span-3 text-xs sm:text-[13px] text-gray-200 leading-snug self-center">
                      {row.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutAtAGlance;

'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ArrowRight,
  Phone,
  MapPin,
  ShieldCheck,
  Clock,
  Package,
  CheckCircle2,
} from 'lucide-react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface HeaderFact {
  label: string;
  value: string;
}

const headerFacts: HeaderFact[] = [
  { label: 'Founded', value: '2004' },
  { label: 'Headquarters', value: 'Lewisville, TX' },
  { label: 'Facilities', value: '2 Stations' },
  { label: 'Crews', value: '40+ In-House' },
  { label: 'Coverage', value: 'DFW + Statewide' },
];

export const AboutHero: React.FC = () => {
  const containerRef = useRef<HTMLElement | null>(null);
  const stat2500Ref = useRef<HTMLDivElement | null>(null);
  const stat982Ref = useRef<HTMLDivElement | null>(null);
  const [activeTelemetry, setActiveTelemetry] = useState<'intro' | '2500' | '982'>('intro');

  useEffect(() => {
    if (typeof window === 'undefined' || !containerRef.current) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      if (stat2500Ref.current) stat2500Ref.current.textContent = '2,500+';
      if (stat982Ref.current) stat982Ref.current.textContent = '98.2%';
      return;
    }

    const ctx = gsap.context(() => {
      // 1. Rolling number animation for 2,500+
      const statObj2500 = { val: 0 };
      gsap.to(statObj2500, {
        val: 2500,
        duration: 1.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: stat2500Ref.current,
          start: 'top 85%',
          once: true,
        },
        onUpdate: () => {
          if (stat2500Ref.current) {
            stat2500Ref.current.textContent = `${Math.floor(statObj2500.val).toLocaleString()}+`;
          }
        },
      });

      // 2. Rolling number animation for 98.2%
      const statObj982 = { val: 0 };
      gsap.to(statObj982, {
        val: 98.2,
        duration: 1.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: stat982Ref.current,
          start: 'top 85%',
          once: true,
        },
        onUpdate: () => {
          if (stat982Ref.current) {
            stat982Ref.current.textContent = `${statObj982.val.toFixed(1)}%`;
          }
        },
      });

      // 3. Focal card highlight transitions as the user scrolls
      const statCards = gsap.utils.toArray<HTMLElement>('[data-stat-card]');
      statCards.forEach((card) => {
        gsap.fromTo(
          card,
          { opacity: 0.4, y: 30, scale: 0.98 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 75%',
              end: 'bottom 20%',
              toggleActions: 'play reverse play reverse',
              onEnter: () => {
                const target = card.getAttribute('data-stat-card');
                if (target === '2500' || target === '982') {
                  setActiveTelemetry(target);
                }
              },
              onLeaveBack: () => {
                const target = card.getAttribute('data-stat-card');
                if (target === '2500') setActiveTelemetry('intro');
                if (target === '982') setActiveTelemetry('2500');
              },
            },
          }
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="glance"
      ref={containerRef}
      className="relative bg-black text-white selection:bg-red-600 selection:text-white border-b border-neutral-800 pt-28 sm:pt-32 pb-24 lg:pb-36"
    >
      {/* Technical Grid Backdrop */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage:
            'linear-gradient(to right, #27272a 1px, transparent 1px), linear-gradient(to bottom, #27272a 1px, transparent 1px)',
          backgroundSize: '64px 64px',
          maskImage: 'radial-gradient(ellipse 90% 70% at 50% 0%, black 40%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 90% 70% at 50% 0%, black 40%, transparent 100%)',
        }}
      />

      {/* Ambient Red Glow Anchor */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/4 left-1/12 w-[550px] h-[550px] bg-red-600/[0.04] rounded-full blur-[140px]"
      />

      <div className="w-[min(1280px,calc(100%-32px))] sm:w-[min(1280px,calc(100%-64px))] lg:w-[min(1360px,calc(100%-80px))] mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* ============================================================
              LEFT COLUMN: Pinned Visual Anchor
              Stays fixed in the viewport while the right column flows.
              ============================================================ */}
          <div className="lg:col-span-5 lg:sticky lg:top-28 lg:self-start space-y-6 lg:space-y-7 z-20">
            {/* [IMAGE] Anchor */}
            <div className="relative aspect-[16/10] sm:aspect-[16/9] lg:aspect-[4/3] w-full rounded-2xl overflow-hidden border border-neutral-800 bg-neutral-900 shadow-2xl group">
              <Image
                src="/images/hero_sunset_truck.jpg"
                alt="Firehouse Movers Texas Fleet"
                fill
                className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent pointer-events-none" />

              {/* Top HUD Tag */}
              <div className="absolute top-3.5 left-3.5 z-10 px-3 py-1.5 rounded-lg bg-black/80 backdrop-blur-md border border-neutral-700/60 font-mono text-[10px] text-neutral-300 uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span>
                  {activeTelemetry === 'intro' && 'STATION 01 // FLEET COMMAND'}
                  {activeTelemetry === '2500' && 'DISPATCH METRIC // 2,500+ SHIPMENTS'}
                  {activeTelemetry === '982' && 'SCHEDULE LOCK // 98.2% ON-TIME'}
                </span>
              </div>

              {/* Bottom HUD Tag */}
              <div className="absolute bottom-3.5 right-3.5 z-10 px-2.5 py-1 rounded-md bg-black/80 backdrop-blur-md border border-neutral-700/60 font-mono text-[10px] text-neutral-400 uppercase tracking-wider">
                <span>AIR-RIDE VERIFIED</span>
              </div>
            </div>

            {/* Headline Anchor */}
            <div className="space-y-3">
              <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-red-500 font-bold flex items-center gap-2">
                <span className="w-3 h-0.5 bg-red-500" />
                <span>OPERATIONAL CODE & CREED</span>
              </div>

              <h1 className="display-heading text-4xl sm:text-5xl lg:text-5xl xl:text-6xl text-white tracking-tight leading-[0.88] uppercase">
                <span className="block text-white">We Move</span>
                <span className="block text-white">Freight.</span>
                <span className="block text-white">We Own</span>
                <span className="block text-red-500">The Outcome.</span>
              </h1>

              <div className="pt-3 border-t border-neutral-800/80 flex items-center justify-between font-mono text-[10px] sm:text-[11px] text-neutral-500 uppercase tracking-wider">
                <span>EST. 2004 • NORTH TEXAS</span>
                <span className="text-neutral-400">ZERO BROKER HANDOFFS</span>
              </div>
            </div>
          </div>

          {/* ============================================================
              RIGHT COLUMN: Continuous Scrolling Journey
              Scrolls through intro, 2,500+ shipment stat, and 98.2% stat.
              ============================================================ */}
          <div className="lg:col-span-7 flex flex-col space-y-16 sm:space-y-20 lg:space-y-24">
            {/* 1. INTRODUCTORY SECTION (Moves upward out of view) */}
            <div className="space-y-6 pt-2">
              {/* File Header Bar */}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[10px] sm:text-[11px] font-mono uppercase tracking-widest text-neutral-500 pb-4 border-b border-neutral-800/80">
                <span className="text-red-500 font-bold">Company Profile</span>
                <span className="text-neutral-700">/</span>
                <span>Firehouse Movers Inc.</span>
                <span className="text-neutral-700">/</span>
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="w-3 h-3 text-red-500" />
                  North Texas
                </span>
                <span className="ml-auto inline-flex items-center gap-1.5 text-emerald-400/90 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Since 2004
                </span>
              </div>

              {/* Narrative Content */}
              <div className="space-y-5">
                <p className="text-lg sm:text-xl lg:text-2xl text-neutral-100 font-normal leading-relaxed">
                  We started in 2004 on off-duty days from a North Texas fire station — prepared,
                  accountable, on time. When lives and property are on the line, firefighters do not cut
                  corners. We brought that exact operational discipline to commercial freight,
                  residential relocation, and statewide transport.
                </p>
                <p className="text-sm sm:text-base text-neutral-400 leading-relaxed">
                  Every dispatch is executed by vetted in-house personnel with zero day labor, direct
                  chain-of-custody tracking, and dedicated air-ride fleet equipment. We do not just haul
                  cargo from dock to door — we engineer seamless relocations and take 100% accountability
                  for the arrival condition.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <Link
                  href="/landing#estimate-calculator"
                  className="group inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-sm transition-all duration-200 hover:-translate-y-0.5 cursor-pointer shadow-lg shadow-red-600/20 w-full sm:w-auto text-center"
                >
                  <span>Get a written estimate</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
                <a
                  href="tel:9725399588"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-lg border border-neutral-800 hover:border-neutral-700 bg-neutral-900/60 text-neutral-300 hover:text-white font-semibold text-sm transition-all duration-200 hover:-translate-y-0.5 cursor-pointer w-full sm:w-auto text-center"
                >
                  <Phone className="w-4 h-4 text-red-500" />
                  <span>(972) 539-9588</span>
                </a>
              </div>

              {/* Fact Strip */}
              <div className="pt-6">
                <dl className="divide-y divide-neutral-800/80 border-y border-neutral-800/80">
                  {headerFacts.map((fact) => (
                    <div
                      key={fact.label}
                      className="relative flex items-baseline justify-between gap-6 py-3 px-1 group overflow-hidden"
                    >
                      <span
                        aria-hidden="true"
                        className="absolute inset-0 bg-neutral-900/40 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out"
                      />
                      <dt className="relative text-[11px] font-mono uppercase tracking-widest text-neutral-500 group-hover:text-red-400 transition-colors duration-200">
                        {fact.label}
                      </dt>
                      <dd className="relative text-sm sm:text-base font-bold text-white text-right font-sans">
                        {fact.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>

            {/* ---------------- DIVIDER ---------------- */}
            <div className="relative py-4">
              <div className="border-t border-neutral-800/80 w-full" />
              <div className="absolute left-0 -top-1 px-3 bg-black font-mono text-[10px] uppercase tracking-widest text-neutral-500 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                <span>OPERATIONAL SCALE // ANNUAL RECORD</span>
              </div>
            </div>

            {/* 2. STATISTIC 1: 2,500+ (Becomes Visual Focus) */}
            <div
              data-stat-card="2500"
              className="rounded-2xl border border-neutral-800 bg-[#0c0c0c] p-6 sm:p-8 lg:p-10 shadow-2xl relative overflow-hidden transition-all duration-300 group hover:border-neutral-700"
            >
              {/* Subtle Red Top Highlight Bar */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 via-red-500 to-transparent" />

              <div className="flex items-center justify-between pb-4 border-b border-neutral-800/80">
                <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-neutral-400">
                  <Package className="w-4 h-4 text-red-500" />
                  <span>ANNUAL TRAILING VOLUME</span>
                </div>
                <div className="px-2.5 py-1 rounded bg-neutral-900 border border-neutral-800 font-mono text-[10px] text-neutral-400 uppercase tracking-wider">
                  ACTIVE LOG
                </div>
              </div>

              {/* Massive Focal Stat Number */}
              <div
                ref={stat2500Ref}
                className="display-heading text-6xl sm:text-7xl lg:text-8xl xl:text-9xl text-white tracking-tight leading-none my-5 select-none"
              >
                2,500+
              </div>

              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight mb-3 font-heading">
                Shipments & Commercial Relocations Completed
              </h3>

              <p className="text-sm sm:text-base text-neutral-400 leading-relaxed mb-6">
                Over 2,500 enterprise consignments, corporate headquarters transitions, and high-value
                residential moves dispatched annually across North Texas and statewide routes. Handled
                with zero cargo abandonment, unbroken chain of custody, and verified bill of lading.
              </p>

              {/* Technical Spec Tags */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-neutral-800/80">
                <div className="p-3 rounded-xl bg-neutral-950/80 border border-neutral-800/70">
                  <div className="font-mono text-[10px] uppercase text-neutral-500">Loss Rate</div>
                  <div className="text-xs sm:text-sm font-bold text-white mt-0.5">0% Abandonment</div>
                </div>
                <div className="p-3 rounded-xl bg-neutral-950/80 border border-neutral-800/70">
                  <div className="font-mono text-[10px] uppercase text-neutral-500">Securing</div>
                  <div className="text-xs sm:text-sm font-bold text-white mt-0.5">Air-Ride E-Track</div>
                </div>
                <div className="p-3 rounded-xl bg-neutral-950/80 border border-neutral-800/70">
                  <div className="font-mono text-[10px] uppercase text-neutral-500">Chain of Custody</div>
                  <div className="text-xs sm:text-sm font-bold text-white mt-0.5">Single-Crew Direct</div>
                </div>
              </div>
            </div>

            {/* ---------------- DIVIDER ---------------- */}
            <div className="relative py-4">
              <div className="border-t border-neutral-800/80 w-full" />
              <div className="absolute left-0 -top-1 px-3 bg-black font-mono text-[10px] uppercase tracking-widest text-neutral-500 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                <span>SCHEDULE DISCIPLINE // PRECISION</span>
              </div>
            </div>

            {/* 3. STATISTIC 2: 98.2% (Enters Underneath) */}
            <div
              data-stat-card="982"
              className="rounded-2xl border border-neutral-800 bg-[#0c0c0c] p-6 sm:p-8 lg:p-10 shadow-2xl relative overflow-hidden transition-all duration-300 group hover:border-neutral-700"
            >
              {/* Subtle Red Top Highlight Bar */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 via-red-500 to-transparent" />

              <div className="flex items-center justify-between pb-4 border-b border-neutral-800/80">
                <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-neutral-400">
                  <Clock className="w-4 h-4 text-red-500" />
                  <span>ON-TIME WINDOW PRECISION</span>
                </div>
                <div className="px-2.5 py-1 rounded bg-neutral-900 border border-neutral-800 font-mono text-[10px] text-neutral-400 uppercase tracking-wider">
                  VERIFIED AUDIT
                </div>
              </div>

              {/* Massive Focal Stat Number */}
              <div
                ref={stat982Ref}
                className="display-heading text-6xl sm:text-7xl lg:text-8xl xl:text-9xl text-red-500 tracking-tight leading-none my-5 select-none"
              >
                98.2%
              </div>

              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight mb-3 font-heading">
                On-Time Arrival & Direct Route Compliance
              </h3>

              <p className="text-sm sm:text-base text-neutral-400 leading-relaxed mb-6">
                Direct-route dispatch ensures arrival inside the agreed operational window across Dallas,
                Fort Worth, and Texas corridors. Monitored through live GPS telematics by station
                dispatch. No broker delays, no cargo swaps, and no day-labor excuses.
              </p>

              {/* Technical Spec Tags */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-neutral-800/80">
                <div className="p-3 rounded-xl bg-neutral-950/80 border border-neutral-800/70">
                  <div className="font-mono text-[10px] uppercase text-neutral-500">Telematics</div>
                  <div className="text-xs sm:text-sm font-bold text-white mt-0.5">Live GPS Monitored</div>
                </div>
                <div className="p-3 rounded-xl bg-neutral-950/80 border border-neutral-800/70">
                  <div className="font-mono text-[10px] uppercase text-neutral-500">Dispatch Window</div>
                  <div className="text-xs sm:text-sm font-bold text-white mt-0.5">Station Logged</div>
                </div>
                <div className="p-3 rounded-xl bg-neutral-950/80 border border-neutral-800/70">
                  <div className="font-mono text-[10px] uppercase text-neutral-500">Crew Model</div>
                  <div className="text-xs sm:text-sm font-bold text-white mt-0.5">100% In-House Staff</div>
                </div>
              </div>
            </div>

            {/* Grounding Seal / Section Transition Anchor */}
            <div className="p-6 rounded-2xl border border-neutral-800/60 bg-neutral-950/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-600/10 border border-red-500/20 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <div className="text-xs font-mono uppercase tracking-wider text-neutral-300 font-bold">
                    PREPARED. ACCOUNTABLE. ON TIME.
                  </div>
                  <div className="text-xs text-neutral-500 mt-0.5">
                    Firehouse Movers Texas Fleet & Logistics • Lewisville Station 1 & 2
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>STATEWIDE LICENSED & BONDED</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutHero;

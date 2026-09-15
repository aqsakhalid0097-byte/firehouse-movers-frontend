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
  ArrowDown,
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
  const pinSectionRef = useRef<HTMLDivElement | null>(null);
  const rightViewportRef = useRef<HTMLDivElement | null>(null);
  const rightTrackRef = useRef<HTMLDivElement | null>(null);
  const stat2500Ref = useRef<HTMLDivElement | null>(null);
  const stat982Ref = useRef<HTMLDivElement | null>(null);
  const stat100Ref = useRef<HTMLDivElement | null>(null);
  const [activeTelemetry, setActiveTelemetry] = useState<'intro' | '2500' | '982' | '100'>('intro');

  useEffect(() => {
    if (typeof window === 'undefined' || !containerRef.current) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      if (stat2500Ref.current) stat2500Ref.current.textContent = '2,500+';
      if (stat982Ref.current) stat982Ref.current.textContent = '98.2%';
      if (stat100Ref.current) stat100Ref.current.textContent = '100%';
      return;
    }

    const mm = gsap.matchMedia();

    // DESKTOP: Pin the entire section viewport; left side stays 100% fixed, right side scrolls
    mm.add('(min-width: 1024px)', () => {
      const container = containerRef.current;
      const pinElem = pinSectionRef.current;
      const trackElem = rightTrackRef.current;
      const viewportElem = rightViewportRef.current;

      if (!container || !pinElem || !trackElem || !viewportElem) return;

      const getTravelDistance = () => {
        return Math.max(0, trackElem.scrollHeight - viewportElem.clientHeight);
      };

      let hasAnimated2500 = false;
      let hasAnimated982 = false;

      const animateNumber = (
        target: HTMLDivElement | null,
        endVal: number,
        isPercentage = false
      ) => {
        if (!target) return;
        const obj = { val: 0 };
        gsap.to(obj, {
          val: endVal,
          duration: 1.6,
          ease: 'power2.out',
          onUpdate: () => {
            target.textContent = isPercentage
              ? `${obj.val.toFixed(1)}%`
              : `${Math.floor(obj.val).toLocaleString()}+`;
          },
        });
      };

      // Set initial count-up
      if (stat2500Ref.current) stat2500Ref.current.textContent = '2,500+';
      if (stat982Ref.current) stat982Ref.current.textContent = '98.2%';
      if (stat100Ref.current) stat100Ref.current.textContent = '100%';

      let hasAnimated100 = false;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: 'top top+=72',
          end: () => `+=${getTravelDistance() + 450}`,
          pin: pinElem,
          pinSpacing: true,
          scrub: 0.8,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const p = self.progress;

            if (p < 0.28) {
              setActiveTelemetry('intro');
            } else if (p < 0.58) {
              setActiveTelemetry('2500');
              if (!hasAnimated2500) {
                hasAnimated2500 = true;
                animateNumber(stat2500Ref.current, 2500, false);
              }
            } else if (p < 0.85) {
              setActiveTelemetry('982');
              if (!hasAnimated982) {
                hasAnimated982 = true;
                animateNumber(stat982Ref.current, 98.2, true);
              }
            } else {
              setActiveTelemetry('100');
              if (!hasAnimated100) {
                hasAnimated100 = true;
                animateNumber(stat100Ref.current, 100, true);
              }
            }
          },
        },
      });

      // Smooth translation of the right track upward
      tl.to(trackElem, {
        y: () => -getTravelDistance(),
        ease: 'none',
      });
    });

    // MOBILE / TABLET: Natural vertical page flow
    mm.add('(max-width: 1023px)', () => {
      if (rightTrackRef.current) {
        gsap.set(rightTrackRef.current, { clearProps: 'all' });
      }
      if (stat2500Ref.current) stat2500Ref.current.textContent = '2,500+';
      if (stat982Ref.current) stat982Ref.current.textContent = '98.2%';
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      id="glance"
      ref={containerRef}
      className="relative bg-black text-white selection:bg-red-600 selection:text-white border-b border-neutral-800"
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

      {/* Pinned Viewport Shell (Height constrained to viewport on desktop so left column is 100% locked) */}
      <div
        ref={pinSectionRef}
        className="relative lg:h-[calc(100vh-72px)] w-full flex flex-col justify-center px-4 sm:px-8 lg:px-12 py-8 lg:py-0 z-10"
      >
        <div className="w-[min(1280px,calc(100%-32px))] sm:w-[min(1280px,calc(100%-64px))] lg:w-[min(1360px,calc(100%-80px))] mx-auto h-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center h-full">
            {/* ============================================================
                LEFT COLUMN: 100% Stationary Visual Anchor
                Firmly locked inside the pinned viewport. Never moves on scroll.
                ============================================================ */}
            <div className="lg:col-span-5 h-full flex flex-col justify-center py-6 sm:py-8 lg:py-6 space-y-5 lg:space-y-6 z-20">
              {/* [IMAGE] Anchor Frame */}
              <div className="relative aspect-[16/10] w-full max-h-[260px] sm:max-h-[300px] rounded-2xl overflow-hidden border border-neutral-800 bg-neutral-900 shadow-2xl group shrink-0">
                <Image
                  src="/images/hero_sunset_truck.jpg"
                  alt="Firehouse Movers Texas Fleet"
                  fill
                  className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent pointer-events-none" />

                {/* Top HUD Tag (Dynamically tracks active milestone) */}
                <div className="absolute top-3 left-3 z-10 px-3 py-1.5 rounded-lg bg-black/80 backdrop-blur-md border border-neutral-700/60 font-mono text-[10px] text-neutral-300 uppercase tracking-wider flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <span>
                    {activeTelemetry === 'intro' && 'STATION 01 // FLEET COMMAND'}
                    {activeTelemetry === '2500' && 'DISPATCH METRIC // 2,500+ SHIPMENTS'}
                    {activeTelemetry === '982' && 'SCHEDULE LOCK // 98.2% ON-TIME'}
                    {activeTelemetry === '100' && 'CREW INTEGRITY // 100% IN-HOUSE'}
                  </span>
                </div>

                {/* Bottom HUD Tag */}
                <div className="absolute bottom-3 right-3 z-10 px-2.5 py-1 rounded-md bg-black/80 backdrop-blur-md border border-neutral-700/60 font-mono text-[10px] text-neutral-400 uppercase tracking-wider">
                  <span>AIR-RIDE VERIFIED</span>
                </div>
              </div>

              {/* Headline Anchor */}
              <div className="space-y-2.5 shrink-0">
                <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-red-500 font-bold flex items-center gap-2">
                  <span className="w-3 h-0.5 bg-red-500" />
                  <span>OPERATIONAL CODE & CREED</span>
                </div>

                <h1 className="display-heading text-3xl sm:text-4xl lg:text-5xl xl:text-[54px] text-white tracking-tight leading-[0.88] uppercase">
                  <span className="block text-white">We Move</span>
                  <span className="block text-white">Freight.</span>
                  <span className="block text-white">We Own</span>
                  <span className="block text-red-500">The Outcome.</span>
                </h1>

                <div className="pt-2.5 border-t border-neutral-800/80 flex items-center justify-between font-mono text-[10px] sm:text-[11px] text-neutral-500 uppercase tracking-wider">
                  <span>EST. 2004 • NORTH TEXAS</span>
                  <span className="text-neutral-400">ZERO BROKER HANDOFFS</span>
                </div>
              </div>
            </div>

            {/* ============================================================
                RIGHT COLUMN: Moving Sequence Window
                On desktop, this viewport stays fixed while the inner track
                scrolls upward through Intro -> 2,500+ -> 98.2%.
                ============================================================ */}
            <div
              ref={rightViewportRef}
              className="lg:col-span-7 lg:h-full lg:overflow-hidden relative flex flex-col justify-center"
            >
              {/* Subtle Edge Vignettes to smooth in/out content transitions */}
              <div className="hidden lg:block pointer-events-none absolute top-0 inset-x-0 h-10 bg-gradient-to-b from-black via-black/80 to-transparent z-20" />
              <div className="hidden lg:block pointer-events-none absolute bottom-0 inset-x-0 h-10 bg-gradient-to-t from-black via-black/80 to-transparent z-20" />

              {/* Scrolling Inner Track */}
              <div
                ref={rightTrackRef}
                className="flex flex-col space-y-12 sm:space-y-16 lg:space-y-20 py-4 lg:py-10"
              >
                {/* ---------------- 1. INTRODUCTORY SECTION ---------------- */}
                <div className="space-y-5">
                  {/* File Header Bar */}
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[10px] sm:text-[11px] font-mono uppercase tracking-widest text-neutral-500 pb-3.5 border-b border-neutral-800/80">
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
                  <div className="space-y-4">
                    <p className="text-base sm:text-lg lg:text-xl text-neutral-100 font-normal leading-relaxed">
                      We started in 2004 on off-duty days from a North Texas fire station — prepared,
                      accountable, on time. When lives and property are on the line, firefighters do not cut
                      corners. We brought that exact operational discipline to commercial freight,
                      residential relocation, and statewide transport.
                    </p>
                    <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
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
                      className="group inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs sm:text-sm transition-all duration-200 hover:-translate-y-0.5 cursor-pointer shadow-lg shadow-red-600/20 w-full sm:w-auto text-center"
                    >
                      <span>Get a written estimate</span>
                      <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                    </Link>
                    <a
                      href="tel:9725399588"
                      className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-neutral-800 hover:border-neutral-700 bg-neutral-900/60 text-neutral-300 hover:text-white font-semibold text-xs sm:text-sm transition-all duration-200 hover:-translate-y-0.5 cursor-pointer w-full sm:w-auto text-center"
                    >
                      <Phone className="w-4 h-4 text-red-500" />
                      <span>(972) 539-9588</span>
                    </a>
                  </div>

                  {/* Fact Strip */}
                  <div className="pt-3">
                    <dl className="divide-y divide-neutral-800/80 border-y border-neutral-800/80">
                      {headerFacts.map((fact) => (
                        <div
                          key={fact.label}
                          className="relative flex items-baseline justify-between gap-6 py-2.5 px-1 group overflow-hidden"
                        >
                          <span
                            aria-hidden="true"
                            className="absolute inset-0 bg-neutral-900/40 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out"
                          />
                          <dt className="relative text-[11px] font-mono uppercase tracking-widest text-neutral-500 group-hover:text-red-400 transition-colors duration-200">
                            {fact.label}
                          </dt>
                          <dd className="relative text-xs sm:text-sm font-bold text-white text-right font-sans">
                            {fact.value}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </div>

                {/* ---------------- STATISTICS SECTION (Reference Style) ---------------- */}
                <div className="pt-6 sm:pt-10">
                  {/* Eyebrow Header */}
                  <p className="text-sm sm:text-base text-neutral-300 font-normal mb-3 sm:mb-4 normal-case">
                    From countless journeys, clarity emerges
                  </p>

                  {/* Hairline Divider */}
                  <div className="border-t border-neutral-800/80 w-full" />

                  {/* STAT 1: 2,500+ */}
                  <div className="py-8 sm:py-10 lg:py-12">
                    <div
                      ref={stat2500Ref}
                      className="display-heading text-7xl sm:text-8xl lg:text-9xl xl:text-[116px] text-white tracking-tight leading-none select-none font-black"
                    >
                      2,500+
                    </div>
                    <p className="mt-3 text-base sm:text-lg lg:text-xl text-neutral-400 font-normal normal-case">
                      Shipments per month
                    </p>
                  </div>

                  {/* Hairline Divider */}
                  <div className="border-t border-neutral-800/80 w-full" />

                  {/* STAT 2: 98.2% */}
                  <div className="py-8 sm:py-10 lg:py-12">
                    <div
                      ref={stat982Ref}
                      className="display-heading text-7xl sm:text-8xl lg:text-9xl xl:text-[116px] text-white tracking-tight leading-none select-none font-black"
                    >
                      98.2%
                    </div>
                    <p className="mt-3 text-base sm:text-lg lg:text-xl text-neutral-400 font-normal normal-case">
                      On-time delivery rate
                    </p>
                  </div>

                  {/* Hairline Divider */}
                  <div className="border-t border-neutral-800/80 w-full" />

                  {/* STAT 3: 100% */}
                  <div className="py-8 sm:py-10 lg:py-12">
                    <div
                      ref={stat100Ref}
                      className="display-heading text-7xl sm:text-8xl lg:text-9xl xl:text-[116px] text-white tracking-tight leading-none select-none font-black"
                    >
                      100%
                    </div>
                    <p className="mt-3 text-base sm:text-lg lg:text-xl text-neutral-400 font-normal normal-case">
                      In-house crew accountability
                    </p>
                  </div>

                  {/* Hairline Divider */}
                  <div className="border-t border-neutral-800/80 w-full mb-10" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutHero;


'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export const AboutHero: React.FC = () => {
  const containerRef = useRef<HTMLElement | null>(null);
  const pinSectionRef = useRef<HTMLDivElement | null>(null);
  const rightViewportRef = useRef<HTMLDivElement | null>(null);
  const rightTrackRef = useRef<HTMLDivElement | null>(null);

  const stat2500Ref = useRef<HTMLDivElement | null>(null);
  const stat982Ref = useRef<HTMLDivElement | null>(null);
  const stat100Ref = useRef<HTMLDivElement | null>(null);

  const stat1RowRef = useRef<HTMLDivElement | null>(null);
  const stat2RowRef = useRef<HTMLDivElement | null>(null);
  const stat3RowRef = useRef<HTMLDivElement | null>(null);

  const bar1Ref = useRef<HTMLDivElement | null>(null);
  const bar2Ref = useRef<HTMLDivElement | null>(null);
  const bar3Ref = useRef<HTMLDivElement | null>(null);

  const status1Ref = useRef<HTMLSpanElement | null>(null);
  const status2Ref = useRef<HTMLSpanElement | null>(null);
  const status3Ref = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !containerRef.current) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      if (stat2500Ref.current) stat2500Ref.current.textContent = '2,500+';
      if (stat982Ref.current) stat982Ref.current.textContent = '98.2%';
      if (stat100Ref.current) stat100Ref.current.textContent = '100%';
      if (bar1Ref.current) bar1Ref.current.style.width = '100%';
      if (bar2Ref.current) bar2Ref.current.style.width = '98.2%';
      if (bar3Ref.current) bar3Ref.current.style.width = '100%';
      if (status1Ref.current) status1Ref.current.textContent = 'TELEMETRY VERIFIED';
      if (status2Ref.current) status2Ref.current.textContent = 'SLA COMPLIANT';
      if (status3Ref.current) status3Ref.current.textContent = 'ZERO DAY LABOR';
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
      let hasAnimated100 = false;

      const triggerStat1 = () => {
        if (hasAnimated2500) return;
        hasAnimated2500 = true;
        const obj = { val: 0 };
        gsap.to(obj, {
          val: 2500,
          duration: 1.6,
          ease: 'power2.out',
          onUpdate: () => {
            if (stat2500Ref.current) {
              stat2500Ref.current.textContent = `${Math.floor(obj.val).toLocaleString()}+`;
            }
          },
        });
        if (bar1Ref.current) bar1Ref.current.style.width = '100%';
        if (status1Ref.current) status1Ref.current.textContent = 'TELEMETRY VERIFIED';
      };

      const triggerStat2 = () => {
        if (hasAnimated982) return;
        hasAnimated982 = true;
        const obj = { val: 0 };
        gsap.to(obj, {
          val: 98.2,
          duration: 1.6,
          ease: 'power2.out',
          onUpdate: () => {
            if (stat982Ref.current) {
              stat982Ref.current.textContent = `${obj.val.toFixed(1)}%`;
            }
          },
        });
        if (bar2Ref.current) bar2Ref.current.style.width = '98.2%';
        if (status2Ref.current) status2Ref.current.textContent = 'SLA COMPLIANT';
      };

      const triggerStat3 = () => {
        if (hasAnimated100) return;
        hasAnimated100 = true;
        const obj = { val: 0 };
        gsap.to(obj, {
          val: 100,
          duration: 1.6,
          ease: 'power2.out',
          onUpdate: () => {
            if (stat100Ref.current) {
              stat100Ref.current.textContent = `${Math.floor(obj.val)}%`;
            }
          },
        });
        if (bar3Ref.current) bar3Ref.current.style.width = '100%';
        if (status3Ref.current) status3Ref.current.textContent = 'ZERO DAY LABOR';
      };

      const resetStats = () => {
        hasAnimated2500 = false;
        hasAnimated982 = false;
        hasAnimated100 = false;
        if (stat2500Ref.current) stat2500Ref.current.textContent = '0+';
        if (stat982Ref.current) stat982Ref.current.textContent = '0.0%';
        if (stat100Ref.current) stat100Ref.current.textContent = '0%';
        if (bar1Ref.current) bar1Ref.current.style.width = '0%';
        if (bar2Ref.current) bar2Ref.current.style.width = '0%';
        if (bar3Ref.current) bar3Ref.current.style.width = '0%';
        if (status1Ref.current) status1Ref.current.textContent = 'CALIBRATING FEED...';
        if (status2Ref.current) status2Ref.current.textContent = 'CALIBRATING FEED...';
        if (status3Ref.current) status3Ref.current.textContent = 'CALIBRATING FEED...';
      };

      resetStats();

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: 'top top+=72',
          end: () => `+=${getTravelDistance() + 500}`,
          pin: pinElem,
          pinSpacing: true,
          scrub: 0.8,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const p = self.progress;

            if (p > 0.12) triggerStat1();
            if (p > 0.38) triggerStat2();
            if (p > 0.62) triggerStat3();

            // Reset if user scrolls back to the top
            if (p < 0.05 && (hasAnimated2500 || hasAnimated982 || hasAnimated100)) {
              resetStats();
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
      if (stat100Ref.current) stat100Ref.current.textContent = '100%';
      if (bar1Ref.current) bar1Ref.current.style.width = '100%';
      if (bar2Ref.current) bar2Ref.current.style.width = '98.2%';
      if (bar3Ref.current) bar3Ref.current.style.width = '100%';
      if (status1Ref.current) status1Ref.current.textContent = 'TELEMETRY VERIFIED';
      if (status2Ref.current) status2Ref.current.textContent = 'SLA COMPLIANT';
      if (status3Ref.current) status3Ref.current.textContent = 'ZERO DAY LABOR';
    });

    // Refresh ScrollTrigger when web fonts finish loading
    if (typeof document !== 'undefined' && 'fonts' in document) {
      document.fonts.ready.then(() => {
        ScrollTrigger.refresh();
      });
    }

    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 400);

    return () => {
      clearTimeout(timer);
      mm.revert();
    };
  }, []);

  const handleLearnMore = () => {
    window.scrollBy({ top: 600, behavior: 'smooth' });
  };

  return (
    <section
      id="glance"
      ref={containerRef}
      className="relative bg-black text-white selection:bg-red-600 selection:text-white border-b border-neutral-800"
    >
      {/* Pinned Viewport Shell (Height constrained to viewport on desktop so left column is 100% locked) */}
      <div
        ref={pinSectionRef}
        className="relative lg:h-[calc(100vh-72px)] w-full flex flex-col justify-center px-6 sm:px-10 lg:px-16 py-10 lg:py-0 z-10"
      >
        <div className="w-[min(1280px,calc(100%-32px))] sm:w-[min(1280px,calc(100%-64px))] lg:w-[min(1360px,calc(100%-80px))] mx-auto h-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 h-full items-center lg:py-4">
            {/* ============================================================
                LEFT COLUMN: 100% Stationary Visual Anchor
                Firmly locked inside the pinned viewport. Never moves on scroll.
                ============================================================ */}
            <div className="lg:col-span-5 h-full flex flex-col justify-center z-20 py-4">
              {/* [IMAGE] Anchor Frame (Clean photography matching reference) */}
              <div className="relative aspect-[16/10] w-full max-w-[420px] max-h-[250px] rounded-xl overflow-hidden border border-neutral-800/80 bg-neutral-900 shadow-2xl group shrink-0 mb-8 lg:mb-10">
                <Image
                  src="/images/hero_sunset_truck.jpg"
                  alt="Firehouse Movers Texas Fleet"
                  fill
                  className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                  priority
                />
              </div>

              {/* Headline Anchor (Two-tone contrast exactly matching reference) */}
              <h1 className="display-heading text-4xl sm:text-5xl lg:text-[54px] xl:text-[64px] tracking-tight leading-[0.88] uppercase select-none font-bold">
                <span className="block text-neutral-400">We Move</span>
                <span className="block text-neutral-400">Freight.</span>
                <span className="block text-white">We Own</span>
                <span className="block text-white">The Outcome.</span>
              </h1>
            </div>

            {/* ============================================================
                RIGHT COLUMN: Moving Sequence Window
                On desktop, this viewport stays fixed while the inner track
                scrolls upward through Intro Paragraphs -> 2,500+ -> 98.2%.
                ============================================================ */}
            <div
              ref={rightViewportRef}
              className="lg:col-span-7 h-full lg:overflow-hidden relative flex flex-col justify-start"
            >
              {/* Scrolling Inner Track */}
              <div
                ref={rightTrackRef}
                className="flex flex-col w-full"
              >
                {/* ---------------- 1. INTRODUCTORY SECTION (Fold 1) ---------------- */}
                <div className="min-h-0 lg:min-h-[calc(100vh-120px)] flex flex-col justify-between shrink-0">
                  {/* Centered Editorial Block */}
                  <div className="flex-1 flex flex-col justify-center max-w-[700px] py-6 sm:py-8 lg:py-6">
                    <p className="text-2xl sm:text-3xl lg:text-[32px] xl:text-[38px] text-neutral-100 font-medium leading-[1.28] tracking-tight">
                      With every service under one roof and one accountable team, your supply chain moves the way your business demands: predictably, transparently, and without excuses.
                    </p>

                    <p className="mt-6 text-base sm:text-lg lg:text-[20px] xl:text-[22px] text-neutral-400 font-normal leading-[1.42] tracking-tight">
                      That means no finger-pointing between vendors. No delays lost in handoffs. Just one team, accountable from origin to destination.
                    </p>

                    <div className="pt-8">
                      <button
                        type="button"
                        onClick={handleLearnMore}
                        className="inline-flex items-center justify-center px-8 py-3.5 rounded-full border border-neutral-700 hover:border-white text-[11px] font-mono uppercase tracking-[0.2em] text-neutral-300 hover:text-white transition-all duration-200 cursor-pointer"
                      >
                        LEARN MORE ABOUT US
                      </button>
                    </div>
                  </div>

                  {/* Bottom: Peeking Eyebrow & Hairline Divider */}
                  <div className="pb-4">
                    <p className="text-sm sm:text-base text-neutral-400 font-normal mb-3 normal-case">
                      From countless journeys, clarity emerges
                    </p>
                    <div className="border-t border-neutral-800/80 w-full" />
                  </div>
                </div>

                {/* ---------------- 2. STATISTICS SECTION (Reference Style) ---------------- */}
                <div className="pt-2">
                  {/* STAT 1: 2,500+ */}
                  <div ref={stat1RowRef} className="py-14 sm:py-16 lg:py-20 transition-opacity duration-300">
                    <div className="flex items-center gap-4 flex-wrap">
                      <div
                        ref={stat2500Ref}
                        className="display-heading text-8xl sm:text-9xl lg:text-[130px] xl:text-[150px] 2xl:text-[170px] text-white tracking-tighter leading-none select-none font-black"
                      >
                        0+
                      </div>
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-neutral-800 bg-neutral-900/80">
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.9)]" />
                        <span ref={status1Ref} className="text-[10px] font-mono tracking-widest uppercase text-neutral-400">
                          CALIBRATING FEED...
                        </span>
                      </div>
                    </div>
                    <p className="mt-4 sm:mt-5 text-lg sm:text-xl lg:text-2xl text-neutral-400 font-normal normal-case tracking-tight">
                      Shipments per month
                    </p>
                    {/* Animated Loading Shimmer Bar */}
                    <div className="mt-5 flex items-center gap-3">
                      <div className="h-1.5 w-32 bg-neutral-900 rounded-full overflow-hidden border border-neutral-800">
                        <div
                          ref={bar1Ref}
                          className="h-full bg-gradient-to-r from-red-600 via-red-500 to-amber-400 rounded-full transition-all duration-700 ease-out"
                          style={{ width: '0%' }}
                        />
                      </div>
                      <span className="text-[10px] font-mono tracking-wider text-neutral-500 uppercase">
                        LIVE TELEMETRY
                      </span>
                    </div>
                  </div>

                  {/* Hairline Divider */}
                  <div className="border-t border-neutral-800/80 w-full" />

                  {/* STAT 2: 98.2% */}
                  <div ref={stat2RowRef} className="py-14 sm:py-16 lg:py-20 transition-opacity duration-300">
                    <div className="flex items-center gap-4 flex-wrap">
                      <div
                        ref={stat982Ref}
                        className="display-heading text-8xl sm:text-9xl lg:text-[130px] xl:text-[150px] 2xl:text-[170px] text-white tracking-tighter leading-none select-none font-black"
                      >
                        0.0%
                      </div>
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-neutral-800 bg-neutral-900/80">
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.9)]" />
                        <span ref={status2Ref} className="text-[10px] font-mono tracking-widest uppercase text-neutral-400">
                          CALIBRATING FEED...
                        </span>
                      </div>
                    </div>
                    <p className="mt-4 sm:mt-5 text-lg sm:text-xl lg:text-2xl text-neutral-400 font-normal normal-case tracking-tight">
                      On-time delivery rate
                    </p>
                    {/* Animated Loading Shimmer Bar */}
                    <div className="mt-5 flex items-center gap-3">
                      <div className="h-1.5 w-32 bg-neutral-900 rounded-full overflow-hidden border border-neutral-800">
                        <div
                          ref={bar2Ref}
                          className="h-full bg-gradient-to-r from-red-600 via-red-500 to-amber-400 rounded-full transition-all duration-700 ease-out"
                          style={{ width: '0%' }}
                        />
                      </div>
                      <span className="text-[10px] font-mono tracking-wider text-neutral-500 uppercase">
                        PRECISION METRIC
                      </span>
                    </div>
                  </div>

                  {/* Hairline Divider */}
                  <div className="border-t border-neutral-800/80 w-full" />

                  {/* STAT 3: 100% */}
                  <div ref={stat3RowRef} className="py-14 sm:py-16 lg:py-20 transition-opacity duration-300">
                    <div className="flex items-center gap-4 flex-wrap">
                      <div
                        ref={stat100Ref}
                        className="display-heading text-8xl sm:text-9xl lg:text-[130px] xl:text-[150px] 2xl:text-[170px] text-white tracking-tighter leading-none select-none font-black"
                      >
                        0%
                      </div>
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-neutral-800 bg-neutral-900/80">
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.9)]" />
                        <span ref={status3Ref} className="text-[10px] font-mono tracking-widest uppercase text-neutral-400">
                          CALIBRATING FEED...
                        </span>
                      </div>
                    </div>
                    <p className="mt-4 sm:mt-5 text-lg sm:text-xl lg:text-2xl text-neutral-400 font-normal normal-case tracking-tight">
                      In-house crew accountability
                    </p>
                    {/* Animated Loading Shimmer Bar */}
                    <div className="mt-5 flex items-center gap-3">
                      <div className="h-1.5 w-32 bg-neutral-900 rounded-full overflow-hidden border border-neutral-800">
                        <div
                          ref={bar3Ref}
                          className="h-full bg-gradient-to-r from-red-600 via-red-500 to-amber-400 rounded-full transition-all duration-700 ease-out"
                          style={{ width: '0%' }}
                        />
                      </div>
                      <span className="text-[10px] font-mono tracking-wider text-neutral-500 uppercase">
                        ZERO DAY LABOR
                      </span>
                    </div>
                  </div>

                  {/* Hairline Divider */}
                  <div className="border-t border-neutral-800/80 w-full mb-8" />

                  {/* Dedicated Bottom Buffer so 100% is Fully Centered & Remains in View */}
                  <div className="h-[40vh] lg:h-[55vh] flex flex-col justify-center">
                    <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-neutral-800/80 bg-neutral-950/80 max-w-fit">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-neutral-400">
                        CONTINUE SCROLLING TO EXPLORE TRACK & FLEET
                      </span>
                    </div>
                  </div>
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


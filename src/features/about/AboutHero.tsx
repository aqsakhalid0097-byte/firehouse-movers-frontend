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
      let hasAnimated100 = false;

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

      // Set initial values
      if (stat2500Ref.current) stat2500Ref.current.textContent = '2,500+';
      if (stat982Ref.current) stat982Ref.current.textContent = '98.2%';
      if (stat100Ref.current) stat100Ref.current.textContent = '100%';

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

            if (p > 0.22 && !hasAnimated2500) {
              hasAnimated2500 = true;
              animateNumber(stat2500Ref.current, 2500, false);
            }
            if (p > 0.52 && !hasAnimated982) {
              hasAnimated982 = true;
              animateNumber(stat982Ref.current, 98.2, true);
            }
            if (p > 0.8 && !hasAnimated100) {
              hasAnimated100 = true;
              animateNumber(stat100Ref.current, 100, true);
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
    });

    return () => mm.revert();
  }, []);

  const handleLearnMore = () => {
    window.scrollBy({ top: 500, behavior: 'smooth' });
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
        className="relative lg:h-[calc(100vh-72px)] w-full flex flex-col justify-start px-6 sm:px-10 lg:px-16 py-10 lg:py-0 z-10"
      >
        <div className="w-[min(1280px,calc(100%-32px))] sm:w-[min(1280px,calc(100%-64px))] lg:w-[min(1360px,calc(100%-80px))] mx-auto h-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 h-full lg:pt-10 xl:pt-12 lg:pb-6">
            {/* ============================================================
                LEFT COLUMN: 100% Stationary Visual Anchor
                Firmly locked inside the pinned viewport. Never moves on scroll.
                ============================================================ */}
            <div className="lg:col-span-5 h-full flex flex-col justify-start z-20">
              {/* [IMAGE] Anchor Frame (Clean photography matching reference) */}
              <div className="relative aspect-[16/10] w-full max-w-[380px] max-h-[230px] rounded-xl overflow-hidden border border-neutral-800/80 bg-neutral-900 shadow-2xl group shrink-0 mb-8 lg:mb-10">
                <Image
                  src="/images/hero_sunset_truck.jpg"
                  alt="Firehouse Movers Texas Fleet"
                  fill
                  className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                  priority
                />
              </div>

              {/* Headline Anchor (Two-tone contrast exactly matching reference) */}
              <h1 className="display-heading text-4xl sm:text-5xl lg:text-[50px] xl:text-[60px] tracking-tight leading-[0.9] uppercase select-none font-bold">
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
                <div className="min-h-0 lg:min-h-[calc(100vh-136px)] flex flex-col justify-between pb-8 lg:pb-2 shrink-0">
                  {/* Top: Editorial Narrative & CTA */}
                  <div className="space-y-6">
                    <p className="text-xl sm:text-2xl lg:text-[27px] xl:text-[29px] text-neutral-100 font-medium leading-[1.32] tracking-tight">
                      With every service under one roof and one accountable team, your supply chain moves the way your business demands: predictably, transparently, and without excuses.
                    </p>

                    <p className="text-base sm:text-lg lg:text-[19px] xl:text-[20px] text-neutral-400 font-normal leading-[1.42] tracking-tight">
                      That means no finger-pointing between vendors. No delays lost in handoffs. Just one team, accountable from origin to destination.
                    </p>

                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={handleLearnMore}
                        className="inline-flex items-center justify-center px-7 py-3 rounded-full border border-neutral-700 hover:border-white text-[11px] font-mono uppercase tracking-[0.2em] text-neutral-300 hover:text-white transition-all duration-200 cursor-pointer"
                      >
                        LEARN MORE ABOUT US
                      </button>
                    </div>
                  </div>

                  {/* Bottom: Peeking Eyebrow & Hairline Divider */}
                  <div className="pt-10 lg:pt-6">
                    <p className="text-sm sm:text-base text-neutral-400 font-normal mb-3 sm:mb-4 normal-case">
                      From countless journeys, clarity emerges
                    </p>
                    <div className="border-t border-neutral-800/80 w-full" />
                  </div>
                </div>

                {/* ---------------- 2. STATISTICS SECTION (Reference Style) ---------------- */}
                <div className="pt-2">
                  {/* STAT 1: 2,500+ */}
                  <div className="py-10 sm:py-12 lg:py-14">
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
                  <div className="py-10 sm:py-12 lg:py-14">
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
                  <div className="py-10 sm:py-12 lg:py-14">
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


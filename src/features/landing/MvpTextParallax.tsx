'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export const MvpTextParallax: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const textTrack1Ref = useRef<HTMLDivElement | null>(null);
  const textTrack2Ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const ctx = gsap.context(() => {
      // Scrubbed parallax tracking for giant typography
      gsap.to(textTrack1Ref.current, {
        xPercent: -15,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      });

      gsap.to(textTrack2Ref.current, {
        xPercent: 12,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={sectionRef}
      className="py-16 bg-black overflow-hidden border-b border-neutral-900 select-none pointer-events-none"
    >
      {/* Top Track (Leftward Scroll) */}
      <div
        ref={textTrack1Ref}
        className="whitespace-nowrap text-5xl sm:text-7xl lg:text-8xl font-black tracking-tighter text-neutral-400/40 uppercase"
      >
        <span>FIREHOUSE MOVERS • TEXAS STATEWIDE LOGISTICS • AIR-RIDE FLEET • DISCIPLINED PRECISION • </span>
        <span>FIREHOUSE MOVERS • TEXAS STATEWIDE LOGISTICS • AIR-RIDE FLEET • DISCIPLINED PRECISION • </span>
      </div>

      {/* Bottom Track (Rightward Scroll) */}
      <div
        ref={textTrack2Ref}
        className="whitespace-nowrap text-4xl sm:text-6xl lg:text-7xl font-black tracking-tighter text-red-600/40 uppercase mt-2 -translate-x-1/4"
      >
        <span>STATION 1 • STATION 2 • VAULT STORAGE • RESIDENTIAL & COMMERCIAL • 20+ YEARS TRUST • </span>
        <span>STATION 1 • STATION 2 • VAULT STORAGE • RESIDENTIAL & COMMERCIAL • 20+ YEARS TRUST • </span>
      </div>
    </div>
  );
};

export default MvpTextParallax;

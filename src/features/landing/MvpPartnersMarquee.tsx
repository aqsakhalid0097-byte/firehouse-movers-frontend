'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Sleek monochrome partner logo wordmarks matching the reference aesthetic
const PartnerLogos = {
  TexasHealth: () => (
    <div className="flex items-center gap-2.5 opacity-85 hover:opacity-100 transition-opacity">
      <svg viewBox="0 0 24 24" className="h-6 sm:h-7 w-auto fill-none stroke-white stroke-[2.2]">
        <path d="M12 3v18M3 12h18" strokeLinecap="round" />
        <circle cx="12" cy="12" r="9" />
      </svg>
      <div className="flex flex-col text-left leading-none tracking-tight">
        <span className="font-black text-sm sm:text-base tracking-[0.08em] text-white">TEXAS HEALTH</span>
        <span className="text-[9px] font-semibold tracking-[0.24em] text-neutral-400 uppercase pt-0.5">RESOURCES</span>
      </div>
    </div>
  ),

  LegacyWest: () => (
    <div className="flex items-center gap-2.5 opacity-85 hover:opacity-100 transition-opacity">
      <svg viewBox="0 0 24 24" className="h-6 sm:h-7 w-auto fill-none stroke-white stroke-[2.2]">
        <rect x="4" y="4" width="16" height="16" rx="2" />
        <path d="M9 9h6v6H9z" fill="white" />
      </svg>
      <div className="flex flex-col text-left leading-none tracking-tight">
        <span className="font-black text-sm sm:text-base tracking-[0.12em] text-white">LEGACY WEST</span>
        <span className="text-[9px] font-semibold tracking-[0.24em] text-neutral-400 uppercase pt-0.5">COMMERCIAL</span>
      </div>
    </div>
  ),

  FriscoISD: () => (
    <div className="flex items-center gap-2.5 opacity-85 hover:opacity-100 transition-opacity">
      <svg viewBox="0 0 24 24" className="h-6 sm:h-7 w-auto fill-white">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <div className="flex flex-col text-left leading-none tracking-tight">
        <span className="font-black text-sm sm:text-base tracking-[0.14em] text-white">FRISCO ISD</span>
        <span className="text-[9px] font-semibold tracking-[0.22em] text-neutral-400 uppercase pt-0.5">EDUCATION</span>
      </div>
    </div>
  ),

  LoneStarFreight: () => (
    <div className="flex items-center gap-2.5 opacity-85 hover:opacity-100 transition-opacity">
      <svg viewBox="0 0 24 24" className="h-6 sm:h-7 w-auto fill-white">
        <path d="M12 2l2.4 7.4h7.6l-6.2 4.5 2.4 7.4-6.2-4.5-6.2 4.5 2.4-7.4-6.2-4.5h7.6z" />
      </svg>
      <div className="flex flex-col text-left leading-none tracking-tight">
        <span className="font-black text-sm sm:text-base tracking-[0.1em] text-white">LONE STAR</span>
        <span className="text-[9px] font-semibold tracking-[0.2em] text-neutral-400 uppercase pt-0.5">FREIGHT ALLIANCE</span>
      </div>
    </div>
  ),

  DFWRealEstate: () => (
    <div className="flex items-center gap-2.5 opacity-85 hover:opacity-100 transition-opacity">
      <svg viewBox="0 0 24 24" className="h-6 sm:h-7 w-auto fill-none stroke-white stroke-[2.2]">
        <path d="M3 21h18M3 10l9-7 9 7v11" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <div className="flex flex-col text-left leading-none tracking-tight">
        <span className="font-black text-sm sm:text-base tracking-[0.12em] text-white">DFW REALTY</span>
        <span className="text-[9px] font-semibold tracking-[0.2em] text-neutral-400 uppercase pt-0.5">ESTATE GROUP</span>
      </div>
    </div>
  ),

  TexasVeterans: () => (
    <div className="flex items-center gap-2.5 opacity-85 hover:opacity-100 transition-opacity">
      <svg viewBox="0 0 24 24" className="h-6 sm:h-7 w-auto fill-none stroke-white stroke-[2.2]">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <div className="flex flex-col text-left leading-none tracking-tight">
        <span className="font-black text-sm sm:text-base tracking-[0.1em] text-white">TEXAS VETERANS</span>
        <span className="text-[9px] font-semibold tracking-[0.24em] text-neutral-400 uppercase pt-0.5">COALITION</span>
      </div>
    </div>
  ),

  NorthTexasAthletics: () => (
    <div className="flex items-center gap-2.5 opacity-85 hover:opacity-100 transition-opacity">
      <svg viewBox="0 0 24 24" className="h-6 sm:h-7 w-auto fill-none stroke-white stroke-[2.2]">
        <circle cx="12" cy="12" r="10" />
        <path d="M4.93 4.93l14.14 14.14M14.14 4.93L4.93 14.14" strokeLinecap="round" />
      </svg>
      <div className="flex flex-col text-left leading-none tracking-tight italic">
        <span className="font-black text-sm sm:text-base tracking-[0.06em] text-white">NORTH TEXAS</span>
        <span className="text-[9px] font-bold tracking-[0.22em] text-neutral-400 uppercase pt-0.5 not-italic">ATHLETICS</span>
      </div>
    </div>
  ),

  PlanoTechHQ: () => (
    <div className="flex items-center gap-2.5 opacity-85 hover:opacity-100 transition-opacity">
      <svg viewBox="0 0 24 24" className="h-6 sm:h-7 w-auto fill-none stroke-white stroke-[2.2]">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8M12 17v4" strokeLinecap="round" />
      </svg>
      <div className="flex flex-col text-left leading-none tracking-tight">
        <span className="font-black text-sm sm:text-base tracking-[0.14em] text-white">PLANO TECH</span>
        <span className="text-[9px] font-semibold tracking-[0.22em] text-neutral-400 uppercase pt-0.5">HEADQUARTERS</span>
      </div>
    </div>
  ),
};

export const partnersList = [
  { id: 'thr', Component: PartnerLogos.TexasHealth },
  { id: 'lwc', Component: PartnerLogos.LegacyWest },
  { id: 'fisd', Component: PartnerLogos.FriscoISD },
  { id: 'lsfa', Component: PartnerLogos.LoneStarFreight },
  { id: 'dfwre', Component: PartnerLogos.DFWRealEstate },
  { id: 'tvc', Component: PartnerLogos.TexasVeterans },
  { id: 'nta', Component: PartnerLogos.NorthTexasAthletics },
  { id: 'pth', Component: PartnerLogos.PlanoTechHQ },
];

export const MvpPartnersMarquee: React.FC = () => {
  const marqueeTrackRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !marqueeTrackRef.current) return;

    let currentDirection = 1; // 1 = moving left (default), -1 = moving right

    // Constant continuous infinite linear ticker
    const tween = gsap.to(marqueeTrackRef.current, {
      xPercent: -50,
      duration: 28,
      ease: 'none',
      repeat: -1,
    });

    // Scroll-direction listener to dynamically flip marquee direction
    const st = ScrollTrigger.create({
      onUpdate: (self) => {
        // self.direction: 1 is scrolling down, -1 is scrolling up
        if (self.direction !== 0 && self.direction !== currentDirection) {
          currentDirection = self.direction;
          gsap.to(tween, {
            timeScale: currentDirection, // 1 moves left, -1 moves right
            duration: 0.7,
            ease: 'power2.out',
            overwrite: 'auto',
          });
        }
      },
    });

    return () => {
      tween.kill();
      st.kill();
    };
  }, []);

  // 4x duplicated array for seamless 100% infinite bidirectional continuous loop
  const multiPartners = [...partnersList, ...partnersList, ...partnersList, ...partnersList];

  return (
    <section className="py-8 sm:py-10 bg-black border-y border-neutral-900/80 overflow-hidden relative select-none">
      {/* Edge Linear Gradient Vignette Mask */}
      <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
        <div
          ref={marqueeTrackRef}
          className="flex items-center gap-14 sm:gap-20 lg:gap-28 whitespace-nowrap w-max"
        >
          {multiPartners.map((item, idx) => (
            <div key={`${item.id}-${idx}`} className="flex items-center justify-center shrink-0">
              <item.Component />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MvpPartnersMarquee;


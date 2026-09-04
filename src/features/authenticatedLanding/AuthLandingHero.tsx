'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ShieldCheck, ClipboardList } from 'lucide-react';

export interface AuthLandingHeroProps {
  userName?: string;
}

export const AuthLandingHero: React.FC<AuthLandingHeroProps> = ({ userName = 'Mohid' }) => {
  const smokeContainerRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    // 1. Truck Driving Animation across screen
    const truckTween = gsap.fromTo(
      '#auth-truck',
      { x: '-150px' },
      { x: '110vw', duration: 10, ease: 'linear', repeat: -1 }
    );

    const smokeTween = gsap.fromTo(
      '#auth-smoke-container',
      { x: '-150px' },
      { x: '110vw', duration: 10, ease: 'linear', repeat: -1 }
    );

    // Wheels rotating
    const wheelTween = gsap.to(['#auth-wheel1', '#auth-wheel2', '#auth-wheel3'], {
      rotation: 360,
      transformOrigin: '50% 50%',
      repeat: -1,
      ease: 'linear',
      duration: 1,
    });

    // Truck subtle bounce
    const bounceTween = gsap.to('#auth-truck', {
      y: -4,
      yoyo: true,
      repeat: -1,
      duration: 0.8,
      ease: 'sine.inOut',
    });

    // Headlights pulsing
    const headlightTween = gsap.to('.auth-headlight', {
      fill: '#fef08a',
      repeat: -1,
      yoyo: true,
      duration: 0.6,
      ease: 'sine.inOut',
    });

    const beamTween = gsap.to('.auth-beam', {
      opacity: 0.3,
      repeat: -1,
      yoyo: true,
      duration: 0.8,
    });

    // Exhaust smoke generator
    const createSmoke = () => {
      const svg = smokeContainerRef.current;
      if (svg) {
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        const x = 10 + Math.random() * 10;
        circle.setAttribute('cx', x.toString());
        circle.setAttribute('cy', '50');
        circle.setAttribute('r', '4');
        circle.setAttribute('fill', 'rgba(200,200,200,0.5)');
        svg.appendChild(circle);

        gsap.to(circle, {
          cy: -10,
          r: 10,
          opacity: 0,
          duration: 2,
          ease: 'power1.out',
          onComplete: () => circle.remove(),
        });
      }
    };

    const smokeInterval = setInterval(createSmoke, 1200);

    return () => {
      clearInterval(smokeInterval);
      truckTween.kill();
      smokeTween.kill();
      wheelTween.kill();
      bounceTween.kill();
      headlightTween.kill();
      beamTween.kill();
    };
  }, []);

  return (
    <section className="relative overflow-hidden min-h-[calc(100vh-80px)] h-[calc(100vh-80px)] flex items-center justify-center bg-[#1e1e1e]">
      {/* Background Image & Overlays */}
      <div className="absolute inset-0">
        <img
          src="/images/two_trucks.jpg"
          alt="Firehouse Movers Fleet"
          className="w-full h-full object-cover object-center opacity-60"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-[#141414]" />
      </div>

      {/* SVG Truck Driving Scene across bottom of Hero */}
      <div
        className="absolute inset-0 flex items-end justify-start overflow-hidden z-30 pointer-events-none"
        id="auth-truck-scene"
      >
        <svg
          id="auth-truck"
          className="w-[16rem] sm:w-[20rem] h-auto drop-shadow-2xl mb-2 sm:mb-4"
          viewBox="0 0 320 120"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Trailer */}
          <rect x="10" y="30" rx="8" ry="8" width="190" height="60" className="truck-body" />
          {/* Firehouse Logo on Trailer */}
          <image
            href="/images/fire_house_logo.svg"
            x="82"
            y="35"
            width="45"
            height="45"
            opacity="0.75"
          />
          {/* Cab */}
          <rect x="200" y="40" rx="6" ry="6" width="90" height="50" className="truck-cab" />
          {/* Windows */}
          <rect x="210" y="48" width="26" height="18" rx="2" className="truck-window" />
          <rect x="240" y="48" width="30" height="18" rx="2" className="truck-window" />
          {/* Headlights */}
          <circle cx="290" cy="72" r="6" className="headlight auth-headlight" />
          <circle cx="290" cy="90" r="6" className="headlight auth-headlight" />
          {/* Headlight Beams */}
          <polygon points="296,66 320,58 320,86 296,78" className="beam auth-beam" />
          <polygon points="296,84 320,76 320,104 296,96" className="beam auth-beam" />
          {/* Wheels */}
          <circle id="auth-wheel1" cx="60" cy="95" r="14" className="wheel" />
          <circle id="auth-wheel2" cx="170" cy="95" r="14" className="wheel" />
          <circle id="auth-wheel3" cx="250" cy="95" r="14" className="wheel" />
        </svg>

        {/* Exhaust smoke container */}
        <svg
          ref={smokeContainerRef}
          className="absolute left-[150px] sm:left-[185px] bottom-[50px] sm:bottom-[65px]"
          id="auth-smoke-container"
          width="40"
          height="60"
        ></svg>
      </div>

      {/* Hero Content */}
      <div className="relative z-20 max-w-5xl mx-auto text-center px-6 py-16 sm:py-20">
        <h1 className="animate-heading text-4xl sm:text-6xl md:text-7xl font-extrabold text-white mb-6 tracking-tight drop-shadow-2xl">
          Welcome Back, <span className="text-red-500">{userName}</span>
        </h1>

        <p className="text-gray-300 text-base sm:text-xl max-w-3xl mx-auto mb-10 leading-relaxed drop-shadow">
          Access real-time truck availability, dispatch logistics, safety inspections, inventory, and team evaluation tools.
        </p>

        <div className="flex flex-wrap gap-4 justify-center items-center">
          <a
            href="#operations-grid"
            className="px-7 py-3.5 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-lg shadow-lg shadow-red-600/30 hover:scale-105 transition-all text-sm flex items-center gap-2 cursor-pointer"
          >
            <ClipboardList className="w-4 h-4" /> Explore Operations
          </a>
          <Link
            href="/profile"
            className="px-7 py-3.5 bg-neutral-800/90 hover:bg-neutral-700 text-white border border-neutral-700 font-semibold rounded-lg shadow-lg hover:scale-105 transition-all text-sm flex items-center gap-2 cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4" /> View My Profile
          </Link>
        </div>
      </div>
    </section>
  );
};

export default AuthLandingHero;

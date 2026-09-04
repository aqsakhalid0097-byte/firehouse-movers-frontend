'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ArrowRight, Play } from 'lucide-react';

export const MvpLandingHero: React.FC = () => {
  const heroRef = useRef<HTMLDivElement | null>(null);
  const magneticBtnRef = useRef<HTMLAnchorElement | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const ctx = gsap.context(() => {
      // 1. Entrance timeline
      const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

      tl.from('.hero-bg-photo', {
        opacity: 0.2,
        duration: 1.4,
        ease: 'power2.out',
      })
        .from(
          '.hero-headline-line',
          {
            yPercent: 120,
            duration: 1.1,
            stagger: 0.08,
            ease: 'power4.out',
          },
          '-=1.0'
        )
        .from(
          '.hero-subline',
          {
            y: 30,
            opacity: 0,
            duration: 0.8,
            ease: 'power3.out',
          },
          '-=0.7'
        )
        .from(
          '.hero-cta-buttons',
          {
            y: 25,
            opacity: 0,
            duration: 0.6,
            ease: 'power3.out',
          },
          '-=0.5'
        );

      // 2. Parallax background on scroll
      gsap.to('.hero-bg-photo', {
        yPercent: 8,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });
    }, heroRef);

    // 3. Magnetic CTA Button Effect
    const button = magneticBtnRef.current;
    if (button) {
      const handleMouseMove = (e: MouseEvent) => {
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        gsap.to(button, {
          x: x * 0.25,
          y: y * 0.25,
          duration: 0.4,
          ease: 'power3.out',
        });
      };

      const handleMouseLeave = () => {
        gsap.to(button, {
          x: 0,
          y: 0,
          duration: 0.6,
          ease: 'elastic.out(1, 0.4)',
        });
      };

      button.addEventListener('mousemove', handleMouseMove);
      button.addEventListener('mouseleave', handleMouseLeave);

      return () => {
        button.removeEventListener('mousemove', handleMouseMove);
        button.removeEventListener('mouseleave', handleMouseLeave);
        ctx.revert();
      };
    }

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative h-[100dvh] min-h-[500px] xs:min-h-[540px] sm:min-h-[620px] flex items-center justify-center bg-black text-white overflow-hidden"
    >
      {/* Full-Screen Edge-to-Edge Highway Truck Motion Video Backdrop */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <video
          autoPlay
          loop
          muted
          playsInline
          poster="/images/hero_sunset_truck.jpg"
          className="hero-bg-photo w-full h-full object-cover object-[center_40%] relative"
        >
          <source src="/documents/truck_background_video.mp4" type="video/mp4" />
        </video>
        {/* Crisp, Smooth Contrast Gradients for Crystal-Clear Video & Legible Text */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/25 to-black/10"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30"></div>
      </div>

      {/* Main Left-Aligned Content Column (Centered on Y-Axis) */}
      <div className="relative z-10 max-w-[1700px] mx-auto px-4 sm:px-10 lg:px-16 w-full -translate-y-2 sm:-translate-y-8 lg:-translate-y-10">
        <div className="max-w-5xl text-left space-y-4 sm:space-y-5">
          {/* Clean 2-Line Headline in Helvetica Neue 100 uppercase */}
          <h1 className="display-heading display-heading--hero text-white drop-shadow-[0_4px_20px_rgba(0,0,0,0.9)]">
            <div className="overflow-hidden pb-1 sm:pb-2">
              <span className="hero-headline-line inline-block pb-1">Smart Dispatch.</span>
            </div>
            <div className="overflow-hidden pb-2 sm:pb-3">
              <span className="hero-headline-line inline-block pb-2 bg-gradient-to-r from-red-600 via-white to-neutral-400 bg-clip-text text-transparent animate-gradient-text">
                Stronger Moves.
              </span>
            </div>
          </h1>

          {/* Clean Concise Subtitle in Aeonik */}
          <p
            className="hero-subline text-sm sm:text-base lg:text-lg text-gray-200 max-w-xl leading-relaxed font-medium drop-shadow-md"
            style={{ fontFamily: "'Aeonik', var(--font-aeonik), sans-serif" }}
          >
            We connect American families and businesses with disciplined firefighter-led crews, heavy-duty air-ride fleet, and dependable care.
          </p>

          {/* Action Buttons Row */}
          <div className="hero-cta-buttons flex flex-wrap items-center gap-3 pt-2">
            <a
              ref={magneticBtnRef}
              href="#estimate-calculator"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold text-xs sm:text-sm shadow-xl shadow-red-600/40 cursor-pointer border border-red-500/50 transition-all hover:scale-105 active:scale-95"
            >
              <span>Get Quote</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>

            <a
              href="#services"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-neutral-900/90 hover:bg-neutral-800 border border-neutral-700 text-gray-200 hover:text-white font-semibold text-xs sm:text-sm backdrop-blur-md transition-all cursor-pointer hover:border-neutral-500"
            >
              <div className="w-4 h-4 rounded-full bg-white/10 flex items-center justify-center">
                <Play className="w-2 h-2 fill-white text-white translate-x-0.5" />
              </div>
              <span>How It Works</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MvpLandingHero;


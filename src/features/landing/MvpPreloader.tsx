'use client';

import React, { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';

interface MvpPreloaderProps {
  onComplete?: () => void;
}

// Flag tracks whether the preloader has COMPLETED its full 2-second run in this session.
// Only set to true AFTER the 0-100 count and curtain exit finish, preventing StrictMode double-mount from killing it.
let hasCompletedPreloader = false;

export const MvpPreloader: React.FC<MvpPreloaderProps> = ({ onComplete }) => {
  const [isDone, setIsDone] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const forceShow = window.location.search.includes('preloader=1');
    if (forceShow) return false;
    return hasCompletedPreloader;
  });

  const preloaderRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const counterRef = useRef<HTMLSpanElement | null>(null);
  const progressBarRef = useRef<HTMLDivElement | null>(null);
  const statusTextRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const forceShow = window.location.search.includes('preloader=1');
    if (!forceShow && hasCompletedPreloader) {
      setIsDone(true);
      if (onComplete) onComplete();
      return;
    }

    let animFrameId: number;
    const duration = 2200; // Guaranteed 2.2 seconds display
    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      const current = Math.min(100, Math.floor(progress * 100));

      if (counterRef.current) {
        counterRef.current.textContent = current < 10 ? `0${current}` : `${current}`;
      }
      if (progressBarRef.current) {
        progressBarRef.current.style.width = `${current}%`;
      }
      if (statusTextRef.current) {
        if (current < 28) {
          statusTextRef.current.textContent = 'CONNECTING STATION 1 DISPATCH...';
        } else if (current < 60) {
          statusTextRef.current.textContent = 'CALIBRATING 26FT AIR-RIDE FLEET...';
        } else if (current < 90) {
          statusTextRef.current.textContent = 'SYNCHRONIZING 3D LOGISTICS ASSETS...';
        } else {
          statusTextRef.current.textContent = 'DISPATCH FLEET READY';
        }
      }

      if (progress < 1) {
        animFrameId = requestAnimationFrame(tick);
      } else {
        // Explicitly guarantee 100 is visible
        if (counterRef.current) counterRef.current.textContent = '100';
        if (progressBarRef.current) progressBarRef.current.style.width = '100%';
        if (statusTextRef.current) statusTextRef.current.textContent = 'DISPATCH FLEET READY';

        // Hold at 100% for 300ms so user clearly sees 100% completion
        setTimeout(() => {
          if (contentRef.current) {
            contentRef.current.style.transition = 'opacity 300ms ease, transform 300ms ease';
            contentRef.current.style.opacity = '0';
            contentRef.current.style.transform = 'translateY(-24px)';
          }

          setTimeout(() => {
            if (preloaderRef.current) {
              preloaderRef.current.style.transition = 'transform 850ms cubic-bezier(0.77, 0, 0.175, 1)';
              preloaderRef.current.style.transform = 'translateY(-100%)';
            }

            setTimeout(() => {
              hasCompletedPreloader = true;
              setIsDone(true);
              if (onComplete) onComplete();
            }, 850);
          }, 300);
        }, 300);
      }
    };

    animFrameId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(animFrameId);
    };
  }, [onComplete]);

  if (isDone) return null;

  return (
    <div
      ref={preloaderRef}
      className="fixed inset-0 z-[100] bg-black text-white flex flex-col justify-between p-4 sm:p-12 overflow-hidden select-none pointer-events-auto"
    >
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-neutral-800/80 pb-3 sm:pb-4 gap-2">
        <div className="flex items-center gap-2 sm:gap-3 truncate">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-500 font-black text-xs shrink-0">
            FM
          </div>
          <span className="font-mono text-[10px] sm:text-xs font-bold uppercase tracking-widest text-gray-400 truncate">
            Firehouse Movers<span className="hidden sm:inline"> Inc. • Operational Platform</span>
          </span>
        </div>
        <div className="text-[10px] sm:text-xs font-mono font-bold text-red-500 flex items-center gap-1.5 sm:gap-2 shrink-0">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
          <span>DISPATCH<span className="hidden sm:inline"> SYSTEM</span> v2.6</span>
        </div>
      </div>

      {/* Center Dynamic Brand & Counter */}
      <div ref={contentRef} className="preloader-content flex flex-col items-center justify-center text-center space-y-6 max-w-lg mx-auto">
        <div className="relative">
          <img
            src="/images/fire_house_logo.svg"
            alt="Firehouse Seal"
            className="w-16 sm:w-20 h-16 sm:h-20 object-contain drop-shadow-[0_0_25px_rgba(239,68,68,0.5)] animate-pulse"
          />
        </div>

        {/* Giant Monospace Numeric Counter */}
        <div className="font-mono text-6xl sm:text-8xl font-black tracking-tight text-white flex items-baseline justify-center">
          <span ref={counterRef}>00</span>
          <span className="text-red-500 text-3xl sm:text-4xl ml-1 font-sans">%</span>
        </div>

        {/* Progress Bar */}
        <div className="w-64 sm:w-80 h-1 bg-neutral-900 rounded-full overflow-hidden border border-neutral-800">
          <div
            ref={progressBarRef}
            className="h-full bg-gradient-to-r from-red-600 via-orange-500 to-amber-400 transition-all duration-75 w-0"
          ></div>
        </div>

        {/* Status Kicker */}
        <div ref={statusTextRef} className="text-xs font-mono font-bold text-gray-400 tracking-wider">
          CONNECTING STATION 1 DISPATCH...
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between border-t border-neutral-800/80 pt-3 sm:pt-4 text-[10px] sm:text-[11px] font-mono text-gray-500 gap-1 sm:gap-0 text-center sm:text-left">
        <span>EST. 2004 • LEWISVILLE, TX</span>
        <span>FIREFIGHTER OWNED &amp; OPERATED</span>
      </div>
    </div>
  );
};

export default MvpPreloader;

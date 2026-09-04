'use client';

import React, { useEffect, useRef, useState } from 'react';

/**
 * Modern Interactive Agency Cursor
 * - Instant zero-latency precision center dot (Firehouse Red accent).
 * - Butter-smooth fluid trailing halo ring with lerp interpolation.
 * - Magnetic scale & luminous glow when hovering clickable elements (buttons, links, inputs).
 * - Tactile spring compression on mousedown / click.
 * - Automatically hidden on mobile/touch screens and respects prefers-reduced-motion.
 * - Never blocks clicks or text selection (pointer-events: none).
 */
export const CustomCursor: React.FC = () => {
  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);

  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check for touch device or reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isTouch =
      window.matchMedia('(pointer: coarse)').matches ||
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0;

    if (prefersReducedMotion || isTouch) {
      setIsEnabled(false);
      return;
    }

    setIsEnabled(true);
    document.documentElement.classList.add('has-custom-cursor');

    const mouse = { x: -100, y: -100 };
    const ring = { x: -100, y: -100 };
    let animFrameId: number;

    const onMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;

      if (!isVisible) setIsVisible(true);

      // Instant 1:1 hardware tracking for center dot
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouse.x}px, ${mouse.y}px, 0) translate(-50%, -50%)`;
      }

      // Check if hovering over interactive element
      const target = e.target as HTMLElement | null;
      if (target) {
        const isClickable = Boolean(
          target.closest('a, button, input, select, textarea, [role="button"], .cursor-pointer')
        );
        setIsHovered(isClickable);
      }
    };

    const onMouseDown = () => setIsClicked(true);
    const onMouseUp = () => setIsClicked(false);

    const onMouseLeave = () => {
      setIsVisible(false);
      setIsHovered(false);
    };

    const onMouseEnter = () => {
      setIsVisible(true);
    };

    // Smooth Lerp loop for trailing halo ring
    const render = () => {
      const lerp = 0.16; // Smooth lag factor
      ring.x += (mouse.x - ring.x) * lerp;
      ring.y += (mouse.y - ring.y) * lerp;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0) translate(-50%, -50%)`;
      }

      animFrameId = requestAnimationFrame(render);
    };

    animFrameId = requestAnimationFrame(render);

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    document.documentElement.addEventListener('mouseleave', onMouseLeave);
    document.documentElement.addEventListener('mouseenter', onMouseEnter);

    return () => {
      document.documentElement.classList.remove('has-custom-cursor');
      cancelAnimationFrame(animFrameId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.documentElement.removeEventListener('mouseleave', onMouseLeave);
      document.documentElement.removeEventListener('mouseenter', onMouseEnter);
    };
  }, [isVisible]);

  if (!isEnabled) return null;

  return (
    <>
      {/* 1. Precision Center Dot (Zero Latency) */}
      <div
        ref={dotRef}
        className={`fixed top-0 left-0 pointer-events-none z-[99999] transition-opacity duration-200 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ willChange: 'transform' }}
      >
        <div
          className={`rounded-full transition-transform duration-150 ${
            isHovered
              ? 'w-2 h-2 bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)] scale-75'
              : isClicked
              ? 'w-2 h-2 bg-red-400 scale-125'
              : 'w-1.5 h-1.5 bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.9)]'
          }`}
        />
      </div>

      {/* 2. Fluid Trailing Halo Ring (Lerped) */}
      <div
        ref={ringRef}
        className={`fixed top-0 left-0 pointer-events-none z-[99998] transition-opacity duration-300 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ willChange: 'transform' }}
      >
        <div
          className={`rounded-full border transition-all duration-200 ease-out flex items-center justify-center ${
            isHovered
              ? 'w-12 h-12 border-red-500/80 bg-red-500/15 backdrop-blur-[1px] shadow-[0_0_20px_rgba(239,68,68,0.35)] scale-110'
              : isClicked
              ? 'w-7 h-7 border-red-400/90 bg-red-500/25 scale-90'
              : 'w-8 h-8 border-white/30 bg-white/[0.03]'
          }`}
        />
      </div>
    </>
  );
};

export default CustomCursor;

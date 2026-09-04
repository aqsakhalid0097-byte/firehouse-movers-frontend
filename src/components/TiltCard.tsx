'use client';

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number; // Maximum tilt angle in degrees (default 6.5)
  perspective?: number; // Perspective distance in px (default 1100)
  scale?: number; // Subtle lift/scale on hover (default 1.018)
  enabled?: boolean; // Controlled enabled prop
  delayMs?: number; // Wait for initial loading / entrance animations to finish before activating (default 1200ms)
}

/**
 * High-end interactive 3D tilt card primitive.
 * - Tilts in physical 3D space toward the cursor position with perspective depth.
 * - Multi-plane parallax translation on child elements marked with `data-tilt-depth`.
 * - Restrained, premium physics (no exaggerated spinning or bouncing).
 * - Smooth GSAP interpolation with natural settling when cursor leaves.
 * - Subtle lift/scale on hover to reinforce tactile physical depth.
 * - Automatically disabled on mobile/touch devices and prefers-reduced-motion.
 * - Activates only after loading/entrance animations have completed.
 */
export const TiltCard: React.FC<TiltCardProps> = ({
  children,
  className = '',
  maxTilt = 6.5,
  perspective = 1100,
  scale = 1.018,
  enabled = true,
  delayMs = 1200,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const glareRef = useRef<HTMLDivElement | null>(null);
  const [isInteractive, setIsInteractive] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isTouchDevice =
      window.matchMedia('(pointer: coarse)').matches ||
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0;

    // Disabled on touch devices and reduced-motion systems
    if (prefersReducedMotion || isTouchDevice || !enabled) {
      setIsInteractive(false);
      if (cardRef.current) {
        gsap.set(cardRef.current, { clearProps: 'transform,transformStyle,transformPerspective' });
      }
      return;
    }

    // Wait until the entrance/loading animation finishes
    const timer = setTimeout(() => {
      setIsInteractive(true);
    }, delayMs);

    return () => clearTimeout(timer);
  }, [enabled, delayMs]);

  useEffect(() => {
    if (!isInteractive) return;

    const container = containerRef.current;
    const card = cardRef.current;
    const glare = glareRef.current;
    if (!container || !card) return;

    // Retrieve layered parallax child elements
    const getParallaxItems = () => {
      return card.querySelectorAll<HTMLElement>('[data-tilt-depth]');
    };

    let bounds = container.getBoundingClientRect();

    const handleMouseEnter = () => {
      bounds = container.getBoundingClientRect();
      if (glare) {
        gsap.to(glare, { opacity: 1, duration: 0.35, ease: 'power2.out' });
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!bounds.width || !bounds.height) {
        bounds = container.getBoundingClientRect();
      }

      // Normalized coordinates from center: -0.5 to 0.5
      const mouseX = (e.clientX - bounds.left) / bounds.width - 0.5;
      const mouseY = (e.clientY - bounds.top) / bounds.height - 0.5;

      // Calculate restrained, natural tilt angles toward cursor
      const rotateX = -mouseY * maxTilt * 2;
      const rotateY = mouseX * maxTilt * 2;

      // Fluid GSAP interpolation
      gsap.to(card, {
        rotateX,
        rotateY,
        scale,
        z: 8,
        transformPerspective: perspective,
        duration: 0.35,
        ease: 'power2.out',
        overwrite: 'auto',
      });

      // Subtle specular light reflection following cursor
      if (glare) {
        const glareX = (mouseX + 0.5) * 100;
        const glareY = (mouseY + 0.5) * 100;
        glare.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255, 255, 255, 0.08) 0%, transparent 65%)`;
      }

      // Parallax movement on internal layered elements
      const parallaxItems = getParallaxItems();
      parallaxItems.forEach((item) => {
        const depth = parseFloat(item.dataset.tiltDepth || '12');
        gsap.to(item, {
          x: mouseX * depth * 1.5,
          y: mouseY * depth * 1.5,
          z: depth,
          duration: 0.42,
          ease: 'power2.out',
          overwrite: 'auto',
        });
      });
    };

    const handleMouseLeave = () => {
      // Natural, graceful settling back to baseline
      gsap.to(card, {
        rotateX: 0,
        rotateY: 0,
        scale: 1,
        z: 0,
        duration: 0.75,
        ease: 'power3.out',
        overwrite: 'auto',
      });

      // Fade out specular glare
      if (glare) {
        gsap.to(glare, { opacity: 0, duration: 0.5, ease: 'power2.out' });
      }

      // Return parallax children smoothly to baseline
      const parallaxItems = getParallaxItems();
      parallaxItems.forEach((item) => {
        gsap.to(item, {
          x: 0,
          y: 0,
          z: 0,
          duration: 0.75,
          ease: 'power3.out',
          overwrite: 'auto',
        });
      });
    };

    container.addEventListener('mouseenter', handleMouseEnter);
    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      container.removeEventListener('mouseenter', handleMouseEnter);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
      gsap.killTweensOf(card);
    };
  }, [isInteractive, maxTilt, perspective, scale]);

  return (
    <div
      ref={containerRef}
      className={`relative ${className}`}
      style={{ perspective: `${perspective}px` }}
    >
      <div
        ref={cardRef}
        className="w-full h-full relative will-change-transform"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {children}

        {/* Subtle Specular Glare Overlay */}
        {isInteractive && (
          <div
            ref={glareRef}
            className="absolute inset-0 rounded-[inherit] pointer-events-none opacity-0 transition-opacity duration-300 z-50 overflow-hidden"
          />
        )}
      </div>
    </div>
  );
};

export default TiltCard;

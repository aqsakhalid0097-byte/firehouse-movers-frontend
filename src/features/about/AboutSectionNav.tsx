'use client';

import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

export interface AboutSection {
  id: string;
  label: string;
}

export const aboutSections: AboutSection[] = [
  { id: 'glance', label: 'At a Glance' },
  { id: 'timeline', label: 'Timeline' },
];

/**
 * Sticky section rail: scroll-spy, read progress, and a pill that slides
 * between chips rather than snapping.
 */
export const AboutSectionNav: React.FC = () => {
  const [activeId, setActiveId] = useState<string>(aboutSections[0].id);
  const [progress, setProgress] = useState<number>(0);
  const [pill, setPill] = useState<{ left: number; width: number } | null>(null);
  const railRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Resolve sections inside *this* page root rather than via
    // document.getElementById: the route can leave a detached duplicate of the
    // tree behind, and a global lookup may resolve to those dead nodes.
    const root = railRef.current?.closest('[data-about-root]') ?? document;

    const elements = aboutSections
      .map((section) => root.querySelector<HTMLElement>(`#${section.id}`))
      .filter((el): el is HTMLElement => Boolean(el));

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible.length > 0) setActiveId(visible[0].target.id);
      },
      { rootMargin: '-136px 0px -60% 0px', threshold: 0 }
    );

    elements.forEach((el) => observer.observe(el));

    const handleScroll = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(scrollable > 0 ? Math.min(100, (window.scrollY / scrollable) * 100) : 0);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Position the sliding pill under the active chip
  const syncPill = useCallback(() => {
    const rail = railRef.current;
    if (!rail) return;
    const chip = rail.querySelector<HTMLElement>(`[data-chip="${activeId}"]`);
    if (!chip) return;
    setPill({ left: chip.offsetLeft, width: chip.offsetWidth });

    const railBox = rail.getBoundingClientRect();
    const chipBox = chip.getBoundingClientRect();
    if (chipBox.left < railBox.left || chipBox.right > railBox.right) {
      rail.scrollTo({ left: chip.offsetLeft - 16, behavior: 'smooth' });
    }
  }, [activeId]);

  useLayoutEffect(() => {
    syncPill();
  }, [syncPill]);

  useEffect(() => {
    window.addEventListener('resize', syncPill);
    return () => window.removeEventListener('resize', syncPill);
  }, [syncPill]);

  const handleJump = (event: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    event.preventDefault();
    const root = railRef.current?.closest('[data-about-root]') ?? document;
    const target = root.querySelector<HTMLElement>(`#${id}`);
    if (!target) return;
    const top = target.getBoundingClientRect().top + window.scrollY - 120;
    window.scrollTo({ top, behavior: 'smooth' });
  };

  return (
    <div className="sticky top-[72px] z-30 bg-black/85 backdrop-blur-md border-b border-neutral-800">
      {/* Read progress */}
      <div className="h-[2px] w-full bg-neutral-900">
        <div
          className="h-full bg-red-600 transition-[width] duration-150 ease-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      <div className="w-[min(1200px,calc(100%-48px))] sm:w-[min(1200px,calc(100%-80px))] mx-auto">
        <div
          ref={railRef}
          className="relative flex items-center gap-1 overflow-x-auto py-2.5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          {/* Sliding active pill */}
          {pill && (
            <span
              aria-hidden="true"
              className="absolute top-2.5 bottom-2.5 rounded-md bg-neutral-900 transition-all duration-[420ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{ left: pill.left, width: pill.width }}
            ></span>
          )}

          {aboutSections.map((section, idx) => {
            const isActive = activeId === section.id;
            return (
              <a
                key={section.id}
                href={`#${section.id}`}
                data-chip={section.id}
                onClick={(event) => handleJump(event, section.id)}
                className={`relative shrink-0 inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-[11px] font-mono uppercase tracking-widest transition-colors duration-300 cursor-pointer ${
                  isActive ? 'text-white' : 'text-neutral-500 hover:text-neutral-200'
                }`}
              >
                <span
                  className={`transition-colors duration-300 ${
                    isActive ? 'text-red-500' : 'text-neutral-700'
                  }`}
                >
                  {String(idx + 1).padStart(2, '0')}
                </span>
                <span>{section.label}</span>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AboutSectionNav;

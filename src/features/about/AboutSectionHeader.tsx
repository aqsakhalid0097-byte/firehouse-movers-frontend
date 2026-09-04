'use client';

import React from 'react';
import { TextReveal } from '@/components/TextReveal';
import { useReveal, revealBase, revealHidden, revealShown } from './useReveal';

interface AboutSectionHeaderProps {
  index: string;
  title: string;
  meta?: string;
}

/** Section header with a hairline rule that draws itself in on arrival. */
export const AboutSectionHeader: React.FC<AboutSectionHeaderProps> = ({ index, title, meta }) => {
  const { ref, isVisible } = useReveal<HTMLElement>();

  return (
    <header ref={ref} className="flex items-baseline gap-3 mb-8">
      <span
        className={`font-mono text-[11px] text-red-500 font-bold tracking-widest ${revealBase} ${
          isVisible ? revealShown : revealHidden
        }`}
      >
        {index}
      </span>

      <TextReveal
        as="h2"
        className="display-heading display-heading--dossier text-white"
        start="top 90%"
      >
        {title}
      </TextReveal>

      <span
        aria-hidden="true"
        className="hidden sm:block h-px flex-1 bg-neutral-800 ml-3 origin-left transition-transform duration-700 ease-out"
        style={{ transform: isVisible ? 'scaleX(1)' : 'scaleX(0)', transitionDelay: '120ms' }}
      ></span>

      {meta && (
        <span
          className={`hidden sm:block font-mono text-[11px] text-neutral-600 tracking-widest ${revealBase} ${
            isVisible ? revealShown : revealHidden
          }`}
          style={{ transitionDelay: '220ms' }}
        >
          {meta}
        </span>
      )}
    </header>
  );
};

export default AboutSectionHeader;

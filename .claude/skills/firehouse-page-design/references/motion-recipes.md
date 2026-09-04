# Motion Recipes

GSAP + ScrollTrigger + Lenis. Every recipe below is in production on the landing page.

## Module boilerplate

```tsx
'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}
```

Register at module scope, guarded by the `window` check — this is the repo convention and it keeps SSR safe.

## Scoped context + cleanup (mandatory)

```tsx
const sectionRef = useRef<HTMLDivElement | null>(null);

useEffect(() => {
  if (typeof window === 'undefined') return;

  const ctx = gsap.context(() => {
    // all tweens & ScrollTriggers here, selectors scoped to sectionRef
  }, sectionRef);

  return () => ctx.revert();
}, []);
```

Never create a tween outside the context. `ctx.revert()` kills tweens and their ScrollTriggers together.

## Section entrance timeline

```tsx
const tl = gsap.timeline({
  scrollTrigger: {
    trigger: sectionRef.current,
    start: 'top 75%',
    toggleActions: 'play none none reverse',
  },
});

tl.from('.about-title', { y: 70, opacity: 0, duration: 0.9, ease: 'power3.out' })
  .from('.about-description', { y: 40, opacity: 0, duration: 0.8, ease: 'power3.out' }, '-=0.4')
  .from('.about-button', { y: 20, opacity: 0, duration: 0.5, ease: 'power3.out' }, '-=0.4');
```

## Hero masked line reveal

Wrap each headline line in `overflow-hidden`, animate the inner span:

```tsx
<h1 className="display-heading display-heading--hero text-white drop-shadow-[0_4px_20px_rgba(0,0,0,0.9)]">
  <div className="overflow-hidden pb-1 sm:pb-2">
    <span className="hero-headline-line inline-block pb-1">Smart Dispatch.</span>
  </div>
</h1>
```

```tsx
const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
tl.from('.hero-bg-photo', { opacity: 0.2, duration: 1.4, ease: 'power2.out' })
  .from('.hero-headline-line', { yPercent: 120, duration: 1.1, stagger: 0.08, ease: 'power4.out' }, '-=1.0')
  .from('.hero-subline', { y: 30, opacity: 0, duration: 0.8, ease: 'power3.out' }, '-=0.7')
  .from('.hero-cta-buttons', { y: 25, opacity: 0, duration: 0.6, ease: 'power3.out' }, '-=0.5');
```

## Background parallax

```tsx
gsap.to('.hero-bg-photo', {
  yPercent: 8,
  ease: 'none',
  scrollTrigger: { trigger: heroRef.current, start: 'top top', end: 'bottom top', scrub: true },
});
```

Giant type parallax: two tracks moving opposite directions, `xPercent: -15` and `xPercent: 12`, `scrub: 1`, `start: 'top bottom'`, `end: 'bottom top'`.

## Magnetic CTA

```tsx
const button = magneticBtnRef.current;
if (!button) return;

const handleMouseMove = (e: MouseEvent) => {
  const rect = button.getBoundingClientRect();
  const x = e.clientX - rect.left - rect.width / 2;
  const y = e.clientY - rect.top - rect.height / 2;
  gsap.to(button, { x: x * 0.25, y: y * 0.25, duration: 0.4, ease: 'power3.out' });
};

const handleMouseLeave = () =>
  gsap.to(button, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' });

button.addEventListener('mousemove', handleMouseMove);
button.addEventListener('mouseleave', handleMouseLeave);
return () => {
  button.removeEventListener('mousemove', handleMouseMove);
  button.removeEventListener('mouseleave', handleMouseLeave);
};
```

Reserve for one hero CTA and one form submit per page.

## Image mask reveal + zoom

```tsx
gsap.from('.about-img-mask', {
  clipPath: 'inset(0 100% 0 0)',
  duration: 1.4,
  ease: 'power4.inOut',
  scrollTrigger: { trigger: '.about-img-mask', start: 'top 80%', toggleActions: 'play none none reverse' },
});

gsap.from('.about-img-zoom', {
  scale: 1.35,
  duration: 1.8,
  ease: 'power3.out',
  scrollTrigger: { trigger: '.about-img-mask', start: 'top 80%', toggleActions: 'play none none reverse' },
});
```

## Rolling counters

```tsx
const stats = { years: 0, moves: 0, rate: 0 };

gsap.from('.stat-metric-item', {
  y: 40, opacity: 0, duration: 0.9, stagger: 0.12, ease: 'power3.out',
  scrollTrigger: { trigger: '.about-stats-grid', start: 'top 85%', toggleActions: 'restart none none reverse' },
});

gsap.to(stats, {
  years: 20, moves: 50, rate: 99.4,
  duration: 2.2, ease: 'power2.out',
  scrollTrigger: { trigger: '.about-stats-grid', start: 'top 85%', toggleActions: 'restart none none reverse' },
  onUpdate: () => {
    if (yearsRef.current) yearsRef.current.textContent = `${Math.floor(stats.years)}+`;
    if (movesRef.current) movesRef.current.textContent = `${Math.floor(stats.moves)},000+`;
    if (rateRef.current) rateRef.current.textContent = `${stats.rate.toFixed(1)}%`;
  },
});
```

Render the final value in the JSX so it is correct before the tween and under reduced motion.

## Scroll-drawn road + travelling truck

The signature motif. Tween a plain `{ offset }` object rather than the DOM so the truck marker stays in lockstep with the stroke:

```tsx
const length = svgPath.getTotalLength();
svgPath.style.strokeDasharray = `${length}`;
svgPath.style.strokeDashoffset = `${length}`;

const animState = { offset: length };

const syncFrame = () => {
  svgPath.style.strokeDashoffset = `${animState.offset}`;
  const drawn = Math.max(0, Math.min(length, length - animState.offset));
  if (drawn / length <= 0.005) { truckMarker.style.opacity = '0'; return; }
  truckMarker.style.opacity = '1';

  const pt = svgPath.getPointAtLength(drawn);
  const prev = svgPath.getPointAtLength(Math.max(0, drawn - 4));
  const next = svgPath.getPointAtLength(Math.min(length, drawn + 4));
  const angle = Math.atan2(next.y - prev.y, next.x - prev.x) * (180 / Math.PI);
  truckMarker.setAttribute('transform', `translate(${pt.x}, ${pt.y}) rotate(${angle})`);
};

syncFrame();

gsap.to(animState, {
  offset: 0,
  ease: 'none',
  scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', end: 'bottom 20%', scrub: 0.4 },
  onUpdate: syncFrame,
});
```

Layer order inside the `<svg viewBox="0 0 1440 900" preserveAspectRatio="none">`: ambient base `#1c1c1f` w24 → masked group { kerb `#52525b` w24, asphalt `#27272a` w20, dashed centerline `#71717a` w1.75 `strokeDasharray="6 8"` opacity .75 } → truck `<image href="/images/firehouse_pickup_truck.png" width="120" height="42" x="-60" y="-21" />`. The mask path is the one carrying the ref. Mirror the path horizontally (`M 1480 …` instead of `M -40 …`) and add `<g transform="scale(1, -1)">` around the truck when the road runs right-to-left.

## Bidirectional marquee

```tsx
const tween = gsap.to(trackRef.current, { xPercent: -50, duration: 28, ease: 'none', repeat: -1 });

const st = ScrollTrigger.create({
  onUpdate: (self) => {
    if (self.direction !== 0 && self.direction !== dir) {
      dir = self.direction;
      gsap.to(tween, { timeScale: dir, duration: 0.7, ease: 'power2.out', overwrite: 'auto' });
    }
  },
});

return () => { tween.kill(); st.kill(); };
```

## Reduced motion

CSS animations (`.animate-heading`, `.animate-gradient-text`, `.service-*`) are already neutralised in `src/index.css`. JS must opt out itself:

```tsx
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  gsap.set(['.anim-heading-word', '.anim-heading-sub'], { clearProps: 'all' });
  return;
}
```

Prefer `gsap.from(...)` over `gsap.fromTo(..., {opacity: 0}, ...)` so bailing out never strands content invisible.

## No-GSAP alternative

For document-style pages, `src/features/about/useReveal.ts` gives an IntersectionObserver reveal with CSS transitions — cheaper, and it self-heals (reveals immediately under reduced motion, in headless frames, or when already on screen):

```tsx
const { ref, isVisible } = useReveal<HTMLElement>();

<div ref={ref} className={`${revealBase} ${isVisible ? revealShown : revealHidden}`} style={staggerDelay(i, 70)}>
```

---
name: firehouse-page-design
description: Design and build new marketing/public pages for the Firehouse Movers Next.js frontend so they match the main landing page exactly — dark red/black/grey editorial theme, Aeonik + display-heading typography, GSAP + Lenis scroll motion, and the repo's route/feature file structure. Use whenever adding a new page, section, or redesigning an existing one in this repo.
---

# Firehouse Page Design System

The reference implementation is the public landing page. Read it before building anything:

| Layer | File |
| --- | --- |
| Route orchestrator | `src/routes/LandingPage.tsx` |
| Next entry | `src/app/page.tsx` → `src/routes/RootPage.tsx` |
| Global tokens & keyframes | `src/index.css` |
| Fonts / shell | `src/app/layout.tsx` |
| Sections | `src/features/landing/Mvp*.tsx` |
| Secondary reference (quiet/editorial variant) | `src/features/about/*` |

Two visual registers exist in this codebase. **Do not mix them.**

- **Marketing register** (landing, about, journey, quote — anything a visitor sees). Pure `black / neutral / red`. This is what this skill documents.
- **Console register** (dispatch, fleetio, inspections, staff portal). Tailwind `slate-950/900` + the `Button`/`Card`/`Badge` primitives in `src/components/`, which carry emerald/amber/sky status colors. Only for authenticated operational screens.

---

## 1. Non-negotiables

1. **Palette is red, black, white, grey. Nothing else.** No blue, purple, emerald, amber on a marketing page. The one gradient exception is the preloader bar (`from-red-600 via-orange-500 to-amber-400`).
2. **Headings use `display-heading` + a size modifier**, never ad-hoc `text-6xl font-black`. The modifiers are defined in `src/index.css` and are `!important`.
3. **Every animated component is `'use client'`**, registers ScrollTrigger at module scope, animates inside `gsap.context(...)`, and returns `() => ctx.revert()`.
4. **Route files stay under 150 lines** (`AGENTS.md` mandate). A page is an orchestrator; sections live in `src/features/<domain>/`.
5. **Audit before you create.** Reuse `TiltCard`, `AnimatedHeading`, `SquareParticleField`, `Navbar`, `LandingFooter`, `MvpBackToTop`, `useReveal` before writing new markup.
6. **Every motion path has a `prefers-reduced-motion` escape.** CSS animations are already neutralised in `index.css`; JS animations must check `matchMedia('(prefers-reduced-motion: reduce)')` themselves.

---

## 2. Color tokens

Surfaces are hand-picked hexes, not Tailwind greys. Use these exact values so sections stack without banding:

| Role | Value | Where |
| --- | --- | --- |
| Page ground / hero | `bg-black` | hero, marquee, parallax band |
| Section ground (alt) | `bg-[#0c0c0c]` | About, Contact |
| Card / panel | `bg-[#121212]`, `bg-[#141414]` | showcase card, form panel, contact tiles |
| List row (rest / hover / active) | `bg-[#0f0f0f]` / `bg-[#131313]` / `bg-[#151515]` | service list items |
| Input field | `bg-[#101010]` | all form controls |
| Footer / footer bar | `bg-[#0e0e0e]` / `bg-[#080808]` | `LandingFooter` |
| Hairline border | `border-neutral-800/80` | section dividers, cards |
| Raised border | `border-neutral-700` | panels, inputs, secondary buttons |

Red scale:

| Use | Token |
| --- | --- |
| Primary CTA | `bg-gradient-to-r from-red-600 to-red-700` → hover `from-red-500 to-red-600` |
| CTA shadow | `shadow-xl shadow-red-600/40` (small: `shadow-md shadow-red-600/30`) |
| Icons, bullets, active marks, stat numerals | `text-red-500` |
| Small labels, mono kickers over dark panels | `text-red-400` |
| Ambient glow | `bg-red-600/10 blur-[180px]`, `drop-shadow-[0_0_20px_rgba(239,68,68,0.35)]` |
| Full-bleed page transition panels | `#d81e27` (`.banner-cover`) |
| SVG strokes/filters | `#ef4444` |

Text ramp: `text-white` (headings) → `text-gray-200/300` (body) → `text-gray-400` / `text-neutral-400` (support) → `text-neutral-500/600` (meta, numbering).

Grey asphalt SVG set (the scroll-drawn road motif): base `#1c1c1f`, kerb `#52525b`, surface `#27272a`, dashed centerline `#71717a`.

---

## 3. Typography

Fonts are wired in `src/app/layout.tsx` and `src/index.css` — never import a font in a page.

- All `h1`–`h6` are forced to **Aeonik** globally.
- **Display headings** override that with Helvetica Neue 900, uppercase, tight tracking. Pick the modifier by role:

| Class | Role | Cap size |
| --- | --- | --- |
| `display-heading display-heading--hero` | page hero only | 136px |
| `display-heading display-heading--section` | major section headline | 76px |
| `display-heading display-heading--editorial` | 2-line directory headings | 44px |
| `display-heading display-heading--sub` | secondary heading in dense layout | 46px |
| `display-heading display-heading--compact` | sticky/inline headers | 34px |
| `display-heading display-heading--dossier` | document-style section headers | 30px |

- **Mono kicker** above every section headline — `font-mono text-xs font-bold uppercase tracking-widest text-red-500`. Mono (`IBM Plex Mono`) is reserved for technical detail: codes, ETAs, counters, indices, labels.
- **Gradient word** for the second line of a headline:
  `bg-gradient-to-r from-red-600 via-white to-neutral-400 bg-clip-text text-transparent animate-gradient-text`
- Body copy: `text-gray-300 text-base sm:text-lg leading-relaxed`. Support copy: `text-xs`/`text-[11px]`.

---

## 4. Layout rhythm

```
Container   max-w-7xl mx-auto px-4 sm:px-6 lg:px-8      (standard sections)
            w-[min(1200px,calc(100%-48px))] sm:w-[min(1200px,calc(100%-80px))] mx-auto   (editorial/tight)
            max-w-[1700px] mx-auto px-6 sm:px-10 lg:px-16   (hero, edge-to-edge)
Padding     py-24 sm:py-32   major   ·   py-16 sm:py-24   standard   ·   py-8 sm:py-10   strip
Seams       border-y border-neutral-800/80   between adjacent sections
Split       grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16   →   5/7 or 6/6 columns
Stacking    decorative SVG/canvas z-0 · ambient glow z-[1] · content relative z-10 · navbar z-50 · preloader z-[100]
Radii       rounded-xl buttons/rows · rounded-2xl tiles · rounded-3xl hero panels · rounded-full pills
```

Hero sections are `h-[100dvh] min-h-[620px] flex items-center`, with the media layer absolute inset-0 and two stacked gradient scrims (`from-black/65 via-black/25 to-black/10` horizontal + `from-black/80 via-transparent to-black/30` vertical) so text stays legible.

---

## 5. Page skeleton

Two files minimum. Sections go in `src/features/<domain>/`.

`src/app/<route>/page.tsx` — thin client wrapper:

```tsx
'use client';

import { ServicesPage } from '@/routes/ServicesPage';

export default function Services() {
  return <ServicesPage />;
}
```

`src/routes/<Name>Page.tsx` — orchestrator, under 150 lines:

```tsx
'use client';

import React from 'react';
import { Navbar } from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { SmoothScrollProvider } from '../features/landing/SmoothScrollProvider';
import { LandingFooter } from '../features/landing/LandingFooter';
import { MvpBackToTop } from '../features/landing/MvpBackToTop';
import { ServicesHero } from '../features/services/ServicesHero';

export const ServicesPage: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <SmoothScrollProvider>
      <div className="min-h-screen bg-black text-gray-100 font-sans antialiased overflow-x-hidden selection:bg-red-600 selection:text-white">
        <Navbar isAuthenticated={isAuthenticated} user={user} onLogout={logout} />
        <main>
          <ServicesHero />
          {/* further sections */}
        </main>
        <LandingFooter />
        <MvpBackToTop />
      </div>
    </SmoothScrollProvider>
  );
};

export default ServicesPage;
```

Wrap in `SmoothScrollProvider` only once per page — it owns the Lenis instance and the GSAP ticker. Add `MvpPreloader` only on the site's front door, not on inner pages.

---

## 6. Motion contract

- **Lenis** (`duration: 1.2`, `wheelMultiplier: 0.9`) drives scrolling; GSAP `ScrollTrigger.update` is bound to it.
- **Entrance:** `ScrollTrigger` at `start: 'top 75%'` (`'top 85%'` for stat/grid rows), `toggleActions: 'play none none reverse'`, `y: 40–70, opacity: 0`, `ease: 'power3.out'`, `stagger: 0.08–0.12`.
- **Hero:** masked line reveal — wrap each line in `overflow-hidden`, animate the inner span `yPercent: 120` with `ease: 'power4.out'`, stagger `0.08`.
- **Scrubbed:** `scrub: true` for parallax, `scrub: 0.4–1` for path-draw and long tracks.
- **Standard easings:** `power4.out` (entrances), `power3.out` (secondary), `power4.inOut` (masks/curtains), `elastic.out(1, 0.4)` (magnetic release), CSS `cubic-bezier(0.16, 1, 0.3, 1)` (hover choreography).
- **Hover:** `hover:scale-105` on CTAs, `active:scale-95`, `transition-all`. Cards lift via `TiltCard`, not custom transforms.
- Full copy-paste recipes: `references/motion-recipes.md`.

---

## 7. Component vocabulary

Exact class strings for CTAs, cards, stat rows, form fields, list rows, marquee and footer live in `references/component-recipes.md`. Reach for the shared primitives first:

| Need | Use |
| --- | --- |
| 3D tilt on a card/image | `TiltCard` + `data-tilt-depth="6|14|18|22|24"` on children |
| Kinetic heading with badge + gradient line | `AnimatedHeading` (`display`, `badge`, `gradientText`, `scrollTrigger`) |
| Interactive dotted background | `SquareParticleField` (`gridSpacing={22} interactionRadius={145} redRatio={0.06}`) |
| Lightweight reveal without GSAP | `useReveal` + `revealBase/revealHidden/revealShown/staggerDelay` from `src/features/about/useReveal.ts` |
| Icons | `lucide-react` at `w-3.5 h-3.5` (inline), `w-4 h-4` (buttons), `w-5 h-5` (tiles) |

---

## 8. Content voice

Firefighter-owned, disciplined, Texas. Concrete operational nouns over adjectives — "Station 1 dispatch", "26ft air-ride fleet", "climate vault storage", "written estimate guarantee". Stats read as `20+`, `50,000+`, `99.4%`, `100%` with a bold label and a one-line qualifier. Section kickers are shouted mono (`TEXAS BASED. NATIONWIDE DISPATCH.`). Phone is `(972) 539-9588`; HQ is Lewisville, TX; founded 2004.

---

## 9. Do not

- Introduce a new accent hue, a new font, or a raw `text-7xl font-black` heading.
- Use `slate-*` on a marketing page, or `neutral-*`/`#0c0c0c` on a console screen.
- Animate without `gsap.context` cleanup, or leave a ScrollTrigger unkilled on unmount.
- Nest a second `SmoothScrollProvider`, or add a preloader to an inner page.
- Exceed 150 lines in a `src/routes/*.tsx` file.
- Ship a section with no reduced-motion path, or an icon-only button with no `aria-label`.

---

## 10. Before you finish

- [ ] `npm run lint` passes.
- [ ] Page renders at 375px, 768px, 1440px with no horizontal scroll.
- [ ] Only red/black/white/grey appear in the diff.
- [ ] Every heading carries a `display-heading--*` modifier.
- [ ] Every GSAP effect reverts on unmount.
- [ ] Reduced-motion: content is visible and static, nothing stays at `opacity: 0`.
- [ ] Route file is an orchestrator under 150 lines; sections live under `src/features/`.

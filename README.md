# 🚒 Firehouse Movers — Frontend Application

> High-performance, agency-grade React + TypeScript application for **Firehouse Movers Inc.** Built with Next.js 16 (Turbopack), Tailwind CSS v4, Three.js 3D WebGL, and GSAP scroll-driven animation architecture.

---

## 🌟 Overview

Firehouse Movers is a firefighter-owned and operated moving company founded in Lewisville, Texas in 2004. This frontend application represents a complete redesign combining cinematic storytelling, interactive 3D engineering models, museum-grade packaging protocol animations, and smooth physics-driven motion with enterprise operational tools.

---

## 🚀 Key Features & Interactive Sections

### 1. Landing Page (`/` or `/landing`)
- **Agency-Grade Dispatch Preloader**: Initial telemetry bootloader with animated progress counter and audio-visual cues.
- **Hero & Command Staging**: High-contrast headline typography in Aeonik font, interactive CTAs, and instant estimate drawer.
- **Interactive Particle Crew Avatars (`ClientWhoWeAreSection`)**:
  - Interactive canvas avatars of Operations, Sales, and Crew Leads.
  - Cursor-repelling physics, smooth magnetic settling, and role-based inspect tooltips.
- **Services Corridor (`HamzaServicesSection`)**:
  - 3D perspective tilt cards with real-time cursor glare.
  - Multi-layer asphalt spline road with an animated Firehouse pickup truck driving along the curve tangent on scroll.
- **Hybrid Dispatch Workflow (`HybridHowItWorksSection`)**:
  - Seamless 4-step moving timeline merging client reference standards with modern editorial design.
- **Move Wavelength Journey (`MoveJourneyPinnedScroll`)**:
  - Pinned scroll-driven dispatch timeline with live telemetry feeds and checkpoint verification.
- **Written Guarantees (`ClientGuaranteesSection`)**:
  - Three contractual promises with 3D tilt interaction.
  - Custom top-right to bottom-left asphalt road ribbon with tangent vehicle orientation correction (`scale(1, -1)` for leftward travel).
- **Museum-Grade Packaging Protocol (`ClientPackagingSection`)**:
  - 5-stage scroll-driven photographic packaging sequence:
    1. **Stage 01**: Fragile Ceramic Vase Assessment (exposed surface).
    2. **Stage 02**: Zero-Scratch Kraft Paper Wrap (anti-abrasive barrier).
    3. **Stage 03**: Multi-Layer Bubble Cushioning (99.4% transit shock isolation).
    4. **Stage 04**: Cushioned Box Packing (corrugated double-wall nest).
    5. **Stage 05**: Box Flaps Closed & H-Tape Sealed (commercial H-pattern transit lock).
  - Dynamic telemetry cards with live specifications, impact protection meter, and manual stage tabs.
- **Client Testimonials (`TestimonialsSection`)**: Verified customer reviews from Texas families and commercial clients.
- **Interactive Particle Contact & Calculator (`MvpContactSection`)**: Lusion-style interactive particle scatter canvas with real-time moving estimate calculator.

---

### 2. About Dossier (`/about`)
- **Dossier Header (`AboutHero`)**: Company heritage, North Texas station facts, and corporate profile.
- **Sticky Section Rail (`AboutSectionNav`)**: Real-time scroll-spy reading progress bar and sliding pill navigation.
- **The Highway Corridor (`AboutRoadTrackSection`)**:
  - 3D converging perspective road grid with hardware-accelerated forward motion.
  - Multi-phase milestone sequence: approach from depth, settle in focal view, and pass overhead.
- **Fleet & Sister Partners (`AboutFleetPartnersSection`)**: Certified integrations with Ford Pro Fleet Telematics and 4 Alarm Restoration.
- **Interactive 3D Truck Model (`MvpScrollDriven3DTruck`)**:
  - Real-time Three.js WebGL 26ft commercial moving truck.
  - Scroll-driven 180° rotation timeline with procedural particle embers.
  - Interactive **360° Free-Orbit Inspection Mode** with OrbitControls damping.
- **Heritage Timeline (`AboutTimeline`)**:
  - Dual-mode timeline (horizontal pinned coverflow on desktop, swipeable snap carousel on mobile/touch).
  - Background procedural `CodeRainField` digital matrix canvas.
- **Recruitment & Career CTA (`AboutJoinTeamCta`)**: Dedicated firefighter and professional mover career application gateway.

---

### 3. Operational & Portal Suite
- **/dispatch**: Real-time crew dispatching, truck assignment, and route telemetry.
- **/tracking**: Live client move GPS telemetry and route timeline.
- **/estimate-calculator**: Comprehensive cubic-footage volume estimator and pricing engine.
- **/customer/dashboard**: Client portal for active move documentation, inventory lists, and billing.
- **/fleetio-\***: Enterprise fleet management integration suites (vehicles, fuel logs, service reminders, parts, work orders, inspections).
- **/resources-training**: Crew training modules, heavy-lift biomechanics, and safety protocols.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Framework** | [Next.js 16 (Turbopack)](https://nextjs.org/) (App Router, Server & Client Components) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) (Strict mode, zero `any`) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/), PostCSS, CSS Custom Properties |
| **3D & WebGL** | [Three.js](https://threejs.org/), GLTFLoader, DRACOLoader, OrbitControls |
| **Animation** | [GSAP 3](https://greensock.com/gsap/) (ScrollTrigger, SplitText) |
| **Smooth Scroll** | [Lenis](https://lenis.darkroom.engineering/) (Inertial physics & GSAP ticker sync) |
| **State & API** | [TanStack React Query v5](https://tanstack.com/query/latest), Axios, Django REST API backend |
| **Forms** | [React Hook Form](https://react-hook-form.com/), [Zod](https://zod.dev/) validation |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Typography** | Aeonik Display Headings, Inter Sans, JetBrains Mono |

---

## ⚙️ Getting Started

### Prerequisites
- **Node.js**: v18.18.0 or newer (v20+ recommended)
- **Package Manager**: `npm` (included with Node.js)

### Installation

1. Clone the repository and navigate to the project directory:
   ```bash
   cd FrontendFirehouse
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables (create `.env.local` if needed):
   ```env
   NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
   ```

---

## 💻 Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the development server with Next.js Turbopack at [http://localhost:3000](http://localhost:3000) |
| `npm run build` | Compiles an optimized production build using Next.js Turbopack |
| `npm run start` | Serves the production build locally |
| `npm run lint` | Runs ESLint across the codebase |
| `npx tsc --noEmit` | Performs full static type checking across all TypeScript files |

---

## 📁 Project Architecture

```text
FrontendFirehouse/
├── public/
│   ├── images/
│   │   ├── packaging/            # 5-step photographic packaging sequence
│   │   ├── firehouse_pickup_truck.png
│   │   └── ...                   # Static photo assets
│   ├── models/
│   │   └── truck_trailer.glb     # 3D commercial moving truck GLTF model
│   └── ...
├── src/
│   ├── app/                      # Next.js App Router (pages, layout, global providers)
│   │   ├── layout.tsx            # Global layout shell, metadata, and fonts
│   │   ├── page.tsx              # Root entry route
│   │   ├── landing/              # Landing page route
│   │   ├── about/                # About page route
│   │   └── ...                   # Operational portal routes
│   ├── components/               # Domain-neutral reusable UI primitives
│   │   ├── AnimatedHeading.tsx   # Word/character split typography reveals
│   │   ├── CodeRainField.tsx     # Monospace glyph matrix background
│   │   ├── CustomCursor.tsx      # Smooth trailing cursor dot
│   │   ├── Navbar.tsx            # Global navigation bar with route dropdowns
│   │   ├── ScrollPageTransition.tsx # 5-pillar red panel page transition
│   │   ├── TextReveal.tsx        # GSAP SplitText character & wave reveals
│   │   └── TiltCard.tsx          # 3D perspective hover card with cursor glare
│   ├── features/                 # Domain-specific modules
│   │   ├── about/                # About page sections (Hero, Timeline, Track)
│   │   ├── journey/              # Move wavelength pinned scroll journey
│   │   └── landing/              # Landing page sections:
│   │       ├── ClientPackagingSection.tsx  # Museum-grade 5-stage packaging sequence
│   │       ├── ClientGuaranteesSection.tsx # 3D guarantees with top-right to bottom-left road
│   │       ├── HamzaServicesSection.tsx    # Services corridor with asphalt spline
│   │       ├── MvpScrollDriven3DTruck.tsx  # Three.js 3D truck viewer
│   │       └── SmoothScrollProvider.tsx    # Lenis smooth scrolling orchestrator
│   ├── routes/                   # Route container orchestrators (strictly < 150 lines)
│   │   ├── AboutPage.tsx
│   │   └── LandingPage.tsx
│   ├── context/                  # Global React contexts (AuthContext, etc.)
│   └── index.css                 # Tailwind CSS v4 styling & theme tokens
├── AGENTS.md                     # Agent development rules & DRY architecture mandates
└── package.json
```

---

## 🛡️ Architecture & Quality Mandates

- **Page File Size Limit**: All top-level page views in `src/routes/` are strictly kept minimal and **under 150 lines**, delegating UI complexity to dedicated feature modules in `src/features/`.
- **Component Reuse & DRY Architecture**: High-frequency components (e.g. `TiltCard`, `TextReveal`, `AnimatedHeading`) are shared across sections to avoid code duplication.
- **Hardware-Accelerated Motion**:
  - GSAP ScrollTrigger tweens use `force3D: true` and `will-change: transform`.
  - Elements animated by GSAP avoid `transition-all` to prevent browser transition fighting.
  - Three.js WebGL canvas and canvas particles employ `IntersectionObserver` visibility culling to ensure zero GPU drain when scrolled out of view.
- **Accessibility & Motion Preference**: Honors `prefers-reduced-motion` across all GSAP timelines, Lenis scrolling, Three.js animations, and interactive particle fields.

---

## 📄 License

Proprietary and Confidential — Built for Firehouse Movers Inc. All rights reserved.

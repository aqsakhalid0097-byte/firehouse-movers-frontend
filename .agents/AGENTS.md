# Firehouse Movers — Frontend Agent Rules & Best Practices

> **Scope:** React + TypeScript single page application (`firehouse-movers-frontend`).
> **Goal:** Build modular, performant, and visually stunning frontend interfaces that interface cleanly with the Django REST API backend.

---

## 🚨 CRITICAL MANDATE: Component Reuse & DRY Architecture

Before creating ANY new component or writing custom UI markup for a feature:
1. **Always Audit Existing Components**: Thoroughly inspect `src/components/`, `src/routes/`, and existing feature modules for already available UI components or elements.
2. **Reuse Completely or Partially**:
   - If an existing component can satisfy the requirement directly, use it.
   - If an existing component satisfies the core requirement with minor extensions (e.g. adding a variant, size, or optional prop), extend the existing component rather than duplicating logic.
3. **Strict Creation Threshold**: Create a separate, new component **ONLY IF** there is no existing component that can be reused completely or adapted cleanly through composition/props.

---

## 1. Project Architecture & File Organization

Organize code by domain and responsibility:

```text
src/
  api/          # API fetch client, base types, auth & CSRF helpers
  app/          # Global application shell, router, and context providers
  components/   # Domain-neutral UI primitives (Button, Card, Badge, Modal, Input)
  routes/       # Top-level page views (DispatchPage, PeoplePage, QuotesPage)
  features/     # Domain-specific modules (dispatch/, inventory/, quotes/)
  assets/       # Static branding, SVGs, and images
  index.css     # Tailwind CSS imports & global theme variables
```

- **Keep UI Primitives Pure**: Components in `src/components/` must be domain-agnostic and reusable.
- **Isolate Side-Effects**: Keep data-fetching logic inside custom React Query hooks or feature-specific containers.

---

## 2. React & TypeScript Standards

- **Page File Size Limit (Strict Max 150 Lines)**:
  - For every new React page view (in `src/routes/`), code in the main `.tsx` file must be kept minimal and **strictly under 150 lines**.
  - Decompose all UI sections, forms, tables, and complex views into dedicated, reusable subcomponents housed within `src/features/<domain>/` or `src/components/`.
  - Main page route files must act purely as clean orchestrators/containers assembling feature components, layout shells, and custom hooks.
- **Functional Components**: Use arrow functions or function declarations with explicit prop types.
- **Strict Typing**:
  - Never use `any`. Define strong TypeScript interfaces or Zod schemas for all data models.
  - Export reusable interfaces (e.g. `Job`, `StaffMember`, `QuoteRequest`) from dedicated type files.
- **React 19 Compatibility**:
  - Prefer modern hooks (`useActionState`, `useOptimistic`, `useId`) where applicable.
  - Avoid deprecated lifecycle patterns or `defaultProps` on functional components.

---

## 3. Styling & UI Design System

- **Tailwind CSS v4**: Use utility classes for styling. Use CSS custom properties in `src/index.css` for design system tokens.
- **Design Aesthetics**:
  - **Palette**: Dark slate theme (`bg-slate-950`, `bg-slate-900`) with vibrant accents (Firehouse Red `#ef4444`, Orange `#f97316`, Emerald `#10b981`, Sky `#0ea5e9`).
  - **Typography**: Inter / system sans-serif font family with clean hierarchy (`text-2xl`, `text-lg`, `text-xs`).
  - **Elevation & Depth**: Glassmorphism (`backdrop-blur-md`), subtle borders (`border-slate-800/80`), and refined box shadows (`shadow-xl`).
- **Responsive Layouts**:
  - Design for all screen sizes using responsive utility prefixes (`sm:`, `md:`, `lg:`, `xl:`).
  - Ensure interactive elements are touch-friendly and keyboard-accessible.

---

## 4. State Management & API Integration

- **Server State**:
  - Use **TanStack Query** (`useQuery`, `useMutation`) for remote data fetching, caching, and cache invalidation.
  - Do not copy server state into local React `useState` unless editing or transforming locally.
- **Form Management**:
  - Use **React Hook Form** combined with **Zod** schema validation via `@hookform/resolvers/zod`.
  - Display clear, inline validation messages on form inputs.
- **Session Auth & CSRF**:
  - Always pass `credentials: "include"` on API calls to send Django session cookies.
  - Pass `X-CSRFToken` in headers for all mutations (`POST`, `PUT`, `PATCH`, `DELETE`).
  - Do **not** store JWTs or sensitive credentials in `localStorage` or `sessionStorage`.

---

## 5. User Experience & Accessibility

- **Loading & Empty States**:
  - Provide skeleton loaders or spinners for async operations.
  - Provide informative, helpful empty states when query results or tables return 0 items.
- **Error Handling**:
  - Map API errors gracefully to user-facing alert banners or field errors.
  - Wrap top-level routes in React Error Boundaries to prevent full app crashes.
- **Accessibility (a11y)**:
  - Include descriptive `aria-label` attributes for icon-only buttons.
  - Ensure color contrast meets WCAG AA standards.

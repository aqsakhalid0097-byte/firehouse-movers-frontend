# Component Recipes

Copy-paste class strings lifted verbatim from the landing page. Change the copy, not the classes.

## Section shell

```tsx
<section
  ref={sectionRef}
  className="py-24 sm:py-32 bg-[#0c0c0c] text-white border-y border-neutral-800/80 relative overflow-hidden"
>
  {/* decorative layer: z-0 */}
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
    {/* content */}
  </div>
</section>
```

## Section header (kicker + display headline + subtext)

```tsx
<div className="space-y-1.5 max-w-2xl">
  <div className="text-red-500 font-bold text-xs uppercase tracking-widest font-mono">
    TEXAS BASED. NATIONWIDE DISPATCH.
  </div>
  <h2 className="display-heading display-heading--section text-white">
    <span className="block">Move anything.</span>
    <span className="block bg-gradient-to-r from-red-600 via-white to-neutral-400 bg-clip-text text-transparent animate-gradient-text">
      We&apos;ll handle the rest.
    </span>
  </h2>
  <p className="text-neutral-400 text-xs sm:text-[13px] pt-0.5 leading-relaxed">
    One-line qualifier.
  </p>
</div>
```

Document-style alternative (About register): use `AboutSectionHeader` — mono index, `display-heading--dossier`, self-drawing hairline rule.

## Buttons

Primary CTA (large):

```
inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-red-600 to-red-700
hover:from-red-500 hover:to-red-600 text-white font-bold text-xs sm:text-sm
shadow-xl shadow-red-600/40 cursor-pointer border border-red-500/50
transition-all hover:scale-105 active:scale-95
```

Primary CTA (pill, in a header row):

```
inline-flex items-center gap-2 px-4 py-2 sm:py-2.5 rounded-full bg-gradient-to-r from-red-600 to-red-700
hover:from-red-500 hover:to-red-600 text-white font-bold text-xs sm:text-[13px]
transition-all shadow-md shadow-red-600/30 hover:scale-105 shrink-0
```

Secondary / ghost:

```
inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-neutral-900/90 hover:bg-neutral-800
border border-neutral-700 text-gray-200 hover:text-white font-semibold text-xs sm:text-sm
backdrop-blur-md transition-all cursor-pointer hover:border-neutral-500
```

Tertiary link-button (About register):

```
group inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-red-600 hover:bg-red-500
text-white font-bold text-sm transition-all duration-200 hover:-translate-y-0.5 cursor-pointer
```

Full-width form submit:

```
w-full py-4 px-6 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600
text-white font-bold text-sm rounded-xl shadow-xl shadow-red-600/30
flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.01]
```

Every CTA carries an arrow: `<ArrowRight className="w-3.5 h-3.5" />`.

## Panel / card

```tsx
<TiltCard className="h-full rounded-2xl" maxTilt={6.5} perspective={1100} scale={1.018} delayMs={1200}>
  <div className="h-full flex flex-col justify-between bg-[#121212] border border-neutral-800/90 rounded-2xl p-4 sm:p-5 shadow-xl space-y-3">
    <div data-tilt-depth="6" className="relative aspect-[16/7.8] w-full rounded-xl overflow-hidden bg-neutral-900 shrink-0">
      <img src="/images/local.jpg" alt="" className="w-full h-full object-cover object-center" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
      <div data-tilt-depth="24" className="absolute top-3 left-3">
        <span className="px-2.5 py-1 bg-red-600 text-white font-mono text-[10px] font-bold rounded-md shadow-md tracking-wider uppercase inline-block">
          SERVICE 01
        </span>
      </div>
    </div>
    <div data-tilt-depth="14">
      <h3 className="text-base sm:text-lg lg:text-xl font-black text-white tracking-tight">Title</h3>
      <p className="text-xs text-neutral-400 leading-snug mt-0.5">Description.</p>
    </div>
  </div>
</TiltCard>
```

`data-tilt-depth` scale: image `6`, headline block `14`, feature list `18`, CTA `22`, floating badge `24`.

## Image with caption plate

```tsx
<div className="relative rounded-3xl overflow-hidden border border-neutral-700/80 shadow-2xl bg-neutral-900 group">
  <img src="/images/firehouse_station.jpeg" alt="" data-tilt-depth="6"
       className="w-full h-[400px] sm:h-[480px] object-cover object-center" />
  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
  <div data-tilt-depth="22"
       className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-black/80 backdrop-blur-md border border-neutral-700 shadow-xl">
    <div className="text-red-400 text-xs font-bold uppercase tracking-wider mb-0.5">Lewisville, TX • Station 1</div>
    <div className="text-white font-black text-sm sm:text-base">Caption headline</div>
  </div>
</div>
```

## Feature bullets

```tsx
<div className="flex items-center gap-2.5">
  <CheckCircle2 className="w-4 h-4 text-red-500 shrink-0" />
  <span className="text-sm text-gray-300">Zero temporary day labor policy</span>
</div>
```

## Stat grid

```tsx
<div className="grid grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12 pt-20 mt-20 border-t border-neutral-800/80">
  <div className="flex flex-col items-center text-center group cursor-default">
    <div className="text-4xl sm:text-5xl lg:text-6xl font-black text-red-500 font-sans tracking-tight
                    drop-shadow-[0_0_20px_rgba(239,68,68,0.35)] group-hover:scale-105 transition-transform duration-300">
      <span ref={yearsRef}>20+</span>
    </div>
    <div className="text-sm sm:text-base font-bold text-white mt-2 group-hover:text-red-400 transition-colors">
      Years in Service
    </div>
    <div className="text-xs text-gray-400 mt-0.5">Continuous Texas Operations</div>
  </div>
</div>
```

Numerals count up via a GSAP tween on a plain object — see `references/motion-recipes.md`.

## Selectable list row (master/detail)

```tsx
<div
  onMouseEnter={() => select(item)}
  className={`service-item h-[56px] sm:h-[62px] px-3.5 sm:px-4 rounded-xl border transition-all duration-200
    cursor-pointer flex items-center justify-between group relative overflow-hidden ${
    isActive
      ? 'bg-[#151515] border-red-500/80 shadow-sm'
      : 'bg-[#0f0f0f] border-neutral-800/80 hover:border-neutral-700 hover:bg-[#131313]'
  }`}
>
  {isActive && (
    <div className="absolute bottom-0 left-4 w-12 h-[2px] bg-red-500 rounded-full origin-left animate-[indicator-grow_0.4s_ease-out]" />
  )}
  <span className={`service-number font-mono text-sm sm:text-base font-bold shrink-0 transition-colors ${
    isActive ? 'text-red-500' : 'text-neutral-500 group-hover:text-neutral-200'}`}>01</span>
  {/* title wrapper + arrow wrapper */}
</div>
```

The `service-*` class names are not decoration — `src/index.css` hangs the whole rolling-title / arrow-swap hover choreography off them. Keep the structure: `.service-title-wrap` > `.service-title-primary` + `.service-title-duplicate` (aria-hidden), `.service-description`, `.service-arrow-wrap` > `.service-arrow-primary` + `.service-arrow-duplicate`.

## Form field

```tsx
<div className="space-y-1.5">
  <label className="text-xs font-bold text-gray-300">Your Full Name *</label>
  <input
    type="text"
    placeholder="John Doe"
    className="w-full bg-[#101010] border border-neutral-700 rounded-xl px-4 py-3 text-xs sm:text-sm
               text-white placeholder-gray-500 focus:outline-none focus:border-red-500"
  />
</div>
```

Form panel: `bg-[#141414] border border-neutral-700/80 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6`, header row separated by `border-b border-neutral-800 pb-4` with a live-status pill `text-xs text-red-400 font-mono font-semibold` reading `● Live Dispatch`.

## Contact tile

```tsx
<a href="tel:9725399588"
   className="flex items-center gap-3.5 p-4 rounded-2xl bg-[#141414] border border-neutral-800 hover:border-red-500/40 transition-colors">
  <div className="p-3 rounded-xl bg-neutral-900 text-red-400"><Phone className="w-5 h-5" /></div>
  <div>
    <div className="text-xs text-gray-400 font-mono">Direct Dispatch Line</div>
    <div className="font-bold text-white text-base">(972) 539-9588</div>
  </div>
</a>
```

## Ambient glow

```tsx
<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px]
                bg-red-600/10 rounded-full blur-[180px] pointer-events-none z-[1]" />
```

## Marquee strip

```tsx
<section className="py-8 sm:py-10 bg-black border-y border-neutral-900/80 overflow-hidden relative select-none">
  <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
    <div ref={trackRef} className="flex items-center gap-14 sm:gap-20 lg:gap-28 whitespace-nowrap w-max">
      {[...items, ...items, ...items, ...items].map(...)}
    </div>
  </div>
</section>
```

Duplicate the array 4× and tween `xPercent: -50` so the loop is seamless.

## Fact strip (About register)

```tsx
<dl className="divide-y divide-neutral-800/80 border-y border-neutral-800/80">
  <div className="relative flex items-baseline justify-between gap-6 py-3 px-1 group overflow-hidden">
    <span aria-hidden className="absolute inset-0 bg-neutral-900/50 origin-left scale-x-0
                                 group-hover:scale-x-100 transition-transform duration-300 ease-out" />
    <dt className="relative text-[11px] font-mono uppercase tracking-widest text-neutral-500
                   group-hover:text-red-400 transition-colors duration-200">Founded</dt>
    <dd className="relative text-sm sm:text-base font-bold text-white text-right">2004</dd>
  </div>
</dl>
```

## Footer & back-to-top

Reuse `LandingFooter` and `MvpBackToTop` as-is. Do not fork them.

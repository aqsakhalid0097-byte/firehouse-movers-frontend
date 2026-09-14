'use client';

import React, { useEffect, useRef, useState } from 'react';

/**
 * A trail of soft white "dust" left behind the cursor, plus a
 * smoke-like puff kicked up on click. Purely decorative (pointer-events:
 * none), painted on a full-viewport canvas that sits just beneath the
 * CustomCursor dot/ring so the cursor itself always reads on top of its
 * own trail.
 *
 * Two things worth knowing about the shape of this:
 *
 *  - The marks are drawn *light* and composited with `screen` blending.
 *    On this site's near-black surfaces, a dark mark would be invisible;
 *    a light mark reads as glowing dust/smoke instead.
 *
 *  - The fade is two terms: a fixed amount per frame, plus a term
 *    proportional to distance travelled that frame. The fixed term alone
 *    would make the trail's on-screen length scale with pointer speed
 *    (fast movement outruns the fade); the distance term keeps the
 *    trail's length roughly constant in *space* instead, whatever speed
 *    the pointer is moving at.
 *
 * Gated exactly like CustomCursor: disabled on touch and under
 * prefers-reduced-motion, and the animation loop stops itself once the
 * canvas has faded back to empty, so an idle cursor costs zero frames.
 */

/** Half the distance between the two trail lines, in CSS px. */
const GAUGE = 10;
/** Movement below this in a frame is jitter, not travel. */
const MIN_STEP = 0.7;
/** Speed (px/frame) at which the trail's width/brightness top out. */
const FULL_SPEED = 22;
/** Base per-frame fade, plus a distance-proportional term so the
 *  trail's on-screen length stays roughly constant at any speed. */
const FADE_BASE = 0.026;
const FADE_PER_PX = 0.0021;
/** Frames the loop keeps running after the last mark, to fade it out. */
const FADE_FRAMES = 78;

type Puff = { x: number; y: number; vx: number; vy: number; r: number; life: number };

export const CursorTrail: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isEnabled, setIsEnabled] = useState(false);

  // Decide up front whether a "real" pointer is present - same gating as
  // CustomCursor, so the two always agree. This can't live in the effect
  // below: that effect needs canvasRef.current to already be mounted, but
  // flipping isEnabled from false to true is itself what mounts the
  // <canvas> - setting state doesn't make the ref available until after
  // the resulting re-render commits.
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isTouch =
      window.matchMedia('(pointer: coarse)').matches ||
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0;

    setIsEnabled(!prefersReducedMotion && !isTouch);
  }, []);

  // Runs only once isEnabled is true and the <canvas> below has actually
  // mounted, so canvasRef.current is guaranteed to be real here.
  useEffect(() => {
    if (!isEnabled) return;

    const el = canvasRef.current;
    if (!el) return;
    const ctx = el.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      el.width = Math.max(1, window.innerWidth);
      el.height = Math.max(1, window.innerHeight);
      ctx.lineCap = 'butt';
    };
    resize();

    // Pointer position, last position a mark was drawn from, and the
    // unit direction of that last mark.
    let px = -200;
    let py = -200;
    let lx = px;
    let ly = py;
    let dirX = 0;
    let dirY = 0;
    let travelled = 0;
    let seeded = false;
    let alive = 0;
    let raf = 0;
    const puffs: Puff[] = [];

    const onMove = (e: MouseEvent) => {
      px = e.clientX;
      py = e.clientY;
      if (!seeded) {
        // First sighting of the pointer: adopt its position without
        // drawing, or a line gets struck across the page from -200,-200.
        lx = px;
        ly = py;
        seeded = true;
      }
      wake();
    };

    const onDown = (e: MouseEvent) => {
      for (let i = 0; i < 14; i += 1) {
        const a = Math.random() * Math.PI * 2;
        const s = 0.8 + Math.random() * 3.4;
        puffs.push({
          x: e.clientX,
          y: e.clientY,
          vx: Math.cos(a) * s,
          vy: Math.sin(a) * s,
          r: 2 + Math.random() * 4,
          life: 1,
        });
      }
      wake();
    };

    // Marks already down are still fading, so the loop is not stopped
    // here - only the seed is dropped, so re-entering elsewhere does
    // not draw a line across to it.
    const onLeave = () => {
      seeded = false;
    };

    function wake() {
      alive = FADE_FRAMES;
      if (!raf) raf = requestAnimationFrame(tick);
    }

    function stroke(a: number, width: number, dashed: boolean) {
      ctx!.strokeStyle = `rgba(255, 255, 255, ${a})`;
      ctx!.lineWidth = width;
      if (dashed) {
        // Rungs anchored to distance travelled, not time or segment
        // index - that is what makes them sit still on the page as the
        // trail extends, instead of crawling along its own length.
        ctx!.setLineDash([2, 5.5]);
        ctx!.lineDashOffset = -travelled;
      } else {
        ctx!.setLineDash([]);
      }
      ctx!.stroke();
    }

    function tick() {
      const dx = px - lx;
      const dy = py - ly;
      const step = Math.hypot(dx, dy);

      // Fade the whole surface by removing alpha rather than painting
      // black over it - the canvas is transparent and sits above the
      // page, so painting would leave a grey film across everything.
      ctx!.globalCompositeOperation = 'destination-out';
      ctx!.fillStyle = `rgba(0, 0, 0, ${Math.min(FADE_BASE + step * FADE_PER_PX, 0.4)})`;
      ctx!.fillRect(0, 0, el!.width, el!.height);
      ctx!.globalCompositeOperation = 'source-over';

      if (seeded && step > MIN_STEP) {
        const nx = dx / step;
        const ny = dy / step;
        // 0 when carrying straight on, up to 2 when doubling back.
        const turn = dirX || dirY ? 1 - (nx * dirX + ny * dirY) : 0;
        const speed = Math.min(step / FULL_SPEED, 1);
        // A fast, sharp change of direction reads as a skid: the trail
        // stops printing a clean tread and starts smearing instead.
        const skid = Math.min(turn * speed * 1.6, 1);

        travelled += step;

        const ox = -ny * GAUGE;
        const oy = nx * GAUGE;
        ctx!.beginPath();
        ctx!.moveTo(lx + ox, ly + oy);
        ctx!.lineTo(px + ox, py + oy);
        ctx!.moveTo(lx - ox, ly - oy);
        ctx!.lineTo(px - ox, py - oy);

        stroke(0.14 + speed * 0.16, 4 + speed * 3, true);
        if (skid > 0.05) stroke(0.16 * skid, 6 + skid * 6, false);

        lx = px;
        ly = py;
        dirX = nx;
        dirY = ny;
        alive = FADE_FRAMES;
      }

      for (let i = puffs.length - 1; i >= 0; i -= 1) {
        const p = puffs[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.9;
        p.vy *= 0.9;
        p.r += 0.55;
        p.life -= 0.032;
        if (p.life <= 0) {
          puffs.splice(i, 1);
          continue;
        }
        const g = ctx!.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
        g.addColorStop(0, `rgba(255, 255, 255, ${0.2 * p.life})`);
        g.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx!.fillStyle = g;
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx!.fill();
        alive = FADE_FRAMES;
      }

      alive -= 1;
      if (alive <= 0) {
        // Nothing left to fade. Clear the last near-invisible residue
        // and give the frame budget back until the pointer moves again.
        ctx!.clearRect(0, 0, el!.width, el!.height);
        raf = 0;
        return;
      }
      raf = requestAnimationFrame(tick);
    }

    // A tab that starts (or is briefly) hidden can report a zero-size
    // viewport, which would leave the canvas permanently stuck at 1x1
    // since a plain 'resize' event never fires just from becoming
    // visible again. Re-measuring on visibilitychange recovers from that.
    const onVisible = () => {
      if (!document.hidden) resize();
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mousedown', onDown, { passive: true });
    window.addEventListener('resize', resize, { passive: true });
    document.addEventListener('visibilitychange', onVisible);
    document.documentElement.addEventListener('mouseleave', onLeave);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVisible);
      document.documentElement.removeEventListener('mouseleave', onLeave);
    };
  }, [isEnabled]);

  // Rendered only once enabled, mirroring CustomCursor's own lifecycle -
  // both are purely decorative client-only overlays, so there is no SSR
  // content for a delayed mount to mismatch.
  if (!isEnabled) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 z-[99997] pointer-events-none"
      style={{ mixBlendMode: 'screen' }}
    />
  );
};

export default CursorTrail;

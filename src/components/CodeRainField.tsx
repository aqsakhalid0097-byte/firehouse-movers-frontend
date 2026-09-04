'use client';

import React, { useEffect, useRef } from 'react';

export interface CodeRainFieldProps {
  className?: string;
  /** Width/height of each glyph cell in px (default 18). */
  cellSize?: number;
  /** Fraction of columns rendered as the red accent stream (default 0.08). */
  redRatio?: number;
  /** Opacity of the whole canvas layer (default 0.5). */
  opacity?: number;
  /** Fade the top/bottom edges into the section so it doesn't hard-cut. */
  fadeEdges?: boolean;
}

const CHARSET = '01#+-/=ABCDEFGHIJKLMNOPQRSTUVWXYZ';

interface RainState {
  cols: number;
  rows: number;
  cell: number;
  chars: string[];
  headPos: number[];
  headSpeed: number[];
  isRed: boolean[];
}

/**
 * Decorative "digital rain" background — columns of monospace glyphs that
 * continuously reroll and drift down a faint trailing head. Purely
 * ornamental (aria-hidden, pointer-events-none) and freezes to a single
 * static frame under prefers-reduced-motion.
 */
export const CodeRainField: React.FC<CodeRainFieldProps> = ({
  className = '',
  cellSize = 18,
  redRatio = 0.08,
  opacity = 0.5,
  fadeEdges = true,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const stateRef = useRef<RainState | null>(null);
  const rafRef = useRef<number | null>(null);
  const visibleRef = useRef(true);
  const lastStepRef = useRef(0);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    let width = 0;
    let height = 0;

    const randomChar = () => CHARSET[(Math.random() * CHARSET.length) | 0];

    const build = () => {
      const rect = container.getBoundingClientRect();
      width = Math.max(1, Math.round(rect.width));
      height = Math.max(1, Math.round(rect.height));
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Resolve the app's mono font stack (font-mono utility) from the
      // container itself rather than hard-coding a family name.
      const resolvedFont = window.getComputedStyle(container).fontFamily || 'monospace';
      ctx.font = `${Math.max(9, cellSize - 4)}px ${resolvedFont}`;
      ctx.textBaseline = 'top';

      const cols = Math.max(1, Math.ceil(width / cellSize));
      const rows = Math.max(1, Math.ceil(height / cellSize));

      const chars = new Array<string>(cols * rows);
      for (let i = 0; i < chars.length; i++) chars[i] = randomChar();

      const headPos = new Array<number>(cols);
      const headSpeed = new Array<number>(cols);
      const isRed = new Array<boolean>(cols);
      for (let c = 0; c < cols; c++) {
        headPos[c] = Math.random() * rows;
        headSpeed[c] = 0.12 + Math.random() * 0.22;
        isRed[c] = Math.random() < redRatio;
      }

      stateRef.current = { cols, rows, cell: cellSize, chars, headPos, headSpeed, isRed };
    };

    const drawFrame = () => {
      const s = stateRef.current;
      if (!s) return;
      ctx.clearRect(0, 0, width, height);

      const tailLen = s.rows * 0.6;

      for (let c = 0; c < s.cols; c++) {
        const head = s.headPos[c];
        const red = s.isRed[c];
        const x = c * s.cell;

        for (let r = 0; r < s.rows; r++) {
          let dist = head - r;
          if (dist < 0) dist += s.rows;
          if (dist > tailLen) continue;

          const t = 1 - dist / tailLen;
          const alpha = Math.min(0.85, t * t * 0.9 + 0.04);
          if (alpha <= 0.03) continue;

          const y = r * s.cell;
          const ch = s.chars[r * s.cols + c];

          if (dist < 1.15) {
            ctx.fillStyle = red
              ? `rgba(248,113,113,${Math.min(1, alpha + 0.35)})`
              : `rgba(244,244,245,${Math.min(1, alpha + 0.3)})`;
          } else {
            ctx.fillStyle = red ? `rgba(153,27,27,${alpha})` : `rgba(82,82,82,${alpha})`;
          }
          ctx.fillText(ch, x, y);
        }
      }
    };

    build();
    drawFrame();

    if (reduceMotionQuery.matches) {
      const onResize = () => {
        build();
        drawFrame();
      };
      window.addEventListener('resize', onResize);
      return () => window.removeEventListener('resize', onResize);
    }

    const io = new IntersectionObserver(
      (entries) => {
        visibleRef.current = entries[0]?.isIntersecting ?? true;
      },
      { threshold: 0 }
    );
    io.observe(container);

    const STEP_MS = 90;
    const loop = (now: number) => {
      rafRef.current = requestAnimationFrame(loop);
      if (!visibleRef.current) return;
      if (now - lastStepRef.current < STEP_MS) return;
      lastStepRef.current = now;

      const s = stateRef.current;
      if (!s) return;

      for (let c = 0; c < s.cols; c++) {
        s.headPos[c] += s.headSpeed[c];
        if (s.headPos[c] >= s.rows) s.headPos[c] -= s.rows;
      }

      // Reroll a handful of glyphs each step so the whole field keeps
      // "typing" independent of where each column's head currently is.
      const flickers = Math.max(6, Math.round(s.cols * s.rows * 0.02));
      for (let i = 0; i < flickers; i++) {
        const idx = (Math.random() * s.chars.length) | 0;
        s.chars[idx] = randomChar();
      }

      drawFrame();
    };
    rafRef.current = requestAnimationFrame(loop);

    const onResize = () => build();
    window.addEventListener('resize', onResize);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', onResize);
      io.disconnect();
    };
  }, [cellSize, redRatio]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={`absolute inset-0 pointer-events-none overflow-hidden font-mono ${className}`}
      style={{
        opacity,
        maskImage: fadeEdges
          ? 'linear-gradient(to bottom, transparent 0%, black 10%, black 88%, transparent 100%)'
          : undefined,
        WebkitMaskImage: fadeEdges
          ? 'linear-gradient(to bottom, transparent 0%, black 10%, black 88%, transparent 100%)'
          : undefined,
      }}
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
};

export default CodeRainField;

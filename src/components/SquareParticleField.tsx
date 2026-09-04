'use client';

import React, { useEffect, useRef, useImperativeHandle, forwardRef, useCallback } from 'react';

export interface SquareParticleFieldHandle {
  scatter: (originX?: number, originY?: number) => void;
}

export interface SquareParticleFieldProps {
  className?: string;
  gridSpacing?: number; // Distance between square centers in px (default 24px)
  interactionRadius?: number; // Cursor repulsion radius in px (default 140px)
  redRatio?: number; // Percentage of red accent squares (default 0.06 = 6%)
  onScatterTriggerReady?: (scatterFn: () => void) => void;
}

interface Particle {
  baseX: number;
  baseY: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  wanderAngle: number;
  wanderSpeed: number;
  size: number;
  color: string;
  edgeColor: string;
  highlightColor: string;
  phase: number;
  driftSpeed: number;
  driftRadius: number;
}

export const SquareParticleField = forwardRef<SquareParticleFieldHandle, SquareParticleFieldProps>(
  (
    {
      className = '',
      gridSpacing = 24,
      interactionRadius = 140,
      redRatio = 0.06,
      onScatterTriggerReady,
    },
    ref
  ) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const particlesRef = useRef<Particle[]>([]);
    const mouseRef = useRef<{ x: number; y: number; active: boolean }>({
      x: -9999,
      y: -9999,
      active: false,
    });
    const animFrameRef = useRef<number | null>(null);
    const timeRef = useRef<number>(0);

    // Blast scatter outward from a center point or section center
    const triggerScatter = useCallback((originX?: number, originY?: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const cx = originX !== undefined ? originX : rect.width / 2;
      const cy = originY !== undefined ? originY : rect.height / 2;

      particlesRef.current.forEach((p) => {
        const dx = p.x - cx;
        const dy = p.y - cy;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const angle = Math.atan2(dy, dx) + (Math.random() - 0.5) * 0.75;
        const blastForce = Math.min(42, Math.max(18, 3000 / (dist + 70))) * (0.85 + Math.random() * 0.6);

        p.vx += Math.cos(angle) * blastForce;
        p.vy += Math.sin(angle) * blastForce;
      });
    }, []);

    useImperativeHandle(
      ref,
      () => ({
        scatter: (x, y) => triggerScatter(x, y),
      }),
      [triggerScatter]
    );

    useEffect(() => {
      if (onScatterTriggerReady) {
        onScatterTriggerReady(() => triggerScatter());
      }
    }, [onScatterTriggerReady, triggerScatter]);

    useEffect(() => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;

      const parentSection = container.parentElement || container;
      const ctx = canvas.getContext('2d', { alpha: true });
      if (!ctx) return;

      let width = 0;
      let height = 0;
      let dpr = 1;

      // Color generation for crisp cardboard-box particles
      const getBoxColor = (isRed: boolean) => {
        if (isRed) {
          // A few brand-red "packing tape" boxes scattered through the field
          const alpha = (0.6 + Math.random() * 0.3).toFixed(2);
          return `rgba(239, 68, 68, ${alpha})`;
        }
        // Warm kraft-paper / cardboard brown range
        const hue = 26 + Math.random() * 16; // 26-42: orange-brown to tan
        const sat = 38 + Math.random() * 22; // 38-60%
        const light = 28 + Math.random() * 22; // 28-50%
        const alpha = (0.55 + Math.random() * 0.35).toFixed(2);
        return `hsla(${hue.toFixed(0)}, ${sat.toFixed(0)}%, ${light.toFixed(0)}%, ${alpha})`;
      };

      const getBoxEdgeColor = (isRed: boolean) => {
        if (isRed) {
          const alpha = (0.5 + Math.random() * 0.25).toFixed(2);
          return `rgba(127, 29, 29, ${alpha})`;
        }
        const alpha = (0.4 + Math.random() * 0.3).toFixed(2);
        return `rgba(38, 24, 14, ${alpha})`;
      };

      // Lighter sheen along the top edge, like a flap catching light
      const getBoxHighlightColor = (isRed: boolean) => {
        if (isRed) {
          const alpha = (0.3 + Math.random() * 0.2).toFixed(2);
          return `rgba(252, 165, 165, ${alpha})`;
        }
        const alpha = (0.28 + Math.random() * 0.22).toFixed(2);
        return `rgba(216, 180, 142, ${alpha})`;
      };

      const initParticles = () => {
        const rect = container.getBoundingClientRect();
        width = rect.width;
        height = rect.height;
        dpr = Math.min(window.devicePixelRatio || 1, 2);

        canvas.width = width * dpr;
        canvas.height = height * dpr;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;

        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        const newParticles: Particle[] = [];
        const cols = Math.ceil(width / gridSpacing);
        const rows = Math.ceil(height / gridSpacing);
        const offsetX = (width - cols * gridSpacing) / 2 + gridSpacing / 2;
        const offsetY = (height - rows * gridSpacing) / 2 + gridSpacing / 2;

        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const isRed = Math.random() < redRatio;
            const baseX = offsetX + c * gridSpacing + (Math.random() - 0.5) * 4;
            const baseY = offsetY + r * gridSpacing + (Math.random() - 0.5) * 4;
            const size = isRed ? 7.5 + Math.random() * 2 : 6.5 + Math.random() * 2.5;

            // Free floating drift: each box wanders its own direction, not a uniform rise
            const wanderSpeed = 0.28 + Math.random() * 0.32;
            const wanderAngle = Math.random() * Math.PI * 2;

            newParticles.push({
              baseX,
              baseY,
              x: baseX,
              y: baseY,
              vx: 0,
              vy: 0,
              wanderAngle,
              wanderSpeed,
              size,
              color: getBoxColor(isRed),
              edgeColor: getBoxEdgeColor(isRed),
              highlightColor: getBoxHighlightColor(isRed),
              phase: Math.random() * Math.PI * 2,
              driftSpeed: 0.0022 + Math.random() * 0.0018,
              driftRadius: 5 + Math.random() * 7,
            });
          }
        }

        particlesRef.current = newParticles;
      };

      initParticles();

      // Mouse tracking on parent section for full surface coverage
      const handleMouseMove = (e: MouseEvent) => {
        const rect = canvas.getBoundingClientRect();
        const curX = e.clientX - rect.left;
        const curY = e.clientY - rect.top;

        if (curX >= 0 && curX <= width && curY >= 0 && curY <= height) {
          mouseRef.current.x = curX;
          mouseRef.current.y = curY;
          mouseRef.current.active = true;
        } else {
          mouseRef.current.active = false;
        }
      };

      const handleMouseLeave = () => {
        mouseRef.current.active = false;
        mouseRef.current.x = -9999;
        mouseRef.current.y = -9999;
      };

      const handleCanvasClick = (e: MouseEvent) => {
        const rect = canvas.getBoundingClientRect();
        triggerScatter(e.clientX - rect.left, e.clientY - rect.top);
      };

      const handleResize = () => {
        initParticles();
      };

      window.addEventListener('resize', handleResize);
      parentSection.addEventListener('mousemove', handleMouseMove);
      parentSection.addEventListener('mouseleave', handleMouseLeave);
      canvas.addEventListener('click', handleCanvasClick);

      // Spring physics parameters for fluid recovery
      const springK = 0.042; // Elasticity pulling particle back into its moving stream
      const damping = 0.89; // Velocity damping

      const render = () => {
        timeRef.current += 1;
        const t = timeRef.current;

        ctx.clearRect(0, 0, width, height);

        const mouse = mouseRef.current;
        const particles = particlesRef.current;
        const numParticles = particles.length;

        for (let i = 0; i < numParticles; i++) {
          const p = particles[i];

          // 1. Free organic wander: direction meanders slowly instead of a fixed straight drift
          p.wanderAngle += (Math.random() - 0.5) * 0.01;
          p.baseX += Math.cos(p.wanderAngle) * p.wanderSpeed;
          p.baseY += Math.sin(p.wanderAngle) * p.wanderSpeed;

          // Seamless edge wrapping so the particle field is infinite and continuous
          if (p.baseX < -25) {
            p.baseX += width + 50;
            p.x += width + 50;
          } else if (p.baseX > width + 25) {
            p.baseX -= width + 50;
            p.x -= width + 50;
          }

          if (p.baseY < -25) {
            p.baseY += height + 50;
            p.y += height + 50;
          } else if (p.baseY > height + 25) {
            p.baseY -= height + 50;
            p.y -= height + 50;
          }

          // 2. Continuous organic sinusoidal breathing while traveling
          const idleX = p.baseX + Math.sin(t * p.driftSpeed + p.phase) * p.driftRadius;
          const idleY = p.baseY + Math.cos(t * p.driftSpeed * 0.8 + p.phase * 1.3) * p.driftRadius;

          // 3. Cursor Repulsion / Scatter Interaction (without breaking moving flow)
          if (mouse.active) {
            const dx = p.x - mouse.x;
            const dy = p.y - mouse.y;
            const distSq = dx * dx + dy * dy;
            const radiusSq = interactionRadius * interactionRadius;

            if (distSq < radiusSq && distSq > 0) {
              const dist = Math.sqrt(distSq);
              const normalDist = 1 - dist / interactionRadius; // 1 at center, 0 at outer boundary
              const repulsionForce = normalDist * normalDist * 17.5;

              const angle = Math.atan2(dy, dx);
              p.vx += Math.cos(angle) * repulsionForce;
              p.vy += Math.sin(angle) * repulsionForce;
            }
          }

          // 4. Spring physics restoring particle to its moving baseline
          const returnForceX = (idleX - p.x) * springK;
          const returnForceY = (idleY - p.y) * springK;

          p.vx += returnForceX;
          p.vy += returnForceY;

          // Apply velocity damping
          p.vx *= damping;
          p.vy *= damping;

          // Advance position
          p.x += p.vx;
          p.y += p.vy;

          // 5. Render as a small package box: fill, flap sheen, edge, taped seam
          const boxSize = Math.round(p.size);
          const x0 = Math.round(p.x - p.size / 2);
          const y0 = Math.round(p.y - p.size / 2);

          ctx.fillStyle = p.color;
          ctx.fillRect(x0, y0, boxSize, boxSize);

          // Top-left flap sheen for a pseudo-3D carton read
          ctx.fillStyle = p.highlightColor;
          ctx.fillRect(x0, y0, boxSize, Math.max(1, Math.round(boxSize * 0.3)));

          ctx.strokeStyle = p.edgeColor;
          ctx.lineWidth = 1;
          ctx.strokeRect(x0 + 0.5, y0 + 0.5, boxSize - 1, boxSize - 1);

          // Cross of packing tape sealing the carton
          if (boxSize >= 6) {
            ctx.beginPath();
            ctx.moveTo(x0 + boxSize / 2, y0);
            ctx.lineTo(x0 + boxSize / 2, y0 + boxSize);
            ctx.moveTo(x0, y0 + boxSize / 2);
            ctx.lineTo(x0 + boxSize, y0 + boxSize / 2);
            ctx.stroke();
          }
        }

        animFrameRef.current = requestAnimationFrame(render);
      };

      animFrameRef.current = requestAnimationFrame(render);

      return () => {
        if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
        window.removeEventListener('resize', handleResize);
        parentSection.removeEventListener('mousemove', handleMouseMove);
        parentSection.removeEventListener('mouseleave', handleMouseLeave);
        canvas.removeEventListener('click', handleCanvasClick);
      };
    }, [gridSpacing, interactionRadius, redRatio, triggerScatter]);

    return (
      <div
        ref={containerRef}
        className={`absolute inset-0 w-full h-full pointer-events-auto overflow-hidden ${className}`}
      >
        <canvas ref={canvasRef} className="block w-full h-full cursor-crosshair" />
      </div>
    );
  }
);

SquareParticleField.displayName = 'SquareParticleField';
export default SquareParticleField;

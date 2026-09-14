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
  /**
   * 'uniform' (default) covers the whole surface evenly, as this always
   * has. 'wave' - lusion.co/about's own end-section treatment - piles the
   * field up as a dense, undulating drift banked against the bottom edge
   * and thins out to almost nothing higher up, rather than an even
   * coverage. For this site that reads as a heap of boxes settled at the
   * foot of the section instead of scattered evenly across it.
   */
  distribution?: 'uniform' | 'wave';
}

type ParticleShape = 'dot' | 'square' | 'cross' | 'diamond';

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
  shape: ParticleShape;
  color: string;
  edgeColor: string;
  highlightColor: string;
  phase: number;
  driftSpeed: number;
  driftRadius: number;
  // How far below the local dune surface (waveCrestY at this particle's
  // OWN x) this particular grain naturally rests. Fixed per particle so
  // the graded fill from crest down to fully-packed doesn't collapse onto
  // the bare crest curve at runtime - each grain keeps roughly its own
  // depth in the pile even as the pile's surface shape (evaluated at the
  // particle's current, possibly-drifted x) shifts under it. Unused for
  // the 'uniform' distribution.
  restDepth: number;
}

// Dot and flat square dominate, the way lusion.co/about's own dust mostly
// reads as round or square at a glance; the plus-mark and diamond ride on
// top as a sparser accent rather than an even split.
const pickShape = (): ParticleShape => {
  const r = Math.random();
  if (r < 0.42) return 'dot';
  if (r < 0.8) return 'square';
  if (r < 0.91) return 'cross';
  return 'diamond';
};

// Every particle is exactly the same size regardless of its shape - no
// per-shape, per-particle, or per-depth variation at all.
const PARTICLE_SIZE = 7;
const SHAPE_SIZE: Record<ParticleShape, number> = {
  dot: PARTICLE_SIZE,
  square: PARTICLE_SIZE,
  cross: PARTICLE_SIZE,
  diamond: PARTICLE_SIZE,
};

export const SquareParticleField = forwardRef<SquareParticleFieldHandle, SquareParticleFieldProps>(
  (
    {
      className = '',
      gridSpacing = 24,
      interactionRadius = 140,
      redRatio = 0.06,
      onScatterTriggerReady,
      distribution = 'uniform',
    },
    ref
  ) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const particlesRef = useRef<Particle[]>([]);
    // vx/vy are the cursor's own frame-to-frame travel. Water doesn't just
    // get shoved away from whatever is moving through it - it gets dragged
    // ALONG with it, which is most of what makes a sweep read as parting a
    // liquid rather than as dots fleeing a point. See the advection term in
    // the render loop.
    const mouseRef = useRef<{ x: number; y: number; vx: number; vy: number; active: boolean }>({
      x: -9999,
      y: -9999,
      vx: 0,
      vy: 0,
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

      // A coarse background "current" the wave field's particles ride on
      // top of their own local physics, so a push anywhere in the section
      // eventually reaches particles nowhere near the cursor - the way an
      // actual body of water carries a disturbance across its whole
      // surface, not just the patch a hand is directly touching. Far
      // cheaper than simulating that neighbor-to-neighbor for every
      // particle: one low-resolution velocity grid the cursor deposits
      // into, that spreads by diffusing into its own neighbors each frame,
      // and that every particle samples at its own position. Wave field
      // only - the uniform field doesn't use this.
      const fieldCell = 42;
      let fieldCols = 0;
      let fieldRows = 0;
      let vxField = new Float32Array(0);
      let vyField = new Float32Array(0);
      let vxFieldNext = new Float32Array(0);
      let vyFieldNext = new Float32Array(0);

      // Minimum center-to-center spacing enforced between every pair of
      // nearby wave particles, every frame, regardless of what the cursor
      // push, gravity, or the settle spring are doing to them. Without
      // this, particles pushed together by the cursor can end up drawn
      // right on top of each other - which is the "mushed together" ring
      // that forms right at the edge of a sweep. A cheap spatial hash
      // (particles binned into a SEP_CELL grid via a linked list) keeps
      // the check to each particle's own 3x3 neighborhood instead of
      // comparing every particle against every other one, which would be
      // far too slow to run every frame at this particle count. Pushing
      // overlapping particles apart is also what makes excess material
      // pile up and rise wherever it's being squeezed toward, rather than
      // just compressing into an ever-denser clump - the same way sand
      // mounds up beside a finger dragged through it instead of packing
      // infinitely tight.
      const SEP_CELL = PARTICLE_SIZE + 4.5;
      const minSeparation = SEP_CELL;
      const minSeparationSq = minSeparation * minSeparation;
      let sepCols = 0;
      let sepRows = 0;
      let cellHead = new Int32Array(0);
      let cellNext = new Int32Array(0);

      // Color generation for crisp cardboard-box particles
      const getBoxColor = (isRed: boolean) => {
        if (isRed) {
          // A few brand-red "packing tape" boxes scattered through the field
          const alpha = (0.6 + Math.random() * 0.3).toFixed(2);
          return `rgba(239, 68, 68, ${alpha})`;
        }
        // Plain white, varying only in opacity for a bit of depth - the
        // kraft-paper brown this used to be doesn't read against the
        // reference's white-on-dark dust.
        const alpha = (0.55 + Math.random() * 0.35).toFixed(2);
        return `rgba(255, 255, 255, ${alpha})`;
      };

      const getBoxEdgeColor = (isRed: boolean) => {
        if (isRed) {
          const alpha = (0.5 + Math.random() * 0.25).toFixed(2);
          return `rgba(127, 29, 29, ${alpha})`;
        }
        // A dark, near-black edge so a white box still reads as a defined
        // square against the section's own dark background instead of
        // just bleeding into a soft blob.
        const alpha = (0.4 + Math.random() * 0.3).toFixed(2);
        return `rgba(10, 10, 10, ${alpha})`;
      };

      // Lighter sheen along the top edge, like a flap catching light
      const getBoxHighlightColor = (isRed: boolean) => {
        if (isRed) {
          const alpha = (0.3 + Math.random() * 0.2).toFixed(2);
          return `rgba(252, 165, 165, ${alpha})`;
        }
        const alpha = (0.55 + Math.random() * 0.3).toFixed(2);
        return `rgba(255, 255, 255, ${alpha})`;
      };

      // The undulating drift line the 'wave' distribution banks particles
      // against - three stacked sine terms at falling amplitude/frequency
      // so the crest reads as an organic dune line (a few broad rises with
      // smaller ripples riding on top) rather than one uniform curve
      // repeating across the width. Shared between initParticles (initial
      // placement) and render (the ongoing "sink back to water level"
      // pull), so it has to live above both rather than being local to
      // either one.
      const waveCrestY = (x: number) => {
        const nx = x / Math.max(1, width);
        // Crest sits at 65% down, so the drift occupies roughly the bottom
        // third of the section rather than half of it, and the undulation
        // amplitudes are scaled to suit that shallower band.
        return (
          height * 0.65 +
          Math.sin(nx * Math.PI * 2.3 + 0.4) * height * 0.035 +
          Math.sin(nx * Math.PI * 4.7 + 1.7) * height * 0.018 +
          Math.sin(nx * Math.PI * 9.1 + 3.1) * height * 0.008
        );
      };

      // A 4x4 Bayer (ordered-dither) matrix. Used in place of an
      // independent random coin-flip per grid cell to decide which cells
      // get a particle: a plain per-cell Math.random() skip produces
      // "white noise" - patches that randomly clump together right next
      // to gaps - while an ordered-dither threshold spreads inclusions as
      // evenly as the requested density allows, the same way halftone
      // printing turns a shading gradient into evenly-spaced dots rather
      // than random speckle. That's what gives every particle roughly the
      // same amount of breathing room around it, the way the reference's
      // own dust does, instead of clustering some together while leaving
      // bare patches elsewhere.
      const bayer4 = [
        [0, 8, 2, 10],
        [12, 4, 14, 6],
        [3, 11, 1, 9],
        [15, 7, 13, 5],
      ];

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

        if (distribution === 'wave') {
          fieldCols = Math.max(2, Math.ceil(width / fieldCell) + 1);
          fieldRows = Math.max(2, Math.ceil(height / fieldCell) + 1);
          const cellCount = fieldCols * fieldRows;
          vxField = new Float32Array(cellCount);
          vyField = new Float32Array(cellCount);
          vxFieldNext = new Float32Array(cellCount);
          vyFieldNext = new Float32Array(cellCount);

          sepCols = Math.max(1, Math.ceil(width / SEP_CELL));
          sepRows = Math.max(1, Math.ceil(height / SEP_CELL));
          cellHead = new Int32Array(sepCols * sepRows);
        }

        const newParticles: Particle[] = [];

        // Wider grid for the wave field so each grain keeps visible
        // breathing room around it, the way the reference's own dust does
        // - up close it's still made of small individual particles, but
        // they never touch or crowd into a solid mass.
        const effectiveSpacing = distribution === 'wave' ? 14 : gridSpacing;
        const cols = Math.ceil(width / effectiveSpacing);
        const rows = Math.ceil(height / effectiveSpacing);
        const offsetX = (width - cols * effectiveSpacing) / 2 + effectiveSpacing / 2;
        const offsetY = (height - rows * effectiveSpacing) / 2 + effectiveSpacing / 2;
        // How many px of soft fade the crest line gets, on either side of
        // it, between "essentially never spawns here" and "always does" -
        // narrow, so the fill ramps up to fully dense well within the
        // visible fold instead of only reaching it right at the bottom
        // edge, matching how much of the reference's own dune is visibly
        // packed rather than fading gradually.
        const waveFade = height * 0.07;

        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            // Tight, even jitter - just enough to break the perfect grid
            // look without letting any one cell's particle wander into a
            // neighboring cell's space, which is what keeps the spacing
            // between particles consistent.
            const baseX = offsetX + c * effectiveSpacing + (Math.random() - 0.5) * 3.4;
            const baseY = offsetY + r * effectiveSpacing + (Math.random() - 0.5) * 3.4;

            if (distribution === 'wave') {
              const depth = baseY - waveCrestY(baseX);
              // A thin ambient scatter carries on above the crest (the
              // reference keeps a handful of stray dots well above its own
              // dune line), then the fill ramps up through the fade band
              // and is fully solid well below the crest. densityMultiplier
              // thins the whole gradient out uniformly (a flat ~15% fewer
              // particles everywhere, crest to floor) without disturbing
              // the even dither spacing between the ones that remain.
              const densityMultiplier = 0.85;
              const probability =
                (depth < -waveFade ? 0.004 : Math.max(0.004, Math.min(1, 0.5 + depth / waveFade))) *
                densityMultiplier;
              const ditherThreshold = (bayer4[r % 4][c % 4] + 0.5) / 16;
              if (ditherThreshold >= probability) continue;
            }

            const isRed = Math.random() < redRatio;
            const shape = pickShape();
            // Every particle of a given shape is the same fixed size (see
            // SHAPE_SIZE) - no per-particle or depth-based scaling.
            const size = SHAPE_SIZE[shape];

            // Free floating drift for the uniform field; the wave field's
            // boxes stay pinned to the dune shape they were placed into and
            // only get the gentle sinusoidal "breathing" below, or the
            // whole careful density gradient would dissolve into a uniform
            // scatter again after a few minutes on the page.
            const wanderSpeed = distribution === 'wave' ? 0 : 0.28 + Math.random() * 0.32;
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
              shape,
              color: getBoxColor(isRed),
              edgeColor: getBoxEdgeColor(isRed),
              highlightColor: getBoxHighlightColor(isRed),
              phase: Math.random() * Math.PI * 2,
              driftSpeed: 0.0022 + Math.random() * 0.0018,
              driftRadius: distribution === 'wave' ? 1.5 + Math.random() * 2 : 5 + Math.random() * 7,
              restDepth: distribution === 'wave' ? baseY - waveCrestY(baseX) : 0,
            });
          }
        }

        particlesRef.current = newParticles;

        if (distribution === 'wave') {
          cellNext = new Int32Array(newParticles.length);
        }
      };

      initParticles();

      // Mouse tracking on parent section for full surface coverage
      const handleMouseMove = (e: MouseEvent) => {
        const rect = canvas.getBoundingClientRect();
        const curX = e.clientX - rect.left;
        const curY = e.clientY - rect.top;

        if (curX >= 0 && curX <= width && curY >= 0 && curY <= height) {
          // Only trust the delta if the cursor was already inside and
          // tracked last frame - otherwise re-entering the section from
          // anywhere would register as one enormous jump.
          if (mouseRef.current.active) {
            mouseRef.current.vx = curX - mouseRef.current.x;
            mouseRef.current.vy = curY - mouseRef.current.y;
          }
          mouseRef.current.x = curX;
          mouseRef.current.y = curY;
          mouseRef.current.active = true;
        } else {
          mouseRef.current.active = false;
          mouseRef.current.vx = 0;
          mouseRef.current.vy = 0;
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

      // Spring physics parameters for fluid recovery. The wave field is
      // meant to lie low like water, not snap back like it's on elastic,
      // but it does have to come back *down*: a cursor pass throws grains
      // up out of the drift and they then fall back into it under their
      // own weight rather than hanging wherever the push left them.
      // Very little friction for the wave field - this is the single
      // biggest lever on whether it reads as liquid or as sand: momentum
      // has to carry a grain a long way across the section after a sweep
      // instead of being scrubbed off within a few frames. The settle
      // spring is correspondingly slack, so grains ease back onto the
      // drift line over seconds rather than being pulled onto it.
      const springK = distribution === 'wave' ? 0.0035 : 0.042;
      const damping = distribution === 'wave' ? 0.992 : 0.89;
      // How hard the cursor pushes particles apart as it passes through -
      // pulled back down from an earlier pass that threw grains much too
      // far, too fast for a moving cursor. They still can't escape the
      // section, since the edges below are solid.
      const repulsionStrength = distribution === 'wave' ? 15 : 17.5;
      // How much of the cursor's own motion is handed to the grains around
      // it. This is the "dragged along with" half of the interaction, as
      // opposed to the "pushed away from" half above.
      const advection = 0.11;
      // Wave-only. gravity is a constant downward pull applied in
      // proportion to how far *above* its resting line a grain currently
      // is, so a disturbed grain arcs back down into the pile instead of
      // floating where it was left, while grains already at rest feel
      // nothing extra. horizontalRelaxK is a deliberately tiny sideways
      // pull toward the column the grain came from - far too weak to read
      // as snapping back to an original spot, but enough that over a few
      // seconds the drift refills the bald patches a cursor sweep carves
      // out instead of thinning there permanently. restitution is how much
      // speed a grain keeps when it bounces off an edge.
      const gravity = 0.032;
      const horizontalRelaxK = 0.0004;
      const restitution = 0.5;

      // How far a cursor movement seeds the current grid - a bit wider
      // than the radius that shoves individual particles directly, since
      // this is what carries a disturbance a little past that immediate
      // footprint, but not a large multiple of it - that was most of why
      // the affected area read as much bigger than the cursor itself.
      const fluidRadius = interactionRadius * 1.15;
      // How much of the sampled current each particle picks up per frame.
      const fieldInfluence = 0.24;

      // Bilinear-sample one of the flow grids at a world position, so a
      // particle between grid cells gets a smoothly blended value instead
      // of the field looking blocky at fieldCell resolution.
      const sampleField = (fx: number, fy: number, field: Float32Array): number => {
        const gx = fx / fieldCell;
        const gy = fy / fieldCell;
        const x0 = Math.max(0, Math.min(fieldCols - 1, Math.floor(gx)));
        const y0 = Math.max(0, Math.min(fieldRows - 1, Math.floor(gy)));
        const x1 = Math.min(fieldCols - 1, x0 + 1);
        const y1 = Math.min(fieldRows - 1, y0 + 1);
        const tx = Math.max(0, Math.min(1, gx - x0));
        const ty = Math.max(0, Math.min(1, gy - y0));
        const v00 = field[y0 * fieldCols + x0];
        const v10 = field[y0 * fieldCols + x1];
        const v01 = field[y1 * fieldCols + x0];
        const v11 = field[y1 * fieldCols + x1];
        return v00 * (1 - tx) * (1 - ty) + v10 * tx * (1 - ty) + v01 * (1 - tx) * ty + v11 * tx * ty;
      };

      const render = () => {
        timeRef.current += 1;
        const t = timeRef.current;

        ctx.clearRect(0, 0, width, height);

        const mouse = mouseRef.current;
        const particles = particlesRef.current;
        const numParticles = particles.length;

        if (distribution === 'wave' && fieldCols > 0) {
          // Deposit the cursor's own current travel into the grid cells
          // around it, falling off with distance - a moving cursor seeds a
          // current in whatever direction it's headed; a stationary one
          // seeds nothing, since mouse.vx/vy decay to ~0 once it stops.
          if (mouse.active && (mouse.vx !== 0 || mouse.vy !== 0)) {
            const minCx = Math.max(0, Math.floor((mouse.x - fluidRadius) / fieldCell));
            const maxCx = Math.min(fieldCols - 1, Math.ceil((mouse.x + fluidRadius) / fieldCell));
            const minCy = Math.max(0, Math.floor((mouse.y - fluidRadius) / fieldCell));
            const maxCy = Math.min(fieldRows - 1, Math.ceil((mouse.y + fluidRadius) / fieldCell));
            for (let cy = minCy; cy <= maxCy; cy++) {
              for (let cx = minCx; cx <= maxCx; cx++) {
                const wx = cx * fieldCell;
                const wy = cy * fieldCell;
                const dx = wx - mouse.x;
                const dy = wy - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist >= fluidRadius) continue;
                const falloff = 1 - dist / fluidRadius;
                const idx = cy * fieldCols + cx;
                vxField[idx] += mouse.vx * falloff * 0.32;
                vyField[idx] += mouse.vy * falloff * 0.32;
              }
            }
          }

          // Diffuse: every cell blends toward its four neighbors' average,
          // which is what carries a disturbance seeded in one spot out
          // across the rest of the grid frame by frame - exactly the part
          // a purely local "push the particles under the cursor" model
          // never had. Decay is folded into the same pass so a current
          // that nothing keeps feeding gradually dies out instead of
          // sloshing forever.
          const diffuseK = 0.28;
          const fieldDecay = 0.965;
          for (let cy = 0; cy < fieldRows; cy++) {
            for (let cx = 0; cx < fieldCols; cx++) {
              const idx = cy * fieldCols + cx;
              const left = cx > 0 ? idx - 1 : idx;
              const right = cx < fieldCols - 1 ? idx + 1 : idx;
              const up = cy > 0 ? idx - fieldCols : idx;
              const down = cy < fieldRows - 1 ? idx + fieldCols : idx;

              const avgVx = (vxField[left] + vxField[right] + vxField[up] + vxField[down]) / 4;
              const avgVy = (vyField[left] + vyField[right] + vyField[up] + vyField[down]) / 4;

              vxFieldNext[idx] = (vxField[idx] * (1 - diffuseK) + avgVx * diffuseK) * fieldDecay;
              vyFieldNext[idx] = (vyField[idx] * (1 - diffuseK) + avgVy * diffuseK) * fieldDecay;
            }
          }

          const swapVx = vxField;
          vxField = vxFieldNext;
          vxFieldNext = swapVx;
          const swapVy = vyField;
          vyField = vyFieldNext;
          vyFieldNext = swapVy;

          // Separation pass: bin every particle into the spatial hash,
          // then push apart any pair closer than minSeparation. Checking
          // only each particle's own cell plus its 8 neighbors is safe
          // because SEP_CELL >= minSeparation, so nothing closer than
          // that can be more than one cell away. `j > i` visits each
          // overlapping pair exactly once.
          cellHead.fill(-1);
          for (let i = 0; i < numParticles; i++) {
            const p = particles[i];
            const cx = Math.max(0, Math.min(sepCols - 1, Math.floor(p.x / SEP_CELL)));
            const cy = Math.max(0, Math.min(sepRows - 1, Math.floor(p.y / SEP_CELL)));
            const cellIdx = cy * sepCols + cx;
            cellNext[i] = cellHead[cellIdx];
            cellHead[cellIdx] = i;
          }

          for (let i = 0; i < numParticles; i++) {
            const p = particles[i];
            const cx = Math.max(0, Math.min(sepCols - 1, Math.floor(p.x / SEP_CELL)));
            const cy = Math.max(0, Math.min(sepRows - 1, Math.floor(p.y / SEP_CELL)));

            for (let ny = Math.max(0, cy - 1); ny <= Math.min(sepRows - 1, cy + 1); ny++) {
              for (let nx = Math.max(0, cx - 1); nx <= Math.min(sepCols - 1, cx + 1); nx++) {
                let j = cellHead[ny * sepCols + nx];
                while (j !== -1) {
                  if (j > i) {
                    const q = particles[j];
                    const ddx = q.x - p.x;
                    const ddy = q.y - p.y;
                    const distSq = ddx * ddx + ddy * ddy;
                    if (distSq < minSeparationSq && distSq > 0.0001) {
                      const dist = Math.sqrt(distSq);
                      const overlap = (minSeparation - dist) * 0.5;
                      const axisX = ddx / dist;
                      const axisY = ddy / dist;
                      p.x -= axisX * overlap;
                      p.y -= axisY * overlap;
                      q.x += axisX * overlap;
                      q.y += axisY * overlap;
                    }
                  }
                  j = cellNext[j];
                }
              }
            }
          }
        }

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
              const repulsionForce = normalDist * normalDist * repulsionStrength;

              const angle = Math.atan2(dy, dx);
              p.vx += Math.cos(angle) * repulsionForce;
              p.vy += Math.sin(angle) * repulsionForce;

              // ...and the advection half: everything inside the radius is
              // also carried along in whatever direction the cursor itself
              // is travelling, on a wider, gentler linear falloff than the
              // squared one the outward shove uses. Together the two make a
              // sweep push a bow wave ahead of the cursor and pull a wake
              // behind it, which is what a hand through water actually does
              // and what purely radial repulsion never looks like.
              if (distribution === 'wave') {
                p.vx += mouse.vx * normalDist * advection;
                p.vy += mouse.vy * normalDist * advection;
              }
            }
          }

          // 3b. The background current (see fieldInfluence/sampleField
          // above): every wave particle, not just the ones directly under
          // the cursor, picks up whatever the diffused flow grid is doing
          // at its own position. This is what makes a push on one side of
          // the section eventually reach particles clear on the other
          // side - the grid carries the disturbance there over the next
          // several frames even after the cursor has moved on, the same
          // way a ripple keeps travelling once you've stopped touching the
          // water.
          if (distribution === 'wave' && fieldCols > 0) {
            p.vx += sampleField(p.x, p.y, vxField) * fieldInfluence;
            p.vy += sampleField(p.x, p.y, vyField) * fieldInfluence;
          }

          // 4. Restoring force. The uniform field springs a particle back
          // toward the one fixed point it was born at (idleX/idleY, tied to
          // its own baseX/baseY) - which is exactly the "always drifts back
          // to its original spot" feel the reference's wave field does NOT
          // have. There, a scattered particle never snaps back to where it
          // started; it sinks back down to the general water line, roughly
          // wherever that leaves it horizontally. So the wave field keeps
          // no real memory of an original point: sideways it gets only the
          // near-zero horizontalRelaxK trickle (slow enough to read as the
          // drift gradually refilling, not as a grain being reeled home),
          // and the Y target is recomputed every frame from the particle's
          // *current* x against the dune surface, offset by its own fixed
          // restDepth (how deep into the pile this grain sits).
          // restDepth is what keeps the fill looking like a packed dune
          // instead of every particle collapsing onto the bare crest
          // curve - without it, particles at every depth would all get
          // pulled toward the same surface line and the whole graded fill
          // would flatten into a hairline within a few seconds.
          if (distribution === 'wave') {
            const waterY =
              waveCrestY(p.x) + p.restDepth + Math.sin(t * p.driftSpeed + p.phase) * p.driftRadius;
            const dy = waterY - p.y;

            // Settle onto the resting line, plus - the further above that
            // line the grain currently is - its own weight pulling it back
            // down. The gravity term is ramped in over the first 40px above
            // the line and capped there, so it vanishes smoothly at rest
            // (no permanent downward bias sinking the whole drift) while a
            // grain thrown well clear of the pile falls decisively back in.
            const aboveFactor = Math.max(0, Math.min(1, dy / 40));
            p.vy += dy * springK + gravity * aboveFactor;

            // Barely-there sideways relaxation - see horizontalRelaxK.
            p.vx += (p.baseX - p.x) * horizontalRelaxK;
          } else {
            const returnForceX = (idleX - p.x) * springK;
            const returnForceY = (idleY - p.y) * springK;
            p.vx += returnForceX;
            p.vy += returnForceY;
          }

          // Apply velocity damping
          p.vx *= damping;
          p.vy *= damping;

          // Advance position
          p.x += p.vx;
          p.y += p.vy;

          // Edges are solid for the wave field, the way the reference's own
          // drift is contained by the viewport: a grain thrown at the left,
          // right or top edge bounces off it and keeps a fraction of its
          // speed rather than sailing out of the section. The bottom is a
          // floor instead of a wall - grains resting at the base of the
          // pile sit against it, so bouncing there would leave the deepest
          // row permanently jittering.
          if (distribution === 'wave') {
            const rad = p.size / 2;
            if (p.x < rad) {
              p.x = rad;
              p.vx = Math.abs(p.vx) * restitution;
            } else if (p.x > width - rad) {
              p.x = width - rad;
              p.vx = -Math.abs(p.vx) * restitution;
            }
            if (p.y < rad) {
              p.y = rad;
              p.vy = Math.abs(p.vy) * restitution;
            } else if (p.y > height - rad) {
              p.y = height - rad;
              if (p.vy > 0) p.vy = 0;
            }
          }

          // 5. Render as one of four flat glyphs - dot, square, plus-mark,
          // diamond - the mix lusion.co/about's own dust reads as, rather
          // than every particle being the same little taped-shut carton.
          const r = p.size / 2;
          const cx = p.x;
          const cy = p.y;

          switch (p.shape) {
            case 'dot':
              ctx.fillStyle = p.color;
              ctx.beginPath();
              ctx.arc(cx, cy, r, 0, Math.PI * 2);
              ctx.fill();
              break;
            case 'square':
              ctx.fillStyle = p.color;
              ctx.fillRect(Math.round(cx - r), Math.round(cy - r), Math.round(p.size), Math.round(p.size));
              break;
            case 'cross':
              ctx.strokeStyle = p.color;
              ctx.lineWidth = Math.max(1, p.size * 0.26);
              ctx.beginPath();
              ctx.moveTo(cx - r, cy);
              ctx.lineTo(cx + r, cy);
              ctx.moveTo(cx, cy - r);
              ctx.lineTo(cx, cy + r);
              ctx.stroke();
              break;
            case 'diamond':
              ctx.fillStyle = p.color;
              ctx.beginPath();
              ctx.moveTo(cx, cy - r);
              ctx.lineTo(cx + r, cy);
              ctx.lineTo(cx, cy + r);
              ctx.lineTo(cx - r, cy);
              ctx.closePath();
              ctx.fill();
              break;
          }
        }

        // The cursor's recorded travel decays once it stops moving, so a
        // parked cursor stops dragging the field along with it (mousemove
        // simply stops firing, and nothing would otherwise clear this).
        mouse.vx *= 0.88;
        mouse.vy *= 0.88;

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
    }, [gridSpacing, interactionRadius, redRatio, triggerScatter, distribution]);

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

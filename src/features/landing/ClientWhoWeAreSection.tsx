'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextReveal } from '@/components/TextReveal';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * The client site's "WHO WE ARE" section, ported over with its own
 * paper/ink palette rather than the rest of this site's black/red/white,
 * plus the client's interactive particle "pick a team" stage acting as the
 * bridge into the dark section that follows.
 *
 * Three things carried over deliberately from the client reference:
 *
 *  - The cream field fades in from black at the top (see CREAM_FIELD_STYLE)
 *    instead of being a hard-edged white block, so it reads as part of the
 *    page rather than a pasted-in white panel.
 *
 *  - The fine dot-grain + hairline grid texture layered under that
 *    gradient is lifted directly from the client's `.sec-p` / `.sec-2`
 *    background recipe (a repeating 132px line grid plus a 5px dot
 *    pattern).
 *
 *  - Right where the client's own page hands off from its cream section to
 *    the next dark one, it runs the particle "pick a team" stage through a
 *    dedicated gradient (transparent -> coal) so the cream field visually
 *    dissolves into the particles rather than cutting straight to black.
 *    RELIC_BG_STYLE below is that same gradient recipe (same stops, same
 *    coal hex) applied over the canvas here, so this section's cream text
 *    flows into the particle stage exactly the way theirs does, and the
 *    particle stage then hands off to solid black for whatever section
 *    comes next.
 */
const CREAM_FIELD_STYLE: React.CSSProperties = {
  backgroundImage: [
    'repeating-linear-gradient(90deg, rgba(20,17,16,.062) 0 1px, transparent 1px 132px)',
    'repeating-linear-gradient(0deg, rgba(20,17,16,.048) 0 1px, transparent 1px 132px)',
    'radial-gradient(rgba(20,17,16,.055) .9px, transparent 1px)',
    'linear-gradient(180deg, #000000 0%, #EDEBE6 9%, #EDEBE6 100%)',
  ].join(', '),
  backgroundSize: 'auto, auto, 5px 5px, auto',
};

const RELIC_BG_STYLE: React.CSSProperties = {
  background:
    'linear-gradient(180deg, rgba(22,19,15,0) 0%, rgba(22,19,15,.30) 11%, rgba(22,19,15,.78) 24%, #16130F 36%, #16130F 100%)',
};

/** How far the resting "drift" cloud's targets are kept from the canvas
 *  edges, as a fraction of width/height. The spring physics that ease
 *  particles toward their target has momentum, so a target sitting right on
 *  the edge still gets overshot slightly on every pass; without this inset
 *  that overshoot gets clipped by the stage's overflow-hidden, which reads
 *  as particles popping in and out right at the top/bottom. */
const DRIFT_MARGIN = 0.06;

export type FigureKind = 'plain' | 'cap' | 'hat' | 'headset' | 'crew';

interface TeamMember {
  name: string;
  role: string;
  figure: FigureKind;
}

const TEAMS: Record<string, { label: string; count: number; members: TeamMember[] }> = {
  ops: {
    label: 'Meet our Operations Team',
    count: 4,
    // Figures corrected to match which silhouette the client's own code
    // actually paints for each of these four - the earlier pass had guessed
    // wrong here (e.g. Julian was drawn with a tool-bag "crew" figure; the
    // client draws him with a headset).
    members: [
      { name: 'Nicole Ingram', role: 'Dispatcher', figure: 'plain' },
      { name: 'Julian Hernandez', role: 'Dispatch Manager', figure: 'headset' },
      { name: 'Peter Taylor', role: 'Operations Supervisor', figure: 'hat' },
      { name: 'Leon Kaoma', role: 'Operations Manager', figure: 'crew' },
    ],
  },
  sales: {
    label: 'Meet our Sales Team',
    count: 4,
    // Every sales figure in the client's own reference wears a headset -
    // there's no "plain" concierge silhouette on their site.
    members: [
      { name: 'Dyamon Cobb', role: 'Sales Manager', figure: 'headset' },
      { name: 'Shadee Mounger', role: 'Sales Concierge', figure: 'headset' },
      { name: 'Briana Hager', role: 'Sales Concierge', figure: 'headset' },
      { name: 'Zenobia Rhodes', role: 'Sales Concierge', figure: 'headset' },
    ],
  },
  leads: {
    label: 'Meet your Moving Crew Leaders',
    count: 16,
    // Cycled hat / cap / crew, matching the client's own rotation order.
    members: [
      { name: 'Mark Vega', role: 'Crew Leader', figure: 'hat' },
      { name: 'Isreal Ara', role: 'Crew Leader', figure: 'cap' },
      { name: 'Stephen Arevalo', role: 'Crew Leader', figure: 'crew' },
      { name: 'Philip Myers', role: 'Crew Leader', figure: 'hat' },
      { name: 'Carlos Contreras', role: 'Crew Leader', figure: 'cap' },
      { name: 'Joseph Hawkings', role: 'Crew Leader', figure: 'crew' },
      { name: 'Logan Foster', role: 'Crew Leader', figure: 'hat' },
      { name: 'Jonathan Stanzak', role: 'Crew Leader', figure: 'cap' },
      { name: 'Filiberto Santos', role: 'Crew Leader', figure: 'crew' },
      { name: 'Julian Gallegos', role: 'Crew Leader', figure: 'hat' },
      { name: 'Noe Martinez', role: 'Crew Leader', figure: 'cap' },
      { name: 'Alonzo Ramirez', role: 'Crew Leader', figure: 'crew' },
      { name: 'Jose Moreno', role: 'Crew Leader', figure: 'hat' },
      { name: 'Juan Torres', role: 'Crew Leader', figure: 'cap' },
      { name: 'Alex Hernandez', role: 'Crew Leader', figure: 'crew' },
      { name: 'Eric Menchaca', role: 'Crew Leader', figure: 'hat' },
    ],
  },
};

/**
 * Paints one person's silhouette into an offscreen canvas, which
 * updateTargets() then samples into particle points. The one rule that
 * actually matters here: with single-colour particles, a detail only reads
 * once it's sampled as points, which only happens where it changes the
 * silhouette's solid alpha - so an accessory has to extend the same filled
 * contour (a cap brim as part of the head's own path) or punch a hole in it
 * (destination-out), never sit on top as a separate thin stroke or a
 * disconnected shape floating past the edge. The previous version drew caps
 * and headsets as add-on strokes/arcs outside the head outline, which is
 * why they read as a stray line of stray dots rather than a clean part of
 * the figure once sampled.
 */
function drawSilhouette(ctx: CanvasRenderingContext2D, figure: FigureKind, w: number, h: number) {
  // Logical portrait space, matching the client reference's own 240x280
  // proportions (a noticeably taller, narrower box than this had before -
  // that mismatch was a lot of why the previous figures read as squat,
  // bottle-shaped blobs rather than people). nx()/ny() just rescale that
  // same logical space onto whatever actual figW x figH box the caller
  // sampled into.
  const nx = (v: number) => (v / 240) * w;
  const ny = (v: number) => (v / 280) * h;
  ctx.fillStyle = '#ffffff';

  const cx = nx(120);
  const headCx = cx;
  const headCy = ny(104);
  const headRx = nx(38);
  const headRy = ny(45);
  const torsoTop = ny(166);
  const shoulderHalf = nx(figure === 'hat' || figure === 'crew' ? 95 : 84);

  // Torso: a tapered trapezoid that necks inward right at the very top edge
  // so the shoulders slope up into the neck, rather than squaring off flat.
  ctx.beginPath();
  ctx.moveTo(cx - shoulderHalf, h);
  ctx.lineTo(cx - shoulderHalf * 0.99, torsoTop + ny(16));
  ctx.lineTo(cx - shoulderHalf * 0.38, torsoTop);
  ctx.lineTo(cx + shoulderHalf * 0.38, torsoTop);
  ctx.lineTo(cx + shoulderHalf * 0.99, torsoTop + ny(16));
  ctx.lineTo(cx + shoulderHalf, h);
  ctx.closePath();
  ctx.fill();

  // Neck - a plain rectangle bridging torso to head.
  const neckW = nx(15);
  ctx.fillRect(cx - neckW, ny(144), neckW * 2, ny(20));

  // Head - an oval (taller than wide), not a circle, fused as its own pass.
  ctx.beginPath();
  ctx.ellipse(headCx, headCy, headRx, headRy, 0, 0, Math.PI * 2);
  ctx.fill();

  // Ears - only where hair or a headset isn't already covering them.
  if (figure === 'hat' || figure === 'cap' || figure === 'crew') {
    ctx.beginPath();
    ctx.ellipse(headCx - headRx - nx(4), headCy + ny(4), nx(6), ny(9), 0, 0, Math.PI * 2);
    ctx.ellipse(headCx + headRx + nx(4), headCy + ny(4), nx(6), ny(9), 0, 0, Math.PI * 2);
    ctx.fill();
  }

  if (figure === 'crew') {
    // Crew cut: a squared, rounded-corner crown fused onto the head, with
    // a thin cutout hairline so it still reads as separate from the skull.
    const l = headCx - headRx - nx(3);
    const r = headCx + headRx + nx(3);
    const top = headCy - headRy - ny(13);
    const bot = headCy - headRy * 0.18;
    const rad = nx(13);
    ctx.beginPath();
    ctx.moveTo(l + rad, top);
    ctx.lineTo(r - rad, top);
    ctx.quadraticCurveTo(r, top, r, top + rad);
    ctx.lineTo(r, bot - rad);
    ctx.quadraticCurveTo(r, bot, r - rad, bot);
    ctx.lineTo(l + rad, bot);
    ctx.quadraticCurveTo(l, bot, l, bot - rad);
    ctx.lineTo(l, top + rad);
    ctx.quadraticCurveTo(l, top, l + rad, top);
    ctx.closePath();
    ctx.fill();
    ctx.save();
    ctx.globalCompositeOperation = 'destination-out';
    ctx.lineWidth = ny(4);
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(l + nx(2), headCy - headRy + ny(9));
    ctx.lineTo(r - nx(2), headCy - headRy + ny(9));
    ctx.stroke();
    ctx.restore();
  } else if (figure === 'hat') {
    // Hard hat: a dome clipped above the skull, a brim reaching past the
    // ears, and a cutout gap notching the dome away from the head below it.
    const domeCy = headCy - ny(18);
    const domeRx = headRx + nx(7);
    const domeRy = headRx * 0.95;
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, w, headCy - ny(14));
    ctx.clip();
    ctx.beginPath();
    ctx.ellipse(headCx, domeCy, domeRx, domeRy, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    ctx.beginPath();
    ctx.ellipse(headCx, headCy - ny(16), headRx + nx(17), ny(7), 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.save();
    ctx.globalCompositeOperation = 'destination-out';
    ctx.lineWidth = ny(4);
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.ellipse(headCx, domeCy, domeRx, domeRy, 0, (184 * Math.PI) / 180, (356 * Math.PI) / 180);
    ctx.stroke();
    ctx.restore();
  } else if (figure === 'cap') {
    // Ball cap: a clipped dome plus a long forward brim wedge.
    const domeCy = headCy - ny(14);
    const domeRx = headRx + nx(5);
    const domeRy = headRx * 0.8;
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, w, headCy - ny(12));
    ctx.clip();
    ctx.beginPath();
    ctx.ellipse(headCx, domeCy, domeRx, domeRy, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    ctx.beginPath();
    ctx.moveTo(headCx - nx(6), headCy - ny(19));
    ctx.lineTo(headCx + headRx + nx(26), headCy - ny(17));
    ctx.lineTo(headCx + headRx + nx(26), headCy - ny(9));
    ctx.lineTo(headCx - nx(6), headCy - ny(11));
    ctx.closePath();
    ctx.fill();
    ctx.save();
    ctx.globalCompositeOperation = 'destination-out';
    ctx.lineWidth = ny(4);
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.ellipse(headCx, domeCy, domeRx, domeRy, 0, (188 * Math.PI) / 180, (352 * Math.PI) / 180);
    ctx.stroke();
    ctx.restore();
  } else if (figure === 'headset') {
    // Dispatch headset: a thick band arc over the crown, two ear-cup discs
    // fused to the skull's own edge, a mic boom, and a cutout notch across
    // the band so it reads as wrapping the head rather than floating on it.
    ctx.save();
    ctx.lineWidth = ny(9);
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(headCx, headCy - ny(8), headRx + nx(17), (198 * Math.PI) / 180, (342 * Math.PI) / 180);
    ctx.stroke();
    ctx.restore();
    ctx.beginPath();
    ctx.ellipse(headCx - headRx - nx(11), headCy + ny(6), nx(12), ny(15), 0, 0, Math.PI * 2);
    ctx.ellipse(headCx + headRx + nx(11), headCy + ny(6), nx(12), ny(15), 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.save();
    ctx.lineWidth = ny(5);
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(headCx + headRx + nx(8), headCy + ny(18));
    ctx.quadraticCurveTo(headCx + headRx + nx(6), headCy + ny(40), headCx + nx(16), headCy + ny(44));
    ctx.stroke();
    ctx.restore();
    ctx.beginPath();
    ctx.ellipse(headCx + nx(13), headCy + ny(44), nx(7), ny(6), 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.save();
    ctx.globalCompositeOperation = 'destination-out';
    ctx.lineWidth = ny(4);
    ctx.beginPath();
    ctx.arc(headCx, headCy - ny(8), headRx + nx(8), (200 * Math.PI) / 180, (340 * Math.PI) / 180);
    ctx.stroke();
    ctx.restore();
  }
  // figure === 'plain': bare head, no hair/headwear accessory drawn - this
  // is the client's own "long hair, nothing else added" look, which is
  // invisible detail once reduced to sampled points anyway.

  // Eyes + brows, punched as negative space - a filled shape sitting on
  // top of the solid head would vanish once sampled into points, so these
  // have to be cut out of it instead.
  ctx.save();
  ctx.globalCompositeOperation = 'destination-out';
  const eyeX = nx(figure === 'plain' || figure === 'headset' ? 15 : 17);
  ctx.beginPath();
  ctx.ellipse(headCx - eyeX, headCy, nx(7), ny(4.4), 0, 0, Math.PI * 2);
  ctx.ellipse(headCx + eyeX, headCy, nx(7), ny(4.4), 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillRect(headCx - eyeX - nx(10), headCy - ny(14), nx(18), ny(3.2));
  ctx.fillRect(headCx + eyeX - nx(8), headCy - ny(14), nx(18), ny(3.2));
  ctx.beginPath();
  ctx.ellipse(headCx, headCy + ny(26), nx(9), ny(3.4), 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Collar notch - a thin cutout V at the base of the neck so the head
  // still reads as separate from the torso once sampled.
  ctx.save();
  ctx.globalCompositeOperation = 'destination-out';
  ctx.beginPath();
  ctx.moveTo(cx - nx(18), torsoTop + ny(1));
  ctx.lineTo(cx, torsoTop + ny(30));
  ctx.lineTo(cx + nx(18), torsoTop + ny(1));
  ctx.lineTo(cx + nx(8), torsoTop - ny(3));
  ctx.lineTo(cx, torsoTop + ny(16));
  ctx.lineTo(cx - nx(8), torsoTop - ny(3));
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  targetX: number;
  targetY: number;
  memberIndex: number;
  anchorX: number;
  anchorY: number;
  color: string;
  size: number;
  /** Spring stiffness pulling a formed (memberIndex !== -1) particle toward
   *  its silhouette point - randomized per-particle like the client's own
   *  `k`, so a formed figure settles unevenly rather than every particle
   *  arriving in lockstep. */
  speed: number;
  /** Phase offset for the idle cosine/sine shimmer applied every frame -
   *  the client's own particles never sit still even once "arrived", they
   *  keep a small per-particle wobble going. */
  phase: number;
  /** Normalized (0-1) wander position + velocity for the resting "drift"
   *  cloud, so unassigned particles roam the whole canvas slowly instead of
   *  idling around one frozen point. */
  driftNX: number;
  driftNY: number;
  driftVX: number;
  driftVY: number;
}

const TEAM_ORDER: { key: string; num: string; label: string; count: string }[] = [
  { key: 'ops', num: '01', label: 'Operations Team', count: '04' },
  { key: 'sales', num: '02', label: 'Sales Concierge', count: '04' },
  { key: 'leads', num: '03', label: 'Moving Crew Leads', count: '16' },
];

/** Tip line under the particle stage, ported from the client's own TIPS
 *  map so the default "drift" copy (before any team is picked) matches
 *  what their reference page actually shows, plus the per-team wording
 *  once a pick is made. */
const TIP_TEXT: Record<string, string> = {
  drift: 'PICK A TEAM · OR CLICK THE PARTICLES FOR OUR DOT & TXDMV NUMBERS',
  ops: 'OPERATIONS · MOVE ACROSS THEM · CLICK FOR OUR DOT & TXDMV',
  sales: 'SALES · MOVE ACROSS THEM · CLICK FOR OUR DOT & TXDMV',
  leads: 'CREW LEADERS · MOVE ACROSS THEM · CLICK FOR OUR DOT & TXDMV',
};

export const ClientWhoWeAreSection: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  // Resting state is the free-floating cloud, not a formed team - matches
  // the client reference, where "Let them drift" is the default-active
  // pick rather than a team being pre-selected.
  const [activeTeam, setActiveTeam] = useState<string>('drift');
  const [hoveredMember, setHoveredMember] = useState<TeamMember | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);

  const particlesRef = useRef<Particle[]>([]);
  const memberPositionsRef = useRef<{ x: number; y: number; member: TeamMember }[]>([]);

  // Trust-stat row: entrance stagger + rolling count-up, mirroring the
  // same pattern AboutAtAGlance already uses for its own stat grid.
  const statsGridRef = useRef<HTMLDivElement | null>(null);
  const movesNumRef = useRef<HTMLSpanElement | null>(null);
  const ontimeNumRef = useRef<HTMLSpanElement | null>(null);
  const citiesNumRef = useRef<HTMLSpanElement | null>(null);
  const marqueeRef = useRef<HTMLDivElement | null>(null);
  const storyParasRef = useRef<HTMLDivElement | null>(null);

  // Build target points for active team
  const updateTargets = useCallback((teamKey: string, width: number, height: number) => {
    // Guards a real crash: if this runs before the canvas has been laid out
    // (width/height still 0 on the first paint), figW below collapses to 0
    // and offCtx.getImageData(0, 0, 0, figH) throws "IndexSizeError: source
    // width is 0", which takes the whole page down via the router's error
    // boundary. The resize() effect retries via a ResizeObserver once the
    // canvas actually has size, so bailing out here is safe.
    if (width <= 0 || height <= 0) return;

    if (teamKey === 'drift' || !TEAMS[teamKey]) {
      // Just release them - the animation loop below keeps every
      // unassigned (memberIndex === -1) particle's target riding its own
      // slowly-evolving driftNX/driftNY each frame, so they keep roaming
      // instead of settling on a fixed point.
      memberPositionsRef.current = [];
      particlesRef.current.forEach((p) => {
        p.memberIndex = -1;
      });
      return;
    }

    const team = TEAMS[teamKey];
    const members = team.members;
    const isLeads = members.length > 8;
    const cols = isLeads ? 8 : members.length;
    const rows = Math.ceil(members.length / cols);

    const isMobile = width < 640;
    const figW = isLeads
      ? isMobile
        ? Math.min(55, width / 9.5)
        : Math.min(85, width / 7.7)
      : isMobile
        ? Math.min(105, width / 4.4)
        : Math.min(145, width / 3.85);

    // 280/240, the client reference's own logical portrait box - taller
    // relative to its width than this previously used (1.25), which is
    // part of why these read as squat rather than person-shaped.
    const figH = figW * (280 / 240);
    const gapX = width / (cols + 1);
    const gapY = isLeads ? figH * 1.18 : figH * 1.35;
    const startY = height * 0.46 - ((rows - 1) * gapY) / 2;

    const positions: { x: number; y: number; member: TeamMember }[] = [];
    const figureTargets: { x: number; y: number; memberIndex: number }[][] = [];

    const offCanvas = document.createElement('canvas');
    offCanvas.width = figW;
    offCanvas.height = figH;
    const offCtx = offCanvas.getContext('2d');

    for (let i = 0; i < members.length; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const cx = gapX * (col + 1);
      const cy = startY + row * gapY;
      positions.push({ x: cx, y: cy, member: members[i] });

      const points: { x: number; y: number; memberIndex: number }[] = [];
      if (offCtx) {
        offCtx.clearRect(0, 0, figW, figH);
        drawSilhouette(offCtx, members[i].figure, figW, figH);
        const imgData = offCtx.getImageData(0, 0, figW, figH).data;
        // Denser sampling for the 16-wide leads grid than for the 4-wide
        // ops/sales rows - matches the client's own step sizing, which is
        // the opposite of what this had before (it was thinning the
        // crowded leads grid and densifying the spacious ops/sales one).
        const step = isLeads ? 2 : 3;

        for (let py = 0; py < figH; py += step) {
          for (let px = 0; px < figW; px += step) {
            const idx = (py * Math.floor(figW) + px) * 4 + 3;
            if (imgData[idx] > 140) {
              // Thin out the lower torso the same way the client does -
              // otherwise the torso reads as a denser, heavier block than
              // the head once sampled.
              if (py / figH > 0.6 && Math.random() > 0.5) continue;
              points.push({
                x: cx - figW / 2 + px + (Math.random() - 0.5) * 2,
                y: cy - figH / 2 + py + (Math.random() - 0.5) * 2,
                memberIndex: i,
              });
            }
          }
        }
      }
      figureTargets.push(points);
    }

    memberPositionsRef.current = positions;

    // Distribute particles across targets
    const totalParticles = particlesRef.current.length;

    for (let i = 0; i < totalParticles; i++) {
      const memIdx = i % members.length;
      const memPts = figureTargets[memIdx];
      const p = particlesRef.current[i];

      if (memPts && memPts.length > 0) {
        const pt = memPts[Math.floor(Math.random() * memPts.length)];
        p.targetX = pt.x;
        p.targetY = pt.y;
        p.memberIndex = pt.memberIndex;
      } else {
        // No sample points for this member (edge case) - fall back to the
        // ambient drift the loop drives for every unassigned particle.
        p.memberIndex = -1;
      }
    }
  }, []);

  // Trigger burst scatter
  const scatterParticles = useCallback((originX?: number, originY?: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const cx = originX !== undefined ? originX : canvas.width / 2;
    const cy = originY !== undefined ? originY : canvas.height / 2;

    particlesRef.current.forEach((p) => {
      const dx = p.x - cx;
      const dy = p.y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;
      const force = Math.min(35, Math.max(12, 2400 / (dist + 50))) * (0.8 + Math.random() * 0.5);
      const angle = Math.atan2(dy, dx) + (Math.random() - 0.5) * 0.6;
      p.vx += Math.cos(angle) * force;
      p.vy += Math.sin(angle) * force;
    });
  }, []);

  // Canvas initialization and animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      // Bail out on a not-yet-laid-out canvas (width/height still 0) instead
      // of initializing particles/targets from a degenerate size - the
      // ResizeObserver below re-runs resize() once the canvas actually has
      // dimensions, so this just defers rather than skipping setup entirely.
      if (rect.width <= 0 || rect.height <= 0) return;

      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Denser field and a lighter red ratio, matching the client reference
      // rather than the sparser/redder mix this had before.
      const particleCount = rect.width <= 1000 ? 4200 : 11000;
      if (particlesRef.current.length === 0) {
        const pArray: Particle[] = [];
        for (let i = 0; i < particleCount; i++) {
          // Inset from the edges for the same reason the per-frame drift
          // target is (see DRIFT_MARGIN) - keeps the very first paint
          // consistent with every frame after it.
          const ax = (DRIFT_MARGIN + Math.random() * (1 - 2 * DRIFT_MARGIN)) * rect.width;
          const ay = (DRIFT_MARGIN + Math.random() * (1 - 2 * DRIFT_MARGIN)) * rect.height;
          pArray.push({
            x: ax + (Math.random() - 0.5) * 100,
            y: ay + (Math.random() - 0.5) * 100,
            vx: (Math.random() - 0.5) * 0.8,
            vy: (Math.random() - 0.5) * 0.8,
            targetX: ax,
            targetY: ay,
            memberIndex: -1,
            anchorX: ax,
            anchorY: ay,
            // Translucent, not opaque - the client's own render loop fills
            // these at 0.52/0.62 alpha (and only brightens to ~1 for the
            // person actively under the cursor, which this build doesn't
            // yet distinguish per-particle), never a flat #fff/#ef4444.
            // Matching that alpha is most of what reads as "dimmer".
            color: Math.random() < 0.05 ? 'rgba(198,28,36,0.62)' : 'rgba(224,220,212,0.55)',
            size: Math.random() < 0.2 ? 2.2 : 1.5,
            // Matches the client's own per-particle spring stiffness range
            // for a formed silhouette point (their `k`), not the much
            // stiffer flat pull this used to apply everywhere - that
            // mismatch was a big part of why particles snapped into a
            // figure instantly instead of settling into it.
            speed: 0.011 + Math.random() * 0.011,
            phase: Math.random() * Math.PI * 2,
            driftNX: Math.random(),
            driftNY: Math.random(),
            driftVX: (Math.random() - 0.5) * 0.00042,
            driftVY: (Math.random() - 0.5) * 0.0003,
          });
        }
        particlesRef.current = pArray;
      }

      updateTargets(activeTeam, rect.width, rect.height);
    };

    resize();
    window.addEventListener('resize', resize);
    // Catches the case resize() bailed out on above: layout (fonts, the
    // cream-field gradient wrapper above, GSAP-driven sizing) can settle
    // after the initial paint, so observe the canvas itself rather than
    // relying solely on a window resize event.
    const ro = new ResizeObserver(() => resize());
    ro.observe(canvas);

    let mouseX = -9999;
    let mouseY = -9999;

    const handlePointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;

      let nearest: { x: number; y: number; member: TeamMember } | null = null;
      let minD = activeTeam === 'leads' ? 75 : 120;

      memberPositionsRef.current.forEach((pos) => {
        const d = Math.hypot(pos.x - mouseX, pos.y - mouseY);
        if (d < minD) {
          minD = d;
          nearest = pos;
        }
      });

      if (nearest) {
        setHoveredMember((nearest as any).member);
        const yOffset = activeTeam === 'leads' ? 58 : 88;
        setTooltipPos({ x: (nearest as any).x, y: (nearest as any).y - yOffset });
      } else {
        setHoveredMember(null);
        setTooltipPos(null);
      }
    };

    const handlePointerLeave = () => {
      mouseX = -9999;
      mouseY = -9999;
      setHoveredMember(null);
      setTooltipPos(null);
    };

    const handleClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      scatterParticles(e.clientX - rect.left, e.clientY - rect.top);
    };

    canvas.addEventListener('pointermove', handlePointerMove);
    canvas.addEventListener('pointerleave', handlePointerLeave);
    canvas.addEventListener('click', handleClick);

    const startTime = performance.now();

    const loop = (now: number) => {
      const t = (now - startTime) / 1000;
      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);

      const particles = particlesRef.current;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (p.memberIndex === -1) {
          // Unassigned particles (no team formed, or this one didn't land
          // in the current team's silhouette) keep roaming: their own
          // drift anchor keeps evolving every frame, so the resting cloud
          // reads as slowly wandering rather than settling onto a fixed
          // point. Spring/drag/shimmer constants below match the client's
          // own drift physics - a much looser, floatier pull (0.0016) and
          // slower decay (0.94) than a formed particle gets, plus a
          // continuous cosine/sine wobble instead of per-frame random
          // jitter, which is why the resting cloud reads as an ambient
          // haze rather than a nervous shimmer.
          //
          // The target is kept inset from the canvas edges (DRIFT_MARGIN)
          // rather than allowed to reach 0/1: the spring has momentum, so
          // a particle whose *target* sits right on the edge still
          // overshoots slightly past it on every pass, and the stage's
          // overflow-hidden clips that overshoot - which is what read as
          // particles popping in and out right at the top/bottom edge.
          // Insetting the target keeps the whole overshoot range inside
          // the visible canvas.
          p.driftNX += p.driftVX;
          p.driftNY += p.driftVY;
          if (p.driftNX < 0 || p.driftNX > 1) { p.driftVX *= -1; p.driftNX = Math.min(1, Math.max(0, p.driftNX)); }
          if (p.driftNY < 0 || p.driftNY > 1) { p.driftVY *= -1; p.driftNY = Math.min(1, Math.max(0, p.driftNY)); }
          p.targetX = (DRIFT_MARGIN + p.driftNX * (1 - 2 * DRIFT_MARGIN)) * rect.width;
          p.targetY = (DRIFT_MARGIN + p.driftNY * (1 - 2 * DRIFT_MARGIN)) * rect.height;

          p.vx += (p.targetX - p.x) * 0.0016;
          p.vy += (p.targetY - p.y) * 0.0016;
          p.vx += Math.cos(t * 0.55 + p.phase) * 0.085;
          p.vy += Math.sin(t * 0.62 + p.phase * 1.3) * 0.085;
        } else {
          // Formed into a silhouette: a per-particle spring (p.speed, the
          // client's `k`) toward its sampled point, plus the same
          // continuous shimmer and a snappier drag - matches the client's
          // own "formed" physics rather than the flat, much stiffer
          // pull/drag this used to apply to every particle regardless of
          // state, which is why figures used to snap together instantly
          // instead of settling into shape.
          p.vx += (p.targetX - p.x) * p.speed;
          p.vy += (p.targetY - p.y) * p.speed;
          p.vx += Math.cos(t * 0.9 + p.phase) * 0.04;
          p.vy += Math.sin(t * 1.1 + p.phase) * 0.04;
        }

        // Repel from mouse
        const mdx = p.x - mouseX;
        const mdy = p.y - mouseY;
        const mDist = Math.hypot(mdx, mdy);
        if (mDist < 90 && mDist > 0) {
          const repel = ((90 - mDist) / 90) * 8;
          p.vx += (mdx / mDist) * repel;
          p.vy += (mdy / mDist) * repel;
        }

        // Drag applied after the spring/shimmer/repel forces above, same
        // order as the client's own loop - a formed particle decays
        // faster (0.862) than a drifting one (0.94), which is part of what
        // makes a formed figure feel more settled than the ambient cloud.
        const drag = p.memberIndex === -1 ? 0.94 : 0.862;
        p.vx *= drag;
        p.vy *= drag;

        p.x += p.vx;
        p.y += p.vy;

        // Render particle - a plain filled square (fillRect), matching the
        // client's own draw call exactly. Drawing this as a circle via
        // ctx.arc(..., p.size, ...) - the previous approach - makes a dot
        // with *diameter* 2*size, roughly double the client's actual footprint
        // for the same size value, which is why these were reading larger
        // than the reference.
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, p.size, p.size);
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('resize', resize);
      ro.disconnect();
      canvas.removeEventListener('pointermove', handlePointerMove);
      canvas.removeEventListener('pointerleave', handlePointerLeave);
      canvas.removeEventListener('click', handleClick);
      cancelAnimationFrame(animId);
    };
  }, [activeTeam, scatterParticles, updateTargets]);

  // Trust-stat row entrance: the four blocks rise/fade in as a stagger the
  // first time the row crosses into view, and the three numeric ones
  // (4,800 / 98 / 12) roll up from zero at the same time rather than just
  // appearing - the static row otherwise had no motion of its own at all,
  // unlike the rest of the page.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!statsGridRef.current) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const items = statsGridRef.current ? Array.from(statsGridRef.current.children) : [];

      gsap.fromTo(
        items,
        { opacity: 0, y: 18 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: statsGridRef.current,
            start: 'top 88%',
            once: true,
          },
        }
      );

      const counters = { moves: 0, ontime: 0, cities: 0 };

      gsap.to(counters, {
        moves: 4800,
        ontime: 98,
        cities: 12,
        duration: 1.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: statsGridRef.current,
          start: 'top 88%',
          once: true,
        },
        onUpdate: () => {
          if (movesNumRef.current) {
            movesNumRef.current.textContent = Math.floor(counters.moves).toLocaleString();
          }
          if (ontimeNumRef.current) {
            ontimeNumRef.current.textContent = `${Math.floor(counters.ontime)}`;
          }
          if (citiesNumRef.current) {
            citiesNumRef.current.textContent = `${Math.floor(counters.cities)}`;
          }
        },
      });
    }, statsGridRef);

    return () => ctx.revert();
  }, []);

  // Ticker bar + story paragraphs: the rest of the cream field had no
  // motion of its own either - the marquee just appeared fully formed and
  // started scrolling, and the three paragraphs of body copy had nothing
  // beyond what TextReveal already gives the heading above them.
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      if (marqueeRef.current) {
        gsap.fromTo(
          marqueeRef.current,
          { opacity: 0, y: 14 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: marqueeRef.current,
              start: 'top 92%',
              once: true,
            },
          }
        );
      }

      if (storyParasRef.current) {
        const paras = Array.from(storyParasRef.current.children);
        gsap.fromTo(
          paras,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.12,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: storyParasRef.current,
              start: 'top 85%',
              once: true,
            },
          }
        );
      }
    });

    return () => ctx.revert();
  }, []);

  const handleSelectTeam = (key: string) => {
    setActiveTeam(key);
    const canvas = canvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      scatterParticles();
      updateTargets(key, rect.width, rect.height);
    }
  };

  return (
    <section id="who-we-are" className="relative bg-black overflow-hidden border-t border-neutral-800">
      {/* Client-brand cream field: the stats row, ticker and "who we are" story
          block sit on the client site's own paper/ink palette, grain texture
          included. It fades in from black at the top so it reads as part of
          the page, then hands off to the particle bridge below. */}
      <div className="relative pt-20" style={CREAM_FIELD_STYLE}>
        {/* 1. Client Trust Statistics Row - flush on the cream field, no card
            box, matching the client's own borderless stat row */}
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 mb-16">
          <div ref={statsGridRef} className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="space-y-1">
              <div className="font-mono text-3xl sm:text-4xl font-black text-[#0D0B0A] tracking-tight">
                <span ref={movesNumRef}>4,800</span>
                <span className="text-[#D81E27]">+</span>
              </div>
              <div className="text-xs sm:text-sm text-[#6E6459] font-medium leading-snug">
                Moves completed across North Texas
              </div>
            </div>

            <div className="space-y-1 border-l border-[#0D0B0A]/10 pl-4 sm:pl-6">
              <div className="font-mono text-3xl sm:text-4xl font-black text-[#0D0B0A] tracking-tight">
                <span ref={ontimeNumRef}>98</span>
                <span className="text-[#D81E27]">%</span>
              </div>
              <div className="text-xs sm:text-sm text-[#6E6459] font-medium leading-snug">
                Finished on the day promised
              </div>
            </div>

            <div className="space-y-1 border-l-0 md:border-l border-[#0D0B0A]/10 pl-0 md:pl-6">
              <div className="font-mono text-2xl sm:text-3xl font-black text-[#0D0B0A] tracking-tight">
                Licensed
              </div>
              <div className="text-xs sm:text-sm text-[#6E6459] font-medium leading-snug">
                TxDMV &amp; DOT federally certified &amp; insured
              </div>
            </div>

            <div className="space-y-1 border-l border-[#0D0B0A]/10 pl-4 sm:pl-6">
              <div className="font-mono text-3xl sm:text-4xl font-black text-[#0D0B0A] tracking-tight">
                <span ref={citiesNumRef}>12</span>
              </div>
              <div className="text-xs sm:text-sm text-[#6E6459] font-medium leading-snug">
                Cities in the core Texas service area
              </div>
            </div>
          </div>
        </div>

        {/* 2. Moving Services Infinite Marquee Ticker */}
        <div
          ref={marqueeRef}
          className="w-full overflow-hidden py-3 border-y border-[#0D0B0A]/10 bg-[#DFDCD4]/70 mb-20 select-none"
        >
          <div className="flex w-max animate-marquee space-x-8 text-xs font-mono tracking-[0.25em] text-[#6E6459] uppercase font-semibold">
            {[...Array(3)].map((_, i) => (
              <React.Fragment key={i}>
                <span>LOCAL MOVES <i className="text-red-500 not-italic">/</i></span>
                <span>LONG DISTANCE <i className="text-red-500 not-italic">/</i></span>
                <span>COMMERCIAL <i className="text-red-500 not-italic">/</i></span>
                <span>PACKING <i className="text-red-500 not-italic">/</i></span>
                <span>STORAGE <i className="text-red-500 not-italic">/</i></span>
                <span>RESIDENTIAL <i className="text-red-500 not-italic">/</i></span>
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* 3. Who We Are Core Story Block */}
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center gap-3 text-[#D81E27] font-mono text-xs font-bold tracking-[0.18em] uppercase">
                <span>WHO WE ARE</span>
                <span className="h-px flex-1 max-w-[120px] bg-current opacity-30" />
              </div>

              <TextReveal as="h2" className="display-heading display-heading--sub text-[#0D0B0A] leading-[0.92]" variant="flip">
                Founded by Firemen, <br />
                <span className="text-[#D81E27]">run with the same core values.</span>
              </TextReveal>

              <div className="pt-2 text-xs sm:text-sm font-mono tracking-widest text-[#D81E27] uppercase font-semibold">
                Pride &middot; Honor &middot; Integrity &middot; Excellence
              </div>
            </div>

            <div
              ref={storyParasRef}
              className="lg:col-span-5 space-y-4 text-[#0D0B0A]/70 text-sm sm:text-base leading-relaxed"
            >
              <p className="text-[#0D0B0A] font-medium text-base sm:text-lg">
                We don&apos;t send whoever&apos;s available. We send a crew that has drilled the job together before.
              </p>
              <p>
                The same faces loading the truck at 8am are the ones walking the empty house with you at the end of the day. That&apos;s the difference between a move that goes fine and one you never have to worry about again.
              </p>
              <p className="text-xs sm:text-sm text-[#0D0B0A]/55">
                It&apos;s also why the jobs that cannot go wrong — high-value estates, office floors, a wrapped piano down a tight ramp — end up with Firehouse.
              </p>
            </div>
          </div>
        </div>

        {/* 4. Particle bridge: still inside the cream-field div (no gap, no
            separate background) so the transparent top of RELIC_BG_STYLE
            genuinely reveals the cream color behind it - previously this was
            a sibling below the cream field with a margin gap, so that gap
            showed the section's own black background instead, and the
            "transparent" start of the gradient revealed black-on-black
            rather than blending from cream. That mismatch is also why
            particles near the very top/bottom of the stage looked like they
            were popping in and out: their spring physics briefly overshoot
            the canvas edge, and the container's overflow-hidden clips that
            overshoot - fixed below by keeping drift targets inset from the
            edges instead. */}
        <div className="relative mt-10 sm:mt-14">
        <div className="relative h-[440px] sm:h-[520px] md:h-[610px] w-full overflow-hidden">
          <div className="absolute inset-0 z-0" style={RELIC_BG_STYLE} />
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full cursor-crosshair z-10"
            title="Click to scatter particles"
          />

          {/* The client's actual fix for a clean bottom edge isn't just the
              backdrop gradient (RELIC_BG_STYLE/.relic-bg above, which sits
              *behind* the canvas) - it's a second gradient layer sitting
              *on top* of the canvas over just the bottom 20% of the stage
              (.relic-foot), fading the particles themselves out into solid
              coal instead of letting them render at full strength right up
              to a hard clip. Without this layer the canvas just stops
              instantly at its own edge, which is the "not fading out
              properly at the bottom" difference from the reference. */}
          <div
            className="absolute inset-x-0 bottom-0 h-[20%] z-[15] pointer-events-none"
            style={{ background: 'linear-gradient(180deg, rgba(22,19,15,0), #16130F 80%)' }}
          />

          {hoveredMember && tooltipPos && (
            <div
              className="pointer-events-none absolute z-20 -translate-x-1/2 px-3 py-1.5 rounded-xl bg-neutral-900/95 border border-red-500/40 shadow-xl backdrop-blur-md text-center transition-all duration-150"
              style={{ left: tooltipPos.x, top: tooltipPos.y }}
            >
              <div className="text-xs font-bold text-white tracking-wide">{hoveredMember.name}</div>
              <div className="text-[10px] font-mono text-red-400 uppercase tracking-widest">{hoveredMember.role}</div>
            </div>
          )}

          <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 pointer-events-none text-[10px] sm:text-xs font-mono tracking-[0.24em] text-white/40 uppercase z-20">
            {TIP_TEXT[activeTeam] ?? TIP_TEXT.drift}
          </div>
        </div>

        {/* Team Selector - flat, on the same solid coal the particle bridge
            resolves to, matching the client's crew-pick row rather than the
            boxed grid-of-cards look this used to have. */}
        <div className="bg-[#16130F] -mt-px px-4 sm:px-6 pt-2 pb-12 sm:pb-16 flex flex-wrap gap-2.5 justify-center">
          {TEAM_ORDER.map(({ key, num, label, count }) => (
            <button
              key={key}
              type="button"
              onClick={() => handleSelectTeam(key)}
              className={`relative flex items-center gap-3.5 px-5 py-3.5 font-mono text-sm tracking-wide border transition-all duration-300 ${
                activeTeam === key
                  ? 'bg-[#D81E27] text-white border-[#D81E27] shadow-[0_12px_30px_-10px_rgba(216,30,39,0.4)]'
                  : 'bg-white/[0.035] text-[#CFC8BD] border-white/[0.17] hover:text-white hover:border-[#D81E27]'
              }`}
            >
              <em
                className={`not-italic text-[11px] tracking-[0.2em] ${
                  activeTeam === key ? 'text-white/70' : 'text-[#D81E27]'
                }`}
              >
                {num}
              </em>
              <span className="font-semibold">{label}</span>
              <i
                className={`not-italic text-[10.5px] tracking-[0.14em] border rounded-full px-2.5 py-0.5 font-mono tabular-nums ${
                  activeTeam === key ? 'text-white border-white/45' : 'text-[#8B8377] border-white/20'
                }`}
              >
                {count}
              </i>
            </button>
          ))}

          <button
            type="button"
            onClick={() => handleSelectTeam('drift')}
            className={`relative flex items-center gap-3 ml-2 px-5 py-3.5 font-mono text-sm tracking-wide border border-dashed transition-all duration-300 ${
              activeTeam === 'drift'
                ? 'border-white/[0.34] text-[#EDEBE6]'
                : 'border-white/[0.17] text-[#8B8377] hover:text-[#EDEBE6] hover:border-white/[0.42]'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                activeTeam === 'drift' ? 'bg-[#D81E27] animate-pulse' : 'bg-[#6E6459]'
              }`}
            />
            <span className="font-semibold">Let them drift</span>
          </button>
        </div>
      </div>
      </div>
    </section>
  );
};

export default ClientWhoWeAreSection;

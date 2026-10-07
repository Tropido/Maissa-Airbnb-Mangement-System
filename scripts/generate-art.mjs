/**
 * Generates the art-directed placeholder imagery for the marketing site.
 *
 * WHY THIS EXISTS
 * ---------------
 * The brief specifies real property photography sourced from Maissa's own
 * shoots. Until those files land, the layout still has to be judged at full
 * fidelity, and the 360 spin viewer has to be judged with a sequence that
 * actually rotates. So this renders the scene properly: a perspective
 * projection of each house, swept through 24 azimuths.
 *
 * Each listing gets its own massing — the Djerba courtyard house and the
 * Ezzahra terrace loft — so the two homes do not read as one building
 * recoloured twice. They are plainly architectural studies, not photographs,
 * and the site labels them as such until the real shoots land.
 *
 * Everything is drawn in the burgundy / blush palette of the redesign so it
 * reads as deliberate art direction rather than stock filler.
 *
 * REPLACING THESE
 * ---------------
 * Drop real photography at the same paths:
 *   public/images/listings/<slug>/hero.(jpg|webp)
 *   public/images/listings/<slug>/g1..g6.(jpg|webp)
 *   public/images/spin/<slug>/00..23.(jpg|webp)
 * then update hero_photo_url / gallery_urls / spin_photo_urls in
 * src/lib/data/seed.ts (or the listings table) to the new extensions, and
 * remove the dangerouslyAllowSVG block from next.config.mjs.
 *
 * Run: node scripts/generate-art.mjs
 */

import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const PUBLIC = join(ROOT, 'public', 'images');

/* ------------------------------------------------------------------ */
/* Palette                                                             */
/* ------------------------------------------------------------------ */

// Mirrors src/lib/tokens.ts (ink, bg, accent, primary, bg-raised).
const INK = '#1A0A0F';
const BG = '#F6E6EA';
const ACCENT = '#C98FA0';
const PRIMARY = '#8E4257';
const WHITE = '#FFFBFC';

/**
 * Face shading ramp, sunlit to shadow. The steps are spread wide on purpose —
 * a narrow ramp turned the whole building into one flat grey mass.
 */
const SHADES = [WHITE, '#EFDCE1', '#DCC3CA', '#C4A7B0'];

/* ------------------------------------------------------------------ */
/* Maths                                                               */
/* ------------------------------------------------------------------ */

const rad = (deg) => (deg * Math.PI) / 180;
const n1 = (v) => Number(v.toFixed(1));

function project(p, cam) {
  const { azimuth, pitch, distance, focal, cx, cy } = cam;
  const ca = Math.cos(azimuth);
  const sa = Math.sin(azimuth);
  const x1 = p[0] * ca + p[2] * sa;
  const z1 = -p[0] * sa + p[2] * ca;

  const cp = Math.cos(pitch);
  const sp = Math.sin(pitch);
  const y2 = p[1] * cp - z1 * sp;
  const z2 = p[1] * sp + z1 * cp;

  const depth = Math.max(distance - z2, 0.6);
  const scale = focal / depth;
  return { x: cx + x1 * scale, y: cy - y2 * scale, depth, scale };
}

const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const cross = (a, b) => [
  a[1] * b[2] - a[2] * b[1],
  a[2] * b[0] - a[0] * b[2],
  a[0] * b[1] - a[1] * b[0],
];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const unit = (a) => {
  const l = Math.hypot(a[0], a[1], a[2]) || 1;
  return [a[0] / l, a[1] / l, a[2] / l];
};
const lerp3 = (a, b, t) => [
  a[0] + (b[0] - a[0]) * t,
  a[1] + (b[1] - a[1]) * t,
  a[2] + (b[2] - a[2]) * t,
];

/** Bilinear point inside a world-space quad — used to inset windows into a face. */
const onFace = (quad, u, v) => lerp3(lerp3(quad[0], quad[1], u), lerp3(quad[3], quad[2], u), v);

const LIGHT = unit([-0.5, 0.68, 0.54]);

function shadeFor(quad) {
  const normal = unit(cross(sub(quad[1], quad[0]), sub(quad[2], quad[0])));
  if (normal[1] > 0.75) return SHADES[0];
  const lambert = Math.abs(dot(normal, LIGHT));
  if (lambert > 0.62) return SHADES[0];
  if (lambert > 0.36) return SHADES[1];
  if (lambert > 0.14) return SHADES[2];
  return SHADES[3];
}

/* ------------------------------------------------------------------ */
/* Geometry primitives                                                 */
/* ------------------------------------------------------------------ */

/**
 * Axis-aligned box -> five world-space quads (no floor face).
 * Every side quad is wound bottom-left, bottom-right, top-right, top-left, so
 * `onFace(quad, u, v)` has u running along the wall and v running up it.
 */
function boxFaces(x, y, z, w, h, d) {
  const x0 = x - w / 2;
  const x1 = x + w / 2;
  const y0 = y;
  const y1 = y + h;
  const z0 = z - d / 2;
  const z1 = z + d / 2;
  return {
    front: [
      [x0, y0, z1],
      [x1, y0, z1],
      [x1, y1, z1],
      [x0, y1, z1],
    ],
    back: [
      [x1, y0, z0],
      [x0, y0, z0],
      [x0, y1, z0],
      [x1, y1, z0],
    ],
    right: [
      [x1, y0, z1],
      [x1, y0, z0],
      [x1, y1, z0],
      [x1, y1, z1],
    ],
    left: [
      [x0, y0, z0],
      [x0, y0, z1],
      [x0, y1, z1],
      [x0, y1, z0],
    ],
    top: [
      [x0, y1, z1],
      [x1, y1, z1],
      [x1, y1, z0],
      [x0, y1, z0],
    ],
  };
}

/**
 * A building volume: the box plus optional glazing on named faces.
 * `glazing.front = [[u0, v0, u1, v1], ...]` in face-local coordinates.
 */
function volume(dims, glazing = {}) {
  const faces = boxFaces(...dims);
  const parts = [];
  for (const [name, quad] of Object.entries(faces)) {
    parts.push({ kind: 'quad', quad, fill: shadeFor(quad) });
    for (const win of glazing[name] ?? []) {
      const [u0, v0, u1, v1] = win;
      parts.push({
        kind: 'quad',
        // Nudged fractionally proud of the wall so it never z-fights with it.
        quad: [
          onFace(quad, u0, v0),
          onFace(quad, u1, v0),
          onFace(quad, u1, v1),
          onFace(quad, u0, v1),
        ].map((p, _, arr) => nudge(p, quad, arr)),
        fill: INK,
        detail: true,
      });
    }
  }
  return parts;
}

/** Push a point 1.5cm along its face normal, away from the wall. */
function nudge(point, quad) {
  const normal = unit(cross(sub(quad[1], quad[0]), sub(quad[2], quad[0])));
  return [point[0] + normal[0] * 0.02, point[1] + normal[1] * 0.02, point[2] + normal[2] * 0.02];
}

/** Flat quad lying on the ground plane. */
const ground = (x0, z0, x1, z1, y = 0.02) => [
  [x0, y, z1],
  [x1, y, z1],
  [x1, y, z0],
  [x0, y, z0],
];

/* ------------------------------------------------------------------ */
/* Scene variants                                                      */
/* ------------------------------------------------------------------ */

/**
 * One massing per listing. Volumes are listed roughly back to front; the
 * renderer depth-sorts them properly regardless.
 */
const SCENES = {
  /** Djerba: single-storey courtyard house, thick walls, roof terrace parapet. */
  courtyard: {
    horizonFill: BG,
    volumes: [
      // Three wings around an open courtyard.
      () => volume([-2.9, 0, -0.6, 2.4, 2.9, 5.2], {
        front: [[0.18, 0.12, 0.44, 0.62], [0.58, 0.12, 0.84, 0.62]],
        right: [[0.22, 0.14, 0.42, 0.6]],
      }),
      () => volume([1.4, 0, -2.6, 6.2, 2.9, 2.3], {
        front: [[0.12, 0.14, 0.3, 0.62], [0.4, 0.14, 0.58, 0.62], [0.68, 0.14, 0.86, 0.62]],
      }),
      () => volume([3.9, 0, 1.1, 2.0, 2.6, 3.2], {
        front: [[0.24, 0.16, 0.72, 0.64]],
        left: [[0.3, 0.16, 0.66, 0.6]],
      }),
      // Roof parapets — what makes it read as a flat-roofed North African house.
      () => volume([-2.9, 2.9, -0.6, 2.6, 0.35, 5.4]),
      () => volume([1.4, 2.9, -2.6, 6.4, 0.35, 2.5]),
      // Boundary wall along the lane.
      () => volume([0.6, 0, 3.4, 9.4, 1.05, 0.3]),
    ],
    plot: ground(-9.5, -6.5, 9.5, 7.0, 0.0),
    terrace: ground(-4.4, -0.2, 5.2, 3.2),
    pool: null,
    door: { at: [3.9, 0, 2.72], height: 1.95, width: 0.9 },
    props: [[2.6, 0, 2.0, 1.7, 0.45, 0.7], [2.6, 0.45, 1.75, 1.7, 0.55, 0.12]],
    trees: [
      { kind: 'palm', at: [-5.6, 0, 1.6], h: 5.0 },
      { kind: 'palm', at: [5.9, 0, -1.2], h: 4.2 },
      { kind: 'palm', at: [-1.2, 0, 4.6], h: 4.6 },
    ],
  },


  /** Ezzahra: top-floor loft set back over the floor below, terrace on the gulf. */
  loft: {
    horizonFill: ACCENT,
    volumes: [
      () => volume([0, 0, 0, 6.4, 2.6, 4.2], {
        front: [[0.1, 0.16, 0.3, 0.7], [0.42, 0.16, 0.62, 0.7]],
      }),
      () => volume([-1.3, 2.6, -0.9, 3.4, 2.5, 2.4], {
        front: [[0.12, 0.12, 0.88, 0.8]],
        right: [[0.2, 0.14, 0.78, 0.76]],
      }),
      // Terrace parapet — the reason to book it.
      () => volume([1.9, 2.6, 0.9, 2.6, 0.9, 2.4]),
      () => volume([-1.3, 2.6, 2.05, 3.4, 0.9, 0.2]),
      // Pergola over the terrace.
      () => volume([1.9, 5.0, 0.9, 2.8, 0.16, 2.6]),
      () => volume([0.7, 2.6, -0.2, 0.16, 2.4, 0.16]),
      () => volume([3.1, 2.6, -0.2, 0.16, 2.4, 0.16]),
      () => volume([0.7, 2.6, 2.0, 0.16, 2.4, 0.16]),
      () => volume([3.1, 2.6, 2.0, 0.16, 2.4, 0.16]),
      () => volume([0.4, 0, 3.2, 8.0, 1.1, 0.28]),
    ],
    plot: ground(-9.5, -6.0, 9.5, 6.5, 0.0),
    terrace: ground(-4.6, -0.4, 5.0, 3.1),
    pool: null,
    door: { at: [-1.9, 0, 2.12], height: 1.95, width: 0.9 },
    props: [[1.9, 3.5, 0.9, 1.5, 0.4, 0.7], [1.9, 3.9, 0.62, 1.5, 0.5, 0.12]],
    trees: [
      { kind: 'palm', at: [-5.4, 0, 1.2], h: 4.4 },
      { kind: 'palm', at: [5.6, 0, 0.4], h: 5.0 },
    ],
  },

};

/* ------------------------------------------------------------------ */
/* Trees                                                               */
/* ------------------------------------------------------------------ */

const pts = (arr) => arr.map((p) => `${n1(p.x)},${n1(p.y)}`).join(' ');

function palmSvg(base, top) {
  const span = Math.abs(base.y - top.y);
  const spread = span * 0.34;
  const trunkW = Math.max(span * 0.035, 2);
  const lean = span * 0.09;

  const trunk =
    `<path d="M ${n1(base.x - trunkW)} ${n1(base.y)} ` +
    `Q ${n1(base.x + lean * 0.4)} ${n1((base.y + top.y) / 2)} ${n1(top.x - trunkW * 0.45)} ${n1(top.y)} ` +
    `L ${n1(top.x + trunkW * 0.45)} ${n1(top.y)} ` +
    `Q ${n1(base.x + lean * 0.4 + trunkW * 1.6)} ${n1((base.y + top.y) / 2)} ${n1(base.x + trunkW)} ${n1(base.y)} Z" ` +
    `fill="${SHADES[2]}" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>`;

  const fronds = [];
  for (let i = 0; i < 9; i += 1) {
    const a = rad(-172 + i * 21.5);
    const ex = top.x + Math.cos(a) * spread;
    const ey = top.y + Math.sin(a) * spread * 0.78;
    const mx = top.x + Math.cos(a) * spread * 0.6;
    const my = top.y + Math.sin(a) * spread * 0.6 - spread * 0.3;
    const w = spread * 0.13;
    fronds.push(
      `<path d="M ${n1(top.x)} ${n1(top.y)} Q ${n1(mx)} ${n1(my - w)} ${n1(ex)} ${n1(ey)} ` +
        `Q ${n1(mx)} ${n1(my + w)} ${n1(top.x)} ${n1(top.y)} Z" ` +
        `fill="${SHADES[1]}" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>`,
    );
  }
  return trunk + fronds.join('');
}

function pineSvg(base, top) {
  const span = Math.abs(base.y - top.y);
  const trunkW = Math.max(span * 0.03, 2);
  const layers = 4;
  const parts = [
    `<rect x="${n1(base.x - trunkW)}" y="${n1(base.y - span * 0.22)}" width="${n1(trunkW * 2)}" height="${n1(span * 0.24)}" fill="${SHADES[3]}" stroke="${INK}" stroke-width="2.5"/>`,
  ];
  for (let i = 0; i < layers; i += 1) {
    const t = i / layers;
    const cy = base.y - span * (0.2 + t * 0.72);
    const halfW = span * (0.3 - t * 0.19);
    const h = span * 0.32;
    parts.push(
      `<polygon points="${n1(base.x)},${n1(cy - h)} ${n1(base.x + halfW)},${n1(cy)} ${n1(base.x - halfW)},${n1(cy)}" ` +
        `fill="${i % 2 === 0 ? SHADES[1] : SHADES[2]}" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>`,
    );
  }
  return parts.join('');
}

/* ------------------------------------------------------------------ */
/* Renderer                                                            */
/* ------------------------------------------------------------------ */

/** Every world-space point in a scene, for camera fitting. */
function scenePoints(scene) {
  const points = [];
  const add = (quad) => quad.forEach((p) => points.push(p));
  // The plot is deliberately excluded from the fit: it is context, and letting
  // it drive the framing would shrink the house to a dot in the middle.
  if (scene.terrace) add(scene.terrace);
  if (scene.pool) add(scene.pool);
  for (const build of scene.volumes) for (const part of build()) add(part.quad);
  for (const dims of scene.props ?? []) for (const face of Object.values(boxFaces(...dims))) add(face);
  for (const tree of scene.trees) {
    points.push(tree.at, [tree.at[0], tree.h, tree.at[2]]);
    // Crown spread, so a palm's fronds are never clipped by the frame.
    const r = tree.h * (tree.kind === 'pine' ? 0.3 : 0.34);
    points.push([tree.at[0] - r, tree.h * 0.86, tree.at[2]], [tree.at[0] + r, tree.h * 0.86, tree.at[2]]);
  }
  return points;
}

/**
 * Fits the camera to the scene once, across every azimuth the sequence will
 * use, and returns a focal length and centre shared by all of them.
 *
 * Fitting each frame independently would make the building breathe in and out
 * as the spin viewer scrubs, which reads as a bug rather than a rotation.
 */
function fitCamera({ scene, width, height, azimuths, pitchDeg, distance, pad = 0.88 }) {
  const points = scenePoints(scene);
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;

  for (const azimuthDeg of azimuths) {
    const probe = {
      azimuth: rad(azimuthDeg),
      pitch: rad(pitchDeg),
      distance,
      focal: 1,
      cx: 0,
      cy: 0,
    };
    for (const p of points) {
      const { x, y } = project(p, probe);
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }

  const focal = Math.min(
    (width * pad) / Math.max(maxX - minX, 1e-6),
    (height * pad) / Math.max(maxY - minY, 1e-6),
  );

  return {
    focal,
    cx: width / 2 - ((minX + maxX) / 2) * focal,
    cy: height / 2 - ((minY + maxY) / 2) * focal,
  };
}

function renderScene({ scene, width, height, azimuthDeg, pitchDeg, fit, distance = 26 }) {
  const cam = {
    azimuth: rad(azimuthDeg),
    pitch: rad(pitchDeg),
    distance,
    focal: fit.focal,
    cx: fit.cx,
    cy: fit.cy,
  };

  // The ground plane's vanishing line, derived rather than guessed: a point at
  // (0, 0, -infinity) lands at cy - focal * tan(pitch).
  const horizonY = Math.max(0, Math.min(height, cam.cy - cam.focal * Math.tan(cam.pitch)));

  const items = [];
  const push = (depth, svg) => items.push({ depth, svg });
  const quadSvg = (projected, fill, strokeWidth = 2.5) =>
    `<polygon points="${pts(projected)}" fill="${fill}" stroke="${INK}" stroke-width="${strokeWidth}" stroke-linejoin="round"/>`;
  const meanDepth = (projected) =>
    projected.reduce((s, p) => s + p.depth, 0) / projected.length;

  // Ground plot, then the terrace slab, then the pool on top of it.
  if (scene.plot) {
    const p = scene.plot.map((v) => project(v, cam));
    push(meanDepth(p) + 1.4, quadSvg(p, seaViewScene(scene) ? SHADES[1] : SHADES[2]));
  }
  if (scene.terrace) {
    const p = scene.terrace.map((v) => project(v, cam));
    push(meanDepth(p) + 0.6, quadSvg(p, SHADES[1]));
  }
  if (scene.pool) {
    const p = scene.pool.map((v) => project(v, cam));
    push(meanDepth(p) + 0.4, quadSvg(p, ACCENT));
  }

  // Building volumes.
  for (const build of scene.volumes) {
    for (const part of build()) {
      const p = part.quad.map((v) => project(v, cam));
      // Drop faces that project to nothing — a wall seen exactly edge-on.
      const area = Math.abs(
        p.reduce((sum, q, i) => {
          const r = p[(i + 1) % p.length];
          return sum + (q.x * r.y - r.x * q.y);
        }, 0) / 2,
      );
      if (area < 4) continue;
      push(meanDepth(p) - (part.detail ? 0.05 : 0), quadSvg(p, part.fill, part.detail ? 2 : 2.5));
    }
  }

  // The primary-coloured accents: terrace furniture, plus the front door when
  // the facade happens to be facing the camera.
  for (const dims of scene.props ?? []) {
    for (const face of Object.values(boxFaces(...dims))) {
      const pr = face.map((v) => project(v, cam));
      const area = Math.abs(
        pr.reduce((sum, q, i) => {
          const r = pr[(i + 1) % pr.length];
          return sum + (q.x * r.y - r.x * q.y);
        }, 0) / 2,
      );
      if (area < 2) continue;
      push(meanDepth(pr) - 0.25, quadSvg(pr, PRIMARY, 2));
    }
  }


  if (scene.door) {
    const { at, height: dh, width: dw } = scene.door;
    const quad = [
      [at[0] - dw / 2, 0.01, at[2]],
      [at[0] + dw / 2, 0.01, at[2]],
      [at[0] + dw / 2, dh, at[2]],
      [at[0] - dw / 2, dh, at[2]],
    ];
    const p = quad.map((v) => project(v, cam));
    push(meanDepth(p) - 0.12, quadSvg(p, PRIMARY, 2.5));
  }

  // Trees, depth-sorted with everything else so they can sit behind the house.
  for (const tree of scene.trees) {
    const base = project(tree.at, cam);
    const top = project([tree.at[0], tree.h, tree.at[2]], cam);
    push(base.depth, tree.kind === 'pine' ? pineSvg(base, top) : palmSvg(base, top));
  }

  items.sort((a, b) => b.depth - a.depth);

  // Ezzahra looks over the gulf, so its backdrop is the sea rather than sky.
  const seaView = seaViewScene(scene);

  // At these pitches the camera looks down on the house, so the ground's
  // vanishing line usually sits above the frame. When it does, there is simply
  // no horizon to draw and the backdrop is sky all the way down — which is what
  // a tight architectural view actually looks like.
  const horizonVisible = horizonY > 4 && horizonY < height - 4;
  const hy = n1(horizonY);

  const backdrop = horizonVisible
    ? `<rect width="${width}" height="${hy}" fill="url(#sky)"/>
    <rect y="${hy}" width="${width}" height="${n1(height - horizonY)}" fill="${SHADES[2]}"/>
    <line x1="0" y1="${hy}" x2="${width}" y2="${hy}" stroke="${INK}" stroke-width="2.5"/>`
    : `<rect width="${width}" height="${height}" fill="url(#sky)"/>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" role="img" aria-label="Architectural study of the property">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${ACCENT}"/>
      <stop offset="${seaView ? '100%' : '78%'}" stop-color="${seaView ? ACCENT : BG}"/>
    </linearGradient>
    <clipPath id="frame"><rect width="${width}" height="${height}"/></clipPath>
  </defs>
  <g clip-path="url(#frame)">
    ${backdrop}
    ${items.map((i) => i.svg).join('\n    ')}
  </g>
</svg>
`;
}

const seaViewScene = (scene) => scene.horizonFill === ACCENT;

/* ------------------------------------------------------------------ */
/* Output                                                              */
/* ------------------------------------------------------------------ */

const write = (relPath, contents) => {
  const full = join(PUBLIC, relPath);
  mkdirSync(dirname(full), { recursive: true });
  writeFileSync(full, contents, 'utf8');
};

const LISTINGS = [
  { slug: 'djerba-villa', scene: 'courtyard', azimuth: 34, pitch: 22 },
  { slug: 'ezzahra-apartment-loft', scene: 'loft', azimuth: 316, pitch: 20 },
];

let count = 0;

const SPIN_FRAMES = 24;

for (const { slug, scene: sceneKey, azimuth, pitch } of LISTINGS) {
  const scene = SCENES[sceneKey];

  // Every azimuth the spin sequence will visit, so the fitted camera holds
  // steady while the building turns.
  const spinAzimuths = Array.from({ length: SPIN_FRAMES }, (_, i) => azimuth + i * 15);

  const heroFit = fitCamera({
    scene,
    width: 1600,
    height: 1000,
    azimuths: [azimuth],
    pitchDeg: pitch,
    distance: 26,
    pad: 0.82,
  });
  write(
    `listings/${slug}/hero.svg`,
    renderScene({ scene, width: 1600, height: 1000, azimuthDeg: azimuth, pitchDeg: pitch, fit: heroFit }),
  );
  count += 1;

  const galleryViews = [
    { a: azimuth + 42, p: pitch + 5 },
    { a: azimuth - 58, p: pitch - 5 },
    { a: azimuth + 128, p: pitch + 9 },
    { a: azimuth + 190, p: pitch - 7 },
    { a: azimuth - 104, p: pitch + 14 },
    { a: azimuth + 78, p: pitch + 1 },
  ];
  galleryViews.forEach((v, i) => {
    const pitchDeg = Math.max(v.p, 9);
    const fit = fitCamera({
      scene,
      width: 1200,
      height: 900,
      azimuths: [v.a],
      pitchDeg,
      distance: 26,
      pad: 0.84,
    });
    write(
      `listings/${slug}/g${i + 1}.svg`,
      renderScene({ scene, width: 1200, height: 900, azimuthDeg: v.a, pitchDeg, fit }),
    );
    count += 1;
  });

  const spinFit = fitCamera({
    scene,
    width: 1200,
    height: 800,
    azimuths: spinAzimuths,
    pitchDeg: pitch,
    distance: 26,
    pad: 0.84,
  });
  spinAzimuths.forEach((a, i) => {
    write(
      `spin/${slug}/${String(i).padStart(2, '0')}.svg`,
      renderScene({ scene, width: 1200, height: 800, azimuthDeg: a, pitchDeg: pitch, fit: spinFit }),
    );
    count += 1;
  });
}

/* Host avatar — a plain placeholder silhouette, cropped to a circle on the site. */
write(
  'hosts/maissa.svg',
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400" role="img" aria-label="Portrait placeholder for Maissa">
  <rect width="400" height="400" fill="${ACCENT}"/>
  <circle cx="200" cy="164" r="62" fill="${WHITE}" stroke="${INK}" stroke-width="5"/>
  <path d="M 72 400 C 72 300 132 252 200 252 C 268 252 328 300 328 400 Z" fill="${WHITE}" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>
</svg>
`,
);
count += 1;

console.log(`Wrote ${count} placeholder assets to public/images/`);

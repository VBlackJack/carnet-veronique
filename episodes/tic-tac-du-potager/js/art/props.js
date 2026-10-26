/*
 * Copyright 2026 Julien Bombled
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// Props drawn the same way in the tableaux, the rebus bubbles and the sketchbook cards:
// Veronique's pink watch, the squashes and their crate, the soap dish, the compost bin,
// the lantern, the hens, the frog, the crow and the fishing lure.
(function () {
  const A = CH.art, P = A.P;
  const f = (n) => Math.round(n * 10) / 10;

  const COL = {
    strap: "#d9a5a0",
    strapDark: "#b07a70",
    face: "#fbf6ea",
    skin: "#ecbfa6",
    skinPale: "#f8e2d2",
    squash: ["#e07a2a", "#d9661f", "#e8a03a", "#c9752e", "#9aa05a"],
    rib: "#a8501c",
    stem: "#5f6b45",
    water: "#7fa8b0",
    waterDeep: "#5d8890",
    soap: "#efe6c8",
    dish: "#b0835a",
    compost: "#5a4030",
    pulp: "#e8913a",
    glow: "#ffd25a",
    hen: "#b5562f",
    henLight: "#d9824a",
    comb: "#d0302a",
    frog: "#6f9a3a",
    frogLight: "#a8c46a",
    crow: "#1f1c22",
    lure: "#d0302a",
    leaf: [P.leafRed, P.leafGold, P.ochre, P.rust, "#8c4a2a"],
    sun: "#ffb85a",
    smokeCard: "#8f8a80",
  };

  // Veronique's watch: pink strap, round cream face. Centred on the face; o.rot turns it.
  function watch(x, y, s = 1, o = {}) {
    let r = `<rect x="${f(x - 7 * s)}" y="${f(y - 28 * s)}" width="${f(14 * s)}" height="${f(56 * s)}" rx="${f(5 * s)}" fill="${COL.strap}" stroke="${P.ink}" stroke-width="${f(2 * s)}"/>`;
    [16, 21].forEach((d) => (r += `<circle cx="${f(x)}" cy="${f(y + d * s)}" r="${f(1.4 * s)}" fill="${COL.strapDark}"/>`));
    r += `<rect x="${f(x + 12 * s)}" y="${f(y - 3 * s)}" width="${f(5 * s)}" height="${f(6 * s)}" rx="${f(1 * s)}" fill="${COL.strapDark}" stroke="${P.ink}" stroke-width="${f(1.2 * s)}"/>`;
    r += `<circle cx="${f(x)}" cy="${f(y)}" r="${f(13 * s)}" fill="${COL.face}" stroke="${COL.strapDark}" stroke-width="${f(3.4 * s)}"/>`;
    r += `<circle cx="${f(x)}" cy="${f(y)}" r="${f(14.8 * s)}" fill="none" stroke="${P.ink}" stroke-width="${f(1.2 * s)}"/>`;
    r += `<path d="M${f(x)} ${f(y)}V${f(y - 8 * s)}M${f(x)} ${f(y)}L${f(x + 6 * s)} ${f(y + 3 * s)}" stroke="${P.ink}" stroke-width="${f(1.8 * s)}" stroke-linecap="round"/>`;
    r += `<path d="M${f(x - 7 * s)} ${f(y - 6 * s)}q${f(3 * s)} ${f(-3 * s)} ${f(7 * s)} ${f(-3 * s)}" stroke="#ffffff" stroke-width="${f(1.6 * s)}" fill="none" opacity=".9"/>`;
    return o.rot ? `<g transform="rotate(${o.rot} ${f(x)} ${f(y)})">${r}</g>` : r;
  }

  // A forearm seen from above, the hand to the right. o.band leaves the pale mark of a
  // watch that is no longer there; o.watch wears it.
  function wrist(x, y, s = 1, o = {}) {
    let r = A.sh(A.soft([[x - 70 * s, y - 16 * s], [x + 30 * s, y - 14 * s], [x + 30 * s, y + 14 * s], [x - 70 * s, y + 18 * s]], 1), COL.skin, { sw: 2.4 * s });
    r += A.sh(A.blob(x + 46 * s, y, 22 * s, 17 * s, 0.06, 10), COL.skin, { sw: 2.4 * s });
    [-9, -3, 3, 9].forEach((dy) => (r += A.ink(A.line(x + 56 * s, y + dy * s, x + 72 * s, y + dy * 1.2 * s, 0.3), 2 * s, { op: 0.5 })));
    if (o.band) r += `<rect x="${f(x + 4 * s)}" y="${f(y - 15 * s)}" width="${f(13 * s)}" height="${f(30 * s)}" rx="${f(3 * s)}" fill="${COL.skinPale}" stroke="${P.inkSoft}" stroke-width="${f(1 * s)}" stroke-dasharray="3 3"/>`;
    if (o.watch) r += watch(x + 10 * s, y, 0.6 * s, { rot: 0 });
    return r;
  }

  // A squash or pumpkin, centred on (x, y), radius r.
  function squash(x, y, r, i = 0) {
    A.srand(300 + i);
    const col = COL.squash[i % COL.squash.length];
    let s = A.sh(A.blob(x, y, r * 1.18, r * 0.86, 0.05, 12), col, { sw: Math.max(1.6, r * 0.09) });
    for (const k of [-0.5, 0, 0.5]) s += A.ink(A.curve([[x + k * r * 0.4, y - r * 0.8], [x + k * r * 1.1, y], [x + k * r * 0.4, y + r * 0.8]], 0.4), Math.max(1, r * 0.06), { stroke: COL.rib, op: 0.7 });
    s += A.sh(A.soft([[x - r * 0.1, y - r * 0.78], [x - r * 0.05, y - r * 1.1], [x + r * 0.16, y - r * 1.16], [x + r * 0.12, y - r * 0.8]], 0.3), COL.stem, { sw: Math.max(1.2, r * 0.06) });
    return s;
  }

  // Slatted wooden crate, base centre on (x, y). o.squashes peek over the top; o.straw
  // lines it; o.upturned shows it empty, upside down.
  function crate(x, y, w, h, o = {}) {
    A.srand(o.seed || 61);
    let r = "";
    if (!o.upturned) {
      r += A.sh(A.rect(x - w / 2, y - h, w, h, 1), P.woodDark, { sw: 2.4 });
      if (o.straw) for (let i = 0; i < 9; i++) {
        const sx = x - w / 2 + 6 + A.rnd() * (w - 12);
        r += A.ink(A.curve([[sx, y - h + 4], [sx + A.jit(8), y - h - 8 - A.rnd() * 6], [sx + A.jit(14), y - h - 14 - A.rnd() * 8]], 0.4), 2, { stroke: P.straw });
      }
      for (let i = 0; i < (o.squashes || 0); i++) {
        const rr = h * 0.42;
        r += squash(x - w / 2 + rr * 1.2 + i * ((w - rr * 2.4) / Math.max(1, o.squashes - 1)), y - h + 2, rr, i + 1);
      }
    }
    const slats = o.upturned ? [0.05, 0.38, 0.71] : [0.12, 0.45, 0.78];
    for (const k of slats) r += A.sh(A.rect(x - w / 2, y - h + k * h, w, h * 0.22, 0.6), P.woodLight, { sw: 2.2 });
    r += A.sh(A.rect(x - w / 2 - 4, y - h - 2, 12, h + 2, 0.5), P.wood, { sw: 2.2 }) + A.sh(A.rect(x + w / 2 - 8, y - h - 2, 12, h + 2, 0.5), P.wood, { sw: 2.2 });
    return r;
  }

  // Wooden soap dish with a bar of soap. o.print presses the watch into the soap;
  // o.tipped leaves it tilted over the edge.
  function soapDish(x, y, s = 1, o = {}) {
    let r = A.sh(A.soft([[x - 30 * s, y - 10 * s], [x + 30 * s, y - 10 * s], [x + 24 * s, y + 4 * s], [x - 24 * s, y + 4 * s]], 0.5), COL.dish, { sw: 2.2 * s });
    r += A.sh(A.blob(x, y - 16 * s, 22 * s, 9 * s, 0.05, 10), COL.soap, { sw: 2 * s });
    if (o.print) {
      r += `<circle cx="${f(x)}" cy="${f(y - 16 * s)}" r="${f(5.4 * s)}" fill="#e2d6b0" stroke="#a89870" stroke-width="${f(1.4 * s)}"/>`;
      r += `<path d="M${f(x - 19 * s)} ${f(y - 16 * s)}H${f(x - 7 * s)}M${f(x + 7 * s)} ${f(y - 16 * s)}H${f(x + 19 * s)}" stroke="#a89870" stroke-width="${f(3.4 * s)}" stroke-linecap="round" stroke-dasharray="${f(2.6 * s)} ${f(1.4 * s)}"/>`;
      r += `<path d="M${f(x)} ${f(y - 16 * s)}V${f(y - 19.5 * s)}M${f(x)} ${f(y - 16 * s)}l${f(2.6 * s)} ${f(1.4 * s)}" stroke="#a89870" stroke-width="${f(0.8 * s)}"/>`;
    }
    return o.tipped ? `<g transform="rotate(14 ${f(x - 26 * s)} ${f(y + 4 * s)})">${r}</g>` : r;
  }

  // Slatted compost bin, base centre on (x, y): a mound of peelings, straw and pulp.
  function compostBin(x, y, w, h, o = {}) {
    A.srand(71);
    let r = A.sh(A.rect(x - w / 2, y - h, w, h, 1), P.mudDark, { sw: 2.4 });
    if (!o.empty) {
      r += A.sh(A.soft([[x - w / 2 + 4, y - h + 20], [x - w * 0.3, y - h - 16], [x, y - h - 28], [x + w * 0.3, y - h - 14], [x + w / 2 - 4, y - h + 20]], 2), COL.compost, { sw: 2.2 });
      for (let i = 0; i < 9; i++) r += A.sh(A.blob(x - w * 0.36 + A.rnd() * w * 0.72, y - h - 12 + A.rnd() * 22, 7 + A.rnd() * 5, 4 + A.rnd() * 3, 0.1, 8), i % 3 ? COL.pulp : P.straw, { sw: 1.4 });
      for (let i = 0; i < 6; i++) {
        const sx = x - w * 0.36 + A.rnd() * w * 0.72;
        r += A.ink(A.curve([[sx, y - h - 6], [sx + A.jit(10), y - h - 18], [sx + A.jit(16), y - h - 26]], 0.4), 2, { stroke: P.straw });
      }
    }
    for (let i = 0; i < 4; i++) r += A.sh(A.rect(x - w / 2, y - h + 8 + i * (h / 4), w, h / 4 - 10, 0.6), i % 2 ? P.wood : P.woodLight, { sw: 2.2 });
    r += A.sh(A.rect(x - w / 2 - 6, y - h - 4, 14, h + 4, 0.5), P.woodDark, { sw: 2.2 }) + A.sh(A.rect(x + w / 2 - 8, y - h - 4, 14, h + 4, 0.5), P.woodDark, { sw: 2.2 });
    return r;
  }

  // Carved pumpkin lantern, centred on (x, y). Lit, it glows from inside.
  function lantern(x, y, r, lit) {
    let s = lit ? `<circle cx="${f(x)}" cy="${f(y)}" r="${f(r * 2.6)}" fill="url(#g-warm)"/>` : "";
    s += squash(x, y, r, 1);
    const hole = lit ? COL.glow : "#3a2416";
    const eye = (ex) => `<path d="M${f(ex - r * 0.18)} ${f(y - r * 0.1)}L${f(ex)} ${f(y - r * 0.42)}L${f(ex + r * 0.18)} ${f(y - r * 0.1)}z" fill="${hole}" stroke="${P.ink}" stroke-width="${f(r * 0.05)}"/>`;
    s += eye(x - r * 0.42) + eye(x + r * 0.42);
    s += `<path d="M${f(x - r * 0.6)} ${f(y + r * 0.22)}l${f(r * 0.2)} ${f(r * 0.2)}l${f(r * 0.2)} ${f(-r * 0.16)}l${f(r * 0.2)} ${f(r * 0.2)}l${f(r * 0.2)} ${f(-r * 0.2)}l${f(r * 0.2)} ${f(r * 0.2)}l${f(r * 0.2)} ${f(-r * 0.24)}q${f(-r * 0.6)} ${f(r * 0.5)} ${f(-r * 1.2)} 0z" fill="${hole}" stroke="${P.ink}" stroke-width="${f(r * 0.05)}"/>`;
    return s;
  }

  // A hen, feet on (x, y). flip faces left.
  function hen(x, y, s = 1, flip = false, o = {}) {
    A.srand(81);
    let r = A.ink(A.line(-6, -4, -8, 0, 0.2), 2.4, { stroke: P.ochre }) + A.ink(A.line(6, -4, 8, 0, 0.2), 2.4, { stroke: P.ochre });
    r += A.sh(A.soft([[-30, -26], [-46, -50], [-40, -54], [-26, -40]], 0.6), COL.henLight, { sw: 2 });
    r += A.sh(A.blob(-4, -22, 30, 20, 0.06, 10), COL.hen, { sw: 2.4 });
    r += A.ink(A.curve([[-20, -24], [-6, -16], [10, -22]], 0.4), 1.6, { stroke: "#7a3a1e" });
    const hy = o.peck ? -16 : -40, hx = o.peck ? 32 : 22;
    r += A.sh(A.blob(hx, hy, 12, 11, 0.05, 8), COL.hen, { sw: 2.2 });
    r += A.sh(A.soft([[hx - 6, hy - 10], [hx - 2, hy - 18], [hx + 2, hy - 12], [hx + 6, hy - 18], [hx + 8, hy - 8]], 0.3), COL.comb, { sw: 1.4 });
    r += A.sh(A.soft([[hx + 10, hy - 2], [hx + 20, hy + 2], [hx + 10, hy + 5]], 0.2), P.mustard, { sw: 1.4 });
    r += `<circle cx="${hx + 4}" cy="${hy - 2}" r="2" fill="${P.ink}"/>`;
    r += A.sh(A.blob(hx + 7, hy + 8, 3, 4, 0.05, 6), COL.comb, { sw: 1 });
    return `<g transform="translate(${f(x)},${f(y)}) scale(${flip ? -s : s},${s})">${r}</g>`;
  }

  // A little green frog, sitting on (x, y).
  function frog(x, y, s = 1) {
    let r = A.sh(A.blob(x, y - 12 * s, 20 * s, 13 * s, 0.06, 9), COL.frog, { sw: 2 * s });
    r += A.sh(A.blob(x + 4 * s, y - 8 * s, 12 * s, 6 * s, 0.05, 8), COL.frogLight, { sw: 0 });
    [-9, 9].forEach((dx) => (r += `<circle cx="${f(x + dx * s)}" cy="${f(y - 25 * s)}" r="${f(6 * s)}" fill="${COL.frog}" stroke="${P.ink}" stroke-width="${f(1.8 * s)}"/><circle cx="${f(x + dx * s)}" cy="${f(y - 25 * s)}" r="${f(2.4 * s)}" fill="${P.ink}"/>`));
    r += A.ink(A.curve([[x - 8 * s, y - 14 * s], [x, y - 11 * s], [x + 8 * s, y - 14 * s]], 0.2), 1.6 * s);
    return r;
  }

  // A crow, centred on (x, y).
  function crow(x, y, s = 1) {
    let r = A.sh(A.soft([[x - 28 * s, y + 4 * s], [x - 58 * s, y + 18 * s], [x - 54 * s, y + 8 * s], [x - 26 * s, y - 6 * s]], 0.5), COL.crow, { sw: 2 * s });
    r += A.sh(A.blob(x, y, 28 * s, 17 * s, 0.06, 10), COL.crow, { sw: 2.4 * s });
    r += A.sh(A.blob(x + 26 * s, y - 14 * s, 13 * s, 12 * s, 0.05, 8), COL.crow, { sw: 2.2 * s });
    r += A.sh(A.soft([[x + 37 * s, y - 17 * s], [x + 56 * s, y - 11 * s], [x + 37 * s, y - 8 * s]], 0.3), "#4a4542", { sw: 1.6 * s });
    r += `<circle cx="${f(x + 30 * s)}" cy="${f(y - 17 * s)}" r="${f(2.4 * s)}" fill="#ffffff"/>`;
    r += A.ink(A.line(x - 4 * s, y + 15 * s, x - 7 * s, y + 27 * s, 0.2), 2.4 * s) + A.ink(A.line(x + 8 * s, y + 15 * s, x + 6 * s, y + 27 * s, 0.2), 2.4 * s);
    return r;
  }

  // Red and white spoon lure with its hook, centred on (x, y).
  function lure(x, y, s = 1, rot = -24) {
    let r = `<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(20 * s)}" ry="${f(9 * s)}" fill="${COL.lure}" stroke="${P.ink}" stroke-width="${f(2 * s)}"/>`;
    r += `<path d="M${f(x - 4 * s)} ${f(y - 8 * s)}q${f(-6 * s)} ${f(8 * s)} 0 ${f(16 * s)}" stroke="#fbf6ea" stroke-width="${f(4 * s)}" fill="none"/>`;
    r += `<circle cx="${f(x - 24 * s)}" cy="${f(y)}" r="${f(3.4 * s)}" fill="none" stroke="${P.inkSoft}" stroke-width="${f(1.8 * s)}"/>`;
    r += `<path d="M${f(x + 20 * s)} ${f(y)}h${f(8 * s)}q${f(8 * s)} 0 ${f(8 * s)} ${f(8 * s)}q0 ${f(6 * s)} ${f(-6 * s)} ${f(6 * s)}" stroke="${P.inkSoft}" stroke-width="${f(2 * s)}" fill="none"/>`;
    return `<g transform="rotate(${rot} ${f(x)} ${f(y)})">${r}</g>`;
  }

  // Wheelbarrow, wheel on the left, base on (x, y). o.crate carries the empty crate.
  function barrow(x, y, s = 1, o = {}) {
    let r = "";
    if (o.crate) r += crate(x - 14 * s, y - 74 * s, 120 * s, 46 * s, { seed: 63 });
    r += `<circle cx="${f(x - 62 * s)}" cy="${f(y - 26 * s)}" r="${f(26 * s)}" fill="${P.woodDark}" stroke="${P.ink}" stroke-width="${f(3 * s)}"/><circle cx="${f(x - 62 * s)}" cy="${f(y - 26 * s)}" r="${f(6 * s)}" fill="${P.ochre}"/>`;
    r += A.sh(A.soft([[x - 90 * s, y - 80 * s], [x + 60 * s, y - 80 * s], [x + 40 * s, y - 34 * s], [x - 70 * s, y - 34 * s]], 1), "#6d8a8a", { sw: 2.8 * s });
    r += A.ink(A.line(x + 50 * s, y - 64 * s, x + 120 * s, y - 80 * s, 0.5), 7 * s, { stroke: P.wood }) + A.ink(A.line(x + 30 * s, y - 34 * s, x + 34 * s, y, 0.4), 6 * s, { stroke: P.wood });
    return r;
  }

  // Sound lines: three arcs opening to the right from (x, y), and the tick marks.
  function ticks(x, y, s = 1, col = P.ink) {
    let r = "";
    [12, 22, 32].forEach((rad, i) => (r += `<path d="M${f(x + rad * 0.5 * s)} ${f(y - rad * s)}a${f(rad * s)} ${f(rad * s)} 0 0 1 0 ${f(rad * 2 * s)}" stroke="${col}" stroke-width="${f(3 * s)}" fill="none" stroke-linecap="round" opacity="${(1 - i * 0.25).toFixed(2)}"/>`));
    return `<g class="m-twinkle" style="--ms:1s">${r}</g>`;
  }

  // Spoon for scooping out a pumpkin.
  function spoon(x, y, s = 1, rot = -30) {
    return `<g transform="rotate(${rot} ${f(x)} ${f(y)})"><ellipse cx="${f(x - 20 * s)}" cy="${f(y)}" rx="${f(13 * s)}" ry="${f(9 * s)}" fill="#d8dde0" stroke="${P.ink}" stroke-width="${f(2.2 * s)}"/><path d="M${f(x - 7 * s)} ${f(y)}h${f(40 * s)}" stroke="${P.wood}" stroke-width="${f(7 * s)}" stroke-linecap="round"/><path d="M${f(x - 26 * s)} ${f(y - 3 * s)}q${f(4 * s)} ${f(-3 * s)} ${f(9 * s)} 0" stroke="#ffffff" stroke-width="${f(1.8 * s)}" fill="none"/></g>`;
  }

  // Tufts of straw on the ground around (x, y).
  function straw(x, y, w, n = 8, seed = 91) {
    A.srand(seed);
    let r = "";
    for (let i = 0; i < n; i++) {
      const sx = x - w / 2 + A.rnd() * w, sy = y + A.jit(6);
      r += A.ink(A.line(sx, sy, sx + 10 + A.rnd() * 10, sy - 3 - A.rnd() * 5, 0.3), 2, { stroke: P.straw });
    }
    return r;
  }

  function glint(x, y, s = 1) {
    return `<g class="m-twinkle"><path d="M${f(x)} ${f(y - 16 * s)}L${f(x + 4 * s)} ${f(y - 4 * s)}L${f(x + 16 * s)} ${f(y)}L${f(x + 4 * s)} ${f(y + 4 * s)}L${f(x)} ${f(y + 16 * s)}L${f(x - 4 * s)} ${f(y + 4 * s)}L${f(x - 16 * s)} ${f(y)}L${f(x - 4 * s)} ${f(y - 4 * s)}z" fill="#fffbe6" stroke="${P.mustard}" stroke-width="${f(1.4 * s)}"/></g>`;
  }

  function eyeCrossed(x, y, s = 1) {
    let r = `<path d="M${f(x - 30 * s)} ${f(y)}q${f(30 * s)} ${f(-26 * s)} ${f(60 * s)} 0q${f(-30 * s)} ${f(26 * s)} ${f(-60 * s)} 0z" fill="#fbf6ea" stroke="${P.ink}" stroke-width="${f(4 * s)}"/>`;
    r += `<circle cx="${f(x)}" cy="${f(y)}" r="${f(9 * s)}" fill="${P.ink}"/>`;
    r += `<path d="M${f(x - 30 * s)} ${f(y + 24 * s)}L${f(x + 30 * s)} ${f(y - 24 * s)}" stroke="#b0302a" stroke-width="${f(7 * s)}" stroke-linecap="round"/>`;
    return r;
  }

  // A red cross over something that is not there.
  const cross = (x, y, s = 1) => `<path d="M${f(x - 22 * s)} ${f(y - 18 * s)}l${f(44 * s)} ${f(36 * s)}M${f(x + 22 * s)} ${f(y - 18 * s)}l${f(-44 * s)} ${f(36 * s)}" stroke="#b0302a" stroke-width="${f(4 * s)}" stroke-linecap="round"/>`;

  // Motion strokes behind something that falls or moves.
  function speed(x, y, dx, dy, n = 3, s = 1) {
    let r = "";
    for (let i = 0; i < n; i++) r += `<path d="M${f(x + i * 7 * s)} ${f(y - i * 4 * s)}l${f(dx)} ${f(dy)}" stroke="${P.inkSoft}" stroke-width="${f(2 * s)}" stroke-linecap="round" opacity=".6"/>`;
    return r;
  }

  // A dashed arrow from (x0, y0) to (x1, y1), bending upwards.
  function trail(x0, y0, x1, y1, s = 1) {
    const mx = (x0 + x1) / 2, my = Math.min(y0, y1) - 30 * s;
    const a = Math.atan2(y1 - my, x1 - mx);
    const hx = (k) => f(x1 - Math.cos(a + k) * 10 * s), hy = (k) => f(y1 - Math.sin(a + k) * 10 * s);
    return `<path d="M${f(x0)} ${f(y0)}Q${f(mx)} ${f(my)} ${f(x1)} ${f(y1)}" stroke="${P.ink}" stroke-width="${f(2.4 * s)}" fill="none" stroke-dasharray="5 5"/><path d="M${hx(0.5)} ${hy(0.5)}L${f(x1)} ${f(y1)}L${hx(-0.5)} ${hy(-0.5)}" stroke="${P.ink}" stroke-width="${f(2.4 * s)}" fill="none"/>`;
  }

  function heart(x, y, s = 1) {
    return `<path d="M${f(x)} ${f(y + 22 * s)}C${f(x - 34 * s)} ${f(y)} ${f(x - 26 * s)} ${f(y - 28 * s)} ${f(x)} ${f(y - 12 * s)}C${f(x + 26 * s)} ${f(y - 28 * s)} ${f(x + 34 * s)} ${f(y)} ${f(x)} ${f(y + 22 * s)}z" fill="#d9605a" stroke="${P.ink}" stroke-width="${f(3.4 * s)}" stroke-linejoin="round"/>`;
  }

  CH.epArt = {
    COL, watch, wrist, squash, crate, soapDish, compostBin, lantern, hen, frog, crow, lure, barrow,
    ticks, spoon, straw, glint, eyeCrossed, cross, speed, trail, heart,
  };
})();

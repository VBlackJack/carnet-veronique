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
// Veronique's glasses, the basket, the hive, the clock, the leaf pile, the smoke.
(function () {
  const A = CH.art, P = A.P;
  const f = (n) => Math.round(n * 10) / 10;

  const COL = {
    frame: "#22403c",
    lens: "#e8f2f0",
    fur: "#d98a3a",
    furWhite: "#f6f1e6",
    leaf: [P.leafRed, P.leafGold, P.ochre, P.rust, "#8c4a2a"],
    apple: "#c0392b",
    appleLight: "#e0623f",
    moss: "#6f8a3a",
    mossDark: "#4c6a2c",
    canopy: "#4f6e3a",
    canopyDark: "#3c5a2e",
    hive: "#d9b766",
    sun: "#ffe08a",
    smoke: "#e9e6dc",
    smokeCard: "#8f8a80",
    dust: "#bfb4a2",
    burn: "#3a2a20",
  };

  // Veronique's glasses: thick dark green frames. Centred on (x, y).
  function specs(x, y, s = 1, o = {}) {
    const col = o.color || COL.frame;
    const sw = (o.sw || 5) * s;
    const lens = (cx) => `<rect x="${f(cx - 13 * s)}" y="${f(y - 9 * s)}" width="${f(26 * s)}" height="${f(18 * s)}" rx="${f(7 * s)}" fill="${COL.lens}" fill-opacity=".6" stroke="${col}" stroke-width="${f(sw)}"/>`
      + `<path d="M${f(cx - 7 * s)} ${f(y - 3 * s)}q${f(4 * s)} ${f(-4 * s)} ${f(9 * s)} ${f(-3 * s)}" stroke="#ffffff" stroke-width="${f(2 * s)}" fill="none" opacity=".9"/>`;
    let r = lens(x - 16 * s) + lens(x + 16 * s);
    r += `<path d="M${f(x - 3 * s)} ${f(y - 3 * s)}q${f(3 * s)} ${f(-4 * s)} ${f(6 * s)} 0" stroke="${col}" stroke-width="${f(sw * 0.7)}" fill="none"/>`;
    if (!o.noLeft) r += `<path d="M${f(x - 29 * s)} ${f(y - 4 * s)}l${f(-12 * s)} ${f(-4 * s)}" stroke="${col}" stroke-width="${f(sw * 0.7)}" stroke-linecap="round"/>`;
    if (!o.noRight) r += `<path d="M${f(x + 29 * s)} ${f(y - 4 * s)}l${f(12 * s)} ${f(-4 * s)}" stroke="${col}" stroke-width="${f(sw * 0.7)}" stroke-linecap="round"/>`;
    return o.rot ? `<g transform="rotate(${o.rot} ${f(x)} ${f(y)})">${r}</g>` : r;
  }

  // Wicker basket, base on (x, y).
  function basket(x, y, s = 1, o = {}) {
    A.srand(o.seed || 7);
    let r = "";
    if (o.apples) for (let i = 0; i < 6; i++) r += A.sh(A.blob(x + (-34 + i * 13) * s, y - 46 * s - (i % 2) * 8 * s, 10 * s, 10 * s, 0.08, 9), i % 3 ? COL.apple : COL.appleLight, { sw: 2 * s });
    r += A.sh(A.soft([[x - 46 * s, y - 44 * s], [x + 46 * s, y - 44 * s], [x + 36 * s, y], [x - 36 * s, y]], 1.2 * s), P.straw, { sw: 2.6 * s });
    for (let i = 1; i < 4; i++) r += A.ink(A.curve([[x - 44 * s + i * 2 * s, y - 44 * s + i * 11 * s], [x, y - 41 * s + i * 11 * s], [x + 44 * s - i * 2 * s, y - 44 * s + i * 11 * s]], 0.6), 1.6 * s, { stroke: P.wood, op: 0.7 });
    for (let i = -3; i <= 3; i++) r += A.ink(A.line(x + i * 12 * s, y - 44 * s, x + i * 9.5 * s, y, 0.5), 1.4 * s, { stroke: P.wood, op: 0.5 });
    r += A.ink(A.curve([[x - 40 * s, y - 44 * s], [x, y - 92 * s], [x + 40 * s, y - 44 * s]], 1), 5 * s, { stroke: P.wood });
    return r;
  }

  // Straw skep hive, base on (x, y).
  function hive(x, y, s = 1) {
    A.srand(17);
    let r = A.sh(A.soft([[x - 44 * s, y], [x - 46 * s, y - 40 * s], [x - 30 * s, y - 78 * s], [x, y - 90 * s], [x + 30 * s, y - 78 * s], [x + 46 * s, y - 40 * s], [x + 44 * s, y]], 1.4 * s), COL.hive, { sw: 2.6 * s });
    for (let i = 1; i < 5; i++) r += A.ink(A.curve([[x - 46 * s + i * 3 * s, y - i * 18 * s], [x, y - i * 18 * s - 4 * s], [x + 46 * s - i * 3 * s, y - i * 18 * s]], 0.6), 2 * s, { stroke: P.wood, op: 0.6 });
    r += A.sh(A.blob(x, y - 10 * s, 9 * s, 7 * s, 0.05, 8), P.inkSoft, { sw: 1.4 * s });
    return r;
  }

  // Wall clock showing a whole hour, centred on (x, y).
  function clock(x, y, rad, hour) {
    let r = `<circle cx="${f(x)}" cy="${f(y)}" r="${f(rad)}" fill="${P.cream}" stroke="${P.ink}" stroke-width="${f(rad * 0.1)}"/>`;
    for (let i = 0; i < 12; i++) {
      const a = (i * 30 * Math.PI) / 180;
      r += `<circle cx="${f(x + Math.sin(a) * rad * 0.78)}" cy="${f(y - Math.cos(a) * rad * 0.78)}" r="${f(rad * 0.05)}" fill="${P.ink}"/>`;
    }
    const ha = ((hour % 12) * 30 * Math.PI) / 180;
    r += `<path d="M${f(x)} ${f(y)}L${f(x + Math.sin(ha) * rad * 0.5)} ${f(y - Math.cos(ha) * rad * 0.5)}" stroke="${P.ink}" stroke-width="${f(rad * 0.1)}" stroke-linecap="round"/>`;
    r += `<path d="M${f(x)} ${f(y)}V${f(y - rad * 0.7)}" stroke="${P.ink}" stroke-width="${f(rad * 0.07)}" stroke-linecap="round"/>`;
    return r;
  }

  // Apple tree icon, base on (x, y).
  function treeIcon(x, y, s = 1) {
    A.srand(23);
    let r = A.sh(A.soft([[x - 6 * s, y], [x - 5 * s, y - 34 * s], [x + 5 * s, y - 34 * s], [x + 7 * s, y]], 0.5), P.wood, { sw: 2 * s });
    r += A.sh(A.blob(x, y - 52 * s, 30 * s, 24 * s, 0.1, 11), COL.canopy, { sw: 2.4 * s });
    [[-12, -56], [10, -46], [4, -64]].forEach(([dx, dy]) => (r += `<circle cx="${f(x + dx * s)}" cy="${f(y + dy * s)}" r="${f(4 * s)}" fill="${COL.apple}" stroke="${P.ink}" stroke-width="${f(1.4 * s)}"/>`));
    return r;
  }

  // Mound of dead leaves, base centre on (x, y), width w.
  function leafPile(x, y, w, seed = 5) {
    A.srand(seed);
    let r = A.sh(A.soft([[x - w / 2, y], [x - w * 0.42, y - w * 0.16], [x - w * 0.2, y - w * 0.3], [x + w * 0.1, y - w * 0.33], [x + w * 0.35, y - w * 0.2], [x + w / 2, y]], 2), "#9a5a2e", { sw: 2.6 });
    const n = Math.round(w / 6);
    for (let i = 0; i < n; i++) {
      const lx = x - w * 0.45 + A.rnd() * w * 0.9;
      const top = y - w * 0.3 * Math.sin(((lx - x + w / 2) / w) * Math.PI);
      const ly = top + A.rnd() * (y - top) * 0.85;
      const rot = Math.round(A.rnd() * 360);
      r += `<g transform="translate(${f(lx)},${f(ly)}) rotate(${rot})"><path d="${A.soft([[-9, 0], [0, -5], [9, 0], [0, 5]], 0.6)}" fill="${COL.leaf[i % COL.leaf.length]}" stroke="${P.ink}" stroke-width="1.2"/></g>`;
    }
    return r;
  }

  // Thin wisps of smoke rising from (x, y), looping. Cards pass a darker colour: on their
  // light background the white smoke of the tableau would hardly show.
  function smoke(x, y, s = 1, n = 3, col = COL.smoke) {
    let r = "";
    for (let i = 0; i < n; i++) {
      r += `<g class="m-smoke" style="--delay:-${(i * 1.1).toFixed(1)}s"><path d="${A.curve([[x + i * 6 * s, y], [x - 8 * s + i * 6 * s, y - 22 * s], [x + 6 * s + i * 6 * s, y - 44 * s], [x - 4 * s + i * 6 * s, y - 64 * s]], 1)}" stroke="${col}" stroke-width="${f(5 * s)}" fill="none" stroke-linecap="round" opacity=".8"/></g>`;
    }
    return r;
  }

  // Bright point of focused sunlight on (x, y).
  function hotspot(x, y, s = 1) {
    return `<circle cx="${f(x)}" cy="${f(y)}" r="${f(16 * s)}" fill="url(#g-warm)"/><g class="m-twinkle" style="--ms:1.2s"><circle cx="${f(x)}" cy="${f(y)}" r="${f(4 * s)}" fill="#fffbe6"/><path d="M${f(x - 10 * s)} ${f(y)}h${f(20 * s)}M${f(x)} ${f(y - 10 * s)}v${f(20 * s)}" stroke="#fffbe6" stroke-width="${f(2 * s)}"/></g>`;
  }

  // Old spare glasses, one arm missing.
  const spare = (x, y, s = 1) => specs(x, y, s, { color: "#6a4a3a", noRight: true, sw: 3.6 });

  // A ginger cat paw, centred on (x, y).
  function paw(x, y, s = 1) {
    A.srand(31);
    let r = A.sh(A.blob(x, y + 6 * s, 22 * s, 18 * s, 0.06, 10), COL.fur, { sw: 2.4 * s });
    [[-16, -14], [-5, -20], [7, -20], [17, -13]].forEach(([dx, dy]) => (r += A.sh(A.blob(x + dx * s, y + dy * s, 6 * s, 7 * s, 0.06, 8), COL.fur, { sw: 2 * s })));
    r += A.sh(A.blob(x, y + 8 * s, 10 * s, 8 * s, 0.06, 8), P.pink, { sw: 0, op: 0.8 });
    return r;
  }

  // Sleeping cat head (eyes shut), centred on (x, y).
  function catHead(x, y, s = 1) {
    A.srand(33);
    let r = A.sh(A.soft([[x - 22 * s, y - 8 * s], [x - 18 * s, y - 34 * s], [x - 4 * s, y - 16 * s]], 0.6), COL.fur, { sw: 2.2 * s });
    r += A.sh(A.soft([[x + 22 * s, y - 8 * s], [x + 18 * s, y - 34 * s], [x + 4 * s, y - 16 * s]], 0.6), COL.fur, { sw: 2.2 * s });
    r += A.sh(A.blob(x, y, 26 * s, 22 * s, 0.05, 10), COL.fur, { sw: 2.4 * s });
    r += A.sh(A.blob(x, y + 9 * s, 13 * s, 9 * s, 0.08, 8), COL.furWhite, { sw: 0 });
    r += A.ink(A.curve([[x - 15 * s, y - 2 * s], [x - 9 * s, y + 2 * s], [x - 3 * s, y - 2 * s]], 0.2), 2.2 * s);
    r += A.ink(A.curve([[x + 3 * s, y - 2 * s], [x + 9 * s, y + 2 * s], [x + 15 * s, y - 2 * s]], 0.2), 2.2 * s);
    r += `<circle cx="${f(x)}" cy="${f(y + 6 * s)}" r="${f(2.6 * s)}" fill="${P.pink}"/>`;
    return r;
  }

  function eyeCrossed(x, y, s = 1) {
    let r = `<path d="M${f(x - 30 * s)} ${f(y)}q${f(30 * s)} ${f(-26 * s)} ${f(60 * s)} 0q${f(-30 * s)} ${f(26 * s)} ${f(-60 * s)} 0z" fill="#fbf6ea" stroke="${P.ink}" stroke-width="${f(4 * s)}"/>`;
    r += `<circle cx="${f(x)}" cy="${f(y)}" r="${f(9 * s)}" fill="${P.ink}"/>`;
    r += `<path d="M${f(x - 30 * s)} ${f(y + 24 * s)}L${f(x + 30 * s)} ${f(y - 24 * s)}" stroke="#b0302a" stroke-width="${f(7 * s)}" stroke-linecap="round"/>`;
    return r;
  }

  function spoon(x, y, s = 1, rot = -20) {
    return `<g transform="rotate(${rot} ${f(x)} ${f(y)})"><ellipse cx="${f(x - 18 * s)}" cy="${f(y)}" rx="${f(10 * s)}" ry="${f(7 * s)}" fill="#d8dde0" stroke="${P.ink}" stroke-width="${f(2 * s)}"/><path d="M${f(x - 8 * s)} ${f(y)}h${f(34 * s)}" stroke="#d8dde0" stroke-width="${f(5 * s)}" stroke-linecap="round"/><path d="M${f(x - 8 * s)} ${f(y)}h${f(34 * s)}" stroke="${P.ink}" stroke-width="${f(1.2 * s)}" opacity=".5"/><path d="M${f(x - 22 * s)} ${f(y - 3 * s)}q${f(3 * s)} ${f(-2 * s)} ${f(7 * s)} 0" stroke="#ffffff" stroke-width="${f(1.6 * s)}" fill="none"/></g>`;
  }

  function pearl(x, y, s = 1) {
    return `<circle cx="${f(x)}" cy="${f(y)}" r="${f(8 * s)}" fill="#e8559a" stroke="${P.ink}" stroke-width="${f(2 * s)}"/><circle cx="${f(x - 3 * s)}" cy="${f(y - 3 * s)}" r="${f(2.4 * s)}" fill="#ffffff" opacity=".85"/>`;
  }

  function nest(x, y, s = 1) {
    A.srand(41);
    let r = A.sh(A.soft([[x - 36 * s, y - 14 * s], [x + 36 * s, y - 14 * s], [x + 26 * s, y + 10 * s], [x - 26 * s, y + 10 * s]], 1.5), "#8a6a44", { sw: 2.4 * s });
    for (let i = 0; i < 8; i++) r += A.ink(A.curve([[x - 38 * s + A.rnd() * 20 * s, y - 14 * s + A.rnd() * 20 * s], [x, y - 6 * s + A.rnd() * 10 * s], [x + 38 * s - A.rnd() * 20 * s, y - 14 * s + A.rnd() * 20 * s]], 1), 1.4 * s, { stroke: P.woodDark, op: 0.7 });
    return r;
  }

  function glint(x, y, s = 1) {
    return `<g class="m-twinkle"><path d="M${f(x)} ${f(y - 16 * s)}L${f(x + 4 * s)} ${f(y - 4 * s)}L${f(x + 16 * s)} ${f(y)}L${f(x + 4 * s)} ${f(y + 4 * s)}L${f(x)} ${f(y + 16 * s)}L${f(x - 4 * s)} ${f(y + 4 * s)}L${f(x - 16 * s)} ${f(y)}L${f(x - 4 * s)} ${f(y - 4 * s)}z" fill="#fffbe6" stroke="${P.mustard}" stroke-width="${f(1.4 * s)}"/></g>`;
  }

  // Wooden table edge seen from the side, top left corner on (x, y).
  function tableEdge(x, y, w, s = 1) {
    return A.sh(A.rect(x, y, w, 12 * s, 0.6), P.woodLight, { sw: 2.2 * s }) + A.sh(A.rect(x + 6 * s, y + 12 * s, 9 * s, 40 * s, 0.6), P.wood, { sw: 2 * s });
  }

  // Motion strokes behind something that falls or moves.
  function speed(x, y, dx, dy, n = 3, s = 1) {
    let r = "";
    for (let i = 0; i < n; i++) r += `<path d="M${f(x + i * 7 * s)} ${f(y - i * 4 * s)}l${f(dx)} ${f(dy)}" stroke="${P.inkSoft}" stroke-width="${f(2 * s)}" stroke-linecap="round" opacity=".6"/>`;
    return r;
  }

  function heart(x, y, s = 1) {
    return `<path d="M${f(x)} ${f(y + 22 * s)}C${f(x - 34 * s)} ${f(y)} ${f(x - 26 * s)} ${f(y - 28 * s)} ${f(x)} ${f(y - 12 * s)}C${f(x + 26 * s)} ${f(y - 28 * s)} ${f(x + 34 * s)} ${f(y)} ${f(x)} ${f(y + 22 * s)}z" fill="#d9605a" stroke="${P.ink}" stroke-width="${f(3.4 * s)}" stroke-linejoin="round"/>`;
  }

  CH.epArt = {
    COL, specs, spare, basket, hive, clock, treeIcon, leafPile, smoke, hotspot, paw, catHead,
    eyeCrossed, spoon, pearl, nest, glint, tableEdge, speed, heart,
  };
})();

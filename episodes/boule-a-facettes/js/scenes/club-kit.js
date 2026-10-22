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

// Drawing pieces for Le Mirage, a 1978 night club: lit dance floor, mirror ball,
// mirror wall, stage, DJ booth, bar, coloured beams. Scene files build on CH.club.
(function () {
  const A = CH.art, P = A.P;
  const { sh, ink, soft, rect, blob, curve, line, g, poly } = A;

  // Club palette.
  const Z = Object.freeze({
    night: "#1b1622",
    wall: "#2a2030",
    wallLight: "#3a2c40",
    velvet: "#6e1e3a",
    velvetDark: "#4a1428",
    chrome: "#c9cdd1",
    chromeDark: "#8a9096",
    gold: "#e2bd4e",
    mirror: "#b9c6cf",
    mirrorDark: "#7d8d99",
    teal: "#2f8a8a",
    pink: "#e85a9a",
    orange: "#f08a3a",
    violet: "#7a4ab0",
    yellow: "#f2d35a",
    blue: "#4a7ad0",
    uv: "#8a5ae0",
    wood: "#5a3a2a",
    woodLight: "#8a5a3a",
    bar: "#3a2418",
    formica: "#e9dcc0",
    carpet: "#4a1e30",
  });

  const TILE_COLORS = [Z.pink, Z.orange, Z.yellow, Z.teal, Z.blue, Z.violet];

  // Extra gradients for the club, appended to the shared defs.
  const baseDefs = A.defs;
  A.defs = () =>
    baseDefs() +
    `
<radialGradient id="g-spot"><stop offset="0" stop-color="#fff6d8" stop-opacity=".95"/><stop offset=".5" stop-color="#fff6d8" stop-opacity=".35"/><stop offset="1" stop-color="#fff6d8" stop-opacity="0"/></radialGradient>
<radialGradient id="g-uv"><stop offset="0" stop-color="${Z.uv}" stop-opacity=".55"/><stop offset="1" stop-color="${Z.uv}" stop-opacity="0"/></radialGradient>
<linearGradient id="g-beam-pink" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${Z.pink}" stop-opacity=".55"/><stop offset="1" stop-color="${Z.pink}" stop-opacity="0"/></linearGradient>
<linearGradient id="g-beam-teal" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${Z.teal}" stop-opacity=".55"/><stop offset="1" stop-color="${Z.teal}" stop-opacity="0"/></linearGradient>
<linearGradient id="g-beam-gold" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${Z.yellow}" stop-opacity=".5"/><stop offset="1" stop-color="${Z.yellow}" stop-opacity="0"/></linearGradient>
<linearGradient id="g-mirror" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#e6eef2"/><stop offset=".5" stop-color="${Z.mirror}"/><stop offset="1" stop-color="${Z.mirrorDark}"/></linearGradient>
<pattern id="p-carpet" width="60" height="60" patternUnits="userSpaceOnUse"><rect width="60" height="60" fill="${Z.carpet}"/><path d="M0 30h60M30 0v60" stroke="#000" stroke-width="2" opacity=".15"/><circle cx="30" cy="30" r="6" fill="${Z.gold}" opacity=".18"/></pattern>
<pattern id="p-velvet" width="40" height="120" patternUnits="userSpaceOnUse"><rect width="40" height="120" fill="${Z.velvet}"/><path d="M10 0v120M30 0v120" stroke="#000" stroke-width="5" opacity=".18"/></pattern>`;

  // Lit dance floor seen slightly from above: rows of glowing tiles.
  function danceFloor(y0, y1, o = {}) {
    let back = `<rect x="0" y="${y0}" width="1600" height="${900 - y0}" fill="#141018"/>`;
    let anim = "";
    const rows = o.rows || 5;
    for (let r = 0; r < rows; r++) {
      const ya = y0 + ((y1 - y0) * r) / rows, yb = y0 + ((y1 - y0) * (r + 1)) / rows;
      const spread = 1 + r * 0.12;
      const cols = 10;
      for (let i = 0; i < cols; i++) {
        const xa = 800 + ((i - cols / 2) * 170 * spread), xb = xa + 170 * spread;
        const xa2 = 800 + ((i - cols / 2) * 170 * (spread + 0.12)), xb2 = xa2 + 170 * (spread + 0.12);
        const col = TILE_COLORS[(i + r * 2) % TILE_COLORS.length];
        const pts = [[xa + 4, ya + 3], [xb - 4, ya + 3], [xb2 - 4, yb - 3], [xa2 + 4, yb - 3]];
        back += sh(poly(pts, 0.6), col, { sw: 2.5, stroke: "#0c0a10", op: 0.88 });
        // Soft inner glow towards the tile centre
        const cx = (xa + xb + xa2 + xb2) / 4, cy = (ya + yb) / 2;
        back += `<ellipse cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" rx="${(55 * spread).toFixed(1)}" ry="${((yb - ya) * 0.28).toFixed(1)}" fill="#ffffff" opacity=".18"/>`;
        if ((i * 7 + r * 3) % 4 === 0) {
          anim += `<path d="${poly(pts, 0.6)}" fill="${col}" class="tile" style="animation-delay:-${((i + r) % 6) * 0.4}s"/>`;
        }
      }
    }
    return { back, anim };
  }

  // Mirror ball hanging from the ceiling, with light flecks drifting over the walls.
  function mirrorBall(cx, cy, r) {
    let s = ink(line(cx, 0, cx, cy - r, 0.5), 3, { stroke: "#5a5a60" });
    s += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#g-mirror)" stroke="${P.ink}" stroke-width="3"/>`;
    for (let i = -4; i <= 4; i++) {
      const yy = cy + (i * r) / 5;
      const half = Math.sqrt(Math.max(0, r * r - (yy - cy) * (yy - cy)));
      s += `<line x1="${(cx - half).toFixed(1)}" y1="${yy.toFixed(1)}" x2="${(cx + half).toFixed(1)}" y2="${yy.toFixed(1)}" stroke="#7d8d99" stroke-width="1.2"/>`;
    }
    for (let i = -4; i <= 4; i++) s += `<ellipse cx="${cx}" cy="${cy}" rx="${Math.abs((i * r) / 5).toFixed(1)}" ry="${r}" fill="none" stroke="#7d8d99" stroke-width="1.2"/>`;
    return s;
  }

  function ballFlecks(n, x0, x1, y0, y1) {
    let s = "";
    for (let i = 0; i < n; i++) {
      const x = x0 + A.rnd() * (x1 - x0), y = y0 + A.rnd() * (y1 - y0);
      s += `<circle class="fleck" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(2 + A.rnd() * 3).toFixed(1)}" fill="#fffbe8" style="animation-delay:-${(A.rnd() * 6).toFixed(1)}s"/>`;
    }
    return s;
  }

  // Coloured beam from a ceiling projector.
  const beam = (x, w, toX, toW, grad, y1 = 900) => `<polygon points="${x - w},0 ${x + w},0 ${toX + toW},${y1} ${toX - toW},${y1}" fill="url(#${grad})" opacity=".55"/>`;

  // Ceiling rig: a truss with projectors.
  function rig(y, xs) {
    let s = sh(rect(-10, y - 8, 1620, 16, 1), "#3a3a42", { sw: 2 });
    for (let x = 40; x < 1600; x += 60) s += ink(line(x, y - 8, x + 30, y + 8, 0.2), 1.5, { stroke: "#5a5a64" });
    xs.forEach(([x, col]) => (s += sh(rect(x - 18, y + 8, 36, 34, 1), "#24242a") + sh(blob(x, y + 44, 14, 6, 0.05, 8), col, { sw: 1.5 })));
    return s;
  }

  // Velvet curtain panel.
  function velvetDrape(x, y, w, h) {
    let s = `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="url(#p-velvet)"/>`;
    s += sh(rect(x, y, w, h, 1), "none", { sw: 2.5 });
    s += ink(curve([[x, y + h], [x + w * 0.5, y + h - 14], [x + w, y + h]]), 3, { stroke: Z.gold, op: 0.7 });
    return s;
  }

  // Wall of mirror tiles: a grid of slightly different silvers, with sharp joints.
  function mirrorWall(x, y, w, h, tile = 46) {
    let s = sh(rect(x - 8, y - 8, w + 16, h + 16, 1), "#24242a");
    for (let ty = y; ty < y + h; ty += tile) {
      for (let tx = x; tx < x + w; tx += tile) {
        const shade = ["#c3cfd6", "#aebcc6", "#d3dde2", "#9fb0bb"][Math.floor(A.rnd() * 4)];
        s += `<rect x="${tx + 1}" y="${ty + 1}" width="${Math.min(tile, x + w - tx) - 2}" height="${Math.min(tile, y + h - ty) - 2}" fill="${shade}"/>`;
      }
    }
    for (let tx = x; tx <= x + w; tx += tile) s += `<line x1="${tx}" y1="${y}" x2="${tx}" y2="${y + h}" stroke="#4a5560" stroke-width="2"/>`;
    for (let ty = y; ty <= y + h; ty += tile) s += `<line x1="${x}" y1="${ty}" x2="${x + w}" y2="${ty}" stroke="#4a5560" stroke-width="2"/>`;
    s += `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="url(#g-uv)" opacity=".35"/>`;
    return s;
  }

  // DJ turntables on a console.
  function turntables(x, y, w) {
    let s = sh(rect(x, y, w, 70, 1), "#2a2a30") + sh(rect(x + 6, y + 6, w - 12, 14, 0.6), Z.chromeDark, { sw: 1.5 });
    [x + w * 0.25, x + w * 0.75].forEach((cx) => {
      s += sh(blob(cx, y + 42, w * 0.18, 18, 0.03, 12), "#141418", { sw: 2 }) + `<circle cx="${cx}" cy="${y + 42}" r="6" fill="${Z.pink}"/>`;
      s += ink(line(cx + w * 0.16, y + 26, cx + w * 0.06, y + 40, 0.2), 3, { stroke: Z.chrome });
    });
    for (let i = 0; i < 6; i++) s += sh(rect(x + w * 0.44 + i * 6, y + 30, 4, 22, 0.2), Z.chrome, { sw: 0.8 });
    return s;
  }

  // Champagne bucket on a stand, bottle neck sticking out.
  function champagneBucket(x, y, o = {}) {
    return g(bucketShape(0, 0, o), `transform="translate(${x},${y}) scale(${o.k || 1})"`);
  }

  function bucketShape(x, y, o) {
    let s = "";
    if (!o.knocked) {
      s += ink(line(x - 14, y, x - 20, y + 90, 0.3), 3, { stroke: Z.chromeDark }) + ink(line(x + 14, y, x + 20, y + 90, 0.3), 3, { stroke: Z.chromeDark });
      s += sh(soft([[x - 30, y - 50], [x + 30, y - 50], [x + 24, y], [x - 24, y]], 1), Z.chrome);
      s += sh(blob(x, y - 50, 30, 7, 0.05, 10), "#e9f2f6", { sw: 2 });
      s += sh(rect(x + 2, y - 96, 14, 50, 0.6), "#1e3a28", { sw: 2 }) + sh(rect(x + 2, y - 104, 14, 12, 0.4), Z.gold, { sw: 1.5 });
    } else {
      // Knocked over: bucket on its side, ice and water spread on the tiles.
      s += g(sh(soft([[-30, -50], [30, -50], [24, 0], [-24, 0]], 1), Z.chrome), `transform="translate(${x},${y + 70}) rotate(-75)"`);
      s += sh(blob(x + 40, y + 84, 70, 12, 0.2, 12), "#bcd6e2", { sw: 1, op: 0.7 });
      for (let i = 0; i < 6; i++) s += sh(rect(x + 10 + i * 14, y + 74 + (i % 2) * 6, 10, 8, 0.6), "#eef6fa", { sw: 1 });
    }
    return s;
  }

  // Pay phone on the wall.
  function payPhone(x, y) {
    let s = sh(rect(x, y, 70, 110, 1.5), "#c94a2a");
    s += sh(rect(x + 10, y + 12, 50, 24, 0.6), "#2a2a2a", { sw: 1.5 });
    for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) s += `<circle cx="${x + 20 + c * 15}" cy="${y + 52 + r * 14}" r="4" fill="${Z.chrome}" stroke="${P.ink}" stroke-width="1"/>`;
    s += sh(rect(x - 14, y + 20, 14, 64, 1), "#1e1e22") + ink(curve([[x - 8, y + 84], [x - 20, y + 120], [x + 10, y + 120], [x + 20, y + 100]]), 2.5);
    s += sh(rect(x + 26, y + 96, 18, 6, 0.4), "#8a8a8a", { sw: 1 });
    return s;
  }

  const sparkleAnim = (n, x0, x1, y0, y1) => ballFlecks(n, x0, x1, y0, y1);

  CH.club = { Z, TILE_COLORS, danceFloor, mirrorBall, ballFlecks, beam, rig, velvetDrape, mirrorWall, turntables, champagneBucket, payPhone, sparkleAnim };
})();

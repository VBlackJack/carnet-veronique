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

// Drawing pieces for the Zanin glassworks, Murano 1911: brick and plaster, the
// furnace and its glow, the marver, the water globe, the new electric clock, canal,
// fog, bridges and glass of every colour. Scene files build on CH.murano.
(function () {
  const A = CH.art, P = A.P;
  const { sh, ink, soft, rect, blob, curve, line, g, poly } = A;

  const M = Object.freeze({
    night: "#1c2230",
    nightDeep: "#141824",
    brick: "#8a4a36",
    brickDark: "#5e3226",
    brickLight: "#a8644a",
    plaster: "#d9c3a0",
    plasterOld: "#bfa27c",
    soot: "#2a2220",
    fire: "#ff9a3a",
    fireCore: "#fff1b0",
    fireDeep: "#d9502a",
    fog: "#dfe3e0",
    water: "#2f4a58",
    waterLight: "#4a6a78",
    stone: "#a8a090",
    stoneDark: "#7a7468",
    marble: "#e6e1d6",
    marbleVein: "#b9b2a6",
    iron: "#3a3a3e",
    brass: "#c9a24a",
    wood: "#6a4630",
    woodDark: "#4a2e20",
    velvet: "#5a1e2a",
    glass: ["#5ab0b0", "#4a7ad0", "#d9a03a", "#b0303a", "#4a9a5a", "#9a6ad0", "#e8d9b0"],
  });

  // Extra gradients for Murano, appended to the shared defs.
  const baseDefs = A.defs;
  A.defs = () =>
    baseDefs() +
    `
<radialGradient id="g-fire"><stop offset="0" stop-color="${M.fireCore}" stop-opacity=".95"/><stop offset=".35" stop-color="${M.fire}" stop-opacity=".6"/><stop offset="1" stop-color="${M.fireDeep}" stop-opacity="0"/></radialGradient>
<radialGradient id="g-lamp"><stop offset="0" stop-color="#fff4c8" stop-opacity=".9"/><stop offset="1" stop-color="#fff4c8" stop-opacity="0"/></radialGradient>
<radialGradient id="g-ember"><stop offset="0" stop-color="#ff7a3a" stop-opacity=".7"/><stop offset="1" stop-color="#ff7a3a" stop-opacity="0"/></radialGradient>
<linearGradient id="g-water" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${M.waterLight}"/><stop offset="1" stop-color="${M.water}"/></linearGradient>
<linearGradient id="g-fogband" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${M.fog}" stop-opacity="0"/><stop offset=".5" stop-color="${M.fog}" stop-opacity=".7"/><stop offset="1" stop-color="${M.fog}" stop-opacity="0"/></linearGradient>
<pattern id="p-bricks" width="60" height="28" patternUnits="userSpaceOnUse"><rect width="60" height="28" fill="${M.brick}"/><path d="M0 14H60M0 28H60M30 0V14M0 14V28M60 14V28" stroke="${M.brickDark}" stroke-width="2.5" opacity=".7"/></pattern>
<pattern id="p-cobbles" width="56" height="34" patternUnits="userSpaceOnUse"><rect width="56" height="34" fill="${M.stoneDark}"/><ellipse cx="14" cy="9" rx="12" ry="7" fill="${M.stone}" opacity=".7"/><ellipse cx="42" cy="9" rx="12" ry="7" fill="${M.stone}" opacity=".55"/><ellipse cx="28" cy="26" rx="12" ry="7" fill="${M.stone}" opacity=".65"/></pattern>
<pattern id="p-terrazzo" width="40" height="40" patternUnits="userSpaceOnUse"><rect width="40" height="40" fill="#b8a48a"/><circle cx="8" cy="10" r="2" fill="#7a5a4a"/><circle cx="28" cy="6" r="1.6" fill="#e8dcc4"/><circle cx="20" cy="26" r="2.4" fill="#a8443a" opacity=".7"/><circle cx="34" cy="32" r="1.5" fill="#4a3a30"/><circle cx="6" cy="34" r="1.8" fill="#e8dcc4"/></pattern>`;

  // Wall of bricks, optionally plastered over with patches falling off.
  function brickWall(x, y, w, h, o = {}) {
    let s = `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="url(#p-bricks)"/>`;
    if (o.plaster) {
      // Plaster over the bricks, with a few patches fallen off near the bottom.
      s += `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${o.plaster}"/>`;
      for (let i = 0; i < Math.max(2, Math.round(w / 300)); i++) {
        const px = x + 40 + A.rnd() * (w - 160), py = y + h * (0.55 + A.rnd() * 0.3);
        s += sh(poly([[px, py], [px + 70 + A.rnd() * 40, py - 6], [px + 90, py + 34], [px + 20, py + 40]], 3), "url(#p-bricks)", { sw: 1.6 });
      }
    }
    if (o.soot) s += `<rect x="${x}" y="${y}" width="${w}" height="${h * 0.5}" fill="${M.soot}" opacity=".45"/>`;
    return s;
  }

  // The furnace: a domed brick oven with three glowing glory holes.
  function furnace(cx, base, k = 1) {
    const dome = [[cx - 270 * k, base], [cx - 260 * k, base - 240 * k], [cx - 170 * k, base - 380 * k], [cx, base - 430 * k], [cx + 170 * k, base - 380 * k], [cx + 260 * k, base - 240 * k], [cx + 270 * k, base]];
    let back = sh(soft(dome, 3), "#5a2c22", { sw: 4 }) + sh(soft(dome, 3), "url(#p-bricks)", { sw: 0, op: 0.45 });
    for (let r = 1; r <= 3; r++) back += ink(curve([[cx - (270 - r * 50) * k, base], [cx - (240 - r * 40) * k, base - (300 - r * 40) * k], [cx, base - (430 - r * 70) * k], [cx + (240 - r * 40) * k, base - (300 - r * 40) * k], [cx + (270 - r * 50) * k, base]], 1), 2, { stroke: "#3a1c16", op: 0.4 });
    back += sh(soft([[cx - 270 * k, base - 120 * k], [cx + 270 * k, base - 120 * k], [cx + 274 * k, base - 90 * k], [cx - 274 * k, base - 90 * k]], 1.2), M.iron);
    back += ink(curve([[cx - 230 * k, base - 260 * k], [cx, base - 320 * k], [cx + 230 * k, base - 260 * k]], 1), 4, { stroke: M.brickDark });
    let anim = "";
    [[-150, -190], [0, -230], [150, -190]].forEach(([dx, dy]) => {
      const x = cx + dx * k, y = base + dy * k;
      back += sh(soft([[x - 44 * k, y + 40 * k], [x - 44 * k, y - 10 * k], [x, y - 52 * k], [x + 44 * k, y - 10 * k], [x + 44 * k, y + 40 * k]], 1.5), M.fire, { sw: 3 });
      back += sh(blob(x, y + 6 * k, 26 * k, 26 * k, 0.1, 10), M.fireCore, { sw: 0 });
      anim += `<circle cx="${x}" cy="${y}" r="${140 * k}" fill="url(#g-fire)" class="flicker" style="animation-delay:-${((dx + 200) % 7) * 0.5}s"/>`;
    });
    // Chimney hood above
    back += sh(soft([[cx - 140 * k, base - 420 * k], [cx + 140 * k, base - 420 * k], [cx + 80 * k, base - 560 * k], [cx - 80 * k, base - 560 * k]], 2), M.soot);
    back += sh(rect(cx - 60 * k, base - 900 * k, 120 * k, 350 * k, 1.5), M.brickDark);
    return { back, anim };
  }

  // The annealing oven (arca): long, low, warm; an iron door.
  function arca(x, y, w = 360) {
    let s = sh(rect(x, y, w, 170, 2), "url(#p-bricks)", { sw: 3 });
    s += sh(rect(x - 10, y - 18, w + 20, 22, 1), M.stoneDark);
    s += sh(rect(x + 40, y + 40, w * 0.5, 100, 1.2), M.iron) + ink(line(x + 40, y + 90, x + 40 + w * 0.5, y + 90, 0.3), 2.5, { stroke: "#5a5a60" });
    s += `<circle cx="${x + 40 + w * 0.5 - 18}" cy="${y + 90}" r="7" fill="${M.brass}" stroke="${P.ink}" stroke-width="1.5"/>`;
    return s;
  }

  // The small reheating furnace (gloria), lit or cold.
  function gloria(x, y, cold) {
    let s = sh(soft([[x - 70, y], [x - 66, y - 110], [x - 30, y - 150], [x + 30, y - 150], [x + 66, y - 110], [x + 70, y]], 2), "url(#p-bricks)", { sw: 3 });
    s += sh(blob(x, y - 80, 30, 26, 0.08, 10), cold ? "#2a2220" : M.fire, { sw: 2.5 });
    if (cold) for (let i = 0; i < 6; i++) s += sh(blob(x - 16 + i * 6, y - 66 + (i % 2) * 4, 5, 3.5, 0.1, 6), "#5a4a44", { sw: 1 });
    else s += sh(blob(x, y - 76, 16, 14, 0.1, 8), M.fireCore, { sw: 0 });
    return s;
  }

  // Marble marver on iron legs, with what lies on it.
  function marver(x, y, w = 300, o = {}) {
    let s = ink(line(x + 20, y + 30, x + 14, y + 190, 0.3), 9, { stroke: M.iron }) + ink(line(x + w - 20, y + 30, x + w - 14, y + 190, 0.3), 9, { stroke: M.iron });
    s += sh(rect(x, y, w, 34, 1.2), M.marble, { sw: 3 });
    s += ink(curve([[x + 30, y + 8], [x + 90, y + 20], [x + 150, y + 6]], 1), 1.6, { stroke: M.marbleVein }) + ink(curve([[x + 170, y + 26], [x + 230, y + 12], [x + 280, y + 22]], 1), 1.6, { stroke: M.marbleVein });
    if (o.glass) {
      // The piece the master was blowing, left out of the oven: a small bowl, split clean.
      const gx = x + w * 0.62;
      s += sh(soft([[gx - 34, y], [gx - 30, y - 40], [gx + 30, y - 40], [gx + 34, y]], 1), "#bfe0d8", { op: 0.75 });
      if (o.cracked) s += ink(poly([[gx - 6, y - 40], [gx + 2, y - 26], [gx - 4, y - 14], [gx + 4, y]], 0.4, false), 2.4, { stroke: P.ink });
    }
    return s;
  }

  // The water globe on its stand, a small oil lamp behind it. Upside down, its air
  // bubble sits low and the bright point misses the marver.
  function waterGlobe(x, y, o = {}) {
    let s = ink(line(x, y + 30, x, y + 80, 0.3), 6, { stroke: M.woodDark }) + sh(blob(x, y + 82, 30, 7, 0.05, 8), M.woodDark, { sw: 2 });
    s += sh(rect(x - 22, y + 22, 44, 12, 0.6), M.brass, { sw: 2 });
    s += `<circle cx="${x}" cy="${y - 20}" r="44" fill="#d8ecf0" fill-opacity=".55" stroke="${P.ink}" stroke-width="3"/>`;
    s += `<ellipse cx="${x - 14}" cy="${y - 38}" rx="12" ry="7" fill="#ffffff" opacity=".7"/>`;
    const by = o.flipped ? y + 10 : y - 52;
    s += `<ellipse cx="${x + 6}" cy="${by}" rx="10" ry="5" fill="#ffffff" stroke="${P.inkSoft}" stroke-width="1.2" opacity=".9"/>`;
    // Lamp
    const lx = x + 90;
    s += sh(rect(lx - 14, y + 40, 28, 40, 1), M.brass) + sh(soft([[lx - 18, y + 40], [lx + 18, y + 40], [lx + 12, y - 10], [lx - 12, y - 10]], 1), "#f6ecd0", { op: 0.8 });
    return s;
  }

  // The bright point the globe throws: on the marver, or beside it.
  const lightPoint = (x, y) => `<ellipse cx="${x}" cy="${y}" rx="22" ry="7" fill="#fff8d0" opacity=".95" class="flicker"/><ellipse cx="${x}" cy="${y}" rx="60" ry="18" fill="url(#g-lamp)"/>`;

  // Rack of tools on the wall: blowpipes, pontil, jacks (borsella), shears.
  function toolRack(x, y, o = {}) {
    let s = sh(rect(x, y, 300, 20, 1), M.woodDark);
    for (let i = 0; i < 7; i++) s += sh(rect(x + 20 + i * 40, y + 18, 8, 14, 0.4), M.iron, { sw: 1.4 });
    if (!o.empty) {
      [0, 1, 2].forEach((i) => (s += ink(line(x + 24 + i * 40, y + 30, x + 30 + i * 40, y + 330, 0.4), 7, { stroke: "#4a4a4e" }) + ink(line(x + 24 + i * 40, y + 30, x + 25 + i * 40, y + 110, 0.2), 9, { stroke: P.woodDark })));
      // Jacks: a long tweezer with a spring bow
      s += ink(line(x + 150, y + 30, x + 146, y + 200, 0.3), 5, { stroke: M.iron }) + ink(line(x + 164, y + 30, x + 172, y + 200, 0.3), 5, { stroke: M.iron }) + ink(curve([[x + 150, y + 30], [x + 157, y + 20], [x + 164, y + 30]], 0.2), 5, { stroke: M.iron });
      // Shears
      s += ink(line(x + 218, y + 30, x + 230, y + 150, 0.3), 5, { stroke: M.iron }) + ink(line(x + 242, y + 30, x + 226, y + 150, 0.3), 5, { stroke: M.iron }) + `<circle cx="${x + 216}" cy="${y + 40}" r="8" fill="none" stroke="${M.iron}" stroke-width="4"/><circle cx="${x + 244}" cy="${y + 40}" r="8" fill="none" stroke="${M.iron}" stroke-width="4"/>`;
    }
    return s;
  }

  // The new electric clock with its little brass bell on top and its wire.
  function elecClock(x, y, o = {}) {
    let s = ink(curve([[x + 50, y], [x + 140, y - 10], [x + 260, y + 20], [x + 420, y - 40]], 1), 2.5, { stroke: "#2a2a2a" });
    s += sh(rect(x - 54, y - 54, 108, 108, 1.2), M.woodDark) + `<circle cx="${x}" cy="${y}" r="42" fill="#f6f1e2" stroke="${P.ink}" stroke-width="3"/>`;
    for (let i = 0; i < 12; i++) {
      const a = (i * 30 * Math.PI) / 180;
      s += ink(line(x + Math.sin(a) * 34, y - Math.cos(a) * 34, x + Math.sin(a) * 39, y - Math.cos(a) * 39, 0.1), 2);
    }
    const hm = o.time || [0, 30];
    const ah = ((hm[0] % 12) * 30 + hm[1] / 2) * Math.PI / 180, am = hm[1] * 6 * Math.PI / 180;
    s += ink(line(x, y, x + Math.sin(ah) * 22, y - Math.cos(ah) * 22, 0.1), 4) + ink(line(x, y, x + Math.sin(am) * 32, y - Math.cos(am) * 32, 0.1), 2.6);
    // Bell and hammer
    s += sh(blob(x, y - 74, 20, 12, 0.05, 10), M.brass, { sw: 2.4 }) + ink(line(x + 26, y - 58, x + 12, y - 74, 0.2), 3, { stroke: M.iron });
    if (o.jumperOff) s += `<circle cx="${x + 36}" cy="${y - 50}" r="5" fill="none" stroke="${M.brass}" stroke-width="2" stroke-dasharray="3 3"/>`;
    else s += sh(rect(x + 30, y - 54, 12, 6, 0.3), M.brass, { sw: 1.2 });
    return s;
  }

  // Gothic Venetian window, lit from inside or dark.
  // lit: true (warm), false (dark) or a colour (night fog seen from inside).
  function gothicWindow(x, y, w, h, lit) {
    const fill = typeof lit === "string" ? lit : lit ? "#ffd78a" : "#2a3040";
    const d = `M${x} ${y + h}L${x} ${y + w * 0.55}Q${x} ${y + w * 0.12} ${x + w / 2} ${y}Q${x + w} ${y + w * 0.12} ${x + w} ${y + w * 0.55}L${x + w} ${y + h}Z`;
    let s = `<path d="${d}" fill="${fill}" stroke="${P.ink}" stroke-width="3" stroke-linejoin="round"/>`;
    if (typeof lit === "string") s += `<path d="${d}" fill="url(#g-fogband)" opacity=".6"/>`;
    s += ink(line(x + w / 2, y + 6, x + w / 2, y + h, 0.3), 2.5) + ink(line(x, y + h * 0.55, x + w, y + h * 0.55, 0.3), 2.5);
    s += sh(rect(x - 8, y + h, w + 16, 10, 0.6), "#e8e0cc", { sw: 2 });
    return s;
  }

  // Canal water with a few ripples and reflections.
  function canal(y0, y1 = 900, o = {}) {
    let s = `<rect x="-10" y="${y0}" width="1620" height="${y1 - y0}" fill="url(#g-water)"/>`;
    for (let i = 0; i < 18; i++) {
      const x = A.rnd() * 1600, y = y0 + 14 + A.rnd() * (y1 - y0 - 20);
      s += ink(curve([[x, y], [x + 20, y - 3], [x + 44, y]], 0.4), 2, { stroke: "#9ab8c4", op: 0.5 });
    }
    (o.lights || []).forEach(([x, col]) => {
      for (let i = 0; i < 6; i++) s += `<rect x="${x - 14 + (i % 2) * 8}" y="${y0 + 8 + i * (y1 - y0) * 0.1}" width="${22 - i * 2}" height="4" rx="2" fill="${col}" opacity="${0.45 - i * 0.06}"/>`;
    });
    return s;
  }

  // Drifting bands of lagoon fog.
  function fogBands(n, y0, y1) {
    let s = "";
    for (let i = 0; i < n; i++) {
      const y = y0 + ((y1 - y0) * i) / Math.max(1, n - 1);
      s += `<g class="mist" style="animation-delay:-${i * 5}s"><rect x="-300" y="${f(y - 50)}" width="2200" height="100" fill="url(#g-fogband)" opacity=".75"/></g>`;
    }
    return s;
  }
  const f = (n) => Math.round(n * 10) / 10;

  // Small brick bridge with a stone parapet.
  function bridge(x, y, w) {
    let s = sh(soft([[x, y + 60], [x + w * 0.2, y + 10], [x + w * 0.5, y], [x + w * 0.8, y + 10], [x + w, y + 60], [x + w * 0.8, y + 40], [x + w * 0.5, y + 32], [x + w * 0.2, y + 40]], 1.5), M.brick, { sw: 3 });
    s += sh(soft([[x + w * 0.22, y + 60], [x + w * 0.5, y + 34], [x + w * 0.78, y + 60]], 1), "#1e2a34", { sw: 2.5 });
    s += ink(curve([[x + 6, y + 30], [x + w * 0.2, y - 10], [x + w * 0.5, y - 20], [x + w * 0.8, y - 10], [x + w - 6, y + 30]], 1), 6, { stroke: M.stone });
    return s;
  }

  // Bell tower in the fog.
  function campanile(x, y, h, col = "#3a4250") {
    let s = sh(rect(x - 34, y - h, 68, h, 1.2), col, { sw: 2 });
    s += sh(rect(x - 40, y - h - 70, 80, 70, 1), col, { sw: 2 }) + sh(rect(x - 22, y - h - 60, 18, 44, 0.6), "#1c2230", { sw: 1.5 }) + sh(rect(x + 4, y - h - 60, 18, 44, 0.6), "#1c2230", { sw: 1.5 });
    s += sh(poly([[x - 44, y - h - 70], [x, y - h - 150], [x + 44, y - h - 70]], 1), col, { sw: 2 });
    return s;
  }

  // A drinking glass of Murano: goblet, chalice or vase, in a colour.
  function goblet(x, y, col, k = 1, kind = "goblet") {
    let s = "";
    if (kind === "vase") {
      s += sh(soft([[x - 18 * k, y], [x - 26 * k, y - 40 * k], [x - 12 * k, y - 70 * k], [x - 14 * k, y - 86 * k], [x + 14 * k, y - 86 * k], [x + 12 * k, y - 70 * k], [x + 26 * k, y - 40 * k], [x + 18 * k, y]], 0.8), col, { op: 0.85, sw: 2 });
    } else {
      s += sh(blob(x, y - 3 * k, 18 * k, 5 * k, 0.05, 8), col, { op: 0.85, sw: 1.8 }) + ink(line(x, y - 4 * k, x, y - 40 * k, 0.2), 5 * k, { stroke: col });
      if (kind === "chalice") s += sh(blob(x, y - 26 * k, 7 * k, 7 * k, 0.05, 8), col, { sw: 1.6 });
      s += sh(soft([[x - 26 * k, y - 80 * k], [x + 26 * k, y - 80 * k], [x + 16 * k, y - 46 * k], [x, y - 40 * k], [x - 16 * k, y - 46 * k]], 0.8), col, { op: 0.8, sw: 2 });
    }
    s += ink(line(x - 8 * k, y - 74 * k, x - 12 * k, y - 54 * k, 0.2), 2.4 * k, { stroke: "#ffffff", op: 0.7 });
    return s;
  }

  // The Barovier chalice: blue-green cristallo, enamelled band, gold rim.
  function chalice(x, y, k = 1) {
    let s = goblet(x, y, "#9ad0c8", k, "chalice");
    s += sh(rect(x - 20 * k, y - 72 * k, 40 * k, 10 * k, 0.4), "#2f6a9a", { sw: 1.4 });
    [[-12, -67, "#e8c84a"], [0, -67, "#d9502a"], [12, -67, "#f6f1e6"]].forEach(([dx, dy, c]) => (s += `<circle cx="${x + dx * k}" cy="${y + dy * k}" r="${2.6 * k}" fill="${c}"/>`));
    s += ink(line(x - 26 * k, y - 80 * k, x + 26 * k, y - 80 * k, 0.2), 3 * k, { stroke: "#d9b44a" });
    return s;
  }

  // Glass bell jar over a piece.
  const bellJar = (x, y, w, h) => sh(soft([[x - w / 2, y], [x - w / 2, y - h * 0.7], [x - w * 0.3, y - h * 0.95], [x, y - h], [x + w * 0.3, y - h * 0.95], [x + w / 2, y - h * 0.7], [x + w / 2, y]], 1), "#e6f2f4", { op: 0.3, sw: 2.5 }) + `<circle cx="${x}" cy="${y - h - 8}" r="8" fill="#e6f2f4" stroke="${P.ink}" stroke-width="2" fill-opacity=".5"/>` + ink(line(x - w * 0.3, y - h * 0.8, x - w * 0.36, y - h * 0.4, 0.3), 3, { stroke: "#ffffff", op: 0.6 });

  // Glass display case on legs, filled with pieces.
  function vitrine(x, y, w, h, o = {}) {
    let s = ink(line(x + 10, y + h, x + 10, y + h + 70, 0.3), 6, { stroke: M.woodDark }) + ink(line(x + w - 10, y + h, x + w - 10, y + h + 70, 0.3), 6, { stroke: M.woodDark });
    s += sh(rect(x, y, w, h, 1), M.woodDark) + sh(rect(x + 10, y + 10, w - 20, h - 20, 0.8), o.velvet || "#e9e2d2", { sw: 2 });
    const shelves = o.shelves || 2;
    for (let i = 1; i <= shelves; i++) {
      const sy = y + 10 + ((h - 20) * i) / shelves;
      s += ink(line(x + 10, sy, x + w - 10, sy, 0.3), 3, { stroke: "#cfc5b0" });
      const n = Math.floor((w - 40) / 60);
      for (let j = 0; j < n; j++) {
        if (o.gap && i === o.gap[0] && j === o.gap[1]) continue;
        const kind = ["goblet", "vase", "chalice"][(i + j) % 3];
        s += goblet(x + 40 + j * 60, sy - 2, M.glass[(i * 3 + j) % M.glass.length], 0.6, kind);
      }
    }
    s += `<rect x="${x + 10}" y="${y + 10}" width="${w - 20}" height="${h - 20}" fill="#ffffff" opacity=".1"/>` + ink(line(x + 30, y + 20, x + 60, y + h - 30, 0.3), 3, { stroke: "#ffffff", op: 0.35 });
    return s;
  }

  // Street lamp of the period (gas lantern on a bracket).
  function lantern(x, y) {
    let s = ink(curve([[x - 50, y - 40], [x - 20, y - 60], [x, y - 40]], 0.4), 4, { stroke: M.iron });
    s += sh(poly([[x - 16, y - 40], [x + 16, y - 40], [x + 12, y + 10], [x - 12, y + 10]], 0.6), "#ffe39a", { sw: 2.5 }) + sh(poly([[x - 20, y - 40], [x, y - 58], [x + 20, y - 40]], 0.5), M.iron);
    return s;
  }
  const lanternGlow = (x, y, r = 110) => `<circle cx="${x}" cy="${y - 14}" r="${r}" fill="url(#g-warm)" class="flicker"/>`;

  // Striped shop awning.
  function awning(x, y, w) {
    let s = "";
    for (let i = 0; i < w / 40; i++) s += sh(poly([[x + i * 40, y], [x + i * 40 + 40, y], [x + i * 40 + 46, y + 70], [x + i * 40 + 6, y + 70]], 0.5), i % 2 ? "#e8dcc0" : "#a8443a", { sw: 1.8 });
    for (let i = 0; i < w / 40; i++) s += sh(soft([[x + i * 40 + 6, y + 70], [x + i * 40 + 46, y + 70], [x + i * 40 + 26, y + 88]], 0.4), i % 2 ? "#e8dcc0" : "#a8443a", { sw: 1.8 });
    return s;
  }

  // A travelling player's trunk, with a label.
  function trunk(x, y, w, h, col, label) {
    let s = sh(rect(x, y, w, h, 1), col) + sh(rect(x, y, w, h * 0.3, 0.8), col, { sw: 2.5 });
    s += ink(line(x + w * 0.2, y, x + w * 0.2, y + h, 0.3), 4, { stroke: M.brass }) + ink(line(x + w * 0.8, y, x + w * 0.8, y + h, 0.3), 4, { stroke: M.brass });
    if (label) s += sh(rect(x + w * 0.24, y + h * 0.42, w * 0.52, h * 0.34, 0.4), "#f6f1e2", { sw: 1.6 }) + A.text(x + w / 2, y + h * 0.66, label, { size: Math.min(22, w * 0.1), font: "Alegreya, serif", weight: 700, fill: P.ink });
    return s;
  }

  // A moored gondola-like boat (sandolo) seen from the side.
  function boat(x, y, w) {
    let s = sh(soft([[x, y - 30], [x + w * 0.1, y], [x + w * 0.9, y], [x + w, y - 40], [x + w * 0.85, y - 14], [x + w * 0.15, y - 14]], 1.5), "#1e1a1c", { sw: 2.5 });
    s += ink(line(x + w * 0.5, y - 14, x + w * 0.62, y - 120, 0.3), 4, { stroke: M.wood });
    return s;
  }

  // St Martin biscuit: a horseman in shortbread with sugared sweets.
  function biscuit(x, y, k = 1) {
    let s = sh(soft([[x - 30 * k, y], [x - 26 * k, y - 26 * k], [x - 10 * k, y - 30 * k], [x - 4 * k, y - 56 * k], [x + 12 * k, y - 54 * k], [x + 10 * k, y - 30 * k], [x + 30 * k, y - 24 * k], [x + 32 * k, y]], 1), "#c98a4a", { sw: 2 });
    [[-14, -14, "#e65a7a"], [6, -18, "#f6f1e6"], [20, -8, "#6ab0e0"], [4, -42, "#f2d36b"], [-20, -4, "#5aae5a"]].forEach(([dx, dy, c]) => (s += `<circle cx="${x + dx * k}" cy="${y + dy * k}" r="${3.2 * k}" fill="${c}"/>`));
    return s;
  }

  // Wall sconce with a lit candle (dining room, museum).
  const candle = (x, y) => sh(rect(x - 5, y - 30, 10, 30, 0.4), "#f6f1e2", { sw: 1.5 }) + sh(blob(x, y - 36, 4, 8, 0.1, 6), "#ffd38a", { sw: 0 });
  const candleGlow = (x, y) => `<circle cx="${x}" cy="${y - 36}" r="60" fill="url(#g-warm)" class="flicker"/>`;

  // Murano glass chandelier: arms with coloured flowers and drops.
  function chandelier(x, y, k = 1) {
    let s = ink(line(x, 0, x, y - 40 * k, 0.3), 3, { stroke: M.iron });
    s += sh(blob(x, y - 20 * k, 16 * k, 30 * k, 0.05, 10), "#e6f2f4", { op: 0.6, sw: 2 });
    for (let i = -3; i <= 3; i++) {
      const ax = x + i * 34 * k;
      s += ink(curve([[x, y], [ax, y + 20 * k], [ax, y - 10 * k]], 0.4), 4 * k, { stroke: "#e6f2f4" });
      s += sh(blob(ax, y - 16 * k, 10 * k, 8 * k, 0.1, 8), M.glass[(i + 3) % M.glass.length], { sw: 1.6 });
      s += ink(line(ax, y + 18 * k, ax, y + 40 * k, 0.2), 2, { stroke: "#e6f2f4" }) + `<circle cx="${ax}" cy="${y + 44 * k}" r="${4 * k}" fill="#e6f2f4" stroke="${P.ink}" stroke-width="1"/>`;
    }
    return s;
  }

  CH.murano = {
    M, brickWall, furnace, arca, gloria, marver, waterGlobe, lightPoint, toolRack, elecClock, gothicWindow, canal, fogBands,
    bridge, campanile, goblet, chalice, bellJar, vitrine, lantern, lanternGlow, awning, trunk, boat, biscuit, candle, candleGlow, chandelier,
  };
})();

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

// Drawing pieces for the Portman Rooms, Baker Street, 1895: wallpaper and wainscot,
// gaslight, the stage and its screen, the magic lantern, the yellow fog, and the
// optician's shop across the street. Scene files build on CH.london.
(function () {
  const A = CH.art, P = A.P;
  const { sh, ink, soft, rect, blob, curve, line, g, poly } = A;
  const f = (n) => Math.round(n * 10) / 10;

  const L = Object.freeze({
    night: "#1e1c1a",
    fog: "#d8c98e",
    fogDeep: "#a8975e",
    paperGreen: "#2f4a3a",
    paperRed: "#6a2a2a",
    paperBlue: "#2a3a6a",
    mahogany: "#5a2e22",
    mahoganyLight: "#7a4430",
    oak: "#8a6440",
    brass: "#c9a24a",
    velvetRed: "#8a1e2a",
    velvetBlue: "#2a3a7a",
    plaster: "#e8dcc4",
    gas: "#ffe0a0",
    leather: "#6a3a24",
    iron: "#2e2e32",
    cream: "#f3ece0",
  });

  const baseDefs = A.defs;
  A.defs = () =>
    baseDefs() +
    `
<radialGradient id="g-gas"><stop offset="0" stop-color="#fff0c0" stop-opacity=".85"/><stop offset="1" stop-color="#ffd890" stop-opacity="0"/></radialGradient>
<radialGradient id="g-limelight"><stop offset="0" stop-color="#ffffff" stop-opacity=".9"/><stop offset=".4" stop-color="#fff6dc" stop-opacity=".5"/><stop offset="1" stop-color="#fff6dc" stop-opacity="0"/></radialGradient>
<linearGradient id="g-yellowfog" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${L.fog}" stop-opacity="0"/><stop offset=".5" stop-color="${L.fog}" stop-opacity=".75"/><stop offset="1" stop-color="${L.fog}" stop-opacity="0"/></linearGradient>
<pattern id="p-damask" width="60" height="80" patternUnits="userSpaceOnUse"><rect width="60" height="80" fill="${L.paperGreen}"/><path d="M30 10q12 14 0 30q-12 -16 0 -30zM30 50q8 10 0 20q-8 -10 0 -20z" fill="#3e5e4a"/><circle cx="0" cy="40" r="4" fill="#3e5e4a"/><circle cx="60" cy="40" r="4" fill="#3e5e4a"/></pattern>
<pattern id="p-damask-blue" width="60" height="80" patternUnits="userSpaceOnUse"><rect width="60" height="80" fill="${L.paperBlue}"/><path d="M30 10q12 14 0 30q-12 -16 0 -30zM30 50q8 10 0 20q-8 -10 0 -20z" fill="#3a4c84"/></pattern>
<pattern id="p-parquet" width="80" height="40" patternUnits="userSpaceOnUse"><rect width="80" height="40" fill="#7a5034"/><path d="M0 20H80M40 0V20M0 20V40M80 20V40" stroke="#5a3624" stroke-width="2"/></pattern>
<pattern id="p-carpet-red" width="50" height="50" patternUnits="userSpaceOnUse"><rect width="50" height="50" fill="#6a1e24"/><circle cx="25" cy="25" r="7" fill="none" stroke="#c9a24a" stroke-width="1.5" opacity=".5"/></pattern>`;

  // Papered wall over a wooden wainscot.
  function wall(y0, y1, paper = "url(#p-damask)", wood = L.mahogany) {
    let s = `<rect x="-10" y="${y0}" width="1620" height="${y1 - y0}" fill="${paper}"/>`;
    s += sh(rect(-10, y1 - 150, 1620, 150, 1), wood) + sh(rect(-10, y1 - 156, 1620, 12, 0.6), L.mahoganyLight, { sw: 2 });
    for (let x = 40; x < 1600; x += 160) s += sh(rect(x, y1 - 132, 120, 110, 0.6), "none", { sw: 2, op: 0.5 });
    return s;
  }

  // Gas bracket with a frosted globe.
  function gasLamp(x, y) {
    let s = ink(curve([[x - 30, y + 30], [x - 10, y + 10], [x, y]], 0.3), 4, { stroke: L.brass });
    s += sh(blob(x, y - 20, 16, 20, 0.05, 10), "#fff4d8", { sw: 2.4 }) + sh(rect(x - 10, y - 2, 20, 8, 0.3), L.brass, { sw: 1.6 });
    return s;
  }
  const gasGlow = (x, y, r = 120) => `<circle cx="${x}" cy="${y - 20}" r="${r}" fill="url(#g-gas)" class="flicker"/>`;

  // Bentwood chair, seen from behind.
  function chair(x, y, k = 1) {
    let s = ink(line(x - 16 * k, y, x - 14 * k, y - 50 * k, 0.2), 4 * k, { stroke: "#3a2418" }) + ink(line(x + 16 * k, y, x + 14 * k, y - 50 * k, 0.2), 4 * k, { stroke: "#3a2418" });
    s += sh(rect(x - 20 * k, y - 54 * k, 40 * k, 8 * k, 0.3), "#8a1e2a", { sw: 1.6 });
    s += ink(curve([[x - 16 * k, y - 54 * k], [x - 18 * k, y - 96 * k], [x, y - 104 * k], [x + 18 * k, y - 96 * k], [x + 16 * k, y - 54 * k]], 0.3), 4 * k, { stroke: "#3a2418" });
    return s;
  }

  // Proscenium stage with red curtains and a stretched screen (rear projection).
  function stage(x, y, w, h) {
    let s = sh(rect(x, y + h, w, 40, 1), L.mahogany) + sh(rect(x - 30, y - 60, w + 60, 70, 1.2), L.velvetRed);
    for (let i = 0; i < 8; i++) s += ink(curve([[x - 30 + i * (w + 60) / 8, y + 10], [x - 14 + i * (w + 60) / 8, y - 20], [x + 2 + i * (w + 60) / 8, y + 10]], 0.4), 2, { stroke: L.brass, op: 0.7 });
    s += sh(rect(x + 40, y + 20, w - 80, h - 30, 1), "#efe8d6", { sw: 3 });
    s += sh(soft([[x - 30, y], [x + 60, y], [x + 40, y + h], [x - 30, y + h]], 1.5), L.velvetRed) + sh(soft([[x + w - 60, y], [x + w + 30, y], [x + w + 30, y + h], [x + w - 40, y + h]], 1.5), L.velvetRed);
    return s;
  }

  // What the lantern throws on the screen: a temple among palms (Ceylon).
  function ceylonSlide(cx, cy, k = 1, tilt = 0) {
    let s = `<g transform="rotate(${tilt} ${cx} ${cy})" opacity=".85">`;
    s += `<ellipse cx="${cx}" cy="${cy}" rx="${190 * k}" ry="${120 * k}" fill="#f6e2a8"/>`;
    s += `<path d="M${cx - 60 * k} ${cy + 40 * k}h${120 * k}l${-10 * k} ${-40 * k}h${-100 * k}z" fill="#c98a4a"/>`;
    s += `<path d="M${cx - 40 * k} ${cy}q${40 * k} ${-90 * k} ${80 * k} 0z" fill="#e8c88a" stroke="#8a5a3a" stroke-width="2"/>`;
    [[-130, 1], [130, -1]].forEach(([dx, d]) => (s += `<path d="M${cx + dx * k} ${cy + 60 * k}q${8 * d * k} ${-60 * k} ${-4 * d * k} ${-110 * k}" stroke="#5a3a20" stroke-width="${6 * k}" fill="none"/><path d="M${cx + dx * k - 4 * d * k} ${cy - 50 * k}q${-40 * k} ${-10 * k} ${-60 * k} ${20 * k}M${cx + dx * k - 4 * d * k} ${cy - 50 * k}q${40 * k} ${-10 * k} ${60 * k} ${20 * k}" stroke="#4a7a3a" stroke-width="${8 * k}" fill="none" stroke-linecap="round"/>`));
    s += `</g>`;
    return s;
  }

  // Upright piano.
  function piano(x, y) {
    let s = sh(rect(x, y - 170, 200, 170, 1.2), "#2a1a14") + sh(rect(x - 10, y - 90, 220, 20, 0.6), "#3a2418");
    for (let i = 0; i < 16; i++) s += sh(rect(x + 4 + i * 12.5, y - 88, 11, 16, 0.2), "#f6f1e2", { sw: 1 });
    for (let i = 0; i < 16; i++) if (i % 7 !== 2 && i % 7 !== 6) s += `<rect x="${x + 12 + i * 12.5}" y="${y - 88}" width="7" height="9" fill="#1a1210"/>`;
    s += ink(line(x + 20, y, x + 20, y - 70, 0.3), 6, { stroke: "#2a1a14" }) + ink(line(x + 180, y, x + 180, y - 70, 0.3), 6, { stroke: "#2a1a14" });
    s += [[x + 40, "#f6f1e2"], [x + 160, "#f6f1e2"]].map(([cx, c]) => sh(rect(cx - 6, y - 210, 12, 30, 0.3), c, { sw: 1.4 })).join("");
    return s;
  }

  // Collection box of the eye hospital, on a turned post.
  function collectionBox(x, y, label) {
    let s = ink(line(x, y, x, y - 90, 0.3), 10, { stroke: L.mahogany }) + sh(rect(x - 34, y - 150, 68, 64, 1), "#3a2418");
    s += sh(rect(x - 18, y - 150, 36, 6, 0.2), "#1a1210", { sw: 1 }) + sh(rect(x - 28, y - 132, 56, 22, 0.4), L.cream, { sw: 1.4 });
    if (label) s += A.text(x, y - 116, label, { size: 11, font: "Alegreya, serif", weight: 700 });
    s += `<circle cx="${x + 22}" cy="${y - 96}" r="4" fill="${L.brass}"/>`;
    return s;
  }

  // Bell jar lifted off, lying on its side, and the empty velvet cushion.
  function emptyCushion(x, y, o = {}) {
    // A marble pedestal, so the cushion stands out against the blue paper.
    let s = sh(rect(x - 40, y + 20, 80, 160, 1), "#e8e0d0") + sh(rect(x - 70, y, 140, 24, 0.8), "#d9cfbc") + sh(rect(x - 60, y + 176, 120, 20, 0.8), "#d9cfbc");
    s += sh(soft([[x - 56, y], [x + 56, y], [x + 50, y - 26], [x - 50, y - 26]], 1), L.velvetBlue);
    s += `<ellipse cx="${x}" cy="${y - 16}" rx="16" ry="6" fill="#1a2650" opacity=".7"/>`;
    if (o.monocle) s += `<circle cx="${x + 22}" cy="${y - 14}" r="9" fill="#ffffff" fill-opacity=".35" stroke="${L.brass}" stroke-width="2.4"/>` + ink(curve([[x + 30, y - 14], [x + 44, y - 4], [x + 40, y + 10]], 0.3), 1.6, { stroke: "#1f1a18" });
    // The glass bell, lifted off and set down on the floor beside the pedestal
    const bell = soft([[-40, 0], [-40, -70], [-20, -96], [20, -96], [40, -70], [40, 0]], 1);
    s += g(`<path d="${bell}" fill="#dcebff" fill-opacity=".28" stroke="#eef6ff" stroke-width="3"/>` + `<path d="${bell}" fill="none" stroke="${P.ink}" stroke-width="1.2" opacity=".5"/>` + `<circle cx="0" cy="-104" r="8" fill="#dcebff" fill-opacity=".4" stroke="#eef6ff" stroke-width="2.4"/>` + ink(curve([[-28, -10], [-32, -50], [-18, -84]], 0.2), 3.4, { stroke: "#ffffff", op: 0.9 }), `transform="translate(${x + 130},${y + 196})"`);
    return s;
  }

  // Sash window on the yellow fog.
  function fogWindow(x, y, w, h) {
    let s = sh(rect(x - 12, y - 12, w + 24, h + 24, 1), L.mahoganyLight) + `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${L.fog}"/>`;
    s += `<rect x="${x}" y="${y + h * 0.3}" width="${w}" height="${h * 0.4}" fill="${L.fogDeep}" opacity=".35"/>`;
    s += ink(line(x + w / 2, y, x + w / 2, y + h, 0.2), 4, { stroke: L.mahoganyLight }) + ink(line(x, y + h / 2, x + w, y + h / 2, 0.2), 5, { stroke: L.mahoganyLight });
    s += sh(soft([[x - 20, y - 20], [x + 40, y - 14], [x + 30, y + h + 30], [x - 24, y + h + 30]], 1.5), L.velvetRed) + sh(soft([[x + w + 20, y - 20], [x + w - 40, y - 14], [x + w - 30, y + h + 30], [x + w + 24, y + h + 30]], 1.5), L.velvetRed);
    return s;
  }

  // The biunial magic lantern on its mahogany tripod.
  function magicLantern(x, y) {
    let s = ink(line(x, y, x - 70, y + 220, 0.3), 8, { stroke: L.mahogany }) + ink(line(x, y, x + 70, y + 220, 0.3), 8, { stroke: L.mahogany }) + ink(line(x, y, x, y + 230, 0.3), 8, { stroke: L.mahogany });
    s += sh(rect(x - 80, y - 170, 160, 170, 1.2), L.mahoganyLight);
    for (const ty of [y - 140, y - 60]) s += sh(rect(x + 80, ty - 18, 90, 36, 0.8), L.brass) + sh(rect(x + 170, ty - 24, 20, 48, 0.4), L.brass) + `<circle cx="${x + 190}" cy="${ty}" r="16" fill="#cfe2ea" stroke="${P.ink}" stroke-width="2"/>`;
    s += sh(rect(x - 30, y - 210, 60, 44, 0.6), L.iron) + sh(rect(x - 20, y - 240, 40, 34, 0.4), L.iron);
    s += sh(rect(x - 140, y + 20, 30, 120, 0.8), "#3a4a3a") + sh(rect(x - 104, y + 30, 26, 110, 0.8), "#5a3a2a");
    s += ink(curve([[x - 125, y + 20], [x - 110, y - 40], [x - 80, y - 60]], 0.4), 3, { stroke: "#2a2a2a" }) + ink(curve([[x - 91, y + 30], [x - 90, y - 20], [x - 80, y - 30]], 0.4), 3, { stroke: "#2a2a2a" });
    return s;
  }
  const lanternBeam = (x, y) => `<polygon points="${x + 190},${y - 160} ${x + 190},${y - 40} 1600,${y - 260} 1600,${y + 60}" fill="url(#g-limelight)" opacity=".35"/><circle cx="${x + 190}" cy="${y - 100}" r="70" fill="url(#g-limelight)" class="flicker"/>`;

  // Slide box: a wooden case with numbered grooves; slot 52 has lost its partition.
  function slideBox(x, y, o = {}) {
    let s = sh(rect(x, y, 240, 90, 1), L.oak) + sh(rect(x + 8, y + 8, 224, 70, 0.6), "#5a3a22", { sw: 2 });
    for (let i = 0; i < 28; i++) {
      if (o.gap && (i === 25 || i === 26)) continue;
      s += sh(rect(x + 12 + i * 7.8, y + 10, 4, 64, 0.1), "#cfe0e6", { sw: 0.8 });
    }
    if (o.label) s += sh(rect(x + 70, y - 26, 100, 24, 0.4), L.cream, { sw: 1.4 }) + A.text(x + 120, y - 9, o.label, { size: 13, font: "Alegreya, serif", weight: 700 });
    if (o.handkerchief) s += sh(blob(x + 212, y + 30, 12, 20, 0.15, 8), "#f6f1e6", { sw: 1.4 });
    return s;
  }

  // Cast-iron radiator.
  function radiator(x, y) {
    let s = "";
    for (let i = 0; i < 9; i++) s += sh(rect(x + i * 18, y - 110, 15, 110, 0.4), "#7a7a80", { sw: 1.6 });
    return s + sh(rect(x - 4, y - 116, 9 * 18 + 4, 10, 0.3), "#6a6a70", { sw: 1.6 });
  }

  // Safety bicycle, 1890s, with pneumatic tyres.
  function bicycle(x, y) {
    let s = `<circle cx="${x}" cy="${y - 50}" r="50" fill="none" stroke="#1a1a1a" stroke-width="8"/><circle cx="${x + 170}" cy="${y - 50}" r="50" fill="none" stroke="#1a1a1a" stroke-width="8"/>`;
    s += `<circle cx="${x}" cy="${y - 50}" r="43" fill="none" stroke="#e8e8ea" stroke-width="2.4"/><circle cx="${x + 170}" cy="${y - 50}" r="43" fill="none" stroke="#e8e8ea" stroke-width="2.4"/>`;
    const frame = poly([[x, y - 50], [x + 70, y - 50], [x + 90, y - 120], [x + 160, y - 120], [x + 170, y - 50], [x + 70, y - 50]], 0.3, false);
    s += ink(frame, 9, { stroke: P.ink }) + ink(frame, 5, { stroke: "#f0e6c8" });
    s += ink(line(x + 90, y - 120, x + 82, y - 140, 0.2), 6, { stroke: "#f0e6c8" }) + sh(rect(x + 64, y - 150, 36, 12, 0.3), "#c08a4a") + ink(line(x + 160, y - 120, x + 150, y - 160, 0.2), 6, { stroke: "#f0e6c8" }) + ink(line(x + 132, y - 162, x + 172, y - 158, 0.2), 5, { stroke: "#e8e8ea" });
    return s;
  }

  // Wall telephone with its crank and earpiece.
  function telephone(x, y) {
    let s = sh(rect(x, y, 70, 120, 1), "#5a3a22") + `<circle cx="${x + 20}" cy="${y + 20}" r="9" fill="${L.brass}" stroke="${P.ink}" stroke-width="1.6"/><circle cx="${x + 50}" cy="${y + 20}" r="9" fill="${L.brass}" stroke="${P.ink}" stroke-width="1.6"/>`;
    s += sh(rect(x + 25, y + 50, 20, 12, 0.3), "#1a1a1a", { sw: 1.4 }) + ink(line(x + 70, y + 70, x + 92, y + 64, 0.2), 4, { stroke: "#2a2a2a" }) + `<circle cx="${x + 94}" cy="${y + 64}" r="5" fill="#2a2a2a"/>`;
    s += sh(rect(x - 16, y + 40, 14, 40, 0.4), "#1a1a1a") + ink(curve([[x - 9, y + 80], [x - 20, y + 110], [x + 10, y + 120]], 0.3), 2);
    return s;
  }

  // Coat rack laden with coats and capes.
  function coatRack(x, y, cols) {
    let s = ink(line(x, y, x + cols.length * 90, y, 0.3), 6, { stroke: L.brass });
    cols.forEach((c, i) => {
      const cx = x + 40 + i * 90;
      const cape = typeof c === "object";
      const col = cape ? c.color : c;
      s += ink(curve([[cx, y], [cx, y + 12]], 0.2), 3, { stroke: L.brass }) + ink(poly([[cx - 30, y + 24], [cx, y + 12], [cx + 30, y + 24]], 0.2, false), 3.4, { stroke: "#8a6440" });
      s += sh(soft([[cx - 30, y + 22], [cx + 30, y + 22], [cx + (cape ? 50 : 40), y + 240], [cx - (cape ? 50 : 40), y + 240]], 1.5), col);
      if (cape) {
        s += sh(soft([[cx + 6, y + 30], [cx + 26, y + 28], [cx + 40, y + 236], [cx + 18, y + 236]], 0.8), c.lining, { sw: 1.4 });
        s += sh(soft([[cx - 26, y + 22], [cx + 26, y + 22], [cx + 20, y + 44], [cx - 20, y + 44]], 0.6), col, { sw: 1.6 });
        if (c.glint) s += `<circle cx="${cx - 14}" cy="${y + 120}" r="6" fill="none" stroke="${L.brass}" stroke-width="2.4"/><circle cx="${cx + 2}" cy="${y + 120}" r="6" fill="none" stroke="${L.brass}" stroke-width="2.4"/>`;
      }
    });
    return s;
  }

  // Leather club armchair.
  function armchair(x, y, flip) {
    const k = flip ? -1 : 1;
    let s = sh(soft([[x - 70, y], [x + 70, y], [x + 76, y - 60], [x - 76, y - 60]], 1.5), L.leather);
    s += sh(soft([[x - 60, y - 60], [x + 60, y - 60], [x + 56, y - 170], [x - 56, y - 170]], 1.5), L.leather);
    s += sh(soft([[x - 86 * k, y - 40], [x - 64 * k, y - 40], [x - 64 * k, y - 110], [x - 92 * k, y - 104]], 1), "#5a2e1c");
    for (let i = 0; i < 3; i++) for (let j = 0; j < 2; j++) s += `<circle cx="${x - 30 + i * 30}" cy="${y - 140 + j * 34}" r="3" fill="#3a1e10"/>`;
    return s;
  }

  // Ropes and sandbags in the flies.
  function flies(x0, x1) {
    let s = "";
    for (let x = x0; x < x1; x += 90) {
      s += ink(line(x, 0, x + 4, 360 + (x % 3) * 40, 0.3), 3, { stroke: "#a8875a" });
      s += sh(blob(x + 4, 380 + (x % 3) * 40, 16, 22, 0.1, 8), "#8a7a5a", { sw: 2 });
    }
    return s;
  }

  // Open stage trunk with a tray of hairpieces; one place empty.
  function magicTrunk(x, y, o = {}) {
    let s = sh(rect(x, y - 110, 220, 110, 1), "#3a1e14") + sh(poly([[x, y - 110], [x + 220, y - 110], [x + 240, y - 220], [x + 20, y - 220]], 1), "#4a2a1a");
    s += sh(rect(x + 10, y - 120, 200, 20, 0.4), "#c9a24a", { sw: 1.6 });
    [[x + 40, "#8a3a1a"], [x + 90, "#2a1a14"], [x + 140, null], [x + 185, "#e8e4dc"]].forEach(([cx, c]) => {
      if (c) s += sh(blob(cx, y - 110, 16, 7, 0.15, 8), c, { sw: 1.4 });
      else s += `<ellipse cx="${cx}" cy="${y - 110}" rx="16" ry="7" fill="none" stroke="#1a1210" stroke-width="1.4" stroke-dasharray="3 3"/>`;
    });
    s += `<circle cx="${x + 110}" cy="${y - 50}" r="8" fill="${L.brass}"/>`;
    return s;
  }

  // Trial-lens case of the optician: rows of lenses in velvet.
  function trialCase(x, y) {
    let s = sh(rect(x, y, 240, 110, 1), "#4a2a1a") + sh(rect(x + 8, y + 8, 224, 94, 0.6), "#2a3a6a", { sw: 1.6 });
    for (let r = 0; r < 4; r++) for (let c = 0; c < 10; c++) s += `<circle cx="${x + 24 + c * 21}" cy="${y + 22 + r * 22}" r="8" fill="#e6f2f4" fill-opacity=".6" stroke="${r % 2 ? "#a8443a" : "#2a2a2a"}" stroke-width="1.6"/>`;
    return s;
  }

  // Passer-by in the fog: a tall man with a pipe and a deerstalker, from behind.
  function passerBy(x, y) {
    let s = sh(soft([[x - 30, y], [x + 30, y], [x + 26, y - 150], [x - 26, y - 150]], 1.2), "#4a4034", { op: 0.6 });
    s += sh(blob(x, y - 170, 18, 22, 0.08, 8), "#4a4034", { op: 0.6 }) + sh(soft([[x - 26, y - 182], [x + 30, y - 182], [x + 22, y - 198], [x - 20, y - 198]], 0.6), "#5a4a34", { op: 0.6 });
    s += ink(curve([[x + 16, y - 166], [x + 34, y - 160], [x + 40, y - 172]], 0.3), 4, { stroke: "#3a2a1a", op: 0.6 });
    return s;
  }

  function fogBands(n, y0, y1) {
    let s = "";
    for (let i = 0; i < n; i++) {
      const y = y0 + ((y1 - y0) * i) / Math.max(1, n - 1);
      s += `<g class="mist" style="animation-delay:-${i * 5}s"><rect x="-300" y="${f(y - 60)}" width="2200" height="120" fill="url(#g-yellowfog)" opacity=".8"/></g>`;
    }
    return s;
  }

  // Street gas lamp on its post.
  function streetLamp(x, y) {
    let s = ink(line(x, y, x, y - 300, 0.3), 9, { stroke: L.iron }) + ink(line(x - 20, y - 250, x + 20, y - 250, 0.2), 4, { stroke: L.iron });
    s += sh(poly([[x - 24, y - 300], [x + 24, y - 300], [x + 16, y - 350], [x - 16, y - 350]], 0.6), "#ffe39a", { sw: 2.5 }) + sh(poly([[x - 28, y - 350], [x, y - 372], [x + 28, y - 350]], 0.5), L.iron);
    return s;
  }

  CH.london = {
    L, wall, gasLamp, gasGlow, chair, stage, ceylonSlide, piano, collectionBox, emptyCushion, fogWindow, magicLantern, lanternBeam,
    slideBox, radiator, bicycle, telephone, coatRack, armchair, flies, magicTrunk, trialCase, passerBy, fogBands, streetLamp,
  };
})();

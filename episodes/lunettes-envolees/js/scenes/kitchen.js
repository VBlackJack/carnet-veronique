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

// Tableau I: the farmhouse kitchen at eight in the morning. Veronique gropes for her
// glasses, Tobias sleeps on the table, and the shutter keeps the sun out.
(function () {
  const A = CH.art, P = A.P, E = CH.epArt;
  const has = (s, id) => s.cards.includes(id);
  const flag = (s, id) => !!s.flags[id];
  const from = (content, vars) => `<g class="m-from" style="${vars}">${content}</g>`;

  const WIN = { x: 180, y: 120, w: 260, h: 260 };
  const TABLE = { x: 560, y: 540, w: 500 };
  const CAT = { x: 920, y: 541, k: 1.3 };
  const VERO = { x: 500, y: 792, h: 400 };
  // Tobias dreams of the push only: where the glasses landed is for the sketchbook to find.
  const DREAM = { at: [960, 455], pics: ["paw", "then", "fall"], dream: true };

  function wall() {
    A.srand(101);
    let s = `<rect width="1600" height="900" fill="${P.plaster}"/>`;
    for (let i = 0; i < 16; i++) s += A.sh(A.blob(A.rnd() * 1600, 80 + A.rnd() * 640, 60 + A.rnd() * 120, 30 + A.rnd() * 60, 0.15, 10), P.plasterDark, { sw: 0, op: 0.22 });
    s += A.sh(A.rect(-10, -10, 1620, 66, 2), P.woodDark);
    for (let x = 40; x < 1600; x += 190) s += A.sh(A.rect(x, 44, 46, 30, 1), P.wood, { sw: 2.4 });
    s += A.sh(A.rect(-10, 772, 1620, 20, 1.5), P.woodDark, { sw: 2.4 });
    return s;
  }

  function windowView(s) {
    const open = flag(s, "shutter_open");
    let r = `<clipPath id="k-win"><rect x="${WIN.x}" y="${WIN.y}" width="${WIN.w}" height="${WIN.h}"/></clipPath>`;
    r += `<g clip-path="url(#k-win)"><rect x="${WIN.x}" y="${WIN.y}" width="${WIN.w}" height="${WIN.h}" fill="${open ? "#f6e7b8" : "#b9c2b4"}"/>`;
    r += A.hills(300, P.meadowFar, 18, 4) + A.hills(340, P.meadow, 14, 6);
    r += E.treeIcon(380, 330, 1.6);
    if (open) r += `<circle cx="230" cy="170" r="34" fill="${E.COL.sun}" stroke="${P.ink}" stroke-width="2.4"/>`;
    r += `</g>`;
    r += A.ink(A.rect(WIN.x - 8, WIN.y - 8, WIN.w + 16, WIN.h + 16, 1.5), 14, { stroke: P.wood });
    r += A.ink(A.line(WIN.x + WIN.w / 2, WIN.y, WIN.x + WIN.w / 2, WIN.y + WIN.h, 0.5), 8, { stroke: P.wood });
    r += A.ink(A.line(WIN.x, WIN.y + WIN.h / 2, WIN.x + WIN.w, WIN.y + WIN.h / 2, 0.5), 8, { stroke: P.wood });
    // The shutter: closed over the window, or swung open against the wall.
    if (!open) {
      let sh = "";
      for (let i = 0; i < 5; i++) sh += A.sh(A.rect(WIN.x + i * 52, WIN.y - 4, 52, WIN.h + 8, 1.2), i % 2 ? P.teal : "#58787a", { sw: 2.4 });
      sh += A.ink(A.line(WIN.x, WIN.y + 60, WIN.x + WIN.w, WIN.y + 60, 0.5), 6, { stroke: "#3e5856" }) + A.ink(A.line(WIN.x, WIN.y + 200, WIN.x + WIN.w, WIN.y + 200, 0.5), 6, { stroke: "#3e5856" });
      r += sh;
    }
    return r;
  }

  function shutterOpen(beat) {
    const panel = A.sh(A.soft([[452, 106], [500, 120], [500, 372], [452, 392]], 1), P.teal, { sw: 2.4 }) + A.ink(A.line(476, 116, 476, 380, 0.3), 2, { stroke: "#3e5856" });
    return beat === "shutter" ? from(panel, "--origin:0% 50%;--sx:-5.4;--sy:1;--ms:1000ms") : panel;
  }

  function sill(s) {
    let r = A.sh(A.rect(148, 380, 330, 20, 1.5), P.woodLight, { sw: 2.6 });
    r += `<ellipse cx="272" cy="389" rx="8" ry="3.4" fill="${E.COL.burn}" opacity=".7"/>`;
    r += E.spare(250, 370, 0.95);
    if (flag(s, "shutter_open")) r += E.hotspot(266, 388, 0.9);
    // Gerberas in a pot.
    const flower = A.ink(A.curve([[345, 362], [340, 330], [346, 300]], 0.6), 3, { stroke: P.moss })
      + [0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
        const a = (i * 45 * Math.PI) / 180;
        return `<ellipse cx="${(346 + Math.cos(a) * 13).toFixed(1)}" cy="${(296 + Math.sin(a) * 13).toFixed(1)}" rx="8" ry="4.4" transform="rotate(${i * 45} ${(346 + Math.cos(a) * 13).toFixed(1)} ${(296 + Math.sin(a) * 13).toFixed(1)})" fill="#e8706a" stroke="${P.ink}" stroke-width="1.4"/>`;
      }).join("") + `<circle cx="346" cy="296" r="6" fill="${P.mustard}" stroke="${P.ink}" stroke-width="1.4"/>`;
    r += s.beat === "gerbera" ? `<g class="m-from" style="--origin:50% 100%;--rot:-14deg;--ms:900ms;--ease:cubic-bezier(.3,1.8,.5,1)">${flower}</g>` : `<g class="m-sway" style="--ms:6s">${flower}</g>`;
    r += A.sh(A.soft([[330, 360], [362, 360], [358, 382], [334, 382]], 0.8), P.clay, { sw: 2.2 });
    // Benjamin's LEGO duck.
    const duck = A.sh(A.rect(402, 360, 40, 20, 0.6), "#f2c03a", { sw: 2 }) + A.sh(A.rect(426, 344, 18, 18, 0.6), "#f2c03a", { sw: 2 }) + A.sh(A.rect(444, 350, 10, 7, 0.4), "#e8742a", { sw: 1.6 }) + `<circle cx="436" cy="350" r="2" fill="${P.ink}"/>`;
    r += s.beat === "duck" ? from(duck, "--dy:-26px;--ms:500ms;--ease:cubic-bezier(.3,1.8,.5,1)") : duck;
    return r;
  }

  function cord(beat) {
    const c = A.ink(A.line(150, 150, 152, 560, 0.6), 3, { stroke: P.mud }) + A.sh(A.blob(152, 566, 11, 14, 0.06, 9), P.woodLight, { sw: 2.2 });
    return beat === "shutter" ? from(c, "--dy:60px;--ms:700ms;--ease:cubic-bezier(.3,1.6,.5,1)") : c;
  }

  function clockAndPendulum() {
    let r = A.sh(A.soft([[566, 130], [654, 130], [660, 250], [560, 250]], 1), P.wood, { sw: 2.6 });
    r += E.clock(610, 186, 40, 8);
    r += `<g class="pendulum" style="transform-origin:610px 250px"><path d="M610 250V320" stroke="${P.ochre}" stroke-width="4"/><circle cx="610" cy="326" r="13" fill="${P.ochre}" stroke="${P.ink}" stroke-width="2.4"/></g>`;
    return r;
  }

  function potRack() {
    A.srand(111);
    let r = A.ink(A.line(820, 110, 1250, 112, 0.6), 7, { stroke: P.woodDark });
    [[880, 64], [985, 54], [1085, 74], [1190, 48]].forEach(([x, rad], i) => {
      const pot = A.ink(A.line(x, 112, x, 140, 0.3), 2.4) + A.sh(A.soft([[x - rad, 150], [x + rad, 150], [x + rad * 0.8, 150 + rad * 0.9], [x - rad * 0.8, 150 + rad * 0.9]], 1.4), i % 2 ? "#b8693a" : "#c98a4a", { sw: 2.6 })
        + A.ink(A.curve([[x - rad * 0.6, 162], [x, 158], [x + rad * 0.6, 162]], 0.4), 2, { stroke: "#ffe0b0", op: 0.7 });
      r += `<g class="m-sway" style="--origin:50% 0%;--ms:${5 + i}s">${pot}</g>`;
    });
    return r;
  }

  function stove() {
    let r = A.sh(A.rect(1352, 56, 30, 416, 1), "#3a3432", { sw: 2.6 });
    r += A.sh(A.rect(1290, 470, 160, 22, 1), "#4a4442", { sw: 2.6 });
    r += A.sh(A.rect(1298, 490, 144, 290, 1.5), "#2f2a28", { sw: 2.6 });
    r += A.sh(A.rect(1318, 560, 100, 70, 1), "#1d1918", { sw: 2.4 }) + `<rect class="flicker" x="1326" y="568" width="84" height="54" fill="#f08a3a" opacity=".85"/>`;
    r += A.sh(A.rect(1318, 660, 100, 90, 1), "#3e3836", { sw: 2.2 });
    r += A.sh(A.soft([[1316, 470], [1312, 432], [1336, 416], [1372, 418], [1384, 440], [1380, 470]], 1), "#7a8a8a", { sw: 2.4 }) + A.ink(A.curve([[1384, 440], [1404, 430], [1412, 418]], 0.4), 5, { stroke: "#7a8a8a" });
    r += A.steam(1404, 404, 3);
    return r;
  }

  function buffet(s) {
    let r = A.sh(A.rect(1090, 420, 172, 370, 1.5), P.wood, { sw: 2.6 });
    r += A.sh(A.rect(1082, 410, 188, 16, 1), P.woodLight, { sw: 2.4 });
    r += A.sh(A.rect(1104, 446, 66, 150, 1), P.woodLight, { sw: 2 }) + A.sh(A.rect(1182, 446, 66, 150, 1), P.woodLight, { sw: 2 });
    r += A.sh(A.rect(1104, 616, 144, 150, 1), P.woodLight, { sw: 2 });
    r += `<circle cx="1162" cy="520" r="5" fill="${P.ochre}" stroke="${P.ink}" stroke-width="1.6"/><circle cx="1190" cy="520" r="5" fill="${P.ochre}" stroke="${P.ink}" stroke-width="1.6"/>`;
    // Julien's ledger, open: tiny pictures in columns.
    r += A.sh(A.soft([[1108, 410], [1160, 398], [1214, 410], [1208, 394], [1160, 384], [1112, 394]], 0.6), "#f6efdc", { sw: 2.2 });
    for (let i = 0; i < 3; i++) r += A.ink(A.line(1118 + i * 4, 398 - i * 3 + 6, 1150, 393 - i * 3 + 6, 0.2), 1, { stroke: "#7fa0c0" }) + A.ink(A.line(1170, 393 - i * 3 + 6, 1202, 398 - i * 3 + 6, 0.2), 1, { stroke: "#7fa0c0" });
    r += `<circle cx="1132" cy="395" r="4" fill="none" stroke="${P.ink}" stroke-width="1.2"/>`;
    // A record sleeve leaning on the wall, the disc half out.
    const rec = `<circle cx="1262" cy="372" r="30" fill="#1f1c1c" stroke="${P.ink}" stroke-width="2"/><circle cx="1262" cy="372" r="9" fill="#e8559a"/>`
      + A.sh(A.soft([[1226, 334], [1266, 340], [1262, 410], [1222, 406]], 0.6), "#f3efe6", { sw: 2.4 })
      + [["#4aa0d8", 348], ["#f2d36b", 362], ["#e8559a", 376], ["#5aae5a", 390]].map(([c, y]) => `<rect x="1230" y="${y}" width="28" height="8" fill="${c}" opacity=".85"/>`).join("");
    r += s.beat === "record" ? from(rec, "--rot:-8deg;--origin:50% 100%;--ms:600ms;--ease:cubic-bezier(.3,1.8,.5,1)") + notes() : rec;
    return r;
  }

  function notes() {
    let r = "";
    [[1236, 320], [1272, 300], [1252, 280]].forEach(([x, y], i) => {
      r += `<g class="note" style="animation-delay:-${i * 0.6}s"><circle cx="${x}" cy="${y}" r="6" fill="${P.ink}"/><path d="M${x + 6} ${y}V${y - 26}l12 6" stroke="${P.ink}" stroke-width="2.6" fill="none"/></g>`;
    });
    return r;
  }

  function door() {
    let r = A.sh(A.rect(1458, 226, 136, 566, 1.5), "#9fbf80", { sw: 0 });
    r += `<clipPath id="k-door"><rect x="1458" y="226" width="136" height="566"/></clipPath>`;
    r += `<g clip-path="url(#k-door)">${E.treeIcon(1520, 640, 2.4)}${A.hills(700, P.moss, 10, 13)}</g>`;
    r += A.ink(A.rect(1450, 218, 152, 582, 1.2), 14, { stroke: P.woodDark });
    r += A.sh(A.soft([[1594, 226], [1548, 246], [1548, 776], [1594, 792]], 0.8), P.wood, { sw: 2.6 });
    r += `<circle cx="1560" cy="520" r="6" fill="${P.ochre}" stroke="${P.ink}" stroke-width="1.6"/>`;
    return r;
  }

  function floor() {
    let r = `<rect x="-10" y="790" width="1620" height="120" fill="url(#p-tiles)"/>`;
    r += `<rect x="-10" y="790" width="1620" height="120" fill="${P.mud}" opacity=".18"/>`;
    // Dust, and the clean ring the basket left under the table.
    r += `<ellipse cx="770" cy="800" rx="150" ry="20" fill="${E.COL.dust}" opacity=".7"/>`;
    r += `<ellipse cx="770" cy="800" rx="66" ry="12" fill="#e9e4d8" stroke="${P.inkSoft}" stroke-width="1.2" stroke-dasharray="3 4" opacity=".95"/>`;
    r += `<ellipse cx="770" cy="800" rx="48" ry="8" fill="${E.COL.dust}" opacity=".7"/>`;
    return r;
  }

  function table(s) {
    let r = `<ellipse cx="810" cy="796" rx="290" ry="18" fill="${P.ink}" opacity=".12"/>`;
    [610, 1010].forEach((x) => (r += A.sh(A.rect(x - 12, TABLE.y + 18, 24, 236, 1), P.woodDark, { sw: 2.4 })));
    [585, 1035].forEach((x) => (r += A.sh(A.rect(x - 14, TABLE.y + 18, 28, 250, 1), P.wood, { sw: 2.6 })));
    r += A.sh(A.rect(TABLE.x, TABLE.y, TABLE.w, 24, 1.4), P.woodLight, { sw: 2.8 });
    // The glasses case, open and empty.
    r += A.sh(A.soft([[612, 540], [672, 540], [668, 528], [616, 528]], 0.6), E.COL.frame, { sw: 2 });
    r += A.sh(A.soft([[614, 530], [670, 530], [664, 508], [620, 508]], 0.6), "#2f5450", { sw: 2 });
    r += `<path d="M632 534q4 -6 2 -10M640 535q3 -5 1 -9" stroke="${E.COL.fur}" stroke-width="2" fill="none"/>`;
    if (flag(s, "found") && !flag(s, "wearing")) r += E.specs(660, 522, 0.9, { rot: -8 });
    return r;
  }

  function cat(s) {
    const lit = flag(s, "shutter_open");
    let c = A.namedCat("tobiasse", CAT.x, CAT.y, CAT.k, false);
    const awake = s.beat === "wake" || s.beat === "eye";
    if (awake) {
      const ex = CAT.x + 42 * CAT.k, ey = CAT.y - 35 * CAT.k;
      c += `<ellipse cx="${ex + (s.beat === "eye" ? 18 : 0)}" cy="${ey}" rx="4.4" ry="3.4" fill="#d8c24a" stroke="${P.ink}" stroke-width="1.4"/><circle cx="${ex + (s.beat === "eye" ? 18 : 0)}" cy="${ey}" r="1.6" fill="${P.ink}"/>`;
    }
    let r = lit ? `<ellipse cx="${CAT.x + 6}" cy="${CAT.y - 30}" rx="120" ry="52" fill="url(#g-warm)"/>` : "";
    r += s.beat === "wake" ? from(c, "--dy:-16px;--rot:-5deg;--origin:50% 100%;--ms:1400ms;--ease:cubic-bezier(.3,1.4,.5,1)") : `<g class="m-breathe">${c}</g>`;
    return r;
  }

  function veronique(s) {
    const wearing = flag(s, "wearing");
    const over = wearing
      ? { expr: s.beat === "puton" ? "open" : "smile" }
      : { glasses: null, squint: true, noseMarks: true, expr: "neutral", poseL: "front" };
    const body = A.character("veronique", VERO.x, VERO.y, VERO.h, false, over);
    if (s.beat === "puton") return from(body, "--dy:-10px;--origin:50% 100%;--ms:800ms;--ease:cubic-bezier(.3,1.8,.5,1)");
    return wearing ? body : `<g class="m-sway" style="--ms:3.4s">${body}</g>`;
  }

  function sunbeam(s) {
    if (!flag(s, "shutter_open")) return "";
    // The gradient follows the beam, so the light still shows where it lands on Tobias.
    const grad = `<linearGradient id="k-beam" gradientUnits="userSpaceOnUse" x1="300" y1="130" x2="930" y2="550"><stop offset="0" stop-color="#fff3d2" stop-opacity=".75"/><stop offset="1" stop-color="#fff3d2" stop-opacity=".35"/></linearGradient>`;
    const beam = grad + `<polygon points="190,130 440,130 1090,548 780,560" fill="url(#k-beam)"/>` + A.dust(18, 380, 900, 200, 520);
    return s.beat === "shutter" ? from(beam, "--op:0;--ms:1200ms;--delay:500ms") : beam;
  }

  function draw(s, beat) {
    s = Object.assign({}, s, { beat });
    let back = wall() + windowView(s) + (flag(s, "shutter_open") ? shutterOpen(beat) : "") + cord(beat) + clockAndPendulum() + potRack() + stove() + buffet(s) + door() + floor() + sill(s) + table(s) + cat(s) + veronique(s);
    back = `<g class="anim"><g filter="url(#f-rough)">${back}</g>${sunbeam(s)}</g>`;
    A.srand(131);
    let front = "";
    // Dried herbs hanging in front, and the back of a chair.
    for (let i = 0; i < 5; i++) front += `<g class="m-sway" style="--origin:50% 0%;--ms:${4 + i * 0.7}s">${A.ink(A.line(30 + i * 22, 0, 32 + i * 22, 90 + i * 14, 0.5), 2, { stroke: P.mud })}${A.sh(A.blob(32 + i * 22, 110 + i * 14, 12, 26, 0.2, 9), i % 2 ? P.olive : P.sage, { sw: 2 })}</g>`;
    front += A.sh(A.soft([[-20, 600], [70, 590], [86, 900], [-20, 900]], 2), P.woodDark, { sw: 3 }) + A.ink(A.line(10, 650, 70, 648, 0.5), 6, { stroke: P.wood });
    front += `<rect width="1600" height="900" fill="url(#g-vignette)"/>`;
    return { back, front: `<g class="anim"><g filter="url(#f-rough)">${front}</g></g>` };
  }

  // ---------------------------------------------------------------- Spots
  const spots = [
    { id: "cord", x: 115, y: 370, w: 80, h: 220, at: 205, steps: (s) => flag(s, "shutter_open")
      ? [{ hero: "pull", sfx: "creak" }]
      : [
        { hero: "pull", sfx: "creak" },
        { beat: "shutter", ms: 1300, flag: "shutter_open", sfx: "whoosh" },
        { wait: 400 },
        { beat: "wake", ms: 1500, sfx: "purr" },
        { bubble: DREAM },
        { card: "dream" },
      ] },
    { id: "cat", x: 830, y: 460, w: 190, h: 90, at: 880, steps: (s) => has(s, "dream")
      ? [{ sfx: "purr" }, { bubble: DREAM }]
      : [{ beat: "eye", ms: 1100, sfx: "purr" }, { hero: "shake" }] },
    { id: "case", x: 600, y: 495, w: 90, h: 55, at: 640, steps: (s) => has(s, "case") ? [{ hero: "sniff" }] : [{ hero: "hop" }, { card: "case" }] },
    { id: "sill", x: 205, y: 340, w: 105, h: 70, at: 255, steps: (s) => flag(s, "shutter_open")
      ? (has(s, "burn") ? [{ hero: "hop" }] : [{ hero: "hop" }, { card: "burn" }])
      : [{ hero: "hop" }, { hero: "shake" }] },
    { id: "gerbera", x: 318, y: 278, w: 58, h: 108, at: 345, secret: true, steps: [{ hero: "sniff" }, { beat: "gerbera", ms: 900, sfx: "boing" }, { egg: "gerbera" }] },
    { id: "duck", x: 396, y: 338, w: 66, h: 50, at: 420, secret: true, steps: [{ hero: "hop" }, { beat: "duck", ms: 500, sfx: "quack" }, { egg: "duck" }] },
    { id: "ring", x: 690, y: 770, w: 160, h: 46, at: 650, steps: (s) => has(s, "ring") ? [{ hero: "sniff" }] : [{ hero: "sniff" }, { card: "ring" }] },
    { id: "ledger", x: 1104, y: 378, w: 116, h: 46, at: 1160, steps: (s) => has(s, "ledger") ? [{ hero: "hop" }] : [{ hero: "hop" }, { card: "ledger" }] },
    { id: "record", x: 1220, y: 334, w: 80, h: 84, at: 1240, secret: true, steps: [{ hero: "hop" }, { beat: "record", ms: 1400, sfx: "disco" }, { egg: "record" }] },
    { id: "veronique", x: 440, y: 400, w: 120, h: 300, at: 600, steps: (s) => flag(s, "wearing") ? [] : [{ face: -1 }, { bubble: { at: [VERO.x, 410], pics: ["glasses", "question"] } }] },
    { id: "door", x: 1456, y: 240, w: 140, h: 430, at: 1500, steps: [{ go: "orchard" }] },
  ];

  CH.epScenes = CH.epScenes || {};
  CH.epScenes.kitchen = {
    ground: 800,
    start: 300,
    ambience: {
      drones: [{ f: 98, type: "sine", gain: 0.22, swell: 0.07 }, { f: 147, type: "triangle", gain: 0.06, swell: 0.11 }],
      wind: { gain: 0.04, f: 420 },
      events: [{ sfx: "tick", every: [1000, 1000] }, { sfx: "crackle", every: [1500, 4200] }, { sfx: "chirp", every: [7000, 15000] }],
    },
    draw,
    spots,
    exits: [{ to: "orchard", x: 1492, y: 690, side: "right", heroAt: 1500 }],
    VERO,
  };
})();

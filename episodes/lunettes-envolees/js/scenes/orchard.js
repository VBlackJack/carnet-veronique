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

// Tableau II: the orchard. A giant mossy apple tree, the hives, Julien's absurd weather
// machine, a magpie's nest up high and a pile of dead leaves where something snores.
(function () {
  const A = CH.art, P = A.P, E = CH.epArt;
  const has = (s, id) => s.cards.includes(id);
  const flag = (s, id) => !!s.flags[id];
  const ded = (s, id) => s.deds.includes(id);
  const from = (content, vars) => `<g class="m-from" style="${vars}">${content}</g>`;

  const SUN = { x: 300, y: 150 };
  const PILE = { x: 470, y: 802, w: 250 };
  const NEST = { x: 990, y: 284 };
  const BARROW = { start: 1395, end: 995 };
  const JULIEN = { x: 1180, y: 806, h: 430 };
  const JULIEN_BUBBLE = { at: [1180, 400], pics: ["basket", "then", "hive", "eyeX"] };

  function sky(s) {
    const out = flag(s, "sun_out");
    let r = `<rect width="1600" height="900" fill="url(#g-sky)"/>`;
    r += `<rect width="1600" height="900" fill="${out ? "#fff1c8" : "#c9d0c8"}" opacity=".45"/>`;
    if (out) {
      let rays = "";
      for (let i = 0; i < 12; i++) {
        const a = (i * 30 * Math.PI) / 180;
        rays += `<path d="M${(SUN.x + Math.cos(a) * 78).toFixed(1)} ${(SUN.y + Math.sin(a) * 78).toFixed(1)}L${(SUN.x + Math.cos(a) * 118).toFixed(1)} ${(SUN.y + Math.sin(a) * 118).toFixed(1)}" stroke="${P.mustard}" stroke-width="6" stroke-linecap="round"/>`;
      }
      r += `<g class="m-spin" style="--ms:40s">${rays}</g>`;
    }
    r += `<circle cx="${SUN.x}" cy="${SUN.y}" r="62" fill="${E.COL.sun}" stroke="${P.ink}" stroke-width="3"/>`;
    return r;
  }

  function cloud(s, beat) {
    A.srand(201);
    const puffs = (x, y, k) => [[-90, 10, 70, 46], [-30, -20, 80, 58], [50, -6, 76, 52], [100, 20, 56, 38], [0, 28, 110, 40]]
      .map(([dx, dy, rx, ry]) => A.sh(A.blob(x + dx * k, y + dy * k, rx * k, ry * k, 0.08, 11), "#f4f2ec", { sw: 2.6 })).join("");
    if (!flag(s, "sun_out")) {
      const c = puffs(SUN.x, SUN.y + 8, 1.1);
      if (beat === "wobble") return from(c, "--dx:-24px;--sc:1.04;--ms:700ms;--ease:cubic-bezier(.3,1.8,.5,1)");
      return `<g class="m-drift" style="--ms:9s">${c}</g>`;
    }
    // Blown away to the right, but below the buttons in the top right corner.
    const gone = puffs(1230, 150, 0.7);
    return beat === "cloud" ? from(gone, "--dx:-930px;--dy:18px;--sc:1.5;--ms:2200ms;--ease:ease-in-out") : `<g class="m-drift" style="--ms:20s">${gone}</g>`;
  }

  function hillsAndCameo(s, beat) {
    let r = A.hills(450, P.meadowFar, 34, 3);
    r += A.ink(A.curve([[1180, 496], [1300, 484], [1420, 488], [1560, 476]], 2), 6, { stroke: "#d8cfae" });
    // Bernard and Francoise hiking on the far path.
    const nose = beat === "cameo" || s.eggs.cameo;
    const pair = A.character("bernard", 1320, 486, 110, false, { expr: "amused", poseR: "up" }) + A.character("francoise", 1366, 484, 104, true, { expr: "smile" });
    let noses = "";
    if (nose) {
      const dot = (x, y) => `<circle cx="${x}" cy="${y}" r="5" fill="#d0302a" stroke="${P.ink}" stroke-width="1.4"/>`;
      noses = dot(1320.6, 486 - 350 * (110 / 430)) + dot(1365.4, 484 - 350 * (104 / 430));
      if (beat === "cameo") noses = from(noses, "--sc:0;--ms:600ms;--delay:300ms;--ease:cubic-bezier(.3,1.8,.5,1)");
    }
    r += (beat === "cameo" ? from(pair, "--dy:-10px;--ms:500ms;--ease:cubic-bezier(.3,1.8,.5,1)") : pair) + noses;
    r += A.hills(580, P.meadow, 26, 5);
    return r;
  }

  function machine(s, beat) {
    let r = A.sh(A.rect(152, 250, 16, 552, 1), P.woodDark, { sw: 2.4 });
    // Weather vane on top: a little goat on an arrow.
    const vane = A.ink(A.line(110, 236, 210, 236, 0.4), 5) + A.sh(A.soft([[210, 236], [196, 226], [196, 246]], 0.4), P.ink, { sw: 1 })
      + `<g transform="translate(150,232) scale(0.22)">${A.goat({ coat: P.ink, horns: true, beard: true, seed: 3 })}</g>`;
    r += beat === "cloud" ? `<g class="m-spin" style="--ms:0.8s">${vane}</g>` : vane;
    // Rain gauge, absurdly big.
    r += A.sh(A.rect(168, 420, 40, 90, 1), "#dfe8ea", { sw: 2.2 }) + `<rect x="172" y="470" width="32" height="36" fill="#7fb6d8" opacity=".8"/>`;
    for (let y = 432; y < 506; y += 12) r += A.ink(A.line(170, y, 182, y, 0.2), 1.4);
    // Horn pointed at the cloud, fed by a pipe from the bellows.
    r += A.ink(A.curve([[200, 720], [196, 600], [190, 420], [196, 300]], 1), 9, { stroke: "#8a5a3a" });
    r += A.sh(A.soft([[192, 304], [230, 250], [262, 238], [256, 284], [206, 316]], 0.8), P.mustard, { sw: 2.6 });
    if (beat === "puff") {
      A.srand(211);
      let p = "";
      [[290, 220, 22], [330, 196, 30], [374, 176, 36]].forEach(([x, y, rad], i) => (p += from(A.sh(A.blob(x, y, rad, rad * 0.8, 0.1, 9), "#ffffff", { sw: 2 }), `--dx:-${60 + i * 30}px;--dy:${30 + i * 16}px;--sc:.2;--op:0;--ms:${500 + i * 150}ms`)));
      r += p;
    }
    // The bellows.
    const bel = A.sh(A.soft([[100, 790], [250, 790], [244, 760], [104, 760]], 0.8), P.wood, { sw: 2.4 })
      + A.sh(A.soft([[104, 760], [244, 760], [232, 716], [116, 716]], 0.8), "#8a4a32", { sw: 2.4 })
      + [0, 1, 2].map((i) => A.ink(A.line(110 + i * 4, 748 - i * 12, 238 - i * 4, 748 - i * 12, 0.4), 1.6, { stroke: "#5a2f22" })).join("")
      + A.sh(A.soft([[116, 716], [232, 716], [226, 704], [122, 704]], 0.6), P.wood, { sw: 2.4 });
    r += beat === "puff" ? from(bel, "--sy:.6;--sx:1;--origin:50% 100%;--ms:700ms;--ease:cubic-bezier(.3,1.6,.5,1)") : bel;
    return r;
  }

  function tree(s, beat) {
    A.srand(221);
    let r = "";
    // Trunk with roots, moss and a shelf fungus to climb on.
    r += A.sh(A.soft([[600, 810], [640, 760], [652, 560], [636, 420], [690, 380], [760, 400], [776, 560], [792, 760], [840, 812]], 2), P.wood, { sw: 3 });
    for (let i = 0; i < 9; i++) r += A.ink(A.curve([[650 + i * 14, 790], [656 + i * 14, 640], [664 + i * 12, 440]], 3), 1.6, { stroke: P.woodDark, op: 0.5 });
    [[660, 700, 30, 18], [740, 620, 26, 34], [668, 520, 22, 26], [756, 760, 40, 16]].forEach(([x, y, rx, ry]) => (r += A.sh(A.blob(x, y, rx, ry, 0.2, 10), E.COL.moss, { sw: 2, op: 0.9 })));
    r += A.sh(A.soft([[770, 566], [868, 556], [860, 576], [774, 586]], 1), P.ochre, { sw: 2.4 }) + A.ink(A.curve([[786, 574], [820, 570], [850, 566]], 0.5), 1.4, { stroke: P.woodDark });
    // The branch with the nest.
    const branch = A.sh(A.soft([[740, 420], [900, 320], [1080, 296], [1082, 312], [906, 344], [760, 446]], 1.5), P.wood, { sw: 2.6 });
    // Canopy.
    let canopy = "";
    [[520, 190, 190, 140], [760, 120, 230, 130], [980, 180, 180, 120], [640, 300, 200, 110], [880, 320, 120, 50], [420, 330, 120, 80]].forEach(([x, y, rx, ry], i) => {
      canopy += A.sh(A.blob(x, y, rx, ry, 0.12, 14), i % 2 ? E.COL.canopy : E.COL.canopyDark, { sw: 3 });
    });
    for (let i = 0; i < 22; i++) {
      const x = 360 + A.rnd() * 760, y = 80 + A.rnd() * 290;
      canopy += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="11" fill="${i % 3 ? E.COL.apple : E.COL.appleLight}" stroke="${P.ink}" stroke-width="2"/>`;
    }
    r += `<g class="m-sway" style="--ms:9s;--origin:50% 100%">${canopy}</g>`;
    let top = branch + E.nest(NEST.x, NEST.y, 1.2);
    if (!flag(s, "loot")) top += E.glint(NEST.x + 10, NEST.y - 12, 1.1);
    if (beat === "shake") top = `<g class="m-from" style="--rot:3deg;--origin:0% 100%;--ms:900ms;--ease:cubic-bezier(.3,2.4,.5,1)">${top}</g>`;
    r += top;
    // The magpie.
    const bird = magpie(1062, 262);
    r += beat === "magpie" || beat === "shake" ? from(bird, "--dy:-30px;--rot:-12deg;--ms:600ms;--ease:cubic-bezier(.3,1.8,.5,1)") : bird;
    return r;
  }

  function magpie(x, y) {
    let r = A.sh(A.soft([[x - 30, y + 6], [x - 70, y + 24], [x - 66, y + 14], [x - 28, y - 4]], 0.6), "#1d2a3a", { sw: 2 });
    r += A.sh(A.blob(x, y, 30, 18, 0.06, 10), "#1f1c22", { sw: 2.4 });
    r += A.sh(A.blob(x + 4, y + 6, 18, 9, 0.08, 8), "#f6f1e6", { sw: 0 });
    r += A.sh(A.blob(x + 28, y - 14, 14, 12, 0.05, 8), "#1f1c22", { sw: 2.2 });
    r += A.sh(A.soft([[x + 40, y - 16], [x + 56, y - 12], [x + 40, y - 9]], 0.3), P.inkSoft, { sw: 1.6 });
    r += `<circle cx="${x + 32}" cy="${y - 17}" r="2.4" fill="#ffffff"/>`;
    r += A.ink(A.line(x - 4, y + 16, x - 8, y + 28, 0.2), 2.4) + A.ink(A.line(x + 8, y + 16, x + 6, y + 28, 0.2), 2.4);
    return r;
  }

  function pile(s, beat) {
    const found = flag(s, "found");
    let r = "";
    if (!found) {
      r += E.leafPile(PILE.x, PILE.y, PILE.w, 5);
      if (flag(s, "sun_out")) r += E.hotspot(PILE.x + 4, PILE.y - 54, 1) + E.smoke(PILE.x, PILE.y - 62, 1.1);
      return r;
    }
    r += E.leafPile(PILE.x - 70, PILE.y, 120, 7) + E.leafPile(PILE.x + 90, PILE.y, 110, 8);
    r += hedgehog(PILE.x, PILE.y, !flag(s, "taken"));
    if (beat === "scatter") {
      A.srand(231);
      for (let i = 0; i < 14; i++) {
        const lx = PILE.x - 160 + A.rnd() * 320, ly = PILE.y - 20 - A.rnd() * 60;
        r += from(`<g transform="translate(${lx.toFixed(1)},${ly.toFixed(1)})"><path d="${A.soft([[-9, 0], [0, -5], [9, 0], [0, 5]], 0.6)}" fill="${E.COL.leaf[i % 5]}" stroke="${P.ink}" stroke-width="1.2"/></g>`, `--dx:${Math.round(PILE.x - lx)}px;--dy:${Math.round(PILE.y - 40 - ly)}px;--rot:${Math.round(A.rnd() * 360)}deg;--ms:${900 + i * 30}ms`);
      }
    }
    return r;
  }

  // The hedgehog, waking up; the glasses stuck in its spines until Biscotte takes them.
  function hedgehog(x, y, withGlasses) {
    A.srand(241);
    let r = "";
    for (let i = 0; i < 26; i++) {
      const a = Math.PI + (i / 25) * Math.PI;
      r += A.ink(A.line(x - 6 + Math.cos(a) * 40, y - 18 + Math.sin(a) * 30, x - 6 + Math.cos(a) * 62, y - 18 + Math.sin(a) * 50, 0.6), 4, { stroke: "#5a4636" });
    }
    r += A.sh(A.blob(x - 6, y - 22, 52, 30, 0.06, 12), "#7a6048", { sw: 2.6 });
    r += A.sh(A.soft([[x + 34, y - 30], [x + 72, y - 12], [x + 40, y - 2]], 0.8), "#d8b894", { sw: 2.4 });
    r += `<circle cx="${x + 72}" cy="${y - 12}" r="5" fill="${P.ink}"/><circle cx="${x + 50}" cy="${y - 22}" r="3.4" fill="${P.ink}"/>`;
    if (withGlasses) r += E.specs(x - 10, y - 66, 1.1, { rot: -14 });
    return r;
  }

  function basketAndJulien(s) {
    let r = E.basket(870, 802, 0.95, { apples: true, seed: 9 });
    r += A.character("julien", JULIEN.x, JULIEN.y, JULIEN.h, true, { mug: "#e8e2d6", expr: "smile" });
    return r;
  }

  function barrow(s, beat) {
    const moved = flag(s, "barrow_moved");
    const cx = moved ? BARROW.end : BARROW.start;
    let r = `<circle cx="${cx - 62}" cy="778" r="26" fill="${P.woodDark}" stroke="${P.ink}" stroke-width="3"/><circle cx="${cx - 62}" cy="778" r="6" fill="${P.ochre}"/>`;
    r += A.sh(A.soft([[cx - 90, 724], [cx + 60, 724], [cx + 40, 770], [cx - 70, 770]], 1), "#6d8a8a", { sw: 2.8 });
    r += A.ink(A.line(cx + 50, 740, cx + 120, 724, 0.5), 7, { stroke: P.wood }) + A.ink(A.line(cx + 30, 770, cx + 34, 800, 0.4), 6, { stroke: P.wood });
    if (flag(s, "loot")) {
      const loot = E.spoon(cx - 30, 722, 1, -10) + E.pearl(cx + 10, 718, 0.9);
      r += beat === "drop" ? from(loot, "--dy:-420px;--rot:-90deg;--ms:800ms;--ease:cubic-bezier(.5,0,.75,1)") : loot;
    }
    return beat === "barrow" ? from(r, `--dx:${BARROW.start - BARROW.end}px;--ms:1100ms;--ease:ease-in-out`) : r;
  }

  function hives() {
    let r = E.hive(1500, 792, 0.95) + E.hive(1574, 794, 0.72);
    for (let i = 0; i < 5; i++) r += `<g class="m-buzz" style="--delay:-${(i * 0.5).toFixed(1)}s;--ms:${(2 + i * 0.3).toFixed(1)}s"><ellipse cx="${1470 + i * 26}" cy="${660 - (i % 2) * 24}" rx="5" ry="3.6" fill="#f2c03a" stroke="${P.ink}" stroke-width="1.4"/></g>`;
    return r;
  }

  function ground() {
    A.srand(251);
    let r = A.sh(A.soft([[-20, 760], [400, 770], [900, 760], [1620, 768], [1620, 910], [-20, 910]], 3), P.meadow, { sw: 2.6 });
    for (let i = 0; i < 40; i++) {
      const x = A.rnd() * 1600, y = 790 + A.rnd() * 100;
      r += A.ink(A.curve([[x, y], [x + 3, y - 12], [x + 8, y - 20]], 0.6), 2, { stroke: P.moss, op: 0.8 });
    }
    return r;
  }

  function draw(s, beat) {
    let back = sky(s) + cloud(s, beat) + hillsAndCameo(s, beat) + ground() + machine(s, beat) + tree(s, beat) + hives() + barrow(s, beat) + basketAndJulien(s) + pile(s, beat);
    back = `<g class="anim"><g filter="url(#f-rough)">${back}</g></g>`;
    A.srand(261);
    let front = "";
    for (let i = 0; i < 9; i++) {
      const x = i * 190 + A.rnd() * 60;
      front += `<g class="m-sway" style="--ms:${3 + A.rnd() * 3}s">${A.sh(A.soft([[x - 30, 905], [x - 8, 830 - A.rnd() * 40], [x + 4, 870], [x + 20, 820 - A.rnd() * 40], [x + 34, 905]], 2), i % 2 ? P.moss : E.COL.mossDark, { sw: 2.4 })}</g>`;
    }
    front += A.leaves(10, 300, 1200, -40);
    front += `<rect width="1600" height="900" fill="url(#g-vignette)"/>`;
    return { back, front: `<g class="anim"><g filter="url(#f-rough)">${front}</g></g>` };
  }

  // ---------------------------------------------------------------- Spots
  const climb = [
    { move: [995, 735], hop: true, ms: 600 },
    { move: [840, 560], hop: true, ms: 700 },
    { move: [965, 318], hop: true, ms: 800 },
    { face: 1 },
    { beat: "shake", ms: 900, sfx: "rustle" },
    { sfx: "caw" },
    { beat: "drop", ms: 900, flag: "loot", sfx: "tinkle" },
    { card: "loot" },
    { move: [840, 560], hop: true, ms: 700 },
    { move: [900, 805], hop: true, ms: 700 },
  ];

  const spots = [
    { id: "julien", x: 1120, y: 380, w: 130, h: 400, at: 1060, steps: (s) => [{ face: 1 }, { bubble: JULIEN_BUBBLE }].concat(has(s, "shrug") ? [] : [{ card: "shrug" }]) },
    { id: "basket", x: 812, y: 728, w: 116, h: 76, at: 950, steps: (s) => has(s, "basket") ? [{ hero: "sniff" }] : [{ face: -1 }, { hero: "sniff" }, { card: "basket" }] },
    { id: "nest", x: 930, y: 236, w: 130, h: 82, at: 1000, steps: (s) => {
      if (flag(s, "loot")) return [{ hero: "hop" }, { hero: "shake" }];
      if (flag(s, "barrow_moved")) return (has(s, "glint") ? [] : [{ card: "glint" }]).concat(climb);
      return has(s, "glint") ? [{ hero: "hop" }, { hero: "shake" }] : [{ hero: "hop" }, { card: "glint" }];
    } },
    { id: "barrow", x: 1300, y: 690, w: 150, h: 112, at: 1500, when: (s) => !flag(s, "barrow_moved"), steps: [
      { face: -1 }, { sfx: "creak" },
      { together: [{ beat: "barrow", ms: 1100, flag: "barrow_moved" }, { move: [1100, 805], ms: 1100 }] },
    ] },
    { id: "bellows", x: 95, y: 690, w: 165, h: 112, at: 270, steps: (s) => [{ move: [175, 704], hop: true, ms: 600 }, { sfx: "puff" }, { hero: "hop" }, { beat: "puff", ms: 800 }]
      .concat(flag(s, "sun_out") ? [] : [{ sfx: "whoosh" }, { beat: "cloud", ms: 2200, flag: "sun_out" }, { sfx: "wonder" }])
      .concat([{ move: [285, 805], hop: true, ms: 600 }]) },
    { id: "cloud", x: 170, y: 70, w: 280, h: 170, when: (s) => !flag(s, "sun_out"), steps: [{ beat: "wobble", ms: 700, sfx: "puff" }] },
    { id: "leaves", x: 345, y: 705, w: 250, h: 98, at: 640, when: (s) => !flag(s, "found"), steps: (s) => {
      if (ded(s, "lens")) return [
        { face: -1 }, { hero: "sniff" }, { sfx: "rustle" },
        { beat: "scatter", ms: 1300, flag: "found" }, { sfx: "snore" }, { wait: 500 },
        { move: [560, 805], ms: 400 }, { hero: "sniff", flag: "taken" }, { wait: 300 },
        { cut: "ending" },
      ];
      if (flag(s, "sun_out")) return has(s, "smoke") ? [{ face: -1 }, { hero: "sniff" }, { hero: "shake" }] : [{ face: -1 }, { hero: "sniff" }, { card: "smoke" }];
      return [{ face: -1 }, { hero: "sniff" }, { sfx: "rustle" }, { wait: 300 }, { sfx: "snore" }];
    } },
    { id: "magpie", x: 1066, y: 230, w: 58, h: 58, steps: [{ beat: "magpie", ms: 600, sfx: "caw" }] },
    { id: "cameo", x: 1286, y: 372, w: 120, h: 116, secret: true, steps: [{ beat: "cameo", ms: 1300, sfx: "boing" }, { egg: "cameo" }] },
    { id: "hives", x: 1452, y: 690, w: 146, h: 108, at: 1400, steps: [{ sfx: "buzz" }, { hero: "shake" }] },
  ];

  CH.epScenes = CH.epScenes || {};
  CH.epScenes.orchard = {
    ground: 805,
    start: 1420,
    ambience: {
      drones: [{ f: 110, type: "sine", gain: 0.1, swell: 0.05 }, { f: 165, type: "sine", gain: 0.04, swell: 0.09 }],
      wind: { gain: 0.09, f: 700, sway: 0.1 },
      events: [{ sfx: "chirp", every: [2500, 6500] }, { sfx: "buzz", every: [5000, 10000] }, { sfx: "rustle", every: [9000, 17000] }],
    },
    draw,
    spots,
    exits: [{ to: "kitchen", x: 1504, y: 520, side: "right", heroAt: 1540, enterAt: 1440 }],
  };
})();

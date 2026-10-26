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

// Tableau II: the vegetable garden at dusk. Pumpkins in the beds, the hen house, the
// compost bin, and Julien's absurd scarecrow: a windmill on its head turns a wooden
// rattle that drowns every other sound. Benjamin carves his lantern on a stump.
(function () {
  const A = CH.art, P = A.P, E = CH.epArt;
  const has = (s, id) => s.cards.includes(id);
  const flag = (s, id) => !!s.flags[id];
  const ded = (s, id) => s.deds.includes(id);
  const from = (content, vars) => `<g class="m-from" style="${vars}">${content}</g>`;

  const BIN = { x: 640, y: 800, w: 210, h: 130 };
  const BARROW = { x: 920, y: 806 };
  const MAST = { x: 1110, top: 300 };
  const ROPE = { x: 1170, y: 690 };
  const BENJ = { x: 1260, y: 806, h: 310 };
  const BENJ_BUBBLE = { at: [1260, 470], pics: ["lantern", "crate", "then", "compost"] };
  const STUMP = { x: 1400, y: 806 };
  const COOP = { x: 170, y: 800 };

  function sky() {
    let r = `<linearGradient id="v-dusk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6d5a7a"/><stop offset=".55" stop-color="#d98a5a"/><stop offset="1" stop-color="#f2c27a"/></linearGradient>`;
    r += `<rect width="1600" height="900" fill="url(#v-dusk)"/>`;
    r += `<circle cx="420" cy="500" r="90" fill="${E.COL.sun}" stroke="${P.ink}" stroke-width="3" opacity=".95"/>`;
    A.srand(501);
    for (let i = 0; i < 3; i++) r += `<g class="m-drift" style="--ms:${24 + i * 6}s">${A.sh(A.blob(300 + i * 480, 140 + i * 50, 120, 22, 0.12, 10), "#e8a8a0", { sw: 0, op: 0.5 })}</g>`;
    r += A.hills(560, "#7a6a6a", 26, 11) + A.hills(620, "#6a6a52", 20, 13);
    return r;
  }

  // Beds of dark soil with pumpkins and their vines.
  function beds() {
    A.srand(511);
    let r = A.sh(A.soft([[-20, 690], [800, 700], [1620, 692], [1620, 910], [-20, 910]], 3), "#7d7a4e", { sw: 2.6 });
    [[300, 1600, 730], [-20, 1600, 860]].forEach(([x0, x1, y]) => (r += A.sh(A.soft([[x0, y - 12], [x1, y - 16], [x1, y + 16], [x0, y + 14]], 2), P.mud, { sw: 2.2 })));
    for (let i = 0; i < 12; i++) {
      const x = 320 + i * 110 + A.jit(20);
      r += A.ink(A.curve([[x - 40, 730], [x - 10, 716], [x + 20, 734], [x + 50, 722]], 2), 3, { stroke: P.moss });
      r += A.sh(A.blob(x - 20, 716, 18, 12, 0.1, 8), P.moss, { sw: 1.6 });
    }
    [[360, 724, 20, 0], [520, 726, 16, 2], [780, 722, 22, 3], [1010, 724, 17, 1], [1480, 722, 24, 0]].forEach(([x, y, rad, i]) => (r += E.squash(x, y, rad, i)));
    return r;
  }

  // The hen house on the left: a little hen at the window lays an egg when touched.
  function coop(s, beat) {
    A.srand(521);
    let r = A.sh(A.rect(COOP.x - 130, COOP.y - 220, 260, 200, 1), "#8a4a32", { sw: 2.6 });
    for (let x = COOP.x - 120; x < COOP.x + 130; x += 30) r += A.ink(A.line(x, COOP.y - 218, x + 2, COOP.y - 22, 0.4), 1.6, { stroke: "#5a2f22", op: 0.6 });
    r += A.sh(A.soft([[COOP.x - 160, COOP.y - 214], [COOP.x, COOP.y - 300], [COOP.x + 160, COOP.y - 214]], 1), P.woodDark, { sw: 2.8 });
    [-110, 110].forEach((dx) => (r += A.sh(A.rect(COOP.x + dx - 8, COOP.y - 24, 16, 26, 0.4), P.woodDark, { sw: 2 })));
    // Window with the hen.
    r += A.sh(A.rect(COOP.x - 60, COOP.y - 180, 90, 64, 0.8), "#2a1d14", { sw: 2.4 });
    const hen = E.hen(COOP.x - 6, COOP.y - 116, 0.9, true);
    r += beat === "hen" ? from(hen, "--dy:-14px;--ms:500ms;--ease:cubic-bezier(.3,1.8,.5,1)") : hen;
    // Ramp, and the egg once laid.
    r += A.sh(A.soft([[COOP.x + 40, COOP.y - 116], [COOP.x + 130, COOP.y], [COOP.x + 110, COOP.y], [COOP.x + 30, COOP.y - 108]], 0.6), P.woodLight, { sw: 2.2 });
    if (s.eggs.hen || beat === "hen") {
      const egg = `<ellipse cx="${COOP.x + 150}" cy="${COOP.y - 10}" rx="12" ry="15" fill="#f6efe0" stroke="${P.ink}" stroke-width="2"/>`;
      r += beat === "hen" ? from(egg, "--dx:-110px;--dy:-100px;--rot:-200deg;--ms:900ms;--delay:400ms;--ease:cubic-bezier(.5,0,.6,1)") : egg;
    }
    return r;
  }

  // Two hens pecking at the seeds and straw spilt by the compost bin.
  function hens(s, beat) {
    let r = E.straw(BIN.x - 180, 812, 110, 8, 95);
    for (let i = 0; i < 10; i++) r += `<ellipse cx="${BIN.x - 230 + i * 12}" cy="${818 + (i % 3) * 4}" rx="3.4" ry="2" fill="#f6efe0" stroke="${P.ink}" stroke-width="1"/>`;
    const a = E.hen(BIN.x - 250, 820, 1, false, { peck: beat !== "cluck" }), b = E.hen(BIN.x - 160, 826, 0.9, true, { peck: true });
    r += beat === "cluck" ? from(a, "--dy:-12px;--ms:500ms;--ease:cubic-bezier(.3,1.8,.5,1)") : `<g class="m-bob" style="--ms:.9s">${a}</g>`;
    r += `<g class="m-bob" style="--ms:1.1s">${b}</g>`;
    return r;
  }

  function bin(s, beat) {
    const found = flag(s, "found");
    let r = E.compostBin(BIN.x, BIN.y, BIN.w, BIN.h);
    if (beat === "dig") {
      A.srand(531);
      for (let i = 0; i < 12; i++) {
        const lx = BIN.x - 160 + A.rnd() * 320, ly = BIN.y - BIN.h - 40 - A.rnd() * 80;
        r += from(A.sh(A.blob(lx, ly, 8, 5, 0.1, 7), i % 3 ? E.COL.pulp : P.straw, { sw: 1.4 }), `--dx:${Math.round(BIN.x - lx)}px;--dy:${Math.round(BIN.y - BIN.h - 10 - ly)}px;--ms:${700 + i * 40}ms`);
      }
    }
    if (found && !flag(s, "taken")) r += E.watch(BIN.x + 20, BIN.y - BIN.h - 26, 1.2, { rot: 70 }) + E.glint(BIN.x + 40, BIN.y - BIN.h - 46, 0.9);
    // In the silence, the compost ticks.
    if (flag(s, "quiet") && !found) r += E.ticks(BIN.x + BIN.w / 2 + 6, BIN.y - BIN.h - 6, 1.1);
    return r;
  }

  function barrow() {
    return E.barrow(BARROW.x, BARROW.y, 0.9, { crate: true });
  }

  // The rattle scarecrow: coat on a cross, a sack head under a straw hat, a windmill on
  // top driving a wooden rattle. A rope with a handle hangs down: the brake.
  function scarecrow(s, beat) {
    const quiet = flag(s, "quiet");
    const x = MAST.x;
    let r = A.sh(A.rect(x - 9, MAST.top, 18, 806 - MAST.top, 0.6), P.woodDark, { sw: 2.4 });
    r += A.sh(A.rect(x - 110, 470, 220, 16, 0.6), P.wood, { sw: 2.4 });
    // Old coat and straw hands.
    r += A.sh(A.soft([[x - 100, 466], [x + 100, 466], [x + 70, 640], [x - 70, 640]], 1.4), "#4a5a7a", { sw: 2.6 });
    for (let i = 0; i < 4; i++) r += `<circle cx="${x - 4}" cy="${500 + i * 34}" r="5" fill="${P.ochre}" stroke="${P.ink}" stroke-width="1.6"/>`;
    [[-1, x - 110], [1, x + 110]].forEach(([k, hx]) => {
      for (let i = 0; i < 5; i++) r += A.ink(A.line(hx, 476, hx + k * (18 + i * 3), 466 + i * 6, 0.4), 2.4, { stroke: P.straw });
    });
    // Sack head and hat (the crow perches on the hat).
    r += A.sh(A.blob(x, 430, 40, 42, 0.06, 10), "#c9b080", { sw: 2.6 });
    r += `<path d="M${x - 18} 424l8 6M${x - 18} 430l8 -6M${x + 10} 424l8 6M${x + 10} 430l8 -6" stroke="${P.ink}" stroke-width="3"/><path d="M${x - 16} 452q16 8 32 0" stroke="${P.ink}" stroke-width="2.6" fill="none" stroke-dasharray="4 3"/>`;
    const hat = A.sh(A.soft([[x - 70, 400], [x + 70, 400], [x + 54, 390], [x - 54, 390]], 0.6), P.hay, { sw: 2.4 }) + A.sh(A.soft([[x - 38, 392], [x + 38, 392], [x + 26, 346], [x - 26, 346]], 0.8), P.hay, { sw: 2.4 });
    const bird = E.crow(x + 6, 326, 0.9);
    if (beat === "crow") r += from(hat + bird, "--dy:-60px;--rot:-24deg;--origin:50% 100%;--ms:900ms;--ease:cubic-bezier(.3,1.6,.5,1)");
    else r += hat + (s.eggs.crow ? "" : bird);
    // Windmill on top of the mast.
    let mill = "";
    for (let i = 0; i < 4; i++) mill += `<g transform="rotate(${i * 90} ${x} ${MAST.top})">${A.sh(A.soft([[x - 6, MAST.top], [x - 16, MAST.top - 86], [x + 16, MAST.top - 86], [x + 6, MAST.top]], 0.6), i % 2 ? P.white : P.red, { sw: 2.2 })}</g>`;
    mill += `<circle cx="${x}" cy="${MAST.top}" r="9" fill="${P.ochre}" stroke="${P.ink}" stroke-width="2.4"/>`;
    r += quiet && beat !== "brake" ? mill : `<g class="m-spin" style="--ms:${beat === "brake" ? "2.6s" : ".7s"}">${mill}</g>`;
    // The rattle by the shoulder, clacking while the windmill turns.
    r += A.sh(A.rect(x + 60, 520, 56, 20, 0.6), P.woodLight, { sw: 2.2 }) + A.sh(A.blob(x + 70, 530, 14, 14, 0.05, 8), P.wood, { sw: 2 });
    if (!quiet) r += `<g class="m-twinkle" style="--ms:.35s">${A.ink(A.line(x + 126, 512, x + 146, 500, 0.2), 3)}${A.ink(A.line(x + 128, 530, x + 152, 530, 0.2), 3)}${A.ink(A.line(x + 126, 548, x + 146, 560, 0.2), 3)}</g>`;
    // Brake rope with its handle.
    const rope = A.ink(A.curve([[x + 8, 310], [x + 60, 480], [ROPE.x, ROPE.y - 24]], 0.6), 4.4, { stroke: P.straw }) + A.sh(A.blob(ROPE.x, ROPE.y, 14, 20, 0.06, 9), P.red, { sw: 2.4 });
    r += beat === "brake" ? from(rope, "--dy:50px;--ms:700ms;--ease:cubic-bezier(.3,1.6,.5,1)") : rope;
    return r;
  }

  function benjamin(s) {
    return A.character("benjamin", BENJ.x, BENJ.y, BENJ.h, true, { expr: "smile", poseL: "front" });
  }

  function stump(s) {
    let r = A.sh(A.soft([[STUMP.x - 50, STUMP.y], [STUMP.x - 44, STUMP.y - 80], [STUMP.x + 44, STUMP.y - 80], [STUMP.x + 52, STUMP.y]], 1), P.wood, { sw: 2.6 });
    r += `<ellipse cx="${STUMP.x}" cy="${STUMP.y - 80}" rx="44" ry="10" fill="${P.woodLight}" stroke="${P.ink}" stroke-width="2.2"/><ellipse cx="${STUMP.x}" cy="${STUMP.y - 80}" rx="20" ry="4" fill="none" stroke="${P.wood}" stroke-width="1.6"/>`;
    r += E.lantern(STUMP.x, STUMP.y - 118, 40, flag(s, "found"));
    r += E.spoon(STUMP.x + 60, STUMP.y - 86, 0.8, 20);
    return r;
  }

  function draw(s, beat) {
    let back = sky() + beds() + coop(s, beat) + bin(s, beat) + hens(s, beat) + barrow() + scarecrow(s, beat) + benjamin(s) + stump(s);
    back = `<g class="anim"><g filter="url(#f-rough)">${back}</g></g>`;
    A.srand(541);
    let front = "";
    // Big pumpkin leaves in the foreground, and a stake with a string of beans.
    for (let i = 0; i < 7; i++) {
      const x = i * 250 + A.rnd() * 80;
      front += `<g class="m-sway" style="--ms:${4 + A.rnd() * 3}s">${A.sh(A.blob(x, 890, 70, 40, 0.18, 12), i % 2 ? P.moss : "#4c6a2c", { sw: 2.4 })}${A.ink(A.curve([[x - 40, 890], [x, 870], [x + 40, 886]], 0.6), 2, { stroke: "#3c5a2e" })}</g>`;
    }
    front += A.leaves(9, 200, 1400, -40);
    front += `<rect width="1600" height="900" fill="url(#g-vignette)"/>`;
    return { back, front: `<g class="anim"><g filter="url(#f-rough)">${front}</g></g>` };
  }

  // ---------------------------------------------------------------- Spots
  const spots = [
    { id: "benjamin", x: 1200, y: 480, w: 120, h: 320, at: 1140, steps: (s) => [{ face: 1 }, { bubble: BENJ_BUBBLE }].concat(has(s, "carve") ? [] : [{ card: "carve" }]) },
    { id: "lantern", x: 1356, y: 640, w: 92, h: 84, at: 1330, steps: [{ face: 1 }, { hero: "sniff" }] },
    { id: "barrow", x: 810, y: 680, w: 180, h: 126, at: 1000, steps: (s) => has(s, "barrow") ? [{ face: -1 }, { hero: "sniff" }] : [{ face: -1 }, { hero: "sniff" }, { card: "barrow" }] },
    { id: "hens", x: BIN.x - 290, y: 760, w: 170, h: 70, at: BIN.x - 80, steps: (s) => has(s, "hens")
      ? [{ face: -1 }, { beat: "cluck", ms: 500, sfx: "cluck" }]
      : [{ face: -1 }, { beat: "cluck", ms: 500, sfx: "cluck" }, { card: "hens" }] },
    { id: "compost", x: BIN.x - BIN.w / 2, y: BIN.y - BIN.h - 40, w: BIN.w, h: BIN.h + 40, at: BIN.x + 160, when: (s) => !flag(s, "taken"), steps: (s) => {
      if (ded(s, "compost")) return [
        { face: -1 }, { hero: "sniff" }, { sfx: "rustle" },
        { beat: "dig", ms: 1300, flag: "found" }, { sfx: "tinkle" }, { wait: 400 },
        { hero: "sniff", flag: "taken" }, { wait: 300 },
        { cut: "ending" },
      ];
      if (flag(s, "quiet")) return has(s, "tick")
        ? [{ face: -1 }, { hero: "sniff" }, { sfx: "tick" }]
        : [{ face: -1 }, { hero: "sniff" }, { sfx: "tick" }, { wait: 500 }, { sfx: "tick" }, { wait: 500 }, { sfx: "tick" }, { card: "tick" }];
      return [{ face: -1 }, { hero: "sniff" }, { sfx: "clatter" }, { hero: "shake" }];
    } },
    { id: "rope", x: ROPE.x - 40, y: ROPE.y - 60, w: 80, h: 100, at: ROPE.x + 40, steps: (s) => flag(s, "quiet")
      ? [{ face: -1 }, { hero: "pull", sfx: "creak" }]
      : [{ face: -1 }, { sfx: "clatter" }, { hero: "pull", sfx: "creak" }, { beat: "brake", ms: 1500, flag: "quiet" }, { wait: 600 }, { sfx: "tick" }, { wait: 500 }, { sfx: "tick" }, { sfx: "wonder" }] },
    { id: "scarecrow", x: MAST.x - 110, y: 380, w: 220, h: 260, at: ROPE.x + 40, steps: (s) => flag(s, "quiet") ? [{ hero: "sniff" }] : [{ sfx: "clatter" }, { hero: "shake" }] },
    { id: "crow", x: MAST.x - 50, y: 290, w: 110, h: 70, secret: true, when: (s) => !s.eggs.crow, steps: [{ beat: "crow", ms: 1000, sfx: "caw" }, { egg: "crow" }] },
    { id: "coop", x: COOP.x - 64, y: COOP.y - 184, w: 98, h: 72, secret: true, steps: [{ beat: "hen", ms: 1400, sfx: "cluck" }, { sfx: "pop" }, { egg: "hen" }] },
  ];

  CH.epScenes = CH.epScenes || {};
  CH.epScenes.potager = {
    ground: 806,
    start: 1500,
    ambience: {
      drones: [{ f: 87, type: "sine", gain: 0.14, swell: 0.05 }, { f: 130, type: "sine", gain: 0.05, swell: 0.08 }],
      wind: { gain: 0.08, f: 600, sway: 0.1 },
      events: [{ sfx: "cluck", every: [7000, 14000] }, { sfx: "chirp", every: [5000, 11000] }, { sfx: "rustle", every: [8000, 15000] }],
    },
    draw,
    spots,
    exits: [{ to: "lavoir", x: 1504, y: 520, side: "right", heroAt: 1540, enterAt: 200 }],
  };
})();

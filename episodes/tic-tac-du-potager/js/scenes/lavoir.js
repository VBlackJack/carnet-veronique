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

// Tableau I: the old wash-house by the stream, on a misty October morning. Veronique
// washes the squashes, her wrist bare; a sheet dries under the roof; the sluice gate
// keeps the stream running over something that shines.
(function () {
  const A = CH.art, P = A.P, E = CH.epArt;
  const has = (s, id) => s.cards.includes(id);
  const flag = (s, id) => !!s.flags[id];
  const from = (content, vars) => `<g class="m-from" style="${vars}">${content}</g>`;

  const VERO = { x: 360, y: 800, h: 400 };
  const VERO_BUBBLE = { at: [VERO.x, 410], pics: ["watch", "question"] };
  const BASIN = { x0: 480, x1: 1100, rim: 650 };
  const DISH = { x: 600, y: 648 };
  const MARK = { x: 600, y: 812, w: 170 };
  const FROG = { x: 980, y: 652 };
  const SLUICE = { x: 1240 };
  const LURE = { x: 1450, y: 812 };
  // Where the kit draws the watch on a figure 430 units tall, hands in pockets.
  const FIGURE_H = 430;
  const WRIST = [-54, -190];

  function sky() {
    A.srand(401);
    let r = `<rect width="1600" height="900" fill="url(#g-sky)"/><rect width="1600" height="900" fill="#f3dcb4" opacity=".35"/>`;
    r += `<circle cx="1350" cy="170" r="54" fill="#fbe9c0" opacity=".85"/>`;
    r += A.hills(470, P.meadowFar, 30, 3);
    // Autumn trees on the far hill.
    for (let i = 0; i < 9; i++) {
      const x = 80 + i * 180 + A.jit(40), y = 470 + A.jit(14);
      r += A.sh(A.rect(x - 4, y - 40, 8, 40, 0.4), P.woodDark, { sw: 1.6 }) + A.sh(A.blob(x, y - 56, 34, 30, 0.12, 10), E.COL.leaf[i % 5], { sw: 2 });
    }
    r += A.hills(560, "#a4a678", 22, 7);
    r += A.mist(400, 200, 0.7);
    return r;
  }

  function ground() {
    A.srand(411);
    let r = A.sh(A.soft([[-20, 770], [500, 778], [1100, 772], [1620, 776], [1620, 910], [-20, 910]], 3), "#9a9a62", { sw: 2.6 });
    for (let i = 0; i < 30; i++) {
      const x = A.rnd() * 1100, y = 800 + A.rnd() * 90;
      r += A.ink(A.curve([[x, y], [x + 3, y - 10], [x + 7, y - 18]], 0.6), 2, { stroke: P.moss, op: 0.7 });
    }
    return r;
  }

  // Barrow ruts from the dry patch to the gate on the left, with Julien's boot prints.
  function tracks() {
    let r = "";
    [0, 22].forEach((dy) => (r += A.ink(A.curve([[MARK.x - 60, 816 + dy], [400, 828 + dy], [200, 842 + dy], [30, 850 + dy]], 1.5), 7, { stroke: P.mud, op: 0.75 })));
    for (let i = 0; i < 6; i++) {
      const x = 470 - i * 80, y = 860 + (i % 2) * 14;
      r += `<ellipse cx="${x}" cy="${y}" rx="11" ry="5" fill="${P.mud}" opacity=".5"/>`;
    }
    return r;
  }

  // The gate to the vegetable garden, at the left edge.
  function gate() {
    let r = A.sh(A.rect(20, 600, 18, 200, 0.6), P.woodDark, { sw: 2.4 }) + A.sh(A.rect(150, 600, 18, 200, 0.6), P.woodDark, { sw: 2.4 });
    for (let i = 0; i < 5; i++) r += A.sh(A.rect(44 + i * 22, 640, 14, 140, 0.5), P.woodLight, { sw: 2 });
    r += A.sh(A.rect(38, 660, 112, 12, 0.5), P.wood, { sw: 2 }) + A.sh(A.rect(38, 740, 112, 12, 0.5), P.wood, { sw: 2 });
    r += E.squash(110, 590, 16, 2);
    return r;
  }

  function shelter() {
    A.srand(421);
    let r = "";
    // Low stone wall at the back.
    r += A.sh(A.rect(BASIN.x0 - 10, 520, BASIN.x1 - BASIN.x0 + 20, 140, 1.4), P.stoneLight, { sw: 2.4 });
    for (let i = 0; i < 14; i++) r += A.sh(A.blob(BASIN.x0 + 20 + A.rnd() * (BASIN.x1 - BASIN.x0 - 40), 540 + A.rnd() * 100, 22 + A.rnd() * 14, 12 + A.rnd() * 6, 0.1, 8), P.stone, { sw: 1.4, op: 0.6 });
    // Posts.
    [470, 790, 1110].forEach((x) => (r += A.sh(A.rect(x - 12, 250, 24, 540, 0.8), P.wood, { sw: 2.6 })));
    // Tiled roof.
    r += A.sh(A.soft([[400, 262], [1180, 262], [1080, 140], [500, 140]], 1.5), P.clay, { sw: 3 });
    for (let y = 164; y < 262; y += 24) {
      const k = (y - 140) / 122;
      r += A.ink(A.line(500 - k * 100, y, 1080 + k * 100, y, 0.6), 2, { stroke: "#7a3a26", op: 0.7 });
    }
    r += A.sh(A.rect(390, 258, 800, 14, 0.6), P.woodDark, { sw: 2.4 });
    return r;
  }

  // The sheet on the line; touched, it billows into a little ghost.
  function sheet(s, beat) {
    let r = A.ink(A.curve([[482, 322], [790, 340], [1098, 322]], 0.6), 2, { stroke: P.inkSoft });
    const ghost = beat === "ghost";
    const cloth = ghost
      ? A.sh(A.soft([[790, 330], [740, 360], [724, 480], [750, 470], [770, 492], [800, 470], [826, 494], [850, 470], [866, 480], [846, 360]], 1.2), P.white, { sw: 2.4 })
        + `<ellipse cx="770" cy="400" rx="7" ry="11" fill="${P.ink}"/><ellipse cx="814" cy="400" rx="7" ry="11" fill="${P.ink}"/><ellipse cx="792" cy="436" rx="10" ry="13" fill="${P.ink}"/>`
      : A.sh(A.soft([[700, 334], [880, 336], [890, 470], [860, 462], [820, 474], [780, 462], [740, 472], [706, 462]], 1.2), P.white, { sw: 2.4 })
        + A.ink(A.curve([[740, 350], [736, 410], [744, 460]], 0.6), 1.4, { op: 0.3 }) + A.ink(A.curve([[840, 350], [846, 410], [838, 460]], 0.6), 1.4, { op: 0.3 });
    r += ghost ? from(cloth, "--sx:1.4;--sy:.6;--origin:50% 0%;--ms:900ms;--ease:cubic-bezier(.3,1.8,.5,1)") : `<g class="m-sway" style="--origin:50% 0%;--ms:4s">${cloth}</g>`;
    [712, 868].forEach((x) => (r += A.sh(A.rect(x - 3, 326, 6, 16, 0.3), P.woodLight, { sw: 1.4 })));
    return r;
  }

  function basin(s, beat) {
    A.srand(431);
    let r = `<rect x="${BASIN.x0 + 16}" y="${BASIN.rim - 10}" width="${BASIN.x1 - BASIN.x0 - 32}" height="22" fill="${E.COL.water}"/>`;
    r += `<path d="M${BASIN.x0 + 40} ${BASIN.rim - 2}q40 -6 80 0t80 0t80 0" stroke="#d8eaee" stroke-width="2" fill="none" opacity=".8"/>`;
    // Lily pad and frog.
    r += `<ellipse cx="${FROG.x}" cy="${FROG.y}" rx="30" ry="8" fill="${P.moss}" stroke="${P.ink}" stroke-width="1.8"/>`;
    if (beat === "frog") r += from(E.frog(FROG.x, FROG.y - 140, 1), "--dy:140px;--ms:900ms;--ease:cubic-bezier(.5,0,.6,1)") + from(`<ellipse cx="${FROG.x - 40}" cy="${FROG.y}" rx="26" ry="6" fill="none" stroke="#d8eaee" stroke-width="3"/>`, "--sc:.2;--op:0;--ms:600ms;--delay:500ms");
    else r += E.frog(FROG.x, FROG.y, 1);
    // Front of the basin: big stone blocks, and the slanted washing slab on the left.
    r += A.sh(A.rect(BASIN.x0, BASIN.rim + 6, BASIN.x1 - BASIN.x0, 136, 1.2), P.stone, { sw: 2.8 });
    for (let x = BASIN.x0 + 100; x < BASIN.x1; x += 120) r += A.ink(A.line(x, BASIN.rim + 10, x + 4, BASIN.rim + 138, 0.6), 2, { stroke: P.inkSoft, op: 0.5 });
    r += A.ink(A.line(BASIN.x0 + 4, BASIN.rim + 70, BASIN.x1 - 4, BASIN.rim + 72, 1), 2, { stroke: P.inkSoft, op: 0.4 });
    r += A.sh(A.soft([[BASIN.x0 - 4, BASIN.rim - 6], [BASIN.x1 + 4, BASIN.rim - 6], [BASIN.x1 + 4, BASIN.rim + 8], [BASIN.x0 - 4, BASIN.rim + 8]], 0.8), P.stoneLight, { sw: 2.4 });
    // Washed squashes waiting on the rim, the brush beside them.
    r += E.squash(720, BASIN.rim - 22, 22, 0) + E.squash(772, BASIN.rim - 18, 18, 2) + E.squash(818, BASIN.rim - 20, 20, 3);
    r += A.sh(A.rect(860, BASIN.rim - 18, 44, 12, 0.5), P.woodLight, { sw: 2 });
    for (let i = 0; i < 8; i++) r += A.ink(A.line(864 + i * 5, BASIN.rim - 6, 864 + i * 5, BASIN.rim, 0.1), 1.6, { stroke: P.mud });
    // The soap dish, tipped over the edge: the watch fell from it into the crate below.
    r += E.soapDish(DISH.x, DISH.y, 1.1, { print: true, tipped: true });
    // Spout to the stream on the right.
    r += A.sh(A.rect(BASIN.x1, BASIN.rim + 30, 60, 16, 0.5), P.stone, { sw: 2.2 });
    return r;
  }

  // Where the crate stood: a dry patch in the wet ground, wisps of straw.
  function mark() {
    let r = `<rect x="${MARK.x - MARK.w / 2}" y="${MARK.y - 16}" width="${MARK.w}" height="30" rx="4" fill="#c7c08e" stroke="${P.inkSoft}" stroke-width="1.4" stroke-dasharray="4 4"/>`;
    r += E.straw(MARK.x, MARK.y, MARK.w, 9, 93);
    return r;
  }

  function stream(s, beat) {
    const dry = flag(s, "drained");
    let r = A.sh(A.soft([[1130, 760], [1300, 770], [1620, 762], [1620, 860], [1300, 858], [1130, 840]], 2), P.mud, { sw: 2.4 });
    A.srand(441);
    for (let i = 0; i < 14; i++) r += A.sh(A.blob(1160 + A.rnd() * 440, 790 + A.rnd() * 56, 10 + A.rnd() * 8, 6 + A.rnd() * 4, 0.1, 8), i % 2 ? P.stone : P.stoneLight, { sw: 1.4 });
    if (dry && !flag(s, "lure")) r += E.lure(LURE.x, LURE.y, 1);
    const water = A.sh(A.soft([[1130, 768], [1300, 776], [1620, 768], [1620, 852], [1300, 850], [1130, 834]], 2), E.COL.water, { sw: 0, op: 0.85 })
      + [0, 1, 2].map((i) => `<path d="M${1180 + i * 140} ${800 + i * 12}q30 -8 60 0" stroke="#d8eaee" stroke-width="3" fill="none" opacity=".8"/>`).join("");
    if (!dry) r += water + E.glint(LURE.x, LURE.y - 6, 1);
    // The stream empties once the gate is down.
    else if (beat === "sluice") r += `<g opacity="0">${water}<animate attributeName="opacity" values="1;1;0" keyTimes="0;.3;1" dur="1.6s" fill="freeze"/></g>`;
    // Water falling from the spout while the gate is up.
    if (!dry) r += `<path d="M1160 ${BASIN.rim + 42}q14 40 10 96" stroke="${E.COL.water}" stroke-width="10" fill="none" opacity=".8"/>`;
    return r;
  }

  // The sluice gate: two posts, a plank and a crank wheel on top.
  function sluice(s, beat) {
    const down = flag(s, "drained");
    let r = A.sh(A.rect(SLUICE.x - 50, 560, 16, 280, 0.6), P.woodDark, { sw: 2.4 }) + A.sh(A.rect(SLUICE.x + 34, 560, 16, 280, 0.6), P.woodDark, { sw: 2.4 });
    r += A.sh(A.rect(SLUICE.x - 56, 552, 112, 16, 0.5), P.wood, { sw: 2.4 });
    const plank = A.sh(A.rect(SLUICE.x - 36, down ? 760 : 640, 72, 90, 0.6), P.woodLight, { sw: 2.4 }) + A.ink(A.line(SLUICE.x, 568, SLUICE.x, down ? 760 : 640, 0.2), 4, { stroke: P.inkSoft });
    r += beat === "sluice" ? from(plank, "--dy:-120px;--ms:1100ms;--ease:cubic-bezier(.5,0,.6,1.3)") : plank;
    let wheel = `<circle cx="${SLUICE.x}" cy="530" r="30" fill="none" stroke="${P.ink}" stroke-width="7"/><circle cx="${SLUICE.x}" cy="530" r="30" fill="none" stroke="${P.rust}" stroke-width="4"/>`;
    for (let i = 0; i < 3; i++) wheel += `<path d="M${SLUICE.x} 530l${(Math.cos(i * 2.09) * 28).toFixed(1)} ${(Math.sin(i * 2.09) * 28).toFixed(1)}" stroke="${P.rust}" stroke-width="4"/>`;
    wheel += `<circle cx="${SLUICE.x}" cy="530" r="6" fill="${P.ochre}" stroke="${P.ink}" stroke-width="2"/>`;
    r += A.ink(A.line(SLUICE.x, 552, SLUICE.x, 536, 0.1), 5);
    r += beat === "sluice" ? `<g class="m-spin" style="--ms:.6s">${wheel}</g>` : wheel;
    return r;
  }

  function veronique(s, beat) {
    const wearing = flag(s, "wearing");
    const over = wearing ? { expr: beat === "puton" ? "open" : "smile" } : { watch: null, expr: "neutral" };
    const body = A.character("veronique", VERO.x, VERO.y, VERO.h, false, over);
    if (beat === "puton") return from(body, "--dy:-10px;--origin:50% 100%;--ms:800ms;--ease:cubic-bezier(.3,1.8,.5,1)");
    // The watch is small at this scale: once it is back, it catches the light.
    const k = VERO.h / FIGURE_H;
    const shine = E.glint(VERO.x + WRIST[0] * k, VERO.y + WRIST[1] * k, 0.8);
    return wearing ? body + shine : `<g class="m-sway" style="--ms:3.8s">${body}</g>`;
  }

  function draw(s, beat) {
    let back = sky() + ground() + tracks() + gate() + shelter() + sheet(s, beat) + basin(s, beat) + mark() + stream(s, beat) + sluice(s, beat) + veronique(s, beat);
    back = `<g class="anim"><g filter="url(#f-rough)">${back}</g></g>`;
    A.srand(451);
    let front = "";
    // Reeds by the stream and an overhanging branch with the last leaves.
    for (let i = 0; i < 8; i++) {
      const x = 1490 + i * 16;
      front += `<g class="m-sway" style="--ms:${3 + (i % 3)}s">${A.ink(A.curve([[x, 905], [x - 4, 820], [x + 6, 740 - (i % 3) * 30]], 1), 4, { stroke: i % 2 ? P.olive : P.moss })}${i % 3 ? "" : A.sh(A.blob(x + 6, 730 - (i % 3) * 30, 6, 20, 0.05, 8), P.mud, { sw: 1.6 })}</g>`;
    }
    const branch = A.ink(A.curve([[-20, 60], [140, 90], [300, 80], [380, 110]], 2), 10, { stroke: P.woodDark })
      + [60, 140, 220, 300, 360].map((x, i) => A.sh(A.soft([[x, 90], [x + 10, 112], [x, 130], [x - 10, 112]], 0.8), E.COL.leaf[i % 5], { sw: 1.6 })).join("");
    front += `<g class="m-sway" style="--origin:0% 50%;--ms:7s">${branch}</g>`;
    front += A.leaves(8, 200, 1300, -40);
    front += `<rect width="1600" height="900" fill="url(#g-vignette)"/>`;
    return { back, front: `<g class="anim"><g filter="url(#f-rough)">${front}</g></g>` };
  }

  // ---------------------------------------------------------------- Spots
  const spots = [
    { id: "veronique", x: 290, y: 400, w: 140, h: 400, at: 480, steps: (s) => flag(s, "wearing") ? [] : [{ face: -1 }, { bubble: VERO_BUBBLE }].concat(has(s, "wrist") ? [] : [{ card: "wrist" }]) },
    { id: "soap", x: 560, y: 612, w: 84, h: 52, at: 620, steps: (s) => has(s, "soap") ? [{ hero: "sniff" }] : [{ hero: "hop" }, { card: "soap" }] },
    { id: "mark", x: MARK.x - 100, y: MARK.y - 30, w: 200, h: 54, at: MARK.x + 110, steps: (s) => has(s, "crate") ? [{ face: -1 }, { hero: "sniff" }] : [{ face: -1 }, { hero: "sniff" }, { card: "crate" }] },
    { id: "tracks", x: 60, y: 822, w: 360, h: 62, at: 260, steps: (s) => has(s, "tracks") ? [{ hero: "sniff" }] : [{ face: -1 }, { hero: "sniff" }, { card: "tracks" }] },
    { id: "sluice", x: 1180, y: 490, w: 120, h: 280, at: 1170, steps: (s) => flag(s, "drained")
      ? [{ face: 1 }, { hero: "pull", sfx: "creak" }]
      : [{ face: 1 }, { hero: "pull", sfx: "creak" }, { beat: "sluice", ms: 1900, flag: "drained", sfx: "whoosh" }, { sfx: "splash" }] },
    { id: "stream", x: 1370, y: 760, w: 170, h: 90, at: 1360, steps: (s) => {
      if (!flag(s, "drained")) return has(s, "glint") ? [{ face: 1 }, { hero: "hop" }, { sfx: "splash" }, { hero: "shake" }] : [{ face: 1 }, { hero: "hop" }, { sfx: "splash" }, { card: "glint" }];
      if (flag(s, "lure")) return [{ hero: "sniff" }];
      return (has(s, "glint") ? [] : [{ card: "glint" }]).concat([
        { move: [LURE.x - 30, 820], hop: true, ms: 600 }, { hero: "sniff", flag: "lure" }, { card: "lure" }, { move: [1360, 800], hop: true, ms: 600 },
      ]);
    } },
    { id: "frog", x: FROG.x - 34, y: FROG.y - 40, w: 68, h: 48, secret: true, steps: [{ beat: "frog", ms: 1100, sfx: "ribbit" }, { sfx: "splash" }, { egg: "frog" }] },
    { id: "sheet", x: 700, y: 336, w: 190, h: 136, secret: true, steps: [{ sfx: "flap" }, { beat: "ghost", ms: 1400, sfx: "wonder" }, { egg: "ghost" }] },
  ];

  CH.epScenes = CH.epScenes || {};
  CH.epScenes.lavoir = {
    ground: 800,
    start: 500,
    ambience: {
      drones: [{ f: 98, type: "sine", gain: 0.16, swell: 0.06 }, { f: 131, type: "triangle", gain: 0.05, swell: 0.1 }],
      wind: { gain: 0.06, f: 520, sway: 0.12 },
      events: [{ sfx: "trickle", every: [1800, 3200] }, { sfx: "chirp", every: [6000, 13000] }, { sfx: "rustle", every: [9000, 16000] }],
    },
    draw,
    spots,
    exits: [{ to: "potager", x: 30, y: 520, side: "left", heroAt: 90, enterAt: 1500 }],
    VERO,
  };
})();

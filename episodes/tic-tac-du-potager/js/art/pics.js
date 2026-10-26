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

// Wordless pictures: the rebus drawings of the bubbles (100x100) and the sketchbook
// cards (160x110). Each card tells its clue without a single word.
(function () {
  const A = CH.art, P = A.P, E = CH.epArt;

  const paper = (col = "#fbf6ea") => `<rect width="160" height="110" fill="${col}"/>`;
  const stone = () => `<rect width="160" height="110" fill="${P.stoneLight}"/>` + [[30, 30], [100, 20], [60, 80], [130, 76]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="26" ry="14" fill="${P.stone}" opacity=".45"/>`).join("");
  const grass = () => `<rect width="160" height="110" fill="#d8d4ae"/><rect y="70" width="160" height="40" fill="#9a9a62"/>`;
  const soil = () => `<rect width="160" height="110" fill="#e8c08a"/><rect y="74" width="160" height="36" fill="#7d7a4e"/>`;
  const question = (x, y, s = 1) => `<path d="M${x - 14 * s} ${y - 16 * s}q0 -18 16 -18q16 0 16 15q0 10 -12 15q-6 3 -6 12" fill="none" stroke="${P.ink}" stroke-width="${8 * s}" stroke-linecap="round"/><circle cx="${x}" cy="${y + 26 * s}" r="${5 * s}" fill="${P.ink}"/>`;

  // ---------------------------------------------------------------- Bubbles
  const PICS = {
    watch: () => E.watch(50, 50, 1.5),
    question: () => question(48, 46),
    lantern: () => E.lantern(50, 56, 30, false),
    crate: () => E.crate(50, 82, 76, 40, { straw: true }),
    compost: () => E.compostBin(50, 90, 74, 46),
    heart: () => E.heart(50, 52, 1.3),
    goat: () => `<g transform="translate(46,92) scale(0.48)">${A.namedGoat("biscotte", 0, 0, 1, false)}</g>`,
  };

  // ---------------------------------------------------------------- Cards
  const CARDS = {
    // Veronique's bare wrist: a pale band where the watch always is.
    wrist: { pic: () => paper("#f3eadb") + E.wrist(66, 74, 1, { band: true }) + `<g opacity=".8">${E.watch(128, 30, 0.7, { rot: 90 })}</g>` + E.cross(128, 30, 0.7) },
    // The soap on the dish keeps the print of a watch: face and strap.
    soap: { pic: () => stone() + E.soapDish(80, 84, 2.2, { print: true }) },
    // Under the tipped dish, a dry patch in the wet ground where a crate stood, and straw.
    crate: { pic: () => {
      let s = grass();
      s += `<rect y="0" width="160" height="22" fill="${P.stone}"/><rect y="20" width="160" height="6" fill="${P.stoneLight}"/>`;
      s += E.soapDish(46, 16, 0.8, { tipped: true });
      s += `<rect x="30" y="72" width="100" height="24" rx="3" fill="#c7c08e" stroke="${P.inkSoft}" stroke-width="1.4" stroke-dasharray="4 4"/>`;
      s += E.straw(80, 84, 100, 8, 97);
      s += E.speed(50, 34, 4, 22, 2, 0.8);
      return s;
    } },
    // Barrow ruts and boot prints run off to the garden gate.
    tracks: { pic: () => {
      let s = grass();
      s += A.ink(A.curve([[150, 100], [100, 90], [60, 84], [36, 78]], 1), 5, { stroke: P.mud, op: 0.6 }) + A.ink(A.curve([[150, 88], [104, 80], [64, 74], [36, 70]], 1), 5, { stroke: P.mud, op: 0.6 });
      for (let i = 0; i < 4; i++) s += `<ellipse cx="${140 - i * 28}" cy="${102 - i * 5}" rx="7" ry="3.4" fill="${P.mud}" opacity=".55"/>`;
      for (let i = 0; i < 4; i++) s += A.sh(A.rect(6 + i * 9, 40, 6, 44, 0.3), P.woodLight, { sw: 1.4 });
      s += A.sh(A.rect(4, 50, 38, 6, 0.3), P.wood, { sw: 1.4 }) + E.squash(24, 30, 8, 2);
      return s;
    } },
    // Something shines at the bottom of the stream.
    glint: { pic: () => `<rect width="160" height="110" fill="${E.COL.waterDeep}"/><path d="M10 30q20 -8 40 0t40 0t40 0M20 70q20 -8 40 0t40 0" stroke="#d8eaee" stroke-width="3" fill="none" opacity=".7"/>` + E.glint(86, 62, 1.5) },
    // The stream drained: only a fishing lure. Not the watch.
    lure: { pic: () => {
      let s = `<rect width="160" height="110" fill="${P.mud}"/>`;
      A.srand(98);
      for (let i = 0; i < 9; i++) s += A.sh(A.blob(A.rnd() * 160, A.rnd() * 110, 12, 7, 0.1, 8), i % 2 ? P.stone : P.stoneLight, { sw: 1.2 });
      return s + E.lure(80, 56, 1.6);
    } },
    // The crate arrived in the garden, empty: no watch in the barrow.
    barrow: { pic: () => soil() + E.barrow(84, 104, 0.6, { crate: true }) + `<g opacity=".8">${E.watch(138, 24, 0.55)}</g>` + E.cross(138, 24, 0.55) },
    // Benjamin carved his lantern over the crate, then tipped it into the compost.
    carve: { pic: () => {
      let s = paper("#f6efdc");
      s += E.crate(36, 92, 56, 30, { straw: true }) + E.lantern(36, 44, 18, false) + E.spoon(60, 30, 0.5, -30);
      s += E.trail(70, 60, 108, 70, 0.9);
      s += E.compostBin(128, 98, 50, 34);
      return s;
    } },
    // The hens peck at pumpkin seeds and straw spilt by the compost bin.
    hens: { pic: () => {
      let s = soil();
      s += E.compostBin(124, 96, 60, 40);
      for (let i = 0; i < 8; i++) s += `<ellipse cx="${30 + i * 9}" cy="${92 + (i % 2) * 4}" rx="3" ry="1.8" fill="#f6efe0" stroke="${P.ink}" stroke-width=".8"/>`;
      s += E.straw(60, 98, 60, 6, 99) + E.hen(54, 96, 0.75, false, { peck: true });
      return s;
    } },
    // In the silence, the compost ticks.
    tick: { pic: () => {
      let s = soil();
      s += `<path d="M14 18l18 18M32 18l-18 18" stroke="#b0302a" stroke-width="3" stroke-linecap="round"/>`;
      for (let i = 0; i < 4; i++) s += `<g transform="rotate(${i * 90} 23 27)"><path d="M23 27l-3 -14h6z" fill="${P.white}" stroke="${P.ink}" stroke-width="1.2"/></g>`;
      s += E.compostBin(72, 100, 80, 50);
      s += E.ticks(118, 52, 1);
      s += E.watch(140, 24, 0.45, { rot: 20 });
      return s;
    } },
  };

  // ---------------------------------------------------------------- Deductions
  const DED_ART = {
    // Veronique took off her watch to wash the squashes and set it on the soap.
    wash: () => {
      let s = paper("#fff6df");
      s += `<rect x="0" y="66" width="160" height="44" fill="${P.stone}"/><rect x="0" y="62" width="160" height="8" fill="${P.stoneLight}"/><rect x="70" y="58" width="90" height="6" fill="${E.COL.water}"/>`;
      s += E.wrist(40, 30, 0.6, { band: true }) + E.trail(56, 30, 80, 50, 0.8);
      s += E.soapDish(96, 62, 0.9) + E.watch(96, 44, 0.45, { rot: 90 });
      s += E.squash(136, 52, 12, 0);
      return s;
    },
    // The dish tipped, the watch fell into the crate, the crate left on the barrow.
    trip: () => {
      let s = paper("#fff6df");
      s += E.soapDish(24, 26, 0.6, { tipped: true }) + E.watch(30, 48, 0.32, { rot: 60 }) + E.speed(22, 40, 2, 12, 2, 0.6);
      s += E.crate(34, 92, 50, 26, { straw: true, squashes: 2 });
      s += E.trail(64, 70, 96, 70, 0.8);
      s += E.barrow(124, 100, 0.34, { crate: true });
      return s;
    },
    // The straw and the watch went into the compost: it ticks under the peelings.
    compost: () => {
      let s = paper("#fff6df");
      s += E.lantern(28, 48, 16, false) + E.trail(44, 58, 64, 66, 0.7);
      s += `<g opacity=".9">${E.compostBin(104, 100, 90, 52)}</g>`;
      s += E.watch(104, 40, 0.5, { rot: 70 }) + E.ticks(138, 38, 0.7);
      return s;
    },
  };

  CH.epPics = { PICS, CARDS, DED_ART };
})();

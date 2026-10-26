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
  const wood = () => `<rect width="160" height="110" fill="${P.woodLight}"/><path d="M0 34h160M0 76h160" stroke="${P.woodDark}" stroke-width="1.6" opacity=".45"/><path d="M20 18q30 -4 60 2M90 58q30 -3 58 2" stroke="${P.woodDark}" stroke-width="1.2" fill="none" opacity=".35"/>`;
  const tiles = () => `<rect width="160" height="110" fill="#e9e4d8"/>` + [0, 40, 80, 120].map((x) => `<path d="M${x} 0V110" stroke="#b9b1a0" stroke-width="2"/>`).join("") + [0, 40, 80].map((y) => `<path d="M0 ${y}H160" stroke="#b9b1a0" stroke-width="2"/>`).join("");
  const grass = () => `<rect width="160" height="110" fill="#cfe0b8"/><rect y="70" width="160" height="40" fill="${P.meadow}"/>`;
  const question = (x, y, s = 1) => `<path d="M${x - 14 * s} ${y - 16 * s}q0 -18 16 -18q16 0 16 15q0 10 -12 15q-6 3 -6 12" fill="none" stroke="${P.ink}" stroke-width="${8 * s}" stroke-linecap="round"/><circle cx="${x}" cy="${y + 26 * s}" r="${5 * s}" fill="${P.ink}"/>`;

  // ---------------------------------------------------------------- Bubbles
  const PICS = {
    glasses: () => E.specs(50, 52, 1.4),
    question: () => question(48, 46),
    paw: () => E.paw(50, 56, 1.4),
    fall: () => E.tableEdge(4, 30, 46) + E.specs(66, 70, 0.9, { rot: 50 }) + E.speed(50, 40, 10, 18, 3),
    basket: () => E.basket(50, 86, 0.9),
    hive: () => E.hive(50, 86, 0.85),
    eyeX: () => E.eyeCrossed(50, 50, 1.2),
    heart: () => E.heart(50, 52, 1.3),
    goat: () => `<g transform="translate(46,92) scale(0.48)">${A.namedGoat("biscotte", 0, 0, 1, false)}</g>`,
  };

  // ---------------------------------------------------------------- Cards
  const fur = (x, y) => [0, 1, 2, 3].map((i) => `<path d="${A.curve([[x + i * 7, y], [x + i * 7 + 6, y - 6], [x + i * 7 + 3, y - 14]], 0.6)}" stroke="${i % 2 ? E.COL.furWhite : E.COL.fur}" stroke-width="2.4" fill="none" stroke-linecap="round"/>`).join("");

  const CARDS = {
    // The case is open and empty, a few ginger and white hairs in it.
    case: { pic: () => {
      A.srand(51);
      let s = wood();
      // Lid thrown open behind, lining showing; the empty tray in front.
      s += A.sh(A.soft([[34, 70], [126, 70], [138, 26], [22, 26]], 1), "#2f5450", { sw: 2.4 });
      s += A.sh(A.soft([[42, 66], [118, 66], [126, 32], [34, 32]], 0.8), "#8fb3a8", { sw: 1.4 });
      s += A.sh(A.soft([[30, 70], [130, 70], [124, 98], [36, 98]], 1), E.COL.frame, { sw: 2.4 });
      s += A.sh(A.soft([[38, 72], [122, 72], [118, 88], [42, 88]], 0.6), "#8fb3a8", { sw: 1.4 });
      return s + fur(64, 86);
    } },
    // Tobias dreams that his paw pushes something round off the table, into a basket.
    dream: { pic: () => {
      let s = paper("#f3eefa");
      s += E.catHead(34, 78, 0.9);
      s += `<circle cx="64" cy="54" r="4" fill="#fbf6ea" stroke="${P.ink}" stroke-width="1.6"/><circle cx="74" cy="42" r="6" fill="#fbf6ea" stroke="${P.ink}" stroke-width="1.6"/>`;
      s += A.sh(A.blob(116, 44, 40, 34, 0.08, 12), "#fbf6ea", { sw: 2 });
      s += E.paw(96, 36, 0.5) + E.specs(118, 30, 0.45, { rot: 30 }) + E.speed(110, 22, 6, 10, 2, 0.6) + E.basket(124, 72, 0.4);
      return s;
    } },
    // Sun through the old glasses: a burning point on the windowsill, an old burn mark.
    burn: { pic: () => {
      let s = wood();
      s += `<polygon points="0,0 70,0 92,74 80,76" fill="url(#g-beam)" opacity=".9"/>`;
      s += E.spare(66, 40, 0.9);
      s += `<ellipse cx="96" cy="80" rx="8" ry="4" fill="${E.COL.burn}" opacity=".75"/>`;
      s += E.hotspot(88, 76, 1.1);
      return s;
    } },
    // Under the table, a clean ring in the dust: a round basket stood there.
    ring: { pic: () => {
      let s = tiles();
      s += `<rect width="160" height="110" fill="${E.COL.dust}" opacity=".55"/>`;
      s += `<ellipse cx="80" cy="60" rx="46" ry="22" fill="#e9e4d8" stroke="${P.inkSoft}" stroke-width="1.4" stroke-dasharray="3 4"/>`;
      s += `<ellipse cx="80" cy="60" rx="34" ry="14" fill="${E.COL.dust}" opacity=".55"/>`;
      return s;
    } },
    // Julien's ledger, in pictures: at seven o'clock, the basket went to the apple tree.
    ledger: { pic: () => {
      let s = paper("#f6efdc");
      s += `<path d="M80 6v98" stroke="${P.inkSoft}" stroke-width="1.4" opacity=".5"/>`;
      for (let y = 18; y < 104; y += 12) s += `<path d="M8 ${y}h66M86 ${y}h66" stroke="#7fa0c0" stroke-width=".8" opacity=".5"/>`;
      s += E.clock(28, 54, 18, 7);
      s += `<path d="M50 54h10M56 48l6 6-6 6" stroke="${P.ink}" stroke-width="2.4" fill="none"/>`;
      s += E.basket(80, 74, 0.38);
      s += `<path d="M98 54h10M104 48l6 6-6 6" stroke="${P.ink}" stroke-width="2.4" fill="none"/>`;
      s += E.treeIcon(132, 82, 0.8);
      return s;
    } },
    // Julien set the basket down near the hives, and saw nothing.
    shrug: { pic: () => grass() + E.hive(118, 92, 0.6) + E.basket(64, 94, 0.5) + E.eyeCrossed(60, 28, 0.5) },
    // The basket is full of apples, and the glasses are not in it.
    basket: { pic: () => grass() + E.basket(70, 98, 0.75, { apples: true }) + `<g opacity=".8">${E.specs(128, 30, 0.6)}</g><path d="M106 12l44 36M150 12l-44 36" stroke="#b0302a" stroke-width="4" stroke-linecap="round"/>` },
    // Something shines in the magpie's nest.
    glint: { pic: () => {
      let s = `<rect width="160" height="110" fill="#d8dccf"/>`;
      s += A.sh(A.soft([[0, 70], [160, 58], [160, 70], [0, 82]], 1), P.wood, { sw: 2.4 });
      s += E.nest(84, 58, 1.1) + E.glint(92, 44, 1.2);
      return s;
    } },
    // What fell from the nest: a teaspoon and a pearl. Not the glasses.
    loot: { pic: () => grass() + E.spoon(70, 84, 1.3) + E.pearl(112, 86, 1.2) },
    // In the sun, a thin smoke rises from the leaf pile.
    smoke: { pic: () => grass() + E.leafPile(80, 104, 120, 9) + E.hotspot(82, 70, 0.9) + E.smoke(80, 64, 0.9, 3, E.COL.smokeCard) },
  };

  // ---------------------------------------------------------------- Deductions
  const DED_ART = {
    // Tobias pushed the glasses off the table in his sleep.
    cat: () => paper("#fff6df") + E.tableEdge(0, 40, 90) + E.paw(74, 30, 0.6) + E.specs(112, 70, 0.8, { rot: 60 }) + E.speed(96, 50, 10, 16, 3) + E.basket(118, 106, 0.42),
    // They fell into the basket, which went to the orchard.
    trip: () => {
      let s = paper("#fff6df");
      s += A.sh(A.soft([[10, 90], [10, 52], [32, 34], [54, 52], [54, 90]], 1), P.plaster, { sw: 2.2 });
      s += `<path d="M58 84q40 -40 72 -10" stroke="${P.ink}" stroke-width="2.4" fill="none" stroke-dasharray="5 5"/><path d="M124 64l8 10-12 2" stroke="${P.ink}" stroke-width="2.4" fill="none"/>`;
      s += E.basket(86, 72, 0.4) + E.specs(86, 52, 0.4) + E.treeIcon(140, 104, 0.8);
      return s;
    },
    // Convex lenses gather the sun into a burning point: the glasses lie under the leaves.
    lens: () => {
      let s = paper("#fff6df");
      [16, 30, 44].forEach((y) => (s += `<path d="M6 ${y}H62L104 76" stroke="#e8b84a" stroke-width="2.4" fill="none"/>`));
      s += `<path d="M62 10q14 20 0 44q-14 -24 0 -44z" fill="${E.COL.lens}" fill-opacity=".8" stroke="${E.COL.frame}" stroke-width="3"/>`;
      s += E.leafPile(108, 106, 90, 13) + E.hotspot(104, 78, 0.8) + E.smoke(108, 70, 0.6, 2, E.COL.smokeCard);
      return s;
    },
  };

  CH.epPics = { PICS, CARDS, DED_ART };
})();

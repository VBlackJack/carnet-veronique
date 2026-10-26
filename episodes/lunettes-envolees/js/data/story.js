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

// The wordless pilot: Veronique's glasses are gone, Biscotte finds them.
// What really happened: Tobias pushed them off the table in his sleep, into the empty
// basket that Julien then carried to the orchard; they slid into the leaf pile where a
// hedgehog sleeps. In the sun, their convex lenses make a burning point: a thin smoke.
(function () {
  const A = CH.art, P = A.P, E = CH.epArt, X = CH.epPics;
  const has = (s, id) => s.cards.includes(id);
  const flag = (s, id) => !!s.flags[id];
  const ded = (s, id) => s.deds.includes(id);
  const VERO_HEAD = [500, 410];

  const DEDS = [
    { id: "cat", pairs: [["case", "dream"]], pic: X.DED_ART.cat },
    { id: "trip", pairs: [["ring", "ledger"]], pic: X.DED_ART.trip },
    { id: "lens", pairs: [["burn", "smoke"]], requires: ["cat", "trip"], pic: X.DED_ART.lens },
  ];

  // The bee follows this path: the first goal not yet reached is the one it shows.
  const GOALS = [
    { target: "kitchen.cord", done: (s) => has(s, "dream") },
    { target: "kitchen.case", done: (s) => has(s, "case") },
    { target: "book", done: (s) => ded(s, "cat") },
    { target: "kitchen.ring", done: (s) => has(s, "ring") },
    { target: "kitchen.ledger", done: (s) => has(s, "ledger") },
    { target: "book", done: (s) => ded(s, "trip") },
    { target: "kitchen.sill", done: (s) => has(s, "burn") },
    { target: "orchard.bellows", done: (s) => flag(s, "sun_out") },
    { target: "orchard.leaves", done: (s) => has(s, "smoke") },
    { target: "book", done: (s) => ded(s, "lens") },
    { target: "orchard.leaves", done: (s) => flag(s, "found") },
  ];

  const CUTS = {
    opening: [
      { wait: 700 },
      { bubble: { at: VERO_HEAD, pics: ["glasses", "question"] } },
      { sfx: "bleat" },
      { blur: false },
    ],
    ending: [
      { go: "kitchen", at: 700 },
      { face: -1 },
      { sfx: "bleat" },
      { hero: "hop" },
      { blur: true },
      { beat: "puton", ms: 900, flag: "wearing", sfx: "pop" },
      { blur: false },
      { sfx: "chord" },
      { bubble: { at: VERO_HEAD, pics: ["heart", "goat"] } },
      { wait: 500 },
      { end: true },
    ],
  };

  function titleArt() {
    A.srand(301);
    let s = `<rect width="1600" height="900" fill="url(#g-sky)"/><rect width="1600" height="900" fill="#fff1c8" opacity=".4"/>`;
    s += A.hills(520, P.meadowFar, 40, 3) + A.hills(640, P.meadow, 30, 5);
    s += `<g transform="translate(260,700) scale(5)">${E.treeIcon(0, 0, 1)}</g>`;
    s += `<g class="m-bob" style="--ms:3.6s">${E.specs(820, 300, 8)}${E.glint(1010, 240, 3)}</g>`;
    s += A.namedGoat("biscotte", 860, 770, 1.7, true, CH.mimeStory.HERO_LOOK);
    // The leaf pile sits left of Biscotte: the bottom right corner is kept for the buttons.
    s += E.leafPile(560, 800, 260, 11);
    s += A.leaves(12, 200, 1500, -40);
    s += `<rect width="1600" height="900" fill="url(#g-vignette)"/>`;
    return `<g class="anim"><g filter="url(#f-rough)">${s}</g></g>`;
  }

  function endArt() {
    A.srand(311);
    let s = `<rect width="1600" height="900" fill="${P.plaster}"/><rect y="760" width="1600" height="140" fill="url(#p-tiles)"/>`;
    s += `<circle cx="800" cy="380" r="420" fill="url(#g-warm)"/>`;
    s += A.character("veronique", 640, 860, 600, false, { expr: "smile" });
    s += A.namedGoat("biscotte", 1000, 850, 1.6, true, CH.mimeStory.HERO_LOOK);
    s += A.namedCat("tobiasse", 1300, 846, 1.5, true);
    s += `<g class="m-bob" style="--ms:2.4s">${E.heart(820, 220, 2)}</g>`;
    s += `<rect width="1600" height="900" fill="url(#g-vignette)"/>`;
    return `<g class="anim"><g filter="url(#f-rough)">${s}</g></g>`;
  }

  CH.mimeStory = {
    FIRST_SCENE: "kitchen",
    HERO_LOOK: { knitCoat: "#b0302a" },
    scenes: CH.epScenes,
    PICS: X.PICS,
    CARDS: X.CARDS,
    CARD_ORDER: ["case", "dream", "burn", "ring", "ledger", "shrug", "basket", "glint", "loot", "smoke"],
    DEDS,
    // The glint in the nest was only a spoon and a pearl.
    CROSSED: { glint: (s) => flag(s, "loot") },
    RULES: [],
    GOALS,
    EGGS: ["gerbera", "duck", "record", "cameo"],
    CUTS,
    titleArt,
    endArt,
  };
})();

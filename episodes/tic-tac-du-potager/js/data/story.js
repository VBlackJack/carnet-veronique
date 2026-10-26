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

// The second wordless episode: Veronique's pink watch is gone, Biscotte finds it.
// What really happened: at the wash-house Veronique set her watch on the soap while she
// washed the squashes; the dish tipped and the watch fell into the straw of the crate
// below, which Julien wheeled to the garden. Benjamin carved his lantern over the crate,
// then tipped the straw and the pulp into the compost bin. Julien's rattle scarecrow
// drowns everything; stopped, the compost ticks.
(function () {
  const A = CH.art, P = A.P, E = CH.epArt, X = CH.epPics;
  const has = (s, id) => s.cards.includes(id);
  const flag = (s, id) => !!s.flags[id];
  const ded = (s, id) => s.deds.includes(id);
  const VERO_HEAD = [CH.epScenes.lavoir.VERO.x, 410];

  const DEDS = [
    { id: "wash", pairs: [["wrist", "soap"]], pic: X.DED_ART.wash },
    { id: "trip", pairs: [["crate", "tracks"]], pic: X.DED_ART.trip },
    { id: "compost", pairs: [["carve", "tick"], ["hens", "tick"]], requires: ["wash", "trip"], pic: X.DED_ART.compost },
  ];

  // The bee follows this path: the first goal not yet reached is the one it shows.
  const GOALS = [
    { target: "lavoir.veronique", done: (s) => has(s, "wrist") },
    { target: "lavoir.soap", done: (s) => has(s, "soap") },
    { target: "book", done: (s) => ded(s, "wash") },
    { target: "lavoir.mark", done: (s) => has(s, "crate") },
    { target: "lavoir.tracks", done: (s) => has(s, "tracks") },
    { target: "book", done: (s) => ded(s, "trip") },
    { target: "potager.benjamin", done: (s) => has(s, "carve") },
    { target: "potager.rope", done: (s) => flag(s, "quiet") },
    { target: "potager.compost", done: (s) => has(s, "tick") },
    { target: "book", done: (s) => ded(s, "compost") },
    { target: "potager.compost", done: (s) => flag(s, "found") },
  ];

  const CUTS = {
    opening: [
      { wait: 700 },
      { bubble: { at: VERO_HEAD, pics: ["watch", "question"] } },
      { sfx: "bleat" },
    ],
    ending: [
      { go: "lavoir", at: 560 },
      { face: -1 },
      { sfx: "bleat" },
      { hero: "hop" },
      { beat: "puton", ms: 900, flag: "wearing", sfx: "pop" },
      { sfx: "tick" },
      { sfx: "chord" },
      { bubble: { at: VERO_HEAD, pics: ["heart", "goat"] } },
      { wait: 500 },
      { end: true },
    ],
  };

  function titleArt() {
    A.srand(601);
    let s = `<linearGradient id="v-title" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6d5a7a"/><stop offset=".6" stop-color="#d98a5a"/><stop offset="1" stop-color="#f2c27a"/></linearGradient>`;
    s += `<rect width="1600" height="900" fill="url(#v-title)"/>`;
    s += `<circle cx="1220" cy="520" r="110" fill="${E.COL.sun}" stroke="${P.ink}" stroke-width="3"/>`;
    s += A.hills(600, "#7a6a6a", 30, 11) + A.hills(680, "#6a6a52", 24, 13);
    s += `<g class="m-bob" style="--ms:3.6s">${E.watch(820, 300, 4, { rot: -12 })}${E.glint(900, 210, 3)}</g>`;
    // Pumpkins and the lantern sit left of Biscotte: the bottom right corner is kept for the buttons.
    s += E.compostBin(300, 800, 260, 150);
    s += E.lantern(560, 760, 60, true) + E.squash(660, 790, 34, 2);
    s += A.namedGoat("biscotte", 900, 790, 1.7, true, CH.mimeStory.HERO_LOOK);
    s += A.leaves(12, 200, 1500, -40);
    s += `<rect width="1600" height="900" fill="url(#g-vignette)"/>`;
    return `<g class="anim"><g filter="url(#f-rough)">${s}</g></g>`;
  }

  function endArt() {
    A.srand(611);
    let s = `<rect width="1600" height="900" fill="#3a2e3a"/><rect y="740" width="1600" height="160" fill="#5a4a36"/>`;
    s += `<circle cx="800" cy="520" r="460" fill="url(#g-warm)"/>`;
    s += A.character("veronique", 560, 860, 600, false, { expr: "smile" });
    s += A.character("benjamin", 1220, 860, 440, true, { expr: "smile" });
    s += E.lantern(1000, 780, 64, true);
    s += A.namedGoat("biscotte", 860, 850, 1.5, true, CH.mimeStory.HERO_LOOK);
    s += `<g class="m-bob" style="--ms:2.4s">${E.heart(800, 200, 2)}</g>`;
    s += `<rect width="1600" height="900" fill="url(#g-vignette)"/>`;
    return `<g class="anim"><g filter="url(#f-rough)">${s}</g></g>`;
  }

  CH.mimeStory = {
    FIRST_SCENE: "lavoir",
    HERO_LOOK: { knitCoat: "#b0302a" },
    scenes: CH.epScenes,
    PICS: X.PICS,
    CARDS: X.CARDS,
    CARD_ORDER: ["wrist", "soap", "crate", "tracks", "glint", "lure", "barrow", "carve", "hens", "tick"],
    DEDS,
    // The shine in the stream was only a fishing lure.
    CROSSED: { glint: (s) => flag(s, "lure") },
    RULES: [],
    GOALS,
    EGGS: ["frog", "ghost", "hen", "crow"],
    CUTS,
    titleArt,
    endArt,
  };
})();

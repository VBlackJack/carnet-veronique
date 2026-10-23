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

// The 1895 cast: the family at a charity evening in Baker Street, Bernard and Francoise
// on the music-hall bill, and the six suspects. Each silhouette tells its role at a glance.
(function () {
  const A = CH.art;

  Object.assign(A.PEOPLE, {
    // Optician from the shop across the street: high-collared blouse, long plum skirt and
    // jacket, her satchel with the trial lenses.
    veronique: {
      skin: "#ecbfa6", hair: "#5a3b2a", hairStyle: "bob", top: "#f1e7d4", highCollar: "#f1e7d4", jacket: "#5a2e3e", sleeve: "#5a2e3e",
      longSkirt: "#5a2e3e", shoes: "#2a1e18", necklace: true, mole: "big", bag: "#7a4a32",
      glasses: { color: "#22403c", thick: true }, seed: 101,
    },
    // Magic-lantern operator: waistcoat, rolled sleeves, a leather apron for the hot lantern.
    julien: {
      skin: "#e3b096", hair: "#3a2a22", hairStyle: "fade", top: "#efe9dc", rolled: true, waistcoat: "#2f3f3a", toolApron: "#6a4a32",
      pants: "#3a3c42", shoes: "#3a2f28", longBeard: "#b4b0aa", mustache: "#6e665e", glasses: { color: "#1f2328", round: true }, seed: 131,
    },
    // Programme seller: knickerbockers, flat cap, a bundle of programmes.
    benjamin: {
      skin: "#f2c6ad", hair: "#8a5a38", hairStyle: "tuft", top: "#4a5a6e", knickers: true, pants: "#3a3a40", socks: "#c9c2b4",
      shoes: "#2a2420", cap: "#6a5a48", freckles: true, blush: "#e78f80", programme: "#2f4a7a", seed: 181,
    },
    // Bernard and Francoise, on the music-hall bill: their stage costumes.
    bernard: {
      skin: "#e6b49a", hair: "#c9c5bd", hairStyle: "short", browColor: "#3a322c", browWidth: 6, top: "#f3efe6", braces: "#2a2624",
      bowtie: "#e8559a", pants: "#5a4636", shoes: "#2a1e18", hat: { kind: "bowler", color: "#2a2624" }, glassesOnCollar: "#3b2f2a",
      guitar: "#c08a4a", expr: "amused", seed: 401,
    },
    francoise: {
      skin: "#f0c6aa", hair: "#d9955a", hairStyle: "curlyShort", top: "#d9a72a", overalls: "#1f1c22", skirt: "#1f1c22",
      dots: ["#f2d36b", "#e8559a", "#4aa0d8", "#5aae5a", "#e65a4a", "#9a6ad0"], dotSize: 7,
      legs: "#f6f1e6", legStripes: ["#e65a4a", "#f2d36b", "#5aae5a", "#4aa0d8", "#9a6ad0"], shoes: "#7a2a3a",
      hat: { kind: "beret", color: "#e58fb0", flower: "#f6f1e6", heart: "#f2d36b" },
      glasses: { multi: ["#e65a7a", "#4aa0d8", "#f2c03a"] }, expr: "smile", seed: 411,
    },
    // The nephew: elegant, clean-shaven, dove-grey coat, silk waistcoat, pale gloves.
    rupert: {
      skin: "#f0c8ae", hair: "#7a5a3a", hairStyle: "neatSide", top: "#f3efe6", shirtCollar: "#f3efe6", waistcoat: "#c9a85a",
      jacket: "#8a8a96", sleeve: "#8a8a96", pants: "#5a5a66", shoes: "#1f1b1a", tie: "#5a2e3e", gloves: "#e8e0cc",
      expr: "smile", squint: true, noseMarks: true, seed: 601,
    },
    // The colonel: white handlebar moustache, monocle on the right eye, medals.
    colonel: {
      skin: "#e2a888", hair: "#e8e4dc", hairStyle: "bald", top: "#f3efe6", shirtCollar: "#f3efe6", jacket: "#4a3a2e", sleeve: "#4a3a2e",
      jacketLong: true, pants: "#3a3028", shoes: "#1f1b1a", handlebar: "#e8e4dc", browColor: "#9a948a", browWidth: 4,
      monocle: { color: "#c9a24a", veiled: true }, medals: ["#a8443a", "#2f5a9a", "#d9b44a"], monocleCase: "#4a2e20", seed: 611,
    },
    // The hostess: grey silk, a small tiara, a cane, a woollen shawl that crackles.
    lady: {
      skin: "#ecc2a8", hair: "#b9b4ab", hairStyle: "bun", top: "#8a8a90", highCollar: "#8a8a90", longSkirt: "#8a8a90", shoes: "#2a2420",
      stole: "#d9cfe0", hat: { kind: "tiara", color: "#d9d9dc", stone: "#9ad0e8" }, pearls: true, cane: "#c9a24a", seed: 621,
    },
    // The insurance man: dark suit, watch chain, black notebook.
    penhallow: {
      skin: "#e0b294", hair: "#3a3430", hairStyle: "slick", top: "#efe9dc", shirtCollar: "#efe9dc", tie: "#1f1b1a", waistcoat: "#3a3a40",
      jacket: "#24242a", sleeve: "#24242a", pants: "#24242a", shoes: "#1f1b1a", mustache: "#3a3430", watchChain: true,
      notebookHeld: "#1f1b1a", expr: "skeptic", seed: 631,
    },
    // The magician: opera cape lined in red, top hat, waxed moustache, white gloves.
    zamboni: {
      skin: "#d9a07e", hair: "#1f1712", hairStyle: "slick", top: "#f3efe6", shirtCollar: "#f3efe6", bowtie: "#1f1b1a", waistcoat: "#1f1b1a",
      coatOpen: "#1f1b1a", capeLining: "#b0302a", sleeve: "#1f1b1a", pants: "#1f1b1a", shoes: "#1f1b1a", handlebar: "#1f1712", gloves: "#f6f1e6",
      hat: { kind: "top", color: "#1f1b1a", band: "#b0302a" }, expr: "amused", seed: 641,
    },
    // The journalist: boater, fitted jacket, steno notebook.
    ada: {
      skin: "#f2c8ac", hair: "#4a2e20", hairStyle: "bun", top: "#f3efe6", shirtCollar: "#f3efe6", tie: "#2f3a5a", jacket: "#5a6a4a",
      sleeve: "#5a6a4a", longSkirt: "#3a3a40", shoes: "#2a2420", hat: { kind: "boater", color: "#e8d4a0", band: "#2f3a5a" },
      sketchbook: "#f3ece0", freckles: true, seed: 651,
    },
  });

  // Biscotte wears a tiny tweed deerstalker. Nobody dares tell him.
  Object.assign(A.GOATS.biscotte, { knitCoat: null, sparkle: null, neckerchief: null, deerstalker: "#a8875a" });

  // Relative heights for scenes (adult reference 420).
  A.HEIGHTS = {
    veronique: 420, julien: 440, benjamin: 340, bernard: 425, francoise: 400, rupert: 440, colonel: 430, lady: 405,
    penhallow: 425, zamboni: 445, ada: 410,
  };
})();

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

// The 1911 cast: the family on a working trip, Bernardo and Francesca the travelling
// players, the six suspects and the old master. Each silhouette tells its role at a glance.
(function () {
  const A = CH.art;

  Object.assign(A.PEOPLE, {
    // Optician on a visit: cream high-collared blouse, long bottle-green skirt and jacket,
    // her leather satchel (the polariscope lives in it).
    veronique: {
      skin: "#ecbfa6", hair: "#5a3b2a", hairStyle: "bob", top: "#f1e7d4", highCollar: "#f1e7d4", jacket: "#2f4a3a", sleeve: "#2f4a3a",
      longSkirt: "#2f4a3a", shoes: "#2a1e18", necklace: true, mole: "big", bag: "#7a4a32",
      glasses: { color: "#22403c", thick: true }, seed: 101,
    },
    // Electrician: rolled shirt sleeves, dark waistcoat, tool apron, round spectacles.
    julien: {
      skin: "#e3b096", hair: "#3a2a22", hairStyle: "fade", top: "#efe9dc", rolled: true, waistcoat: "#3a3f48", toolApron: "#7a5a3a",
      pants: "#4a4c52", shoes: "#3a2f28", longBeard: "#b4b0aa", mustache: "#6e665e", glasses: { color: "#1f2328", round: true }, seed: 131,
    },
    // Knickerbockers, flat cap, and the St Martin biscuit Biscotte wants all evening.
    benjamin: {
      skin: "#f2c6ad", hair: "#8a5a38", hairStyle: "tuft", top: "#b89a6a", knickers: true, pants: "#5a4a3a", socks: "#d9d0bd",
      shoes: "#3a2f28", cap: "#5a5048", freckles: true, blush: "#e78f80", biscuit: true, seed: 181,
    },
    // Bernardo: very short grey hair, thick dark brows, bowler hat and braces, a big pink
    // stage bow tie, glasses hung at the collar, guitar across the chest.
    bernard: {
      skin: "#e6b49a", hair: "#c9c5bd", hairStyle: "short", browColor: "#3a322c", browWidth: 6, top: "#f3efe6", braces: "#2a2624",
      bowtie: "#e8559a",
      pants: "#5a4636", shoes: "#2a1e18", hat: { kind: "bowler", color: "#2a2624" }, glassesOnCollar: "#3b2f2a",
      guitar: "#c08a4a", expr: "amused", seed: 401,
    },
    // Francesca: short strawberry-blond curls, multicoloured frames, pink beret with a
    // crochet flower, her stage outfit: mustard top under a black pinafore dress with big
    // multicoloured dots, rainbow-striped tights, burgundy boots.
    francoise: {
      skin: "#f0c6aa", hair: "#d9955a", hairStyle: "curlyShort", top: "#d9a72a", overalls: "#1f1c22", skirt: "#1f1c22",
      dots: ["#f2d36b", "#e8559a", "#4aa0d8", "#5aae5a", "#e65a4a", "#9a6ad0"], dotSize: 7,
      legs: "#f6f1e6", legStripes: ["#e65a4a", "#f2d36b", "#5aae5a", "#4aa0d8", "#9a6ad0"], shoes: "#7a2a3a", hat: { kind: "beret", color: "#e58fb0", flower: "#f6f1e6", heart: "#f2d36b" },
      glasses: { multi: ["#e65a7a", "#4aa0d8", "#f2c03a"] }, expr: "smile", seed: 411,
    },
    // Museum curator: tall and elegant, trimmed beard, lavalliere, cane, a lens on his waistcoat.
    morosini: {
      skin: "#e2b49a", hair: "#7a706a", hairStyle: "neatSide", top: "#f3efe6", lavalliere: "#6a2a3a", waistcoat: "#8a7650",
      jacket: "#2e2a33", sleeve: "#2e2a33", jacketLong: true, pants: "#2e2a33", shoes: "#1f1b1a", beard: "#8a8580", mustache: "#8a8580",
      loupe: true, cane: "#d9b44a", seed: 501,
    },
    // Venetian antique dealer: black dress, ivory wool-lace shawl, fan in hand.
    barbaro: {
      skin: "#e2b08e", hair: "#4a3a35", hairStyle: "bun", top: "#232026", longSkirt: "#232026", shoes: "#1f1b1a",
      shawl: "#e8dfcf", fan: "#7a2a3a", poseR: "front", ringRightHand: "#2f6a4a", seed: 511,
    },
    // The master's son: a suit a little too tight, watch chain, nervous hands.
    ottavio: {
      skin: "#ddaa8a", hair: "#2e2420", hairStyle: "slick", top: "#efe9dc", shirtCollar: "#efe9dc", tie: "#4a3a30", waistcoat: "#6a6450",
      jacket: "#5a5a48", sleeve: "#5a5a48", pants: "#5a5a48", shoes: "#3a2f28", mustache: "#2e2420", watchChain: true,
      poseL: "front", poseR: "front", expr: "sad", seed: 521,
    },
    // First apprentice: burnt forearms, leather apron, red neckerchief, the blowpipe.
    nane: {
      skin: "#d9a07e", hair: "#2a201a", hairStyle: "tousled", top: "#e9e1cf", rolled: true, burns: true, leatherApron: "#7a4a2a",
      scarf: "#b0302a", pants: "#3a3430", boots: "#2a2420", blowpipe: true, seed: 531,
    },
    // Enamel painter: smock spotted with colours, loose bun with brushes in it.
    elena: {
      skin: "#efc3a6", hair: "#6a3a2a", hairStyle: "bun", top: "#e9e0d0", smock: "#e9e0d0", longSkirt: "#5a6a7a", shoes: "#3a2f28",
      brushes: true, expr: "amused", seed: 541,
    },
    // Boston collector: travelling coat, enormous hat, lorgnette.
    lowell: {
      skin: "#f0c8b0", hair: "#b9a88a", hairStyle: "bun", top: "#7a6a5a", coatLong: true, longSkirt: "#4a4a40", shoes: "#2a2420",
      hat: { kind: "wide", color: "#5a3a4a", band: "#2e2430", feather: "#efe4cf", flowers: ["#d98f8a", "#f2d36b"] },
      glasses: { color: "#b08a3a", pinceNez: true }, pearls: true, expr: "skeptic", seed: 551,
    },
    // The old master, seen at dinner and in his portrait: white walrus moustache, apron, scarf.
    bortolo: {
      skin: "#d49a78", hair: "#e8e4dc", hairStyle: "bald", top: "#e9e1cf", rolled: true, burns: true, leatherApron: "#6a4026",
      scarf: "#b0302a", pants: "#3a3430", boots: "#2a2420", walrus: "#e8e4dc", browColor: "#cfc9be", seed: 561,
    },
  });

  // Biscotte wears a little red neckerchief, like the furnace workers.
  Object.assign(A.GOATS.biscotte, { knitCoat: null, sparkle: null, neckerchief: "#b0302a" });

  // Relative heights for scenes (adult reference 420).
  A.HEIGHTS = {
    veronique: 420, julien: 440, benjamin: 340, bernard: 425, francoise: 400, morosini: 460, barbaro: 410,
    ottavio: 430, nane: 440, elena: 405, lowell: 415, bortolo: 410,
  };
})();

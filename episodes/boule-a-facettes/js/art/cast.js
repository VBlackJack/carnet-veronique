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

// The 1978 cast: the family dressed for the gala, the star, the five other suspects
// and the barman. Each silhouette tells its role at a glance.
(function () {
  const A = CH.art;

  Object.assign(A.PEOPLE, {
    // Guest of honour: forest-green velvet jacket, cream turtleneck, brown flares.
    veronique: {
      skin: "#ecbfa6", hair: "#5a3b2a", hairStyle: "bob", top: "#efe4cf", turtleneck: "#efe4cf", jacket: "#2f4a3a", sleeve: "#2f4a3a",
      pants: "#4a3328", flares: true, shoes: "#2a1e18", necklace: true, mole: true, notebookHeld: "#7a4a32",
      glasses: { color: "#22403c", thick: true }, seed: 101,
    },
    // Lighting operator: patterned brown shirt with a wide collar, intercom headset.
    julien: {
      skin: "#e3b096", hair: "#3a2a22", hairStyle: "fade", top: "#8a6440", bigCollar: "#a07a52", pants: "#3c4a6a",
      flares: true, shoes: "#3a2f28", longBeard: "#b4b0aa", mustache: "#6e665e", headset: true, clipboard: true,
      glasses: { color: "#1f2328" }, seed: 131,
    },
    // Striped tee and flared jeans, hands in pockets.
    benjamin: {
      skin: "#f2c6ad", hair: "#8a5a38", hairStyle: "tuft", top: "#efe6d2", stripes: "#c0582f", pants: "#4b5a6e",
      flares: true, shoes: "#e8e2d6", freckles: true, blush: "#e78f80", poseL: "pocket", poseR: "pocket", seed: 181,
    },
    // The star: white sequinned jumpsuit, standing collar, her white sunglasses.
    stella: {
      skin: "#e8b99c", hair: "#2e1f1c", hairStyle: "wavyBob", top: "#f4f1ea", pants: "#f4f1ea", flares: true,
      sequins: "#aeb6bd", highCollar: "#f4f1ea", shoes: "#c9cdd1",
      glasses: { color: "#f4f1ea", thick: true, tint: "#3a3a44" }, seed: 301,
    },
    // Night-club owner: cream suit, teal open shirt, gold chain, red signet ring on the LEFT hand.
    max: {
      skin: "#d9a07e", hair: "#6a5a52", hairStyle: "slick", top: "#2f5a63", bigCollar: "#2f5a63", openShirt: true,
      goldChain: true, jacket: "#e9e0c8", sleeve: "#e9e0c8", pants: "#e9e0c8", flares: true, shoes: "#6a4a32", ringLeftHand: "#b0182f", seed: 311,
    },
    // Choreographer: violet leotard, dark tights, pink headband and leg warmers.
    coco: {
      skin: "#c98f6a", hair: "#1f1712", hairStyle: "swept", top: "#5e2f6e", pants: "#2b2230", legwarmers: "#e58fb0",
      headband: "#e58fb0", shoes: "#2b2230", poseL: "down", poseR: "down", seed: 321,
    },
    // DJ: amber aviator shades, wine shirt with a wide collar, ruby ring on the RIGHT hand.
    ray: {
      skin: "#e2b08e", hair: "#3a2618", hairStyle: "tousled", top: "#6e2433", bigCollar: "#6e2433", openShirt: true,
      pants: "#24242c", flares: true, shoes: "#1f1b1a", ringRightHand: "#c0102a", poseR: "pocket",
      glasses: { color: "#c9a24a", aviator: true, tint: "#a8743a" }, seed: 331,
    },
    // Jeweller's agent: deliberately dull grey suit, moustache, a watch he keeps checking.
    henri: {
      skin: "#e2b49a", hair: "#8e8a84", hairStyle: "neatSide", top: "#e9e4d8", shirtCollar: "#e9e4d8", tie: "#3a3a44",
      jacket: "#7d7f84", sleeve: "#7d7f84", pants: "#7d7f84", shoes: "#2a2420", mustache: "#8e8a84", watch: "#c9c9c4",
      // Stiff and tired: hands joined in front, brows drawn.
      poseL: "front", poseR: "front", expr: "focus", seed: 341,
    },
    // Photographer: auburn curls, overalls, Polaroid SX-70 with its FlashBar.
    sylvie: {
      skin: "#f0c6a8", hair: "#9a5a32", hairStyle: "curly", top: "#f2e6c8", overalls: "#5a7a9a", pants: "#5a7a9a",
      shoes: "#8a5a3a", freckles: true, polaroid: true, polaroidUsed: 7, poseL: "front", poseR: "front", seed: 351,
    },
    // Barman: white shirt, black waistcoat, bow tie, towel on the shoulder.
    lulu: {
      skin: "#d9a184", hair: "#4a3a30", hairStyle: "short", top: "#f3efe6", waistcoat: "#24242a", bowtie: "#7a2a32",
      pants: "#24242a", shoes: "#1f1b1a", mustache: "#4a3a30", towel: true, seed: 361,
    },
  });

  // Biscotte wears a little sparkly waistcoat for the gala.
  Object.assign(A.GOATS.biscotte, { knitCoat: "#d9b44a", sparkle: "#fbf6e6" });

  // Relative heights for scenes (adult reference 420).
  A.HEIGHTS = {
    veronique: 420, julien: 440, benjamin: 340, stella: 455, max: 430, coco: 415, ray: 435, henri: 405, sylvie: 395, lulu: 410,
  };
})();

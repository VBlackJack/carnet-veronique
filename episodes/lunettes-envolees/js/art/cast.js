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

// The 2026 cast added for the pilot: Bernard and Francoise out hiking, seen from afar.
(function () {
  const A = CH.art;

  Object.assign(A.PEOPLE, {
    // Very short grey hair, thick dark brows, glasses hung at the collar, hiking jacket.
    bernard: {
      skin: "#e6b49a", hair: "#c9c5bd", hairStyle: "short", browColor: "#3a322c", browWidth: 6, top: "#3f6a5a",
      pants: "#5a4636", shoes: "#2a1e18", glassesOnCollar: "#3b2f2a", seed: 401,
    },
    // Short strawberry-blond curls, multicoloured frames, pink beret with a flower,
    // dotted dress over rainbow-striped tights.
    francoise: {
      skin: "#f0c6aa", hair: "#d9955a", hairStyle: "curlyShort", top: "#d9a72a", overalls: "#1f1c22", skirt: "#1f1c22",
      dots: ["#f2d36b", "#e8559a", "#4aa0d8", "#5aae5a", "#e65a4a", "#9a6ad0"], dotSize: 7,
      legs: "#f6f1e6", legStripes: ["#e65a4a", "#f2d36b", "#5aae5a", "#4aa0d8", "#9a6ad0"], shoes: "#7a2a3a",
      hat: { kind: "beret", color: "#e58fb0", flower: "#f6f1e6", heart: "#f2d36b" },
      glasses: { multi: ["#e65a7a", "#4aa0d8", "#f2c03a"] }, seed: 411,
    },
  });
})();

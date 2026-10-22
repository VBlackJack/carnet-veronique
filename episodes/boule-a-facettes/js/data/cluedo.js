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

// Grid of "La Boule à facettes": who, when the real necklace vanished, and where it is.
(function () {
  const strass = (s) => !!s.deds.d_strass;

  CH.cluedoData = {
    CARDS: {
      who: ["stella", "max", "coco", "ray", "henri", "sylvie"],
      when: ["t2230", "t2315", "t2330", "t2341", "t2342"],
      where: ["loge", "bureau", "cabine", "regie", "bar", "boule"],
    },
    // Solution: max, t2315, bureau. Nothing crosses them out.
    EXCLUDERS: {
      "who.stella": ["d_stella"],
      "who.coco": ["d_coco"],
      "who.ray": ["d_ray"],
      "who.henri": ["d_henri"],
      "who.sylvie": ["d_sylvie"],
      "when.t2230": ["d_creneau"],
      "when.t2330": ["d_creneau"],
      "when.t2341": ["d_strass"],
      "when.t2342": ["d_strass"],
      "where.bar": ["o_fouille_bar"],
      "where.cabine": ["o_fouille_cabine"],
      "where.regie": ["o_fouille_regie"],
      "where.loge": ["o_fouille_loge"],
      "where.boule": ["o_boule"],
    },
    // Searches only make sense once the theft on stage is known to be staged.
    REFUTE: {
      julien: [{ card: "where.regie", clue: "o_fouille_regie", when: strass }],
      benjamin: [{ card: "where.regie", clue: "o_fouille_regie", when: strass }],
      lulu: [{ card: "where.bar", clue: "o_fouille_bar", when: strass }],
      ray: [{ card: "where.cabine", clue: "o_fouille_cabine", when: strass }],
      henri: [{ card: "where.loge", clue: "o_fouille_loge", when: strass }],
      stella: [{ card: "when.t2330", clue: "c_ecrin_ouvert", when: strass }],
    },
  };
})();

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

// Grid of "Le Verre de minuit": who, how the master died, and when.
(function () {
  const AC = CH.config.acts;
  const act3 = (s) => s.act >= AC.crossCheck;
  const has = (s, id) => !!s.clues[id];

  CH.cluedoData = {
    CARDS: {
      who: ["morosini", "barbaro", "ottavio", "nane", "elena", "lowell"],
      how: ["boule", "canne", "chute", "brulure", "malaise", "vin"],
      when: ["t2320", "t2330", "t2345", "t0000", "t0005"],
    },
    // Solution: morosini, chute, t2345. Nothing crosses them out.
    EXCLUDERS: {
      "who.barbaro": ["d_salon"],
      "who.ottavio": ["d_salon"],
      "who.lowell": ["d_salon"],
      "who.nane": ["d_amoureux"],
      "who.elena": ["d_amoureux"],
      "how.brulure": ["o_corps"],
      "how.canne": ["o_crochets"],
      "how.vin": ["o_vin"],
      "how.boule": ["d_chute"],
      "how.malaise": ["d_chute"],
      "when.t2320": ["d_lowell_vivant"],
      "when.t2330": ["d_lowell_vivant"],
      "when.t0000": ["d_avant_minuit"],
      "when.t0005": ["d_avant_minuit"],
    },
    REFUTE: {
      julien: [{ card: "when.t0000", clue: "c_carnet_julien", when: act3 }],
      bernard: [{ card: "when.t0000", clue: "c_cloches" }],
      francoise: [{ card: "when.t0000", clue: "c_cloches" }],
      nane: [{ card: "how.brulure", clue: "o_corps" }, { card: "when.t0005", clue: "c_braises", when: act3 }],
      lowell: [{ card: "when.t2330", clue: "c_lowell_aveu", when: act3 }],
      ottavio: [{ card: "when.t0005", clue: "c_ottavio_aveu", when: (s) => act3(s) && has(s, "c_contrat") }],
      morosini: [{ card: "how.canne", clue: "o_crochets" }, { card: "how.vin", clue: "o_vin" }],
    },
  };
})();

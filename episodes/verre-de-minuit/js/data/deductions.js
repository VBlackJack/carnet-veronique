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

// Deductions of "Le Verre de minuit", made by pairing two cards.
// Text: ded.<id>.title / .text. A requirement may be a deduction, clue or flag.
(function () {
  const DEDUCTIONS = [
    // Act I: the belief the game will break later
    { id: "h_coup", kind: "hypothesis", invalidatedBy: "d_chute", pairs: [["c_mort", "c_boule"]] },
    // Act II
    { id: "d_neuf", pairs: [["c_tensions", "c_ancienne"]], board: "b1" },
    { id: "d_barbaro", pairs: [["c_registre", "c_calice"]], board: "b1" },
    // Act III, branch A: when
    { id: "d_avant_minuit", pairs: [["c_verre_fendu", "c_braises"]] },
    { id: "d_lowell_vivant", pairs: [["c_lowell_aveu", "c_lowell_escalier"], ["c_lowell_aveu", "c_ottavio_aveu"]] },
    // Branch B: how
    { id: "d_maquillee", pairs: [["c_bulle", "c_boule"]] },
    { id: "d_chute", pairs: [["c_empreinte", "c_mort"], ["c_empreinte", "c_boule"]], requires: ["d_maquillee"], failKey: "combo.need.maquillee", cut: "chute" },
    // Branch C: alibis
    { id: "d_salon", pairs: [["c_ottavio_aveu", "c_barbaro_soir"], ["c_ottavio_aveu", "c_lowell_soir"]], requires: ["d_avant_minuit"], failKey: "combo.need.creneau" },
    { id: "d_amoureux", pairs: [["c_parapluie", "c_cloches"], ["c_parapluie", "c_nane_soir"]] },
    // Branch D: Morosini
    { id: "d_horloge", pairs: [["c_carnet_julien", "c_cloches"]], cut: "rev2" },
    { id: "d_mensonge", pairs: [["c_morosini_soir", "c_carnet_julien"]], cut: "mensonge" },
    { id: "d_pleine_voix", pairs: [["c_morosini_soir", "c_chanson"]] },
    { id: "d_eclat", pairs: [["c_eclat", "c_vitrine_vide"]] },
    { id: "d_certificats", pairs: [["c_certificats", "c_registre"], ["c_certificats", "c_calice"]] },
  ];

  // Wrong pairs with a dedicated line (order does not matter).
  const SPECIFIC = [
    ["c_calice", "c_tensions"], ["c_mort", "c_morosini_soir"], ["c_registre", "c_tensions"],
    ["c_carnet_julien", "c_ottavio_soir"], ["c_braises", "c_mort"], ["c_bulle", "c_mort"], ["c_lowell_escalier", "c_lowell_soir"],
    ["c_atelier_froid", "c_elena_soir"], ["c_contrat", "c_ottavio_soir"], ["c_chanson", "c_cloches"], ["c_eclat", "c_morosini_soir"],
  ];
  const GENERIC_COUNT = 10;

  const key = (a, b) => [a, b].sort().join("+");
  const byPair = {};
  DEDUCTIONS.forEach((d) => d.pairs.forEach(([a, b]) => (byPair[key(a, b)] = d)));
  const specific = {};
  SPECIFIC.forEach(([a, b]) => (specific[key(a, b)] = `combo.${[a, b].sort().join("__")}`));

  CH.deductions = {
    LIST: DEDUCTIONS,
    SPECIFIC,
    get: (id) => DEDUCTIONS.find((d) => d.id === id),
    match: (a, b) => byPair[key(a, b)] || null,
    specificKey: (a, b) => specific[key(a, b)] || null,
    GENERIC_COUNT,
    forBoard: (board) => DEDUCTIONS.filter((d) => d.board === board).map((d) => d.id),
  };
})();

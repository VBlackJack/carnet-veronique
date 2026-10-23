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

// Deductions of "Le Monocle", made by pairing two cards.
// Text: ded.<id>.title / .text. A requirement may be a deduction, clue or flag.
(function () {
  const DEDUCTIONS = [
    // Act I: the belief the game will break later
    { id: "h_colonel", kind: "hypothesis", invalidatedBy: "d_neutre", pairs: [["c_monocle", "c_etui_vide"]] },
    // Act II
    { id: "d_fumoir", pairs: [["c_cataracte", "c_colonel_soir"]], board: "b1" },
    // Act III, branch A: the monocle
    { id: "d_neutre", pairs: [["c_neutre", "c_registre_colonel"]], cut: "neutre" },
    { id: "d_theatre", pairs: [["c_registre_smith", "c_neutre"], ["c_registre_smith", "c_monocle"]] },
    // Branch B: when
    { id: "d_couloir", pairs: [["c_lecture", "c_journal_julien"]] },
    { id: "d_lady", pairs: [["c_cape", "c_lady_soir"]] },
    // Branch C: alibis
    { id: "d_colonel", pairs: [["c_lecture", "c_cataracte"], ["c_lecture", "c_colonel_soir"]] },
    { id: "d_penhallow", pairs: [["c_penhallow_buffet", "c_penhallow_soir"]] },
    { id: "d_ada", pairs: [["c_ada_tel", "c_ada_soir"], ["c_cahier", "c_ada_soir"]] },
    { id: "d_zamboni", pairs: [["c_favoris", "c_zamboni_soir"], ["c_favoris", "c_malle"]] },
    // Branch D: Rupert
    { id: "d_myope", pairs: [["c_pincenez", "c_pincenez_poche"]] },
    { id: "d_travers", pairs: [["c_journal_julien", "c_rupert_soir"]] },
  ];

  // Wrong pairs with a dedicated line (order does not matter).
  const SPECIFIC = [
    ["c_monocle", "c_vol"], ["c_cataracte", "c_monocle"], ["c_etui_vide", "c_neutre"], ["c_journal_julien", "c_vol"],
    ["c_malle", "c_zamboni_soir"], ["c_pincenez", "c_rupert_soir"], ["c_cape", "c_rupert_soir"], ["c_ada_soir", "c_journal_julien"],
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

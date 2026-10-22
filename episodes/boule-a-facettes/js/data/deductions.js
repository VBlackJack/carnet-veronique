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

// Deductions of "La Boule à facettes", made by pairing two cards.
// Text: ded.<id>.title / .text. A requirement may be a deduction, clue or flag.
(function () {
  const DEDUCTIONS = [
    // Act I: the belief the game will break later
    { id: "h_noir", kind: "hypothesis", invalidatedBy: "d_strass", pairs: [["c_vol", "c_noir"]] },
    // Act II
    { id: "d_volontaire", pairs: [["c_noir_volontaire", "c_top47"]], board: "b1" },
    { id: "d_photo_cachee", pairs: [["c_flashbar", "c_sylvie_soir"]], board: "b1", cut: "photo" },
    { id: "d_main", pairs: [["c_main", "c_bague_ray"]], board: "b1" },
    // Act III: the turn, then three branches
    { id: "d_strass", pairs: [["c_copie", "c_polas"]], cut: "rev2" },
    { id: "d_creneau", pairs: [["c_ecrin_ouvert", "c_coco_loge"]] },
    { id: "d_coco", pairs: [["c_coco_loge", "c_henri_croise"]] },
    { id: "d_henri", pairs: [["c_henri_tel", "c_henri_soir"]] },
    { id: "d_sylvie", pairs: [["c_polas", "c_sylvie_soir"], ["c_polas", "c_flashbar"]], requires: ["d_creneau"], failKey: "combo.need.creneau" },
    { id: "d_ray", pairs: [["c_polas", "c_bague_ray"], ["c_polas", "c_ray_soir"]], requires: ["d_creneau"], failKey: "combo.need.creneau" },
    { id: "d_inversion", pairs: [["c_reflet", "c_bague_ray"]] },
    { id: "d_main_gauche", pairs: [["c_chevaliere", "c_reflet"]], requires: ["d_inversion"], failKey: "combo.need.inversion" },
    { id: "d_commande", pairs: [["c_registre_md", "c_top47"]] },
    { id: "d_bureau", pairs: [["c_lumiere_bureau", "c_max_soir"], ["c_lumiere_bureau", "c_porte_comm"]] },
    { id: "d_stella", pairs: [["c_stella_aveu", "c_registre_md"]] },
    { id: "d_mobile", pairs: [["c_lettre_banque", "c_copie"]] },
  ];

  // Wrong pairs with a dedicated line (order does not matter).
  const SPECIFIC = [
    ["c_main", "c_chevaliere"], ["c_vol", "c_autour"], ["c_noir", "c_top47"], ["c_bague_ray", "c_chevaliere"],
    ["c_ray_soir", "c_bague_ray"], ["c_flashbar", "c_main"], ["c_ecrin_ouvert", "c_paillettes_violettes"],
    ["c_porte_comm", "c_max_soir"], ["c_copie", "c_vol"], ["c_henri_tel", "c_henri_croise"], ["c_reflet", "c_main"],
    ["c_coco_soir", "c_paillettes_violettes"], ["c_lettre_banque", "c_max_soir"], ["c_stella_soir", "c_ecrin_ouvert"],
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

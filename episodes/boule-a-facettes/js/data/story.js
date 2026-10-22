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

// Story of "La Boule à facettes": acts, cutscenes, boards and progression rules.
(function () {
  const A = CH.config.acts;
  const has = (s, id) => !!s.clues[id];
  const ded = (s, id) => !!s.deds[id];

  // Act in which each navigable scene opens (the office opens with Max's key).
  const SCENE_ACT = {
    piste: A.night, scene: A.night, bar: A.night,
    loge: A.leads, cabine: A.leads, regie: A.leads,
  };

  const VERSIONS = ["c_stella_soir", "c_max_soir", "c_coco_soir", "c_ray_soir", "c_henri_soir", "c_sylvie_soir"];

  const CUTS = {
    opening: [
      { bg: "cuisine2026" },
      { l: "cut.opening.kitchen" },
      { egg: "lego" },
      { bg: "title" },
      { l: "cut.opening.gala" },
      { egg: "lunettes" },
      { go: "piste" },
      { act: A.night },
      { l: "cut.opening.noir" },
      { clue: "c_vol" },
      { clue: "c_noir" },
      { l: "cut.opening.portes" },
    ],
    act2: [{ l: "cut.act2" }, { act: A.leads }],
    photo: [{ l: "cut.photo" }, { clue: "c_polas" }, { clue: "c_main" }],
    rev1: [{ go: "piste" }, { l: "board.b1.ok" }, { l: "cut.rev1" }, { act: A.crossCheck }],
    seau: [{ go: "bar" }, { flag: "seauRenverse" }, { l: "cut.seau" }, { clue: "c_copie" }, { clue: "o_bar_passages" }, { egg: "sourire" }],
    rev2: [{ l: "cut.rev2" }, { egg: "buee" }],
    bureau: [{ flag: "bureauOuvert" }],
    arcenciel: [{ l: "cut.arcenciel" }, { flag: "cadreDecroche" }, { clue: "c_arcenciel" }],
    finale: [
      { l: "board.b2.ok" },
      { go: "piste" },
      { l: "cut.finale.reunion" },
      { l: "cut.finale.aveu" },
      { act: A.ending },
      { l: "cut.finale.danse" },
      { egg: "dalle" },
      { bg: "cuisine2026" },
      { l: "cut.finale.retour" },
      { screen: "message" },
      { flag: "finished" },
      { screen: "bilan" },
      { screen: "end" },
    ],
  };

  // Rules fire once, in order, after every action.
  const RULES = [
    { id: "r_act2", when: (s) => s.act === A.night && VERSIONS.every((c) => has(s, c)) && ded(s, "h_noir"), steps: [{ cut: "act2" }] },
  ];

  // Answer index for each blank, in locale option order.
  const BOARDS = {
    b1: {
      ready: (s) => s.act === A.leads && ["d_volontaire", "d_photo_cachee", "d_main"].every((d) => ded(s, d)),
      answers: { q1: 1, q2: 0, q3: 1, q4: 0 },
      done: "board1Done",
      cut: "rev1",
    },
    b2: {
      ready: (s) =>
        s.act === A.crossCheck &&
        has(s, "c_arcenciel") &&
        ["d_strass", "d_creneau", "d_main_gauche", "d_bureau", "d_commande", "d_mobile", "d_stella", "d_coco", "d_ray", "d_henri", "d_sylvie"].every((d) => ded(s, d)),
      answers: { q1: 1, q2: 0, q3: 1, q4: 1, q5: 1, q6: 1, q7: 1 },
      done: "board2Done",
      cut: "finale",
      suspect: "q5",
    },
  };

  // At the start of act III, Biscotte has his eye on the champagne bucket.
  function biscotteOptions(s) {
    if (s.act === A.crossCheck && !has(s, "c_copie")) return [{ id: "seau", label: "ui.bis_seau", steps: [{ cut: "seau" }] }];
    return [];
  }

  // Small details noticed along the way, counted in the final summary.
  const EGGS = ["lego", "lunettes", "sourire", "buee", "dalle", "gerbera", "tournesol", "statique", "abba", "boneym", "papa", "colonnes"];

  CH.story = {
    FIRST_SCENE: "piste",
    SCENE_ACT,
    CUTS,
    RULES,
    BOARDS,
    EGGS,
    HYPOTHESIS_ACT: A.leads,
    FINAL_BOARD_FLAG: "board2Done",
    PET_LINES: 4,
    biscotteOptions,
    objectiveKey(s, board) {
      if (board) return `obj.${s.act}b`;
      if (s.act === A.crossCheck && !has(s, "c_copie")) return "obj.3a";
      return `obj.${s.act}`;
    },
  };
})();

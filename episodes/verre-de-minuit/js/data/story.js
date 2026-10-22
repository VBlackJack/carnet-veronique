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

// Story of "Le Verre de minuit": acts, cutscenes, boards and progression rules.
(function () {
  const A = CH.config.acts;
  const has = (s, id) => !!s.clues[id];
  const ded = (s, id) => !!s.deds[id];

  // Act in which each navigable scene opens.
  const SCENE_ACT = {
    fornace: A.night, cour: A.night, maison: A.night,
    echantillons: A.leads, atelier: A.leads, fondamenta: A.leads,
    musee: A.crossCheck,
  };

  const VERSIONS = ["c_morosini_soir", "c_barbaro_soir", "c_ottavio_soir", "c_nane_soir", "c_elena_soir", "c_lowell_soir"];

  const CUTS = {
    opening: [
      { bg: "cuisine2026" },
      { l: "cut.opening.kitchen" },
      { egg: "tobiasse2026" },
      { bg: "title" },
      { l: "cut.opening.murano" },
      { go: "fornace" },
      { act: A.night },
      { l: "cut.opening.four" },
      { clue: "c_mort" },
      { clue: "c_calice" },
      { l: "cut.opening.consigne" },
    ],
    act2: [{ l: "cut.act2" }, { act: A.leads }],
    nez: [{ l: "cut.nez" }, { egg: "nez" }],
    rev1: [{ go: "echantillons" }, { l: "board.b1.ok" }, { l: "cut.rev1" }, { act: A.crossCheck }, { l: "cut.act3" }],
    sonnerie: [{ go: "fornace" }, { l: "cut.sonnerie" }, { clue: "c_carnet_julien" }],
    rev2: [{ l: "cut.rev2" }],
    // The clock deduction found after the liar: the revelation has already played.
    horloge: [{ if: (s) => !ded(s, "d_mensonge"), then: [{ l: "cut.rev2" }] }],
    // The liar first: the clock revelation plays here if it has not played yet.
    mensonge: [{ if: (s) => !ded(s, "d_horloge"), then: [{ l: "cut.rev2" }] }, { l: "cut.mensonge" }],
    chute: [{ l: "cut.chute" }],
    eclat: [{ go: "musee" }, { l: "cut.eclat" }, { clue: "c_eclat" }],
    finale: [
      { l: "board.b2.ok" },
      { go: "fornace" },
      { l: "cut.finale.reunion" },
      { l: "cut.finale.aveu" },
      { act: A.ending },
      { l: "cut.finale.aube" },
      { bg: "cuisine2026" },
      { l: "cut.finale.retour" },
      { flag: "finished" },
      { screen: "bilan" },
      { screen: "end" },
    ],
  };

  // Rules fire once, in order, after every action.
  const RULES = [
    { id: "r_act2", when: (s) => s.act === A.night && VERSIONS.every((c) => has(s, c)) && ded(s, "h_coup"), steps: [{ cut: "act2" }] },
    // The red-nose gag plays after the first exchange with Bernardo or Francesca.
    { id: "r_nez", when: (s) => s.act < A.ending && Object.keys(s.seen).some((k) => k.startsWith("t:bernard:") || k.startsWith("t:francoise:")), steps: [{ cut: "nez" }] },
  ];

  // Answer index for each blank, in locale option order.
  const BOARDS = {
    b1: {
      ready: (s) => s.act === A.leads && ["d_neuf", "d_barbaro", "h_coup"].every((d) => ded(s, d)),
      answers: { q1: 1, q2: 1, q3: 2, q4: 1 },
      done: "board1Done",
      cut: "rev1",
    },
    b2: {
      ready: (s) =>
        s.act === A.crossCheck &&
        ["d_avant_minuit", "d_lowell_vivant", "d_chute", "d_salon", "d_amoureux", "d_mensonge", "d_eclat", "d_certificats"].every((d) => ded(s, d)),
      answers: { q1: 1, q2: 1, q3: 0, q4: 1, q5: 1, q6: 2 },
      done: "board2Done",
      cut: "finale",
      suspect: "q4",
    },
  };

  // Once Morosini's lie is plain, Biscotte has his nose on the coat in the museum.
  function biscotteOptions(s) {
    if (s.act === A.crossCheck && ded(s, "d_mensonge") && !has(s, "c_eclat")) return [{ id: "manteau", label: "ui.bis_manteau", steps: [{ cut: "eclat" }] }];
    return [];
  }

  // Small details noticed along the way, counted in the final summary.
  const EGGS = ["tobiasse2026", "tobiasse", "nez", "tremolo", "rayonfrais", "minecraft", "pinces", "statique", "ambre", "gerbera", "boites", "biscuits"];

  CH.story = {
    FIRST_SCENE: "fornace",
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
      if (s.act === A.crossCheck && !has(s, "c_carnet_julien")) return "obj.3a";
      return `obj.${s.act}`;
    },
  };
})();

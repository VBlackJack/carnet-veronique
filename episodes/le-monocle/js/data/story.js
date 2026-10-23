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

// Story of "Le Monocle": acts, cutscenes, boards and progression rules.
(function () {
  const A = CH.config.acts;
  const has = (s, id) => !!s.clues[id];
  const ded = (s, id) => !!s.deds[id];

  // Act in which each navigable scene opens.
  const SCENE_ACT = {
    salle: A.night, salon: A.night, lanterne: A.night,
    vestiaire: A.leads, fumoir: A.leads, coulisses: A.leads,
    boutique: A.crossCheck,
  };

  const VERSIONS = ["c_rupert_soir", "c_colonel_soir", "c_lady_soir", "c_penhallow_soir", "c_zamboni_soir", "c_ada_soir"];

  const CUTS = {
    opening: [
      { bg: "cuisine2026" },
      { l: "cut.opening.kitchen" },
      { egg: "tobiasse2026" },
      { bg: "title" },
      { l: "cut.opening.london" },
      { go: "salon" },
      { act: A.night },
      { l: "cut.opening.vol" },
      { clue: "c_vol" },
      { clue: "c_monocle" },
      { l: "cut.opening.consigne" },
    ],
    act2: [{ l: "cut.act2" }, { act: A.leads }],
    nez: [{ l: "cut.nez" }, { egg: "nez" }],
    rev1: [{ go: "salon" }, { l: "board.b1.ok" }, { l: "cut.rev1" }, { act: A.crossCheck }, { l: "cut.act3" }],
    neutre: [{ l: "cut.neutre" }],
    favoris: [{ go: "lanterne" }, { l: "cut.favoris" }, { clue: "c_favoris" }],
    case52: [{ go: "lanterne" }, { l: "cut.case52" }, { clue: "c_saphir" }],
    finale: [
      { l: "board.b2.ok" },
      { go: "salle" },
      { l: "cut.finale.reunion" },
      { l: "cut.finale.aveu" },
      { act: A.ending },
      { l: "cut.finale.enchere" },
      { bg: "cuisine2026" },
      { l: "cut.finale.retour" },
      { flag: "finished" },
      { screen: "bilan" },
      { screen: "end" },
    ],
  };

  // Rules fire once, in order, after every action.
  const RULES = [
    { id: "r_act2", when: (s) => s.act === A.night && VERSIONS.every((c) => has(s, c)) && ded(s, "h_colonel"), steps: [{ cut: "act2" }] },
    // The red-nose gag plays after the first exchange with Bernard or Francoise.
    { id: "r_nez", when: (s) => s.act < A.ending && Object.keys(s.seen).some((k) => k.startsWith("t:bernard:") || k.startsWith("t:francoise:")), steps: [{ cut: "nez" }] },
  ];

  // Answer index for each blank, in locale option order.
  const BOARDS = {
    b1: {
      // The whole of act II first: the smoking room, the lantern log, the buffet, the trunk.
      ready: (s) => s.act === A.leads && ["h_colonel", "d_fumoir"].every((d) => ded(s, d)) && ["o_times", "c_journal_julien", "c_penhallow_buffet", "c_malle"].every((c) => has(s, c)),
      answers: { q1: 1, q2: 2, q3: 1, q4: 1 },
      done: "board1Done",
      cut: "rev1",
    },
    b2: {
      ready: (s) =>
        s.act === A.crossCheck &&
        has(s, "c_saphir") &&
        ["d_neutre", "d_theatre", "d_couloir", "d_lady", "d_colonel", "d_penhallow", "d_ada", "d_zamboni", "d_myope", "d_travers"].every((d) => ded(s, d)),
      answers: { q1: 1, q2: 1, q3: 1, q4: 2, q5: 1, q6: 2 },
      done: "board2Done",
      cut: "finale",
      suspect: "q4",
    },
  };

  // In act III, Biscotte has his eye on the candied cherry on Bernard's nose.
  function biscotteOptions(s) {
    if (s.act === A.crossCheck && !has(s, "c_favoris")) return [{ id: "cerise", label: "ui.bis_cerise", steps: [{ cut: "favoris" }] }];
    return [];
  }

  // Small details noticed along the way, counted in the final summary.
  const EGGS = ["tobiasse2026", "tobiasse", "nez", "tremolo", "rayonfrais", "carte", "pinces", "statique", "abba", "bicyclette", "boites", "passant"];

  CH.story = {
    FIRST_SCENE: "salon",
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
      return `obj.${s.act}`;
    },
  };
})();

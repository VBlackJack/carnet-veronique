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

// Story of "Le Mystère de la Chèvrerie": acts, cutscenes, boards and progression rules.
(function () {
  const A = CH.config.acts;
  const has = (s, id) => !!s.clues[id];
  const ded = (s, id) => !!s.deds[id];

  const CUTS = {
    clothTheft: [{ l: "cut.clothTheft" }, { flag: "clothStolen" }, { act: A.night }, { go: "cuisine" }, { l: "cut.intro" }, { egg: "activeDirectory" }],
    act2: [{ l: "cut.act2" }, { act: A.leads }],
    clockReveal: [{ l: "cut.clockReveal" }],
    pregnancyReveal: [
      { l: "cut.preg.start" },
      { if: (s) => has(s, "tricot"), then: [{ l: "cut.preg.tricot" }] },
      { if: (s) => has(s, "dispute"), then: [{ l: "cut.preg.dispute" }] },
      { if: (s) => has(s, "trousse"), then: [{ l: "cut.preg.trousse" }] },
      { if: (s) => has(s, "certificat"), then: [{ l: "cut.preg.certificat" }] },
      { if: (s) => has(s, "luzerne"), then: [{ l: "cut.preg.luzerne" }] },
      { if: (s) => has(s, "eau"), then: [{ l: "cut.preg.eau" }] },
      { l: "cut.preg.end" },
    ],
    rev1: [{ go: "cuisine" }, { l: "board.b1.ok" }, { l: "cut.rev1" }, { act: A.crossCheck }],
    finale: [
      { l: "board.b2.ok" },
      { go: "chemin" },
      { l: "cut.finale.intro" },
      { bg: "loge" },
      { l: "cut.finale.loge" },
      { l: "cut.finale.confession" },
      { l: "cut.finale.thibault" },
      { act: A.ending },
      { bg: "concours" },
      { l: "cut.epilogue" },
      { screen: "message" },
      { flag: "finished" },
      { screen: "bilan" },
      { bg: "teaser" },
      { l: "cut.teaser" },
      { screen: "end" },
    ],
  };

  // Rules fire once, in order, after every action.
  const RULES = [
    { id: "r_act2", when: (s) => s.act === A.night && !!s.flags.cloth && has(s, "crochet"), steps: [{ cut: "act2" }] },
  ];

  // Answer index for each blank, in locale option order.
  const BOARDS = {
    b1: {
      ready: (s) => s.act === A.leads && ded(s, "evasion") && ded(s, "gaston") && has(s, "photos"),
      answers: { q1: 1, q2: 0, q3: 0, q4: 2, q5: 1, q6: 2 },
      done: "board1Done",
      cut: "rev1",
    },
    b2: {
      ready: (s) => s.act === A.crossCheck && CH.deductions.forBoard("b2").every((d) => ded(s, d)),
      answers: { q1: 2, q2: 0, q3: 2, q4: 1, q5: 2, q6: 1, q7: 2 },
      done: "board2Done",
      cut: "finale",
      suspect: "q3",
    },
  };

  // Biscotte holds the glasses cloth until Veronique trades it for a petal.
  function biscotteOptions(s) {
    if (s.act < A.night || s.flags.cloth) return [];
    const trade = [{ if: (st) => !!st.items.petale, then: [{ l: "bis.cloth.trade" }, { use: "petale" }, { flag: "cloth" }, { egg: "chiffon" }], else: [{ l: "bis.cloth.nopetal" }] }];
    return [{ id: "cloth", label: "ui.bis_cloth", steps: trade }];
  }

  // Outdoors, the glasses fog up until the cloth is recovered.
  function proBlocked(s) {
    const sc = CH.scenes.get(s.scene);
    return sc && sc.outdoor && !s.flags.cloth ? "ui.fogged" : null;
  }

  // The three contract fragments merge into one card.
  function onClue(s, id) {
    const parts = CH.clues.CONTRACT_PARTS;
    return parts.includes(id) && parts.every((p) => has(s, p)) ? ["contrat"] : [];
  }

  // Small details noticed along the way, counted in the final summary.
  const EGGS = [
    "plaidChambre", "sandales", "bouquet", "ambre", "bottesFleurs", "polaireTricot", "agnetha", "puits",
    "boue", "statique", "fiches", "ipv6", "yoga", "radio", "radioRetour", "chat", "boule", "jeudiDisco",
    "sandalesBoue", "plaidOdeur", "statiquePlaid", "carotte", "wifi", "verresVeto", "lunettesGerard",
    "activeDirectory", "chiffon", "lego",
  ];

  CH.story = {
    FIRST_SCENE: "chambre",
    CUTS,
    RULES,
    BOARDS,
    EGGS,
    // No Cluedo grid in this story: hypotheses never open.
    HYPOTHESIS_ACT: Infinity,
    FINAL_BOARD_FLAG: "board2Done",
    PET_LINES: 4,
    biscotteOptions,
    proBlocked,
    onClue,
    objectiveKey(s, board) {
      if (s.act === A.night && s.flags.cloth) return "obj.1b";
      if (board) return `obj.${s.act}b`;
      return `obj.${s.act}`;
    },
  };
})();

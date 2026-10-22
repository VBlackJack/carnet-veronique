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

// Biscotte's hint goals. Acts I and II follow one path; act III has four parallel
// branches (when, how, alibis, Morosini) and Biscotte steers towards the least
// advanced one. Level 1 text: hint.<id>.
(function () {
  const { has } = CH.S;
  const AC = CH.config.acts;
  const ded = (s, id) => !!s.deds[id];
  const hs = (scene, id, pro = false) => ({ kind: "hs", scene, id, pro });
  const chr = (id, pro = false) => ({ kind: "char", id, pro });
  const cards = (a, b) => ({ kind: "ded", a, b });
  const clue = (id, target) => ({ id, done: (s) => has(s, id), target: () => target });
  const deduce = (id, a, b) => ({ id, done: (s) => ded(s, id), target: () => cards(a, b) });

  const LINEAR = [
    // Act I
    { ...clue("c_morosini_soir", chr("morosini")), act: AC.night },
    { ...clue("c_barbaro_soir", chr("barbaro")), act: AC.night },
    { ...clue("c_ottavio_soir", chr("ottavio")), act: AC.night },
    { ...clue("c_nane_soir", chr("nane")), act: AC.night },
    { ...clue("c_elena_soir", chr("elena")), act: AC.night },
    { ...clue("c_lowell_soir", chr("lowell")), act: AC.night },
    { ...clue("c_boule", hs("fornace", "boule")), act: AC.night },
    { ...deduce("h_coup", "c_mort", "c_boule"), act: AC.night },
    { ...clue("o_corps", hs("fornace", "trace", true)), act: AC.night },
    { ...clue("o_crochets", hs("fornace", "crochets")), act: AC.night },
    { ...clue("o_vin", hs("fornace", "bouteille")), act: AC.night },
    // Act II
    { ...clue("c_tensions", hs("echantillons", "calice", true)), act: AC.leads },
    { ...clue("c_ancienne", hs("echantillons", "vitrine", true)), act: AC.leads },
    { ...deduce("d_neuf", "c_tensions", "c_ancienne"), act: AC.leads },
    { ...clue("c_registre", chr("barbaro")), act: AC.leads },
    { ...deduce("d_barbaro", "c_registre", "c_calice"), act: AC.leads },
    { id: "board1", act: AC.leads, done: (s) => !!s.flags.board1Done, target: () => ({ kind: "board", id: "b1" }) },
  ];

  const BRANCHES = {
    when: [
      clue("c_verre_fendu", hs("fornace", "marbre", true)),
      clue("c_braises", chr("nane")),
      deduce("d_avant_minuit", "c_verre_fendu", "c_braises"),
      clue("c_lowell_escalier", chr("benjamin")),
      clue("c_lowell_aveu", chr("lowell")),
      deduce("d_lowell_vivant", "c_lowell_aveu", "c_lowell_escalier"),
    ],
    how: [
      clue("c_bulle", hs("fornace", "boule", true)),
      deduce("d_maquillee", "c_bulle", "c_boule"),
      clue("c_empreinte", hs("fornace", "sol", true)),
      deduce("d_chute", "c_empreinte", "c_mort"),
    ],
    alibis: [
      clue("c_contrat", chr("ottavio", true)),
      clue("c_ottavio_aveu", chr("ottavio")),
      // Needs the time window first: the branch waits for branch A.
      { ...deduce("d_salon", "c_ottavio_aveu", "c_barbaro_soir"), ready: (s) => ded(s, "d_avant_minuit") },
      clue("c_atelier_froid", hs("atelier", "palette", true)),
      clue("c_cloches", chr("bernard")),
      clue("c_parapluie", chr("elena")),
      deduce("d_amoureux", "c_parapluie", "c_cloches"),
    ],
    morosini: [
      clue("c_carnet_julien", chr("benjamin")),
      deduce("d_mensonge", "c_morosini_soir", "c_carnet_julien"),
      clue("c_vitrine_vide", hs("musee", "vitrine", true)),
      { id: "eclat", done: (s) => has(s, "c_eclat"), target: () => ({ kind: "biscotte" }) },
      deduce("d_eclat", "c_eclat", "c_vitrine_vide"),
      clue("c_certificats", chr("barbaro", true)),
      deduce("d_certificats", "c_certificats", "c_registre"),
    ],
  };

  const FINAL = [{ id: "board2", done: (s) => !!s.flags.board2Done, target: () => ({ kind: "board", id: "b2" }) }];

  // Least advanced branch first, so every thread moves forward. A branch whose next
  // step waits on another branch steps aside until it can move.
  function current(s) {
    const linear = LINEAR.find((g) => g.act <= s.act && !g.done(s));
    if (linear || s.act < AC.crossCheck) return linear || null;
    const open = Object.values(BRANCHES)
      .map((list) => ({ list, next: list.find((g) => !g.done(s)), ratio: list.filter((g) => g.done(s)).length / list.length }))
      .filter((b) => b.next)
      .sort((a, b) => a.ratio - b.ratio);
    const movable = open.filter((b) => !b.next.ready || b.next.ready(s));
    if (open.length) return (movable[0] || open[0]).next;
    return FINAL.find((g) => !g.done(s)) || null;
  }

  CH.goals = {
    LIST: [...LINEAR, ...Object.values(BRANCHES).flat(), ...FINAL],
    current,
  };
})();

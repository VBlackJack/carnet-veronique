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
// branches (the monocle, when, alibis, Rupert) plus the searches, and Biscotte steers
// towards the least advanced one. Level 1 text: hint.<id>.
(function () {
  const { has } = CH.S;
  const AC = CH.config.acts;
  const ded = (s, id) => !!s.deds[id];
  const hs = (scene, id, pro = false) => ({ kind: "hs", scene, id, pro });
  const chr = (id, pro = false, card = null) => ({ kind: "char", id, pro, card });
  const cards = (a, b) => ({ kind: "ded", a, b });
  const clue = (id, target) => ({ id, done: (s) => has(s, id), target: () => target });
  const deduce = (id, a, b) => ({ id, done: (s) => ded(s, id), target: () => cards(a, b) });
  const after = (goal, ready) => ({ ...goal, ready });
  const searched = (s) => ded(s, "d_neutre");

  const LINEAR = [
    // Act I
    { ...clue("c_rupert_soir", chr("rupert")), act: AC.night },
    { ...clue("c_colonel_soir", chr("colonel")), act: AC.night },
    { ...clue("c_lady_soir", chr("lady")), act: AC.night },
    { ...clue("c_penhallow_soir", chr("penhallow")), act: AC.night },
    { ...clue("c_zamboni_soir", chr("zamboni")), act: AC.night },
    { ...clue("c_ada_soir", chr("ada")), act: AC.night },
    { ...clue("c_etui_vide", chr("colonel", false, "c_monocle")), act: AC.night },
    { ...deduce("h_colonel", "c_monocle", "c_etui_vide"), act: AC.night },
    // Act II
    { ...clue("c_cataracte", chr("colonel", true)), act: AC.leads },
    { ...deduce("d_fumoir", "c_cataracte", "c_colonel_soir"), act: AC.leads },
    { ...clue("o_times", hs("fumoir", "journal")), act: AC.leads },
    { ...clue("c_journal_julien", chr("julien")), act: AC.leads },
    { ...clue("c_penhallow_buffet", chr("benjamin")), act: AC.leads },
    { ...clue("c_malle", hs("coulisses", "malle", true)), act: AC.leads },
    { id: "board1", act: AC.leads, done: (s) => !!s.flags.board1Done, target: () => ({ kind: "board", id: "b1" }) },
  ];

  const BRANCHES = {
    monocle: [
      clue("c_neutre", hs("boutique", "croix", true)),
      clue("c_registre_colonel", hs("boutique", "registre")),
      deduce("d_neutre", "c_neutre", "c_registre_colonel"),
      clue("c_registre_smith", hs("boutique", "registre", true)),
      deduce("d_theatre", "c_registre_smith", "c_neutre"),
    ],
    when: [
      clue("c_lecture", chr("bernard")),
      deduce("d_couloir", "c_lecture", "c_journal_julien"),
      clue("c_cape", chr("lady", false, "c_lecture")),
      deduce("d_lady", "c_cape", "c_lady_soir"),
    ],
    alibis: [
      deduce("d_penhallow", "c_penhallow_buffet", "c_penhallow_soir"),
      clue("c_cahier", hs("vestiaire", "telephone")),
      clue("c_ada_tel", chr("ada", false, "c_cahier")),
      deduce("d_ada", "c_ada_tel", "c_ada_soir"),
      after(deduce("d_colonel", "c_lecture", "c_cataracte"), (s) => has(s, "c_lecture")),
      after(deduce("d_zamboni", "c_favoris", "c_zamboni_soir"), (s) => has(s, "c_favoris")),
    ],
    rupert: [
      { id: "cerise", done: (s) => has(s, "c_favoris"), target: () => ({ kind: "biscotte" }) },
      clue("c_pincenez", chr("rupert", true)),
      clue("c_pincenez_poche", hs("vestiaire", "capes", true)),
      deduce("d_myope", "c_pincenez", "c_pincenez_poche"),
      deduce("d_travers", "c_journal_julien", "c_rupert_soir"),
    ],
    searches: [
      after(clue("o_fouille_malle", hs("coulisses", "malle")), searched),
      after(clue("o_fouille_colonel", chr("colonel")), searched),
      after(clue("o_fouille_vestiaire", hs("vestiaire", "capes")), searched),
      after(clue("o_fouille_tronc", hs("salle", "tronc")), searched),
      after(clue("o_fouille_piano", hs("salle", "piano")), searched),
    ],
  };

  const FINAL = [
    { id: "case52", done: (s) => has(s, "c_saphir"), target: () => chr("benjamin") },
    { id: "board2", done: (s) => !!s.flags.board2Done, target: () => ({ kind: "board", id: "b2" }) },
  ];

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

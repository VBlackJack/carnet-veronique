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

// Biscotte's hint goals. Acts I and II follow one path; act III has three parallel
// branches (when, the hand, Max) plus the searches, and Biscotte steers towards the
// least advanced one. Level 1 text: hint.<id>.
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
    { ...clue("c_stella_soir", chr("stella")), act: AC.night },
    { ...clue("c_max_soir", chr("max")), act: AC.night },
    { ...clue("c_coco_soir", chr("coco")), act: AC.night },
    { ...clue("c_ray_soir", chr("ray")), act: AC.night },
    { ...clue("c_henri_soir", chr("henri")), act: AC.night },
    { ...clue("c_sylvie_soir", chr("sylvie")), act: AC.night },
    { ...deduce("h_noir", "c_vol", "c_noir"), act: AC.night },
    // Act II
    { ...clue("c_top47", hs("regie", "conduite")), act: AC.leads },
    { ...clue("c_noir_volontaire", chr("julien")), act: AC.leads },
    { ...deduce("d_volontaire", "c_noir_volontaire", "c_top47"), act: AC.leads },
    { ...clue("c_flashbar", chr("sylvie", true)), act: AC.leads },
    { ...deduce("d_photo_cachee", "c_flashbar", "c_sylvie_soir"), act: AC.leads },
    { ...clue("c_bague_ray", chr("ray", true)), act: AC.leads },
    { ...deduce("d_main", "c_main", "c_bague_ray"), act: AC.leads },
    { id: "board1", act: AC.leads, done: (s) => !!s.flags.board1Done, target: () => ({ kind: "board", id: "b1" }) },
    // Act III opening: the bucket, then the turn
    { id: "seau", act: AC.crossCheck, done: (s) => has(s, "c_copie"), target: () => ({ kind: "biscotte" }) },
    { ...deduce("d_strass", "c_copie", "c_polas"), act: AC.crossCheck },
  ];

  const BRANCHES = {
    when: [
      clue("c_ecrin_ouvert", chr("stella")),
      clue("c_paillettes_violettes", hs("loge", "porte_couloir", true)),
      clue("c_coco_loge", chr("coco")),
      deduce("d_creneau", "c_ecrin_ouvert", "c_coco_loge"),
      clue("c_henri_tel", chr("lulu")),
      deduce("d_henri", "c_henri_tel", "c_henri_soir"),
      clue("c_henri_croise", chr("henri")),
      deduce("d_coco", "c_coco_loge", "c_henri_croise"),
      deduce("d_sylvie", "c_polas", "c_sylvie_soir"),
      deduce("d_ray", "c_polas", "c_bague_ray"),
    ],
    hand: [
      clue("c_reflet", chr("sylvie")),
      deduce("d_inversion", "c_reflet", "c_bague_ray"),
      clue("c_chevaliere", chr("max", true)),
      deduce("d_main_gauche", "c_chevaliere", "c_reflet"),
    ],
    max: [
      clue("c_registre_md", hs("regie", "registre")),
      deduce("d_commande", "c_registre_md", "c_top47"),
      clue("c_lumiere_bureau", chr("benjamin")),
      deduce("d_bureau", "c_lumiere_bureau", "c_max_soir"),
      clue("c_stella_aveu", chr("stella")),
      deduce("d_stella", "c_stella_aveu", "c_registre_md"),
    ],
    search: [
      clue("o_fouille_bar", hs("bar", "comptoir")),
      clue("o_fouille_loge", hs("loge", "penderie")),
      clue("o_fouille_cabine", hs("cabine", "bacs")),
      clue("o_fouille_regie", hs("regie", "console")),
      clue("o_boule", hs("piste", "boule", true)),
    ],
  };

  const FINAL = [
    { id: "bureau", done: (s) => !!s.flags.bureauOuvert, target: () => chr("max") },
    clue("c_lettre_banque", hs("bureau", "corbeille")),
    deduce("d_mobile", "c_lettre_banque", "c_copie"),
    clue("o_cadre", hs("bureau", "disque", true)),
    clue("c_arcenciel", hs("bureau", "disque")),
    { id: "board2", done: (s) => !!s.flags.board2Done, target: () => ({ kind: "board", id: "b2" }) },
  ];

  // Least advanced branch first, so every thread moves forward.
  function current(s) {
    const linear = LINEAR.find((g) => g.act <= s.act && !g.done(s));
    if (linear || s.act < AC.crossCheck) return linear || null;
    const open = Object.values(BRANCHES)
      .map((list) => ({ list, ratio: list.filter((g) => g.done(s)).length / list.length }))
      .filter((b) => b.ratio < 1)
      .sort((a, b) => a.ratio - b.ratio);
    if (open.length) return open[0].list.find((g) => !g.done(s));
    return FINAL.find((g) => !g.done(s)) || null;
  }

  CH.goals = {
    LIST: [...LINEAR, ...Object.values(BRANCHES).flat(), ...FINAL],
    current,
  };
})();

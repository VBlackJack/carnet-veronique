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

// Grid of "Le Monocle": who took the sapphire, when, and where it is hidden.
(function () {
  const AC = CH.config.acts;
  const act2 = (s) => s.act >= AC.leads;
  const act3 = (s) => s.act >= AC.crossCheck;
  const searched = (s) => !!s.deds.d_neutre;
  const found = "c_saphir";

  CH.cluedoData = {
    CARDS: {
      who: ["rupert", "colonel", "lady", "penhallow", "zamboni", "ada"],
      when: ["t2130", "t2140", "t2145", "t2150", "t2155"],
      where: ["boite", "malle", "poche", "vestiaire", "tronc", "piano"],
    },
    // Solution: rupert, t2145, boite. Nothing crosses them out.
    EXCLUDERS: {
      "who.colonel": ["d_colonel"],
      "who.penhallow": ["d_penhallow"],
      "who.ada": ["d_ada"],
      "who.zamboni": ["d_zamboni"],
      "who.lady": ["d_lady"],
      "when.t2130": ["d_penhallow"],
      "when.t2140": ["d_lady"],
      "when.t2150": ["d_couloir"],
      "when.t2155": ["d_couloir"],
      "where.malle": ["o_fouille_malle", found],
      "where.poche": ["o_fouille_colonel", found],
      "where.vestiaire": ["o_fouille_vestiaire", found],
      "where.tronc": ["o_fouille_tronc", found],
      "where.piano": ["o_fouille_piano", found],
    },
    REFUTE: {
      julien: [{ card: "when.t2150", clue: "c_journal_julien", when: act2 }],
      bernard: [{ card: "when.t2155", clue: "c_lecture", when: act3 }],
      francoise: [{ card: "when.t2155", clue: "c_lecture", when: act3 }],
      benjamin: [{ card: "when.t2130", clue: "c_penhallow_buffet", when: act2 }],
      zamboni: [{ card: "where.malle", clue: "o_fouille_malle", when: searched }],
      colonel: [{ card: "where.poche", clue: "o_fouille_colonel", when: searched }],
      ada: [{ card: "where.vestiaire", clue: "o_fouille_vestiaire", when: searched }],
      lady: [{ card: "where.tronc", clue: "o_fouille_tronc", when: searched }],
    },
  };
})();

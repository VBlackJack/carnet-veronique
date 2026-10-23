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

// Clue catalogue of "Le Monocle". Cards (c_*) can be paired; observations (o_*) are
// short notes that still cross out grid cells. Text: clue.<id>.title / .text.
(function () {
  const LIST = [
    // Act I
    "c_vol", "c_monocle", "c_rupert_soir", "c_colonel_soir", "c_lady_soir", "c_penhallow_soir", "c_zamboni_soir", "c_ada_soir",
    "c_etui_vide", "o_etoile", "o_troupe",
    // Act II
    "c_cataracte", "c_journal_julien", "c_penhallow_buffet", "c_malle", "o_times",
    // Act III
    "c_neutre", "c_registre_colonel", "c_registre_smith", "c_lecture", "c_cape", "c_cahier", "c_ada_tel", "c_favoris", "c_pincenez",
    "c_pincenez_poche", "c_saphir", "o_fouille_malle", "o_fouille_colonel", "o_fouille_vestiaire", "o_fouille_tronc", "o_fouille_piano",
  ];

  CH.clues = {
    LIST,
    visual: () => "",
    hidden: () => false,
    isObs: (id) => id.startsWith("o_"),
  };
})();

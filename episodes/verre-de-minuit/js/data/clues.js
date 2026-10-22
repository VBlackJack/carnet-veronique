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

// Clue catalogue of "Le Verre de minuit". Cards (c_*) can be paired; observations
// (o_*) are short notes that still cross out grid cells. Text: clue.<id>.title / .text.
(function () {
  const LIST = [
    // Act I
    "c_mort", "c_calice", "c_morosini_soir", "c_barbaro_soir", "c_ottavio_soir", "c_nane_soir", "c_elena_soir", "c_lowell_soir",
    "c_boule", "o_corps", "o_crochets", "o_vin",
    // Act II
    "c_tensions", "c_ancienne", "c_registre", "c_atelier_froid", "c_contrat", "c_lowell_escalier", "c_chanson", "c_cloches",
    "o_bulles", "o_emaux", "o_timbre", "o_point",
    // Act III
    "c_carnet_julien", "c_verre_fendu", "c_braises", "c_lowell_aveu", "c_bulle", "c_empreinte", "c_ottavio_aveu", "c_parapluie",
    "c_certificats", "c_vitrine_vide", "c_eclat", "o_traces",
  ];

  CH.clues = {
    LIST,
    visual: () => "",
    hidden: () => false,
    isObs: (id) => id.startsWith("o_"),
  };
})();

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

// Characters of "Le Verre de minuit": where they stand, what they talk about, how
// they react to cards. Topic labels: chr.<id>.t.<topic>. Dialogue: dlg.<id>.<topic>.
(function () {
  const { L, has } = CH.S;
  const AC = CH.config.acts;
  const ded = (s, id) => !!s.deds[id];
  const act3 = (s) => s.act >= AC.crossCheck;
  const H = () => CH.art.HEIGHTS;

  const T = (id, topic, extra = [], when) => ({ id: topic, when, steps: [L(`dlg.${id}.${topic}`), ...extra] });
  const SHOW = (id, clue, extra = []) => [L(`dlg.${id}.show.${clue}`), ...extra];
  const at = (id, scene, x, y = 875) => ({ scene, x, y, h: H()[id] });
  const byAct = (id, table) => (s) => {
    const p = table[s.act];
    return p ? at(id, ...p) : null;
  };
  // A shown card that only makes someone talk in act III.
  const LATER = (before, after) => (s) => (act3(s) ? after : before);

  const CHARS = {
    morosini: {
      presence: byAct("morosini", { [AC.night]: ["maison", 1300], [AC.leads]: ["fornace", 640], [AC.crossCheck]: ["musee", 560] }),
      topics: [
        T("morosini", "soiree", [{ clue: "c_morosini_soir" }]),
        T("morosini", "cristallo", [{ egg: "minecraft" }]),
        T("morosini", "boule", [{ clue: "o_point" }], (s) => s.act >= AC.leads),
      ],
      pro: [L("dlg.morosini.pro")],
      show: {
        c_mort: SHOW("morosini", "c_mort"),
        c_calice: SHOW("morosini", "c_calice"),
        c_tensions: SHOW("morosini", "c_tensions"),
        c_carnet_julien: SHOW("morosini", "c_carnet_julien"),
        c_chanson: SHOW("morosini", "c_chanson"),
        c_vitrine_vide: SHOW("morosini", "c_vitrine_vide"),
        c_certificats: SHOW("morosini", "c_certificats"),
        c_eclat: SHOW("morosini", "c_eclat"),
      },
    },
    barbaro: {
      presence: byAct("barbaro", { [AC.night]: ["maison", 250], [AC.leads]: ["echantillons", 420], [AC.crossCheck]: ["maison", 250] }),
      topics: [
        T("barbaro", "soiree", [{ clue: "c_barbaro_soir" }]),
        T("barbaro", "venise"),
        T("barbaro", "ventes", [{ clue: "c_registre" }], (s) => s.act >= AC.leads),
      ],
      pro: (s) => (act3(s) ? [L("dlg.barbaro.pro2"), { clue: "c_certificats" }] : [L("dlg.barbaro.pro"), { egg: "statique" }]),
      show: {
        c_calice: SHOW("barbaro", "c_calice"),
        c_tensions: SHOW("barbaro", "c_tensions"),
        c_registre: SHOW("barbaro", "c_registre"),
        c_certificats: SHOW("barbaro", "c_certificats"),
        c_ottavio_aveu: SHOW("barbaro", "c_ottavio_aveu"),
      },
    },
    ottavio: {
      presence: byAct("ottavio", { [AC.night]: ["cour", 520], [AC.leads]: ["maison", 700], [AC.crossCheck]: ["cour", 520] }),
      topics: [
        T("ottavio", "soiree", [{ clue: "c_ottavio_soir" }]),
        T("ottavio", "verrerie"),
      ],
      pro: (s) => (s.act >= AC.leads ? [L("dlg.ottavio.pro2"), { clue: "c_contrat" }] : [L("dlg.ottavio.pro")]),
      show: {
        c_contrat: LATER(SHOW("ottavio", "c_contrat"), [L("dlg.ottavio.show.c_contrat_after"), { clue: "c_ottavio_aveu" }]),
        c_ottavio_soir: SHOW("ottavio", "c_ottavio_soir"),
        c_calice: SHOW("ottavio", "c_calice"),
        c_morosini_soir: SHOW("ottavio", "c_morosini_soir"),
      },
    },
    nane: {
      presence: byAct("nane", { [AC.night]: ["fornace", 90], [AC.leads]: ["fornace", 90], [AC.crossCheck]: ["fondamenta", 1180] }),
      topics: [
        T("nane", "soiree", [{ clue: "c_nane_soir" }]),
        T("nane", "maestro"),
        T("nane", "bulles", [{ clue: "o_bulles" }], (s) => s.act >= AC.leads && has(s, "c_tensions")),
        T("nane", "gloria", [{ clue: "c_braises" }], act3),
      ],
      pro: [L("dlg.nane.pro")],
      show: {
        c_mort: SHOW("nane", "c_mort"),
        c_tensions: SHOW("nane", "c_tensions"),
        c_atelier_froid: SHOW("nane", "c_atelier_froid"),
        c_verre_fendu: SHOW("nane", "c_verre_fendu"),
        c_boule: SHOW("nane", "c_boule"),
      },
    },
    elena: {
      presence: byAct("elena", { [AC.night]: ["maison", 1000], [AC.leads]: ["atelier", 520], [AC.crossCheck]: ["fondamenta", 1040] }),
      topics: [
        T("elena", "soiree", [{ clue: "c_elena_soir" }]),
        T("elena", "emaux"),
        T("elena", "nonno"),
      ],
      pro: [L("dlg.elena.pro")],
      show: {
        c_atelier_froid: LATER(SHOW("elena", "c_atelier_froid"), [L("dlg.elena.show.c_atelier_froid_after"), { clue: "c_parapluie" }]),
        c_tensions: SHOW("elena", "c_tensions"),
        c_calice: SHOW("elena", "c_calice"),
      },
    },
    lowell: {
      presence: byAct("lowell", { [AC.night]: ["maison", 520], [AC.leads]: ["echantillons", 1080], [AC.crossCheck]: ["maison", 520] }),
      topics: [
        T("lowell", "soiree", [{ clue: "c_lowell_soir" }]),
        T("lowell", "boston"),
      ],
      pro: [L("dlg.lowell.pro")],
      show: {
        c_lowell_escalier: LATER(SHOW("lowell", "c_lowell_escalier"), [L("dlg.lowell.aveu"), { clue: "c_lowell_aveu" }]),
        c_ottavio_aveu: LATER(SHOW("lowell", "c_ottavio_aveu"), [L("dlg.lowell.aveu"), { clue: "c_lowell_aveu" }]),
        c_calice: SHOW("lowell", "c_calice"),
        c_tensions: SHOW("lowell", "c_tensions"),
      },
    },
    julien: {
      presence: byAct("julien", { [AC.night]: ["fornace", 1440], [AC.leads]: ["fornace", 1440], [AC.crossCheck]: ["fornace", 1440] }),
      topics: [
        T("julien", "soiree"),
        T("julien", "horloge", [{ clue: "o_timbre" }], (s) => s.act >= AC.leads),
        T("julien", "carnet", [{ clue: "c_carnet_julien" }], act3),
      ],
      pro: [L("dlg.julien.pro"), { egg: "pinces" }],
      show: {
        c_morosini_soir: (s) => (has(s, "c_carnet_julien") ? SHOW("julien", "c_morosini_soir") : [L("dlg.julien.show.c_morosini_soir_early")]),
        c_cloches: SHOW("julien", "c_cloches"),
        c_carnet_julien: SHOW("julien", "c_carnet_julien"),
      },
    },
    benjamin: {
      presence: byAct("benjamin", { [AC.night]: ["fornace", 1560], [AC.leads]: ["fornace", 1560], [AC.crossCheck]: ["fornace", 1560] }),
      topics: [
        T("benjamin", "soiree"),
        T("benjamin", "escalier", [{ clue: "c_lowell_escalier" }], (s) => s.act >= AC.leads),
        { id: "sonnerie", when: (s) => act3(s) && !has(s, "c_carnet_julien"), steps: [{ cut: "sonnerie" }] },
      ],
      show: {
        c_morosini_soir: SHOW("benjamin", "c_morosini_soir"),
        c_lowell_soir: SHOW("benjamin", "c_lowell_soir"),
        c_boule: SHOW("benjamin", "c_boule"),
      },
    },
    bernard: {
      presence: byAct("bernard", { [AC.night]: ["cour", 150], [AC.leads]: ["fondamenta", 160], [AC.crossCheck]: ["fondamenta", 160] }),
      topics: [
        T("bernard", "soiree"),
        T("bernard", "guitare", [{ egg: "tremolo" }]),
        T("bernard", "chanson", [{ clue: "c_chanson" }], (s) => s.act >= AC.leads),
        T("bernard", "minuit", [{ clue: "c_cloches" }], (s) => s.act >= AC.leads),
      ],
      show: {
        c_morosini_soir: SHOW("bernard", "c_morosini_soir"),
        c_carnet_julien: SHOW("bernard", "c_carnet_julien"),
      },
    },
    francoise: {
      presence: byAct("francoise", { [AC.night]: ["cour", 290], [AC.leads]: ["fondamenta", 330], [AC.crossCheck]: ["fondamenta", 330] }),
      topics: [
        T("francoise", "soiree", [{ egg: "rayonfrais" }]),
        T("francoise", "lunettes"),
        T("francoise", "minuit", [{ clue: "c_cloches" }], (s) => s.act >= AC.leads),
      ],
      show: {
        c_morosini_soir: SHOW("francoise", "c_morosini_soir"),
        c_chanson: SHOW("francoise", "c_chanson"),
      },
    },
  };

  CH.chars = {
    all: CHARS,
    get: (id) => CHARS[id],
    inScene: (s, sceneId) =>
      Object.keys(CHARS)
        .map((id) => ({ id, p: CHARS[id].presence(s) }))
        .filter((c) => c.p && c.p.scene === sceneId),
  };
})();

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

// Characters of "Le Monocle": where they stand, what they talk about, how they react
// to cards. Topic labels: chr.<id>.t.<topic>. Dialogue: dlg.<id>.<topic>.
(function () {
  const { L, has } = CH.S;
  const AC = CH.config.acts;
  const ded = (s, id) => !!s.deds[id];
  const act2 = (s) => s.act >= AC.leads;
  const act3 = (s) => s.act >= AC.crossCheck;
  const searched = (s) => ded(s, "d_neutre");
  // The spare slide box can be opened once the thief's route is known.
  const boxReady = (s) => ded(s, "d_couloir") && ded(s, "d_travers") && !has(s, "c_saphir");
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
    rupert: {
      presence: byAct("rupert", { [AC.night]: ["salle", 520], [AC.leads]: ["salle", 520], [AC.crossCheck]: ["salle", 520] }),
      topics: [
        T("rupert", "soiree", [{ clue: "c_rupert_soir" }]),
        T("rupert", "tante"),
      ],
      pro: (s) => (act3(s) ? [L("dlg.rupert.pro2"), { clue: "c_pincenez" }] : [L("dlg.rupert.pro")]),
      show: {
        c_monocle: SHOW("rupert", "c_monocle"),
        c_journal_julien: SHOW("rupert", "c_journal_julien"),
        c_pincenez: SHOW("rupert", "c_pincenez"),
        c_pincenez_poche: SHOW("rupert", "c_pincenez_poche"),
        c_favoris: SHOW("rupert", "c_favoris"),
        c_registre_smith: SHOW("rupert", "c_registre_smith"),
      },
    },
    colonel: {
      presence: byAct("colonel", { [AC.night]: ["salon", 480], [AC.leads]: ["fumoir", 560], [AC.crossCheck]: ["coulisses", 1450] }),
      topics: [
        T("colonel", "soiree", [{ clue: "c_colonel_soir" }]),
        T("colonel", "indes"),
        T("colonel", "poches", [{ clue: "o_fouille_colonel" }], searched),
      ],
      pro: (s) => (act2(s) ? [L("dlg.colonel.pro2"), { clue: "c_cataracte" }] : [L("dlg.colonel.pro")]),
      show: {
        c_monocle: SHOW("colonel", "c_monocle", [{ clue: "c_etui_vide" }]),
        c_cataracte: SHOW("colonel", "c_cataracte"),
        c_neutre: SHOW("colonel", "c_neutre"),
        c_lecture: SHOW("colonel", "c_lecture"),
      },
    },
    lady: {
      presence: byAct("lady", { [AC.night]: ["salle", 640], [AC.leads]: ["salon", 480], [AC.crossCheck]: ["salle", 640] }),
      topics: [
        T("lady", "soiree", [{ clue: "c_lady_soir" }]),
        T("lady", "rupert", [{ clue: "o_troupe" }]),
        T("lady", "hopital"),
        T("lady", "buffet", [{ clue: "c_penhallow_buffet" }], act2),
      ],
      pro: [L("dlg.lady.pro"), { egg: "statique" }],
      show: {
        c_lecture: LATER(SHOW("lady", "c_lecture"), [L("dlg.lady.show.c_lecture_after"), { clue: "c_cape" }]),
        c_monocle: SHOW("lady", "c_monocle"),
        c_favoris: SHOW("lady", "c_favoris"),
      },
    },
    penhallow: {
      presence: byAct("penhallow", { [AC.night]: ["salon", 1260], [AC.leads]: ["salle", 170], [AC.crossCheck]: ["salon", 1260] }),
      topics: [
        T("penhallow", "soiree", [{ clue: "c_penhallow_soir" }]),
        T("penhallow", "assurance"),
      ],
      pro: [L("dlg.penhallow.pro")],
      show: {
        c_penhallow_buffet: SHOW("penhallow", "c_penhallow_buffet"),
        c_vol: SHOW("penhallow", "c_vol"),
        c_monocle: SHOW("penhallow", "c_monocle"),
      },
    },
    zamboni: {
      presence: byAct("zamboni", { [AC.night]: ["salle", 760], [AC.leads]: ["coulisses", 360], [AC.crossCheck]: ["coulisses", 360] }),
      topics: [
        T("zamboni", "soiree", [{ clue: "c_zamboni_soir" }]),
        T("zamboni", "magie"),
      ],
      pro: [L("dlg.zamboni.pro")],
      show: {
        c_malle: SHOW("zamboni", "c_malle"),
        c_favoris: SHOW("zamboni", "c_favoris"),
        c_monocle: SHOW("zamboni", "c_monocle"),
      },
    },
    ada: {
      presence: byAct("ada", { [AC.night]: ["salle", 880], [AC.leads]: ["vestiaire", 1300], [AC.crossCheck]: ["vestiaire", 1300] }),
      topics: [
        T("ada", "soiree", [{ clue: "c_ada_soir" }]),
        T("ada", "journal"),
      ],
      pro: [L("dlg.ada.pro")],
      show: {
        c_ada_soir: SHOW("ada", "c_ada_soir"),
        c_cahier: [L("dlg.ada.show.c_cahier"), { clue: "c_ada_tel" }],
        c_monocle: SHOW("ada", "c_monocle"),
        c_journal_julien: SHOW("ada", "c_journal_julien"),
      },
    },
    julien: {
      presence: byAct("julien", { [AC.night]: ["lanterne", 880], [AC.leads]: ["lanterne", 880], [AC.crossCheck]: ["lanterne", 880] }),
      topics: [
        T("julien", "soiree", [{ egg: "carte" }]),
        T("julien", "journal", [{ clue: "c_journal_julien" }], act2),
        { id: "boites", when: boxReady, steps: [{ cut: "case52" }] },
      ],
      pro: [L("dlg.julien.pro"), { egg: "pinces" }],
      show: {
        c_rupert_soir: SHOW("julien", "c_rupert_soir"),
        c_journal_julien: SHOW("julien", "c_journal_julien"),
        c_vol: SHOW("julien", "c_vol"),
      },
    },
    benjamin: {
      presence: byAct("benjamin", { [AC.night]: ["lanterne", 1000], [AC.leads]: ["lanterne", 1000], [AC.crossCheck]: ["lanterne", 1000] }),
      topics: [
        T("benjamin", "soiree"),
        T("benjamin", "buffet", [{ clue: "c_penhallow_buffet" }], act2),
        { id: "boite", when: boxReady, steps: [{ cut: "case52" }] },
      ],
      show: {
        c_rupert_soir: SHOW("benjamin", "c_rupert_soir"),
        c_penhallow_soir: SHOW("benjamin", "c_penhallow_soir"),
        c_monocle: SHOW("benjamin", "c_monocle"),
      },
    },
    bernard: {
      presence: byAct("bernard", { [AC.night]: ["salle", 1040], [AC.leads]: ["coulisses", 900], [AC.crossCheck]: ["coulisses", 900] }),
      topics: [
        T("bernard", "soiree"),
        T("bernard", "guitare", [{ egg: "tremolo" }]),
        T("bernard", "colonel", [{ clue: "c_lecture" }], act3),
      ],
      show: {
        c_colonel_soir: SHOW("bernard", "c_colonel_soir"),
        c_journal_julien: SHOW("bernard", "c_journal_julien"),
      },
    },
    francoise: {
      presence: byAct("francoise", { [AC.night]: ["salle", 1530], [AC.leads]: ["coulisses", 1020], [AC.crossCheck]: ["coulisses", 1020] }),
      topics: [
        T("francoise", "soiree", [{ egg: "rayonfrais" }]),
        T("francoise", "lunettes"),
        T("francoise", "colonel", [{ clue: "c_lecture" }], act3),
      ],
      show: {
        c_colonel_soir: SHOW("francoise", "c_colonel_soir"),
        c_cataracte: SHOW("francoise", "c_cataracte"),
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

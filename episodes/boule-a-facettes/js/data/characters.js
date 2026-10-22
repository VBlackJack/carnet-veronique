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

// Characters of "La Boule à facettes": where they stand, what they talk about, how
// they react to cards. Topic labels: chr.<id>.t.<topic>. Dialogue: dlg.<id>.<topic>.
(function () {
  const { L, has } = CH.S;
  const AC = CH.config.acts;
  const ded = (s, id) => !!s.deds[id];
  const H = () => CH.art.HEIGHTS;

  const T = (id, topic, extra = [], when) => ({ id: topic, when, steps: [L(`dlg.${id}.${topic}`), ...extra] });
  const SHOW = (id, clue, extra = []) => [L(`dlg.${id}.show.${clue}`), ...extra];
  const at = (id, scene, x, y = 875) => ({ scene, x, y, h: H()[id] });
  const byAct = (id, table) => (s) => {
    const p = table[s.act];
    return p ? at(id, ...p) : null;
  };
  // Shown card whose reaction changes once the stage theft is known to be staged.
  const AFTER_STRASS = (before, after) => (s) => (ded(s, "d_strass") ? after : before);

  const CHARS = {
    stella: {
      presence: byAct("stella", { [AC.night]: ["piste", 380], [AC.leads]: ["loge", 320], [AC.crossCheck]: ["loge", 320] }),
      topics: [
        T("stella", "soiree", [{ clue: "c_stella_soir" }]),
        T("stella", "max"),
        T("stella", "costume", [{ clue: "c_ecrin_ouvert" }], (s) => ded(s, "d_strass")),
        T("stella", "top47", [{ clue: "c_stella_aveu" }], (s) => s.act >= AC.crossCheck && has(s, "c_top47")),
      ],
      pro: [L("dlg.stella.pro")],
      show: {
        c_vol: SHOW("stella", "c_vol"),
        c_top47: (s) => (s.act >= AC.crossCheck ? [L("dlg.stella.top47"), { clue: "c_stella_aveu" }] : SHOW("stella", "c_top47")),
        c_ecrin_ouvert: SHOW("stella", "c_ecrin_ouvert"),
        c_porte_comm: SHOW("stella", "c_porte_comm"),
        c_copie: SHOW("stella", "c_copie"),
        c_main: SHOW("stella", "c_main"),
      },
    },
    max: {
      presence: byAct("max", { [AC.night]: ["bar", 980], [AC.leads]: ["piste", 1160], [AC.crossCheck]: ["piste", 1160] }),
      topics: [
        T("max", "soiree", [{ clue: "c_max_soir" }]),
        T("max", "mirage"),
        T("max", "ray", [], (s) => !!s.flags.board1Done),
        T("max", "bureau", [{ cut: "bureau" }], (s) => ["d_creneau", "d_main_gauche", "d_bureau"].every((d) => ded(s, d)) && !s.flags.bureauOuvert),
      ],
      pro: [L("dlg.max.pro"), { clue: "c_chevaliere" }],
      show: {
        c_max_soir: SHOW("max", "c_max_soir"),
        c_top47: SHOW("max", "c_top47"),
        c_main: SHOW("max", "c_main"),
        c_copie: SHOW("max", "c_copie"),
        c_lumiere_bureau: SHOW("max", "c_lumiere_bureau"),
        c_registre_md: SHOW("max", "c_registre_md"),
        c_porte_comm: SHOW("max", "c_porte_comm"),
      },
    },
    coco: {
      presence: byAct("coco", { [AC.night]: ["scene", 560], [AC.leads]: ["piste", 400], [AC.crossCheck]: ["loge", 920] }),
      topics: [
        T("coco", "soiree", [{ clue: "c_coco_soir" }]),
        T("coco", "stella"),
        T("coco", "vegas", [], (s) => has(s, "c_coco_loge")),
      ],
      pro: [L("dlg.coco.pro")],
      show: {
        c_paillettes_violettes: AFTER_STRASS(SHOW("coco", "c_paillettes_violettes"), [L("dlg.coco.show.c_paillettes_violettes_after"), { clue: "c_coco_loge" }]),
        c_ecrin_ouvert: SHOW("coco", "c_ecrin_ouvert"),
        c_copie: SHOW("coco", "c_copie"),
      },
    },
    ray: {
      presence: byAct("ray", { [AC.night]: ["scene", 1420, 590], [AC.leads]: ["cabine", 760], [AC.crossCheck]: ["cabine", 760] }),
      topics: [
        T("ray", "soiree", [{ clue: "c_ray_soir" }]),
        T("ray", "musique", [{ egg: "boneym" }]),
        T("ray", "yeux", [], (s) => ded(s, "d_ray")),
      ],
      pro: [L("dlg.ray.pro"), { clue: "c_bague_ray" }],
      show: {
        c_ray_soir: SHOW("ray", "c_ray_soir", [{ clue: "o_ray_couleurs" }]),
        c_main: SHOW("ray", "c_main"),
        c_bague_ray: SHOW("ray", "c_bague_ray"),
        c_polas: SHOW("ray", "c_polas"),
      },
    },
    henri: {
      presence: byAct("henri", { [AC.night]: ["piste", 600], [AC.leads]: ["bar", 1110], [AC.crossCheck]: ["bar", 1110] }),
      topics: [
        T("henri", "soiree", [{ clue: "c_henri_soir" }]),
        T("henri", "collier"),
        T("henri", "femme", [], (s) => has(s, "c_henri_tel")),
      ],
      pro: [L("dlg.henri.pro")],
      show: {
        c_henri_tel: SHOW("henri", "c_henri_tel"),
        c_coco_loge: (s) => [L(has(s, "c_henri_tel") ? "dlg.henri.show.c_coco_loge" : "dlg.henri.show.c_coco_loge_early"), { clue: "c_henri_croise" }],
        c_copie: SHOW("henri", "c_copie"),
        c_ecrin_ouvert: SHOW("henri", "c_ecrin_ouvert"),
      },
    },
    sylvie: {
      presence: byAct("sylvie", { [AC.night]: ["bar", 1250], [AC.leads]: ["scene", 960], [AC.crossCheck]: ["piste", 420] }),
      topics: [
        T("sylvie", "soiree", [{ clue: "c_sylvie_soir" }]),
        T("sylvie", "journal"),
        T("sylvie", "photo", [{ clue: "c_reflet" }], (s) => ded(s, "d_strass") && has(s, "c_main")),
      ],
      pro: [L("dlg.sylvie.pro"), { clue: "c_flashbar" }],
      show: {
        c_sylvie_soir: SHOW("sylvie", "c_sylvie_soir"),
        c_main: SHOW("sylvie", "c_main"),
        c_polas: SHOW("sylvie", "c_polas"),
      },
    },
    julien: {
      presence: byAct("julien", { [AC.night]: ["regie", 640], [AC.leads]: ["regie", 640], [AC.crossCheck]: ["regie", 640] }),
      topics: [
        T("julien", "soiree", [{ egg: "colonnes" }]),
        T("julien", "noir", [{ clue: "c_noir_volontaire" }, { egg: "papa" }], (s) => s.act >= AC.leads),
      ],
      pro: [L("dlg.julien.pro")],
      show: {
        c_top47: SHOW("julien", "c_top47"),
        c_noir: SHOW("julien", "c_noir"),
        c_registre_md: SHOW("julien", "c_registre_md"),
      },
    },
    benjamin: {
      presence: byAct("benjamin", { [AC.night]: ["regie", 1240], [AC.leads]: ["regie", 1240], [AC.crossCheck]: ["piste", 820] }),
      topics: [
        T("benjamin", "soiree"),
        T("benjamin", "noir", [{ clue: "o_70s" }], (s) => s.act >= AC.leads),
        T("benjamin", "regie", [{ clue: "c_lumiere_bureau" }], (s) => s.act >= AC.crossCheck),
      ],
      show: {
        c_main: SHOW("benjamin", "c_main"),
        c_max_soir: SHOW("benjamin", "c_max_soir"),
        c_flashbar: SHOW("benjamin", "c_flashbar"),
      },
    },
    lulu: {
      presence: byAct("lulu", { [AC.night]: ["bar", 230], [AC.leads]: ["bar", 230], [AC.crossCheck]: ["bar", 230] }),
      topics: [
        T("lulu", "soiree", [{ clue: "c_henri_tel" }], (s) => s.act >= AC.leads),
        T("lulu", "mirage"),
        T("lulu", "passages", [{ clue: "o_bar_passages" }], (s) => has(s, "c_copie")),
      ],
      show: {
        c_henri_soir: SHOW("lulu", "c_henri_soir"),
        c_copie: SHOW("lulu", "c_copie"),
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

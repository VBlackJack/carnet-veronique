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

// Clue catalogue of "La Boule à facettes". Cards (c_*) can be paired; observations
// (o_*) are short notes that still cross out grid cells. Text: clue.<id>.title / .text.
(function () {
  const A = CH.art;

  // Sylvie's Polaroids, drawn small. Each frame: time and what it shows.
  function polaroid(kind, time, i) {
    A.srand(800 + i);
    const { sh, ink, soft, rect, blob } = A;
    let s = `<rect width="160" height="180" fill="#f4f0e2"/><rect x="10" y="10" width="140" height="130" fill="#2a1e2c"/>`;
    const neck = (stone, prong) => {
      // Close-up of the necklace: chain, centre stone in its mount, the top prong.
      let n = `<rect x="10" y="10" width="140" height="130" fill="#e8b99c"/>` + sh(soft([[30, 10], [130, 10], [120, 60], [40, 60]], 1), "#f4f1ea", { sw: 1.5 });
      n += A.ink(A.curve([[30, 70], [80, 100], [130, 70]], 0.3), 2.5, { stroke: "#c9cdd1" });
      n += `<circle cx="80" cy="${102 + stone}" r="13" fill="#bfe0f2" stroke="#3b2f2a" stroke-width="2"/>`;
      n += `<circle cx="80" cy="102" r="17" fill="none" stroke="#c9cdd1" stroke-width="3"/>`;
      n += `<rect x="77" y="80" width="6" height="${prong}" rx="2" fill="#c9cdd1" stroke="#3b2f2a" stroke-width="1"/>`;
      return n;
    };
    if (kind === "real") s += neck(0, 8);
    if (kind === "fake") s += neck(4, 12).replace('width="6"', 'width="10"');
    if (kind === "room") {
      s += `<rect x="10" y="100" width="140" height="40" fill="#e85a9a" opacity=".5"/><circle cx="80" cy="40" r="14" fill="#c9cdd1"/>`;
      // Ray in his booth, far in the background
      s += sh(rect(110, 70, 34, 30, 0.4), "#2a2a30", { sw: 1 }) + sh(blob(127, 62, 6, 7, 0.1, 6), "#e2b08e", { sw: 1 }) + sh(rect(118, 68, 18, 14, 0.3), "#6e2433", { sw: 0 });
    }
    if (kind === "mirror") {
      // Seen in the mirror wall: Stella's white collar, a hand with a red ring on the image's right.
      s += `<rect x="10" y="10" width="140" height="130" fill="#9fb0bb"/>`;
      s += sh(soft([[50, 30], [100, 30], [104, 140], [46, 140]], 1), "#f4f1ea", { sw: 1.5 });
      s += sh(soft([[118, 60], [96, 70], [92, 82], [118, 86]], 0.6), "#d9a07e", { sw: 1.5 }) + `<circle cx="104" cy="74" r="4" fill="#b0182f" stroke="#3b2f2a" stroke-width="1"/>`;
      // Once Veronique has spotted it: the facet joint and the sign read backwards.
      if (CH.game.state && CH.game.state.clues.c_reflet) {
        s += `<line x1="72" y1="10" x2="72" y2="140" stroke="#4a5560" stroke-width="2.5"/>`;
        s += `<text transform="translate(80 26) scale(-1 1)" font-size="12" text-anchor="middle" font-family="Alegreya, serif" font-weight="700" fill="#e85a9a">${CH.i18n.escapeHtml(CH.t("art.sign"))}</text>`;
      }
    }
    s += `<text x="150" y="168" font-size="16" text-anchor="end" font-family="Caveat, cursive" fill="#3b2f2a">${time}</text>`;
    return `<div class="snap"><svg viewBox="0 0 160 180">${s}</svg></div>`;
  }

  const VISUALS = {
    c_polas: () => `<div class="snaps polas">${polaroid("real", "22h30", 1)}${polaroid("room", "23h19", 2)}${polaroid("fake", "23h35", 3)}</div>`,
    c_main: () => `<div class="snaps polas">${polaroid("mirror", "23h41", 4)}</div>`,
  };

  const LIST = [
    // Act I
    "c_vol", "c_noir", "c_stella_soir", "c_max_soir", "c_coco_soir", "c_ray_soir", "c_henri_soir", "c_sylvie_soir", "c_autour",
    "o_miroir_mur",
    // Act II
    "c_top47", "c_noir_volontaire", "c_flashbar", "c_polas", "c_main", "c_bague_ray", "c_ecrin_ouvert", "c_paillettes_violettes",
    "c_porte_comm", "c_henri_tel", "o_70s", "o_ray_couleurs", "o_ecrin",
    // Act III
    "c_copie", "c_coco_loge", "c_henri_croise", "c_reflet", "c_chevaliere", "c_registre_md", "c_lumiere_bureau", "c_stella_aveu",
    "c_lettre_banque", "c_arcenciel", "o_bar_passages", "o_boule", "o_fouille_bar", "o_fouille_cabine", "o_fouille_regie",
    "o_fouille_loge", "o_cadre",
  ];

  CH.clues = {
    LIST,
    visual: (id) => (VISUALS[id] ? VISUALS[id]() : ""),
    hidden: () => false,
    isObs: (id) => id.startsWith("o_"),
  };
})();

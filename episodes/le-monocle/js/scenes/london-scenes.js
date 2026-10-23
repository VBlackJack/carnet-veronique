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

// The seven places of the evening: the great hall, the blue drawing room, the lantern
// corridor, the cloakroom, the smoking room, the wings, and the optician's shop across
// Baker Street.
(function () {
  const A = CH.art, P = A.P;
  const { sh, ink, soft, rect, blob, curve, line, g, poly, text } = A;
  const K = CH.london, M = K.L;
  const { L, has } = CH.S;
  const AC = CH.config.acts;
  const act2 = (s) => s.act >= AC.leads;
  const act3 = (s) => s.act >= AC.crossCheck;
  const searched = (s) => !!s.deds.d_neutre;
  const boxReady = (s) => !!s.deds.d_couloir && !!s.deds.d_travers && !has(s, "c_saphir");
  // A search: once the monocle is known to be a stage prop, everyone lets Veronique look.
  const SEARCH = (scene, id, clue, extra = []) => (s) => (searched(s) ? [L(`hs.${scene}.${id}.fouille`), { clue }, ...extra] : [L(`hs.${scene}.${id}.look`)]);

  // ------------------------------------------------------------ Great hall
  CH.scenes.register({
    id: "salle",
    nav: true,
    draw() {
      A.srand(7101);
      let back = `<rect width="1600" height="900" fill="${M.night}"/>`;
      back += K.wall(0, 640, "url(#p-damask)");
      back += K.stage(420, 120, 760, 400);
      back += K.ceylonSlide(800, 320, 1.4);
      back += K.piano(1240, 640) + K.collectionBox(380, 650, CH.t("art.hospital"));
      // The buffet on the left: a white cloth, a cake, glasses
      back += sh(rect(20, 520, 300, 30, 1), M.cream) + sh(soft([[20, 550], [320, 550], [330, 640], [10, 640]], 1), M.cream);
      back += sh(soft([[120, 520], [200, 520], [190, 470], [130, 470]], 1), "#e8c8a0") + sh(rect(150, 452, 20, 20, 0.4), "#c0303a", { sw: 1.4 });
      for (let i = 0; i < 4; i++) back += ink(line(240 + i * 18, 520, 240 + i * 18, 494, 0.2), 3, { stroke: "#e6f2f4" });
      back += `<rect x="-10" y="640" width="1620" height="270" fill="url(#p-carpet-red)"/>` + ink(line(-10, 640, 1610, 640, 1), 3);
      for (let r = 0; r < 2; r++) for (let x = 440 + r * 30; x < 1180; x += 90) back += K.chair(x, 760 + r * 90, 1 + r * 0.15);
      for (const x of [380, 1220]) back += K.gasLamp(x, 260);
      let anim = K.gasGlow(380, 260) + K.gasGlow(1220, 260) + `<ellipse cx="800" cy="320" rx="320" ry="190" fill="url(#g-limelight)" opacity=".25" class="flicker"/>`;
      return { back, front: "", anim, top: "" };
    },
    hotspots: [
      { id: "ecran", x: 460, y: 140, w: 680, h: 360, look: [L("hs.salle.ecran.look")] },
      { id: "piano", x: 1230, y: 430, w: 220, h: 210, look: SEARCH("salle", "piano", "o_fouille_piano", [{ egg: "abba" }]) },
      { id: "tronc", x: 340, y: 500, w: 80, h: 150, look: SEARCH("salle", "tronc", "o_fouille_tronc") },
      { id: "buffet", x: 20, y: 440, w: 310, h: 200, look: [L("hs.salle.buffet.look")] },
      { id: "chaises", x: 440, y: 650, w: 740, h: 220, look: [L("hs.salle.chaises.look")] },
    ],
  });

  // ------------------------------------------------------------ Blue drawing room
  CH.scenes.register({
    id: "salon",
    nav: true,
    draw() {
      A.srand(7201);
      let back = `<rect width="1600" height="900" fill="${M.night}"/>`;
      back += K.wall(0, 660, "url(#p-damask-blue)");
      back += K.fogWindow(1080, 140, 300, 340);
      // A portrait of the late sister, a sofa, Lady Ashcombe's shawl left on it
      back += sh(rect(160, 150, 220, 280, 1.5), M.brass) + sh(rect(176, 166, 188, 248, 1), "#3a3040");
      back += sh(blob(270, 260, 50, 62, 0.06, 10), "#e8c0a4") + sh(soft([[200, 414], [340, 414], [320, 330], [220, 330]], 1), "#4a4a6a");
      back += sh(soft([[214, 250], [222, 200], [270, 184], [318, 200], [326, 250], [312, 226], [270, 214], [228, 226]], 1), "#5a3b2a") + sh(blob(270, 186, 26, 18, 0.08, 9), "#5a3b2a");
      back += `<circle cx="252" cy="252" r="4" fill="${P.ink}"/><circle cx="288" cy="252" r="4" fill="${P.ink}"/>` + ink(curve([[256, 286], [270, 292], [284, 286]], 0.2), 2.4, { stroke: "#6b3b33" });
      back += sh(blob(296, 372, 16, 12, 0.08, 8), "#e8c0a4") + `<circle cx="300" cy="364" r="7" fill="#2a4aa0" stroke="${P.ink}" stroke-width="1.6"/>`;
      for (let a = 0; a < 6; a++) back += `<line x1="300" y1="364" x2="${(300 + Math.cos(a * Math.PI / 3) * 6).toFixed(1)}" y2="${(364 + Math.sin(a * Math.PI / 3) * 6).toFixed(1)}" stroke="#ffffff" stroke-width="1.2"/>`;
      back += sh(soft([[120, 640], [460, 640], [470, 560], [110, 560]], 1.5), M.velvetBlue) + sh(rect(110, 520, 360, 50, 1), "#1a2650");
      back += sh(soft([[300, 560], [420, 556], [430, 600], [310, 610]], 2), "#d9cfe0", { extra: 'filter="url(#f-fuzz)"' });
      back += `<rect x="-10" y="660" width="1620" height="250" fill="url(#p-parquet)"/>` + ink(line(-10, 660, 1610, 660, 1), 3);
      back += K.gasLamp(560, 300) + K.gasLamp(860, 300);
      back += g(K.emptyCushion(0, 0, { monocle: true }), 'transform="translate(760,470) scale(1.5)"');
      let anim = K.gasGlow(560, 300) + K.gasGlow(860, 300) + `<circle cx="700" cy="480" r="140" fill="url(#g-gas)" opacity=".5"/>`;
      return { back, front: "", anim, top: "" };
    },
    hotspots: [
      { id: "coussin", x: 650, y: 410, w: 220, h: 120, look: [L("hs.salon.coussin.look")], pro: { steps: [L("hs.salon.coussin.pro"), { clue: "o_etoile" }] } },
      { id: "cloche", x: 890, y: 590, w: 140, h: 180, look: [L("hs.salon.cloche.look")] },
      { id: "portrait", x: 160, y: 150, w: 220, h: 280, look: [L("hs.salon.portrait.look")] },
      { id: "fenetre", x: 1070, y: 130, w: 320, h: 360, look: [L("hs.salon.fenetre.look")] },
      { id: "chale", x: 300, y: 550, w: 140, h: 60, look: [L("hs.salon.chale.look"), { egg: "statique" }] },
    ],
  });

  // ------------------------------------------------------------ Lantern corridor
  CH.scenes.register({
    id: "lanterne",
    nav: true,
    draw(s) {
      A.srand(7301);
      let back = `<rect width="1600" height="900" fill="#2a2420"/>`;
      back += `<rect x="-10" y="0" width="1620" height="660" fill="#4a3a2e"/>`;
      // The back of the screen, glowing, on the right
      back += sh(rect(1180, 60, 440, 560, 1.5), "#efe0b8", { op: 0.9 }) + ink(line(1180, 60, 1180, 620, 0.5), 6, { stroke: "#3a2418" });
      back += K.magicLantern(700, 420);
      back += A.namedCat("tobiasse", 690, 172, 0.9);
      back += sh(rect(220, 520, 300, 22, 1), M.oak) + ink(line(240, 542, 236, 660, 0.3), 8, { stroke: M.mahogany }) + ink(line(500, 542, 504, 660, 0.3), 8, { stroke: M.mahogany });
      back += K.slideBox(250, 430, { label: CH.t("art.box"), gap: true });
      back += K.radiator(1080, 650);
      // A ginger tuft behind the radiator, until Biscotte finds it
      if (!(s && s.clues && s.clues.c_favoris)) back += sh(soft([[1236, 640], [1252, 618], [1262, 640], [1270, 624], [1276, 646]], 0.6), "#c8642a", { sw: 1.4 });
      back += `<rect x="-10" y="650" width="1620" height="260" fill="url(#p-parquet)"/>` + ink(line(-10, 650, 1610, 650, 1), 3);
      back += K.gasLamp(120, 300);
      let anim = K.lanternBeam(700, 420) + K.gasGlow(120, 300, 100) + `<rect x="1180" y="60" width="440" height="560" fill="#fff4d0" opacity=".25" class="flicker"/>`;
      return { back, front: "", anim, top: "" };
    },
    hotspots: [
      { id: "lanterne", x: 600, y: 180, w: 300, h: 260, look: [L("hs.lanterne.lanterne.look")] },
      { id: "trepied", x: 620, y: 440, w: 160, h: 220, look: [L("hs.lanterne.trepied.look")] },
      { id: "boite", x: 240, y: 400, w: 260, h: 130, look: (s) => (boxReady(s) ? [{ cut: "case52" }] : [L(has(s, "c_saphir") ? "hs.lanterne.boite.look2" : "hs.lanterne.boite.look")]) },
      { id: "radiateur", x: 1070, y: 530, w: 220, h: 130, look: [L("hs.lanterne.radiateur.look")] },
      { id: "tobiasse", x: 630, y: 120, w: 130, h: 60, look: [L("hs.lanterne.tobiasse.look"), { egg: "tobiasse" }] },
      { id: "toile", x: 1190, y: 60, w: 410, h: 560, look: [L("hs.lanterne.toile.look")] },
    ],
  });

  // ------------------------------------------------------------ Cloakroom and lobby
  CH.scenes.register({
    id: "vestiaire",
    nav: true,
    draw() {
      A.srand(7401);
      let back = `<rect width="1600" height="900" fill="${M.night}"/>`;
      back += K.wall(0, 660, "url(#p-damask)");
      back += sh(rect(100, 120, 760, 30, 1), M.mahogany) + sh(rect(100, 400, 760, 40, 1), M.mahoganyLight);
      back += K.coatRack(120, 160, ["#2a2a30", "#4a3a2e", { color: "#1f1b1a", lining: "#e8dcc4", glint: true }, "#3a3040", "#5a4a3a", "#2a3a2e", { color: "#1f1b1a", lining: "#b0302a" }, "#3a2a2a"]);
      back += K.bicycle(980, 660);
      back += K.telephone(1340, 260);
      back += sh(rect(1300, 120, 280, 60, 1), "#2a2026") + text(1440, 160, CH.t("art.lobby"), { size: 24, fill: "#e8c84a", weight: 700, font: "Alegreya, serif" });
      back += `<rect x="-10" y="660" width="1620" height="250" fill="url(#p-parquet)"/>` + ink(line(-10, 660, 1610, 660, 1), 3);
      back += K.gasLamp(940, 260);
      let anim = K.gasGlow(940, 260);
      return { back, front: "", anim, top: "" };
    },
    hotspots: [
      { id: "capes", x: 120, y: 160, w: 720, h: 250, look: SEARCH("vestiaire", "capes", "o_fouille_vestiaire"), pro: { steps: (s) => (act3(s) ? [L("hs.vestiaire.capes.pro2"), { clue: "c_pincenez_poche" }] : [L("hs.vestiaire.capes.pro")]) } },
      { id: "bicyclette", x: 920, y: 500, w: 290, h: 170, look: [L("hs.vestiaire.bicyclette.look"), { egg: "bicyclette" }] },
      { id: "telephone", x: 1320, y: 250, w: 120, h: 140, look: (s) => (act3(s) ? [L("hs.vestiaire.telephone.look2"), { clue: "c_cahier" }] : [L("hs.vestiaire.telephone.look")]) },
    ],
  });

  // ------------------------------------------------------------ Smoking room
  CH.scenes.register({
    id: "fumoir",
    nav: true,
    draw() {
      A.srand(7501);
      let back = `<rect width="1600" height="900" fill="${M.night}"/>`;
      back += K.wall(0, 660, "url(#p-damask)", "#3a2418");
      back += `<rect x="-10" y="0" width="1620" height="660" fill="#3a2a1a" opacity=".35"/>`;
      back += K.fogWindow(620, 140, 260, 300);
      back += K.armchair(330, 680) + K.armchair(1240, 680, true);
      back += sh(rect(720, 560, 200, 20, 0.8), M.mahogany) + ink(line(820, 580, 820, 670, 0.3), 8, { stroke: M.mahogany });
      back += sh(rect(740, 540, 120, 18, 0.4), M.cream, { sw: 1.6 }) + text(800, 554, CH.t("art.times"), { size: 12, font: "Alegreya, serif", weight: 700 });
      back += `<rect x="-10" y="660" width="1620" height="250" fill="url(#p-carpet-red)"/>` + ink(line(-10, 660, 1610, 660, 1), 3);
      back += K.gasLamp(200, 300);
      let anim = K.gasGlow(200, 300) + A.steam(380, 470, 3) + `<rect x="-10" y="80" width="1620" height="200" fill="#d8c8a8" opacity=".12" class="mist"/>`;
      return { back, front: "", anim, top: "" };
    },
    hotspots: [
      { id: "journal", x: 730, y: 520, w: 140, h: 50, look: [L("hs.fumoir.journal.look"), { clue: "o_times" }] },
      { id: "fauteuils", x: 250, y: 500, w: 170, h: 190, look: [L("hs.fumoir.fauteuils.look")] },
      { id: "fenetre", x: 610, y: 130, w: 280, h: 320, look: [L("hs.fumoir.fenetre.look")] },
    ],
  });

  // ------------------------------------------------------------ Wings
  CH.scenes.register({
    id: "coulisses",
    nav: true,
    draw() {
      A.srand(7601);
      let back = `<rect width="1600" height="900" fill="#241e1a"/>`;
      back += `<rect x="-10" y="0" width="1620" height="660" fill="#3a2e24"/>`;
      back += K.flies(80, 1560);
      back += sh(rect(-10, 60, 300, 600, 1.5), "#efe0b8", { op: 0.8 });
      back += K.magicTrunk(520, 650);
      back += sh(rect(1100, 540, 220, 110, 1), "#7a3a2a") + sh(rect(1130, 450, 170, 90, 1), "#2f5a4a");
      back += sh(rect(1150, 575, 120, 36, 0.4), M.cream, { sw: 1.4 }) + text(1210, 600, CH.t("art.trunk.costumes"), { size: 18, font: "Alegreya, serif", weight: 700 });
      back += sh(rect(1165, 478, 100, 30, 0.4), M.cream, { sw: 1.4 }) + text(1215, 499, CH.t("art.trunk.noses"), { size: 14, font: "Alegreya, serif", weight: 700 });
      back += `<rect x="-10" y="650" width="1620" height="260" fill="url(#p-parquet)"/>` + ink(line(-10, 650, 1610, 650, 1), 3);
      back += K.gasLamp(900, 280);
      let anim = K.gasGlow(900, 280) + `<rect x="-10" y="60" width="300" height="600" fill="#fff4d0" opacity=".2" class="flicker"/>`;
      return { back, front: "", anim, top: "" };
    },
    hotspots: [
      { id: "malle", x: 510, y: 420, w: 260, h: 240, look: SEARCH("coulisses", "malle", "o_fouille_malle"), pro: { steps: [L("hs.coulisses.malle.pro"), { clue: "c_malle" }] } },
      { id: "malles", x: 1100, y: 440, w: 220, h: 220, look: [L("hs.coulisses.malles.look"), { egg: "boites" }] },
      { id: "cintres", x: 300, y: 0, w: 900, h: 200, look: [L("hs.coulisses.cintres.look")] },
    ],
  });

  // ------------------------------------------------------------ Optician's shop
  CH.scenes.register({
    id: "boutique",
    nav: true,
    draw() {
      A.srand(7701);
      let back = `<rect width="1600" height="900" fill="${M.night}"/>`;
      back += K.wall(0, 660, "#e8dcc4", "#5a3a22");
      // Shop window on Baker Street in the fog, a passer-by from behind
      back += sh(rect(900, 100, 600, 420, 1.5), M.mahogany) + `<rect x="920" y="120" width="560" height="380" fill="${M.fog}"/>`;
      back += K.streetLamp(1380, 500) + K.passerBy(1080, 500);
      back += `<rect x="920" y="120" width="560" height="380" fill="url(#g-yellowfog)" opacity=".7"/>`;
      back += text(1200, 170, CH.t("art.shop"), { size: 34, fill: "#c9a24a", weight: 700, font: "Alegreya, serif" }).replace("<text ", '<text transform="translate(2400 0) scale(-1 1)" ');
      // The counter: register, trial-lens case, a pair of spectacles
      back += sh(rect(80, 520, 760, 40, 1), M.mahoganyLight) + sh(rect(100, 560, 720, 100, 1), M.mahogany);
      back += sh(rect(140, 470, 220, 50, 0.8), "#4a2a1a") + sh(rect(150, 476, 200, 38, 0.4), M.cream, { sw: 1.4 }) + ink(line(250, 476, 250, 514, 0.2), 2);
      back += K.trialCase(470, 410);
      // The test cross on the wall, to neutralise a lens
      back += sh(rect(320, 160, 200, 200, 0.8), "#f6f1e6", { sw: 2.5 }) + ink(line(420, 180, 420, 340, 0.1), 5) + ink(line(340, 260, 500, 260, 0.1), 5);
      // Spectacles on a stand
      back += sh(rect(110, 220, 140, 14, 0.6), M.mahogany);
      for (let i = 0; i < 3; i++) back += `<circle cx="${130 + i * 44}" cy="${206}" r="9" fill="#e6f2f4" fill-opacity=".5" stroke="${["#c9a24a", "#2a2a2a", "#7a4a2a"][i]}" stroke-width="2.4"/><circle cx="${150 + i * 44}" cy="${206}" r="9" fill="#e6f2f4" fill-opacity=".5" stroke="${["#c9a24a", "#2a2a2a", "#7a4a2a"][i]}" stroke-width="2.4"/>`;
      back += `<rect x="-10" y="660" width="1620" height="250" fill="url(#p-parquet)"/>` + ink(line(-10, 660, 1610, 660, 1), 3);
      back += K.gasLamp(700, 300);
      let anim = K.gasGlow(700, 300) + `<circle cx="1380" cy="170" r="110" fill="url(#g-gas)" class="flicker"/>` + K.fogBands(2, 200, 420).replace(/x="-300"/g, 'x="920"').replace(/width="2200"/g, 'width="560"');
      return { back, front: "", anim, top: "" };
    },
    hotspots: [
      { id: "croix", x: 320, y: 160, w: 200, h: 200, look: [L("hs.boutique.croix.look")], pro: { steps: [L("hs.boutique.croix.pro"), { clue: "c_neutre" }] } },
      { id: "registre", x: 130, y: 460, w: 240, h: 70, look: [L("hs.boutique.registre.look"), { clue: "c_registre_colonel" }], pro: { steps: [L("hs.boutique.registre.pro"), { clue: "c_registre_smith" }] } },
      { id: "verres", x: 460, y: 400, w: 260, h: 130, look: [L("hs.boutique.verres.look")] },
      { id: "vitrine", x: 920, y: 120, w: 560, h: 380, look: [L("hs.boutique.vitrine.look"), { egg: "passant" }] },
    ],
  });
})();

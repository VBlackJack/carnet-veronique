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

// The seven places of the Zanin glassworks: furnace hall, courtyard, the master's
// dining room, sample room, Elena's enamel workshop, the quay with the shop, and the
// glass museum across the canal.
(function () {
  const A = CH.art, P = A.P;
  const { sh, ink, soft, rect, blob, curve, line, g, poly, text } = A;
  const K = CH.murano, M = K.M;
  const { L, has } = CH.S;
  const AC = CH.config.acts;
  const act3 = (s) => s.act >= AC.crossCheck;
  // A professional look that only finds something once act III has opened.
  const PRO3 = (scene, id, clue) => ({ steps: (s) => (act3(s) ? [L(`hs.${scene}.${id}.pro2`), { clue }] : [L(`hs.${scene}.${id}.pro`)]) });

  // A painted flower on an enamelled vase: gerbera (petals) or sunflower (dark heart).
  function paintedFlower(x, y, kind, k = 1) {
    let s = "";
    const petals = kind === "tournesol" ? "#f2c03a" : "#e8705a";
    for (let i = 0; i < 10; i++) {
      const a = (i * 36 * Math.PI) / 180;
      s += `<ellipse cx="${(x + Math.cos(a) * 9 * k).toFixed(1)}" cy="${(y + Math.sin(a) * 9 * k).toFixed(1)}" rx="${6 * k}" ry="${3 * k}" transform="rotate(${i * 36} ${(x + Math.cos(a) * 9 * k).toFixed(1)} ${(y + Math.sin(a) * 9 * k).toFixed(1)})" fill="${petals}"/>`;
    }
    s += `<circle cx="${x}" cy="${y}" r="${5.5 * k}" fill="${kind === "tournesol" ? "#5a3a20" : "#f2d36b"}"/>`;
    return s;
  }

  function enamelVase(x, y, col, kind, k = 1) {
    return K.goblet(x, y, col, k, "vase") + paintedFlower(x, y - 44 * k, kind, k);
  }

  // ------------------------------------------------------------ Furnace hall
  CH.scenes.register({
    id: "fornace",
    nav: true,
    draw() {
      A.srand(6101);
      let back = `<rect width="1600" height="900" fill="${M.nightDeep}"/>`;
      back += K.brickWall(0, 0, 1600, 660, { soot: true });
      // Wooden roof beams
      for (let x = -40; x < 1600; x += 260) back += sh(rect(x, 0, 40, 90, 1), M.woodDark) ;
      back += sh(rect(-10, 70, 1620, 30, 1), M.woodDark);
      // Floor of beaten earth and old tiles
      back += sh(rect(-10, 640, 1620, 270, 2), "#4a3e36");
      for (let i = 0; i < 6; i++) back += ink(line(-10, 680 + i * 40, 1610, 676 + i * 42, 2), 1.6, { stroke: "#3a302a", op: 0.6 });
      const fur = K.furnace(400, 660, 0.85);
      back += fur.back;
      back += K.toolRack(800, 170);
      back += K.elecClock(1230, 210, { time: [0, 30], jumperOff: true });
      back += K.gloria(720, 660, true);
      back += K.marver(840, 560, 300, { glass: true, cracked: true });
      // The master's bench (scagno) with the water globe and the wine bottle
      back += sh(rect(1190, 590, 260, 26, 1), M.wood) + ink(line(1210, 616, 1206, 700, 0.3), 8, { stroke: M.woodDark }) + ink(line(1430, 616, 1434, 700, 0.3), 8, { stroke: M.woodDark });
      back += K.waterGlobe(1280, 480, { flipped: true });
      back += sh(rect(1410, 520, 22, 70, 0.6), "#2a4a2a", { sw: 2 }) + sh(rect(1414, 500, 14, 22, 0.4), "#2a4a2a", { sw: 1.6 }) + sh(rect(1413, 494, 16, 8, 0.3), "#8a6a4a", { sw: 1.2 });
      // Annealing oven at the back right, Tobiasse asleep on its warm bricks
      back += K.arca(1180, 330, 400);
      back += A.namedCat("tobiasse", 1300, 316, 1.1);
      // Where the master fell, at the corner of the marver: the mark in the dust and
      // his red scarf. He has been carried upstairs to rest.
      back += sh(soft([[1060, 700], [1150, 690], [1210, 712], [1200, 744], [1100, 752], [1040, 734]], 3), "#2e2622", { sw: 0, op: 0.45 });
      back += sh(soft([[1110, 706], [1146, 698], [1170, 712], [1150, 726], [1132, 742], [1118, 728]], 1.2), "#b0302a", { sw: 2.2 });
      back += ink(curve([[1150, 726], [1176, 744], [1196, 740]], 0.6), 6, { stroke: "#b0302a" });
      // Round print in the dust, where the globe rolled
      back += `<ellipse cx="960" cy="770" rx="34" ry="10" fill="none" stroke="#2a221e" stroke-width="3" opacity=".55"/>`;
      let anim = fur.anim;
      anim += K.lightPoint(1190, 630);
      anim += `<circle cx="1370" cy="480" r="90" fill="url(#g-lamp)" class="flicker"/>`;
      anim += A.dust(30, 0, 1600, 200, 700);
      return { back, front: "", anim, top: "" };
    },
    hotspots: [
      { id: "four", x: 150, y: 260, w: 500, h: 400, look: [L("hs.fornace.four.look")] },
      { id: "marbre", x: 840, y: 510, w: 300, h: 90, look: [L("hs.fornace.marbre.look")], pro: PRO3("fornace", "marbre", "c_verre_fendu") },
      { id: "trace", x: 1040, y: 680, w: 180, h: 80, look: [L("hs.fornace.trace.look")], pro: { steps: [L("hs.fornace.trace.pro"), { clue: "o_corps" }] } },
      { id: "sol", x: 880, y: 725, w: 160, h: 90, look: [L("hs.fornace.sol.look")], pro: PRO3("fornace", "sol", "c_empreinte") },
      { id: "boule", x: 1230, y: 430, w: 110, h: 130, look: [L("hs.fornace.boule.look"), { clue: "c_boule" }], pro: PRO3("fornace", "boule", "c_bulle") },
      { id: "crochets", x: 800, y: 160, w: 300, h: 340, look: [L("hs.fornace.crochets.look"), { clue: "o_crochets" }] },
      { id: "gloria", x: 650, y: 510, w: 140, h: 150, look: [L("hs.fornace.gloria.look")] },
      { id: "horloge", x: 1170, y: 120, w: 130, h: 150, look: [L("hs.fornace.horloge.look")] },
      { id: "arca", x: 1180, y: 260, w: 400, h: 240, look: [L("hs.fornace.arca.look"), { egg: "tobiasse" }] },
      { id: "bouteille", x: 1400, y: 490, w: 50, h: 100, look: [L("hs.fornace.bouteille.look"), { clue: "o_vin" }] },
    ],
  });

  // ------------------------------------------------------------ Courtyard
  CH.scenes.register({
    id: "cour",
    nav: true,
    draw() {
      A.srand(6201);
      let back = `<rect width="1600" height="900" fill="url(#g-night)"/>`;
      // Across the canal: a row of houses in the fog, a bell tower
      back += K.campanile(1180, 420, 300, "#3a4250");
      for (let x = 560; x < 1600; x += 180) back += sh(rect(x, 230 + (x % 3) * 20, 170, 220, 1), ["#5a4a48", "#6a5040", "#4a4a50"][(x / 180) % 3 | 0], { sw: 2 }) + K.gothicWindow(x + 50, 280 + (x % 3) * 20, 60, 90, (x / 180) % 2 > 1);
      back += K.canal(440, 520, { lights: [[700, "#ffd78a"], [1040, "#ffd78a"]] });
      back += K.bridge(760, 380, 380);
      // The master's house on the left, plaster over brick
      back += K.brickWall(0, 60, 520, 620, { plaster: M.plaster });
      back += K.gothicWindow(80, 160, 110, 170, true) + K.gothicWindow(300, 160, 110, 170, true);
      // Arched water gate on the right, to the canal
      back += sh(rect(1380, 200, 240, 480, 1.5), "url(#p-bricks)");
      back += sh(soft([[1420, 680], [1420, 380], [1500, 300], [1580, 380], [1580, 680]], 1.5), "#1e2a34", { sw: 3 });
      // Courtyard paving, wet with fog
      back += `<rect x="-10" y="520" width="1620" height="390" fill="url(#p-cobbles)"/>` + sh(rect(-10, 520, 1620, 14, 1), M.stone);
      // Venetian wellhead (vera da pozzo) in the middle
      back += sh(rect(660, 712, 270, 26, 1), M.stoneDark) + sh(rect(640, 734, 310, 18, 1), M.stoneDark);
      back += sh(soft([[700, 714], [692, 610], [898, 610], [890, 714]], 1.5), M.stone, { sw: 3 });
      back += ink(curve([[714, 660], [795, 676], [876, 660]], 0.8), 2.5, { op: 0.4 }) + ink(line(795, 618, 795, 708, 0.4), 2, { op: 0.3 });
      back += sh(rect(676, 590, 238, 24, 1), "#c4bcac", { sw: 3 });
      // Wrought-iron arch with its pulley
      back += ink(line(700, 590, 700, 470, 0.4), 6, { stroke: "#1e1e22" }) + ink(line(890, 590, 890, 470, 0.4), 6, { stroke: "#1e1e22" });
      back += ink(curve([[700, 474], [740, 410], [795, 396], [850, 410], [890, 474]], 0.6), 6, { stroke: "#1e1e22" });
      back += ink(curve([[720, 470], [760, 430], [795, 452], [830, 430], [870, 470]], 0.6), 3, { stroke: "#1e1e22" });
      back += `<circle cx="795" cy="420" r="13" fill="#5a4a3a" stroke="${P.ink}" stroke-width="2.5"/>` + ink(line(795, 433, 795, 560, 0.2), 2, { stroke: "#7a6a4a" }) + sh(rect(782, 556, 26, 30, 0.8), M.wood, { sw: 2 });
      back += K.lantern(560, 260);
      // Wet glints on the stones
      for (let i = 0; i < 26; i++) back += `<ellipse cx="${(A.rnd() * 1600).toFixed(0)}" cy="${(560 + A.rnd() * 320).toFixed(0)}" rx="10" ry="2.5" fill="#ffffff" opacity=".25"/>`;
      // Footprints coming from the bridge
      for (let i = 0; i < 6; i++) back += `<ellipse cx="${1040 - i * 60}" cy="${600 + i * 34 + (i % 2) * 12}" rx="10" ry="5" fill="#2a2620" opacity=".5"/>`;
      let anim = K.lanternGlow(560, 260) + `<circle cx="135" cy="245" r="110" fill="url(#g-warm)" class="flicker"/><circle cx="355" cy="245" r="110" fill="url(#g-warm)" class="flicker flicker-2"/>`;
      anim += K.fogBands(3, 380, 640);
      return { back, front: "", anim, top: "" };
    },
    hotspots: [
      { id: "paves", x: 880, y: 580, w: 220, h: 220, look: [L("hs.cour.paves.look")], pro: PRO3("cour", "paves", "o_traces") },
      { id: "pont", x: 760, y: 360, w: 380, h: 90, look: [L("hs.cour.pont.look")] },
      { id: "puits", x: 660, y: 390, w: 270, h: 350, look: [L("hs.cour.puits.look")] },
      { id: "portail", x: 1420, y: 300, w: 160, h: 380, look: [L("hs.cour.portail.look")] },
    ],
  });

  // ------------------------------------------------------------ Dining room
  CH.scenes.register({
    id: "maison",
    nav: true,
    draw() {
      A.srand(6301);
      let back = `<rect width="1600" height="900" fill="#c9a882"/>`;
      back += sh(rect(-10, 380, 1620, 300, 1), "#a8443a", { op: 0.35 });
      for (let x = 0; x < 1600; x += 200) back += sh(rect(x, 0, 30, 70, 1), M.woodDark);
      back += sh(rect(-10, 60, 1620, 22, 1), M.woodDark);
      back += `<rect x="-10" y="660" width="1620" height="250" fill="url(#p-terrazzo)"/>` + ink(line(-10, 660, 1610, 660, 1), 3);
      // Window on the fog, fireplace, the master's portrait
      back += K.gothicWindow(660, 140, 180, 280, "#7d8a96");
      back += sh(rect(80, 300, 300, 360, 1.5), "#e8dcc4") + sh(rect(130, 420, 200, 240, 1.2), "#2a2220") + sh(rect(60, 290, 340, 30, 1), "#d8ccb4");
      back += sh(blob(230, 640, 60, 18, 0.1, 10), M.fire, { sw: 2 }) + sh(blob(230, 636, 30, 10, 0.1, 8), M.fireCore, { sw: 0 });
      back += sh(rect(1060, 150, 220, 270, 1.5), "#c9a24a") + sh(rect(1076, 166, 188, 238, 1), "#4a3a30");
      back += `<clipPath id="cp-portrait"><rect x="1076" y="166" width="188" height="238"/></clipPath>`;
      back += g(A.character("bortolo", 1170, 620, 430, false, { expr: "smile", walrus: "#4a3a30", hair: "#3a2a22", hairStyle: "short", burns: false }), 'clip-path="url(#cp-portrait)"');
      back += sh(rect(1060, 150, 220, 270, 1.5), "none", { sw: 4 });
      // Long table after dinner: cloth, plates, glasses, the St Martin biscuits, candlesticks
      back += sh(rect(380, 530, 840, 40, 1), "#f3ece0") + sh(soft([[380, 570], [1220, 570], [1230, 650], [370, 650]], 1.5), "#f3ece0");
      back += ink(line(420, 650, 410, 720, 0.4), 10, { stroke: M.woodDark }) + ink(line(1180, 650, 1190, 720, 0.4), 10, { stroke: M.woodDark });
      for (let x = 440; x < 1200; x += 130) back += sh(blob(x, 540, 34, 8, 0.05, 10), "#ffffff", { sw: 2 }) + K.goblet(x + 50, 545, M.glass[(x / 130) % M.glass.length | 0], 0.45);
      back += K.biscuit(620, 540, 0.9) + K.biscuit(900, 538, 0.8) + K.biscuit(1100, 540, 0.85);
      back += K.candle(500, 530) + K.candle(1000, 530);
      back += K.chandelier(800, 170, 1.1);
      // Coat rack by the door
      back += ink(line(1480, 320, 1480, 680, 0.4), 8, { stroke: M.woodDark }) + sh(blob(1480, 684, 40, 8, 0.05, 8), M.woodDark, { sw: 2 });
      [[-1, 330], [1, 330], [-1, 370], [1, 370]].forEach(([k, y]) => (back += ink(curve([[1480, y], [1480 + k * 26, y - 6], [1480 + k * 34, y - 22]], 0.3), 4, { stroke: M.woodDark })));
      let anim = K.candleGlow(500, 530) + K.candleGlow(1000, 530) + `<circle cx="230" cy="620" r="150" fill="url(#g-fire)" class="flicker"/>` + `<circle cx="800" cy="200" r="200" fill="url(#g-warm)" class="flicker flicker-2"/>`;
      return { back, front: "", anim, top: "" };
    },
    hotspots: [
      { id: "table", x: 380, y: 500, w: 840, h: 150, look: [L("hs.maison.table.look")] },
      { id: "biscuits", x: 580, y: 480, w: 100, h: 70, look: [L("hs.maison.biscuits.look"), { egg: "biscuits" }] },
      { id: "portrait", x: 1060, y: 150, w: 220, h: 270, look: [L("hs.maison.portrait.look")] },
      { id: "cheminee", x: 80, y: 300, w: 300, h: 360, look: [L("hs.maison.cheminee.look")] },
      { id: "lustre", x: 680, y: 100, w: 240, h: 140, look: [L("hs.maison.lustre.look")] },
      { id: "portemanteau", x: 1420, y: 310, w: 120, h: 380, look: [L("hs.maison.portemanteau.look")] },
    ],
  });

  // ------------------------------------------------------------ Sample room
  CH.scenes.register({
    id: "echantillons",
    nav: true,
    draw() {
      A.srand(6401);
      let back = `<rect width="1600" height="900" fill="#d6c8ac"/>`;
      back += `<rect x="-10" y="640" width="1620" height="270" fill="url(#p-terrazzo)"/>` + ink(line(-10, 640, 1610, 640, 1), 3);
      // Shelves of samples along the back wall, every colour of Murano
      for (const y of [180, 320, 460]) {
        back += sh(rect(80, y, 1440, 16, 0.8), M.woodDark);
        for (let x = 110; x < 1500; x += 70) back += K.goblet(x, y, M.glass[Math.floor(A.rnd() * M.glass.length)], 0.7, ["goblet", "vase", "chalice"][Math.floor(A.rnd() * 3)]);
      }
      // A hanging lamp over the examination table
      back += ink(line(800, 0, 800, 300, 0.3), 3) + sh(poly([[740, 330], [860, 330], [830, 296], [770, 296]], 1), "#2f4a3a");
      // Examination table: the chalice under its bell jar
      back += sh(rect(560, 560, 480, 30, 1), M.wood) + ink(line(590, 590, 586, 700, 0.4), 10, { stroke: M.woodDark }) + ink(line(1010, 590, 1014, 700, 0.4), 10, { stroke: M.woodDark });
      back += sh(rect(600, 548, 400, 14, 0.6), "#5a1e2a", { sw: 2 });
      back += K.chalice(800, 548, 1.3) + K.bellJar(800, 550, 160, 170);
      // Register on the table, the old sure piece in its own case on the right
      back += sh(rect(900, 532, 90, 18, 0.6), "#7a4a32", { sw: 2 });
      back += K.vitrine(1220, 520, 260, 200, { shelves: 1, velvet: "#5a1e2a" });
      let anim = `<polygon points="770,330 830,330 1100,900 500,900" fill="url(#g-beam)" opacity=".45"/>` + `<circle cx="800" cy="460" r="200" fill="url(#g-lamp)" opacity=".35" class="flicker"/>`;
      return { back, front: "", anim, top: "" };
    },
    hotspots: [
      { id: "calice", x: 710, y: 370, w: 180, h: 190, look: [L("hs.echantillons.calice.look")], pro: { steps: [L("hs.echantillons.calice.pro"), { clue: "c_tensions" }] } },
      { id: "vitrine", x: 1220, y: 520, w: 260, h: 270, look: [L("hs.echantillons.vitrine.look")], pro: { steps: [L("hs.echantillons.vitrine.pro"), { clue: "c_ancienne" }] } },
      { id: "etageres", x: 80, y: 100, w: 500, h: 380, look: [L("hs.echantillons.etageres.look")] },
      { id: "lampe", x: 740, y: 280, w: 120, h: 60, look: [L("hs.echantillons.lampe.look")] },
    ],
  });

  // ------------------------------------------------------------ Elena's workshop
  CH.scenes.register({
    id: "atelier",
    nav: true,
    draw() {
      A.srand(6501);
      let back = `<rect width="1600" height="900" fill="#e2d2b2"/>`;
      back += K.brickWall(0, 0, 1600, 660, { plaster: "#e8dcc0" });
      back += sh(rect(-10, 640, 1620, 270, 2), "#8a6a50") + ink(line(-10, 640, 1610, 640, 1), 3);
      for (let x = 0; x < 1600; x += 140) back += ink(line(x, 640, x - 60, 900, 0.6), 2, { op: 0.35 });
      // Window over the fondamenta, fog outside
      back += K.gothicWindow(620, 120, 220, 300, "#7d8a96");
      // Small cast-iron stove, cold
      back += sh(rect(130, 420, 150, 220, 1.5), "#2e2e32") + ink(line(205, 420, 205, 60, 0.3), 16, { stroke: "#2e2e32" }) + sh(rect(160, 500, 90, 60, 0.8), "#1a1a1e");
      // Shelf of enamelled vases: a gerbera, a sunflower
      back += sh(rect(960, 200, 520, 16, 0.8), M.woodDark);
      back += enamelVase(1020, 200, "#4a7ad0", "gerbera", 1) + enamelVase(1130, 200, "#e8d9b0", "tournesol", 1) + enamelVase(1240, 200, "#4a9a5a", "gerbera", 1) + enamelVase(1360, 200, "#9a6ad0", "tournesol", 1);
      // Worktable: palette of enamel powders, jars, a jar of brushes, a vase half painted
      back += sh(rect(860, 520, 640, 30, 1), M.wood) + ink(line(890, 550, 884, 690, 0.4), 10, { stroke: M.woodDark }) + ink(line(1470, 550, 1476, 690, 0.4), 10, { stroke: M.woodDark });
      back += sh(blob(1000, 512, 80, 14, 0.04, 12), "#f3ece0", { sw: 2 });
      ["#e8705a", "#f2c03a", "#4a7ad0", "#4a9a5a", "#9a6ad0", "#f6f1e6"].forEach((c, i) => (back += `<circle cx="${950 + i * 20}" cy="${510 + (i % 2) * 4}" r="7" fill="${c}" stroke="${P.ink}" stroke-width="1.2"/>`));
      for (let i = 0; i < 5; i++) back += sh(rect(1120 + i * 34, 476, 26, 40, 0.6), M.glass[i], { sw: 1.6, op: 0.85 });
      back += sh(rect(1320, 470, 40, 50, 0.6), "#d8ccb4", { sw: 2 });
      for (let i = 0; i < 4; i++) back += ink(line(1330 + i * 7, 474, 1322 + i * 10, 420, 0.2), 3, { stroke: M.woodLight || "#b0835a" });
      back += enamelVase(1430, 520, "#e8d9b0", "gerbera", 0.8);
      let anim = `<circle cx="730" cy="280" r="260" fill="url(#g-lamp)" opacity=".25"/>`;
      return { back, front: "", anim, top: "" };
    },
    hotspots: [
      { id: "palette", x: 920, y: 490, w: 160, h: 40, look: [L("hs.atelier.palette.look")], pro: { steps: [L("hs.atelier.palette.pro"), { clue: "c_atelier_froid" }] } },
      { id: "poele", x: 130, y: 400, w: 150, h: 240, look: [L("hs.atelier.poele.look")] },
      { id: "vases", x: 960, y: 100, w: 520, h: 120, look: [L("hs.atelier.vases.look"), { egg: "gerbera" }, { clue: "o_emaux" }] },
      { id: "fenetre", x: 620, y: 120, w: 220, h: 310, look: [L("hs.atelier.fenetre.look")] },
    ],
  });

  // ------------------------------------------------------------ Quay and shop
  CH.scenes.register({
    id: "fondamenta",
    nav: true,
    draw() {
      A.srand(6601);
      let back = `<rect width="1600" height="900" fill="url(#g-night)"/>`;
      back += K.campanile(300, 520, 360, "#4a5260");
      // The shop front: awning, window with glass and a small amber, the door
      back += K.brickWall(560, 120, 1060, 520, { plaster: M.plasterOld });
      back += sh(rect(640, 300, 420, 300, 1.5), "#ffd78a", { sw: 3 }) + ink(line(850, 300, 850, 600, 0.3), 3) + ink(line(640, 450, 1060, 450, 0.3), 3);
      for (let i = 0; i < 6; i++) back += K.goblet(680 + i * 65, 446, M.glass[i], 0.55, ["vase", "goblet", "chalice"][i % 3]);
      back += sh(blob(900, 586, 14, 10, 0.15, 8), "#d98a2a", { sw: 1.8 }) + `<circle cx="896" cy="582" r="3" fill="#fff1b0" opacity=".8"/>`;
      for (let i = 0; i < 5; i++) back += K.goblet(690 + i * 70, 596, M.glass[(i + 3) % M.glass.length], 0.5, ["goblet", "vase"][i % 2]);
      back += sh(rect(1120, 300, 150, 300, 1.2), M.woodDark) + `<circle cx="1250" cy="460" r="6" fill="${M.brass}"/>`;
      back += K.awning(620, 230, 680);
      back += sh(rect(780, 150, 260, 60, 1), "#2a2026") + text(910, 192, CH.t("art.shop"), { size: 34, fill: "#e8c84a", weight: 700, font: "Alegreya, serif" });
      // The quay and the canal below
      back += sh(rect(-10, 600, 1620, 300, 1), M.stone) + ink(line(-10, 610, 1610, 610, 1), 4, { stroke: "#cfc8b8" });
      for (let x = 0; x < 1600; x += 120) back += ink(line(x, 612, x - 30, 900, 0.5), 1.6, { op: 0.25 });
      // Beyond the low parapet on the left, the canal and its striped mooring poles
      back += `<rect x="-10" y="520" width="520" height="80" fill="url(#g-water)"/>`;
      [[90, "#2f5a9a"], [250, "#a8443a"], [400, "#2f5a9a"]].forEach(([x, col]) => {
        back += sh(rect(x - 9, 390, 18, 210, 0.6), "#f3ece0", { sw: 2.4 });
        for (let y = 400; y < 590; y += 36) back += sh(rect(x - 8, y, 16, 16, 0.3), col, { sw: 0 });
        back += sh(blob(x, 388, 11, 5, 0.1, 8), col, { sw: 2 });
      });
      back += sh(rect(-10, 560, 530, 46, 1), "#c4bcac", { sw: 3 });
      // Bernardo and Francesca's trunks, neatly labelled
      back += K.trunk(1290, 520, 220, 110, "#7a3a2a", CH.t("art.trunk.costumes")) + K.trunk(1320, 430, 170, 90, "#2f5a4a", CH.t("art.trunk.noses"));
      back += K.lantern(560, 340);
      let anim = K.lanternGlow(560, 340) + `<circle cx="850" cy="450" r="260" fill="url(#g-warm)" class="flicker"/>` + K.fogBands(3, 300, 760);
      return { back, front: "", anim, top: "" };
    },
    hotspots: [
      { id: "vitrine", x: 640, y: 300, w: 420, h: 300, look: [L("hs.fondamenta.vitrine.look"), { egg: "ambre" }] },
      { id: "malles", x: 1290, y: 430, w: 220, h: 200, look: [L("hs.fondamenta.malles.look"), { egg: "boites" }] },
      { id: "clocher", x: 250, y: 20, w: 110, h: 500, look: [L("hs.fondamenta.clocher.look")] },
      { id: "lanterne", x: 520, y: 260, w: 80, h: 110, look: [L("hs.fondamenta.lanterne.look")] },
    ],
  });

  // ------------------------------------------------------------ Glass museum
  CH.scenes.register({
    id: "musee",
    nav: true,
    draw() {
      A.srand(6701);
      let back = `<rect width="1600" height="900" fill="#d8ccb4"/>`;
      back += sh(rect(-10, 560, 1620, 100, 1), "#c4b496");
      back += `<rect x="-10" y="660" width="1620" height="250" fill="url(#p-terrazzo)"/>` + ink(line(-10, 660, 1610, 660, 1), 3);
      back += K.gothicWindow(120, 100, 180, 360, "#7d8a96") + K.gothicWindow(1300, 100, 180, 360, "#7d8a96");
      back += sh(rect(560, 60, 480, 70, 1), "#2a2026") + text(800, 110, CH.t("art.museum"), { size: 40, fill: "#e8c84a", weight: 700, font: "Alegreya, serif" });
      back += K.chandelier(800, 220, 1.2);
      // Display cases; the middle one has an empty place on its velvet
      back += K.vitrine(380, 300, 300, 260, { velvet: "#2f4a5a" }) + K.vitrine(920, 300, 300, 260, { velvet: "#5a1e2a", gap: [1, 1] });
      back += sh(rect(1044, 412, 40, 14, 0.4), "#3a0e1a", { sw: 0, op: 0.7 });
      // Lectern with the loans register
      back += ink(line(780, 640, 780, 520, 0.3), 10, { stroke: M.woodDark }) + sh(poly([[720, 520], [840, 520], [850, 490], [710, 500]], 1), M.wood);
      back += sh(poly([[724, 500], [836, 496], [846, 470], [716, 476]], 0.6), "#f3ece0", { sw: 2 }) + text(780, 492, CH.t("art.loans"), { size: 16, fill: P.ink, font: "Alegreya, serif", weight: 700, rot: -3 });
      // Chair with Morosini's coat over its back
      const chairWood = "#c08a4a";
      back += ink(line(1300, 760, 1304, 640, 0.3), 9, { stroke: chairWood }) + ink(line(1420, 760, 1416, 640, 0.3), 9, { stroke: chairWood });
      back += ink(line(1316, 728, 1320, 640, 0.3), 7, { stroke: "#9a6a3a" }) + ink(line(1404, 728, 1400, 640, 0.3), 7, { stroke: "#9a6a3a" });
      back += sh(rect(1290, 626, 140, 20, 0.8), chairWood);
      back += ink(line(1306, 630, 1300, 440, 0.3), 10, { stroke: chairWood }) + ink(line(1414, 630, 1420, 440, 0.3), 10, { stroke: chairWood });
      back += sh(rect(1292, 440, 136, 26, 0.8), chairWood) + sh(rect(1304, 500, 112, 14, 0.6), chairWood);
      // Morosini's black coat over the back, a scarf end and a white handkerchief corner
      back += sh(soft([[1290, 452], [1340, 440], [1350, 560], [1336, 690], [1300, 700], [1282, 600]], 1.5), "#2e2a33");
      back += sh(soft([[1336, 446], [1428, 450], [1422, 520], [1350, 530]], 1.2), "#2e2a33");
      back += sh(soft([[1300, 470], [1316, 470], [1312, 590], [1298, 588]], 0.6), "#6a2a3a", { sw: 2 });
      back += sh(rect(1306, 600, 34, 26, 0.6), "#3a3440", { sw: 2 }) + sh(poly([[1314, 600], [1332, 600], [1324, 584]], 0.4), "#f6f1e6", { sw: 1.6 });
      let anim = `<circle cx="800" cy="240" r="260" fill="url(#g-warm)" class="flicker"/>`;
      return { back, front: "", anim, top: "" };
    },
    hotspots: [
      { id: "vitrine", x: 920, y: 300, w: 300, h: 260, look: [L("hs.musee.vitrine.look")], pro: { steps: [L("hs.musee.vitrine.pro"), { clue: "c_vitrine_vide" }] } },
      { id: "registre", x: 700, y: 460, w: 160, h: 80, look: [L("hs.musee.registre.look")] },
      { id: "manteau", x: 1280, y: 430, w: 160, h: 280, look: [L("hs.musee.manteau.look")] },
      { id: "lustre", x: 680, y: 150, w: 240, h: 150, look: [L("hs.musee.lustre.look")] },
    ],
  });
})();

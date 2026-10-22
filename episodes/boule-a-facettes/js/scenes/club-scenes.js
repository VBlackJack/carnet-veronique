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

// The seven places of Le Mirage: dance floor, stage, bar, dressing room, DJ booth,
// lighting booth and Max's office.
(function () {
  const A = CH.art, P = A.P;
  const { sh, ink, soft, rect, blob, curve, line, g, poly, text } = A;
  const K = CH.club, Z = K.Z;
  const { L, has } = CH.S;
  const AC = CH.config.acts;
  const strass = (s) => !!s.deds.d_strass;

  // ------------------------------------------------------------ Dance floor
  CH.scenes.register({
    id: "piste",
    nav: true,
    draw() {
      A.srand(5101);
      let back = `<rect width="1600" height="900" fill="${Z.night}"/>`;
      back += K.velvetDrape(0, 40, 200, 560) + K.velvetDrape(1400, 40, 200, 560);
      back += `<rect x="200" y="40" width="1200" height="560" fill="${Z.wall}"/>`;
      for (let x = 240; x < 1380; x += 120) back += sh(rect(x, 100, 80, 300, 1), Z.wallLight, { sw: 1.5, op: 0.5 });
      // Booths along the back wall, candle tables in front of them
      back += K.booth(220, 450, 420) + K.booth(960, 450, 420);
      for (const x of [300, 520, 1040, 1260]) back += K.candleTable(x, 540);
      for (const x of [300, 700, 900, 1300]) back += K.sconce(x, 300);
      const floor = K.danceFloor(620, 900, { rows: 5 });
      back += floor.back;
      back += K.rig(40, [[260, Z.pink], [520, Z.yellow], [800, Z.teal], [1080, Z.yellow], [1340, Z.pink]]);
      back += K.mirrorBall(800, 200, 82);
      let anim = floor.anim;
      anim += K.beam(260, 14, 480, 140, "g-beam-pink") + K.beam(1340, 14, 1120, 140, "g-beam-teal") + K.beam(520, 12, 700, 90, "g-beam-gold") + K.beam(1080, 12, 900, 90, "g-beam-gold");
      for (const x of [300, 520, 1040, 1260]) anim += K.candleGlow(x, 540);
      for (const x of [300, 700, 900, 1300]) anim += `<circle cx="${x}" cy="290" r="60" fill="url(#g-warm)" class="flicker"/>`;
      anim += K.ballFlecks(70, 0, 1600, 60, 620);
      anim += `<circle cx="800" cy="200" r="170" fill="url(#g-spot)" opacity=".35" class="flicker"/>`;
      return { back, front: "", anim, top: "" };
    },
    hotspots: [
      { id: "boule", x: 710, y: 110, w: 180, h: 180, look: [L("hs.piste.boule.look")], pro: { steps: (s) => (strass(s) ? [L("hs.piste.boule.pro2"), { clue: "o_boule" }] : [L("hs.piste.boule.pro")]) } },
      { id: "banquettes", x: 1240, y: 440, w: 150, h: 110, look: [L("hs.piste.banquettes.look")] },
      { id: "table", x: 990, y: 500, w: 100, h: 120, look: [L("hs.piste.table.look")] },
      { id: "dalles", x: 1290, y: 760, w: 280, h: 100, look: [L("hs.piste.dalles.look"), { egg: "dalle" }] },
    ],
  });

  // ------------------------------------------------------------ Stage
  CH.scenes.register({
    id: "scene",
    nav: true,
    draw() {
      A.srand(5201);
      let back = `<rect width="1600" height="900" fill="${Z.night}"/>`;
      back += K.velvetDrape(0, 30, 200, 600) + K.velvetDrape(1440, 30, 160, 600);
      back += K.mirrorWall(230, 110, 900, 420);
      back += K.speaker(60, 430, 120, 170) + K.speaker(1150, 430, 90, 130);
      // Stage platform, lit edge, steps down to the floor
      back += sh(rect(-10, 590, 1620, 60, 1), "#2a2026") + sh(rect(-10, 580, 1620, 14, 1), Z.chrome, { sw: 2 });
      for (let x = 20; x < 1600; x += 70) back += `<circle cx="${x}" cy="587" r="4.5" fill="#fff2c0"/>`;
      for (let i = 0; i < 3; i++) back += sh(rect(1000 + i * 40, 650 + i * 22, 200, 22, 0.8), "#30242c", { sw: 2 });
      const front = K.danceFloor(650, 900, { rows: 3 });
      back += front.back;
      // Stella's mark and the microphone stand
      back += ink(line(700, 630, 750, 642, 0.3), 5, { stroke: "#f2f2f2", op: 0.7 }) + ink(line(750, 630, 700, 642, 0.3), 5, { stroke: "#f2f2f2", op: 0.7 });
      back += ink(line(680, 630, 680, 420, 0.3), 5, { stroke: Z.chromeDark }) + sh(blob(680, 412, 12, 16, 0.05, 8), "#2a2a2a", { sw: 2 }) + sh(blob(680, 630, 30, 6, 0.04, 8), Z.chromeDark, { sw: 2 });
      // DJ booth on the side of the stage, three steps up
      for (let i = 0; i < 3; i++) back += sh(rect(1250 + i * 16, 580 - i * 24, 360, 24, 0.8), i % 2 ? "#3a2c34" : "#30242c", { sw: 2 });
      back += sh(rect(1270, 380, 340, 140, 1.2), "#2a2a30") + sh(rect(1270, 380, 340, 16, 0.6), Z.chrome, { sw: 2 });
      back += K.turntables(1290, 410, 300);
      back += sh(rect(1270, 470, 340, 50, 1), "#24242a");
      back += text(1440, 506, CH.t("art.sign"), { size: 28, fill: Z.pink, weight: 700, font: "Alegreya, serif" });
      back += K.rig(36, [[300, Z.pink], [520, Z.yellow], [760, Z.teal], [1000, Z.yellow], [1240, Z.pink]]);
      back += K.mirrorBall(700, 70, 46);
      let anim = front.anim + K.beam(760, 14, 700, 120, "g-beam-gold", 630) + K.beam(300, 12, 520, 90, "g-beam-pink", 630) + K.beam(1240, 12, 1000, 90, "g-beam-teal", 630);
      anim += K.ballFlecks(50, 230, 1130, 110, 530);
      for (let x = 20; x < 1600; x += 140) anim += `<circle cx="${x}" cy="587" r="18" fill="url(#g-warm)" class="flicker" style="animation-delay:-${(x % 7) * 0.4}s"/>`;
      return { back, front: "", anim, top: "" };
    },
    hotspots: [
      { id: "emplacement", x: 660, y: 590, w: 140, h: 70, look: [L("hs.scene.emplacement.look")], pro: { steps: [L("hs.scene.emplacement.pro"), { clue: "c_autour" }] } },
      { id: "mur", x: 230, y: 110, w: 400, h: 300, look: [L("hs.scene.mur.look"), { clue: "o_miroir_mur" }] },
      { id: "micro", x: 650, y: 390, w: 70, h: 200, look: [L("hs.scene.micro.look")] },
      { id: "enceintes", x: 60, y: 430, w: 120, h: 170, look: [L("hs.scene.enceintes.look")] },
      { id: "cabine", x: 1270, y: 380, w: 120, h: 140, look: [L("hs.scene.cabine.look")] },
    ],
  });

  // ------------------------------------------------------------ Bar
  CH.scenes.register({
    id: "bar",
    nav: true,
    draw(s) {
      A.srand(5301);
      let back = `<rect width="1600" height="900" fill="${Z.night}"/>`;
      back += K.velvetDrape(0, 40, 140, 560) + K.velvetDrape(1460, 40, 140, 560);
      back += `<rect x="140" y="40" width="1320" height="560" fill="${Z.wall}"/>`;
      // Back bar: lit shelves of bottles, a row of glasses, a mirror strip
      back += sh(rect(380, 80, 860, 360, 1), "#3a2230") + sh(rect(396, 96, 828, 330, 0.8), "url(#g-mirror)", { sw: 2, op: 0.35 });
      for (const y of [190, 300]) {
        back += sh(rect(380, y, 860, 12, 0.6), Z.gold, { sw: 1.5 });
        for (let x = 400; x < 1220; x += 30) {
          const col = ["#3a8a4a", "#c0392b", "#e2bd4e", "#3a6ab0", "#f2efe8", "#a03a7a", "#e07a2a"][Math.floor(A.rnd() * 7)];
          const h = 44 + A.rnd() * 30;
          back += sh(rect(x, y - h, 16, h, 0.5), col, { sw: 1.4, op: 0.95 }) + sh(rect(x + 4, y - h - 12, 8, 14, 0.3), col, { sw: 1 });
        }
      }
      for (let x = 400; x < 1220; x += 26) back += sh(poly([[x, 360], [x + 16, 360], [x + 12, 392], [x + 4, 392]], 0.3), "#dfeef2", { sw: 1.2, op: 0.8 });
      back += K.sconce(340, 220) + K.sconce(1280, 220);
      back += K.payPhone(190, 240);
      // Counter with a lit trim, red stools
      back += `<rect x="0" y="600" width="1600" height="300" fill="url(#p-carpet)"/>`;
      back += sh(rect(300, 460, 1040, 36, 1.2), Z.formica) + sh(rect(300, 492, 1040, 180, 1.2), "#6a3a22") + sh(rect(300, 492, 1040, 10, 0.6), Z.gold, { sw: 1.5 });
      for (let x = 330; x < 1320; x += 60) back += ink(line(x, 510, x, 660, 0.3), 3, { stroke: "#4a2614", op: 0.7 });
      for (let x = 320; x < 1340; x += 60) back += `<circle cx="${x}" cy="666" r="3.5" fill="#fff2c0"/>`;
      for (const x of [460, 640, 820, 1000]) back += sh(blob(x, 690, 38, 12, 0.05, 10), "#b0182f") + ink(line(x, 700, x, 860, 0.3), 6, { stroke: Z.chromeDark }) + sh(blob(x, 862, 30, 6, 0.05, 8), Z.chromeDark, { sw: 2 });
      // Sunflower in a vase, glasses, a candle on the counter
      back += sh(rect(1150, 420, 26, 40, 0.5), "#dfeef2", { sw: 1.5, op: 0.85 }) + ink(line(1163, 420, 1166, 360, 0.3), 3, { stroke: "#3a6a2a" });
      for (let a = 0; a < 12; a++) back += sh(blob(1166 + Math.cos((a * Math.PI) / 6) * 20, 350 + Math.sin((a * Math.PI) / 6) * 20, 10, 6, 0.1, 6), Z.yellow, { sw: 1 });
      back += sh(blob(1166, 350, 12, 12, 0.1, 8), "#5a3a1a", { sw: 1.5 });
      back += sh(rect(520, 432, 20, 28, 0.6), "#e9d39a", { sw: 1.4, op: 0.8 }) + sh(rect(900, 436, 14, 22, 0.5), "#c0392b", { sw: 1.4 });
      // Champagne bucket on its stand at the end of the counter
      back += K.champagneBucket(1430, 640, { knocked: !!(s && s.flags && s.flags.seauRenverse), k: 1.6 });
      let anim = K.ballFlecks(30, 140, 1460, 60, 440) + `<circle cx="1166" cy="350" r="90" fill="url(#g-warm)" class="flicker"/>` + K.candleGlow(907, 460);
      anim += `<circle cx="340" cy="210" r="70" fill="url(#g-warm)" class="flicker"/><circle cx="1280" cy="210" r="70" fill="url(#g-warm)" class="flicker flicker-2"/>`;
      anim += `<rect x="300" y="660" width="1040" height="14" fill="#fff2c0" opacity=".25" class="flicker"/>`;
      return { back, front: "", anim, top: "" };
    },
    hotspots: [
      { id: "seau", x: 1350, y: 480, w: 170, h: 280, look: (s) => (s.act >= AC.crossCheck && !has(s, "c_copie") ? [{ cut: "seau" }] : [L(s.flags.seauRenverse ? "hs.bar.seau.look2" : "hs.bar.seau.look")]) },
      { id: "telephone", x: 170, y: 240, w: 100, h: 140, look: [L("hs.bar.telephone.look")] },
      { id: "tournesol", x: 1120, y: 320, w: 90, h: 150, look: [L("hs.bar.tournesol.look"), { egg: "tournesol" }] },
      { id: "bouteilles", x: 380, y: 80, w: 700, h: 300, look: [L("hs.bar.bouteilles.look")] },
      { id: "comptoir", x: 500, y: 460, w: 400, h: 200, look: (s) => (strass(s) ? [L("hs.bar.comptoir.fouille"), { clue: "o_fouille_bar" }] : [L("hs.bar.comptoir.look")]) },
    ],
  });

  // ------------------------------------------------------------ Dressing room
  CH.scenes.register({
    id: "loge",
    nav: true,
    draw() {
      A.srand(5401);
      let back = `<rect width="1600" height="900" fill="#e9c9b0"/>`;
      for (let x = 0; x < 1600; x += 60) back += `<rect x="${x}" y="0" width="30" height="620" fill="#f2d9c4" opacity=".6"/>`;
      back += `<rect x="0" y="620" width="1600" height="280" fill="url(#p-carpet)"/>` + sh(rect(-10, 610, 1620, 14, 1), Z.woodLight);
      // Vanity mirror framed with bulbs
      back += sh(rect(470, 140, 420, 310, 1.2), "#f6efe4") + sh(rect(496, 166, 368, 258, 1), "url(#g-mirror)", { sw: 2 });
      for (let i = 0; i < 7; i++) back += `<circle cx="${490 + i * 63}" cy="152" r="12" fill="#fff6d8" stroke="${P.ink}" stroke-width="1.5"/>`;
      for (let i = 1; i < 5; i++) back += `<circle cx="482" cy="${152 + i * 62}" r="12" fill="#fff6d8" stroke="${P.ink}" stroke-width="1.5"/><circle cx="878" cy="${152 + i * 62}" r="12" fill="#fff6d8" stroke="${P.ink}" stroke-width="1.5"/>`;
      // Dressing table: the open jewellery case, powder, perfume, the gerbera
      back += sh(rect(430, 450, 500, 28, 1), "#f6efe4") + sh(rect(450, 478, 460, 150, 1), "#efe3d0");
      back += sh(rect(470, 500, 130, 110, 0.8), "none", { sw: 1.5 }) + sh(rect(760, 500, 130, 110, 0.8), "none", { sw: 1.5 });
      back += `<circle cx="535" cy="555" r="5" fill="${Z.gold}"/><circle cx="825" cy="555" r="5" fill="${Z.gold}"/>`;
      back += sh(rect(630, 414, 124, 38, 0.8), "#1c2a7a", { sw: 2 }) + sh(poly([[630, 414], [754, 414], [746, 374], [638, 376]], 0.6), "#2a3a9a", { sw: 2 }) + sh(rect(642, 420, 100, 24, 0.5), "#f2efe8", { sw: 1 });
      back += sh(blob(520, 440, 22, 10, 0.1, 8), "#f2a6c8", { sw: 1.5 }) + sh(rect(560, 426, 18, 22, 0.4), "#dfeef2", { sw: 1.2, op: 0.9 }) + sh(blob(569, 422, 6, 5, 0.1, 6), Z.gold, { sw: 1 });
      back += sh(rect(856, 404, 28, 46, 0.5), "#dfeef2", { sw: 1.5, op: 0.85 }) + ink(line(870, 404, 876, 340, 0.3), 3, { stroke: "#3a6a2a" });
      for (let a = 0; a < 12; a++) back += sh(blob(876 + Math.cos((a * Math.PI) / 6) * 18, 330 + Math.sin((a * Math.PI) / 6) * 18, 10, 6, 0.1, 6), Z.orange, { sw: 1 });
      back += sh(blob(876, 330, 9, 9, 0.1, 8), "#5a3a1a", { sw: 1.5 });
      // Folding screen
      for (let i = 0; i < 3; i++) back += sh(poly([[90 + i * 110, 230], [200 + i * 110, 240], [200 + i * 110, 640], [90 + i * 110, 630]], 1), i % 2 ? "#7a3a5a" : "#8a4a6a") + ink(curve([[110 + i * 110, 300], [150 + i * 110, 360], [130 + i * 110, 460]]), 2, { stroke: Z.gold, op: 0.6 });
      // Costume rack: the spare sequinned jumpsuit and a pink feather boa
      back += ink(line(1000, 190, 1000, 620, 0.3), 5, { stroke: Z.chromeDark }) + ink(line(1230, 190, 1230, 620, 0.3), 5, { stroke: Z.chromeDark }) + ink(line(990, 200, 1240, 200, 0.3), 5, { stroke: Z.chromeDark });
      back += sh(soft([[1060, 204], [1130, 204], [1150, 290], [1146, 380], [1158, 590], [1112, 590], [1096, 420], [1080, 590], [1036, 590], [1046, 380], [1040, 290]], 1.5), "#e6e2f2");
      for (let i = 0; i < 40; i++) back += `<circle cx="${(1046 + A.rnd() * 104).toFixed(1)}" cy="${(220 + A.rnd() * 360).toFixed(1)}" r="2.4" fill="#aeb6bd" opacity=".9"/>`;
      back += K.boa(1190, 210, 280);
      // Connecting door to the office, with its little sign, and the corridor door
      back += sh(rect(1310, 190, 190, 430, 1.2), "#7a5a3a") + sh(rect(1332, 216, 146, 160, 1), "none", { sw: 2 }) + sh(rect(1332, 400, 146, 190, 1), "none", { sw: 2 });
      back += sh(rect(1344, 250, 122, 70, 0.6), "#f2efe0", { sw: 1.5 });
      back += text(1405, 278, CH.t("art.door.office1"), { size: 15, fill: P.ink, font: "Alegreya, serif" }) + text(1405, 304, CH.t("art.door.office2"), { size: 15, fill: P.ink, font: "Alegreya, serif" });
      back += `<circle cx="1330" cy="420" r="8" fill="${Z.gold}" stroke="${P.ink}" stroke-width="2"/>` + sh(rect(1324, 436, 12, 18, 0.4), "#3a2a20", { sw: 1.2 });
      back += sh(rect(-10, 210, 70, 410, 1), "#8a6a4a") + `<circle cx="48" cy="420" r="8" fill="${Z.gold}" stroke="${P.ink}" stroke-width="2"/>`;
      let anim = "";
      for (let i = 0; i < 7; i++) anim += `<circle cx="${490 + i * 63}" cy="152" r="32" fill="url(#g-warm)" class="flicker" style="animation-delay:-${i * 0.5}s"/>`;
      anim += `<circle cx="680" cy="300" r="260" fill="url(#g-warm)" opacity=".35"/>`;
      return { back, front: "", anim, top: "" };
    },
    hotspots: [
      { id: "ecrin", x: 620, y: 360, w: 150, h: 100, look: (s) => (strass(s) ? [L("hs.loge.ecrin.look2"), { clue: "o_ecrin" }] : [L("hs.loge.ecrin.look")]) },
      { id: "porte_couloir", x: -10, y: 210, w: 80, h: 410, look: [L("hs.loge.porte_couloir.look")], pro: { steps: [L("hs.loge.porte_couloir.pro"), { clue: "c_paillettes_violettes" }] } },
      { id: "porte_comm", x: 1310, y: 190, w: 190, h: 430, look: [L("hs.loge.porte_comm.look"), { clue: "c_porte_comm" }] },
      { id: "gerbera", x: 830, y: 300, w: 90, h: 150, look: [L("hs.loge.gerbera.look"), { egg: "gerbera" }] },
      { id: "penderie", x: 1000, y: 190, w: 240, h: 260, look: (s) => (strass(s) ? [L("hs.loge.penderie.fouille"), { clue: "o_fouille_loge" }] : [L("hs.loge.penderie.look"), { egg: "statique" }]) },
      { id: "miroir", x: 500, y: 170, w: 300, h: 180, look: [L("hs.loge.miroir.look")] },
    ],
  });

  // ------------------------------------------------------------ DJ booth
  CH.scenes.register({
    id: "cabine",
    nav: true,
    draw() {
      A.srand(5501);
      let back = `<rect width="1600" height="900" fill="#221a24"/>`;
      // Window over the club: lights, ball, a dancing crowd
      back += `<clipPath id="cab-w"><rect x="200" y="90" width="1200" height="320"/></clipPath>`;
      let view = `<rect x="200" y="90" width="1200" height="320" fill="#1a1220"/>`;
      view += K.rig(110, [[300, Z.pink], [520, Z.yellow], [760, Z.teal], [1000, Z.yellow], [1240, Z.pink]]);
      view += K.mirrorBall(800, 170, 40);
      view += K.beam(300, 8, 420, 80, "g-beam-pink", 420) + K.beam(1240, 8, 1100, 80, "g-beam-teal", 420) + K.beam(760, 8, 760, 70, "g-beam-gold", 420);
      view += K.danceFloor(350, 410, { rows: 1 }).back;
      view += K.crowd(220, 1400, 400);
      back += `<g clip-path="url(#cab-w)">${view}</g>` + sh(rect(200, 90, 1200, 320, 1), "none", { sw: 6, stroke: "#141018" });
      // Console with two turntables and a mixer
      back += sh(rect(100, 430, 1400, 200, 1.2), "#2e2e36") + sh(rect(100, 430, 1400, 16, 0.6), Z.chrome, { sw: 2 });
      back += K.turntables(220, 470, 480) + K.turntables(900, 470, 480);
      back += sh(rect(720, 470, 160, 120, 0.8), "#1c1c22");
      for (let i = 0; i < 6; i++) back += sh(rect(736 + i * 24, 490, 8, 70, 0.3), "#121214", { sw: 1 }) + sh(rect(730 + i * 24, 500 + ((i * 13) % 40), 20, 10, 0.3), Z.chrome, { sw: 1 });
      // Shelves of records on both sides, crates in front
      for (const x0 of [0, 1450]) {
        back += sh(rect(x0, 120, 150, 300, 1), Z.wood);
        for (let r = 0; r < 4; r++) for (let i = 0; i < 9; i++) back += sh(rect(x0 + 8 + i * 15, 130 + r * 72, 12, 62, 0.3), [Z.pink, Z.yellow, Z.teal, "#f2efe8", Z.orange, Z.violet, Z.blue, "#2a2a30"][(i + r) % 8], { sw: 1 });
      }
      back += sh(rect(120, 660, 460, 190, 1), Z.woodLight) + sh(rect(1020, 660, 460, 190, 1), Z.woodLight);
      for (let i = 0; i < 16; i++) back += sh(rect(136 + i * 27, 620 + (i % 3) * 6, 22, 70, 0.4), [Z.pink, Z.yellow, Z.teal, "#f2efe8", Z.orange, Z.violet, Z.blue][i % 7], { sw: 1.4 });
      for (let i = 0; i < 16; i++) back += sh(rect(1036 + i * 27, 624 + (i % 2) * 8, 22, 70, 0.4), ["#2a2a30", "#f2efe8", Z.teal, Z.pink][i % 4], { sw: 1.4 });
      // Headphones on a hook, a desk lamp, the palm-tree poster
      back += ink(curve([[1470, 480], [1490, 440], [1530, 440], [1550, 480]]), 6, { stroke: "#2a2a2a" }) + `<ellipse cx="1470" cy="488" rx="14" ry="18" fill="#3a3330" stroke="${P.ink}" stroke-width="2"/><ellipse cx="1550" cy="488" rx="14" ry="18" fill="#3a3330" stroke="${P.ink}" stroke-width="2"/>`;
      back += ink(curve([[150, 430], [180, 380], [230, 370]]), 4, { stroke: "#1c1c22" }) + sh(soft([[210, 380], [262, 360], [256, 344], [210, 362]], 0.6), "#2a2a30", { sw: 2 });
      let anim = K.ballFlecks(30, 200, 1400, 90, 410) + `<circle cx="240" cy="380" r="110" fill="url(#g-warm)" class="flicker"/>`;
      anim += `<g clip-path="url(#cab-w)">${K.danceFloor(350, 410, { rows: 1 }).anim}</g>`;
      return { back, front: "", anim, top: "" };
    },
    hotspots: [
      { id: "bacs", x: 1020, y: 620, w: 460, h: 230, look: (s) => (strass(s) ? [L("hs.cabine.bacs.fouille"), { clue: "o_fouille_cabine" }] : [L("hs.cabine.bacs.look"), { egg: "abba" }]) },
      { id: "platines", x: 220, y: 450, w: 420, h: 140, look: [L("hs.cabine.platines.look")] },
      { id: "vitre", x: 200, y: 90, w: 1200, h: 300, look: [L("hs.cabine.vitre.look")] },
      { id: "casque", x: 1440, y: 430, w: 140, h: 90, look: [L("hs.cabine.casque.look")] },
      { id: "etageres", x: 0, y: 120, w: 150, h: 300, look: [L("hs.cabine.etageres.look")] },
    ],
  });

  // ------------------------------------------------------------ Lighting booth
  CH.scenes.register({
    id: "regie",
    nav: true,
    draw() {
      A.srand(5601);
      let back = `<rect width="1600" height="900" fill="#1c1c22"/>`;
      // Window over the whole club
      back += `<clipPath id="reg-w"><rect x="420" y="80" width="900" height="300"/></clipPath>`;
      let view = `<rect x="420" y="80" width="900" height="300" fill="#1a1220"/>`;
      view += K.rig(100, [[500, Z.pink], [700, Z.teal], [900, Z.yellow], [1100, Z.pink], [1260, Z.teal]]);
      view += K.mirrorBall(870, 160, 34);
      view += K.beam(500, 8, 620, 70, "g-beam-pink", 400) + K.beam(1260, 8, 1100, 70, "g-beam-teal", 400) + K.beam(900, 8, 880, 60, "g-beam-gold", 400);
      view += K.danceFloor(320, 380, { rows: 1 }).back + K.crowd(430, 1320, 372);
      back += `<g clip-path="url(#reg-w)">${view}</g>` + sh(rect(420, 80, 900, 300, 1), "none", { sw: 6, stroke: "#101014" });
      // Cork board with notes
      back += K.notes(1360, 90, 200, 230);
      // Lighting console: faders and rows of coloured memory buttons
      back += sh(poly([[280, 440], [1300, 440], [1360, 600], [220, 600]], 1), "#2e3036") + sh(rect(220, 600, 1140, 34, 1), "#24262a");
      for (let i = 0; i < 22; i++) {
        const x = 310 + i * 44;
        back += sh(rect(x, 456, 8, 64, 0.3), "#121214", { sw: 1 }) + sh(rect(x - 8, 466 + ((i * 17) % 44), 24, 12, 0.4), Z.chrome, { sw: 1.2 });
      }
      for (let r = 0; r < 2; r++) for (let i = 0; i < 18; i++) back += `<rect x="${300 + i * 56}" y="${540 + r * 28}" width="38" height="20" rx="3" fill="${["#c0392b", "#e2bd4e", "#2f8a8a", "#7a4ab0", "#e07a2a", "#3a6ab0"][(i + r) % 6]}" stroke="${P.ink}" stroke-width="1.5" opacity=".95"/>`;
      // Follow spot on its stand, aimed through the window
      back += ink(line(200, 500, 160, 880, 0.3), 6, { stroke: "#3a3a42" }) + ink(line(200, 500, 250, 880, 0.3), 6, { stroke: "#3a3a42" });
      back += g(sh(rect(-90, -40, 200, 80, 1), "#3a3a42") + sh(blob(110, 0, 26, 40, 0.04, 10), "#fff2c0", { sw: 2 }), 'transform="translate(200,450) rotate(-14)"');
      // Desk with the big blue logbook of changes, and a lamp
      back += sh(rect(1340, 690, 240, 20, 1), Z.wood) + ink(line(1360, 710, 1360, 880, 0.3), 6, { stroke: Z.wood }) + ink(line(1560, 710, 1560, 880, 0.3), 6, { stroke: Z.wood });
      back += sh(poly([[1380, 690], [1520, 690], [1530, 600], [1390, 604]], 0.6), "#1c3a7a", { sw: 2 });
      back += text(1458, 636, CH.t("art.logbook1"), { size: 16, fill: "#f2efe8", font: "Alegreya, serif", weight: 700 }) + text(1458, 656, CH.t("art.logbook2"), { size: 16, fill: "#f2efe8", font: "Alegreya, serif", weight: 700 });
      back += ink(line(1560, 690, 1560, 620, 0.3), 4, { stroke: Z.chromeDark }) + sh(soft([[1536, 630], [1584, 630], [1574, 600], [1546, 600]], 1), "#e2bd4e", { sw: 2 });
      for (let i = 0; i < 4; i++) back += ink(curve([[300 + i * 30, 630], [280 + i * 40, 760], [400 + i * 60, 880]]), 4, { stroke: "#121214" });
      let anim = `<g clip-path="url(#reg-w)">${K.danceFloor(320, 380, { rows: 1 }).anim}${K.ballFlecks(20, 420, 1320, 80, 380)}</g>`;
      for (let i = 0; i < 18; i++) if (i % 3 === 0) anim += `<rect x="${300 + i * 56}" y="540" width="38" height="20" rx="3" fill="#fff6c0" class="blink" style="animation-delay:-${i * 0.3}s" opacity=".5"/>`;
      anim += `<polygon points="300,430 1320,180 1320,320 310,460" fill="url(#g-beam-gold)" opacity=".3"/>`;
      anim += `<circle cx="1560" cy="620" r="120" fill="url(#g-warm)" class="flicker"/>`;
      return { back, front: "", anim, top: "" };
    },
    hotspots: [
      { id: "conduite", x: 280, y: 430, w: 250, h: 170, look: [L("hs.regie.conduite.look"), { clue: "c_top47" }] },
      { id: "registre", x: 1370, y: 590, w: 170, h: 110, look: (s) => (s.act >= AC.crossCheck ? [L("hs.regie.registre.look2"), { clue: "c_registre_md" }] : [L("hs.regie.registre.look")]) },
      { id: "console", x: 760, y: 430, w: 380, h: 200, look: (s) => (strass(s) ? [L("hs.regie.console.fouille"), { clue: "o_fouille_regie" }] : [L("hs.regie.console.look")]) },
      { id: "poursuite", x: 100, y: 390, w: 240, h: 130, look: [L("hs.regie.poursuite.look")] },
      { id: "notes", x: 1360, y: 90, w: 200, h: 230, look: [L("hs.regie.notes.look")] },
      { id: "vitre", x: 420, y: 80, w: 900, h: 300, look: [L("hs.regie.vitre.look")] },
    ],
  });

  // ------------------------------------------------------------ Max's office
  CH.scenes.register({
    id: "bureau",
    nav: true,
    unlock: (s) => !!s.flags.bureauOuvert && s.act < CH.config.acts.ending,
    draw(s) {
      A.srand(5701);
      let back = `<rect width="1600" height="900" fill="#6a4a32"/>`;
      for (let x = 0; x < 1600; x += 90) back += ink(line(x, 0, x + A.jit(2), 640, 0.4), 3, { stroke: "#4a3020", op: 0.6 });
      back += `<rect x="0" y="640" width="1600" height="260" fill="#3a2a22"/>` + sh(rect(-10, 630, 1620, 14, 1), "#2a1c14");
      // Window on rue Fontaine: lit windows across the street, the vertical neon of Le Mirage
      back += sh(rect(1040, 100, 420, 340, 1), "#1a1a2a", { sw: 6, stroke: "#2a1c14" });
      for (let r = 0; r < 4; r++) for (let c = 0; c < 5; c++) back += sh(rect(1070 + c * 60, 140 + r * 64, 34, 40, 0.5), (r + c) % 3 ? "#ffd38a" : "#3a3a4a", { sw: 1.5, op: 0.9 });
      back += sh(rect(1400, 110, 46, 320, 0.8), "#1a1018", { sw: 2 });
      CH.t("art.sign").replace(/\s/g, "").split("").forEach((ch, i) => (back += text(1423, 146 + i * 36, ch, { size: 30, fill: Z.pink, weight: 700, font: "Alegreya, serif" })));
      back += ink(line(1250, 100, 1250, 440, 0.3), 6, { stroke: "#2a1c14" });
      // The framed gold disc, slightly off true (or taken down)
      const off = !!(s && s.flags && s.flags.cadreDecroche);
      back += g(sh(rect(-110, -90, 220, 180, 1), "#1c1c1c", { sw: 4 }) + sh(rect(-96, -76, 192, 152, 0.6), "#f2efe8", { sw: 1.5 }) + `<circle cx="-20" cy="0" r="58" fill="${Z.gold}" stroke="${P.ink}" stroke-width="2"/><circle cx="-20" cy="0" r="10" fill="#f2efe8"/>` + sh(rect(50, -60, 40, 120, 0.4), Z.pink, { sw: 1.4 }), `transform="translate(600,290) rotate(${off ? -14 : 2})"`);
      if (off) back += sh(blob(600, 320, 60, 22, 0.1, 12), "#d9e6f2", { sw: 2 });
      back += ink(line(492, 200, 708, 200, 0.3), 1.5, { stroke: "#c9b08a", op: 0.7 });
      // Plant, armchair behind the desk, desk with lamp, phone, ashtray
      back += K.palm(360, 640, 1);
      back += K.armchair(760, 560);
      back += sh(rect(560, 560, 560, 30, 1), "#5a3a26") + sh(rect(580, 590, 180, 200, 1), "#4a3020") + sh(rect(920, 590, 180, 200, 1), "#4a3020");
      back += ink(line(1060, 560, 1060, 470, 0.3), 4, { stroke: Z.chromeDark }) + sh(soft([[1020, 480], [1100, 480], [1086, 440], [1034, 440]], 1), "#2f6a4a", { sw: 2 });
      back += sh(rect(610, 530, 80, 32, 0.6), "#c94a2a", { sw: 2 }) + sh(blob(650, 524, 36, 8, 0.05, 8), "#a83a1a", { sw: 1.5 });
      back += sh(rect(860, 540, 120, 20, 0.6), "#f2efe8", { sw: 1.5 }) + sh(blob(1000, 552, 22, 6, 0.05, 8), "#c9cdd1", { sw: 1.5 });
      // Waste basket and safe
      back += sh(poly([[1160, 760], [1240, 760], [1230, 860], [1170, 860]], 1), "#6a6a70") + sh(blob(1200, 760, 40, 8, 0.05, 8), "#4a4a50", { sw: 1.5 });
      back += sh(blob(1192, 754, 18, 10, 0.2, 8), "#f2efe8", { sw: 1.2 }) + sh(blob(1212, 750, 14, 8, 0.2, 8), "#f2efe8", { sw: 1.2 });
      back += sh(rect(1300, 600, 220, 240, 1.2), "#3a3a40") + `<circle cx="1410" cy="720" r="34" fill="none" stroke="${Z.chrome}" stroke-width="5"/>` + sh(rect(1308, 608, 30, 224, 0.6), "#2a2a30", { sw: 1.5 });
      // Connecting door to the dressing room
      back += sh(rect(40, 220, 170, 420, 1.2), "#7a5a3a") + `<circle cx="190" cy="430" r="8" fill="${Z.gold}" stroke="${P.ink}" stroke-width="2"/>`;
      let anim = `<circle cx="1060" cy="470" r="170" fill="url(#g-warm)" class="flicker"/>`;
      anim += `<rect x="1400" y="110" width="46" height="320" fill="${Z.pink}" opacity=".2" class="blink"/>`;
      return { back, front: "", anim, top: "" };
    },
    hotspots: [
      { id: "corbeille", x: 1140, y: 730, w: 120, h: 140, look: [L("hs.bureau.corbeille.look"), { clue: "c_lettre_banque" }] },
      { id: "disque", x: 480, y: 190, w: 240, h: 210, look: (s) => (s.flags.cadreDecroche ? [L("hs.bureau.disque.after")] : has(s, "o_cadre") ? [{ cut: "arcenciel" }] : [L("hs.bureau.disque.look")]), pro: { steps: [L("hs.bureau.disque.pro"), { clue: "o_cadre" }] } },
      { id: "coffre", x: 1300, y: 600, w: 220, h: 240, look: [L("hs.bureau.coffre.look")] },
      { id: "fenetre", x: 1040, y: 100, w: 420, h: 340, look: [L("hs.bureau.fenetre.look")] },
      { id: "table", x: 560, y: 520, w: 560, h: 80, look: [L("hs.bureau.table.look")] },
      { id: "porte", x: 40, y: 220, w: 170, h: 420, look: [L("hs.bureau.porte.look")] },
    ],
  });
})();

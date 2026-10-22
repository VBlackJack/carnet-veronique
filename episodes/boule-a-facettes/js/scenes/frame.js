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

// Framing backdrops: the 2026 kitchen with the old single, and the title screen
// in front of Le Mirage.
(function () {
  const A = CH.art, P = A.P;
  const { sh, ink, soft, rect, blob, curve, line, g, poly, text } = A;
  const K = CH.club, Z = K.Z;

  // A 1970s record player, lid off, a single on the platter.
  function recordPlayer(x, y) {
    let s = sh(rect(x, y, 340, 90, 1.2), "#e9dcc0") + sh(rect(x, y + 70, 340, 20, 0.8), "#c9a27a", { sw: 2 });
    s += sh(blob(x + 130, y + 30, 110, 22, 0.02, 16), "#141418", { sw: 2.5 });
    for (let r = 30; r < 100; r += 18) s += `<ellipse cx="${x + 130}" cy="${y + 30}" rx="${r}" ry="${r * 0.2}" fill="none" stroke="#2a2a30" stroke-width="1.2"/>`;
    s += sh(blob(x + 130, y + 30, 30, 7, 0.04, 10), Z.pink, { sw: 1.5 });
    s += ink(curve([[x + 300, y + 10], [x + 280, y + 2], [x + 210, y + 22]]), 5, { stroke: Z.chromeDark }) + sh(blob(x + 300, y + 10, 12, 10, 0.05, 8), Z.chrome, { sw: 1.5 });
    s += `<circle cx="${x + 300}" cy="${y + 58}" r="8" fill="${Z.chromeDark}" stroke="${P.ink}" stroke-width="1.5"/><circle cx="${x + 270}" cy="${y + 58}" r="8" fill="${Z.chromeDark}" stroke="${P.ink}" stroke-width="1.5"/>`;
    return s;
  }

  CH.scenes.register({
    id: "cuisine2026",
    draw() {
      A.srand(5801);
      let back = `<rect width="1600" height="900" fill="#2a2320"/>`;
      // Hanging lamp over the table
      back += ink(line(800, 0, 800, 40, 0.3), 3) + sh(poly([[700, 70], [900, 70], [860, 40], [740, 40]], 1), "#3a3a40");
      back += sh(soft([[-20, 460], [1620, 440], [1620, 920], [-20, 920]], 3), P.woodDark);
      for (let i = 0; i < 7; i++) back += ink(line(-20, 500 + i * 60, 1620, 480 + i * 60, 2), 2, { op: 0.4 });
      // The old cardboard box Benjamin found, full of records
      back += sh(poly([[140, 700], [480, 690], [490, 520], [150, 530]], 1.5), "#b98a52");
      for (let i = 0; i < 9; i++) back += sh(rect(176 + i * 32, 470 + (i % 3) * 8, 26, 80, 0.4), ["#3a3a4a", "#c0392b", "#e2bd4e", "#2f8a8a", "#f2efe8"][i % 5], { sw: 1.4 });
      back += sh(poly([[150, 530], [490, 520], [540, 460], [190, 472]], 1.5), "#c99a62", { op: 0.92 }) + sh(poly([[150, 530], [140, 700], [80, 630], [90, 480]], 1.5), "#a87a42");
      // Record player, scissors
      back += recordPlayer(600, 560);
      back += g(ink(line(0, 0, 120, 4, 0.2), 5, { stroke: Z.chrome }) + `<circle cx="-14" cy="-10" r="14" fill="none" stroke="#c0392b" stroke-width="7"/><circle cx="-14" cy="14" r="14" fill="none" stroke="#c0392b" stroke-width="7"/>`, 'transform="translate(560,760) rotate(-4)"');
      // The single's sleeve with its title
      back += g(sh(rect(0, 0, 220, 220, 1), Z.pink, { sw: 3 }) + `<circle cx="110" cy="128" r="66" fill="${Z.yellow}" stroke="${P.ink}" stroke-width="2"/>` + sh(soft([[60, 190], [90, 150], [80, 120], [120, 140], [150, 110], [160, 160], [190, 190]], 1.5), Z.orange, { sw: 0, op: 0.8 }) + text(110, 46, CH.t("art.sleeve"), { size: 30, fill: "#3a1a2a", weight: 700, font: "Alegreya, serif", rot: -6 }), 'transform="translate(1000,520) rotate(6)"');
      // The yellowed Polaroid
      back += g(sh(rect(0, 0, 140, 160, 1), "#f2eedd") + sh(rect(12, 12, 116, 110, 0.6), "#2a1a2a", { sw: 1.5 }) + K.mirrorBall(70, 52, 22) + `<rect x="12" y="92" width="116" height="30" fill="${Z.pink}" opacity=".55"/>`, 'transform="translate(1270,580) rotate(9)"');
      // A small white toy starfighter built from bricks
      back += g(sh(poly([[0, 0], [110, -10], [130, 0], [110, 10]], 0.6), "#eceae4", { sw: 2 }) + sh(poly([[30, -8], [70, -50], [86, -46], [60, -8]], 0.5), "#dcdad2", { sw: 1.6 }) + sh(poly([[30, 8], [70, 50], [86, 46], [60, 8]], 0.5), "#dcdad2", { sw: 1.6 }) + `<rect x="104" y="-3" width="14" height="6" fill="#c0392b"/><rect x="66" y="-46" width="10" height="5" fill="#c0392b"/><rect x="66" y="41" width="10" height="5" fill="#c0392b"/>`, 'transform="translate(1320,470) rotate(-10)"');
      back += A.namedGoat("biscotte", 1500, 640, 0.75, true);
      const anim = `<polygon points="740,70 860,70 1300,900 300,900" fill="url(#g-beam)" opacity=".5"/><circle cx="800" cy="420" r="520" fill="url(#g-warm)" opacity=".45" class="flicker"/>`;
      return { back, front: "", anim };
    },
    hotspots: [],
  });

  // Title: the neon front of Le Mirage at night, Veronique and Biscotte on the pavement.
  CH.scenes.register({
    id: "title",
    draw() {
      A.srand(5901);
      let back = `<rect width="1600" height="900" fill="#14121c"/>`;
      // Building front with lit windows
      back += sh(rect(160, 0, 1280, 680, 1.5), "#2e2434");
      for (let x = 230; x < 1400; x += 170) back += sh(rect(x, 40, 90, 90, 0.8), (x / 170) % 2 > 1 ? "#ffd38a" : "#3a3048", { sw: 2, op: 0.95 }) + ink(line(x + 45, 40, x + 45, 130, 0.2), 2) + ink(line(x, 85, x + 90, 85, 0.2), 2);
      // Entrance, awning, neon sign
      back += sh(rect(470, 360, 660, 320, 1.2), Z.velvetDark) + sh(rect(630, 430, 340, 250, 1), "#1a1018");
      back += sh(rect(640, 440, 320, 240, 0.6), "url(#g-mirror)", { sw: 1.5, op: 0.15 });
      back += K.mirrorBall(800, 520, 52);
      back += sh(rect(430, 200, 740, 90, 1), "#1a1018", { sw: 3 });
      back += text(800, 266, CH.t("art.sign"), { size: 70, fill: Z.pink, weight: 700, font: "Alegreya, serif" });
      back += sh(poly([[440, 300], [1160, 300], [1220, 360], [380, 360]], 1), Z.velvet) + ink(line(380, 360, 1220, 360, 0.3), 5, { stroke: Z.gold });
      for (let x = 400; x < 1210; x += 40) back += `<circle cx="${x}" cy="360" r="4" fill="#fff2c0"/>`;
      // Posters, palms, the velvet rope
      back += K.poster(250, 420, 130, 190, "disc") + K.poster(1220, 420, 130, 190, "palm");
      back += K.palm(520, 680, 0.9) + K.palm(1080, 680, 0.9);
      // Pavement, street lamps, a parked car
      back += `<rect x="0" y="680" width="1600" height="220" fill="#24202a"/>` + ink(line(0, 700, 1600, 700, 1), 3, { stroke: "#3a3442" });
      back += K.rope(600, 1000, 760);
      back += K.streetLamp(90, 800) + K.streetLamp(1500, 800);
      back += K.car(-140, 880);
      back += sh(blob(800, 790, 520, 30, 0.05, 14), Z.pink, { sw: 0, op: 0.15 });
      const top = A.character("veronique", 1240, 880, 500, false, { expr: "smile" }) + A.namedGoat("biscotte", 1430, 880, 1.05, true);
      let anim = `<rect x="430" y="200" width="740" height="90" fill="${Z.pink}" opacity=".2" class="flicker"/>` + K.ballFlecks(50, 160, 1440, 0, 680);
      anim += `<circle cx="90" cy="460" r="120" fill="url(#g-warm)" class="flicker"/><circle cx="1500" cy="460" r="120" fill="url(#g-warm)" class="flicker flicker-2"/>`;
      for (let x = 400; x < 1210; x += 80) anim += `<circle cx="${x}" cy="360" r="16" fill="url(#g-warm)" class="flicker" style="animation-delay:-${(x % 9) * 0.3}s"/>`;
      return { back, front: "", anim, top };
    },
    hotspots: [],
  });
})();

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

// Framing backdrops: the 2026 kitchen with the flea-market slide box and the monocle,
// and the title screen in Baker Street, in the fog.
(function () {
  const A = CH.art, P = A.P;
  const { sh, ink, soft, rect, blob, curve, line, g, poly, text } = A;
  const K = CH.london, M = K.L;

  CH.scenes.register({
    id: "cuisine2026",
    draw() {
      A.srand(7801);
      let back = `<rect width="1600" height="900" fill="#2a2320"/>`;
      back += ink(line(800, 0, 800, 40, 0.3), 3) + sh(poly([[700, 70], [900, 70], [860, 40], [740, 40]], 1), "#3a3a40");
      back += sh(soft([[-20, 460], [1620, 440], [1620, 920], [-20, 920]], 3), P.woodDark);
      for (let i = 0; i < 7; i++) back += ink(line(-20, 500 + i * 60, 1620, 480 + i * 60, 2), 2, { op: 0.4 });
      // Julien's flea-market find: the slide box, one slot empty, a slide out on the table
      back += g(K.slideBox(0, 0, { label: CH.t("art.box"), gap: true }), 'transform="translate(330,600) rotate(-3) scale(1.4)"');
      back += g(sh(rect(0, 0, 110, 110, 0.6), "#3a3028", { sw: 2.4 }) + `<circle cx="55" cy="55" r="40" fill="#f6e2a8"/>` + `<path d="M35 75h40l-4 -16h-32z" fill="#c98a4a"/>`, 'transform="translate(820,640) rotate(8)"');
      // The monocle on its black cord
      back += `<circle cx="1080" cy="660" r="26" fill="#ffffff" fill-opacity=".3" stroke="${M.brass}" stroke-width="5"/>` + ink(curve([[1104, 668], [1150, 700], [1190, 690], [1230, 720]], 0.4), 2.4, { stroke: "#1f1a18" });
      back += A.namedCat("tobiasse", 1350, 600, 1.3, true);
      back += A.namedGoat("biscotte", 1500, 700, 0.75, true);
      const anim = `<polygon points="740,70 860,70 1300,900 300,900" fill="url(#g-beam)" opacity=".5"/><circle cx="800" cy="420" r="520" fill="url(#g-warm)" opacity=".45" class="flicker"/>`;
      return { back, front: "", anim };
    },
    hotspots: [],
  });

  // Title: Baker Street at night, the Portman Rooms lit behind the fog, a hansom cab.
  CH.scenes.register({
    id: "title",
    draw() {
      A.srand(7901);
      let back = `<rect width="1600" height="900" fill="#2a261e"/>`;
      // Terraced houses, lit windows
      for (let x = -40; x < 1640; x += 260) {
        back += sh(rect(x, 100, 240, 560, 1.2), ["#4a3a2e", "#3e342c", "#463a30"][(x / 260 + 1) % 3 | 0], { sw: 2 });
        for (let r = 0; r < 3; r++) for (let c = 0; c < 2; c++) back += sh(rect(x + 40 + c * 100, 150 + r * 140, 60, 90, 0.6), (x + r + c) % 3 ? "#ffd78a" : "#2a2420", { sw: 2, op: 0.95 });
      }
      // The Portman Rooms entrance and sign
      back += sh(rect(520, 380, 560, 280, 1.2), "#5a2e22") + sh(rect(700, 470, 200, 190, 1), "#ffd78a", { op: 0.85 });
      back += sh(rect(560, 300, 480, 70, 1), "#1f1b1a", { sw: 3 }) + text(800, 350, CH.t("art.sign"), { size: 44, fill: "#e8c84a", weight: 700, font: "Alegreya, serif" });
      back += `<rect x="-10" y="660" width="1620" height="250" fill="#3a342a"/>` + ink(line(-10, 680, 1610, 680, 1), 3, { stroke: "#5a5040" });
      back += K.streetLamp(300, 760) + K.streetLamp(1300, 760);
      // A hansom cab waiting, horse dozing
      back += sh(rect(80, 600, 170, 110, 1), "#1f1b1a") + `<circle cx="150" cy="730" r="52" fill="none" stroke="#1f1b1a" stroke-width="6"/>` + ink(line(250, 690, 380, 700, 0.3), 4, { stroke: "#1f1b1a" });
      back += sh(soft([[380, 640], [500, 630], [520, 690], [390, 700]], 1.5), "#4a3a2e", { op: 0.8 });
      const top = A.character("veronique", 1120, 800, 380, false, { expr: "smile" }) + A.namedGoat("biscotte", 1270, 800, 0.8, true);
      let anim = K.gasGlow(300, 420, 150) + K.gasGlow(1300, 420, 150) + `<rect x="700" y="470" width="200" height="190" fill="url(#g-gas)" opacity=".6" class="flicker"/>` + K.fogBands(4, 200, 820);
      return { back, front: "", anim, top };
    },
    hotspots: [],
  });
})();

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

// Framing backdrops: the 2026 kitchen with the old glasses box and the small Murano
// glass, and the title screen on the canal in front of the glassworks.
(function () {
  const A = CH.art, P = A.P;
  const { sh, ink, soft, rect, blob, curve, line, g, poly, text } = A;
  const K = CH.murano, M = K.M;

  CH.scenes.register({
    id: "cuisine2026",
    draw() {
      A.srand(6801);
      let back = `<rect width="1600" height="900" fill="#2a2320"/>`;
      back += ink(line(800, 0, 800, 40, 0.3), 3) + sh(poly([[700, 70], [900, 70], [860, 40], [740, 40]], 1), "#3a3a40");
      back += sh(soft([[-20, 460], [1620, 440], [1620, 920], [-20, 920]], 3), P.woodDark);
      for (let i = 0; i < 7; i++) back += ink(line(-20, 500 + i * 60, 1620, 480 + i * 60, 2), 2, { op: 0.4 });
      // The old glasses box, open: tissue paper, the engraved case
      back += sh(poly([[200, 720], [620, 710], [630, 560], [210, 570]], 1.5), "#e8dcc4") + sh(poly([[230, 700], [600, 690], [606, 586], [236, 594]], 1), "#5a1e2a");
      back += sh(soft([[250, 640], [330, 600], [420, 630], [500, 596], [580, 640], [560, 690], [260, 690]], 2), "#f6f1e6", { op: 0.9 });
      back += g(sh(rect(0, 0, 230, 70, 1.2), "#7a4a32") + sh(rect(10, 10, 210, 50, 0.8), "#8a5a3a", { sw: 1.6 }) + text(115, 46, CH.t("art.case"), { size: 26, fill: "#e8c84a", weight: 700, font: "Alegreya, serif" }), 'transform="translate(700,700) rotate(-5)"');
      // The small Murano glass, light breaking into colours on the table
      back += K.goblet(1000, 640, "#9ad0c8", 1.5, "chalice");
      // Light through the glass, spread into a fan of colours from its foot
      ["#e65a4a", "#f2a03a", "#f2d36b", "#5aae5a", "#4aa0d8", "#9a6ad0"].forEach((c, i) => (back += `<polygon points="1006,640 1014,640 ${1150 + i * 52},860 ${1100 + i * 52},860" fill="${c}" opacity=".42"/>`));
      // Tobiasse asleep on the table, Biscotte watching
      back += A.namedCat("tobiasse", 1320, 610, 1.4, true);
      back += A.namedGoat("biscotte", 1500, 700, 0.75, true);
      const anim = `<polygon points="740,70 860,70 1300,900 300,900" fill="url(#g-beam)" opacity=".5"/><circle cx="800" cy="420" r="520" fill="url(#g-warm)" opacity=".45" class="flicker"/>`;
      return { back, front: "", anim };
    },
    hotspots: [],
  });

  // Title: the canal at night, the glassworks with its glowing furnace windows,
  // Veronique and Biscotte on the bridge.
  CH.scenes.register({
    id: "title",
    draw() {
      A.srand(6901);
      let back = `<rect width="1600" height="900" fill="${M.nightDeep}"/>`;
      back += K.campanile(1380, 420, 330, "#2e3644");
      // The glassworks: brick front, arched windows red with the furnace, the sign
      back += K.brickWall(180, 160, 980, 430, {});
      back += sh(rect(160, 140, 1020, 30, 1), M.stoneDark);
      for (let x = 240; x < 1100; x += 160) back += K.gothicWindow(x, 260, 90, 170, true).replace(/#ffd78a/g, "#ff9a3a");
      back += sh(rect(420, 180, 500, 64, 1), "#2a2026") + text(670, 228, CH.t("art.sign"), { size: 48, fill: "#e8c84a", weight: 700, font: "Alegreya, serif" });
      back += sh(rect(160, 580, 1020, 30, 1), M.stone);
      back += K.canal(600, 900, { lights: [[320, "#ff9a3a"], [640, "#ff9a3a"], [960, "#ff9a3a"]] });
      back += K.bridge(1080, 560, 440);
      back += K.lantern(1150, 470);
      const top = A.character("veronique", 1260, 566, 290, false, { expr: "smile" }) + A.namedGoat("biscotte", 1390, 566, 0.62, true);
      let anim = "";
      for (let x = 240; x < 1100; x += 160) anim += `<circle cx="${x + 45}" cy="${350}" r="120" fill="url(#g-fire)" opacity=".5" class="flicker" style="animation-delay:-${(x % 7) * 0.4}s"/>`;
      anim += K.lanternGlow(1150, 470) + K.fogBands(3, 420, 820);
      return { back, front: "", anim, top };
    },
    hotspots: [],
  });
})();

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

// Furniture and props for Le Mirage: booths, candle tables, speakers, crowd,
// street furniture, posters, plants. Extends CH.club.
(function () {
  const A = CH.art, P = A.P;
  const { sh, ink, soft, rect, blob, curve, line, g, poly, text } = A;
  const K = CH.club, Z = K.Z;

  // Red velvet booth (banquette) along a wall.
  function booth(x, y, w) {
    let s = sh(soft([[x, y], [x + w, y], [x + w + 6, y + 70], [x - 6, y + 70]], 1.5), Z.velvet);
    for (let i = 1; i < Math.round(w / 70); i++) s += ink(line(x + (w * i) / Math.round(w / 70), y + 6, x + (w * i) / Math.round(w / 70), y + 64, 0.3), 2.5, { stroke: Z.velvetDark });
    s += sh(rect(x - 10, y + 70, w + 20, 34, 1), Z.velvetDark);
    return s;
  }

  // Small round table with a candle in a red glass.
  function candleTable(x, y) {
    let s = sh(blob(x, y, 46, 11, 0.04, 10), "#2a2028") + ink(line(x, y + 8, x, y + 70, 0.3), 5, { stroke: Z.chromeDark });
    s += sh(blob(x, y + 72, 24, 5, 0.04, 8), Z.chromeDark, { sw: 1.5 });
    s += sh(rect(x - 8, y - 22, 16, 20, 0.5), "#c0392b", { sw: 1.5, op: 0.9 }) + sh(blob(x, y - 26, 3, 6, 0.1, 6), "#ffd38a", { sw: 0 });
    return s;
  }

  const candleGlow = (x, y) => `<circle cx="${x}" cy="${y - 24}" r="40" fill="url(#g-warm)" class="flicker"/>`;

  // Wall sconce with a warm shade.
  function sconce(x, y) {
    return sh(rect(x - 4, y, 8, 26, 0.4), Z.gold, { sw: 1.5 }) + sh(soft([[x - 16, y + 4], [x + 16, y + 4], [x + 10, y - 22], [x - 10, y - 22]], 1), "#f2b26a", { sw: 1.5 });
  }

  // Loudspeaker cabinet.
  function speaker(x, y, w, h) {
    let s = sh(rect(x, y, w, h, 1), "#1c1c22");
    s += `<circle cx="${x + w / 2}" cy="${y + h * 0.32}" r="${w * 0.22}" fill="#2a2a32" stroke="#4a4a54" stroke-width="3"/>`;
    s += `<circle cx="${x + w / 2}" cy="${y + h * 0.72}" r="${w * 0.32}" fill="#2a2a32" stroke="#4a4a54" stroke-width="3"/>`;
    return s;
  }

  // Crowd silhouettes behind glass, heads and shoulders.
  function crowd(x0, x1, y, col = "#120e16") {
    let s = "";
    for (let x = x0; x < x1; x += 34 + A.rnd() * 18) {
      const h = 40 + A.rnd() * 26, up = A.rnd() < 0.15;
      s += sh(blob(x, y - h, 13, 15, 0.08, 8), col, { sw: 0 }) + sh(soft([[x - 22, y], [x - 18, y - h + 16], [x + 18, y - h + 16], [x + 22, y]], 1), col, { sw: 0 });
      if (up) s += ink(line(x + 14, y - h + 18, x + 26, y - h - 30, 0.3), 9, { stroke: col });
    }
    return s;
  }

  // Potted palm.
  function palm(x, y, k = 1) {
    let s = sh(poly([[x - 26 * k, y - 50 * k], [x + 26 * k, y - 50 * k], [x + 20 * k, y], [x - 20 * k, y]], 1), "#8a3a2a");
    s += ink(curve([[x, y - 50 * k], [x - 4 * k, y - 120 * k], [x + 2 * k, y - 170 * k]]), 6 * k, { stroke: "#6a4a2a" });
    [[-90, -150], [-60, -200], [10, -215], [70, -195], [95, -140], [-20, -230]].forEach(([dx, dy]) => (s += sh(soft([[x, y - 170 * k], [x + dx * 0.5 * k, y + (dy - 30) * k * 0.95], [x + dx * k, y + dy * k], [x + dx * 0.55 * k, y + (dy + 12) * k]], 1), "#3f6a3a", { sw: 2 })));
    return s;
  }

  // Brass post and red velvet rope.
  function rope(x0, x1, y) {
    let s = "";
    const posts = [x0, (x0 + x1) / 2, x1];
    s += ink(curve([[x0, y - 60], [(x0 * 3 + x1) / 4, y - 36], [(x0 + x1) / 2, y - 60], [(x0 + x1 * 3) / 4, y - 36], [x1, y - 60]]), 7, { stroke: "#a01a2a" });
    posts.forEach((x) => (s += ink(line(x, y, x, y - 70, 0.2), 6, { stroke: Z.gold }) + sh(blob(x, y - 74, 8, 8, 0.05, 8), Z.gold, { sw: 1.5 }) + sh(blob(x, y, 16, 5, 0.05, 8), Z.gold, { sw: 1.5 })));
    return s;
  }

  // Cast-iron street lamp.
  function streetLamp(x, y) {
    let s = ink(line(x, y, x, y - 300, 0.4), 8, { stroke: "#1c1c22" }) + sh(blob(x, y, 20, 6, 0.05, 8), "#1c1c22");
    s += sh(poly([[x - 22, y - 300], [x + 22, y - 300], [x + 14, y - 350], [x - 14, y - 350]], 0.8), "#ffe0a0", { sw: 2.5 }) + sh(poly([[x - 26, y - 350], [x + 26, y - 350], [x, y - 372]], 0.6), "#1c1c22");
    return s;
  }

  // A 1970s saloon car seen from the side.
  function car(x, y) {
    let s = sh(soft([[x, y - 30], [x + 20, y - 70], [x + 90, y - 74], [x + 130, y - 120], [x + 260, y - 122], [x + 300, y - 76], [x + 380, y - 70], [x + 390, y - 30], [x + 380, y - 18], [x + 10, y - 18]], 1.5), "#1c1c22");
    s += sh(poly([[x + 140, y - 112], [x + 210, y - 112], [x + 210, y - 80], [x + 120, y - 80]], 0.6), "#3a4a5a", { sw: 2 }) + sh(poly([[x + 220, y - 112], [x + 255, y - 112], [x + 285, y - 80], [x + 220, y - 80]], 0.6), "#3a4a5a", { sw: 2 });
    [x + 80, x + 310].forEach((wx) => (s += `<circle cx="${wx}" cy="${y - 18}" r="30" fill="#141418" stroke="${P.ink}" stroke-width="3"/><circle cx="${wx}" cy="${y - 18}" r="12" fill="${Z.chromeDark}"/>`));
    s += sh(rect(x + 372, y - 58, 16, 12, 0.4), "#ffd38a", { sw: 1.5 });
    return s;
  }

  // Framed poster; kind "palm" or "disc".
  function poster(x, y, w, h, kind, bg = Z.pink) {
    let s = sh(rect(x, y, w, h, 1), bg, { sw: 3 });
    if (kind === "palm") {
      s += `<circle cx="${x + w * 0.62}" cy="${y + h * 0.42}" r="${w * 0.22}" fill="${Z.yellow}"/>`;
      s += ink(curve([[x + w * 0.3, y + h * 0.9], [x + w * 0.34, y + h * 0.55], [x + w * 0.4, y + h * 0.36]]), 4, { stroke: "#2a1418" });
      [-1, 1].forEach((k) => (s += sh(soft([[x + w * 0.4, y + h * 0.36], [x + w * (0.4 + 0.24 * k), y + h * 0.3], [x + w * (0.4 + 0.3 * k), y + h * 0.42]], 0.6), "#2a1418", { sw: 0 })));
    } else {
      s += `<circle cx="${x + w / 2}" cy="${y + h * 0.45}" r="${w * 0.3}" fill="${Z.gold}" stroke="${P.ink}" stroke-width="2"/><circle cx="${x + w / 2}" cy="${y + h * 0.45}" r="${w * 0.06}" fill="#f2efe8"/>`;
    }
    return s;
  }

  // Pinned notes on a cork board.
  function notes(x, y, w, h) {
    let s = sh(rect(x, y, w, h, 1), "#b98a52");
    for (let i = 0; i < 5; i++) {
      const nx = x + 12 + (i % 3) * (w / 3), ny = y + 12 + Math.floor(i / 3) * (h / 2);
      s += sh(rect(nx, ny, w / 3 - 18, h / 2 - 20, 0.6), i % 2 ? "#f2efe0" : "#f6e9a0", { sw: 1.4 }) + `<circle cx="${nx + 10}" cy="${ny + 4}" r="3" fill="#c0392b"/>`;
    }
    return s;
  }

  // Leather armchair.
  function armchair(x, y) {
    let s = sh(soft([[x, y], [x + 120, y], [x + 130, y - 150], [x + 110, y - 170], [x + 10, y - 170], [x - 10, y - 150]], 2), "#2a1c18");
    s += sh(rect(x - 20, y - 80, 30, 80, 1), "#3a2620") + sh(rect(x + 110, y - 80, 30, 80, 1), "#3a2620");
    return s;
  }

  // Feather boa hanging from a rack.
  function boa(x, y, len) {
    let s = "";
    for (let i = 0; i < 14; i++) s += sh(blob(x + Math.sin(i * 0.8) * 8, y + (i * len) / 14, 16, 14, 0.3, 9), "#f07ab0", { sw: 1, extra: 'filter="url(#f-fuzz)"' });
    return s;
  }

  Object.assign(K, { booth, candleTable, candleGlow, sconce, speaker, crowd, palm, rope, streetLamp, car, poster, notes, armchair, boa });
})();

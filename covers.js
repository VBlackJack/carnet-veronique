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

// Shelf covers, drawn with the same kit as the games. Each returns SVG for a 480x270 frame.
(function () {
  const A = CH.art, P = A.P;
  const COVERS = {
    goat() {
      A.srand(42);
      let s = `<rect width="480" height="270" fill="#d8dccf"/>`;
      s += A.sh(A.soft([[-20, 170], [160, 150], [320, 165], [500, 145], [500, 290], [-20, 290]], 4), P.meadowFar, { sw: 2 });
      s += A.sh(A.soft([[-20, 205], [200, 190], [500, 200], [500, 290], [-20, 290]], 4), P.meadow, { sw: 2 });
      for (let x = 10; x < 480; x += 70) s += A.sh(A.rect(x, 150, 10, 70, 1), P.wood, { sw: 2 });
      s += A.sh(A.rect(-10, 168, 500, 8, 1), P.woodLight, { sw: 2 });
      s += A.namedGoat("biscotte", 300, 250, 1.15, true);
      s += `<rect width="480" height="270" fill="url(#g-mist)" opacity=".35"/>`;
      return s;
    },
    disco() {
      A.srand(43);
      let s = `<rect width="480" height="270" fill="#1b1622"/>`;
      const cols = ["#e85a9a", "#f08a3a", "#f2d35a", "#2f8a8a", "#4a7ad0", "#7a4ab0"];
      for (let r = 0; r < 3; r++) for (let i = 0; i < 8; i++) s += `<rect x="${i * 62 - 6 + r * 10}" y="${190 + r * 28}" width="56" height="24" fill="${cols[(i + r) % 6]}" opacity=".85"/>`;
      s += `<polygon points="120,0 150,0 230,190 150,190" fill="#e85a9a" opacity=".25"/><polygon points="330,0 360,0 330,190 250,190" fill="#f2d35a" opacity=".25"/>`;
      s += A.ink(A.line(240, 0, 240, 40, 0.2), 2, { stroke: "#5a5a60" });
      s += `<circle cx="240" cy="96" r="56" fill="#c9d3d9" stroke="#3b2f2a" stroke-width="3"/>`;
      for (let i = -4; i <= 4; i++) s += `<ellipse cx="240" cy="96" rx="${Math.abs(i * 11)}" ry="56" fill="none" stroke="#7d8d99" stroke-width="1"/><line x1="${240 - Math.sqrt(Math.max(0, 3136 - (i * 11) ** 2))}" y1="${96 + i * 11}" x2="${240 + Math.sqrt(Math.max(0, 3136 - (i * 11) ** 2))}" y2="${96 + i * 11}" stroke="#7d8d99" stroke-width="1"/>`;
      for (let i = 0; i < 30; i++) s += `<circle cx="${(A.rnd() * 480).toFixed(1)}" cy="${(A.rnd() * 180).toFixed(1)}" r="${(1.5 + A.rnd() * 2.5).toFixed(1)}" fill="#fffbe8"/>`;
      return s;
    },
    glass() {
      A.srand(44);
      let s = `<rect width="480" height="270" fill="#1c2230"/>`;
      s += `<rect x="0" y="40" width="300" height="140" fill="#8a4a36" stroke="#3b2f2a" stroke-width="3"/>`;
      for (let x = 24; x < 290; x += 66) s += `<path d="M${x} 150V95Q${x} 72 ${x + 20} 66Q${x + 40} 72 ${x + 40} 95V150Z" fill="#ff9a3a" stroke="#3b2f2a" stroke-width="2.5"/>`;
      s += `<rect x="0" y="180" width="480" height="90" fill="#2f4a58"/>`;
      for (let x = 44; x < 290; x += 66) s += `<rect x="${x - 10}" y="190" width="20" height="4" rx="2" fill="#ff9a3a" opacity=".45"/><rect x="${x - 6}" y="204" width="12" height="4" rx="2" fill="#ff9a3a" opacity=".3"/>`;
      s += `<rect x="-20" y="120" width="520" height="50" fill="#dfe3e0" opacity=".25"/>`;
      // The chalice, lit, on the right
      s += `<ellipse cx="380" cy="214" rx="34" ry="8" fill="#9ad0c8" stroke="#3b2f2a" stroke-width="2.5"/><path d="M380 210V160" stroke="#9ad0c8" stroke-width="9"/><circle cx="380" cy="180" r="9" fill="#9ad0c8" stroke="#3b2f2a" stroke-width="2"/>`;
      s += `<path d="M336 96H424L408 150Q380 162 352 150Z" fill="#9ad0c8" fill-opacity=".85" stroke="#3b2f2a" stroke-width="3"/><rect x="346" y="106" width="68" height="12" fill="#2f6a9a" stroke="#3b2f2a" stroke-width="1.5"/><path d="M336 96H424" stroke="#d9b44a" stroke-width="4"/>`;
      s += `<circle cx="380" cy="130" r="90" fill="url(#g-warm)" opacity=".5"/>`;
      return s;
    },
    monocle() {
      A.srand(45);
      let s = `<rect width="480" height="270" fill="#2a261e"/>`;
      for (let x = -20; x < 500; x += 120) {
        s += `<rect x="${x}" y="30" width="110" height="200" fill="#463a30" stroke="#3b2f2a" stroke-width="2.5"/>`;
        for (let r = 0; r < 2; r++) s += `<rect x="${x + 22}" y="${55 + r * 80}" width="26" height="40" fill="${(x + r) % 3 ? "#ffd78a" : "#2a2420"}" stroke="#3b2f2a" stroke-width="2"/><rect x="${x + 62}" y="${55 + r * 80}" width="26" height="40" fill="${(x + r + 1) % 3 ? "#ffd78a" : "#2a2420"}" stroke="#3b2f2a" stroke-width="2"/>`;
      }
      s += `<rect x="0" y="230" width="480" height="40" fill="#3a342a"/>`;
      s += `<rect x="-20" y="70" width="520" height="150" fill="#d8c98e" opacity=".45"/>`;
      // The monocle on its cord, with the blue star sapphire reflected in it
      s += `<path d="M300 132q40 60 -10 110" stroke="#1f1a18" stroke-width="3" fill="none"/>`;
      s += `<circle cx="240" cy="130" r="62" fill="#ffffff" fill-opacity=".25" stroke="#c9a24a" stroke-width="9"/>`;
      s += `<circle cx="240" cy="130" r="20" fill="#2a4aa0" stroke="#3b2f2a" stroke-width="2"/>`;
      for (let a = 0; a < 6; a++) s += `<line x1="240" y1="130" x2="${(240 + Math.cos(a * Math.PI / 3) * 17).toFixed(1)}" y2="${(130 + Math.sin(a * Math.PI / 3) * 17).toFixed(1)}" stroke="#ffffff" stroke-width="2"/>`;
      s += `<path d="M206 98q12 -16 32 -18" stroke="#ffffff" stroke-width="4" fill="none" opacity=".8"/>`;
      return s;
    },
  };

  // The wordless pilot: the lost glasses floating over the orchard, Biscotte below.
  COVERS.spectacles = function () {
    A.srand(52);
    let s = `<rect width="480" height="270" fill="#e8e6d4"/><rect width="480" height="270" fill="#fff1c8" opacity=".45"/>`;
    s += A.sh(A.soft([[-20, 172], [140, 158], [300, 170], [500, 154], [500, 290], [-20, 290]], 4), P.meadowFar, { sw: 2 }) + A.sh(A.soft([[-20, 200], [200, 188], [500, 196], [500, 290], [-20, 290]], 4), P.meadow, { sw: 2 });
    s += A.sh(A.soft([[96, 220], [100, 150], [116, 150], [120, 220]], 1), P.wood, { sw: 2 }) + A.sh(A.blob(108, 120, 62, 46, 0.1, 12), "#4f6e3a", { sw: 2.4 });
    [[86, 112], [122, 104], [104, 136]].forEach(([x, y]) => (s += `<circle cx="${x}" cy="${y}" r="7" fill="#c0392b" stroke="${P.ink}" stroke-width="2"/>`));
    const lens = (cx) => `<rect x="${cx - 38}" y="56" width="76" height="52" rx="20" fill="#e8f2f0" fill-opacity=".6" stroke="#22403c" stroke-width="12"/><path d="M${cx - 20} 72q12 -10 26 -8" stroke="#ffffff" stroke-width="5" fill="none"/>`;
    s += lens(250) + lens(342) + `<path d="M286 76q10 -10 20 0" stroke="#22403c" stroke-width="9" fill="none"/>`;
    s += A.namedGoat("biscotte", 300, 250, 1.05, true, { knitCoat: "#b0302a" });
    return s;
  };

  CH.covers = COVERS;
})();

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

// Global namespace and game-wide constants. Each episode page sets CH.episode first
// (at least saveKey); its values override these defaults.
window.CH = window.CH || {};

CH.config = Object.freeze(Object.assign({
  locale: "fr",
  saveKey: "carnet.save.v1",
  stage: { width: 1600, height: 900 },
  portrait: { viewBox: "-95 -450 190 190" },
  // Hint system: each level costs one biscuit, three levels per goal.
  hint: { maxLevel: 3, cost: 1, pulseMs: 6000 },
  // Board feedback: near-miss threshold (wrong blanks), then from which failed try the
  // feedback counts the wrong blanks, and from which one it points at one of them.
  board: { nearMissMax: 2, countFromTry: 2, pinpointFromTry: 3 },
  // Hotspots briefly outlined when a scene opens, and for longer on demand (magnifier).
  // Labels shown by the magnifier: spacing in pixels, and how many lower spots to try.
  reveal: { enterMs: 1400, onDemandMs: 2000, labelGapPx: 4, labelTries: 6 },
  toastMs: 3200,
  toastMax: 3,
  helpMinClues: 2,
  playtimeTickMs: 1000,
  textureSeed: 7,
  paperTextureSize: 256,
  washTexture: { width: 320, height: 180, cell: 40 },
  biscotteIdleMs: 9000,
  acts: { opening: 0, night: 1, leads: 2, crossCheck: 3, ending: 4 },
}, CH.episode || {}));

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

// Sound effects of this episode, added to the engine's: water, hens, the frog, the
// sheet in the wind and the rattle of the scarecrow.
(function () {
  const snd = CH.mime.sound;

  snd.define("splash", [
    { noise: true, dur: 0.35, gain: 0.3, attack: 0.01, filter: { type: "bandpass", f0: 1800, f1: 500, q: 1 } },
    { type: "sine", f0: 900, f1: 300, dur: 0.12, gain: 0.08 },
  ]);
  snd.define("trickle", [0, 0.09, 0.2, 0.27].map((at, i) => ({ type: "sine", f0: 1400 + i * 260, f1: 1900 + i * 200, dur: 0.05, gain: 0.04, at })));
  snd.define("ribbit", [0, 0.2].map((at) => ({ type: "square", f0: 180, f1: 140, dur: 0.14, gain: 0.12, at, am: { rate: 40, depth: 0.8 }, filter: { type: "bandpass", f0: 700, q: 3 } })));
  snd.define("cluck", [0, 0.14, 0.26].map((at, i) => ({ type: "sawtooth", f0: 620 - i * 40, f1: 420, dur: 0.08, gain: 0.12, at, filter: { type: "bandpass", f0: 1200, q: 3 } })));
  snd.define("flap", [0, 0.18, 0.34].map((at) => ({ noise: true, dur: 0.12, gain: 0.2, at, filter: { type: "lowpass", f0: 900 } })));
  snd.define("clatter", [0, 0.07, 0.14, 0.21, 0.28, 0.35, 0.42].map((at) => ({ noise: true, dur: 0.04, gain: 0.22, at, filter: { type: "bandpass", f0: 1300, q: 2 } })));
})();

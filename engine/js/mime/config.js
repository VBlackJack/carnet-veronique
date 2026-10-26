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

// Constants of the wordless (pantomime) engine. Loaded after engine/js/config.js; the
// episode page may override any value through CH.episode.mime.
CH.mime = CH.mime || {};
CH.mime.config = Object.freeze(Object.assign({
  saveVersion: 1,
  soundKey: "mime.sound.muted",
  // The hero walks at this speed (stage pixels per second), never faster than minWalkMs.
  hero: { speed: 420, minWalkMs: 260, stepMs: 230, width: 230, scale: 0.78, viewBox: "-110 -200 230 215" },
  // Side of the arrow buttons that lead to another tableau, in stage pixels.
  exitSize: 90,
  // Smallest comfortable target for a finger, in CSS pixels: spots smaller than this on
  // screen still catch taps that land this close to them.
  touch: { minPx: 44 },
  // Actions of the hero, in milliseconds (they match the CSS animations).
  heroMs: { hop: 700, pull: 900, sniff: 900, shake: 700, push: 1100, climb: 1300 },
  // A new card is shown big, then flies to the sketchbook button.
  cardShowMs: 1500,
  cardFlyMs: 650,
  // A rebus bubble closes by itself after this time, or on a click.
  bubbleMs: 5200,
  bubbleMinMs: 600,
  // Bubble placement in stage pixels: distance to the edges, height above the speaker's
  // head, and how far (in percent of its width) the tail may move from the middle.
  bubbleLayout: { margin: 20, lift: 40, tailMin: 10, tailMax: 90 },
  // Blur of the opening and ending (Veronique's eyes without glasses).
  blurPx: 7,
  blurMs: 1600,
  fadeMs: 700,
  // The first time the sketchbook offers a pair, a ghost hand shows it: wait before it
  // appears, time per move, and pause on each card.
  ghostHand: { delayMs: 700, moveMs: 900, tapMs: 450 },
  // The bee comes to show the next useful spot after this much idle time: sooner on a
  // touch screen, where nothing glows under a hovering pointer.
  beeIdleMs: { mouse: 35000, touch: 18000 },
  // On touch screens, spots not yet touched shimmer briefly every few seconds of idleness.
  touchHint: { everyMs: 7000, showMs: 1400 },
  beeStayMs: 9000,
  playtimeTickMs: 1000,
  viewportSettleMs: 400,
  sound: {
    master: 0.55,
    ambience: 0.22,
    fadeMs: 900,
    noiseSeconds: 2,
  },
}, (CH.episode && CH.episode.mime) || {}));

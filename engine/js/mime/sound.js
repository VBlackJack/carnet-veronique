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

// Sound synthesised in the browser: no audio file. A sound effect is a list of voices
// (oscillator or noise, pitch glide, filter, vibrato, tremolo); an ambience is a set of
// drones, a wind and random events. The audio context starts on the first user gesture.
(function () {
  const C = CH.mime.config;
  const SC = C.sound;

  // ---------------------------------------------------------------- Presets
  // Voice fields: type | noise, f0 -> f1 (Hz), dur and at (s), gain, attack (s),
  // filter { type, f0 -> f1, q }, vib { rate, depth } (pitch), am { rate, depth } (volume).
  const seq = (type, freqs, step, dur, gain, filter) =>
    freqs.map((f, i) => ({ type, f0: f, dur, gain, at: i * step, attack: 0.01, filter }));

  const SFX = {
    tap: [{ type: "triangle", f0: 900, f1: 500, dur: 0.06, gain: 0.25 }],
    pop: [{ type: "sine", f0: 620, f1: 180, dur: 0.12, gain: 0.4 }],
    hoof: [{ noise: true, dur: 0.04, gain: 0.18, filter: { type: "bandpass", f0: 2200, q: 3 } }],
    card: [
      { noise: true, dur: 0.14, gain: 0.25, filter: { type: "highpass", f0: 2500 } },
      { type: "sine", f0: 660, f1: 990, dur: 0.25, gain: 0.18, at: 0.08 },
    ],
    chime: seq("sine", [784, 988, 1175, 1568], 0.09, 1.1, 0.22),
    nope: [
      { type: "sawtooth", f0: 300, f1: 260, dur: 0.18, gain: 0.16, vib: { rate: 9, depth: 18 }, filter: { type: "bandpass", f0: 1100, q: 2 } },
      { type: "sawtooth", f0: 280, f1: 230, dur: 0.24, gain: 0.16, vib: { rate: 9, depth: 18 }, filter: { type: "bandpass", f0: 1000, q: 2 }, at: 0.22 },
    ],
    bleat: [{ type: "sawtooth", f0: 470, f1: 420, dur: 0.55, gain: 0.2, attack: 0.03, vib: { rate: 7, depth: 30 }, filter: { type: "bandpass", f0: 1300, q: 2.5 } }],
    wonder: [{ type: "sine", f0: 400, f1: 820, dur: 0.35, gain: 0.22, vib: { rate: 6, depth: 12 } }],
    boing: [{ type: "sine", f0: 220, f1: 520, dur: 0.3, gain: 0.3, vib: { rate: 14, depth: 25 } }],
    creak: [{ type: "sawtooth", f0: 85, f1: 150, dur: 0.7, gain: 0.18, attack: 0.05, filter: { type: "bandpass", f0: 700, q: 9 }, am: { rate: 23, depth: 0.6 } }],
    rustle: [0, 0.12, 0.27, 0.4].map((at) => ({ noise: true, dur: 0.16, gain: 0.22, at, filter: { type: "bandpass", f0: 3200, q: 0.8 } })),
    whoosh: [{ noise: true, dur: 0.8, gain: 0.3, attack: 0.25, filter: { type: "bandpass", f0: 300, f1: 2600, q: 1.2 } }],
    puff: [{ noise: true, dur: 0.45, gain: 0.35, attack: 0.02, filter: { type: "lowpass", f0: 900, f1: 300 } }],
    purr: [{ noise: true, dur: 1.4, gain: 0.3, attack: 0.2, filter: { type: "lowpass", f0: 260 }, am: { rate: 24, depth: 0.8 } }],
    snore: [{ noise: true, dur: 1.2, gain: 0.22, attack: 0.5, filter: { type: "lowpass", f0: 200, f1: 700, q: 4 } }],
    caw: [0, 0.32].map((at) => ({ type: "sawtooth", f0: 720, f1: 480, dur: 0.22, gain: 0.16, at, filter: { type: "bandpass", f0: 1500, q: 3 } })),
    quack: [{ type: "square", f0: 520, f1: 340, dur: 0.18, gain: 0.14, filter: { type: "bandpass", f0: 1000, q: 4 } }],
    buzz: [{ type: "sawtooth", f0: 210, f1: 240, dur: 0.9, gain: 0.07, attack: 0.15, vib: { rate: 30, depth: 6 }, filter: { type: "lowpass", f0: 1200 } }],
    tick: [{ type: "square", f0: 2400, dur: 0.02, gain: 0.05, filter: { type: "highpass", f0: 1800 } }],
    crackle: [0, 0.05, 0.13].map((at) => ({ noise: true, dur: 0.03, gain: 0.12, at, filter: { type: "highpass", f0: 3000 } })),
    chirp: [{ type: "sine", f0: 2600, f1: 3400, dur: 0.09, gain: 0.08 }, { type: "sine", f0: 2900, f1: 3800, dur: 0.08, gain: 0.07, at: 0.14 }],
    tinkle: seq("sine", [1760, 2093, 2637], 0.06, 0.5, 0.12),
    disco: seq("square", [220, 262, 330, 440, 392, 330, 262, 330], 0.13, 0.12, 0.1, { type: "lowpass", f0: 1600 }),
    chord: [220, 277, 330, 440, 554].map((f, i) => ({ type: "triangle", f0: f, dur: 2.6, gain: 0.1, attack: 0.3 + i * 0.05, at: i * 0.04 })),
  };

  // ---------------------------------------------------------------- Engine
  let ctx = null, master = null, ambBus = null, noiseBuf = null;
  let muted = readMuted();
  let profile = null;
  let live = null;

  function readMuted() {
    try {
      return localStorage.getItem(C.soundKey) === "1";
    } catch (e) {
      return false;
    }
  }

  function writeMuted() {
    try {
      localStorage.setItem(C.soundKey, muted ? "1" : "0");
    } catch (e) {
      /* Storage unavailable: the choice lasts until the page closes. */
    }
  }

  function ensure() {
    if (ctx) return ctx;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = muted ? 0 : SC.master;
    master.connect(ctx.destination);
    ambBus = ctx.createGain();
    ambBus.gain.value = SC.ambience;
    ambBus.connect(master);
    noiseBuf = ctx.createBuffer(1, Math.round(ctx.sampleRate * SC.noiseSeconds), ctx.sampleRate);
    const data = noiseBuf.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    return ctx;
  }

  // Browsers only let audio start from a user gesture.
  function unlock() {
    const c = ensure();
    if (!c) return;
    const start = () => profile && !live && !muted && startAmbience(profile);
    if (c.state === "suspended") c.resume().then(start).catch(() => {});
    else start();
  }

  function noiseSource() {
    const src = ctx.createBufferSource();
    src.buffer = noiseBuf;
    src.loop = true;
    return src;
  }

  function lfo(rate, depth, target, t, end) {
    const o = ctx.createOscillator();
    o.frequency.value = rate;
    const g = ctx.createGain();
    g.gain.value = depth;
    o.connect(g).connect(target);
    o.start(t);
    if (end) o.stop(end);
    return o;
  }

  function voice(v, t0, out) {
    const t = t0 + (v.at || 0);
    const end = t + v.dur;
    const src = v.noise ? noiseSource() : ctx.createOscillator();
    if (!v.noise) {
      src.type = v.type || "sine";
      src.frequency.setValueAtTime(v.f0, t);
      if (v.f1) src.frequency.exponentialRampToValueAtTime(v.f1, end);
      if (v.vib) lfo(v.vib.rate, v.vib.depth, src.frequency, t, end);
    }
    let node = src;
    if (v.filter) {
      const f = ctx.createBiquadFilter();
      f.type = v.filter.type;
      f.frequency.setValueAtTime(v.filter.f0, t);
      if (v.filter.f1) f.frequency.exponentialRampToValueAtTime(v.filter.f1, end);
      f.Q.value = v.filter.q || 1;
      node.connect(f);
      node = f;
    }
    const env = ctx.createGain();
    const attack = Math.min(v.attack || 0.005, v.dur / 2);
    env.gain.setValueAtTime(0.0001, t);
    env.gain.exponentialRampToValueAtTime(v.gain, t + attack);
    env.gain.exponentialRampToValueAtTime(0.0001, end);
    node.connect(env);
    node = env;
    if (v.am) {
      const trem = ctx.createGain();
      trem.gain.value = 1 - v.am.depth / 2;
      lfo(v.am.rate, v.am.depth / 2, trem.gain, t, end);
      node.connect(trem);
      node = trem;
    }
    node.connect(out);
    src.start(t);
    src.stop(end + 0.05);
  }

  function playTo(name, out) {
    const voices = SFX[name];
    if (!voices || !ctx) return;
    const t = ctx.currentTime + 0.01;
    voices.forEach((v) => voice(v, t, out));
  }

  function play(name) {
    if (muted || !ensure()) return;
    playTo(name, master);
  }

  // ---------------------------------------------------------------- Ambience
  // Profile: { drones: [{ f, type, gain, swell }], wind: { gain, f }, events: [{ sfx, every: [min, max] }] }
  function startAmbience(p) {
    if (!ctx || ctx.state !== "running") return;
    const t = ctx.currentTime;
    const bus = ctx.createGain();
    bus.gain.setValueAtTime(0.0001, t);
    bus.gain.exponentialRampToValueAtTime(1, t + SC.fadeMs / 1000);
    bus.connect(ambBus);
    const sources = [];
    (p.drones || []).forEach((d) => {
      const o = ctx.createOscillator();
      o.type = d.type || "sine";
      o.frequency.value = d.f;
      const g = ctx.createGain();
      g.gain.value = d.gain;
      if (d.swell) sources.push(lfo(d.swell, d.gain * 0.6, g.gain, t));
      o.connect(g).connect(bus);
      o.start(t);
      sources.push(o);
    });
    if (p.wind) {
      const src = noiseSource();
      const f = ctx.createBiquadFilter();
      f.type = "lowpass";
      f.frequency.value = p.wind.f;
      sources.push(lfo(p.wind.sway || 0.15, p.wind.f * 0.5, f.frequency, t));
      const g = ctx.createGain();
      g.gain.value = p.wind.gain;
      src.connect(f).connect(g).connect(bus);
      src.start(t);
      sources.push(src);
    }
    live = { bus, sources, timers: [] };
    (p.events || []).forEach((ev) => schedule(live, ev));
  }

  function schedule(l, ev) {
    const delay = ev.every[0] + Math.random() * (ev.every[1] - ev.every[0]);
    l.timers.push(setTimeout(() => {
      if (live !== l) return;
      playTo(ev.sfx, l.bus);
      schedule(l, ev);
    }, delay));
  }

  function stopAmbience() {
    if (!live) return;
    const l = live;
    live = null;
    l.timers.forEach(clearTimeout);
    const t = ctx.currentTime;
    l.bus.gain.cancelScheduledValues(t);
    l.bus.gain.setValueAtTime(l.bus.gain.value, t);
    l.bus.gain.exponentialRampToValueAtTime(0.0001, t + SC.fadeMs / 1000);
    l.sources.forEach((s) => s.stop(t + SC.fadeMs / 1000 + 0.05));
  }

  function ambience(p) {
    if (p === profile && live) return;
    profile = p || null;
    if (ctx) stopAmbience();
    if (profile && !muted && ctx) startAmbience(profile);
  }

  function setMuted(on) {
    muted = !!on;
    writeMuted();
    if (!ensure()) return;
    const t = ctx.currentTime;
    master.gain.cancelScheduledValues(t);
    master.gain.setTargetAtTime(muted ? 0 : SC.master, t, 0.08);
    if (muted) stopAmbience();
    else unlock();
  }

  // Quiet while the page is hidden.
  document.addEventListener("visibilitychange", () => {
    if (!ctx) return;
    if (document.hidden) ctx.suspend();
    else if (!muted) ctx.resume();
  });

  // Episodes may add their own effects.
  function define(name, voices) {
    SFX[name] = voices;
  }

  CH.mime.sound = { play, ambience, unlock, setMuted, isMuted: () => muted, define, seq };
})();

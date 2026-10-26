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

// The wordless game: state, save, script runner, title and end screens, buttons, and the
// bee that comes to help after a while. The episode provides CH.mimeStory:
//   FIRST_SCENE, HERO_LOOK, scenes { id: { ground, start, ambience, draw, spots, exits } },
//   CARDS { id: { pic } }, CARD_ORDER, DEDS [{ id, pairs, requires, pic }], CROSSED,
//   PICS, RULES [{ id, when, steps }], GOALS [{ done, target }], EGGS, CUTS, titleArt, endArt.
// Script steps: walk, move, face, hero, beat (+ ms, flag), flag, card, ded, egg, bubble,
// sfx, wait, go (+ at), blur, heroHidden, cut, if/then/else, fn, end, together (in parallel).
(function () {
  const C = CH.mime.config;
  const ST = () => CH.mimeStory;
  const S = () => CH.mime.stage;
  const snd = () => CH.mime.sound;
  const t = (k, p) => CH.t(k, p);
  const esc = (x) => CH.i18n.escapeHtml(x);
  const el = {};

  let s = null;
  let busy = false;
  let beat = null;
  let epoch = 0;
  let idleTimer = null;
  let beeTimer = null;
  // The last spot or exit touched while the game was busy: played once it is free,
  // so a click during a walk, a beat or a card is never lost.
  let pending = null;

  // ---------------------------------------------------------------- State
  function fresh() {
    return { v: C.saveVersion, scene: ST().FIRST_SCENE, flags: {}, cards: [], deds: [], eggs: {}, seen: {}, visited: {}, playMs: 0, finished: false, heroX: null, started: false };
  }

  function save() {
    try {
      localStorage.setItem(CH.config.saveKey, JSON.stringify(s));
    } catch (e) {
      /* Storage unavailable: the game still runs, only without resume. */
    }
  }

  function loadSaved() {
    try {
      const data = JSON.parse(localStorage.getItem(CH.config.saveKey) || "null");
      return data && data.v === C.saveVersion ? data : null;
    } catch (e) {
      return null;
    }
  }

  const handlers = { spot: (h) => onSpot(h), exit: (e) => onExit(e) };

  function render() {
    S().render(s, beat, handlers);
    updateBadge();
  }

  function addCard(id) {
    if (s.cards.includes(id)) return false;
    s.cards.push(id);
    return true;
  }

  function addDed(id) {
    if (s.deds.includes(id)) return false;
    s.deds.push(id);
    s.seen["d:" + id] = true;
    save();
    return true;
  }

  function markSeen() {
    s.cards.forEach((id) => (s.seen[id] = true));
    s.deds.forEach((id) => (s.seen["d:" + id] = true));
    updateBadge();
    save();
  }

  function updateBadge() {
    if (!el.badge || !s) return;
    el.badge.hidden = !s.cards.some((id) => !s.seen[id]);
  }

  // ---------------------------------------------------------------- Runner
  async function run(steps) {
    if (!steps) return;
    if (typeof steps === "function") steps = steps(s);
    const started = epoch;
    for (const st of steps) {
      if (started !== epoch) return;
      await exec(st);
    }
  }

  async function exec(st) {
    if (Array.isArray(st)) return run(st);
    if (st.together) return Promise.all(st.together.map(exec));
    const sc = ST().scenes[s.scene];
    if (st.walk !== undefined) await S().walkTo(st.walk, sc.ground);
    if (st.move) await S().walkTo(st.move[0], st.move[1], { hop: !!st.hop, ms: st.ms });
    if (st.face) S().face(st.face);
    if (st.sfx) snd().play(st.sfx);
    if (st.hero) await S().act(st.hero);
    if (st.beat) {
      // Tableaux draw the new state and animate how it arrives: the flag comes first.
      if (st.flag) s.flags[st.flag] = true;
      beat = st.beat;
      render();
      await S().wait(st.ms || 0);
      beat = null;
      render();
    } else if (st.flag) {
      s.flags[st.flag] = true;
      render();
    }
    if (st.card && addCard(st.card)) {
      updateBadge();
      await CH.mime.show.reveal(st.card);
      render();
    }
    if (st.ded) addDed(st.ded);
    if (st.egg && !s.eggs[st.egg]) {
      s.eggs[st.egg] = true;
      snd().play("tinkle");
    }
    if (st.bubble) await CH.mime.show.bubble(st.bubble);
    if (st.wait) await S().wait(st.wait);
    if (st.go) await goScene(st.go, st.at);
    if (st.blur !== undefined) await setBlur(st.blur);
    if (st.heroHidden !== undefined) S().setHeroVisible(!st.heroHidden);
    if (st.cut) await run(ST().CUTS[st.cut]);
    if (st.if) await run(st.if(s) ? st.then : st.else);
    if (st.fn) await st.fn(s);
    if (st.end) await finish();
    s.heroX = S().hero.x;
    save();
  }

  async function goScene(id, at) {
    el.veil.classList.add("m-on");
    await S().wait(C.fadeMs);
    s.scene = id;
    const sc = ST().scenes[id];
    S().placeHero(at !== undefined ? at : sc.start, sc.ground);
    render();
    snd().ambience(sc.ambience);
    el.veil.classList.remove("m-on");
    await S().wait(C.fadeMs);
  }

  async function setBlur(on) {
    el.stage.style.setProperty("--m-blur", on ? `${C.blurPx}px` : "0px");
    await S().wait(C.blurMs);
  }

  // Wraps a player action: blocks input, runs, checks the story rules, saves.
  async function action(fn) {
    if (busy) return;
    busy = true;
    const started = epoch;
    el.stage.classList.add("m-busy");
    S().beeHide();
    try {
      await fn();
      if (started === epoch) await progress();
    } finally {
      if (started === epoch) {
        busy = false;
        el.stage.classList.remove("m-busy");
        save();
        restartIdle();
        if (pending) setTimeout(replayPending, 0);
      }
    }
  }

  function queue(kind, id) {
    pending = { kind, id, scene: s.scene };
    el.stage.querySelectorAll(".m-queued").forEach((n) => n.classList.remove("m-queued"));
    const node = el.stage.querySelector(`[data-${kind}="${id}"]`);
    if (node) node.classList.add("m-queued");
    snd().play("tap");
  }

  // Replays the queued click if it still makes sense: same tableau, spot still there,
  // and nothing else (sketchbook, title or end screen) has taken over.
  function replayPending() {
    const p = pending;
    pending = null;
    if (!p || busy || !s || s.finished || p.scene !== s.scene || !el.screen.hidden || CH.mime.book.isOpen()) return;
    const sc = ST().scenes[s.scene];
    if (p.kind === "spot") {
      const h = sc.spots.find((x) => x.id === p.id);
      if (h && (!h.when || h.when(s))) onSpot(h);
    } else {
      const e = (sc.exits || []).find((x) => x.to === p.id);
      if (e && (!e.when || e.when(s))) onExit(e);
    }
  }

  async function progress() {
    for (const rule of ST().RULES) {
      if (s.flags["rule:" + rule.id] || !rule.when(s)) continue;
      s.flags["rule:" + rule.id] = true;
      await run(rule.steps);
    }
  }

  function onSpot(h) {
    snd().unlock();
    if (busy) return queue("spot", h.id);
    s.visited[`${s.scene}.${h.id}`] = true;
    action(async () => {
      if (h.at !== undefined) await S().walkTo(h.at, ST().scenes[s.scene].ground);
      await run(h.steps);
    });
  }

  function onExit(e) {
    snd().unlock();
    if (busy) return queue("exit", e.to);
    action(async () => {
      await S().walkTo(e.heroAt, ST().scenes[s.scene].ground);
      await goScene(e.to, e.enterAt);
    });
  }

  // ---------------------------------------------------------------- Bee
  function restartIdle() {
    clearTimeout(idleTimer);
    clearTimeout(beeTimer);
    S().beeHide();
    idleTimer = setTimeout(showBee, isTouch() ? C.beeIdleMs.touch : C.beeIdleMs.mouse);
  }

  // A touch screen has no hover: the spots never glow under the finger before a tap.
  const isTouch = () => window.matchMedia("(hover: none)").matches;

  // Every few idle seconds on a touch screen, the spots not yet touched shimmer. Secret
  // spots (the little details counted at the end) are left for the player to find.
  function touchHint() {
    if (!isTouch() || !s || busy || s.finished || !el.screen.hidden || CH.mime.book.isOpen()) return;
    const ids = ST().scenes[s.scene].spots
      .filter((h) => !h.secret && (!h.when || h.when(s)) && !s.visited[`${s.scene}.${h.id}`])
      .map((h) => h.id);
    S().hintSpots(ids, C.touchHint.showMs);
  }

  function showBee() {
    if (!s || busy || !el.screen.hidden || CH.mime.book.isOpen() || s.finished) return restartIdle();
    const goal = ST().GOALS.find((g) => !g.done(s));
    if (!goal) return;
    if (goal.target === "book") S().beeToElement(el.book);
    else S().beeTo(S().targetBox(s, goal.target));
    beeTimer = setTimeout(restartIdle, C.beeStayMs);
  }

  // ---------------------------------------------------------------- Screens
  const ICONS = {
    play: `<svg viewBox="0 0 60 60" aria-hidden="true"><path d="M20 12l28 18-28 18z" fill="currentColor" stroke="currentColor" stroke-width="4" stroke-linejoin="round"/></svg>`,
    restart: `<svg viewBox="0 0 60 60" aria-hidden="true"><path d="M44 22a17 17 0 1 0 3 14" fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round"/><path d="M48 10v14H34" fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    home: `<svg viewBox="0 0 60 60" aria-hidden="true"><path d="M10 30L30 12l20 18M16 26v22h28V26" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/><path d="M26 48V36h8v12" fill="none" stroke="currentColor" stroke-width="5"/></svg>`,
    book: `<svg viewBox="0 0 60 60" aria-hidden="true"><path d="M8 14q11 -5 22 2q11 -7 22 -2v32q-11 -5 -22 2q-11 -7 -22 -2z" fill="none" stroke="currentColor" stroke-width="4.5" stroke-linejoin="round"/><path d="M30 16v32" stroke="currentColor" stroke-width="4"/><path d="M14 24q6 -2 11 1M14 32q6 -2 11 1M35 24q6 -2 11 1" stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round"/></svg>`,
    soundOn: `<svg viewBox="0 0 60 60" aria-hidden="true"><path d="M10 24h10l12 -10v32l-12 -10H10z" fill="currentColor" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/><path d="M40 22q6 8 0 16M45 16q11 14 0 28" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/></svg>`,
    soundOff: `<svg viewBox="0 0 60 60" aria-hidden="true"><path d="M10 24h10l12 -10v32l-12 -10H10z" fill="currentColor" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/><path d="M40 22l12 16M52 22L40 38" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/></svg>`,
    full: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9V4h5M15 4h5v5M20 15v5h-5M9 20H4v-5" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    fullExit: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 4v5H4M20 9h-5V4M15 20v-5h5M4 15h5v5" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    clock: `<svg viewBox="0 0 60 60" aria-hidden="true"><circle cx="30" cy="30" r="22" fill="none" stroke="currentColor" stroke-width="5"/><path d="M30 16v14l10 6" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round"/></svg>`,
    star: `<svg viewBox="0 0 60 60" aria-hidden="true"><path d="M30 8l6 15 16 1-12 10 4 16-14-9-14 9 4-16-12-10 16-1z" fill="currentColor" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/></svg>`,
    rotate: `<svg class="rotate-icon" viewBox="0 0 120 120" aria-hidden="true"><rect x="38" y="20" width="44" height="76" rx="8" fill="none" stroke="currentColor" stroke-width="6"/><circle cx="60" cy="86" r="3.5" fill="currentColor"/><path d="M98 62a38 38 0 0 1-30 38" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round"/><path d="M60 96l9 6l-2-11" fill="none" stroke="currentColor" stroke-width="5" stroke-linejoin="round" stroke-linecap="round"/></svg>`,
  };

  const iconBtn = (cls, icon, label) => `<button class="m-big ${cls}" aria-label="${esc(t(label))}">${ICONS[icon]}</button>`;

  function showTitle() {
    S().beeHide();
    clearTimeout(idleTimer);
    const saved = loadSaved();
    const canResume = saved && saved.started && !saved.finished;
    const buttons = canResume
      ? iconBtn("m-resume", "play", "mime.title.resume") + iconBtn("m-restart m-small", "restart", "mime.title.restart")
      : iconBtn("m-new", "play", "mime.title.play");
    el.screen.innerHTML = `<div class="m-title">
      <svg class="m-title-art" viewBox="0 0 1600 900" aria-hidden="true">${ST().titleArt()}</svg>
      <h1 class="m-sr">${esc(t("episode.title"))}</h1>
      <div class="m-title-buttons">${buttons}${iconBtn("m-home m-small", "home", "mime.hud.home")}</div>
    </div>`;
    el.screen.hidden = false;
    el.hud.hidden = true;
    const on = (sel, fn) => {
      const b = el.screen.querySelector(sel);
      if (b) b.addEventListener("click", () => {
        snd().unlock();
        fn();
      });
    };
    on(".m-new", () => start(null));
    on(".m-resume", () => start(saved));
    on(".m-restart", () => start(null));
    on(".m-home", goHome);
  }

  function start(saved) {
    epoch++;
    busy = false;
    beat = null;
    pending = null;
    s = saved || fresh();
    // Saves from before the touch hints have no record of visited spots.
    s.visited = s.visited || {};
    el.screen.hidden = true;
    el.hud.hidden = false;
    el.stage.classList.remove("m-busy");
    const sc = ST().scenes[s.scene];
    S().setHeroVisible(true);
    S().placeHero(s.heroX !== null ? s.heroX : sc.start, sc.ground);
    S().face(1);
    // The opening starts blurred (Veronique's eyes), without a transition.
    el.stage.classList.add("m-instant");
    el.stage.style.setProperty("--m-blur", s.started ? "0px" : `${C.blurPx}px`);
    void el.stage.offsetWidth;
    el.stage.classList.remove("m-instant");
    render();
    snd().ambience(sc.ambience);
    if (!s.started) {
      s.started = true;
      action(() => run(ST().CUTS.opening));
    } else restartIdle();
  }

  async function finish() {
    s.finished = true;
    save();
    snd().ambience(null);
    const fmt = (ms) => {
      const sec = Math.round(ms / 1000);
      return `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, "0")}`;
    };
    const eggs = ST().EGGS.filter((e) => s.eggs[e]).length;
    el.screen.innerHTML = `<div class="m-end">
      <svg class="m-title-art" viewBox="0 0 1600 900" aria-hidden="true">${ST().endArt()}</svg>
      <div class="m-stats">
        <div class="m-stat" role="img" aria-label="${esc(t("mime.end.time", { value: fmt(s.playMs) }))}">${ICONS.clock}<span>${fmt(s.playMs)}</span></div>
        <div class="m-stat" role="img" aria-label="${esc(t("mime.end.deductions", { found: s.deds.length, total: ST().DEDS.length }))}">${ICONS.book}<span>${s.deds.length}/${ST().DEDS.length}</span></div>
        <div class="m-stat" role="img" aria-label="${esc(t("mime.end.details", { found: eggs, total: ST().EGGS.length }))}">${ICONS.star}<span>${eggs}/${ST().EGGS.length}</span></div>
      </div>
      <div class="m-title-buttons">${iconBtn("m-replay", "restart", "mime.end.replay")}${iconBtn("m-home m-small", "home", "mime.hud.home")}</div>
    </div>`;
    el.screen.hidden = false;
    el.hud.hidden = true;
    el.screen.querySelector(".m-replay").addEventListener("click", () => start(null));
    el.screen.querySelector(".m-home").addEventListener("click", goHome);
  }

  function goHome() {
    window.location.href = CH.config.shelfUrl;
  }

  // ---------------------------------------------------------------- Buttons
  function openBook() {
    if (busy || !s) return;
    snd().unlock();
    S().beeHide();
    busy = true;
    CH.mime.book.open(() => {
      busy = false;
      action(() => Promise.resolve());
    });
  }

  function updateSoundButton() {
    const off = snd().isMuted();
    el.sound.innerHTML = off ? ICONS.soundOff : ICONS.soundOn;
    el.sound.setAttribute("aria-label", t(off ? "mime.hud.sound_on" : "mime.hud.sound_off"));
    el.sound.setAttribute("aria-pressed", String(off));
  }

  const fullscreenSupported = () => !!(document.fullscreenEnabled || document.webkitFullscreenEnabled);
  const isFullscreen = () => !!(document.fullscreenElement || document.webkitFullscreenElement);

  function toggleFullscreen() {
    if (isFullscreen()) {
      const exit = document.exitFullscreen || document.webkitExitFullscreen;
      if (exit) exit.call(document);
      return;
    }
    const root = document.documentElement;
    const request = root.requestFullscreen || root.webkitRequestFullscreen;
    if (!request) return;
    const result = request.call(root, { navigationUI: "hide" });
    const lock = () => screen.orientation && screen.orientation.lock && screen.orientation.lock("landscape").catch(() => {});
    if (result && result.then) result.then(lock).catch(() => {});
  }

  function updateFullscreenButton() {
    const on = isFullscreen();
    el.full.innerHTML = on ? ICONS.fullExit : ICONS.full;
    el.full.setAttribute("aria-label", t(on ? "mime.hud.fullscreen_exit" : "mime.hud.fullscreen"));
  }

  // Same measure as the classic engine: the stage follows the area really visible.
  function fitViewport() {
    const vv = window.visualViewport;
    if (vv && vv.scale > 1.01) return;
    const w = Math.round(vv ? vv.width : window.innerWidth);
    const h = Math.round(vv ? vv.height : window.innerHeight);
    // A page opened in the background can measure 0 x 0: keep the CSS fallback then,
    // or the stage stays collapsed until the next resize.
    if (!w || !h) return;
    const root = document.documentElement.style;
    root.setProperty("--app-w", `${w}px`);
    root.setProperty("--app-h", `${h}px`);
  }

  function setupViewport() {
    const refit = () => {
      fitViewport();
      setTimeout(fitViewport, C.viewportSettleMs);
    };
    fitViewport();
    ["resize", "orientationchange", "pageshow"].forEach((ev) => window.addEventListener(ev, refit));
    document.addEventListener("visibilitychange", () => !document.hidden && refit());
    ["fullscreenchange", "webkitfullscreenchange"].forEach((ev) => document.addEventListener(ev, () => {
      refit();
      updateFullscreenButton();
    }));
    if (window.visualViewport) window.visualViewport.addEventListener("resize", refit);
  }

  function init() {
    ["screen", "hud", "veil"].forEach((id) => (el[id] = document.getElementById("m-" + id)));
    el.stage = document.getElementById("stage");
    el.rotate = document.getElementById("rotate");
    el.book = document.getElementById("m-btn-book");
    el.badge = document.getElementById("m-badge");
    el.sound = document.getElementById("m-btn-sound");
    el.full = document.getElementById("m-btn-full");
    el.home = document.getElementById("m-btn-home");
    document.getElementById("defs").innerHTML = CH.art.defs() + GRAIN_DEF;
    document.getElementById("m-grain").innerHTML = `<svg width="100%" height="100%" aria-hidden="true"><rect width="100%" height="100%" filter="url(#m-f-grain)"/></svg>`;
    document.title = t("episode.title");
    el.stage.style.setProperty("--m-blur-ms", `${C.blurMs}ms`);
    el.stage.style.setProperty("--m-fade-ms", `${C.fadeMs}ms`);
    el.stage.style.setProperty("--m-touch", `${C.touch.minPx}px`);
    S().init();
    CH.mime.show.init();
    CH.mime.book.init();
    el.book.innerHTML = ICONS.book + el.book.innerHTML;
    el.book.setAttribute("aria-label", t("mime.hud.sketchbook"));
    el.book.addEventListener("click", openBook);
    el.sound.addEventListener("click", () => {
      snd().setMuted(!snd().isMuted());
      updateSoundButton();
    });
    el.home.innerHTML = ICONS.home;
    el.home.setAttribute("aria-label", t("mime.hud.home"));
    el.home.addEventListener("click", () => !busy && showTitle());
    el.full.hidden = !fullscreenSupported();
    el.full.addEventListener("click", toggleFullscreen);
    el.rotate.innerHTML = ICONS.rotate;
    el.rotate.setAttribute("aria-label", t("mime.rotate"));
    updateSoundButton();
    updateFullscreenButton();
    setupViewport();
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && CH.mime.book.isOpen()) CH.mime.book.close();
    });
    document.addEventListener("pointerdown", () => s && !busy && restartIdle());
    setInterval(() => {
      if (!document.hidden && s && el.screen.hidden && !s.finished) s.playMs += C.playtimeTickMs;
    }, C.playtimeTickMs);
    setInterval(touchHint, C.touchHint.everyMs);
    showTitle();
  }

  // Grain laid over the whole stage, for the look of printed paper.
  const GRAIN_DEF = `<filter id="m-f-grain" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" seed="3"/><feColorMatrix values="0 0 0 0 0.23  0 0 0 0 0.18  0 0 0 0 0.16  0 0 0 0.55 0"/></filter>`;

  CH.mime.game = {
    init, state: () => s, addDed, markSeen, setFlag: (id) => { s.flags[id] = true; save(); }, nudgeIdle: restartIdle, isBusy: () => busy,
    // Lets a test page jump into the story.
    debug: { run: (steps) => action(() => run(steps)), progress: () => action(() => Promise.resolve()) },
  };
})();

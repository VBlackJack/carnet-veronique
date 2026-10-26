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

// The wordless stage: a tableau in two SVG layers (behind and in front of the hero),
// the hero who walks to what the player touches, the clickable spots and the bee that
// shows the way. A tableau's draw(state, beat) returns { back, front } in a 1600x900
// frame; a beat is a short animated transition between two states of the tableau.
(function () {
  const C = CH.mime.config;
  const A = CH.art;
  const W = CH.config.stage.width;
  const H = CH.config.stage.height;
  const el = {};
  const hero = { x: 0, y: 0, facing: 1 };
  let walkTimer = null;

  const pctX = (x) => `${(x / W) * 100}%`;
  const pctY = (y) => `${(y / H) * 100}%`;
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));

  function init() {
    ["back", "front", "spots", "hero", "bee"].forEach((id) => (el[id] = document.getElementById("m-" + id)));
    const k = C.hero.scale;
    el.hero.style.width = pctX(C.hero.width * k);
    const look = CH.mimeStory.HERO_LOOK || {};
    el.hero.innerHTML = `<div class="m-hero-flip"><div class="m-hero-body"><svg viewBox="${C.hero.viewBox}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><g filter="url(#f-rough-s)">${A.namedGoat("biscotte", 0, 0, 1, false, look)}</g></svg></div></div>`;
    el.bee.innerHTML = beeSvg();
    el.spots.addEventListener("click", nearTap);
  }

  function wrap(content) {
    return `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${content}</svg>`;
  }

  // ---------------------------------------------------------------- Tableau
  function render(s, beat, handlers) {
    const sc = CH.mimeStory.scenes[s.scene];
    const d = sc.draw(s, beat || null);
    el.back.innerHTML = wrap(d.back || "");
    el.front.innerHTML = wrap(d.front || "");
    renderSpots(s, sc, handlers);
  }

  // Spots keep the size of what they cover, smallest on top where they overlap. A tap
  // just beside a small spot still reaches it: see nearTap.
  let live = { spots: [], handlers: null };

  function renderSpots(s, sc, handlers) {
    const t = CH.t;
    const spots = sc.spots.filter((h) => !h.when || h.when(s)).sort((a, b) => b.w * b.h - a.w * a.h);
    live = { spots, handlers };
    let html = spots.map((h) => `<button class="m-spot" data-spot="${h.id}" style="left:${pctX(h.x)};top:${pctY(h.y)};width:${pctX(h.w)};height:${pctY(h.h)}" aria-label="${CH.i18n.escapeHtml(t(`hs.${s.scene}.${h.id}`))}"></button>`).join("");
    html += (sc.exits || []).filter((e) => !e.when || e.when(s)).map((e) => `<button class="m-exit m-exit-${e.side}" data-exit="${e.to}" style="left:${pctX(e.x + C.exitSize / 2)};top:${pctY(e.y + C.exitSize / 2)};width:${pctX(C.exitSize)};height:${pctY(C.exitSize)}" aria-label="${CH.i18n.escapeHtml(t("mime.nav.go", { name: t(`scene.${e.to}.name`) }))}">${ARROW}</button>`).join("");
    el.spots.innerHTML = html;
    el.spots.querySelectorAll("[data-spot]").forEach((b) => b.addEventListener("click", () => handlers.spot(sc.spots.find((h) => h.id === b.dataset.spot))));
    el.spots.querySelectorAll("[data-exit]").forEach((b) => b.addEventListener("click", () => handlers.exit(sc.exits.find((e) => e.to === b.dataset.exit))));
  }

  // A tap on the empty stage goes to the nearest spot if the spot, grown to the minimum
  // touch size around its centre, would have caught it. Exits are buttons already sized
  // for a finger in CSS.
  function nearTap(e) {
    if (e.target !== el.spots || !live.handlers) return;
    const r = el.spots.getBoundingClientRect();
    if (!r.width) return;
    const x = ((e.clientX - r.left) / r.width) * W;
    const y = ((e.clientY - r.top) / r.height) * H;
    const min = (C.touch.minPx / r.width) * W;
    let best = null;
    live.spots.forEach((h) => {
      const dx = Math.max(0, Math.abs(x - (h.x + h.w / 2)) - h.w / 2);
      const dy = Math.max(0, Math.abs(y - (h.y + h.h / 2)) - h.h / 2);
      if (dx > Math.max(0, (min - h.w) / 2) || dy > Math.max(0, (min - h.h) / 2)) return;
      const d = Math.hypot(dx, dy);
      if (!best || d < best.d || (d === best.d && h.w * h.h < best.h.w * best.h.h)) best = { h, d };
    });
    if (best) live.handlers.spot(best.h);
  }

  // Briefly shimmers the given spots (touch screens: nothing shows them otherwise).
  function hintSpots(ids, ms) {
    ids.forEach((id) => {
      const b = el.spots.querySelector(`[data-spot="${id}"]`);
      if (!b) return;
      b.classList.remove("m-hint");
      void b.offsetWidth;
      b.classList.add("m-hint");
      setTimeout(() => b.classList.remove("m-hint"), ms);
    });
  }

  // Bounding box of a spot or an exit, in stage coordinates, for the bee.
  function targetBox(s, target) {
    const sc = CH.mimeStory.scenes[s.scene];
    const [sceneId, id] = target.split(".");
    if (sceneId !== s.scene) {
      const exit = (sc.exits || []).find((e) => e.to === sceneId) || (sc.exits || [])[0];
      return exit ? { x: exit.x, y: exit.y, w: C.exitSize, h: C.exitSize } : null;
    }
    return sc.spots.find((h) => h.id === id) || null;
  }

  // ---------------------------------------------------------------- Hero
  function placeHero(x, y) {
    const k = C.hero.scale;
    const [vx, vy] = C.hero.viewBox.split(" ").map(Number);
    el.hero.style.left = pctX(x + vx * k);
    el.hero.style.top = pctY(y + vy * k);
    hero.x = x;
    hero.y = y;
  }

  function face(dir) {
    hero.facing = dir;
    el.hero.classList.toggle("m-left", dir < 0);
  }

  function setHeroVisible(on) {
    el.hero.hidden = !on;
  }

  // Walks (or hops, with arc) to a point; resolves on arrival.
  async function walkTo(x, y, opts = {}) {
    const ty = y === undefined || y === null ? hero.y : y;
    const dist = Math.hypot(x - hero.x, ty - hero.y);
    if (dist < 2) return;
    if (Math.abs(x - hero.x) > 2) face(x > hero.x ? 1 : -1);
    const ms = opts.ms || Math.max(C.hero.minWalkMs, (dist / C.hero.speed) * 1000);
    el.hero.style.transitionDuration = `${ms}ms`;
    el.hero.classList.add(opts.hop ? "m-hopping" : "m-walking");
    if (!opts.hop) {
      clearInterval(walkTimer);
      walkTimer = setInterval(() => CH.mime.sound.play("hoof"), C.hero.stepMs);
    } else CH.mime.sound.play("boing");
    placeHero(x, ty);
    await wait(ms);
    clearInterval(walkTimer);
    el.hero.classList.remove("m-walking", "m-hopping");
    el.hero.style.transitionDuration = "0ms";
  }

  async function act(name) {
    const body = el.hero.querySelector(".m-hero-body");
    body.classList.remove(`m-act-${name}`);
    void body.offsetWidth;
    body.classList.add(`m-act-${name}`);
    await wait(C.heroMs[name] || C.heroMs.hop);
    body.classList.remove(`m-act-${name}`);
  }

  // ---------------------------------------------------------------- Bee
  function beeSvg() {
    return `<svg viewBox="-30 -30 60 60" aria-hidden="true"><g class="m-bee-body">
      <ellipse cx="-4" cy="-14" rx="10" ry="13" fill="#ffffff" opacity=".7" stroke="${A.P.ink}" stroke-width="1.5" class="m-wing"/>
      <ellipse cx="8" cy="-13" rx="9" ry="12" fill="#ffffff" opacity=".7" stroke="${A.P.ink}" stroke-width="1.5" class="m-wing"/>
      <ellipse cx="0" cy="0" rx="16" ry="11" fill="#f2c03a" stroke="${A.P.ink}" stroke-width="2.4"/>
      <path d="M-4 -10v20M5 -10v20" stroke="${A.P.ink}" stroke-width="4"/>
      <circle cx="17" cy="-2" r="6" fill="${A.P.ink}"/><path d="M-16 0l-7 3" stroke="${A.P.ink}" stroke-width="2.4"/>
    </g></svg>`;
  }

  function beeTo(box) {
    if (!box) return;
    el.bee.hidden = false;
    void el.bee.offsetWidth;
    el.bee.style.left = pctX(box.x + box.w / 2);
    el.bee.style.top = pctY(box.y + box.h / 2);
    el.bee.classList.add("m-bee-on");
    CH.mime.sound.play("buzz");
  }

  function beeToElement(node) {
    const stage = document.getElementById("stage").getBoundingClientRect();
    const r = node.getBoundingClientRect();
    const sx = W / stage.width, sy = H / stage.height;
    beeTo({ x: (r.left - stage.left) * sx, y: (r.top - stage.top) * sy + r.height * sy, w: r.width * sx, h: r.height * sy });
  }

  function beeHide() {
    el.bee.classList.remove("m-bee-on");
    el.bee.hidden = true;
  }

  const ARROW = `<svg viewBox="0 0 60 60" aria-hidden="true"><path d="M12 30h32M32 16l14 14-14 14" fill="none" stroke="currentColor" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

  CH.mime.stage = {
    init, render, hintSpots, placeHero, walkTo, act, face, setHeroVisible, hero,
    beeTo, beeToElement, beeHide, targetBox, wait, pctX, pctY,
  };
})();

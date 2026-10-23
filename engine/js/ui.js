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

// DOM layer: scene rendering, hotspots, dialogue box, notebook, boards, screens.
(function () {
  const C = CH.config;
  const t = CH.t;
  const rich = CH.i18n.rich;
  const esc = CH.i18n.escapeHtml;
  const W = C.stage.width, H = C.stage.height;

  const GLASSES_ICON = `<svg viewBox="0 0 40 20" aria-hidden="true"><path d="M3 6h13v8a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3zM24 6h13v8a3 3 0 0 1-3 3h-7a3 3 0 0 1-3-3zM16 9h8" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linejoin="round"/></svg>`;

  const LOUPE_ICON = `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10" cy="10" r="6" fill="none" stroke="currentColor" stroke-width="2.4"/><path d="M14.5 14.5L20 20" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round"/></svg>`;

  const el = {};
  let backdrop = null;
  let lastSceneKey = "";
  let advance = null;
  let menuResolve = null;
  let notebookState = null;
  let boardState = null;
  let hypState = null;
  let screenResolve = null;
  let pendingHighlight = null;
  let highlightTimer = null;
  let hintCards = [];
  let lastSceneId = "";
  let revealTimer = null;
  let viewer = null;
  const coarse = () => !!(window.matchMedia && window.matchMedia("(pointer: coarse)").matches);

  const $ = (sel) => document.querySelector(sel);
  const S = () => CH.game.state;

  // ---------------------------------------------------------------- Setup
  function init() {
    ["stage", "scene", "hotspots", "hud", "act", "objective", "btnNotebook", "btnBoard", "btnMenu", "btnFull", "badge", "nav", "biscotte", "dialog", "catcher", "toasts", "notebook", "board", "screen", "actcard", "paper"].forEach((id) => (el[id] = document.getElementById(id)));
    document.getElementById("defs").innerHTML = `<defs>${CH.art.defs()}</defs>`;
    paintTextures();
    el.btnNotebook.addEventListener("click", () => !CH.game.busy && openNotebook({ pick: false }));
    el.btnBoard.addEventListener("click", () => {
      const id = currentBoard();
      if (id && !CH.game.busy) openBoard(id);
    });
    el.btnMenu.addEventListener("click", () => !CH.game.busy && showTitle());
    setupFullscreen();
    setupReveal();
    setupPlaces();
    el.biscotte.addEventListener("click", () => !CH.game.busy && CH.game.biscotte());
    el.biscotte.addEventListener("keydown", (e) => {
      if ((e.key === "Enter" || e.key === " ") && !CH.game.busy) {
        e.preventDefault();
        CH.game.biscotte();
      }
    });
    el.catcher.addEventListener("click", () => advance && advance());
    el.dialog.addEventListener("click", (e) => {
      if (advance && !e.target.closest("button")) advance();
    });
    document.addEventListener("keydown", onKey);
    const rotate = document.getElementById("rotate");
    rotate.innerHTML = `<svg class="rotate-icon" viewBox="0 0 120 120" aria-hidden="true"><rect x="38" y="20" width="44" height="76" rx="8" fill="none" stroke="currentColor" stroke-width="6"/><circle cx="60" cy="86" r="3.5" fill="currentColor"/><path d="M98 62a38 38 0 0 1-30 38" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round"/><path d="M60 96l9 6l-2-11" fill="none" stroke="currentColor" stroke-width="5" stroke-linejoin="round" stroke-linecap="round"/></svg><p>${esc(t("ui.rotate"))}</p>${fullscreenSupported() ? `<button class="rotate-full">${esc(t("ui.fullscreen_rotate"))}</button>` : ""}`;
    const rotateBtn = rotate.querySelector(".rotate-full");
    if (rotateBtn) rotateBtn.addEventListener("click", enterFullscreen);
    el.btnNotebook.textContent = t("ui.notebook");
    el.btnMenu.textContent = t("ui.back_title");
    el.biscotte.innerHTML = biscotteSvg();
    el.biscotte.title = t("ui.biscotte");
    el.biscotte.setAttribute("aria-label", t("ui.biscotte"));
    setInterval(() => {
      if (!document.hidden && S() && el.screen.hidden) CH.game.tick(C.playtimeTickMs);
    }, C.playtimeTickMs);
    document.title = t("ui.title");
    showTitle();
  }

  // ---------------------------------------------------------------- Fullscreen
  const FULL_ICON = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9V4h5M15 4h5v5M20 15v5h-5M9 20H4v-5" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  const EXIT_ICON = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 4v5H4M20 9h-5V4M15 20v-5h5M4 15h5v5" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

  function fullscreenSupported() {
    return !!(document.fullscreenEnabled || document.webkitFullscreenEnabled);
  }

  function isFullscreen() {
    return !!(document.fullscreenElement || document.webkitFullscreenElement);
  }

  function enterFullscreen() {
    const root = document.documentElement;
    const request = root.requestFullscreen || root.webkitRequestFullscreen;
    if (!request) return;
    const result = request.call(root, { navigationUI: "hide" });
    const lock = () => {
      // Landscape lock only works in fullscreen, and only on some browsers.
      if (screen.orientation && screen.orientation.lock) screen.orientation.lock("landscape").catch(() => {});
    };
    if (result && result.then) result.then(lock).catch(() => {});
    else lock();
  }

  function exitFullscreen() {
    const exit = document.exitFullscreen || document.webkitExitFullscreen;
    if (exit) exit.call(document);
  }

  function updateFullscreenButton() {
    const on = isFullscreen();
    el.btnFull.innerHTML = on ? EXIT_ICON : FULL_ICON;
    el.btnFull.title = t(on ? "ui.fullscreen_exit" : "ui.fullscreen");
    el.btnFull.setAttribute("aria-label", el.btnFull.title);
  }

  function setupFullscreen() {
    if (!fullscreenSupported()) return;
    el.btnFull.hidden = false;
    el.btnFull.addEventListener("click", () => (isFullscreen() ? exitFullscreen() : enterFullscreen()));
    ["fullscreenchange", "webkitfullscreenchange"].forEach((ev) => document.addEventListener(ev, updateFullscreenButton));
    updateFullscreenButton();
  }

  // ---------------------------------------------------------------- Hotspot reveal
  // Hotspots only light up under a mouse; on a touch screen nothing shows where to tap.
  // They are outlined briefly when a scene opens, and on demand with the magnifier.
  function setupReveal() {
    const btn = document.createElement("button");
    btn.id = "btnReveal";
    btn.className = "hud-btn";
    btn.innerHTML = LOUPE_ICON;
    btn.title = t("ui.reveal");
    btn.setAttribute("aria-label", btn.title);
    btn.addEventListener("click", () => !CH.game.busy && revealHotspots(C.reveal.onDemandMs, true));
    el.btnNotebook.parentNode.insertBefore(btn, el.btnNotebook);
  }

  // On a phone the row of place buttons would cover the bottom of the scene: a HUD button
  // naming the current place opens the list instead (CSS decides which one shows).
  function setupPlaces() {
    const btn = document.createElement("button");
    btn.id = "btnPlaces";
    btn.className = "hud-btn";
    btn.title = t("ui.places");
    btn.setAttribute("aria-label", btn.title);
    btn.addEventListener("click", () => !CH.game.busy && el.nav.classList.toggle("open"));
    el.btnNotebook.parentNode.insertBefore(btn, el.btnNotebook.parentNode.firstChild);
    el.btnPlaces = btn;
    document.addEventListener("click", (e) => {
      if (el.nav.classList.contains("open") && !el.nav.contains(e.target) && !btn.contains(e.target)) el.nav.classList.remove("open");
    });
  }

  function revealHotspots(ms, labels) {
    clearTimeout(revealTimer);
    clearRevealLabels();
    el.hotspots.classList.add("reveal");
    if (labels) placeRevealLabels();
    revealTimer = setTimeout(() => {
      el.hotspots.classList.remove("reveal");
      clearRevealLabels();
    }, ms);
  }

  function clearRevealLabels() {
    el.hotspots.querySelectorAll(".reveal-label").forEach((n) => n.remove());
  }

  // Every label is placed above its hotspot, else below, else inside, else lower and
  // lower: the first spot that stays on stage and clear of the HUD and other labels.
  function placeRevealLabels() {
    const box = el.hotspots.getBoundingClientRect();
    if (!box.width) return;
    const rel = (r) => ({ left: r.left - box.left, top: r.top - box.top, right: r.right - box.left, bottom: r.bottom - box.top });
    const taken = [...el.hud.querySelectorAll(".hud-left, .hud-right"), el.nav].filter((n) => n && !n.hidden).map((n) => rel(n.getBoundingClientRect()));
    const hits = (a) => taken.some((b) => a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top);
    const gap = C.reveal.labelGapPx;
    const spots = [...el.hotspots.querySelectorAll(".hotspot")].map((node) => ({ node, r: rel(node.getBoundingClientRect()) })).sort((a, b) => a.r.top - b.r.top);
    spots.forEach(({ node, r }) => {
      const label = document.createElement("div");
      label.className = "reveal-label";
      label.textContent = node.dataset.label;
      el.hotspots.appendChild(label);
      const w = label.offsetWidth, h = label.offsetHeight;
      const cx = Math.min(Math.max((r.left + r.right) / 2 - w / 2, gap), box.width - w - gap);
      const tops = [r.top - h - gap, r.bottom + gap, r.top + gap];
      for (let k = 1; k <= C.reveal.labelTries; k++) tops.push(r.top - h - gap + k * (h + gap));
      const fits = (top) => ({ left: cx, top, right: cx + w, bottom: top + h });
      const ok = tops.map(fits).find((a) => a.top >= gap && a.bottom <= box.height - gap && !hits(a)) || fits(Math.max(gap, tops[0]));
      Object.assign(label.style, { left: `${ok.left}px`, top: `${ok.top}px` });
      taken.push(ok);
    });
  }

  function onKey(e) {
    if (e.key === " " || e.key === "Enter") {
      if (advance) {
        e.preventDefault();
        advance();
      } else if (!el.screen.hidden && !el.screen.classList.contains("title")) {
        const next = el.screen.querySelector("button.primary");
        if (next) {
          e.preventDefault();
          next.click();
        }
      }
    } else if (viewer && (e.key === "ArrowLeft" || e.key === "ArrowRight")) {
      e.preventDefault();
      stepViewer(e.key === "ArrowLeft" ? -1 : 1);
    } else if (e.key === "Escape") {
      if (viewer) return closeViewer();
      if (menuResolve) return resolveMenu(null);
      if (hypState) return closeHypothesis(null);
      if (notebookState) return closeNotebook(null);
      if (boardState) return closeBoard();
    }
  }

  // Paper grain and watercolour wash, generated once on canvases.
  function paintTextures() {
    const size = C.paperTextureSize;
    const grain = document.createElement("canvas");
    grain.width = grain.height = size;
    const g = grain.getContext("2d");
    const img = g.createImageData(size, size);
    CH.art.srand(C.textureSeed);
    for (let i = 0; i < img.data.length; i += 4) {
      const v = 200 + Math.floor(CH.art.rnd() * 55);
      img.data[i] = v;
      img.data[i + 1] = v - 6;
      img.data[i + 2] = v - 18;
      img.data[i + 3] = 255;
    }
    g.putImageData(img, 0, 0);
    const wash = document.createElement("canvas");
    const ww = C.washTexture.width, wh = C.washTexture.height, cell = C.washTexture.cell;
    wash.width = ww;
    wash.height = wh;
    const w = wash.getContext("2d");
    w.fillStyle = "#fff";
    w.fillRect(0, 0, ww, wh);
    for (let y = 0; y < wh; y += cell / 2) {
      for (let x = 0; x < ww; x += cell / 2) {
        const a = CH.art.rnd() * 0.22;
        const grad = w.createRadialGradient(x, y, 0, x, y, cell);
        grad.addColorStop(0, `rgba(150,110,70,${a.toFixed(3)})`);
        grad.addColorStop(1, "rgba(150,110,70,0)");
        w.fillStyle = grad;
        w.fillRect(x - cell, y - cell, cell * 2, cell * 2);
      }
    }
    el.paper.style.backgroundImage = `url(${grain.toDataURL()}), url(${wash.toDataURL()})`;
  }

  function biscotteSvg() {
    return `<svg viewBox="-70 -190 230 200"><g filter="url(#f-rough-s)" class="bis-idle">${CH.art.goat(CH.art.GOATS.biscotte)}</g></svg>`;
  }

  // ---------------------------------------------------------------- Scene
  function sceneKey() {
    const s = S();
    return [backdrop || s.scene, s.act, JSON.stringify(s.flags), Object.keys(s.clues).length, Object.keys(s.deds).length, Object.keys(s.items).join(",")].join("|");
  }

  function renderScene(force) {
    const s = S();
    if (!s) return;
    const key = sceneKey();
    if (!force && key === lastSceneKey) return;
    lastSceneKey = key;
    const id = backdrop || s.scene;
    const sc = CH.scenes.get(id);
    const d = sc.draw(s);
    const people = backdrop ? "" : CH.chars.inScene(s, id).map((c) => CH.art.character(c.id, c.p.x, c.p.y, c.p.h, false)).join("");
    el.scene.innerHTML = composeSvg(d.back, d.anim, people + (d.front || "") + (d.top || ""));
    renderHotspots();
    if (!backdrop && id !== lastSceneId) revealHotspots(C.reveal.enterMs, false);
    lastSceneId = backdrop ? "" : id;
  }

  // Static background, animated layer, then people and foreground on top.
  function composeSvg(back, anim, top) {
    return `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice"><g filter="url(#f-rough)">${back}</g><g class="anim">${anim || ""}</g>${top ? `<g filter="url(#f-rough)">${top}</g>` : ""}<rect width="${W}" height="${H}" fill="url(#g-vignette)"/></svg>`;
  }

  const pct = (v, total) => `${((v / total) * 100).toFixed(3)}%`;

  function renderHotspots() {
    const s = S();
    el.hotspots.innerHTML = "";
    if (backdrop) return;
    const sc = CH.scenes.get(s.scene);
    const list = sc.hotspots.filter((h) => !h.when || h.when(s)).map((h) => ({ kind: "hs", h, id: h.id, label: t(`hs.${s.scene}.${h.id}.label`), x: h.x, y: h.y, w: h.w, h_: h.h, pro: !!h.pro }));
    CH.chars.inScene(s, s.scene).forEach((c) => {
      const w = c.p.h * 0.34;
      list.push({ kind: "char", id: c.id, label: t(`chr.${c.id}.name`), x: c.p.x - w / 2, y: c.p.y - c.p.h, w, h_: c.p.h * 0.62, pro: !!CH.chars.get(c.id).pro });
    });
    list.forEach((item) => {
      const node = document.createElement("div");
      node.className = "hotspot" + (item.kind === "char" ? " is-char" : "");
      node.dataset.id = item.kind === "char" ? "char:" + item.id : item.id;
      node.dataset.label = item.label;
      Object.assign(node.style, { left: pct(item.x, W), top: pct(item.y, H), width: pct(item.w, W), height: pct(item.h_, H) });
      node.setAttribute("role", "button");
      node.setAttribute("aria-label", item.label);
      node.tabIndex = 0;
      const activate = () => {
        if (CH.game.busy) return;
        clearHighlight();
        if (item.kind === "char") CH.game.talk(item.id);
        else CH.game.onHotspot(item.h, "look");
      };
      node.addEventListener("click", activate);
      node.addEventListener("keydown", (e) => (e.key === "Enter" ? activate() : null));
      if (item.pro) {
        const used = item.kind === "char" ? s.seen[`pro:char:${item.id}`] : s.seen[`pro:${s.scene}:${item.id}`];
        const btn = document.createElement("button");
        btn.className = "pro-btn" + (used ? " used" : "");
        btn.innerHTML = GLASSES_ICON;
        btn.title = t("ui.pro_on", { label: item.label });
        btn.setAttribute("aria-label", btn.title);
        btn.addEventListener("click", (e) => {
          e.stopPropagation();
          if (CH.game.busy) return;
          clearHighlight();
          if (item.kind === "char") CH.game.charPro(item.id);
          else CH.game.onHotspot(item.h, "pro");
        });
        node.appendChild(btn);
      }
      el.hotspots.appendChild(node);
    });
    applyPendingHighlight();
  }

  function renderNav() {
    const s = S();
    el.nav.innerHTML = "";
    el.nav.classList.remove("open");
    el.btnPlaces.hidden = !!backdrop || s.act >= C.acts.ending;
    if (el.btnPlaces.hidden) return;
    el.btnPlaces.textContent = t("ui.places_btn", { place: t(`scene.${s.scene}.name`) });
    CH.scenes.order.filter((id) => CH.scenes.get(id).unlock(s)).forEach((id) => {
      const b = document.createElement("button");
      b.className = "nav-btn" + (id === s.scene ? " current" : "");
      b.dataset.scene = id;
      b.textContent = t(`scene.${id}.name`);
      b.addEventListener("click", () => {
        if (CH.game.busy || id === s.scene) return;
        s.scene = id;
        CH.game.save();
        refresh();
      });
      el.nav.appendChild(b);
    });
  }

  function objectiveKey(s) {
    return CH.story.objectiveKey(s, currentBoard());
  }

  function currentBoard() {
    return Object.keys(CH.story.BOARDS).find((b) => CH.game.boardReady(b)) || null;
  }

  function refresh() {
    const s = S();
    if (!s) return;
    renderScene(false);
    renderNav();
    el.act.textContent = t(`ui.act_${s.act}`);
    el.objective.textContent = t(objectiveKey(s));
    const freshCount = Object.keys(s.fresh).length;
    el.badge.textContent = freshCount;
    el.badge.hidden = freshCount === 0;
    el.btnNotebook.appendChild(el.badge);
    const needsHelp = !s.seen["help:combine"] && s.clueOrder.length >= C.helpMinClues;
    el.btnNotebook.classList.toggle("nudge", needsHelp);
    if (needsHelp && !s.seen["help:nudge"]) {
      s.seen["help:nudge"] = true;
      toast(t("ui.combine_nudge"));
    }
    const b = currentBoard();
    el.btnBoard.hidden = !b;
    if (b) el.btnBoard.textContent = t(`ui.board_btn_${b}`);
    el.biscotte.hidden = !!backdrop || s.act < C.acts.night || s.act >= C.acts.ending;
    el.hud.hidden = !!backdrop;
    applyPendingHighlight();
  }

  function setBackdrop(id) {
    backdrop = id;
    renderScene(true);
    refresh();
  }

  function setBusy(b) {
    el.stage.classList.toggle("busy", b);
  }

  // ---------------------------------------------------------------- Dialogue
  function speakerInfo(who) {
    if (who === "n") return { name: "", portrait: "", cls: "narration" };
    if (who === "b") return { name: t("chr.biscotte.name"), portrait: CH.art.goatPortrait("biscotte"), cls: "biscotte" };
    const [id, expr] = who.split(".");
    if (id === "v") return { name: t("chr.veronique.name"), portrait: CH.art.portrait("veronique", expr || "neutral"), cls: "veronique" };
    return { name: t(`chr.${id}.name`), portrait: CH.art.portrait(id, expr), cls: "character" };
  }

  function fillDialog(who, html, opts) {
    const info = speakerInfo(who);
    el.dialog.className = "dialog " + info.cls;
    el.dialog.innerHTML = `
      ${info.portrait ? `<div class="portrait">${info.portrait}</div>` : ""}
      <div class="dialog-body">
        ${info.name ? `<div class="speaker">${esc(info.name)}</div>` : ""}
        <div class="text">${html}</div>
        ${opts || ""}
      </div>`;
    el.dialog.hidden = false;
  }

  function say(who, text) {
    return new Promise((resolve) => {
      fillDialog(who, rich(text), `<div class="continue">${esc(t(coarse() ? "ui.tap_continue" : "ui.click_continue"))}</div>`);
      el.catcher.hidden = false;
      advance = () => {
        advance = null;
        el.catcher.hidden = true;
        resolve();
      };
    });
  }

  function resolveMenu(value) {
    const r = menuResolve;
    menuResolve = null;
    el.catcher.hidden = true;
    if (r) r(value);
  }

  function menu(who, opts, footer) {
    return new Promise((resolve) => {
      const speaker = who === "biscotte" ? "b" : who;
      const buttons = opts.map((o) => `<button class="opt ${o.kind || ""}${o.seen ? " seen" : ""}" data-id="${esc(o.id)}">${o.kind === "pro" ? GLASSES_ICON : ""}<span>${esc(o.label)}</span></button>`).join("");
      fillDialog(speaker, footer ? `<span class="muted">${esc(footer)}</span>` : "", `<div class="options">${buttons}</div>`);
      el.catcher.hidden = false;
      menuResolve = resolve;
      el.dialog.querySelectorAll(".opt").forEach((b) => b.addEventListener("click", () => resolveMenu(b.dataset.id)));
    });
  }

  function closeDialog() {
    el.dialog.hidden = true;
    el.catcher.hidden = true;
  }

  // ---------------------------------------------------------------- Toasts and cards
  function toast(text, kind) {
    const n = document.createElement("div");
    n.className = "toast " + (kind || "");
    n.textContent = text;
    el.toasts.appendChild(n);
    while (el.toasts.children.length > C.toastMax) el.toasts.firstElementChild.remove();
    setTimeout(() => n.classList.add("out"), C.toastMs);
    setTimeout(() => n.remove(), C.toastMs + 600);
  }

  function actCard(n) {
    el.actcard.textContent = t(`ui.act_${n}`);
    el.actcard.classList.remove("show");
    void el.actcard.offsetWidth;
    el.actcard.classList.add("show");
  }

  // ---------------------------------------------------------------- Notebook
  function openNotebook(opts) {
    return new Promise((resolve) => {
      const s = S();
      const help = !opts.pick && !s.seen["help:combine"] && s.clueOrder.length >= C.helpMinClues;
      notebookState = { pick: !!opts.pick, tab: "clues", selected: null, help, resolve };
      // A pick opened from a conversation: the menu has answered, keep it from covering the cards.
      if (opts.pick) closeDialog();
      el.notebook.hidden = false;
      renderNotebook();
    });
  }

  function closeNotebook(value) {
    if (!notebookState) return;
    const s = S();
    const r = notebookState.resolve;
    // Cards shown once are no longer new.
    s.clueOrder.forEach((id) => delete s.fresh[id]);
    if (notebookState.tab === "deds") s.dedOrder.forEach((id) => delete s.fresh["d:" + id]);
    closeViewer();
    notebookState = null;
    el.notebook.hidden = true;
    hintCards = [];
    CH.game.save();
    refresh();
    r(value);
  }

  function cardHtml(kind, id, title, text, extra) {
    const s = S();
    const key = kind === "ded" ? "d:" + id : id;
    // A deduction may be a mere hypothesis, crossed out once a later deduction disproves it.
    const def = kind === "ded" ? CH.deductions.get(id) : null;
    const hypo = def && def.kind === "hypothesis";
    const invalid = hypo && def.invalidatedBy && s.deds[def.invalidatedBy];
    const tag = hypo ? `<span class="hypo-tag">${esc(t(invalid ? "ui.hypo_invalid" : "ui.hypo"))}</span>` : "";
    const cls = ["card", kind, hypo ? "hypo" : "", invalid ? "invalid" : "", extra ? "wide" : "", s.fresh[key] ? "fresh" : "", notebookState.selected === id ? "selected" : "", hintCards.includes(id) ? "pulse" : ""].join(" ");
    return `<button class="${cls}" data-id="${esc(id)}" data-kind="${kind}">${tag}<h3>${esc(title)}</h3><p>${rich(text)}</p>${extra || ""}</button>`;
  }

  function renderNotebook() {
    const s = S();
    const st = notebookState;
    const tabs = st.pick ? ["clues"] : CH.cluedo.enabled() ? ["clues", "deds", "grid", "items"] : ["clues", "deds", "items"];
    const tabLabel = { clues: "ui.tab_clues", deds: "ui.tab_deds", grid: "ui.tab_grid", items: "ui.tab_items" };
    let cards = "";
    if (st.tab === "clues") {
      // Observations are short notes listed under the cards; they cannot be paired.
      const isObs = (id) => !!(CH.clues.isObs && CH.clues.isObs(id));
      const ids = s.clueOrder.filter((id) => !CH.clues.hidden(s, id) && !isObs(id));
      const obs = st.pick ? [] : s.clueOrder.filter(isObs);
      cards = ids.length ? ids.map((id) => cardHtml("clue", id, t(`clue.${id}.title`), t(`clue.${id}.text`), CH.clues.visual(id))).join("") : `<p class="empty">${esc(t("ui.empty_clues"))}</p>`;
      if (obs.length) cards += `<div class="obs-list"><h3>${esc(t("ui.observations"))}</h3><ul>${obs.map((id) => `<li class="${s.fresh[id] ? "fresh" : ""}"><strong>${esc(t(`clue.${id}.title`))}</strong> ${rich(t(`clue.${id}.text`))}</li>`).join("")}</ul></div>`;
    } else if (st.tab === "grid") {
      cards = gridHtml();
    } else if (st.tab === "deds") {
      cards = s.dedOrder.length ? s.dedOrder.map((id) => cardHtml("ded", id, t(`ded.${id}.title`), t(`ded.${id}.text`))).join("") : `<p class="empty">${esc(t("ui.empty_deds"))}</p>`;
    } else {
      const ids = Object.keys(s.items);
      cards = ids.length ? ids.map((id) => cardHtml("item", id, t(`item.${id}.name`), t(`item.${id}.text`))).join("") : `<p class="empty">${esc(t("ui.empty_items"))}</p>`;
    }
    const showHelp = st.help && st.tab === "clues";
    let tip = st.pick ? t("ui.pick_tip") : st.tab === "grid" ? t("ui.grid_tip") : st.tab === "clues" ? (st.selected ? t("ui.combine_selected", { title: t(`clue.${st.selected}.title`) }) : t("ui.combine_tip")) : "";
    const board = currentBoard();
    el.notebook.innerHTML = `
      <div class="panel-inner">
        <header>
          <h2>${esc(t("ui.notebook_title"))}</h2>
          <nav class="tabs">${tabs.map((k) => `<button class="tab${k === st.tab ? " active" : ""}" data-tab="${k}">${esc(t(tabLabel[k]))}</button>`).join("")}</nav>
          <button class="close">${esc(st.pick ? t("ui.cancel") : t("ui.close"))}</button>
        </header>
        ${showHelp ? `<div class="help-box"><strong>${esc(t("ui.combine_help_title"))}</strong><p>${esc(t("ui.combine_help"))}</p></div>` : ""}
        ${tip ? `<p class="tip">${esc(tip)}</p>` : ""}
        <div class="cards${st.tab === "grid" ? " grid-wrap" : ""}">${cards}</div>
        ${!st.pick && board ? `<footer><button class="board-open">${esc(t(`ui.board_btn_${board}`))}</button></footer>` : ""}
      </div>`;
    el.notebook.querySelector(".close").addEventListener("click", () => closeNotebook(null));
    el.notebook.querySelectorAll(".tab").forEach((b) =>
      b.addEventListener("click", () => {
        st.tab = b.dataset.tab;
        st.selected = null;
        renderNotebook();
      })
    );
    const bo = el.notebook.querySelector(".board-open");
    if (bo) bo.addEventListener("click", () => {
      closeNotebook(null);
      openBoard(board);
    });
    el.notebook.querySelectorAll(".grid-cell").forEach((c) =>
      c.addEventListener("click", () => {
        if (c.classList.contains("auto")) return;
        CH.game.setMark(c.dataset.card);
        renderNotebook();
      })
    );
    // Pictures inside a card open larger; a click on the rest of the card selects it.
    el.notebook.querySelectorAll(".card .snap").forEach((n) => {
      n.setAttribute("role", "button");
      n.tabIndex = 0;
      n.title = t("ui.zoom");
      n.setAttribute("aria-label", n.title);
      const open = (e) => {
        e.stopPropagation();
        e.preventDefault();
        openViewer(n);
      };
      n.addEventListener("click", open);
      n.addEventListener("keydown", (e) => (e.key === "Enter" || e.key === " " ? open(e) : null));
    });
    el.notebook.querySelectorAll(".card.clue").forEach((c) =>
      c.addEventListener("click", () => {
        if (CH.game.busy && !st.pick) return;
        const id = c.dataset.id;
        if (st.pick) return closeNotebook(id);
        if (!st.selected) st.selected = id;
        else if (st.selected === id) st.selected = null;
        else {
          const a = st.selected;
          st.selected = null;
          CH.game.combine(a, id).then(() => notebookState && renderNotebook());
        }
        renderNotebook();
      })
    );
  }

  // The viewer browses the pictures of the card it was opened from.
  function openViewer(node) {
    closeViewer();
    const pics = [...node.closest(".card").querySelectorAll(".snap")];
    const root = document.createElement("div");
    root.className = "viewer";
    root.addEventListener("click", closeViewer);
    el.notebook.appendChild(root);
    viewer = { root, pics, i: pics.indexOf(node) };
    renderViewer();
  }

  function renderViewer() {
    const { root, pics, i } = viewer;
    const many = pics.length > 1;
    const arrow = (dir, key) => `<button class="viewer-nav" data-dir="${dir}" title="${esc(t(key))}" aria-label="${esc(t(key))}"${(dir < 0 ? i === 0 : i === pics.length - 1) ? " disabled" : ""}>${dir < 0 ? "&lsaquo;" : "&rsaquo;"}</button>`;
    root.innerHTML = `<div class="viewer-row">${many ? arrow(-1, "ui.viewer_prev") : ""}<div class="viewer-pic">${pics[i].innerHTML}</div>${many ? arrow(1, "ui.viewer_next") : ""}</div>
      <p class="viewer-tip">${many ? `<span class="viewer-count">${esc(t("ui.viewer_count", { n: i + 1, total: pics.length }))}</span> ` : ""}${esc(t(coarse() ? "ui.viewer_close_tap" : many ? "ui.viewer_close_keys" : "ui.viewer_close"))}</p>`;
    root.querySelectorAll(".viewer-nav").forEach((b) =>
      b.addEventListener("click", (e) => {
        e.stopPropagation();
        stepViewer(Number(b.dataset.dir));
      })
    );
  }

  function stepViewer(dir) {
    const i = viewer.i + dir;
    if (i < 0 || i >= viewer.pics.length) return;
    viewer.i = i;
    renderViewer();
  }

  function closeViewer() {
    if (viewer) viewer.root.remove();
    viewer = null;
  }

  // Cluedo grid: one column per kind, auto-crossed cards show their source.
  function gridHtml() {
    const s = S();
    const ex = CH.cluedo.excluded(s);
    const cols = CH.cluedo.KINDS.map((kind) => {
      const cells = CH.cluedo.CARDS[kind].map((id) => {
        const card = `${kind}.${id}`;
        const src = ex[card];
        const mark = s.marks[card];
        const cls = ["grid-cell", src ? "auto" : "", !src && mark === "x" ? "crossed" : "", !src && mark === "q" ? "doubt" : ""].join(" ");
        const why = src ? `<small>${esc(CH.cluedo.sourceTitle(src))}</small>` : "";
        const sign = src || mark === "x" ? "✗" : mark === "q" ? "?" : "";
        return `<button class="${cls}" data-card="${card}"><span class="sign">${sign}</span><span class="name">${esc(CH.cluedo.name(kind, id))}</span>${why}</button>`;
      });
      return `<div class="grid-col"><h3>${esc(t(`ui.grid_${kind}`))}</h3>${cells.join("")}</div>`;
    });
    return `<div class="grid">${cols.join("")}</div>`;
  }

  // ---------------------------------------------------------------- Hypothesis
  function openHypothesis(witness) {
    return new Promise((resolve) => {
      const pick = {};
      CH.cluedo.KINDS.forEach((k) => (pick[k] = null));
      hypState = { witness, pick, resolve };
      // The menu that opened the panel has already answered: hide it behind the panel.
      closeDialog();
      el.board.hidden = false;
      renderHypothesis();
    });
  }

  function closeHypothesis(value) {
    if (!hypState) return;
    const r = hypState.resolve;
    hypState = null;
    el.board.hidden = true;
    r(value);
  }

  function renderHypothesis() {
    const st = hypState;
    const ex = CH.cluedo.excluded(S());
    const sel = (kind) =>
      `<label class="hyp-field"><span>${esc(t(`ui.hyp_${kind}`))}</span><select data-kind="${kind}"><option value="">${esc(t("ui.board_blank"))}</option>${CH.cluedo.CARDS[kind]
        .map((id) => `<option value="${id}"${st.pick[kind] === id ? " selected" : ""}>${esc(CH.cluedo.name(kind, id))}${ex[`${kind}.${id}`] ? " ✗" : ""}</option>`)
        .join("")}</select></label>`;
    el.board.innerHTML = `
      <div class="panel-inner hyp">
        <header><h2>${esc(t("ui.hyp_title", { name: t(`chr.${st.witness}.name`) }))}</h2><button class="close">${esc(t("ui.cancel"))}</button></header>
        <p class="tip">${esc(t("ui.hyp_intro"))}</p>
        <div class="hyp-fields">${CH.cluedo.KINDS.map(sel).join("")}</div>
        <footer><button class="submit" disabled>${esc(t("ui.hyp_submit"))}</button></footer>
      </div>`;
    const submit = el.board.querySelector(".submit");
    const sync = () => (submit.disabled = CH.cluedo.KINDS.some((k) => !st.pick[k]));
    el.board.querySelector(".close").addEventListener("click", () => closeHypothesis(null));
    el.board.querySelectorAll("select").forEach((node) =>
      node.addEventListener("change", () => {
        st.pick[node.dataset.kind] = node.value || null;
        sync();
      })
    );
    submit.addEventListener("click", () => closeHypothesis(Object.assign({}, st.pick)));
    sync();
  }

  function refreshNotebook() {
    if (notebookState) renderNotebook();
  }

  // ---------------------------------------------------------------- Boards
  function openBoard(id) {
    if (hypState) closeHypothesis(null);
    boardState = boardState && boardState.id === id ? boardState : { id, answers: {} };
    el.board.hidden = false;
    renderBoard("");
  }

  function closeBoard() {
    el.board.hidden = true;
  }

  function renderBoard(feedback, flagged) {
    const id = boardState.id;
    const parts = t(`board.${id}.text`).split(/\{(q\d)\}/);
    const story = parts
      .map((p, i) => {
        if (i % 2 === 0) return esc(p);
        const options = CH.i18n.list(`board.${id}.${p}`);
        const cur = boardState.answers[p];
        return `<select data-q="${p}"${flagged === p ? ' class="wrong"' : ""}><option value="">${esc(t("ui.board_blank"))}</option>${options.map((o, k) => `<option value="${k}"${cur === k ? " selected" : ""}>${esc(o)}</option>`).join("")}</select>`;
      })
      .join("");
    el.board.innerHTML = `
      <div class="panel-inner">
        <header><h2>${esc(t(`ui.board_title_${id}`))}</h2><button class="close">${esc(t("ui.close"))}</button></header>
        <p class="tip">${esc(t("ui.board_intro"))}</p>
        <div class="story">${story}</div>
        <p class="feedback">${esc(feedback)}</p>
        <footer><button class="submit">${esc(t("ui.board_submit"))}</button></footer>
      </div>`;
    el.board.querySelector(".close").addEventListener("click", closeBoard);
    el.board.querySelectorAll("select").forEach((sel) =>
      sel.addEventListener("change", () => {
        boardState.answers[sel.dataset.q] = sel.value === "" ? null : Number(sel.value);
        sel.classList.remove("wrong");
      })
    );
    el.board.querySelector(".submit").addEventListener("click", async () => {
      if (CH.game.busy) return;
      const r = await CH.game.submitBoard(id, boardState.answers);
      if (r.res === "ok" || el.board.hidden) return;
      if (r.res === "incomplete") return renderBoard(t("ui.board_incomplete"));
      // Repeated failures get more precise: first how many blanks are wrong, then which one.
      let text = t(r.res === "near" ? "ui.board_near" : "ui.board_far");
      if (r.tries >= C.board.countFromTry) text = boardCount(r.wrong.length);
      const flagged = r.tries >= C.board.pinpointFromTry ? r.wrong[0] : null;
      if (flagged) text += " " + t("ui.board_pinpoint");
      renderBoard(text, flagged);
    });
  }

  function boardCount(n) {
    const key = `ui.board_count.${n}`;
    return CH.i18n.has(key) ? t(key) : t("ui.board_count.n", { n });
  }

  // ---------------------------------------------------------------- Screens
  function showScreen(html, onBind) {
    el.screen.innerHTML = html;
    el.screen.hidden = false;
    onBind(el.screen);
  }

  function hideScreen() {
    el.screen.hidden = true;
    el.screen.innerHTML = "";
  }

  function showTitle() {
    el.actcard.classList.remove("show");
    backdrop = "title";
    lastSceneKey = "";
    const sc = CH.scenes.get("title").draw();
    el.scene.innerHTML = composeSvg(sc.back, sc.anim, sc.top);
    el.hotspots.innerHTML = "";
    el.nav.innerHTML = "";
    el.hud.hidden = true;
    el.biscotte.hidden = true;
    closeDialog();
    const canResume = CH.game.hasSave();
    showScreen(
      `<div class="title-card">
        <h1>${esc(t("ui.title"))}</h1>
        <p class="subtitle">${esc(t("ui.subtitle"))}</p>
        <p class="tagline">${esc(t("ui.tagline"))}</p>
        <div class="title-actions">
          ${canResume ? `<button class="primary" data-act="resume">${esc(t("ui.continue"))}</button><button data-act="new">${esc(t("ui.restart"))}</button>` : `<button class="primary" data-act="new">${esc(t("ui.start"))}</button>`}
        </div>
        ${fullscreenSupported() ? `<p class="fullscreen-hint"><button class="link-btn" data-act="fullscreen">${esc(t("ui.fullscreen"))}</button></p>` : ""}
        <p class="dedication">${esc(t("ui.dedication"))}</p>
        ${C.shelfUrl ? `<p class="shelf-link"><a class="link-btn" href="${esc(C.shelfUrl)}">${esc(t("ui.shelf"))}</a></p>` : ""}
        ${canResume ? `<p class="muted">${esc(t("ui.menu_hint"))}</p>` : ""}
      </div>`,
      (root) => {
        root.className = "screen title";
        const actions = root.querySelector(".title-actions");
        const full = root.querySelector('[data-act="fullscreen"]');
        if (full) full.addEventListener("click", enterFullscreen);
        const bind = () =>
          actions.querySelectorAll("button").forEach((b) =>
            b.addEventListener("click", () => {
              const act = b.dataset.act;
              if (act === "new" && canResume) return askRestart();
              if (act === "cancel") return showTitle();
              CH.game.start(act === "resume");
            })
          );
        // In-page confirmation: browser dialogs can be blocked in embedded views.
        const askRestart = () => {
          actions.innerHTML = `<p class="confirm-text">${esc(t("ui.restart_confirm"))}</p><button class="primary" data-act="confirmNew">${esc(t("ui.yes"))}</button><button data-act="cancel">${esc(t("ui.no"))}</button>`;
          bind();
        };
        bind();
      }
    );
  }

  // Forget any dialogue, menu or panel left open by a previous game.
  function resetOverlays() {
    advance = null;
    menuResolve = null;
    notebookState = null;
    boardState = null;
    hypState = null;
    el.notebook.hidden = true;
    el.board.hidden = true;
    closeDialog();
    setBusy(false);
  }

  function enterGame() {
    resetOverlays();
    hideScreen();
    backdrop = null;
    lastSceneKey = "";
    boardState = null;
    renderScene(true);
    refresh();
    if (S().act !== C.acts.opening) actCard(S().act);
  }

  function formatStats() {
    const s = S();
    const rows = [
      ["ui.bilan_time", t("ui.bilan_minutes", { m: Math.max(1, Math.round(s.playMs / 60000)) })],
      ["ui.bilan_biscuits", String(s.biscuits)],
      ["ui.bilan_tries", String(Object.values(s.tries).reduce((a, b) => a + b, 0))],
      ...(CH.cluedo.enabled() ? [["ui.bilan_hyps", String(s.hyps)]] : []),
      ["ui.bilan_deds", t("ui.bilan_ratio", { n: s.dedOrder.length, total: CH.deductions.LIST.length })],
      ["ui.bilan_eggs", t("ui.bilan_ratio", { n: CH.game.EGGS.filter((e) => s.eggs[e]).length, total: CH.game.EGGS.length })],
    ];
    return rows.map(([k, v]) => `<div class="stat"><span>${esc(t(k))}</span><strong>${esc(v)}</strong></div>`).join("");
  }

  function screen(kind) {
    return new Promise((resolve) => {
      closeDialog();
      if (kind === "message") {
        showScreen(
          `<div class="letter"><h2>${esc(t("msg.title"))}</h2><div class="letter-body">${rich(t("msg.body"))}</div><p class="signature">${esc(t("msg.signature"))}</p><button class="primary">${esc(t("ui.next"))}</button></div>`,
          (root) => {
            root.className = "screen message";
            root.querySelector("button").addEventListener("click", () => {
              hideScreen();
              resolve();
            });
          }
        );
      } else if (kind === "invitation") {
        showScreen(
          `<div class="letter invitation"><div class="letterhead">${esc(t("inv.head"))}</div><p class="inv-to">${esc(t("inv.to"))}</p><div class="letter-body">${rich(t("inv.body"))}</div><p class="signature">${esc(t("inv.signature"))}</p><button class="primary">${esc(t("ui.next"))}</button></div>`,
          (root) => {
            root.className = "screen message invitation-screen";
            root.querySelector("button").addEventListener("click", () => {
              hideScreen();
              resolve();
            });
          }
        );
      } else if (kind === "bilan") {
        showScreen(
          `<div class="bilan"><h2>${esc(t("ui.bilan_title"))}</h2>${formatStats()}<div class="title-actions"><button class="primary">${esc(t("ui.next"))}</button></div></div>`,
          (root) => {
            root.className = "screen bilan-screen";
            root.querySelector("button").addEventListener("click", () => {
              hideScreen();
              resolve();
            });
          }
        );
      } else if (kind === "end") {
        showScreen(
          `<div class="end-card"><p class="the-end">${esc(t("ui.the_end"))}</p><button class="primary">${esc(t("ui.back_title"))}</button></div>`,
          (root) => {
            root.className = "screen end-screen";
            root.querySelector("button").addEventListener("click", () => {
              resolve();
              showTitle();
            });
          }
        );
      } else {
        resolve();
      }
    });
  }

  // ---------------------------------------------------------------- Highlights
  function clearHighlight() {
    document.querySelectorAll(".pulse").forEach((n) => n.classList.remove("pulse"));
    pendingHighlight = null;
  }

  function highlight(target) {
    clearHighlight();
    pendingHighlight = target;
    hintCards = target.kind === "ded" ? [target.a, target.b] : [];
    clearTimeout(highlightTimer);
    highlightTimer = setTimeout(clearHighlight, C.hint.pulseMs);
    applyPendingHighlight();
  }

  function applyPendingHighlight() {
    const target = pendingHighlight;
    if (!target) return;
    const s = S();
    const mark = (node) => node && node.classList.add("pulse");
    if (target.kind === "hs" || target.kind === "char") {
      const scene = target.kind === "hs" ? target.scene : (CH.chars.get(target.id).presence(s) || {}).scene;
      if (scene !== s.scene) {
        mark(el.btnPlaces);
        return mark(el.nav.querySelector(`[data-scene="${scene}"]`));
      }
      const node = el.hotspots.querySelector(`[data-id="${target.kind === "hs" ? target.id : "char:" + target.id}"]`);
      mark(node);
      if (target.pro && node) mark(node.querySelector(".pro-btn"));
    } else if (target.kind === "ded") {
      mark(el.btnNotebook);
    } else if (target.kind === "board") {
      mark(el.btnBoard);
    } else {
      mark(el.biscotte);
    }
  }

  CH.ui = {
    init, renderScene, refresh, setBackdrop, setBusy, say, menu, closeDialog, toast, actCard,
    openNotebook, refreshNotebook, openBoard, closeBoard, openHypothesis, screen, highlight, enterGame, showTitle,
  };
})();

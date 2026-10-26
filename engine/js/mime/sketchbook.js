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

// The sketchbook: every card is a drawing. Touching two cards that belong together
// draws a deduction; an empty frame stands for each deduction still to find.
(function () {
  const C = CH.mime.config;
  const ST = () => CH.mimeStory;
  const G = () => CH.mime.game;
  const el = {};
  let selected = null;
  let born = null;
  let onClose = null;

  const CLOSE = `<svg viewBox="0 0 40 40" aria-hidden="true"><path d="M10 10l20 20M30 10l-20 20" stroke="currentColor" stroke-width="5" stroke-linecap="round"/></svg>`;

  function init() {
    el.panel = document.getElementById("m-book");
  }

  const pairKey = (a, b) => [a, b].sort().join("+");

  function findDed(a, b) {
    return ST().DEDS.find((d) => d.pairs.some(([x, y]) => pairKey(x, y) === pairKey(a, b)));
  }

  function isCrossed(s, id) {
    const rule = ST().CROSSED && ST().CROSSED[id];
    return !!(rule && rule(s));
  }

  function open(done) {
    onClose = done;
    selected = null;
    born = null;
    G().markSeen();
    render();
    el.panel.hidden = false;
    CH.mime.sound.play("card");
  }

  function close() {
    el.panel.hidden = true;
    selected = null;
    const cb = onClose;
    onClose = null;
    if (cb) cb();
  }

  function render() {
    const s = G().state();
    const t = CH.t;
    const esc = CH.i18n.escapeHtml;
    const cards = ST().CARD_ORDER.filter((id) => s.cards.includes(id));
    const cardHtml = cards.map((id) => {
      const cls = ["m-card", "m-book-card"];
      if (id === selected) cls.push("m-selected");
      if (isCrossed(s, id)) cls.push("m-crossed");
      return `<button class="${cls.join(" ")}" data-card="${id}" aria-label="${esc(t(`card.${id}`))}" aria-pressed="${id === selected}">${CH.mime.show.cardSvg(id)}</button>`;
    }).join("");
    const dedHtml = ST().DEDS.map((d) => {
      if (!s.deds.includes(d.id)) return `<div class="m-card m-ded m-ded-empty" aria-hidden="true"></div>`;
      return `<div class="m-card m-ded${d.id === born ? " m-born" : ""}" data-ded="${d.id}" role="img" aria-label="${esc(t(`ded.${d.id}`))}">${CH.mime.show.cardSvg(d.id)}</div>`;
    }).join("");
    el.panel.innerHTML = `<div class="m-book-page">
      <button class="m-book-close" aria-label="${esc(t("mime.sketch.close"))}">${CLOSE}</button>
      <div class="m-book-cards">${cardHtml}</div>
      <div class="m-book-seam" aria-hidden="true"></div>
      <div class="m-book-deds">${dedHtml}</div>
      <div class="m-book-wait" hidden>${CH.mime.show.pic("wait")}</div>
    </div>`;
    el.panel.querySelector(".m-book-close").addEventListener("click", close);
    el.panel.querySelectorAll("[data-card]").forEach((b) => b.addEventListener("click", () => pick(b.dataset.card)));
  }

  // Replays a feedback animation class on cards (shake, wrong pair).
  function flash(ids, cls) {
    ids.forEach((id) => {
      const node = el.panel.querySelector(`[data-card="${id}"], [data-ded="${id}"]`);
      if (!node) return;
      node.classList.remove(cls);
      void node.offsetWidth;
      node.classList.add(cls);
    });
  }

  // Selection only toggles classes: rebuilding the cards between two clicks could let
  // the second click land on a node that has just been replaced.
  function showSelection() {
    el.panel.querySelectorAll("[data-card]").forEach((b) => {
      const on = b.dataset.card === selected;
      b.classList.toggle("m-selected", on);
      b.setAttribute("aria-pressed", String(on));
    });
  }

  function pick(id) {
    const s = G().state();
    G().nudgeIdle();
    if (isCrossed(s, id)) {
      CH.mime.sound.play("nope");
      flash([id], "m-shake");
      return;
    }
    if (!selected || selected === id) {
      selected = selected === id ? null : id;
      CH.mime.sound.play("tap");
      showSelection();
      return;
    }
    const a = selected;
    selected = null;
    showSelection();
    const d = findDed(a, id);
    if (!d) {
      CH.mime.sound.play("nope");
      flash([a, id], "m-wrong");
      return;
    }
    if (s.deds.includes(d.id)) {
      CH.mime.sound.play("tap");
      flash([d.id], "m-shake");
      return;
    }
    if ((d.requires || []).some((r) => !s.deds.includes(r))) {
      CH.mime.sound.play("nope");
      const w = el.panel.querySelector(".m-book-wait");
      w.hidden = false;
      setTimeout(() => (w.hidden = true), C.cardShowMs);
      return;
    }
    G().addDed(d.id);
    born = d.id;
    render();
    CH.mime.sound.play("chime");
  }

  CH.mime.book = { init, open, close, isOpen: () => el.panel && !el.panel.hidden };
})();

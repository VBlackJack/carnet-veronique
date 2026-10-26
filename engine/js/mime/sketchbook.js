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

  // A card is used up once every deduction it belongs to is found: it fades, with a tick,
  // so the cards still to play stand out. Cards that belong to no deduction never fade.
  function isUsed(s, id) {
    const deds = ST().DEDS.filter((d) => d.pairs.some((p) => p.includes(id)));
    return deds.length > 0 && deds.every((d) => s.deds.includes(d.id));
  }

  // The first pair the player could make now: both cards found, prerequisites met.
  function firstOpenPair(s) {
    for (const d of ST().DEDS) {
      if (s.deds.includes(d.id) || (d.requires || []).some((r) => !s.deds.includes(r))) continue;
      const pair = d.pairs.find(([a, b]) => s.cards.includes(a) && s.cards.includes(b));
      if (pair) return pair;
    }
    return null;
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
    showGhostHand();
  }

  // Once, the first time a pair is possible: a hand touches one card, then the other.
  // It shows the gesture only; the player still makes the pair.
  const HAND = `<svg viewBox="0 0 60 70" aria-hidden="true"><path d="M22 66c-8-6-14-18-16-26-1-5 4-7 7-3l5 7V10c0-4 6-4 6 0v20 -6c0-4 6-4 6 0v6-3c0-4 6-4 6 0v5-1c0-4 6-4 6 0v14c0 12-4 18-8 21z" fill="#fbf6ea" stroke="#3b2f2a" stroke-width="3" stroke-linejoin="round"/></svg>`;

  function showGhostHand() {
    const s = G().state();
    const flag = "sketchbook_hand_shown";
    if (s.flags[flag]) return;
    const pair = firstOpenPair(s);
    if (!pair) return;
    G().setFlag(flag);
    const page = el.panel.querySelector(".m-book-page");
    const hand = document.createElement("div");
    hand.className = "m-ghost-hand";
    hand.innerHTML = HAND;
    page.appendChild(hand);
    // Layout offsets, not getBoundingClientRect: the page is still zooming in when the
    // hand starts, and its scale would misplace every point of the path.
    const at = (id) => {
      const card = el.panel.querySelector(`[data-card="${id}"]`);
      return `translate(${card.offsetLeft + card.offsetWidth / 2}px, ${card.offsetTop + card.offsetHeight / 2}px)`;
    };
    const G2 = C.ghostHand;
    const total = G2.delayMs + 2 * G2.moveMs + 2 * G2.tapMs;
    const k = (ms) => ms / total;
    const tap = " scale(0.85)";
    const frames = [
      { offset: 0, opacity: 0, transform: at(pair[0]) + " translate(30px, 40px)" },
      { offset: k(G2.delayMs), opacity: 1, transform: at(pair[0]) },
      { offset: k(G2.delayMs + G2.tapMs / 2), opacity: 1, transform: at(pair[0]) + tap },
      { offset: k(G2.delayMs + G2.tapMs), opacity: 1, transform: at(pair[0]) },
      { offset: k(G2.delayMs + G2.tapMs + G2.moveMs), opacity: 1, transform: at(pair[1]) },
      { offset: k(G2.delayMs + G2.tapMs * 1.5 + G2.moveMs), opacity: 1, transform: at(pair[1]) + tap },
      { offset: k(G2.delayMs + 2 * G2.tapMs + G2.moveMs), opacity: 1, transform: at(pair[1]) },
      { offset: 1, opacity: 0, transform: at(pair[1]) + " translate(30px, 40px)" },
    ];
    const anim = hand.animate(frames, { duration: total, easing: "ease-in-out" });
    anim.onfinish = () => hand.remove();
    // Touching anything makes the hand go away at once.
    el.panel.addEventListener("pointerdown", () => hand.remove(), { once: true });
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
      else if (isUsed(s, id)) cls.push("m-used");
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

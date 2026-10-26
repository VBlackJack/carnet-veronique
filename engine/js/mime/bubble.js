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

// Rebus bubbles (a row of small drawings instead of words) and the reveal of a new card,
// shown big before it flies into the sketchbook. Drawings come from the episode:
// CH.mimeStory.PICS[name]() in a 100x100 frame, CH.mimeStory.CARDS[id].pic() in 160x110.
(function () {
  const C = CH.mime.config;
  const S = () => CH.mime.stage;
  const W = CH.config.stage.width;
  const H = CH.config.stage.height;
  const el = {};

  // Engine pictures every story can use between its own.
  const BUILTIN = {
    then: () => `<path d="M18 50h56M58 32l18 18-18 18" fill="none" stroke="${CH.art.P.ink}" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>`,
    // Hourglass: "not yet, something else first".
    wait: () => `<path d="M28 14h44M28 86h44M32 14c0 24 36 24 36 36s-36 12 -36 36M68 14c0 24 -36 24 -36 36s36 12 36 36" fill="#f6efe0" stroke="${CH.art.P.ink}" stroke-width="5" stroke-linejoin="round"/><path d="M40 78c6 -8 14 -8 20 0z" fill="${CH.art.P.ochre}"/><path d="M42 28h16l-8 10z" fill="${CH.art.P.ochre}"/>`,
  };

  function init() {
    ["bubble", "catcher", "reveal"].forEach((id) => (el[id] = document.getElementById("m-" + id)));
  }

  function pic(name) {
    const fn = BUILTIN[name] || CH.mimeStory.PICS[name];
    const narrow = name === "then";
    return `<svg class="m-pic${narrow ? " m-pic-then" : ""}" viewBox="0 0 100 100" aria-hidden="true"><g filter="url(#f-rough-s)">${fn ? fn() : ""}</g></svg>`;
  }

  function cardSvg(id, cls = "") {
    const def = CH.mimeStory.CARDS[id] || CH.mimeStory.DEDS.find((d) => d.id === id);
    return `<svg class="m-card-art ${cls}" viewBox="0 0 160 110" aria-hidden="true"><g filter="url(#f-rough-s)">${def ? def.pic() : ""}</g></svg>`;
  }

  // Shows a bubble above a speaker's head; resolves when closed (click or time out).
  function bubble({ at, pics, dream }) {
    const [x, y] = at;
    el.bubble.className = "m-bubble" + (dream ? " m-dream" : "");
    el.bubble.innerHTML = `<div class="m-bubble-row">${pics.map(pic).join("")}</div><span class="m-tail"></span>`;
    // Measured from the top left corner, so the previous position does not squeeze it,
    // and by its layout size: the pop animation starts scaled down, which would fool
    // getBoundingClientRect into a far smaller bubble that then overflows the stage.
    el.bubble.style.left = "0px";
    el.bubble.style.top = "0px";
    el.bubble.hidden = false;
    const stage = document.getElementById("stage");
    const bw = (el.bubble.offsetWidth / stage.clientWidth) * W;
    const bh = (el.bubble.offsetHeight / stage.clientHeight) * H;
    const L = C.bubbleLayout;
    const left = Math.max(L.margin, Math.min(W - bw - L.margin, x - bw / 2));
    const top = Math.max(L.margin, y - bh - L.lift);
    el.bubble.style.left = S().pctX(left);
    el.bubble.style.top = S().pctY(top);
    el.bubble.style.setProperty("--tail", `${Math.max(L.tailMin, Math.min(L.tailMax, ((x - left) / bw) * 100))}%`);
    CH.mime.sound.play(dream ? "wonder" : "pop");
    return new Promise((resolve) => {
      const opened = Date.now();
      let timer = null;
      const close = () => {
        if (Date.now() - opened < C.bubbleMinMs) return;
        clearTimeout(timer);
        el.catcher.hidden = true;
        el.catcher.onclick = null;
        el.bubble.hidden = true;
        resolve();
      };
      el.catcher.hidden = false;
      el.catcher.onclick = close;
      timer = setTimeout(() => {
        el.catcher.hidden = true;
        el.catcher.onclick = null;
        el.bubble.hidden = true;
        resolve();
      }, C.bubbleMs);
    });
  }

  // A new card: big in the middle, then into the sketchbook button.
  async function reveal(id) {
    el.reveal.innerHTML = `<div class="m-card m-reveal-card">${cardSvg(id)}</div>`;
    el.reveal.hidden = false;
    const card = el.reveal.firstChild;
    CH.mime.sound.play("card");
    await S().wait(C.cardShowMs);
    const btn = document.getElementById("m-btn-book").getBoundingClientRect();
    const r = card.getBoundingClientRect();
    const dx = btn.left + btn.width / 2 - (r.left + r.width / 2);
    const dy = btn.top + btn.height / 2 - (r.top + r.height / 2);
    card.style.transition = `transform ${C.cardFlyMs}ms ease-in, opacity ${C.cardFlyMs}ms ease-in`;
    card.style.transform = `translate(${dx}px, ${dy}px) scale(0.12)`;
    card.style.opacity = "0.4";
    await S().wait(C.cardFlyMs);
    el.reveal.hidden = true;
    el.reveal.innerHTML = "";
  }

  CH.mime.show = { init, bubble, reveal, cardSvg, pic };
})();

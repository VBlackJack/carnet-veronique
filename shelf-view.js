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

// Renders a shelf page: the shelf (released games) or the laboratory (games being tried
// out). The shelf shows a small door to the laboratory when it holds anything; the
// laboratory has a door back to the shelf.
(function () {
  const PAGES = {
    shelf: { stage: "released", keys: { title: "shelf.page_title", tagline: "shelf.tagline", footer: "shelf.footer", play: "shelf.play" }, door: { href: "lab.html", label: "shelf.lab.door" } },
    lab: { stage: "lab", keys: { title: "shelf.lab.title", tagline: "shelf.lab.tagline", footer: "shelf.lab.footer", play: "shelf.lab.play" }, door: { href: "index.html", label: "shelf.lab.back" } },
  };

  // A little laboratory door: a porthole glowing green and a flask hung above it.
  // The leaf swings open on hover (CSS).
  const DOOR = `<svg viewBox="0 0 120 170" aria-hidden="true">
    <path d="M52 8l-4 14h24l-4 -14z" fill="#f3e9d2" stroke="#3b2f2a" stroke-width="3" stroke-linejoin="round"/>
    <path d="M48 22q-10 14 -2 20h28q8 -6 -2 -20z" fill="#8fd3a0" stroke="#3b2f2a" stroke-width="3" stroke-linejoin="round"/>
    <circle class="bubble" cx="56" cy="34" r="3" fill="#f3e9d2"/><circle class="bubble b2" cx="64" cy="30" r="2" fill="#f3e9d2"/>
    <rect x="16" y="50" width="88" height="116" rx="6" fill="#1d2a24" stroke="#3b2f2a" stroke-width="4"/>
    <rect x="22" y="56" width="76" height="110" fill="#7fe0a0" opacity=".55"/>
    <g class="leaf">
      <rect x="22" y="56" width="76" height="110" fill="#4d6b68" stroke="#3b2f2a" stroke-width="3"/>
      <path d="M30 120h60M30 140h60" stroke="#3e5856" stroke-width="3"/>
      <circle cx="60" cy="88" r="16" fill="#9fe8b4" stroke="#c99a4b" stroke-width="5"/>
      <path d="M52 82q6 -6 14 -4" stroke="#ffffff" stroke-width="3" fill="none"/>
      <circle cx="88" cy="114" r="4" fill="#c99a4b" stroke="#3b2f2a" stroke-width="2"/>
    </g>
  </svg>`;

  function render(page) {
    const P = PAGES[page];
    const t = CH.t;
    const esc = CH.i18n.escapeHtml;
    const covers = CH.covers;
    document.getElementById("defs").innerHTML = CH.art.defs();
    document.title = t(P.keys.title);
    document.getElementById("title").textContent = t(P.keys.title);
    document.getElementById("tagline").textContent = t(P.keys.tagline);
    document.getElementById("footer-text").textContent = t(P.keys.footer);
    const entries = CH.shelf.filter((e) => e.stage === P.stage);
    const shelf = document.getElementById("shelf");
    shelf.innerHTML = entries.map((e) => `<a class="case${page === "lab" ? " lab-case" : ""}" href="episodes/${e.id}/index.html">
        <svg viewBox="0 0 480 270" aria-hidden="true"><g filter="url(#f-rough)">${covers[e.cover] ? covers[e.cover]() : ""}</g></svg>
        ${page === "lab" ? `<span class="stamp">${esc(t("shelf.lab.stamp"))}</span>` : ""}
        <div class="text"><h2>${esc(t(`shelf.${e.id}.title`))}</h2><p>${esc(t(`shelf.${e.id}.tagline`))}</p><span class="play">${esc(t(P.keys.play))}</span></div>
      </a>`).join("");
    if (!entries.length && page === "lab") shelf.innerHTML = `<p class="empty">${esc(t("shelf.lab.empty"))}</p>`;
    // The shelf only shows its door when the laboratory holds something.
    const hasLab = CH.shelf.some((e) => e.stage === PAGES.lab.stage);
    const door = document.getElementById("door");
    if (page === "lab" || hasLab) {
      door.href = P.door.href;
      door.setAttribute("aria-label", t(P.door.label));
      door.title = t(P.door.label);
      door.innerHTML = DOOR;
      door.hidden = false;
    }
  }

  CH.shelfView = { render };
})();

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

// Optional Cluedo grid. An episode that wants one defines CH.cluedoData:
//   CARDS: { kind: [ids] }, EXCLUDERS: { "kind.id": [clue or deduction ids] },
//   REFUTE: { witness: [{ card: "kind.id", clue, when? }] }.
// Card names: card.<kind>.<id> and card.<kind>.<id>.inline. Refutation lines: hyp.<witness>.<kind>_<id>.
(function () {
  const EMPTY = { CARDS: {}, EXCLUDERS: {}, REFUTE: {} };
  const data = () => CH.cluedoData || EMPTY;
  const kinds = () => Object.keys(data().CARDS);

  const known = (s, src) => !!(s.clues[src] || s.deds[src]);

  // Map of "kind.id" -> source id for every crossed-out card.
  function excluded(s) {
    const out = {};
    const ex = data().EXCLUDERS;
    Object.keys(ex).forEach((card) => {
      const src = ex[card].find((x) => known(s, x));
      if (src) out[card] = src;
    });
    return out;
  }

  // Picks the refutation a witness gives for a hypothesis {kind: id}, or null.
  // Prefers a card the grid has not crossed out yet.
  function refute(s, witness, hyp) {
    const options = (data().REFUTE[witness] || []).filter((r) => {
      const [kind, id] = r.card.split(".");
      return hyp[kind] === id && (!r.when || r.when(s));
    });
    if (!options.length) return null;
    const ex = excluded(s);
    return options.find((r) => !ex[r.card]) || options[0];
  }

  CH.cluedo = {
    get CARDS() {
      return data().CARDS;
    },
    get KINDS() {
      return kinds();
    },
    enabled: () => kinds().some((k) => data().CARDS[k].length),
    excluded,
    refute,
    sourceTitle: (src) => CH.t(src.startsWith("d_") ? `ded.${src}.title` : `clue.${src}.title`),
    name: (kind, id) => CH.t(`card.${kind}.${id}`),
    // Lower-case form with its article, for use inside a sentence.
    inline: (kind, id) => CH.t(`card.${kind}.${id}.inline`),
  };
})();

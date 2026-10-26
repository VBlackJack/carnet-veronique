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

// French texts of the second wordless episode. The game shows none of them: they are the
// page title and what screen readers say for each spot, card and deduction.
window.CH = window.CH || {};
CH.locales = CH.locales || {};
CH.locales.fr = Object.assign(CH.locales.fr || {}, {
  "episode.title": `Le Tic-tac du potager`,

  "scene.lavoir.name": `Le lavoir`,
  "scene.potager.name": `Le potager`,

  "hs.lavoir.veronique": `Véronique, le poignet nu`,
  "hs.lavoir.soap": `Le porte-savon sur le bord du bassin`,
  "hs.lavoir.mark": `La terre sèche sous le bord du bassin`,
  "hs.lavoir.tracks": `Les ornières vers le portail`,
  "hs.lavoir.sluice": `La vanne du ruisseau`,
  "hs.lavoir.stream": `Le fond du ruisseau`,
  "hs.lavoir.frog": `La grenouille sur son nénuphar`,
  "hs.lavoir.sheet": `Le drap qui sèche`,

  "hs.potager.benjamin": `Benjamin et sa citrouille`,
  "hs.potager.lantern": `La citrouille-lanterne`,
  "hs.potager.barrow": `La brouette et le cageot`,
  "hs.potager.hens": `Les poules près du compost`,
  "hs.potager.compost": `Le bac à compost`,
  "hs.potager.rope": `La corde de frein de l'épouvantail`,
  "hs.potager.scarecrow": `L'épouvantail à crécelle de Julien`,
  "hs.potager.crow": `Le corbeau sur le chapeau`,
  "hs.potager.coop": `La fenêtre du poulailler`,

  "card.wrist": `Le poignet de Véronique : une marque pâle, sans la montre`,
  "card.soap": `Le savon garde l'empreinte d'une montre`,
  "card.crate": `Sous le porte-savon renversé, la place sèche d'un cageot et de la paille`,
  "card.tracks": `Des ornières de brouette partent vers le potager`,
  "card.glint": `Quelque chose brille au fond du ruisseau`,
  "card.lure": `Le ruisseau vidé : seulement un leurre de pêche`,
  "card.barrow": `Le cageot est arrivé au potager, vide`,
  "card.carve": `Benjamin a creusé sa citrouille au-dessus du cageot, puis l'a vidé au compost`,
  "card.hens": `Les poules picorent des graines et de la paille près du compost`,
  "card.tick": `La crécelle arrêtée, le compost fait tic-tac`,

  "ded.wash": `Véronique a posé sa montre sur le savon pour laver les courges`,
  "ded.trip": `La montre est tombée dans le cageot, parti au potager en brouette`,
  "ded.compost": `La paille du cageot est partie au compost : la montre y est`,
});

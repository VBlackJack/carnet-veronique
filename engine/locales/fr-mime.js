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

// French texts of the wordless engine. Nothing here is shown on screen: these are the
// names that screen readers give to the buttons and pictures.
window.CH = window.CH || {};
CH.locales = CH.locales || {};
CH.locales.fr = Object.assign(CH.locales.fr || {}, {
  "mime.hud.sketchbook": `Carnet de croquis`,
  "mime.hud.sound_on": `Remettre le son`,
  "mime.hud.sound_off": `Couper le son`,
  "mime.hud.fullscreen": `Plein écran`,
  "mime.hud.fullscreen_exit": `Quitter le plein écran`,
  "mime.hud.home": `Retour à l'étagère`,
  "mime.title.play": `Commencer`,
  "mime.title.resume": `Reprendre`,
  "mime.title.restart": `Recommencer depuis le début`,
  "mime.end.replay": `Rejouer`,
  "mime.end.time": `Durée : {value}`,
  "mime.end.deductions": `Déductions : {found} sur {total}`,
  "mime.end.details": `Petits détails trouvés : {found} sur {total}`,
  "mime.nav.go": `Aller : {name}`,
  "mime.sketch.close": `Fermer le carnet`,
  "mime.rotate": `Tournez le téléphone`,
});

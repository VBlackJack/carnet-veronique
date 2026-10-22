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

// French interface texts shared by every episode. Episode locales load after this
// file and may override any key.
window.CH = window.CH || {};
CH.locales = CH.locales || {};
CH.locales.fr = Object.assign(CH.locales.fr || {}, {
  // ------------------------------------------------------------------ UI
  "ui.continue": `Reprendre l'enquête`,
  "ui.restart": `Recommencer depuis le début`,
  "ui.restart_confirm": `Recommencer ? L'enquête en cours sera effacée.`,
  "ui.yes": `Oui`,
  "ui.no": `Non`,
  "ui.notebook": `Carnet`,
  "ui.notebook_title": `Carnet d'enquête`,
  "ui.tab_clues": `Indices`,
  "ui.tab_deds": `Déductions`,
  "ui.tab_grid": `Grille`,
  "ui.tab_items": `Poche`,
  "ui.combine_tip": `Choisis deux fiches pour les rapprocher.`,
  "ui.combine_selected": `Rapprocher "{title}" avec...`,
  "ui.combine_nudge": `Plusieurs fiches attendent dans le Carnet. Essaie de les rapprocher !`,
  "ui.combine_help_title": `Comment enquêter`,
  "ui.combine_help": `Touche une fiche, puis une autre. Si les deux se répondent, Véronique en tire une déduction, et c'est elle qui fait avancer l'enquête. Rien n'est perdu à essayer : les mauvais rapprochements font juste sourire.`,
  "ui.pick_tip": `Quelle fiche montrer ?`,
  "ui.grid_tip": `Une case se barre toute seule quand une preuve l'exclut. Touche une case pour la marquer toi-même : croix, puis doute, puis rien.`,
  "ui.grid_who": `Qui ?`,
  "ui.grid_weapon": `Avec quoi ?`,
  "ui.grid_room": `Où ?`,
  "ui.grid_crossed": `Grille : {name} est hors de cause`,
  "ui.close": `Fermer`,
  "ui.cancel": `Annuler`,
  "ui.empty_deds": `Pas encore de déduction. Rapproche deux fiches pour en tirer une.`,
  "ui.empty_items": `Les poches sont vides. Pour l'instant.`,
  "ui.board_intro": `Complète le récit. Chaque blanc a sa réponse dans le carnet.`,
  "ui.board_submit": `Je crois que je sais`,
  "ui.board_blank": `...`,
  "ui.board_incomplete": `Il reste des blancs dans le récit.`,
  "ui.board_near": `Presque. Une ou deux pièces ne tiennent pas.`,
  "ui.board_far": `Biscotte te regarde avec une immense indulgence. Plusieurs pièces ne tiennent pas.`,
  "ui.talk_show": `Montrer une fiche...`,
  "ui.talk_hyp": `Proposer une hypothèse...`,
  "ui.talk_bye": `Au revoir`,
  "ui.hyp_title": `Une hypothèse pour {name}`,
  "ui.hyp_intro": `Choisis un suspect, une arme et une pièce. Si la personne peut contredire un élément, elle le dira.`,
  "ui.hyp_who": `Qui ?`,
  "ui.hyp_weapon": `Avec quoi ?`,
  "ui.hyp_room": `Où ?`,
  "ui.hyp_submit": `Proposer`,
  "ui.pro": `Regard professionnel`,
  "ui.pro_on": `Regard professionnel sur : {label}`,
  "ui.new_clue": `Nouvel indice : {title}`,
  "ui.new_ded": `Déduction : {title}`,
  "ui.new_place": `Nouveau lieu : {name}`,
  "ui.new_item": `Dans la poche : {name}`,
  "ui.lost_item": `Plus dans la poche : {name}`,
  "ui.biscotte": `Biscotte : demander son avis`,
  "ui.bis_hint": `Demander son avis (1 biscuit)`,
  "ui.bis_pet": `Le caresser`,
  "ui.bis_close": `Laisser Biscotte tranquille`,
  "ui.bis_count": `Biscuits donnés : {n}`,
  "ui.click_continue": `Clic ou Espace pour continuer`,
  "ui.bilan_title": `Bilan de l'enquête`,
  "ui.bilan_time": `Temps d'enquête`,
  "ui.bilan_biscuits": `Biscuits donnés à Biscotte`,
  "ui.bilan_tries": `Essais aux tableaux`,
  "ui.bilan_hyps": `Hypothèses proposées`,
  "ui.bilan_deds": `Déductions trouvées`,
  "ui.bilan_eggs": `Petits détails remarqués`,
  "ui.bilan_minutes": `{m} min`,
  "ui.bilan_ratio": `{n} / {total}`,
  "ui.next": `Continuer`,
  "ui.the_end": `Fin`,
  "ui.replay": `Rejouer depuis le début`,
  "ui.back_title": `Accueil`,
  "ui.fullscreen": `Plein écran`,
  "ui.fullscreen_exit": `Quitter le plein écran`,
  "ui.fullscreen_rotate": `Plein écran`,
  "ui.rotate": `Tourne ton téléphone : l'enquête se mène à l'horizontale.`,
  "ui.menu_hint": `Tout est sauvegardé automatiquement.`,
  "ui.shelf": `Toutes les enquêtes`,
  "hyp.ask": `Et si c'était {who}, avec {weapon}, dans {room} ?`,
  "hyp.none": `Je ne peux rien vous dire contre ça.`,
});

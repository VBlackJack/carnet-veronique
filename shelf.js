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

// The shelf: every game of the series, in order. Texts: shelf.<id>.title / shelf.<id>.tagline.
// stage: "released" is on the shelf page; "lab" is published too, but only shown behind the
// laboratory door (lab.html), for games being tried out; "workshop" never leaves the workshop.
window.CH = window.CH || {};
CH.shelf = [
  {
    id: "chevrerie",
    stage: "released",
    cover: "goat",
  },
  {
    id: "boule-a-facettes",
    stage: "released",
    cover: "disco",
  },
  {
    id: "verre-de-minuit",
    stage: "released",
    cover: "glass",
  },
  {
    id: "le-monocle",
    stage: "released",
    cover: "monocle",
  },
  // Wordless pilot (pantomime engine), tried out in the laboratory.
  {
    id: "lunettes-envolees",
    stage: "lab",
    cover: "spectacles",
  },
  // Birthday gift for 2026-12-05: kept in the workshop, never published before then.
];

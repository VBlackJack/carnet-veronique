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

// Hand-drawn SVG toolkit: seeded jitter, irregular shapes, people and goats.
// Everything returns SVG markup strings.
(function () {
  const P = Object.freeze({
    ink: "#3b2f2a",
    inkSoft: "#5b4a40",
    paper: "#efe4cf",
    cream: "#f3e9d2",
    plaster: "#e6d6b8",
    plasterDark: "#cdb894",
    wood: "#8a6142",
    woodLight: "#b0835a",
    woodDark: "#5b3f2c",
    ochre: "#c99a4b",
    mustard: "#c9a03f",
    rust: "#a85a3a",
    clay: "#b0573a",
    olive: "#7d7f4a",
    moss: "#5f6b45",
    sage: "#9aa58a",
    meadow: "#8f9a6a",
    meadowFar: "#b3b79a",
    mist: "#e4e5dc",
    sky: "#d8dccf",
    stone: "#a39a8b",
    stoneLight: "#c4bbab",
    slate: "#5f7178",
    teal: "#4d6b68",
    straw: "#d9b766",
    hay: "#c8a85a",
    mud: "#6b5444",
    mudDark: "#4a3a30",
    warm: "#ffd9a0",
    white: "#f6f1e6",
    red: "#a8443a",
    plum: "#6d4b5a",
    pink: "#d98f8a",
    leafRed: "#b5562f",
    leafGold: "#d09a3a",
  });

  let seed = 1;
  function srand(s) {
    seed = (s >>> 0) || 1;
  }
  function rnd() {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }
  const jit = (a) => (rnd() * 2 - 1) * a;
  const f = (n) => Math.round(n * 10) / 10;

  // Catmull-Rom spline through points, as cubic Beziers.
  function smooth(pts, closed) {
    const n = pts.length;
    if (n < 2) return "";
    const get = (i) => (closed ? pts[(i + n) % n] : pts[Math.max(0, Math.min(n - 1, i))]);
    let d = `M${f(pts[0][0])},${f(pts[0][1])}`;
    const last = closed ? n : n - 1;
    for (let i = 0; i < last; i++) {
      const p0 = get(i - 1), p1 = get(i), p2 = get(i + 1), p3 = get(i + 2);
      const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
      const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
      d += `C${f(c1[0])},${f(c1[1])} ${f(c2[0])},${f(c2[1])} ${f(p2[0])},${f(p2[1])}`;
    }
    return closed ? d + "Z" : d;
  }

  function blob(cx, cy, rx, ry, amp = 0.06, n = 12) {
    const pts = [];
    const rot = rnd() * Math.PI;
    for (let i = 0; i < n; i++) {
      const a = rot + (i / n) * Math.PI * 2;
      const k = 1 + jit(amp);
      pts.push([cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k]);
    }
    return smooth(pts, true);
  }

  // Straight-edged polygon with subdivided, jittered edges.
  function poly(pts, amp = 2.5, closed = true, sub = 2) {
    const out = [];
    const n = pts.length;
    const edges = closed ? n : n - 1;
    for (let i = 0; i < edges; i++) {
      const a = pts[i], b = pts[(i + 1) % n];
      for (let k = 0; k < sub; k++) {
        const t = k / sub;
        out.push([a[0] + (b[0] - a[0]) * t + jit(amp), a[1] + (b[1] - a[1]) * t + jit(amp)]);
      }
    }
    if (!closed) out.push([pts[n - 1][0] + jit(amp), pts[n - 1][1] + jit(amp)]);
    return "M" + out.map((p) => `${f(p[0])},${f(p[1])}`).join("L") + (closed ? "Z" : "");
  }

  const rect = (x, y, w, h, amp = 2.5) => poly([[x, y], [x + w, y], [x + w, y + h], [x, y + h]], amp);
  const soft = (pts, amp = 2) => smooth(pts.map((p) => [p[0] + jit(amp), p[1] + jit(amp)]), true);
  const curve = (pts, amp = 1.5) => smooth(pts.map((p) => [p[0] + jit(amp), p[1] + jit(amp)]), false);
  const line = (x1, y1, x2, y2, amp = 2) =>
    `M${f(x1)},${f(y1)}Q${f((x1 + x2) / 2 + jit(amp * 2))},${f((y1 + y2) / 2 + jit(amp * 2))} ${f(x2)},${f(y2)}`;

  function sh(d, fill, o = {}) {
    const sw = o.sw === undefined ? 3 : o.sw;
    const stroke = o.stroke === undefined ? P.ink : o.stroke;
    const attrs = [
      `d="${d}"`,
      `fill="${fill || "none"}"`,
      stroke ? `stroke="${stroke}" stroke-width="${sw}"` : "",
      'stroke-linejoin="round" stroke-linecap="round"',
      o.op !== undefined ? `opacity="${o.op}"` : "",
      o.cls ? `class="${o.cls}"` : "",
      o.extra || "",
    ];
    return `<path ${attrs.join(" ")}/>`;
  }
  const ink = (d, sw = 2.5, o = {}) => sh(d, "none", Object.assign({ sw }, o));
  const g = (content, attrs = "") => `<g ${attrs}>${content}</g>`;
  const tr = (x, y, s = 1, flip = false) => `transform="translate(${f(x)},${f(y)}) scale(${flip ? -s : s},${s})"`;
  const text = (x, y, str, o = {}) =>
    `<text x="${x}" y="${y}" font-family="${o.font || "Caveat, cursive"}" font-size="${o.size || 28}" fill="${o.fill || P.ink}" text-anchor="${o.anchor || "middle"}"${o.rot ? ` transform="rotate(${o.rot} ${x} ${y})"` : ""}${o.weight ? ` font-weight="${o.weight}"` : ""}>${CH.i18n.escapeHtml(str)}</text>`;

  // Shared defs: filters, patterns, gradients. Injected once in the page.
  function defs() {
    return `
<filter id="f-rough" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="4" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="4.5" xChannelSelector="R" yChannelSelector="G"/></filter>
<filter id="f-rough-s" x="-10%" y="-10%" width="120%" height="120%"><feTurbulence type="fractalNoise" baseFrequency="0.06" numOctaves="2" seed="9" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="2.4" xChannelSelector="R" yChannelSelector="G"/></filter>
<filter id="f-fuzz" x="-10%" y="-10%" width="120%" height="120%"><feTurbulence type="turbulence" baseFrequency="0.5" numOctaves="2" seed="2" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="5" xChannelSelector="R" yChannelSelector="G"/></filter>
<filter id="f-blur-s" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="6"/></filter>
<filter id="f-blur-l" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="24"/></filter>
<pattern id="p-hatch" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(35)"><line x1="0" y1="0" x2="0" y2="9" stroke="${P.ink}" stroke-width="1.6" opacity=".55"/></pattern>
<pattern id="p-hatch-l" width="12" height="12" patternUnits="userSpaceOnUse" patternTransform="rotate(-30)"><line x1="0" y1="0" x2="0" y2="12" stroke="${P.ink}" stroke-width="1.2" opacity=".3"/></pattern>
<pattern id="p-flowers" width="60" height="60" patternUnits="userSpaceOnUse"><circle cx="15" cy="15" r="4" fill="${P.rust}" opacity=".35"/><circle cx="45" cy="45" r="4" fill="${P.olive}" opacity=".35"/><path d="M15 21 q2 8 -2 14" stroke="${P.olive}" stroke-width="1.5" fill="none" opacity=".35"/></pattern>
<pattern id="p-tiles" width="40" height="40" patternUnits="userSpaceOnUse"><rect width="40" height="40" fill="#e9e4d8"/><path d="M0 0H40V40" stroke="#b9b1a0" stroke-width="2" fill="none"/></pattern>
<pattern id="p-planks" width="160" height="46" patternUnits="userSpaceOnUse"><rect width="160" height="46" fill="${P.woodLight}"/><path d="M0 45H160M100 0V46" stroke="${P.woodDark}" stroke-width="2.5" opacity=".6"/><path d="M10 20q30 -4 60 2" stroke="${P.woodDark}" stroke-width="1.2" fill="none" opacity=".35"/></pattern>
<pattern id="p-fleece" width="8" height="8" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.6" fill="#000" opacity=".12"/><circle cx="6" cy="6" r="1.4" fill="#fff" opacity=".12"/></pattern>
<radialGradient id="g-warm"><stop offset="0" stop-color="${P.warm}" stop-opacity=".75"/><stop offset="1" stop-color="${P.warm}" stop-opacity="0"/></radialGradient>
<radialGradient id="g-vignette" cx=".5" cy=".5" r=".75"><stop offset=".55" stop-color="#2a1d14" stop-opacity="0"/><stop offset="1" stop-color="#2a1d14" stop-opacity=".5"/></radialGradient>
<linearGradient id="g-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#cfd3c6"/><stop offset="1" stop-color="#eee6d2"/></linearGradient>
<linearGradient id="g-night" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#26303a"/><stop offset="1" stop-color="#3c3a3f"/></linearGradient>
<linearGradient id="g-beam" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff3d2" stop-opacity=".55"/><stop offset="1" stop-color="#fff3d2" stop-opacity="0"/></linearGradient>
<linearGradient id="g-mist" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f1efe6" stop-opacity="0"/><stop offset=".5" stop-color="#f1efe6" stop-opacity=".85"/><stop offset="1" stop-color="#f1efe6" stop-opacity="0"/></linearGradient>`;
  }

  // ---------- Faces ----------

  function face(c) {
    let s = "";
    const ex = c.expr || "neutral";
    const look = ex === "skeptic" || ex === "amused" ? 4 : 0;
    // Eyes
    s += sh(blob(-16 + look, -362, 4.2, 5, 0.05, 8), P.ink, { sw: 0 });
    s += sh(blob(16 + look, -362, 4.2, 5, 0.05, 8), P.ink, { sw: 0 });
    // Brows
    const bl = ex === "focus" ? -373 : ex === "skeptic" ? -374 : -376;
    const br = ex === "skeptic" || ex === "amused" ? -384 : ex === "focus" ? -373 : -376;
    s += ink(line(-26, bl + (ex === "focus" ? -2 : 0), -8, bl + (ex === "focus" ? 3 : 0), 0.5), c.browWidth || 2.6, { stroke: c.browColor || P.ink });
    s += ink(line(8, br + (ex === "focus" ? 3 : 0), 26, br + (ex === "focus" ? -2 : 0), 0.5), c.browWidth || 2.6, { stroke: c.browColor || P.ink });
    // Nose
    s += ink(curve([[2, -356], [6, -344], [0, -341]], 0.5), 2.2, { stroke: P.inkSoft });
    // Mouth
    const mouths = {
      neutral: [[-10, -330], [0, -327], [10, -330]],
      smile: [[-15, -333], [0, -323], [15, -333]],
      amused: [[-12, -329], [2, -326], [14, -333]],
      focus: [[-7, -329], [0, -329], [7, -329]],
      skeptic: [[-11, -327], [2, -329], [12, -332]],
      sad: [[-10, -326], [0, -330], [10, -326]],
      open: [[-10, -332], [0, -322], [10, -332]],
    };
    s += ink(curve(mouths[ex] || mouths.neutral, 0.3), 2.6, { stroke: "#6b3b33" });
    if (ex === "smile") s += sh(soft([[-12, -331], [0, -324], [12, -331], [0, -328]], 0.3), "#f4ece4", { sw: 1.2 });
    // Cheeks
    s += sh(blob(-26, -343, 8, 5, 0.1, 8), c.blush || P.pink, { sw: 0, op: 0.45 });
    s += sh(blob(26, -343, 8, 5, 0.1, 8), c.blush || P.pink, { sw: 0, op: 0.45 });
    if (c.squint) s += ink(line(-24, -366, -8, -366, 0.2), 2.4) + ink(line(8, -366, 24, -366, 0.2), 2.4);
    if (c.noseMarks) s += `<ellipse cx="-6" cy="-358" rx="2.6" ry="3.6" fill="#d9605a" opacity=".85"/><ellipse cx="7" cy="-358" rx="2.6" ry="3.6" fill="#d9605a" opacity=".85"/>`;
    if (c.mole) s += `<circle cx="9" cy="-318" r="${c.mole === "big" ? 3 : 2}" fill="${P.inkSoft}"/>`;
    if (c.freckles) {
      [[-30, -350], [-24, -346], [-34, -344], [-20, -351], [-28, -340], [30, -350], [24, -346], [34, -344], [20, -351], [28, -340], [-4, -350], [5, -349]].forEach(([x, y]) => (s += `<circle cx="${x}" cy="${y}" r="1.4" fill="#a8603e" opacity=".75"/>`));
    }
    return s;
  }

  function glasses(c) {
    const gl = c.glasses;
    if (!gl) return "";
    const col = gl.color || P.ink;
    const w = gl.thick ? 5.5 : 3;
    const tilt = gl.crooked ? `transform="rotate(-6 0 -362)"` : "";
    let s = "";
    // Lens fill: clear by default, or tinted (sunglasses, DJ shades).
    const lens = gl.tint ? `fill="${gl.tint}" fill-opacity=".6"` : 'fill="#ffffff" fill-opacity=".14"';
    if (gl.aviator) {
      s += sh(soft([[-38, -376], [-6, -374], [-7, -356], [-16, -342], [-30, -344], [-38, -358]], 0.8), gl.tint || "#ffffff", { stroke: col, sw: w, extra: gl.tint ? 'fill-opacity=".6"' : 'fill-opacity=".14"' });
      s += sh(soft([[6, -374], [38, -376], [38, -358], [30, -344], [16, -342], [7, -356]], 0.8), gl.tint || "#ffffff", { stroke: col, sw: w, extra: gl.tint ? 'fill-opacity=".6"' : 'fill-opacity=".14"' });
      s += ink(line(-6, -372, 6, -372, 0.2), w * 0.8, { stroke: col }) + ink(line(-6, -366, 6, -366, 0.2), w * 0.6, { stroke: col });
      s += ink(line(-38, -370, -46, -364, 0.3), w * 0.7, { stroke: col }) + ink(line(38, -370, 46, -364, 0.3), w * 0.7, { stroke: col });
      s += ink(line(-30, -370, -22, -372, 0.2), 2, { stroke: "#ffffff", op: 0.7 });
      return g(s, tilt);
    }
    if (gl.round || gl.pinceNez) {
      const r = gl.pinceNez ? 12 : 15;
      s += `<circle cx="-20" cy="-362" r="${r}" ${lens} stroke="${col}" stroke-width="${w}"/>`;
      s += `<circle cx="20" cy="-362" r="${r}" ${lens} stroke="${col}" stroke-width="${w}"/>`;
      s += ink(curve([[-20 + r, -364], [0, -370], [20 - r, -364]], 0.3), w * 0.8, { stroke: col });
      if (gl.pinceNez) {
        s += ink(curve([[-20 - r, -360], [-46, -330], [-30, -290], [-10, -270]], 0.5), 1.4, { stroke: "#2b2b2b", op: 0.8 });
      } else {
        s += ink(line(-20 - r, -366, -44, -364, 0.3), w * 0.7, { stroke: col });
        s += ink(line(20 + r, -366, 44, -364, 0.3), w * 0.7, { stroke: col });
      }
      s += ink(line(-26, -368, -21, -372, 0.2), 2, { stroke: "#ffffff", op: 0.8 });
      return g(s, tilt);
    }
    const lensFill = gl.tint || "#ffffff", lensOp = gl.tint ? 'fill-opacity=".6"' : 'fill-opacity=".14"';
    const [cl, cr, cb] = gl.multi || [col, col, col];
    s += sh(soft([[-36, -374], [-6, -375], [-6, -352], [-12, -347], [-32, -347], [-37, -356]], 1), lensFill, { stroke: cl, sw: w, op: 0.95, extra: lensOp });
    s += sh(soft([[6, -375], [36, -374], [37, -356], [32, -347], [12, -347], [6, -352]], 1), lensFill, { stroke: cr, sw: w, op: 0.95, extra: lensOp });
    s += ink(line(-6, -368, 6, -368, 0.3), w * 0.8, { stroke: cb });
    s += ink(line(-37, -368, -44, -364, 0.3), w * 0.7, { stroke: cl });
    s += ink(line(37, -368, 44, -364, 0.3), w * 0.7, { stroke: cr });
    // Glint
    s += ink(line(-28, -369, -22, -372, 0.2), 2, { stroke: "#ffffff", op: 0.8 });
    if (gl.scratched) s += ink(curve([[12, -368], [22, -360], [30, -352]], 0.5), 1.2, { stroke: "#ffffff", op: 0.7 });
    if (gl.tape) s += sh(rect(-5, -372, 10, 8, 0.6), "#f1ecd0", { sw: 1.5 });
    return g(s, tilt);
  }

  // ---------- People ----------
  // Local coordinates: feet on y=0, about 420 units tall, facing viewer.

  function hairBack(c) {
    const h = c.hair;
    switch (c.hairStyle) {
      case "bob":
        return sh(soft([[-58, -392], [-64, -340], [-62, -300], [-38, -294], [38, -294], [62, -300], [64, -340], [58, -392], [0, -418]], 2), h);
      case "braid":
        return sh(soft([[-50, -392], [-54, -340], [-44, -330], [44, -330], [54, -340], [50, -392], [0, -414]], 2), h);
      case "bun":
        return sh(blob(0, -414, 26, 20, 0.06, 10), h);
      case "wavyBob":
        return sh(soft([[-56, -390], [-62, -340], [-60, -318], [-44, -312], [44, -312], [60, -318], [62, -340], [56, -390], [0, -418]], 2), h);
      case "curly":
        return sh(blob(0, -372, 74, 66, 0.16, 18), h);
      case "curlyShort":
        return sh(blob(0, -386, 64, 42, 0.16, 16), h);
      default:
        return "";
    }
  }

  function hairFront(c) {
    const h = c.hair;
    switch (c.hairStyle) {
      case "bob":
        return (
          sh(soft([[-50, -390], [-30, -414], [10, -418], [44, -406], [54, -382], [40, -380], [26, -372], [12, -378], [-4, -372], [-20, -378], [-36, -372], [-46, -360]], 1.5), h) +
          ink(curve([[-20, -406], [-26, -384]], 0.6), 1.6, { stroke: "#2f2018", op: 0.6 }) +
          ink(curve([[8, -410], [6, -386]], 0.6), 1.6, { stroke: "#2f2018", op: 0.6 }) +
          sh(soft([[-48, -384], [-60, -330], [-58, -300], [-48, -318], [-44, -360]], 1.2), h) +
          sh(soft([[48, -384], [60, -330], [58, -300], [48, -318], [44, -360]], 1.2), h)
        );
      case "bun":
        return sh(soft([[-44, -372], [-40, -398], [-14, -412], [16, -412], [40, -398], [44, -372], [30, -390], [0, -396], [-28, -390]], 1.5), h) + ink(curve([[-30, -396], [0, -404], [30, -396]], 0.5), 1.4, { stroke: "#ffffff", op: 0.5 });
      case "swept":
        return sh(soft([[-46, -370], [-44, -400], [-10, -418], [30, -414], [50, -392], [46, -372], [30, -396], [-6, -398], [-30, -388]], 1.5), h);
      case "short":
        return sh(soft([[-46, -368], [-44, -398], [-16, -414], [18, -414], [44, -398], [46, -368], [36, -386], [0, -394], [-36, -386]], 1.5), h);
      case "braid":
        return (
          sh(soft([[-46, -370], [-38, -404], [0, -416], [38, -404], [46, -370], [30, -392], [-4, -396], [-30, -388]], 1.5), h) +
          sh(soft([[48, -352], [64, -300], [60, -240], [50, -238], [48, -300], [40, -344]], 1.5), h) +
          ink(curve([[50, -320], [60, -316]], 0.3), 1.5) + ink(curve([[52, -294], [62, -290]], 0.3), 1.5) + ink(curve([[52, -268], [60, -264]], 0.3), 1.5)
        );
      case "tuft":
        // Short cut, sides trimmed, front lifted and swept to the side.
        return (
          sh(soft([[-46, -366], [-46, -392], [-30, -412], [0, -420], [26, -418], [46, -402], [48, -376], [40, -390], [30, -400], [10, -404], [-6, -398], [-22, -394], [-36, -384]], 1.2), h) +
          sh(soft([[-6, -400], [10, -428], [34, -426], [46, -408], [26, -406]], 1.2), h) +
          ink(curve([[2, -414], [18, -420], [34, -416]], 0.4), 1.4, { stroke: "#5a3a26", op: 0.6 })
        );
      case "fade":
        // Very short sides, darker lifted crest on top.
        return (
          sh(soft([[-46, -360], [-44, -384], [-36, -376], [-40, -356]], 0.8), h, { op: 0.55 }) +
          sh(soft([[46, -360], [44, -384], [36, -376], [40, -356]], 0.8), h, { op: 0.55 }) +
          sh(soft([[-34, -398], [-22, -414], [0, -424], [20, -428], [36, -416], [40, -400], [24, -404], [6, -408], [-14, -404]], 1.2), h) +
          ink(curve([[-6, -416], [6, -432], [16, -426]], 0.6), 2, { stroke: h }) + ink(curve([[10, -418], [24, -434], [30, -424]], 0.6), 2, { stroke: h })
        );
      case "wavyBob":
        return (
          sh(soft([[-48, -386], [-30, -414], [6, -420], [40, -408], [52, -384], [36, -390], [20, -380], [0, -392], [-22, -384], [-40, -372]], 1.4), h) +
          [-52, 52].map((x) => sh(soft([[x * 0.92, -384], [x * 1.12, -360], [x * 0.98, -344], [x * 1.14, -326], [x * 0.96, -314], [x * 0.84, -340]], 1), h)).join("") +
          ink(curve([[-36, -404], [-20, -396], [-8, -406]], 0.4), 1.4, { stroke: "#000", op: 0.35 })
        );
      case "slick":
        // Slicked back, glossy.
        return sh(soft([[-46, -370], [-44, -400], [-20, -418], [20, -418], [44, -400], [46, -370], [36, -392], [0, -402], [-36, -392]], 1), h) + ink(curve([[-30, -404], [0, -414], [30, -404]], 0.4), 2, { stroke: "#ffffff", op: 0.35 }) + ink(curve([[-24, -396], [4, -406], [28, -396]], 0.4), 1.4, { stroke: "#000", op: 0.3 });
      case "tousled":
        return sh(soft([[-48, -366], [-50, -394], [-36, -416], [-12, -424], [14, -420], [36, -414], [50, -394], [48, -366], [40, -384], [26, -380], [14, -392], [0, -380], [-14, -392], [-28, -380], [-40, -386]], 2.2), h);
      case "neatSide":
        // Short, neat side parting.
        return sh(soft([[-46, -368], [-44, -398], [-24, -414], [16, -416], [42, -402], [46, -372], [38, -390], [10, -400], [-14, -404], [-20, -392], [-38, -384]], 1), h) + ink(line(-16, -412, -20, -394, 0.3), 1.6, { stroke: "#000", op: 0.3 });
      case "bald":
        return sh(soft([[-46, -360], [-44, -380], [-38, -372]], 1), h) + sh(soft([[46, -360], [44, -380], [38, -372]], 1), h);
      case "curly":
      case "curlyShort":
        // A fringe of small curls along the hairline.
        return [-40, -26, -12, 2, 16, 30, 42].map((x, i) => sh(blob(x, -398 - (i % 2) * 8, 13, 12, 0.12, 8), h, { sw: 2 })).join("");
      default:
        return "";
    }
  }

  function arm(side, c) {
    const k = side === "L" ? -1 : 1;
    const pose = (side === "L" ? c.poseL : c.poseR) || "down";
    const sleeve = c.sleeve || c.top;
    let s = "";
    if (pose === "pocket") {
      s += sh(soft([[k * 52, -300], [k * 64, -286], [k * 62, -190], [k * 44, -186], [k * 42, -280]], 1.5), sleeve);
      return s;
    }
    if (pose === "up") {
      // Hand raised to the face (phone or chin).
      s += sh(soft([[k * 50, -300], [k * 66, -290], [k * 74, -240], [k * 54, -232], [k * 46, -262]], 1.5), sleeve);
      s += sh(soft([[k * 74, -248], [k * 62, -340], [k * 46, -336], [k * 56, -238]], 1.5), sleeve);
      s += sh(blob(k * 50, -350, 12, 14, 0.08, 9), c.gloves || c.skin);
      return s;
    }
    if (pose === "front") {
      s += sh(soft([[k * 50, -300], [k * 66, -290], [k * 56, -214], [k * 18, -206], [k * 18, -224], [k * 40, -230], [k * 44, -280]], 1.5), sleeve);
      s += sh(blob(k * 14, -214, 12, 12, 0.08, 9), c.gloves || c.skin);
      return s;
    }
    if (c.rolled) {
      s += sh(soft([[k * 53, -238], [k * 71, -242], [k * 74, -184], [k * 56, -180]], 1.5), c.skin);
      s += sh(soft([[k * 52, -300], [k * 68, -288], [k * 72, -236], [k * 52, -232], [k * 46, -276]], 1.5), sleeve);
      if (c.burns) s += sh(blob(k * 64, -214, 5, 3, 0.1, 7), "#c96a5a", { sw: 0, op: 0.7 }) + sh(blob(k * 62, -196, 4, 2.5, 0.1, 7), "#c96a5a", { sw: 0, op: 0.6 });
    } else {
      s += sh(soft([[k * 52, -300], [k * 68, -288], [k * 74, -184], [k * 56, -180], [k * 46, -276]], 1.5), sleeve);
    }
    s += sh(blob(k * 65, -172, 12, 13, 0.08, 9), c.gloves || c.skin);
    return s;
  }

  function person(o) {
    const c = Object.assign(
      { skin: "#e8b99c", hair: "#5a3b2a", hairStyle: "short", top: "#7d7b78", pants: "#2a2626", shoes: "#2b2523", seed: 11 },
      o
    );
    srand(c.seed);
    let s = hairBack(c);
    // Legs
    if (c.longSkirt) {
      s += sh(soft([[-52, -172], [52, -172], [60, -100], [66, -22], [-66, -22], [-60, -100]], 2), c.longSkirt);
      s += ink(curve([[-20, -150], [-26, -90], [-30, -26]], 0.8), 1.4, { op: 0.35 }) + ink(curve([[18, -150], [24, -90], [28, -26]], 0.8), 1.4, { op: 0.35 });
    } else if (c.knickers) {
      s += sh(soft([[-44, -172], [-4, -172], [-4, -100], [-24, -92], [-46, -100]], 1.5), c.pants);
      s += sh(soft([[4, -172], [44, -172], [46, -100], [24, -92], [4, -100]], 1.5), c.pants);
      s += sh(rect(-36, -100, 28, 88, 1.2), c.socks) + sh(rect(8, -100, 28, 88, 1.2), c.socks);
      for (let y = -92; y < -20; y += 12) s += ink(line(-34, y, -10, y, 0.3), 1, { op: 0.3 }) + ink(line(10, y, 34, y, 0.3), 1, { op: 0.3 });
    } else if (c.skirt) {
      s += sh(soft([[-50, -170], [50, -170], [58, -40], [-58, -40]], 2), c.skirt);
      s += sh(rect(-30, -44, 18, 36, 1.5), c.legs || c.skin) + sh(rect(12, -44, 18, 36, 1.5), c.legs || c.skin);
      if (c.legStripes) {
        const cols = [].concat(c.legStripes);
        for (let y = -40, i = 0; y < -10; y += 8, i++) s += sh(rect(-29, y, 16, 4, 0.3), cols[i % cols.length], { sw: 0 }) + sh(rect(13, y, 16, 4, 0.3), cols[i % cols.length], { sw: 0 });
      }
    } else if (c.flares) {
      s += sh(soft([[-40, -172], [-6, -172], [-6, -90], [-2, -12], [-50, -12], [-38, -90]], 1.5), c.pants);
      s += sh(soft([[6, -172], [40, -172], [38, -90], [50, -12], [2, -12], [6, -90]], 1.5), c.pants);
    } else {
      s += sh(soft([[-40, -172], [-6, -172], [-8, -14], [-36, -14]], 1.5), c.pants);
      s += sh(soft([[6, -172], [40, -172], [36, -14], [8, -14]], 1.5), c.pants);
      if (c.cuffs) {
        s += sh(rect(-38, -34, 32, 14, 1), c.pants) + sh(rect(6, -34, 32, 14, 1), c.pants);
      }
    }
    if (c.legwarmers) {
      s += sh(rect(-40, -84, 34, 70, 1.2), c.legwarmers) + sh(rect(6, -84, 34, 70, 1.2), c.legwarmers);
      for (let y = -76; y < -18; y += 9) s += ink(line(-38, y, -8, y, 0.3), 1.2, { op: 0.35 }) + ink(line(8, y, 38, y, 0.3), 1.2, { op: 0.35 });
    }
    // Feet
    if (c.sandals) {
      s += sh(blob(-22, -9, 20, 9, 0.05, 9), c.skin) + sh(blob(22, -9, 20, 9, 0.05, 9), c.skin);
      s += sh(rect(-40, -10, 36, 8, 1), P.ink) + sh(rect(4, -10, 36, 8, 1), P.ink);
      s += ink(line(-36, -18, -10, -18, 0.5), 5) + ink(line(8, -18, 34, -18, 0.5), 5);
    } else if (c.boots) {
      s += sh(soft([[-40, -48], [-8, -48], [-6, -2], [-44, -2]], 1.5), c.boots) + sh(soft([[8, -48], [40, -48], [44, -2], [6, -2]], 1.5), c.boots);
    } else {
      s += sh(blob(-24, -9, 22, 10, 0.05, 10), c.shoes) + sh(blob(24, -9, 22, 10, 0.05, 10), c.shoes);
    }
    // Torso
    if (c.coatLong) {
      s += sh(soft([[-58, -302], [58, -302], [62, -200], [64, -96], [-64, -96], [-62, -200]], 2), c.top);
    } else {
      s += sh(soft([[-56, -302], [56, -302], [54, -230], [50, -160], [-50, -160], [-54, -230]], 2), c.top);
    }
    if (c.stripes) for (let y = -288; y < -170; y += 24) s += sh(rect(-52, y, 104, 10, 0.8), c.stripes, { sw: 0, op: 0.9 });
    if (c.sequins) {
      // Scattered sequins over the outfit, legs included for a jumpsuit.
      const spots = c.flares ? 46 : 26;
      for (let i = 0; i < spots; i++) {
        const onLegs = c.flares && i % 2 === 1;
        const x = onLegs ? (i % 4 === 1 ? -24 : 24) + jit(14) : jit(48);
        const y = onLegs ? -160 + rnd() * 140 : -296 + rnd() * 130;
        s += `<circle cx="${f(x)}" cy="${f(y)}" r="2.4" fill="${c.sequins}" opacity=".85"/>`;
      }
    }
    if (c.dots) {
      const cols = [].concat(c.dots), r = c.dotSize || 5;
      const spots = c.overalls ? [] : [[-34, -280], [-6, -268], [24, -284], [38, -240], [-40, -230], [8, -228], [-22, -196], [30, -196], [-4, -176]];
      if (c.skirt || c.longSkirt) spots.push([-38, -140], [-10, -120], [22, -136], [44, -100], [-30, -80], [4, -70], [32, -60], [-48, -50]);
      spots.forEach(([x, y], i) => (s += `<circle cx="${x}" cy="${y}" r="${r}" fill="${cols[i % cols.length]}" opacity=".9"/>`));
    }
    if (c.leatherApron) {
      s += sh(soft([[-36, -280], [36, -280], [48, -56], [-48, -56]], 1.6), c.leatherApron);
      s += ink(line(-30, -280, -40, -304, 0.3), 4, { stroke: c.leatherApron }) + ink(line(30, -280, 40, -304, 0.3), 4, { stroke: c.leatherApron });
      s += ink(curve([[-30, -150], [0, -146], [30, -150]], 0.6), 1.4, { op: 0.4 }) + sh(blob(14, -112, 7, 5, 0.1, 7), "#3a2a20", { sw: 0, op: 0.35 });
    }
    if (c.braces) s += ink(line(-30, -302, -22, -162, 0.4), 6, { stroke: c.braces }) + ink(line(30, -302, 22, -162, 0.4), 6, { stroke: c.braces });
    if (c.shawl) {
      s += sh(soft([[-66, -306], [66, -306], [62, -258], [0, -196], [-62, -258]], 1.5), c.shawl);
      for (let i = 0; i < 9; i++) {
        const t = i / 8, x = -60 + t * 120, y = t < 0.5 ? -258 + t * 2 * 62 : -196 - (t - 0.5) * 2 * 62;
        s += `<circle cx="${f(x)}" cy="${f(y + 4)}" r="5" fill="${c.shawl}" stroke="${P.ink}" stroke-width="1.2"/>`;
      }
      [[-40, -284], [-20, -262], [0, -240], [20, -262], [40, -284], [-10, -290], [10, -290], [0, -220]].forEach(([x, y]) => (s += `<circle cx="${x}" cy="${y}" r="2.2" fill="#ffffff" opacity=".45"/>`));
    }
    if (c.guitar) {
      s += ink(line(-44, -302, 44, -150, 0.4), 4, { stroke: "#5a3a26" });
      s += sh(soft([[-56, -318], [-44, -326], [10, -228], [-2, -222]], 0.8), "#4a3020");
      s += sh(blob(14, -190, 30, 26, 0.05, 10), c.guitar) + sh(blob(36, -156, 38, 32, 0.05, 10), c.guitar);
      s += `<circle cx="22" cy="-176" r="9" fill="#2a1e18"/>` + ink(line(-50, -320, 34, -150, 0.2), 1, { stroke: "#efe4cf", op: 0.8 });
    }
    if (c.vneck || c.openShirt) s += sh(soft([[-16, -302], [0, c.openShirt ? -250 : -272], [16, -302]], 0.5), c.skin, { sw: 2 });
    if (c.goldChain) s += ink(curve([[-14, -300], [0, -272], [14, -300]], 0.3), 2.2, { stroke: "#d9b44a" });
    if (c.shirtCollar) s += sh(soft([[-16, -304], [0, -282], [-4, -300]], 0.4), c.shirtCollar, { sw: 1.8 }) + sh(soft([[16, -304], [0, -282], [4, -300]], 0.4), c.shirtCollar, { sw: 1.8 });
    if (c.knit) for (let x = -36; x <= 36; x += 18) s += ink(curve([[x, -296], [x + 4, -250], [x - 2, -204], [x + 3, -164]], 0.6), 1.6, { op: 0.3 });
    if (c.waistcoat) {
      s += sh(soft([[-32, -300], [32, -300], [36, -168], [0, -156], [-36, -168]], 1.2), c.waistcoat);
      [-268, -238, -208, -180].forEach((y) => (s += `<circle cx="0" cy="${y}" r="3" fill="${P.ochre}" stroke="${P.ink}" stroke-width="1"/>`));
    }
    if (c.tie) s += sh(soft([[-7, -300], [7, -300], [9, -226], [0, -212], [-9, -226]], 0.6), c.tie);
    if (c.watchChain) s += ink(curve([[-26, -214], [-10, -200], [10, -200], [26, -214]], 0.4), 2.2, { stroke: "#d9b44a" });
    if (c.jacket) {
      const bottom = c.jacketLong ? -110 : -150;
      s += sh(soft([[-58, -304], [-14, -300], [-8, bottom + 4], [-58, bottom]], 1.4), c.jacket) + sh(soft([[14, -300], [58, -304], [58, bottom], [8, bottom + 4]], 1.4), c.jacket);
      s += sh(soft([[-14, -300], [-30, -290], [-18, -240]], 0.6), c.lapel || c.jacket, { sw: 1.8 }) + sh(soft([[14, -300], [30, -290], [18, -240]], 0.6), c.lapel || c.jacket, { sw: 1.8 });
      if (c.doubleBreasted) [[-20, -230], [-20, -196], [20, -230], [20, -196]].forEach(([x, y]) => (s += `<circle cx="${x}" cy="${y}" r="3.2" fill="${P.ink}"/>`));
    }
    if (c.overalls) {
      // Bib and straps of a pair of overalls, over the shirt.
      s += sh(rect(-30, -262, 60, 100, 1.2), c.overalls) + sh(rect(-12, -248, 24, 18, 0.8), c.overalls, { sw: 1.6 });
      s += ink(line(-26, -262, -40, -302, 0.3), 7, { stroke: c.overalls }) + ink(line(26, -262, 40, -302, 0.3), 7, { stroke: c.overalls });
      s += `<circle cx="-24" cy="-256" r="3.5" fill="#d9b44a"/><circle cx="24" cy="-256" r="3.5" fill="#d9b44a"/>`;
      if (c.dots) [[-14, -226], [14, -212], [-12, -186], [16, -178]].forEach(([x, y], i) => (s += `<circle cx="${x}" cy="${y}" r="${c.dotSize || 5}" fill="${[].concat(c.dots)[(i + 3) % [].concat(c.dots).length]}" opacity=".9"/>`));
    }
    if (c.bigCollar) {
      // Wide pointed 1970s shirt collar, spread over the lapels.
      s += sh(poly([[-6, -304], [-52, -296], [-34, -266], [-4, -292]], 0.6), c.bigCollar, { sw: 1.8 });
      s += sh(poly([[6, -304], [52, -296], [34, -266], [4, -292]], 0.6), c.bigCollar, { sw: 1.8 });
    }
    if (c.coatOpen) {
      s += sh(soft([[-62, -306], [-16, -300], [-22, -92], [-70, -92]], 1.8), c.coatOpen) + sh(soft([[16, -300], [62, -306], [70, -92], [22, -92]], 1.8), c.coatOpen);
      if (c.capeLining) s += sh(soft([[-16, -300], [-26, -300], [-32, -92], [-22, -92]], 0.8), c.capeLining, { sw: 1.6 }) + sh(soft([[16, -300], [26, -300], [32, -92], [22, -92]], 0.8), c.capeLining, { sw: 1.6 });
      s += sh(soft([[-16, -300], [-34, -288], [-24, -230]], 0.6), c.coatOpen, { sw: 1.8 }) + sh(soft([[16, -300], [34, -288], [24, -230]], 0.6), c.coatOpen, { sw: 1.8 });
    }
    if (c.medals) c.medals.forEach((col, i) => {
      const x = 26 + i * 12;
      s += sh(rect(x - 5, -276, 10, 13, 0.3), col, { sw: 1.2 }) + `<circle cx="${x}" cy="-256" r="5.5" fill="#d9b44a" stroke="${P.ink}" stroke-width="1.2"/>`;
    });
    if (c.monocleCase) s += ink(curve([[-6, -222], [-14, -210], [-24, -212]], 0.3), 2, { stroke: "#d9b44a" }) + sh(rect(-34, -218, 14, 20, 0.3), c.monocleCase, { sw: 1.4 }) + `<circle cx="-27" cy="-212" r="4" fill="none" stroke="#d9b44a" stroke-width="1.4"/>`;
    if (c.smock) {
      s += sh(soft([[-60, -300], [60, -300], [72, -110], [-72, -110]], 2), c.smock);
      [[-30, -200, P.rust], [20, -160, P.teal], [36, -230, P.mustard], [-14, -140, P.plum]].forEach(([x, y, col]) => (s += `<circle cx="${x}" cy="${y}" r="5" fill="${col}" opacity=".75"/>`));
    }
    if (c.toolApron) {
      s += sh(soft([[-40, -230], [40, -230], [44, -108], [-44, -108]], 1.4), c.toolApron);
      s += sh(rect(-34, -184, 30, 26, 1), c.toolApron, { sw: 1.8 }) + sh(rect(6, -184, 30, 26, 1), c.toolApron, { sw: 1.8 });
      s += ink(line(-26, -196, -26, -170, 0.3), 3, { stroke: "#8a8f94" }) + ink(line(-18, -200, -16, -172, 0.3), 3, { stroke: P.woodDark }) + ink(line(20, -196, 22, -172, 0.3), 3, { stroke: "#8a8f94" });
    }
    if (c.dressCollar) s += sh(soft([[-22, -304], [0, -286], [22, -304], [12, -292], [0, -296], [-12, -292]], 0.5), c.dressCollar, { sw: 1.8 });
    if (c.keys) s += `<circle cx="38" cy="-160" r="9" fill="none" stroke="#b9a26a" stroke-width="3"/>` + ink(line(34, -152, 30, -128, 0.3), 3, { stroke: "#b9a26a" }) + ink(line(40, -152, 44, -126, 0.3), 3, { stroke: "#b9a26a" }) + ink(line(37, -152, 37, -122, 0.3), 3, { stroke: "#b9a26a" });
    if (c.sunPrint) {
      s += `<g stroke="#b9c3d6" stroke-width="2" fill="none" opacity=".8"><circle cx="-24" cy="-206" r="8"/>${[0, 45, 90, 135, 180, 225, 270, 315].map((a) => { const r = (a * Math.PI) / 180; return `<path d="M${(-24 + Math.cos(r) * 11).toFixed(1)} ${(-206 + Math.sin(r) * 11).toFixed(1)}L${(-24 + Math.cos(r) * 16).toFixed(1)} ${(-206 + Math.sin(r) * 16).toFixed(1)}"/>`; }).join("")}<path d="M-4 -196h34v26h-34zM6 -190l10 10l10 -12"/></g>`;
    }
    if (c.logo) s += sh(blob(0, -236, 22, 16, 0.08, 10), "#f2efe8", { sw: 2 }) + `<path d="M-12 -236a12 8 0 0 1 24 0" fill="none" stroke="#e98a4a" stroke-width="4"/><path d="M-8 -232a8 5 0 0 1 16 0" fill="none" stroke="#5aa0d8" stroke-width="3.5"/>`;
    if (c.pocket) s += sh(rect(16, -262, 24, 22, 1), c.top, { sw: 2 });
    if (c.gilet) s += sh(soft([[-56, -300], [-14, -300], [-10, -164], [-50, -162]], 1.5), c.gilet) + sh(soft([[14, -300], [56, -300], [50, -162], [10, -164]], 1.5), c.gilet) + ink(curve([[-40, -260], [-16, -258]], 0.5), 1.5, { op: 0.6 }) + ink(curve([[16, -258], [40, -260]], 0.5), 1.5, { op: 0.6 }) + ink(curve([[-42, -220], [-14, -218]], 0.5), 1.5, { op: 0.6 }) + ink(curve([[14, -218], [42, -220]], 0.5), 1.5, { op: 0.6 });
    if (c.cardigan) s += sh(soft([[-56, -300], [-18, -298], [-12, -166], [-50, -162]], 1.5), c.cardigan) + sh(soft([[18, -298], [56, -300], [50, -162], [12, -166]], 1.5), c.cardigan);
    if (c.apron) {
      s += sh(soft([[-36, -258], [36, -258], [46, -110], [-46, -110]], 2), c.apron);
      s += `<circle cx="-18" cy="-200" r="5" fill="${P.rust}" opacity=".6"/><circle cx="14" cy="-170" r="5" fill="${P.mustard}" opacity=".7"/><circle cx="20" cy="-224" r="4" fill="${P.olive}" opacity=".6"/><circle cx="-12" cy="-140" r="4" fill="${P.rust}" opacity=".6"/>`;
    }
    if (c.hoodie) s += sh(rect(-26, -214, 52, 34, 1.5), c.top, { sw: 2 }) + ink(line(-6, -300, -8, -268, 0.5), 2) + ink(line(6, -300, 8, -268, 0.5), 2);
    if (c.stetho) s += ink(curve([[-20, -300], [-24, -250], [0, -232], [24, -250], [20, -300]], 0.8), 3, { stroke: "#2f3a40" }) + `<circle cx="0" cy="-228" r="7" fill="#9aa3a8" stroke="${P.ink}" stroke-width="2"/>`;
    if (c.lanyard) s += ink(curve([[-18, -302], [0, -250], [18, -302]], 0.5), 2.5, { stroke: P.rust }) + sh(rect(-10, -252, 20, 26, 1), "#f3efe4", { sw: 2 });
    if (c.lavalliere) {
      const col = c.lavalliere;
      s += sh(soft([[0, -300], [-30, -316], [-34, -290], [-6, -294]], 0.8), col) + sh(soft([[0, -300], [30, -316], [34, -290], [6, -294]], 0.8), col);
      s += sh(soft([[-4, -298], [-16, -260], [-8, -250], [2, -294]], 0.8), col) + sh(soft([[4, -298], [14, -256], [6, -248], [-2, -294]], 0.8), col);
      s += `<circle cx="0" cy="-300" r="6" fill="${col}" stroke="${P.ink}" stroke-width="1.8"/>`;
    }
    if (c.glassesOnCollar) s += `<g fill="#ffffff" fill-opacity=".2" stroke="${c.glassesOnCollar}" stroke-width="2.6"><circle cx="-11" cy="-256" r="9"/><circle cx="11" cy="-256" r="9"/></g>` + ink(line(-2, -258, 2, -258, 0.2), 2.4, { stroke: c.glassesOnCollar });
    if (c.bowtie) s += sh(poly([[0, -300], [-18, -310], [-18, -290]], 0.4), c.bowtie, { sw: 1.8 }) + sh(poly([[0, -300], [18, -310], [18, -290]], 0.4), c.bowtie, { sw: 1.8 }) + `<circle cx="0" cy="-300" r="4" fill="${c.bowtie}" stroke="${P.ink}" stroke-width="1.5"/>`;
    // Arms
    s += arm("L", c) + arm("R", c);
    // Rings on the character's own hands. Facing the viewer, the left hand is on screen right:
    // ringLeftHand draws on kit side "R", ringRightHand on kit side "L".
    const ringAt = (side, stone) => {
      const k = side === "L" ? -1 : 1;
      const pose = (side === "L" ? c.poseL : c.poseR) || "down";
      if (pose === "pocket" || pose === "up") return "";
      const [x, y] = pose === "front" ? [k * 18, -208] : [k * 62, -166];
      return `<ellipse cx="${x}" cy="${y + 1}" rx="9" ry="4" fill="none" stroke="#e2bd4e" stroke-width="3.4"/><circle cx="${x}" cy="${y - 4}" r="7" fill="${stone}" stroke="${P.ink}" stroke-width="1.8"/><circle cx="${x - 2.4}" cy="${y - 6.4}" r="2" fill="#ffffff" opacity=".85"/>`;
    };
    if (c.ringLeftHand) s += ringAt("R", c.ringLeftHand);
    if (c.ringRightHand) s += ringAt("L", c.ringRightHand);
    if (c.polaroid) {
      // Polaroid SX-70 held at the chest, FlashBar standing on top (ten bulbs, used ones dark).
      s += sh(rect(-34, -244, 68, 44, 1), "#2b2b2b", { sw: 2.5 }) + sh(rect(-34, -244, 68, 12, 0.6), "#b9bdc0", { sw: 2 });
      s += `<circle cx="10" cy="-220" r="11" fill="#1a1a1c" stroke="#b9bdc0" stroke-width="3"/><circle cx="7" cy="-223" r="3" fill="#ffffff" opacity=".6"/>`;
      s += sh(rect(-13, -322, 26, 80, 0.6), "#d9dcdf", { sw: 2.4 }) + sh(rect(-10, -318, 20, 72, 0.4), "#f3f1ea", { sw: 1 });
      for (let b = 0; b < 10; b++) {
        const used = b < (c.polaroidUsed || 0);
        s += `<rect x="${b % 2 ? 1 : -8}" y="${-315 + Math.floor(b / 2) * 14}" width="7" height="11" rx="2" fill="${used ? "#4a4a4a" : "#fff6b8"}" stroke="#8a8a8a" stroke-width=".8"/>`;
      }
      s += sh(blob(-34, -214, 11, 12, 0.08, 8), c.skin) + sh(blob(34, -214, 11, 12, 0.08, 8), c.skin);
    }
    if (c.watch) {
      const [wx, wy] = c.poseL === "front" ? [-38, -228] : [c.poseL === "pocket" ? -64 : -76, -196];
      s += sh(rect(wx, wy, 20, 12, 0.8), c.watch, { sw: 2 });
    }
    if (c.phone && c.poseR === "up") s += sh(rect(40, -378, 14, 28, 0.8), "#2b2b30", { sw: 2 });
    if (c.cane) {
      s += ink(line(-68, -168, -84, -2, 0.6), 6, { stroke: P.woodDark });
      s += sh(blob(-66, -178, 11, 11, 0.08, 8), c.cane, { sw: 2 });
    }
    if (c.bag) s += sh(soft([[44, -170], [92, -170], [96, -122], [40, -122]], 1.2), c.bag) + ink(curve([[56, -170], [68, -186], [80, -170]], 0.4), 3);
    if (c.sketchbook) s += sh(rect(-86, -232, 30, 44, 1), c.sketchbook);
    if (c.notebookHeld) s += sh(rect(54, -186, 24, 30, 1), c.notebookHeld);
    if (c.clipboard) {
      s += sh(rect(40, -222, 44, 58, 1), "#8a6a46") + sh(rect(44, -214, 36, 48, 0.6), "#f6f1e2", { sw: 1.4 }) + sh(rect(54, -226, 16, 8, 0.4), "#9aa0a6", { sw: 1.4 });
      for (let y = -206; y < -172; y += 7) s += ink(line(48, y, 76, y, 0.2), 1, { op: 0.5 });
    }
    if (c.fan) {
      const fx = c.poseR === "front" ? 18 : 64, fy = c.poseR === "front" ? -214 : -172;
      let fan = "";
      for (let i = 0; i < 7; i++) {
        const a = (-150 + i * 20) * Math.PI / 180;
        fan += `<path d="M${fx} ${fy}L${f(fx + Math.cos(a) * 54)} ${f(fy + Math.sin(a) * 54)}L${f(fx + Math.cos(a + 0.35) * 54)} ${f(fy + Math.sin(a + 0.35) * 54)}Z" fill="${i % 2 ? c.fan : "#f3ece0"}" stroke="${P.ink}" stroke-width="1.4"/>`;
      }
      s += fan + sh(blob(fx, fy, 11, 11, 0.08, 8), c.skin);
    }
    if (c.blowpipe) {
      s += ink(line(-60, -372, -80, -24, 0.4), 7, { stroke: "#4a4a4e" }) + ink(line(-60, -372, -66, -260, 0.2), 9, { stroke: P.woodDark });
      s += `<circle cx="-81" cy="-20" r="16" fill="#ffb347" opacity=".35"/>` + sh(blob(-81, -20, 10, 9, 0.08, 8), "#ff8a3a", { sw: 1.6 });
    }
    if (c.biscuit) {
      const [bx, by] = c.poseL === "front" ? [-20, -230] : [-66, -192];
      let bis = sh(soft([[bx - 14, by + 10], [bx - 10, by - 10], [bx - 2, by - 8], [bx, by - 22], [bx + 8, by - 20], [bx + 6, by - 6], [bx + 16, by - 2], [bx + 14, by + 12]], 0.8), "#c98a4a", { sw: 1.8 });
      [[bx - 6, by], [bx + 6, by + 4], [bx + 3, by - 14]].forEach(([x, y], i) => (bis += `<circle cx="${x}" cy="${y}" r="2.4" fill="${["#e65a7a", "#f6f1e6", "#6ab0e0"][i]}"/>`));
      s += g(bis, `transform="translate(${bx},${by}) scale(1.7) translate(${-bx},${-by})"`);
    }
    if (c.programme) s += sh(rect(48, -222, 44, 58, 0.5), "#f3ece0", { sw: 2.4 }) + sh(rect(53, -217, 34, 48, 0.3), "none", { sw: 1.6, stroke: "#c9a24a" }) + sh(rect(58, -210, 24, 10, 0.2), c.programme, { sw: 0 }) + ink(line(58, -194, 82, -194, 0.2), 1.4, { op: 0.5 }) + ink(line(58, -186, 78, -186, 0.2), 1.4, { op: 0.5 });
    if (c.cigCase) s += sh(rect(58, -180, 18, 12, 0.6), "#c9c9c4", { sw: 1.6 });
    if (c.mug) s += sh(rect(56, -196, 26, 30, 1.5), c.mug) + ink(curve([[82, -190], [92, -182], [82, -172]], 0.5), 3);
    if (c.towel) s += sh(soft([[30, -306], [58, -306], [62, -240], [44, -236]], 1.5), "#f2efe6") + ink(line(36, -280, 58, -280, 0.5), 2, { stroke: P.red });
    // Neck and head
    s += sh(rect(-12, -324, 24, 28, 1.5), c.skin, { sw: 2.5 });
    if (c.highCollar) s += sh(soft([[-26, -332], [26, -332], [30, -298], [-30, -298]], 1), c.highCollar);
    if (c.turtleneck) {
      s += sh(soft([[-24, -330], [24, -330], [28, -298], [-28, -298]], 1.2), c.turtleneck);
      for (let x = -18; x <= 18; x += 9) s += ink(line(x, -328, x, -300, 0.2), 1.2, { op: 0.35 });
    }
    if (c.necklace) {
      const cols = ["#f2d36b", "#b9a0e0", "#84c98a", "#e98a7a", "#f2a6c8", "#8ec7e6"];
      for (let i = 0; i < 13; i++) {
        const a = Math.PI * (0.15 + (0.7 * i) / 12);
        s += `<circle cx="${f(Math.cos(a) * 20)}" cy="${f(-312 + Math.sin(a) * 14)}" r="3.6" fill="${cols[i % cols.length]}" stroke="${P.ink}" stroke-width="1"/>`;
      }
    }
    if (c.pearls) for (let i = 0; i < 15; i++) {
      const a = Math.PI * (0.12 + (0.76 * i) / 14);
      s += `<circle cx="${f(Math.cos(a) * 22)}" cy="${f(-312 + Math.sin(a) * 18)}" r="3" fill="#f6f2ea" stroke="${P.inkSoft}" stroke-width=".8"/>`;
    }
    if (c.stole) {
      s += sh(soft([[-66, -310], [-20, -318], [20, -318], [66, -310], [70, -270], [34, -262], [0, -282], [-34, -262], [-70, -270]], 3), c.stole, { extra: 'filter="url(#f-fuzz)"' });
    }
    if (c.loupe) s += ink(curve([[-12, -304], [-6, -260], [4, -236]], 0.4), 1.6, { stroke: "#3a3a3a" }) + `<circle cx="6" cy="-228" r="9" fill="#dfe8ec" fill-opacity=".5" stroke="#3a3a3a" stroke-width="2.4"/>`;
    if (c.headphones) s += ink(curve([[-34, -296], [-20, -318], [20, -318], [34, -296]], 0.4), 4, { stroke: "#2c2c2c" }) + `<ellipse cx="-36" cy="-292" rx="11" ry="9" fill="#3a3330" stroke="${P.ink}" stroke-width="2"/><ellipse cx="36" cy="-292" rx="11" ry="9" fill="#3a3330" stroke="${P.ink}" stroke-width="2"/>`;
    if (c.scarfHigh) s += sh(soft([[-28, -326], [28, -326], [30, -304], [-30, -304]], 1), c.scarfHigh) + sh(soft([[14, -306], [30, -306], [36, -266], [22, -262]], 1), c.scarfHigh);
    if (c.scarf) s += sh(soft([[-30, -318], [30, -318], [34, -298], [-34, -298]], 1.5), c.scarf) + sh(soft([[10, -300], [28, -300], [24, -240], [8, -246]], 1.5), c.scarf);
    s += sh(blob(-44, -358, 8, 11, 0.08, 8), c.skin, { sw: 2.5 }) + sh(blob(44, -358, 8, 11, 0.08, 8), c.skin, { sw: 2.5 });
    s += sh(soft([[-44, -372], [-40, -398], [-20, -412], [20, -412], [40, -398], [44, -372], [42, -340], [26, -316], [0, -310], [-26, -316], [-42, -340]], 1.2), c.skin);
    s += face(c);
    if (c.longBeard) {
      s += sh(soft([[-42, -352], [-40, -320], [-26, -290], [0, -272], [26, -290], [40, -320], [42, -352], [30, -336], [14, -324], [-14, -324], [-30, -336]], 1.6), c.longBeard);
      for (let i = 0; i < 9; i++) s += ink(curve([[-26 + i * 6.5, -332], [-28 + i * 7, -306], [-22 + i * 5.5, -286]], 0.8), 1.3, { stroke: "#f4f1ea", op: 0.55 });
      s += sh(soft([[-20, -338], [0, -344], [20, -338], [12, -333], [0, -337], [-12, -333]], 0.8), c.mustache || c.longBeard);
      s += ink(curve([[-8, -330], [0, -327], [8, -330]], 0.3), 2.4, { stroke: "#6b3b33" });
    }
    if (c.earbuds) s += `<circle cx="-46" cy="-356" r="5" fill="#2a2a2c" stroke="${P.ink}" stroke-width="1.5"/><circle cx="46" cy="-356" r="5" fill="#2a2a2c" stroke="${P.ink}" stroke-width="1.5"/>`;
    if (c.beard) s += sh(soft([[-42, -352], [-30, -320], [0, -306], [30, -320], [42, -352], [30, -336], [12, -322], [-12, -322], [-30, -336]], 1.2), c.beard) + ink(curve([[-8, -330], [0, -327], [8, -330]], 0.3), 2.4, { stroke: "#6b3b33" });
    if (c.walrus) s += sh(soft([[-30, -332], [-14, -344], [0, -340], [14, -344], [30, -332], [24, -318], [10, -328], [0, -326], [-10, -328], [-24, -318]], 1), c.walrus);
    if (c.screwdriver) s += ink(line(48, -380, 62, -346, 0.3), 4, { stroke: P.red }) + ink(line(56, -362, 64, -340, 0.3), 2, { stroke: "#9aa0a6" });
    if (c.mustache) s += sh(soft([[-20, -336], [0, -342], [20, -336], [12, -332], [0, -336], [-12, -332]], 0.8), c.mustache);
    if (c.handlebar) {
      s += sh(soft([[-4, -340], [-26, -340], [-40, -350], [-38, -358], [-30, -346], [-14, -336], [0, -336]], 0.6), c.handlebar);
      s += sh(soft([[4, -340], [26, -340], [40, -350], [38, -358], [30, -346], [14, -336], [0, -336]], 0.6), c.handlebar);
    }
    s += hairFront(c);
    if (c.headband) s += sh(soft([[-48, -392], [-20, -402], [20, -402], [48, -392], [48, -382], [20, -392], [-20, -392], [-48, -382]], 0.8), c.headband);
    s += glasses(c);
    if (c.monocle) {
      const m = c.monocle;
      s += ink(curve([[-34, -358], [-44, -330], [-30, -300], [-12, -292]], 0.4), 1.6, { stroke: m.cord || "#1f1a18" });
      s += `<circle cx="-20" cy="-362" r="15" fill="#ffffff" fill-opacity=".22" stroke="${m.color || "#c9a24a"}" stroke-width="3.2"/>` + ink(line(-27, -369, -21, -373, 0.2), 2, { stroke: "#ffffff", op: 0.85 });
      if (m.veiled) s += `<circle cx="-16" cy="-362" r="4.6" fill="#c9cdd1" opacity=".75"/>`;
    }
    if (c.brushes) [[-18, -440, -2, -404], [8, -446, 6, -406], [30, -436, 14, -404]].forEach(([x1, y1, x2, y2], i) => {
      s += ink(line(x1, y1, x2, y2, 0.2), 4, { stroke: P.woodLight }) + `<circle cx="${x1}" cy="${y1}" r="4" fill="${[P.teal, P.rust, P.mustard][i]}" stroke="${P.ink}" stroke-width="1.2"/>`;
    });
    if (c.hat) {
      const h = c.hat;
      if (h.kind === "bowler") {
        s += sh(soft([[-44, -404], [-42, -440], [-22, -460], [22, -460], [42, -440], [44, -404]], 1), h.color);
        s += sh(soft([[-64, -402], [-50, -394], [50, -394], [64, -402], [50, -410], [-50, -410]], 0.8), h.color);
        s += sh(rect(-43, -418, 86, 9, 0.4), h.band || "#1f1a18", { sw: 1.4 });
      } else if (h.kind === "wide") {
        s += sh(soft([[-112, -404], [-60, -390], [60, -390], [112, -404], [70, -420], [-70, -420]], 1.4), h.color);
        s += sh(soft([[-46, -414], [-42, -452], [-14, -466], [18, -466], [44, -452], [46, -414]], 1), h.color);
        s += sh(rect(-46, -428, 92, 12, 0.5), h.band || P.plum, { sw: 1.4 });
        if (h.feather) s += sh(soft([[30, -430], [60, -490], [84, -500], [70, -470], [44, -428]], 1), h.feather) + ink(curve([[34, -430], [62, -478], [80, -496]], 0.3), 1.4, { op: 0.6 });
        if (h.flowers) [[-30, -432], [-14, -436], [-38, -420]].forEach(([x, y], i) => (s += `<circle cx="${x}" cy="${y}" r="8" fill="${h.flowers[i % h.flowers.length]}" stroke="${P.ink}" stroke-width="1.4"/>`));
      } else if (h.kind === "top") {
        s += sh(soft([[-40, -404], [-36, -486], [36, -486], [40, -404]], 0.8), h.color);
        s += sh(soft([[-62, -402], [-50, -394], [50, -394], [62, -402], [50, -410], [-50, -410]], 0.8), h.color);
        s += sh(rect(-39, -428, 78, 14, 0.4), h.band || "#1f1a18", { sw: 1.4 }) + ink(line(-28, -474, -26, -436, 0.2), 2, { stroke: "#ffffff", op: 0.25 });
      } else if (h.kind === "boater") {
        s += sh(soft([[-74, -404], [-60, -396], [60, -396], [74, -404], [60, -412], [-60, -412]], 0.8), h.color);
        s += sh(soft([[-42, -408], [-40, -436], [40, -436], [42, -408]], 0.6), h.color);
        s += sh(rect(-41, -426, 82, 12, 0.3), h.band || "#2f3a5a", { sw: 1.4 });
        for (let x = -36; x <= 36; x += 12) s += ink(line(x, -434, x + 3, -410, 0.2), 1, { op: 0.3 });
      } else if (h.kind === "tiara") {
        s += ink(curve([[-40, -404], [-20, -418], [0, -422], [20, -418], [40, -404]], 0.3), 3.4, { stroke: h.color || "#d9d9dc" });
        [[-24, -420, 6], [0, -432, 9], [24, -420, 6]].forEach(([x, y, r]) => (s += sh(poly([[x, y - r], [x + r * 0.7, y + 2], [x, y + r * 0.6], [x - r * 0.7, y + 2]], 0.2), h.stone || "#9ad0e8", { sw: 1.4 })));
      } else if (h.kind === "beret") {
        s += sh(blob(10, -420, 58, 20, 0.06, 12), h.color) + sh(blob(10, -440, 5, 5, 0.1, 6), h.color);
        if (h.flower) {
          for (let i = 0; i < 5; i++) {
            const a = (i * 72) * Math.PI / 180;
            s += `<circle cx="${f(-26 + Math.cos(a) * 8)}" cy="${f(-424 + Math.sin(a) * 8)}" r="6" fill="${h.flower}" stroke="${P.ink}" stroke-width="1.2"/>`;
          }
          s += `<circle cx="-26" cy="-424" r="4.5" fill="${h.heart || "#f2d36b"}" stroke="${P.ink}" stroke-width="1.2"/>`;
        }
      }
    }
    if (c.headset) {
      s += ink(curve([[-48, -366], [-34, -414], [0, -432], [34, -414], [48, -366]], 0.5), 5, { stroke: "#2c2c2c" });
      s += `<ellipse cx="-48" cy="-360" rx="10" ry="14" fill="#3a3330" stroke="${P.ink}" stroke-width="2"/>`;
      s += ink(curve([[-46, -348], [-40, -328], [-18, -322]], 0.3), 3, { stroke: "#2c2c2c" }) + `<ellipse cx="-14" cy="-322" rx="6" ry="4" fill="#2c2c2c"/>`;
    }
    if (c.cap) s += sh(soft([[-46, -386], [-40, -416], [0, -426], [40, -416], [46, -386]], 1.5), c.cap) + sh(soft([[-10, -390], [60, -392], [64, -382], [-6, -380]], 1.5), c.cap);
    if (c.charlotte) s += sh(soft([[-50, -384], [-44, -420], [0, -432], [44, -420], [50, -384], [30, -392], [0, -396], [-30, -392]], 2.5), "#f6f3ec", { op: 0.95 }) + sh(rect(-48, -392, 96, 8, 1), "none", { sw: 1.5, op: 0.6 });
    if (c.hand === "chin") s += sh(soft([[60, -230], [30, -300], [14, -312], [6, -300], [26, -232]], 1.5), c.sleeve || c.top) + sh(blob(10, -312, 13, 12, 0.08, 9), c.skin);
    return s;
  }

  function figure(o, x, y, h, flip) {
    return g(person(o), tr(x, y, h / 430, flip));
  }

  // ---------- Goats ----------
  // Local coordinates: hooves on y=0, facing right.

  function goat(o) {
    const c = Object.assign(
      { coat: P.white, shade: null, horns: true, beard: true, ears: "up", pose: "stand", rx: 74, ry: 34, leg: 62, hs: 1.15, seed: 5 },
      o
    );
    srand(c.seed);
    const shade = c.shade || "#000";
    const legCol = c.legs || c.coat;
    const by = c.pose === "lie" ? -36 : -(c.leg + c.ry - 8);
    let s = "";
    const leg = (x, far) => {
      if (c.pose === "lie") return "";
      const top = by + c.ry * 0.35;
      let r = sh(soft([[x - 10, top], [x + 10, top], [x + 7, top + (0 - top) * 0.55], [x + 5, -10], [x - 5, -10], [x - 6, top + (0 - top) * 0.55]], 1), legCol);
      r += sh(rect(x - 6, -12, 12, 12, 1), c.hoof || P.inkSoft, { sw: 2 });
      if (far) r += sh(soft([[x - 10, top], [x + 10, top], [x + 5, -10], [x - 5, -10]], 0.5), shade, { sw: 0, op: 0.22 });
      return r;
    };
    s += leg(-c.rx * 0.55, true) + leg(c.rx * 0.62, true);
    // Tail
    s += g(sh(soft([[-c.rx + 6, by - c.ry * 0.5], [-c.rx - 10, by - c.ry - 14], [-c.rx - 2, by - c.ry - 16], [-c.rx + 14, by - c.ry * 0.6]], 1), c.tail || c.coat), 'class="g-tail"');
    // Body
    s += sh(blob(0, by, c.rx, c.ry, 0.05, 12), c.coat);
    s += sh(soft([[-c.rx * 0.7, by + c.ry * 0.4], [c.rx * 0.6, by + c.ry * 0.5], [c.rx * 0.3, by + c.ry * 0.95], [-c.rx * 0.5, by + c.ry * 0.9]], 1), shade, { sw: 0, op: 0.12 });
    if (c.patch) s += sh(blob(-c.rx * 0.2, by - 6, c.rx * 0.35, c.ry * 0.55, 0.12, 9), c.patch, { sw: 0, op: 0.9 });
    if (c.knitCoat) {
      s += sh(soft([[-c.rx * 0.7, by - c.ry * 0.85], [c.rx * 0.55, by - c.ry * 0.95], [c.rx * 0.6, by + c.ry * 0.45], [-c.rx * 0.75, by + c.ry * 0.4]], 1.2), c.knitCoat);
      for (let i = -3; i <= 2; i++) s += ink(curve([[i * c.rx * 0.2, by - c.ry * 0.85], [i * c.rx * 0.2 + 3, by], [i * c.rx * 0.2, by + c.ry * 0.4]], 0.4), 1.4, { op: 0.35 });
    }
    if (c.sparkle) for (let i = 0; i < 14; i++) s += `<circle cx="${f(-c.rx * 0.6 + rnd() * c.rx * 1.1)}" cy="${f(by - c.ry * 0.8 + rnd() * c.ry * 1.1)}" r="2.6" fill="${c.sparkle}" opacity=".9"/>`;
    if (c.stripe) s += ink(curve([[-c.rx * 0.85, by - c.ry * 0.7], [0, by - c.ry - 2], [c.rx * 0.8, by - c.ry * 0.75]], 0.8), 7, { stroke: c.stripe });
    if (c.pose === "lie") {
      s += sh(blob(c.rx * 0.6, -10, 24, 9, 0.06, 8), legCol) + sh(blob(-c.rx * 0.4, -10, 26, 9, 0.06, 8), legCol);
    }
    s += leg(-c.rx * 0.38, false) + leg(c.rx * 0.8, false);
    // Neck
    const nx = c.rx * 0.72, ny = by - c.ry * 0.55;
    const graze = c.pose === "graze";
    const hx = graze ? c.rx + 22 : c.rx + 20;
    const hy = graze ? by + c.ry + 10 : by - c.ry - 40;
    s += sh(soft([[nx - 26, ny - 6], [nx + 6, ny - 22], [hx - 8, hy - 8], [hx + 6, hy + 10], [nx + 22, ny + 18]], 1.2), c.coat);
    if (c.collar) s += ink(line(nx - 4, ny - 18, nx + 16, ny + 4, 0.5), 7, { stroke: c.collar });
    if (c.neckerchief) s += sh(soft([[nx - 8, ny - 22], [nx + 22, ny + 2], [nx - 4, ny + 26]], 0.8), c.neckerchief, { sw: 2 }) + `<circle cx="${f(nx + 4)}" cy="${f(ny - 6)}" r="4" fill="${c.neckerchief}" stroke="${P.ink}" stroke-width="1.4"/>`;
    // The outer group places the head; the inner one is free for CSS animation,
    // which would otherwise replace the placement transform.
    s += g(g(head(c), 'class="g-head"'), `transform="translate(${f(hx)},${f(hy)}) scale(${c.hs}) rotate(${graze ? 50 : 0})"`);
    return s;
  }

  function head(c) {
    let s = "";
    const ears = c.ears === "droop"
      ? sh(soft([[-10, -8], [-34, 8], [-30, 18], [-6, 4]], 1), c.earCol || c.coat)
      : sh(soft([[-10, -10], [-36, -30], [-30, -20], [-14, -2]], 1), c.earCol || c.coat);
    s += g(ears, 'class="g-ear"');
    if (c.horns) s += ink(curve([[-4, -16], [-16, -34], [-34, -44]], 0.6), c.bigHorns ? 9 : 6, { stroke: "#8c7b62" }) + ink(curve([[-4, -16], [-16, -34], [-34, -44]], 0.6), 1.6, { op: 0.6 });
    s += sh(soft([[-18, -10], [0, -18], [16, -12], [30, 0], [32, 10], [24, 14], [6, 10], [-14, 8]], 0.8), c.face || c.coat);
    if (c.faceStripe) s += ink(curve([[-6, -12], [8, -6], [26, 4]], 0.5), 4, { stroke: c.faceStripe, op: 0.9 });
    s += sh(blob(2, -5, 5, 4, 0.05, 8), "#d8b04a", { sw: 1.8 }) + ink(line(-1, -5, 5, -5, 0.2), 2.2);
    s += `<circle cx="29" cy="4" r="2.2" fill="${P.ink}"/>`;
    s += ink(curve([[22, 11], [28, 12]], 0.3), 1.8);
    if (c.beard) s += sh(soft([[16, 10], [22, 30], [12, 14]], 0.8), c.beardCol || c.coat);
    if (c.deerstalker) {
      const d = c.deerstalker;
      s += sh(soft([[-16, -14], [-12, -30], [4, -36], [18, -28], [20, -14]], 0.6), d);
      s += sh(soft([[18, -16], [32, -14], [30, -10], [18, -12]], 0.4), d) + sh(soft([[-16, -16], [-28, -12], [-26, -8], [-14, -12]], 0.4), d);
      for (let x = -10; x <= 14; x += 6) s += ink(line(x, -32, x, -16, 0.2), 1, { stroke: "#5a4a34", op: 0.6 });
      s += ink(line(-14, -26, 18, -26, 0.2), 1, { stroke: "#5a4a34", op: 0.6 });
    }
    return s;
  }

  function goatAt(o, x, y, scale, flip, extra = "") {
    return g(goat(o), `${tr(x, y, scale, flip)} ${extra}`);
  }

  // ---------- Named goats ----------
  const GOATS = {
    blanchette: { coat: "#f5f1e8", horns: false, beard: true, ears: "up", seed: 21, collar: P.rust },
    biscotte: { coat: "#d6aa72", patch: "#f2e8d6", horns: false, beard: false, ears: "droop", rx: 50, ry: 24, leg: 54, hs: 1.25, seed: 31, face: "#e2bc8a" },
    gerbera: { coat: "#a8703f", stripe: "#2e241e", legs: "#3a2c24", face: "#a8703f", faceStripe: "#2e241e", horns: true, beard: true, seed: 41 },
    tournesol: { coat: "#3b302b", face: "#3b302b", faceStripe: "#efe7d6", legs: "#efe7d6", ears: "droop", horns: false, beard: true, seed: 51, earCol: "#3b302b" },
    gaston: { coat: "#8f8170", horns: true, bigHorns: true, beard: true, beardCol: "#5d5246", rx: 86, ry: 40, leg: 66, seed: 61 },
    duchesse: { coat: "#efe2c6", horns: true, beard: true, seed: 71 },
    herd: { coat: "#ddd2c0", horns: true, beard: true, seed: 81 },
  };
  const namedGoat = (name, x, y, scale, flip, overrides = {}, extra = "") =>
    goatAt(Object.assign({}, GOATS[name], overrides), x, y, scale, flip, extra);

  // ---------- Cats ----------
  // Local coordinates: lying on y=0, facing right.

  function cat(o) {
    const c = Object.assign({ coat: "#d98a3a", white: "#f6f1e6", stripes: "#b5662a", seed: 91 }, o);
    srand(c.seed);
    let s = "";
    // Tail curled around the front.
    s += ink(curve([[-46, -18], [-60, -2], [-30, 6], [20, 4], [44, -2]], 0.6), 14, { stroke: P.ink }) + ink(curve([[-46, -18], [-60, -2], [-30, 6], [20, 4], [44, -2]], 0.6), 10, { stroke: c.coat });
    s += sh(blob(-4, -26, 50, 26, 0.05, 12), c.coat);
    for (let i = 0; i < 4; i++) s += ink(curve([[-36 + i * 16, -48], [-30 + i * 16, -34], [-34 + i * 16, -22]], 0.5), 4, { stroke: c.stripes, op: 0.8 });
    s += sh(blob(30, -12, 18, 9, 0.08, 8), c.white);
    // Head resting on the paws.
    s += sh(soft([[30, -40], [34, -66], [44, -50]], 0.6), c.coat) + sh(soft([[52, -50], [62, -68], [64, -44]], 0.6), c.coat);
    s += sh(blob(48, -32, 21, 18, 0.06, 10), c.coat);
    s += sh(blob(54, -24, 12, 9, 0.08, 8), c.white, { sw: 0 });
    s += ink(curve([[38, -36], [42, -33], [46, -36]], 0.2), 2) + ink(curve([[52, -36], [56, -33], [60, -36]], 0.2), 2);
    s += `<circle cx="54" cy="-27" r="2.4" fill="#d98f8a"/>`;
    return s;
  }

  const CATS = {
    tobiasse: { coat: "#d98a3a", white: "#f6f1e6", stripes: "#b5662a", seed: 93 },
  };
  const namedCat = (name, x, y, scale, flip, overrides = {}) => g(cat(Object.assign({}, CATS[name], overrides)), tr(x, y, scale, flip));

  // ---------- Characters ----------
  const PEOPLE = {
    veronique: { skin: "#ecbfa6", hair: "#5a3b2a", hairStyle: "bob", top: "#7f7c79", pants: "#232121", sandals: true, cuffs: true, vneck: true, pocket: true, necklace: true, watch: "#d9a5a0", mole: true, poseL: "pocket", poseR: "pocket", glasses: { color: "#22403c", thick: true }, seed: 101 },
    mireille: { skin: "#eabba0", hair: "#b9b4ab", hairStyle: "bun", top: "#e8dcc4", cardigan: "#c9a03f", skirt: "#6d5a4a", legs: "#c9b9a6", boots: null, apron: "#efe1c0", shoes: "#4a3a30", seed: 111 },
    thibault: { skin: "#e3b493", hair: "#4a3326", hairStyle: "swept", top: "#e7e2d8", gilet: "#2f3f5a", pants: "#5e6a7a", shoes: "#a8784a", beard: "#4a3326", poseR: "up", phone: true, seed: 121 },
    julien: { skin: "#e3b096", hair: "#3a2a22", hairStyle: "fade", top: "#2e3a5c", sunPrint: true, pants: "#3a3f48", shoes: "#d9d4c8", longBeard: "#b4b0aa", mustache: "#6e665e", earbuds: true, glasses: { color: "#1f2328" }, seed: 131 },
    capucine: { skin: "#f0c7aa", hair: "#b35a2e", hairStyle: "braid", top: "#f3efe6", pants: "#5b6470", apron: "#f6f3ec", shoes: "#3a6d6a", charlotte: true, seed: 141 },
    veto: { skin: "#dcae8e", hair: "#9a958c", hairStyle: "short", top: "#59603f", coatLong: true, pants: "#3a3a36", shoes: "#4a3a30", stetho: true, glasses: { color: "#5a5a5a", scratched: true }, seed: 151 },
    gerard: { skin: "#d9a184", hair: "#6c6258", hairStyle: "short", top: "#8a3d36", pants: "#4a4f44", shoes: "#3a2f28", cap: "#5b5a48", mustache: "#6c6258", glasses: { color: "#7d7d78", crooked: true, tape: true }, seed: 161 },
    benjamin: { skin: "#f2c6ad", hair: "#8a5a38", hairStyle: "tuft", top: "#23211f", logo: true, pants: "#4b5a6e", shoes: "#e8e2d6", freckles: true, blush: "#e78f80", seed: 181 },
    momo: { skin: "#d6a284", hair: "#5a4a3f", hairStyle: "bald", top: "#e9e3d6", apron: "#3b3330", pants: "#3b3330", mustache: "#4a3b32", towel: true, seed: 171 },
  };

  function character(id, x, y, h, flip, over = {}) {
    return figure(Object.assign({}, PEOPLE[id], over), x, y, h, flip);
  }

  const portraitCache = {};
  function portrait(id, expr) {
    const key = id + ":" + (expr || "");
    if (portraitCache[key]) return portraitCache[key];
    const over = { expr: expr || PEOPLE[id].expr || (id === "veronique" ? "smile" : "neutral") };
    if (id === "veronique" && expr === "focus") over.hand = "chin";
    if (id === "thibault") over.poseR = "down";
    const body = person(Object.assign({}, PEOPLE[id], over));
    const svg = `<svg viewBox="${CH.config.portrait.viewBox}" xmlns="http://www.w3.org/2000/svg"><g filter="url(#f-rough-s)">${body}</g></svg>`;
    portraitCache[key] = svg;
    return svg;
  }

  function goatPortrait(name) {
    const key = "goat:" + name;
    if (portraitCache[key]) return portraitCache[key];
    const svg = `<svg viewBox="-60 -190 230 200" xmlns="http://www.w3.org/2000/svg"><g filter="url(#f-rough-s)">${goat(GOATS[name])}</g></svg>`;
    portraitCache[key] = svg;
    return svg;
  }

  // ---------- Scene helpers ----------
  function leaves(n, x0, x1, y0, cls = "leaf") {
    let s = "";
    for (let i = 0; i < n; i++) {
      const x = x0 + rnd() * (x1 - x0);
      const y = y0 + rnd() * 60;
      const col = [P.leafRed, P.leafGold, P.ochre, P.rust][i % 4];
      const delay = (rnd() * 9).toFixed(2);
      const dur = (8 + rnd() * 6).toFixed(2);
      s += `<g class="${cls}" style="animation-delay:-${delay}s;animation-duration:${dur}s"><path d="${soft([[x, y], [x + 9, y - 6], [x + 16, y], [x + 8, y + 6]], 0.6)}" fill="${col}" stroke="${P.ink}" stroke-width="1.4"/></g>`;
    }
    return s;
  }

  function mist(y, h, op = 0.8) {
    return `<g class="mist" opacity="${op}"><rect x="-200" y="${y}" width="2000" height="${h}" fill="url(#g-mist)" filter="url(#f-blur-s)"/></g>`;
  }

  function dust(n, x0, x1, y0, y1) {
    let s = "";
    for (let i = 0; i < n; i++) {
      const x = x0 + rnd() * (x1 - x0), y = y0 + rnd() * (y1 - y0);
      s += `<circle class="dust" cx="${f(x)}" cy="${f(y)}" r="${f(1.2 + rnd() * 1.6)}" fill="#fff6dd" style="animation-delay:-${(rnd() * 6).toFixed(2)}s"/>`;
    }
    return s;
  }

  function steam(x, y, n = 3) {
    let s = "";
    for (let i = 0; i < n; i++) {
      s += `<path class="steam" style="animation-delay:-${i * 1.1}s" d="${curve([[x + i * 12, y], [x + i * 12 - 8, y - 30], [x + i * 12 + 6, y - 60], [x + i * 12 - 4, y - 90]], 2)}" stroke="#ffffff" stroke-width="5" fill="none" opacity=".55" stroke-linecap="round"/>`;
    }
    return s;
  }

  function hills(y, col, amp, seedVal) {
    srand(seedVal);
    const pts = [[-40, 900]];
    for (let x = -40; x <= 1640; x += 160) pts.push([x, y + jit(amp)]);
    pts.push([1640, 900]);
    return sh(soft(pts, 4), col, { sw: 2.5 });
  }

  CH.art = {
    P, srand, rnd, jit, smooth, blob, poly, rect, soft, curve, line, sh, ink, g, tr, text,
    defs, person, figure, character, portrait, goat, goatAt, namedGoat, goatPortrait, cat, namedCat, CATS,
    leaves, mist, dust, steam, hills, PEOPLE, GOATS,
  };
})();

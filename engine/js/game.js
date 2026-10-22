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

// Game state, script runner and rules (deductions, grid, hypotheses, boards, hints).
// Story-specific data (cutscenes, boards, act rules) lives in CH.story.
(function () {
  const C = CH.config;
  const SAVE_VERSION = 1;
  const ST = () => CH.story;

  let s = null;
  let busy = false;
  // Incremented on every (re)start: scripts from a previous game stop running.
  let epoch = 0;

  function fresh() {
    return {
      v: SAVE_VERSION, act: C.acts.opening, scene: ST().FIRST_SCENE,
      flags: {}, clues: {}, clueOrder: [], deds: {}, dedOrder: [], items: {}, eggs: {}, marks: {}, crossed: {},
      fresh: {}, seen: {}, hintLevels: {}, biscuits: 0, tries: {}, hyps: 0, playMs: 0, genericIdx: 0,
    };
  }

  function save() {
    try {
      localStorage.setItem(C.saveKey, JSON.stringify(s));
    } catch (e) {
      /* Storage unavailable: the game still runs, only without resume. */
    }
  }

  function loadSaved() {
    try {
      const raw = localStorage.getItem(C.saveKey);
      if (!raw) return null;
      const data = JSON.parse(raw);
      return data && data.v === SAVE_VERSION ? data : null;
    } catch (e) {
      return null;
    }
  }

  // ---------------------------------------------------------------- Mutations
  function addClue(id) {
    if (s.clues[id]) return;
    s.clues[id] = true;
    s.clueOrder.push(id);
    s.fresh[id] = true;
    CH.ui.toast(CH.t("ui.new_clue", { title: CH.t(`clue.${id}.title`) }));
    announceCrossed();
    // A story may derive further cards from this one (fragments that make a whole).
    if (ST().onClue) ST().onClue(s, id).forEach(addClue);
  }

  function addDed(id) {
    if (s.deds[id]) return false;
    s.deds[id] = true;
    s.dedOrder.push(id);
    s.fresh["d:" + id] = true;
    CH.ui.toast(CH.t("ui.new_ded", { title: CH.t(`ded.${id}.title`) }), "ded");
    announceCrossed();
    return true;
  }

  // Toasts every grid card crossed out since the last check.
  function announceCrossed() {
    const ex = CH.cluedo.excluded(s);
    Object.keys(ex).forEach((card) => {
      if (s.crossed[card]) return;
      s.crossed[card] = true;
      const [kind, id] = card.split(".");
      CH.ui.toast(CH.t("ui.grid_crossed", { name: CH.cluedo.name(kind, id) }), "muted");
    });
  }

  function addItem(id) {
    if (s.items[id]) return;
    s.items[id] = true;
    CH.ui.toast(CH.t("ui.new_item", { name: CH.t(`item.${id}.name`) }));
  }

  function useItem(id) {
    if (!s.items[id]) return;
    delete s.items[id];
    CH.ui.toast(CH.t("ui.lost_item", { name: CH.t(`item.${id}.name`) }), "muted");
  }

  function setFlag(id) {
    if (s.flags[id]) return;
    const before = openScenes();
    s.flags[id] = true;
    announcePlaces(before);
  }

  function announcePlaces(before) {
    openScenes()
      .filter((id) => !before.includes(id))
      .forEach((id) => CH.ui.toast(CH.t("ui.new_place", { name: CH.t(`scene.${id}.name`) })));
  }

  function openScenes() {
    return CH.scenes.order.filter((id) => CH.scenes.get(id).unlock(s));
  }

  function setAct(n) {
    if (s.act === n) return;
    const before = openScenes();
    s.act = n;
    CH.ui.actCard(n);
    CH.ui.refresh();
    // The first places need no announcement: the act card already opens them.
    if (before.length) announcePlaces(before);
  }

  function goScene(id) {
    s.scene = id;
    CH.ui.setBackdrop(null);
  }

  // ---------------------------------------------------------------- Runner
  async function run(steps) {
    if (!steps) return;
    if (typeof steps === "function") steps = steps(s);
    const started = epoch;
    for (const st of steps) {
      if (started !== epoch) return;
      await exec(st);
    }
  }

  async function exec(st) {
    if (Array.isArray(st)) return run(st);
    if (st.l) for (const [who, text] of CH.i18n.lines(st.l)) await CH.ui.say(who, text);
    if (st.clue) addClue(st.clue);
    if (st.ded) addDed(st.ded);
    if (st.item) addItem(st.item);
    if (st.use) useItem(st.use);
    if (st.flag) setFlag(st.flag);
    if (st.egg) s.eggs[st.egg] = true;
    if (st.act !== undefined) setAct(st.act);
    if (st.go) {
      goScene(st.go);
      CH.ui.renderScene();
    }
    if (st.cut) await run(ST().CUTS[st.cut]);
    if (st.if) await run(st.if(s) ? st.then : st.else);
    if (st.fn) await st.fn(s);
    if (st.bg !== undefined) CH.ui.setBackdrop(st.bg);
    if (st.screen) await CH.ui.screen(st.screen);
    save();
  }

  // Wraps any player action: blocks input, runs, checks progression, refreshes.
  async function action(fn) {
    if (busy) return;
    busy = true;
    const started = epoch;
    CH.ui.setBusy(true);
    try {
      await fn();
      if (started === epoch) await progress();
    } finally {
      if (started !== epoch) return;
      busy = false;
      CH.ui.setBusy(false);
      CH.ui.closeDialog();
      save();
      CH.ui.refresh();
    }
  }

  // Story rules fire once when their condition holds; boards announce when ready.
  async function progress() {
    for (const rule of ST().RULES) {
      if (s.flags[rule.id] || !rule.when(s)) continue;
      s.flags[rule.id] = true;
      await run(rule.steps);
      CH.ui.renderScene();
    }
    Object.keys(ST().BOARDS).forEach((b) => {
      const key = "ready_" + b;
      if (boardReady(b) && !s.flags[key]) {
        s.flags[key] = true;
        CH.ui.toast(CH.t("ui.board_ready", { name: CH.t("ui.board_btn_" + b) }), "ded");
      }
    });
  }

  // ---------------------------------------------------------------- Interactions
  // Returns the line key that replaces a professional look, or null when allowed.
  function proBlocked() {
    return ST().proBlocked ? ST().proBlocked(s) : null;
  }

  function onHotspot(hs, mode) {
    return action(async () => {
      if (mode === "pro") {
        if (proBlocked()) return run([{ l: proBlocked() }]);
        s.seen["pro:" + s.scene + ":" + hs.id] = true;
        return run(hs.pro.steps);
      }
      s.seen["hs:" + s.scene + ":" + hs.id] = true;
      return run(typeof hs.look === "function" ? hs.look(s) : hs.look);
    });
  }

  function talk(id) {
    return action(async () => {
      const ch = CH.chars.get(id);
      for (;;) {
        const topics = ch.topics.filter((t) => !t.when || t.when(s));
        const opts = topics.map((t) => ({ id: t.id, label: CH.t(`chr.${id}.t.${t.id}`), seen: !!s.seen[`t:${id}:${t.id}`] }));
        opts.push({ id: "__show", label: CH.t("ui.talk_show"), kind: "show" });
        if (s.act >= ST().HYPOTHESIS_ACT && !ch.noHyp) opts.push({ id: "__hyp", label: CH.t("ui.talk_hyp"), kind: "hyp" });
        if (ch.pro) opts.push({ id: "__pro", label: CH.t("ui.pro"), kind: "pro" });
        opts.push({ id: "__bye", label: CH.t("ui.talk_bye"), kind: "bye" });
        const choice = await CH.ui.menu(id, opts);
        if (!choice || choice === "__bye") break;
        if (choice === "__show") {
          const card = await CH.ui.openNotebook({ pick: true });
          if (!card) continue;
          let steps = ch.show[card];
          if (typeof steps === "function") steps = steps(s);
          await run(steps || [{ l: `dlg.${id}.show_default` }]);
        } else if (choice === "__hyp") {
          const hyp = await CH.ui.openHypothesis(id);
          if (hyp) await hypothesis(id, hyp);
        } else if (choice === "__pro") {
          if (proBlocked()) {
            await run([{ l: proBlocked() }]);
          } else {
            s.seen["pro:char:" + id] = true;
            await run(ch.pro);
          }
        } else {
          s.seen[`t:${id}:${choice}`] = true;
          await run(topics.find((t) => t.id === choice).steps);
        }
        save();
        CH.ui.refresh();
      }
    });
  }

  function charPro(id) {
    return action(async () => {
      if (proBlocked()) return run([{ l: proBlocked() }]);
      s.seen["pro:char:" + id] = true;
      return run(CH.chars.get(id).pro);
    });
  }

  function combine(a, b) {
    return action(async () => {
      s.seen["help:combine"] = true;
      const d = CH.deductions.match(a, b);
      if (d) {
        if (s.deds[d.id]) return run([{ l: "combo.already" }]);
        if (d.requires && !d.requires.every((r) => s.deds[r] || s.clues[r] || s.flags[r])) return run([{ l: d.failKey || "combo.not_yet" }]);
        addDed(d.id);
        CH.ui.refreshNotebook();
        await CH.ui.say("v.focus", CH.t(`ded.${d.id}.text`));
        if (d.cut) await run(ST().CUTS[d.cut]);
        return;
      }
      const specific = CH.deductions.specificKey(a, b);
      const key = specific || `combo.generic.${s.genericIdx++ % CH.deductions.GENERIC_COUNT}`;
      return run([{ l: key }]);
    });
  }

  // Hypothesis put to a witness: they refute one card if they can and hand over its clue.
  async function hypothesis(witness, hyp) {
    s.hyps++;
    const names = { who: CH.cluedo.inline("who", hyp.who), weapon: CH.cluedo.inline("weapon", hyp.weapon), room: CH.cluedo.inline("room", hyp.room) };
    await CH.ui.say("v", CH.t("hyp.ask", names));
    const r = CH.cluedo.refute(s, witness, hyp);
    if (!r && hyp.who === witness) return run([{ l: `hyp.${witness}.self` }]);
    if (!r) {
      const own = `hyp.${witness}.none`;
      if (CH.i18n.has(own)) return run([{ l: own }]);
      return CH.ui.say(witness, CH.t("hyp.none"));
    }
    return run([{ l: `hyp.${witness}.${r.card.replace(".", "_")}` }, { clue: r.clue }]);
  }

  function boardReady(id) {
    const def = ST().BOARDS[id];
    return !!def && !s.flags[def.done] && def.ready(s);
  }

  // answers: { q1: index|null, ... }. Returns "incomplete" | "near" | "far" | "ok".
  async function submitBoard(id, answers) {
    const def = ST().BOARDS[id];
    const keys = Object.keys(def.answers);
    if (keys.some((k) => answers[k] === null || answers[k] === undefined)) return "incomplete";
    s.tries[id] = (s.tries[id] || 0) + 1;
    const wrong = keys.filter((k) => answers[k] !== def.answers[k]).length;
    save();
    if (wrong === 0) {
      CH.ui.closeBoard();
      await action(async () => {
        setFlag(def.done);
        await run(ST().CUTS[def.cut]);
      });
      return "ok";
    }
    if (def.suspect && answers[def.suspect] !== def.answers[def.suspect]) {
      const key = `board.${id}.wrong.${answers[def.suspect]}`;
      if (CH.i18n.has(key)) await action(() => run([{ l: key }]));
    }
    return wrong <= C.board.nearMissMax ? "near" : "far";
  }

  // Manual grid marks cycle: none -> crossed -> doubtful -> none.
  function setMark(card) {
    const next = { x: "q", q: null }[s.marks[card]];
    if (s.marks[card] === undefined) s.marks[card] = "x";
    else if (next) s.marks[card] = next;
    else delete s.marks[card];
    save();
  }

  // ---------------------------------------------------------------- Biscotte
  function sceneName(id) {
    return CH.t(`scene.${id}.name`);
  }

  function hintText(target, level) {
    switch (target.kind) {
      case "hs": {
        const p = { place: sceneName(target.scene), thing: CH.t(`hs.${target.scene}.${target.id}.label`) };
        if (level === 2) return CH.t("hint.find.2", p);
        return CH.t(target.pro ? "hint.pro.3" : "hint.find.3", p);
      }
      case "char": {
        const pres = CH.chars.get(target.id).presence(s);
        return CH.t(`hint.char.${level}`, { name: CH.t(`chr.${target.id}.name`), place: pres ? sceneName(pres.scene) : "" });
      }
      case "ded": {
        if (!s.clues[target.a] || !s.clues[target.b]) return CH.t("hint.missing");
        return CH.t(`hint.ded.${level}`, { a: CH.t(`clue.${target.a}.title`), b: CH.t(`clue.${target.b}.title`) });
      }
      case "board":
        return CH.t(`hint.board.${level}`);
      default:
        return CH.t(`hint.biscotte.${level}`);
    }
  }

  function biscotte() {
    return action(async () => {
      const extra = ST().biscotteOptions(s);
      const opts = extra.map((o) => ({ id: o.id, label: CH.t(o.label) }));
      opts.push({ id: "hint", label: CH.t("ui.bis_hint"), kind: "hint" });
      opts.push({ id: "pet", label: CH.t("ui.bis_pet") });
      opts.push({ id: "close", label: CH.t("ui.bis_close"), kind: "bye" });
      const choice = await CH.ui.menu("biscotte", opts, CH.t("ui.bis_count", { n: s.biscuits }));
      const picked = extra.find((o) => o.id === choice);
      if (picked) await run(picked.steps);
      else if (choice === "pet") await run([{ l: `bis.pet.${Math.floor(Math.random() * ST().PET_LINES)}` }]);
      else if (choice === "hint") await giveHint();
    });
  }

  async function giveHint() {
    const goal = CH.goals.current(s);
    if (!goal) return run([{ l: "hint.none" }]);
    const level = s.hintLevels[goal.id] || 0;
    const target = goal.target(s);
    if (level >= C.hint.maxLevel) {
      CH.ui.highlight(target);
      return run([{ l: "hint.maxed" }]);
    }
    const next = level + 1;
    s.hintLevels[goal.id] = next;
    s.biscuits += C.hint.cost;
    await run([{ l: "bis.eat" }]);
    if (next === 1) {
      await run([{ l: `hint.${goal.id}` }]);
    } else {
      await CH.ui.say("b", hintText(target, next));
      CH.ui.highlight(target);
    }
  }

  // ---------------------------------------------------------------- Lifecycle
  function start(resume) {
    epoch++;
    busy = false;
    const saved = resume ? loadSaved() : null;
    const opening = ST().CUTS.opening;
    // A save taken during an opening cutscene starts it over; a finished one starts a new game.
    const usable = saved && !saved.flags.finished && !(opening && saved.act === C.acts.opening);
    // Saves from older engine versions get any newer fields with their defaults.
    s = usable ? Object.assign(fresh(), saved) : fresh();
    if (s.act === C.acts.ending && !s.flags.finished) {
      // A save made mid-ending resumes just before the final board.
      s.act = C.acts.crossCheck;
      delete s.flags[ST().FINAL_BOARD_FLAG];
    }
    save();
    CH.ui.enterGame();
    if (opening && s.act === C.acts.opening) action(() => run(opening));
  }

  function tick(ms) {
    if (s && !s.flags.finished) s.playMs += ms;
  }

  CH.game = {
    get state() {
      return s;
    },
    get busy() {
      return busy;
    },
    get EGGS() {
      return ST().EGGS;
    },
    // A finished investigation is not offered for resuming: the title starts a new one.
    hasSave: () => {
      const saved = loadSaved();
      return !!saved && !saved.flags.finished;
    },
    start,
    save,
    tick,
    run: (steps) => action(() => run(steps)),
    onHotspot,
    talk,
    charPro,
    combine,
    biscotte,
    boardReady,
    submitBoard,
    setMark,
  };
})();

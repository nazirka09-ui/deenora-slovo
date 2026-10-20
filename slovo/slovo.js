(() => {
  const BASE = "/deenora-slovo/";
  const SOUND_KEY = "deenora-slovo-sound";
  const NATURE = [
    ["rain", "Дождь по крыше", "rain.m4a", 0.62],
    ["stream", "Ручей", "stream.m4a", 0.78],
    ["birds", "Пение птиц", "birds.m4a", 0.9],
    ["storm", "Гроза", "storm.m4a", 0.74],
    ["waves", "Волны", "waves.m4a", 0.78],
    ["fire", "Костёр", "fire.m4a", 0.84],
    ["crickets", "Сверчки", "crickets.m4a", 0.86],
  ];
  const FOCUS = [
    ["brown", "Коричневый шум"],
    ["pink", "Розовый шум"],
    ["gamma40", "40 Гц, гамма"],
    ["beta18", "18 Гц, концентрация"],
    ["alpha10", "10 Гц, спокойное чтение"],
  ];

  const css = `
    .slovo-open{position:fixed;z-index:40;top:max(10px,env(safe-area-inset-top));right:14px;height:36px;padding:0 12px;border-radius:999px;border:1px solid rgba(212,180,131,.45);background:rgba(8,22,17,.62);color:#f6f1e7;font:600 13px/1 Inter,system-ui,sans-serif;letter-spacing:.01em;backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px)}
    .slovo-open:active{transform:scale(.98)}
    .slovo-root{position:fixed;inset:0;z-index:80;display:flex;flex-direction:column;background:#10281f;color:#f6f1e7;font-family:Inter,system-ui,sans-serif}
    .slovo-root.bare .slovo-bar,.slovo-root.bare .slovo-foot{display:none}
    .slovo-bar{display:flex;align-items:center;gap:8px;padding:max(10px,env(safe-area-inset-top)) 12px 8px}
    .slovo-icon{width:40px;height:40px;border:0;border-radius:999px;background:rgba(255,255,255,.06);color:#f6f1e7;font:600 16px/1 inherit}
    .slovo-icon.on{color:#e7c98a}
    .slovo-title{flex:1;min-width:0;text-align:center;font-size:14px;color:#d9e2dc;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    .slovo-stage{position:relative;flex:1;min-height:0;overflow:hidden}
    .slovo-float{display:none;position:absolute;z-index:3;top:max(10px,env(safe-area-inset-top));width:44px;height:44px;border:0;border-radius:999px;background:rgba(8,22,17,.55);color:#f6f1e7;font:600 18px/1 inherit;align-items:center;justify-content:center}
    .slovo-root.bare .slovo-float{display:inline-flex}
    .slovo-float.left{left:12px}
    .slovo-float.right{right:12px}
    .slovo-float.on{color:#e7c98a}
    .slovo-line{position:absolute;left:50%;width:1px;background:#e7c98a;transform:translateX(-50%);opacity:.85}
    .slovo-word{position:absolute;top:50%;left:0;white-space:nowrap;font-family:Georgia,"Iowan Old Style",Palatino,serif;font-weight:500;visibility:hidden}
    .slovo-word.ready{visibility:visible}
    .slovo-focus{color:#e7c98a}
    .slovo-foot{padding:8px 18px max(16px,env(safe-area-inset-bottom))}
    .slovo-meta{text-align:center;color:#b7c4bb;font-size:13px;font-variant-numeric:tabular-nums}
    .slovo-row{display:flex;align-items:center;justify-content:center;gap:14px;margin-top:10px}
    .slovo-play{width:64px;height:64px;border:0;border-radius:999px;background:#f6f1e7;color:#10281f;font-size:22px}
    .slovo-round{height:44px;padding:0 12px;border:0;border-radius:999px;background:rgba(255,255,255,.07);color:#f6f1e7;font:600 13px/1 inherit}
    .slovo-speed{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-top:12px;color:#b7c4bb;font-size:13px}
    .slovo-speed input{flex:1;accent-color:#e7c98a}
    .slovo-done{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;text-align:center;padding:24px}
    .slovo-done h2{margin:0;font-family:Georgia,serif;font-weight:500;font-size:28px}
    .slovo-done p{margin:0;color:#b7c4bb}
    .slovo-sheet{position:absolute;inset:0;z-index:2;display:flex;align-items:flex-end;background:rgba(0,0,0,.45)}
    .slovo-panel{width:100%;max-height:86dvh;overflow:auto;border-radius:24px 24px 0 0;background:#163128;padding:16px 16px max(18px,env(safe-area-inset-bottom))}
    .slovo-panel h2{margin:0;text-align:center;font-size:17px}
    .slovo-panel header{display:grid;grid-template-columns:1fr auto 1fr;align-items:center;margin-bottom:8px}
    .slovo-panel header button{justify-self:end;border:0;background:none;color:#e7c98a;font:600 15px/1 inherit}
    .slovo-group{margin:14px 0 6px;color:#b7c4bb;font-size:11px;letter-spacing:.08em;text-transform:uppercase}
    .slovo-choice{width:100%;display:flex;align-items:center;justify-content:space-between;gap:12px;border:0;border-radius:14px;background:transparent;color:#f6f1e7;text-align:left;padding:12px;font:500 16px/1.2 inherit}
    .slovo-choice.on{background:rgba(255,255,255,.06)}
    .slovo-choice span{color:#e7c98a}
    .slovo-vol{display:flex;align-items:center;gap:10px;color:#b7c4bb;font-size:13px;margin-top:8px}
    .slovo-vol input{flex:1;accent-color:#e7c98a}
  `;

  const style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);

  function routeParts() {
    const path = location.pathname.replace(/\/+$/, "");
    const bits = path.split("/").filter(Boolean);
    if (bits[0] === "deenora-slovo") bits.shift();
    return bits;
  }

  function isReadingScreen() {
    const bits = routeParts();
    if (bits[0] === "sira" && bits.length === 2) return true;
    if (bits[0] === "library" && bits.length === 2) return true;
    if (bits[0] === "hadith" && bits.length === 3) return true;
    return false;
  }

  function pageTitle() {
    const heading = document.querySelector("#root h1");
    const text = heading ? heading.innerText.trim() : "";
    return text || "Чтение";
  }

  function pageWords() {
    const root = document.getElementById("root");
    if (!root) return [];
    const drop = /^(предыдущее|следующее)\b|^отметить прочитанной$|^глава прочитана$/i;
    const lines = root.innerText
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line && !drop.test(line) && !/^[\uE000-\uF8FF\s]+$/.test(line));
    const words = lines.join(" ").split(/\s+/).filter(Boolean);
    return words;
  }

  function focusAt(word) {
    const chars = Array.from(word);
    const n = chars.length;
    if (n <= 1) return 0;
    if (n <= 5) return 1;
    if (n <= 9) return 2;
    if (n <= 13) return 3;
    return Math.min(n - 2, Math.ceil((n - 1) / 2));
  }

  function loadSound() {
    try {
      const raw = JSON.parse(localStorage.getItem(SOUND_KEY) || "{}");
      return { id: raw.id || null, volume: Number.isFinite(raw.volume) ? raw.volume : 0.4 };
    } catch {
      return { id: null, volume: 0.4 };
    }
  }

  function saveSound(id, volume) {
    localStorage.setItem(SOUND_KEY, JSON.stringify({ id, volume }));
  }

  class Bed {
    constructor() {
      this.ctx = null;
      this.master = null;
      this.layers = [];
      this.clips = new Map();
      this.token = 0;
      this.volume = 0.4;
    }
    ensure() {
      if (this.ctx) return;
      const ctx = new AudioContext();
      const master = ctx.createGain();
      master.gain.value = this.gain();
      master.connect(ctx.destination);
      this.ctx = ctx;
      this.master = master;
    }
    gain() {
      return Math.pow(this.volume, 1.4) * 0.8;
    }
    setVolume(volume) {
      this.volume = volume;
      if (!this.master || !this.ctx) return;
      this.master.gain.setTargetAtTime(this.gain(), this.ctx.currentTime, 0.05);
    }
    stop() {
      this.token += 1;
      for (const layer of this.layers) layer();
      this.layers = [];
    }
    async play(id) {
      this.ensure();
      if (this.ctx.state === "suspended") await this.ctx.resume();
      this.stop();
      const token = this.token;
      if (!id) return;
      const nature = NATURE.find((item) => item[0] === id);
      if (nature) {
        const buffer = await this.load(nature[2]);
        if (token !== this.token) return;
        const source = this.ctx.createBufferSource();
        source.buffer = buffer;
        source.loop = true;
        const gain = this.ctx.createGain();
        gain.gain.value = nature[3];
        source.connect(gain).connect(this.master);
        source.start();
        this.layers.push(() => source.stop());
        return;
      }
      if (id === "brown" || id === "pink") this.noise(id);
      if (id === "gamma40") this.binaural(180, 40);
      if (id === "beta18") this.binaural(200, 18);
      if (id === "alpha10") this.binaural(196, 10);
    }
    async load(file) {
      const cached = this.clips.get(file);
      if (cached) return cached;
      const response = await fetch(BASE + "slovo/sounds/" + file);
      const audio = await this.ctx.decodeAudioData(await response.arrayBuffer());
      this.clips.set(file, audio);
      return audio;
    }
    noise(kind) {
      const ctx = this.ctx;
      const length = ctx.sampleRate * 2;
      const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let brown = 0;
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < length; i += 1) {
        const white = Math.random() * 2 - 1;
        if (kind === "brown") {
          brown = (brown + 0.02 * white) / 1.02;
          data[i] = brown * 3.2;
        } else {
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.969 * b2 + white * 0.153852;
          b3 = 0.8665 * b3 + white * 0.3104856;
          b4 = 0.55 * b4 + white * 0.5329522;
          b5 = -0.7616 * b5 - white * 0.016898;
          data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.12;
          b6 = white * 0.115926;
        }
      }
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;
      const gain = ctx.createGain();
      gain.gain.value = kind === "brown" ? 0.5 : 0.28;
      source.connect(gain).connect(this.master);
      source.start();
      this.layers.push(() => source.stop());
    }
    binaural(carrier, beat) {
      const ctx = this.ctx;
      const left = ctx.createOscillator();
      const right = ctx.createOscillator();
      left.frequency.value = carrier;
      right.frequency.value = carrier + beat;
      const merge = ctx.createChannelMerger(2);
      const leftGain = ctx.createGain();
      const rightGain = ctx.createGain();
      leftGain.gain.value = 0.12;
      rightGain.gain.value = 0.12;
      left.connect(leftGain).connect(merge, 0, 0);
      right.connect(rightGain).connect(merge, 0, 1);
      const tone = ctx.createGain();
      tone.gain.value = 0;
      merge.connect(tone).connect(this.master);
      const pulse = ctx.createOscillator();
      pulse.frequency.value = beat;
      const depth = ctx.createGain();
      depth.gain.value = 0.15;
      const offset = ctx.createConstantSource();
      offset.offset.value = 0.7;
      pulse.connect(depth).connect(tone.gain);
      offset.connect(tone.gain);
      left.start();
      right.start();
      pulse.start();
      offset.start();
      this.layers.push(() => {
        left.stop();
        right.stop();
        pulse.stop();
        offset.stop();
      });
    }
  }

  const bed = new Bed();
  let opener = null;
  let root = null;
  let timer = 0;
  let words = [];
  let index = 0;
  let playing = false;
  let wpm = 220;
  let size = 52;
  let bare = false;
  let sound = loadSound();

  function syncOpener() {
    const show = isReadingScreen() && !root;
    if (show && !opener) {
      opener = document.createElement("button");
      opener.type = "button";
      opener.className = "slovo-open";
      opener.textContent = "По словам";
      opener.addEventListener("click", open);
      document.body.appendChild(opener);
    } else if (!show && opener) {
      opener.remove();
      opener = null;
    }
  }

  function open() {
    words = pageWords();
    if (words.length < 2) return;
    index = 0;
    playing = false;
    bare = false;
    root = document.createElement("div");
    root.className = "slovo-root";
    root.innerHTML = `
      <div class="slovo-bar">
        <button class="slovo-icon" data-act="close" aria-label="К тексту">←</button>
        <div class="slovo-title"></div>
        <button class="slovo-icon" data-act="sound" aria-label="Фоновый звук">♫</button>
        <button class="slovo-icon" data-act="full" aria-label="На весь экран">⛶</button>
      </div>
      <div class="slovo-stage">
        <button class="slovo-float left" data-act="sound" aria-label="Фоновый звук">♫</button>
        <button class="slovo-float right" data-act="full" aria-label="Выйти из полного экрана">⛶</button>
        <div class="slovo-line" data-line="top"></div>
        <div class="slovo-line" data-line="bottom"></div>
        <div class="slovo-word"></div>
      </div>
      <div class="slovo-foot">
        <div class="slovo-meta"></div>
        <div class="slovo-row">
          <button class="slovo-round" data-act="back">−5</button>
          <button class="slovo-play" data-act="toggle" aria-label="Читать">▶</button>
          <button class="slovo-round" data-act="forward">+5</button>
        </div>
        <div class="slovo-speed">
          <button class="slovo-round" data-act="smaller">А−</button>
          <input data-act="wpm" type="range" min="120" max="500" step="10" value="${wpm}" aria-label="Скорость">
          <button class="slovo-round" data-act="larger">А+</button>
        </div>
      </div>`;
    root.querySelector(".slovo-title").textContent = pageTitle();
    root.addEventListener("click", onClick);
    root.querySelector("[data-act=wpm]").addEventListener("input", (event) => {
      wpm = Number(event.target.value);
      renderMeta();
    });
    document.body.appendChild(root);
    renderWord();
    syncOpener();
    if (sound.id) void bed.play(sound.id);
    bed.setVolume(sound.volume);
  }

  function close() {
    stopTick();
    bed.stop();
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    root?.remove();
    root = null;
    bare = false;
    syncOpener();
  }

  function onClick(event) {
    const act = event.target.closest("[data-act]")?.dataset.act;
    if (act === "wpm") return;
    if (!act && event.target.closest(".slovo-stage")) {
      toggle();
      return;
    }
    if (!act) return;
    if (act === "close") close();
    else if (act === "toggle") toggle();
    else if (act === "back") jump(-5);
    else if (act === "forward") jump(5);
    else if (act === "smaller") resize(-4);
    else if (act === "larger") resize(4);
    else if (act === "full") toggleFull();
    else if (act === "sound") openSheet();
    else if (act === "again") {
      index = 0;
      playing = false;
      renderWord();
    }
  }

  function toggleFull() {
    bare = !bare;
    root.classList.toggle("bare", bare);
    root.querySelectorAll("[data-act=full]").forEach((button) => button.classList.toggle("on", bare));
    const node = root;
    if (bare) {
      const target = node;
      const ask = target.requestFullscreen || target.webkitRequestFullscreen;
      if (ask) Promise.resolve(ask.call(target)).catch(() => {});
    } else if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
    requestAnimationFrame(place);
  }

  function resize(delta) {
    size = Math.min(84, Math.max(32, size + delta));
    renderWord();
  }

  function jump(delta) {
    index = Math.min(words.length - 1, Math.max(0, index + delta));
    renderWord();
  }

  function toggle() {
    if (index >= words.length) index = 0;
    playing = !playing;
    renderMeta();
    if (playing) tick();
    else stopTick();
    if (playing && sound.id) void bed.play(sound.id);
  }

  function delayFor(word) {
    const base = 60000 / wpm;
    if (/[.!?…]$/.test(word)) return base * 1.8;
    if (/[,;:]$/.test(word)) return base * 1.35;
    return base;
  }

  function tick() {
    stopTick();
    timer = window.setTimeout(() => {
      if (!playing) return;
      if (index >= words.length - 1) {
        playing = false;
        index = words.length;
        renderWord();
        return;
      }
      index += 1;
      renderWord();
      tick();
    }, delayFor(words[index] || ""));
  }

  function stopTick() {
    window.clearTimeout(timer);
  }

  function renderMeta() {
    if (!root) return;
    const meta = root.querySelector(".slovo-meta");
    const play = root.querySelector(".slovo-play");
    if (index >= words.length) {
      meta.textContent = "";
      play.textContent = "▶";
      return;
    }
    meta.textContent = `${index + 1} из ${words.length} · ${wpm} сл/мин`;
    play.textContent = playing ? "❚❚" : "▶";
  }

  function renderWord() {
    if (!root) return;
    const stage = root.querySelector(".slovo-stage");
    const existing = stage.querySelector(".slovo-done");
    existing?.remove();
    const wordEl = stage.querySelector(".slovo-word");
    if (index >= words.length) {
      wordEl.classList.remove("ready");
      wordEl.textContent = "";
      stage.insertAdjacentHTML(
        "beforeend",
        `<div class="slovo-done"><p>Текст пройден</p><h2>${pageTitle()}</h2><button class="slovo-round" data-act="again">Сначала</button></div>`,
      );
      renderMeta();
      return;
    }
    const word = words[index];
    const chars = Array.from(word);
    const at = Math.min(focusAt(word), chars.length - 1);
    wordEl.classList.remove("ready");
    wordEl.style.fontSize = size + "px";
    wordEl.innerHTML = "";
    chars.forEach((char, i) => {
      const span = document.createElement("span");
      if (i === at) span.className = "slovo-focus";
      span.textContent = char;
      wordEl.appendChild(span);
    });
    renderMeta();
    requestAnimationFrame(() => place());
  }

  function place() {
    if (!root) return;
    const stage = root.querySelector(".slovo-stage");
    const wordEl = stage.querySelector(".slovo-word");
    const focus = wordEl.querySelector(".slovo-focus");
    if (!focus) return;
    const stageW = stage.clientWidth;
    const center = focus.offsetLeft + focus.offsetWidth / 2;
    const left = center;
    const right = wordEl.offsetWidth - center;
    const roomL = stageW / 2 - 24;
    const roomR = stageW / 2 - 24;
    const scale = Math.min(1, roomL / Math.max(left, 1), roomR / Math.max(right, 1));
    const x = stageW / 2 - center * scale;
    wordEl.style.transform = `translate3d(${x}px,-50%,0) scale(${scale})`;
    wordEl.style.transformOrigin = "left center";
    wordEl.classList.add("ready");
    const gap = Math.max(12, size * 0.22);
    const wordTop = stage.clientHeight / 2 - (focus.offsetHeight * scale) / 2;
    const wordBottom = stage.clientHeight / 2 + (focus.offsetHeight * scale) / 2;
    const top = stage.querySelector('[data-line="top"]');
    const bottom = stage.querySelector('[data-line="bottom"]');
    top.style.top = "8%";
    top.style.height = Math.max(0, wordTop - gap - stage.clientHeight * 0.08) + "px";
    bottom.style.top = wordBottom + gap + "px";
    bottom.style.bottom = "8%";
    bottom.style.height = "auto";
  }

  function openSheet() {
    if (!root || root.querySelector(".slovo-sheet")) return;
    const sheet = document.createElement("div");
    sheet.className = "slovo-sheet";
    sheet.innerHTML = `<div class="slovo-panel">
      <header><span></span><h2>Фоновый звук</h2><button type="button" data-close="1">Готово</button></header>
      ${choiceBlock("", "Без звука")}
      <div class="slovo-group">Природа</div>
      ${NATURE.map((item) => choiceBlock(item[0], item[1])).join("")}
      <div class="slovo-group">Концентрация</div>
      ${FOCUS.map((item) => choiceBlock(item[0], item[1])).join("")}
      <label class="slovo-vol">Громкость<input type="range" min="0" max="1" step="0.01" value="${sound.volume}" data-vol="1"></label>
    </div>`;
    sheet.addEventListener("click", async (event) => {
      if (event.target === sheet || event.target.dataset.close) {
        sheet.remove();
        return;
      }
      const button = event.target.closest("[data-sound]");
      if (!button) return;
      sound.id = button.dataset.sound || null;
      saveSound(sound.id, sound.volume);
      markSheet(sheet);
      const icon = root.querySelectorAll("[data-act=sound]");
      icon.forEach((node) => node.classList.toggle("on", Boolean(sound.id)));
      if (!sound.id) bed.stop();
      else await bed.play(sound.id);
    });
    sheet.querySelector("[data-vol]").addEventListener("input", (event) => {
      sound.volume = Number(event.target.value);
      saveSound(sound.id, sound.volume);
      bed.setVolume(sound.volume);
    });
    root.appendChild(sheet);
    root.querySelectorAll("[data-act=sound]").forEach((icon) => icon.classList.toggle("on", Boolean(sound.id)));
  }

  function choiceBlock(id, title) {
    const on = (sound.id || "") === id;
    return `<button type="button" class="slovo-choice${on ? " on" : ""}" data-sound="${id}"><b>${title}</b><span>${on ? "✓" : ""}</span></button>`;
  }

  function markSheet(sheet) {
    sheet.querySelectorAll("[data-sound]").forEach((button) => {
      const on = (sound.id || "") === button.dataset.sound;
      button.classList.toggle("on", on);
      button.querySelector("span").textContent = on ? "✓" : "";
    });
  }

  window.addEventListener("keydown", (event) => {
    if (!root) return;
    if (event.key === "Escape") close();
    if (event.key === " ") {
      event.preventDefault();
      toggle();
    }
  });
  window.addEventListener("resize", () => requestAnimationFrame(place));

  const push = history.pushState;
  const replace = history.replaceState;
  history.pushState = function () {
    const result = push.apply(this, arguments);
    syncOpener();
    return result;
  };
  history.replaceState = function () {
    const result = replace.apply(this, arguments);
    syncOpener();
    return result;
  };
  window.addEventListener("popstate", syncOpener);
  new MutationObserver(() => syncOpener()).observe(document.documentElement, { childList: true, subtree: true });
  syncOpener();
})();

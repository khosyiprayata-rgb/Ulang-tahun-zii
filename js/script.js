/* =========================================================
   Happy Birthday, Azizah! — interaksi
   ========================================================= */
(() => {
  "use strict";

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const NS = "http://www.w3.org/2000/svg";

  /* ---------------------------------------------------------
     Confetti (confetti, hati, bintang) di atas kanvas
  --------------------------------------------------------- */
  const canvas = $("#confetti");
  const ctx = canvas.getContext("2d");
  const COLORS = ["#ff9fc2", "#ffbfd6", "#ffdbe8", "#ffffff", "#ffe08a", "#f77aa8", "#d9c8ff", "#c3e8ff"];
  let W = 0, H = 0, particles = [], rafId = null;

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth; H = window.innerHeight;
    canvas.width = W * dpr; canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  window.addEventListener("resize", resize);
  resize();

  const rand = (a, b) => a + Math.random() * (b - a);
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

  function addParticle(x, y, angle, speed) {
    particles.push({
      x, y,
      vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
      size: rand(7, 14), rot: rand(0, Math.PI * 2), vr: rand(-.2, .2),
      color: pick(COLORS), shape: pick(["rect", "rect", "circle", "heart", "star"]),
      life: 0, max: rand(150, 240), wob: rand(0, 6.28)
    });
  }

  function burst(x, y, count = 80, spread = Math.PI * 2, base = -Math.PI / 2, power = 11) {
    if (reduce) count = Math.min(count, 18);
    for (let i = 0; i < count; i++) {
      const a = base + rand(-spread / 2, spread / 2);
      addParticle(x, y, a, rand(power * .4, power));
    }
    start();
  }

  function rain(ms = 4000) {
    if (reduce) return;
    const end = performance.now() + ms;
    (function tick() {
      for (let i = 0; i < 3; i++) addParticle(rand(0, W), -20, Math.PI / 2 + rand(-.4, .4), rand(1.5, 4));
      start();
      if (performance.now() < end) setTimeout(tick, 70);
    })();
  }

  function drawHeart(s) {
    ctx.beginPath();
    ctx.moveTo(0, s * .45);
    ctx.bezierCurveTo(-s, -s * .1, -s * .55, -s * .95, 0, -s * .35);
    ctx.bezierCurveTo(s * .55, -s * .95, s, -s * .1, 0, s * .45);
    ctx.fill();
  }
  function drawStar(s) {
    ctx.beginPath();
    ctx.moveTo(0, -s);
    ctx.quadraticCurveTo(s * .15, -s * .15, s, 0);
    ctx.quadraticCurveTo(s * .15, s * .15, 0, s);
    ctx.quadraticCurveTo(-s * .15, s * .15, -s, 0);
    ctx.quadraticCurveTo(-s * .15, -s * .15, 0, -s);
    ctx.fill();
  }

  function frame() {
    ctx.clearRect(0, 0, W, H);
    particles = particles.filter((p) => p.life < p.max && p.y < H + 40);
    for (const p of particles) {
      p.life++;
      p.vy += .16; p.vx *= .985; p.vy *= .985;
      p.wob += .08;
      p.x += p.vx + Math.sin(p.wob) * .6; p.y += p.vy;
      p.rot += p.vr;
      const alpha = Math.min(1, (p.max - p.life) / 40);
      ctx.save();
      ctx.globalAlpha = Math.max(0, alpha);
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      if (p.shape === "rect") ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
      else if (p.shape === "circle") { ctx.beginPath(); ctx.arc(0, 0, p.size / 3, 0, 6.283); ctx.fill(); }
      else if (p.shape === "heart") drawHeart(p.size * .55);
      else drawStar(p.size * .6);
      ctx.restore();
    }
    if (particles.length) rafId = requestAnimationFrame(frame);
    else { rafId = null; ctx.clearRect(0, 0, W, H); }
  }
  function start() { if (!rafId) rafId = requestAnimationFrame(frame); }

  /* ---------------------------------------------------------
     Hati/bunga melayang di latar (lembut, tidak ramai)
  --------------------------------------------------------- */
  (function floaters() {
    if (reduce) return;
    const box = $("#floaters");
    const items = ["i-heart", "i-star", "i-flower", "i-heart"];
    const tint = ["#ffb3cf", "#ffd0e2", "#ffc6dc", "#ff9fc2"];
    const count = window.innerWidth < 700 ? 9 : 14;
    for (let i = 0; i < count; i++) {
      const el = document.createElement("div");
      el.className = "floater";
      const size = rand(14, 28);
      el.style.cssText = `left:${rand(0, 100)}%;width:${size}px;height:${size}px;` +
        `animation-duration:${rand(14, 26)}s;animation-delay:${-rand(0, 24)}s;--dx:${rand(-60, 60)}px;`;
      const svg = document.createElementNS(NS, "svg");
      svg.style.setProperty("--c", pick(tint));
      svg.style.setProperty("--petal", pick(tint));
      const use = document.createElementNS(NS, "use");
      use.setAttribute("href", "#" + pick(items));
      svg.appendChild(use);
      el.appendChild(svg);
      box.appendChild(el);
    }
  })();

  /* ---------------------------------------------------------
     1. Pembuka: huruf muncul satu per satu + tombol masuk
  --------------------------------------------------------- */
  (function splitTitle() {
    let n = 0;
    $$("[data-split]").forEach((line) => {
      const text = line.dataset.split;
      line.setAttribute("aria-hidden", "true");
      for (const c of text) {
        if (c === " ") {
          const sp = document.createElement("span");
          sp.className = "sp"; line.appendChild(sp); continue;
        }
        const s = document.createElement("span");
        s.className = "ch"; s.textContent = c;
        s.style.animationDelay = (0.25 + n * 0.07) + "s";
        line.appendChild(s); n++;
      }
    });
  })();

  const intro = $("#intro");
  const main = $("#main");
  const nav = $("#nav");
  const miniMusic = $("#miniMusic");

  function openSite() {
    const r = $("#openBtn").getBoundingClientRect();
    burst(r.left + r.width / 2, r.top + r.height / 2, 120, Math.PI * 2, -Math.PI / 2, 12);
    burst(W * .2, H * .85, 60, Math.PI / 2, -Math.PI / 3, 15);
    burst(W * .8, H * .85, 60, Math.PI / 2, -Math.PI * 2 / 3, 15);

    intro.classList.add("leaving");
    main.hidden = false; nav.hidden = false; miniMusic.hidden = false;
    document.body.classList.remove("locked");
    window.scrollTo(0, 0);
    requestAnimationFrame(() => requestAnimationFrame(() => {
      main.classList.add("show"); nav.classList.add("show");
      observeReveals();
    }));
    setTimeout(() => { intro.hidden = true; }, 950);
  }
  $("#openBtn").addEventListener("click", openSite);

  /* ---------------------------------------------------------
     Muncul halus saat di-scroll + penanda menu aktif
  --------------------------------------------------------- */
  let revealObs = null;
  function observeReveals() {
    if (!("IntersectionObserver" in window)) { $$(".reveal").forEach((e) => e.classList.add("in")); return; }
    if (!revealObs) {
      revealObs = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) { e.target.classList.add("in"); revealObs.unobserve(e.target); }
        });
      }, { threshold: .12, rootMargin: "0px 0px -6% 0px" });
    }
    $$(".reveal:not(.in)").forEach((el, i) => {
      if (el.classList.contains("polaroid")) el.style.transitionDelay = (i % 3) * 0.12 + "s";
      revealObs.observe(el);
    });

    const links = $$(".nav a");
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          links.forEach((l) => l.classList.toggle("active", l.dataset.spy === e.target.id));
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    links.forEach((l) => { const s = document.getElementById(l.dataset.spy); if (s) spy.observe(s); });
  }

  /* ---------------------------------------------------------
     3. Galeri: foto dari folder assets/photos, atau tambah manual
  --------------------------------------------------------- */
  const picker = $("#photoPicker");
  let activeFigure = null;

  $$(".polaroid").forEach((fig) => {
    const img = $("img", fig);
    const markEmpty = () => fig.classList.add("empty");
    img.addEventListener("error", markEmpty);
    img.addEventListener("load", () => fig.classList.remove("empty"));
    if (img.complete && img.naturalWidth === 0) markEmpty();

    $(".photo-btn", fig).addEventListener("click", () => {
      activeFigure = fig;
      picker.value = "";
      picker.click();
    });
  });

  picker.addEventListener("change", () => {
    const file = picker.files && picker.files[0];
    if (!file || !activeFigure) return;
    const url = URL.createObjectURL(file);
    const img = $("img", activeFigure);
    img.src = url;
    activeFigure.classList.remove("empty");
    const r = activeFigure.getBoundingClientRect();
    burst(r.left + r.width / 2, r.top + r.height / 3, 26, Math.PI, -Math.PI / 2, 8);
  });

  /* ---------------------------------------------------------
     4. Musik: pakai assets/music.mp3 bila ada,
        jika tidak, pakai melodi music box buatan sendiri (Web Audio)
  --------------------------------------------------------- */
  const Synth = (() => {
    let ac = null, master = null, timer = null, step = 0, nextTime = 0, running = false, vol = .6;
    const BPM = 76, EIGHTH = 60 / BPM / 2;
    const CHORDS = [[48, 52, 55, 60], [45, 52, 57, 60], [41, 48, 53, 57], [43, 50, 55, 59]]; // C Am F G
    const MEL = [
      [76, 0, 79, 0, 84, 79, 76, 0],
      [81, 0, 76, 0, 72, 76, 81, 0],
      [77, 0, 81, 0, 84, 81, 77, 0],
      [79, 0, 83, 0, 86, 83, 79, 0],
      [84, 0, 81, 0, 79, 76, 79, 0],
      [76, 0, 72, 0, 69, 72, 76, 0],
      [77, 0, 79, 81, 84, 0, 81, 0],
      [83, 0, 79, 0, 74, 79, 83, 0]
    ];
    const ARP = [0, 1, 2, 3, 2, 1, 2, 3];
    const mtof = (m) => 440 * Math.pow(2, (m - 69) / 12);

    function build() {
      const AC = window.AudioContext || window.webkitAudioContext;
      ac = new AC();
      master = ac.createGain(); master.gain.value = vol * .8;
      const comp = ac.createDynamicsCompressor();
      const delay = ac.createDelay(1); delay.delayTime.value = EIGHTH * 1.5;
      const fb = ac.createGain(); fb.gain.value = .32;
      const lp = ac.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 3200;
      delay.connect(lp); lp.connect(fb); fb.connect(delay);
      master.connect(comp); master.connect(delay); lp.connect(comp);
      comp.connect(ac.destination);
    }

    function note(m, t, dur, gain) {
      const f = mtof(m);
      const g = ac.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(gain, t + .006);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      const o1 = ac.createOscillator(); o1.type = "sine"; o1.frequency.value = f;
      const o2 = ac.createOscillator(); o2.type = "triangle"; o2.frequency.value = f * 2;
      const g2 = ac.createGain(); g2.gain.value = .22;
      o1.connect(g); o2.connect(g2); g2.connect(g); g.connect(master);
      o1.start(t); o2.start(t); o1.stop(t + dur + .05); o2.stop(t + dur + .05);
    }

    function schedule() {
      while (nextTime < ac.currentTime + .25) {
        const bar = Math.floor(step / 8) % 8;
        const s = step % 8;
        const chord = CHORDS[bar % 4];
        note(chord[ARP[s]], nextTime, 1.7, .11);
        if (s === 0) note(chord[0] - 12, nextTime, 2.6, .12);
        const m = MEL[bar][s];
        if (m) note(m, nextTime, 2.0, .2);
        nextTime += EIGHTH;
        step = (step + 1) % 64;
      }
    }

    return {
      async start() {
        if (!ac) build();
        if (ac.state === "suspended") await ac.resume();
        if (running) return;
        running = true;
        nextTime = ac.currentTime + .08;
        schedule();
        timer = setInterval(schedule, 40);
      },
      async stop() {
        running = false; clearInterval(timer);
        if (ac && ac.state === "running") await ac.suspend();
      },
      setVolume(v) { vol = v; if (master) master.gain.value = v * .8; }
    };
  })();

  const Player = (() => {
    const audio = new Audio();
    audio.loop = true; audio.preload = "auto";
    let hasFile = null; // null = belum tahu
    let playing = false;
    audio.addEventListener("canplay", () => { hasFile = true; setLabels(); });
    audio.addEventListener("error", () => { hasFile = false; setLabels(); });
    audio.src = "assets/music.mp3";

    const ui = {
      play: $("#playBtn"), label: $("#playLabel"), mini: $("#miniMusic"),
      vinyl: $("#vinyl"), eq: $("#eq"), vol: $("#vol"),
      title: $("#trackTitle"), sub: $("#trackSub")
    };

    function setLabels() {
      if (hasFile) { ui.title.textContent = "Lagu Spesial"; ui.sub.textContent = "Dipilih Khosyi khusus untuk Azizah"; }
      else { ui.title.textContent = "Music Box Lullaby"; ui.sub.textContent = "Melodi lembut untuk Azizah"; }
    }
    function render() {
      ui.play.classList.toggle("on", playing);
      ui.play.setAttribute("aria-pressed", String(playing));
      ui.label.textContent = playing ? "Pause" : "Play";
      ui.mini.classList.toggle("on", playing);
      ui.mini.setAttribute("aria-pressed", String(playing));
      ui.mini.setAttribute("aria-label", playing ? "Jeda musik" : "Putar musik");
      ui.vinyl.classList.toggle("spin", playing);
      ui.eq.classList.toggle("on", playing);
    }
    async function play() {
      audio.volume = ui.vol.value / 100;
      Synth.setVolume(ui.vol.value / 100);
      if (hasFile !== false) {
        try { await audio.play(); playing = true; hasFile = true; setLabels(); render(); return; }
        catch (e) { hasFile = false; setLabels(); }
      }
      try { await Synth.start(); playing = true; } catch (e) { playing = false; }
      render();
    }
    async function pause() {
      audio.pause(); await Synth.stop();
      playing = false; render();
    }
    function toggle() { playing ? pause() : play(); }

    ui.play.addEventListener("click", toggle);
    ui.mini.addEventListener("click", toggle);
    ui.vol.addEventListener("input", () => {
      const v = ui.vol.value / 100;
      audio.volume = v; Synth.setVolume(v);
    });
    setLabels(); render();
    return { toggle };
  })();

  /* ---------------------------------------------------------
     5. Surat rahasia
  --------------------------------------------------------- */
  const envelope = $("#envelope");
  const letterWrap = $("#letterCard");
  const envHint = $("#envHint");
  $$(".l-line").forEach((p, i) => p.style.setProperty("--i", i));

  envelope.addEventListener("click", () => {
    const open = !envelope.classList.contains("open");
    envelope.classList.toggle("open", open);
    letterWrap.classList.toggle("open", open);
    envelope.setAttribute("aria-expanded", String(open));
    envelope.setAttribute("aria-label", open ? "Tutup amplop surat" : "Buka amplop surat");
    envHint.textContent = open ? "Surat ini cuma buat kamu. Baca pelan-pelan ya." : "Ketuk amplopnya untuk membuka.";
    if (open) {
      const r = envelope.getBoundingClientRect();
      burst(r.left + r.width / 2, r.top + r.height * .4, 34, Math.PI * 1.2, -Math.PI / 2, 9);
      setTimeout(() => {
        const t = letterWrap.getBoundingClientRect();
        if (t.top > window.innerHeight * .5) window.scrollBy({ top: t.top - window.innerHeight * .35, behavior: "smooth" });
      }, 1400);
    }
  });

  /* ---------------------------------------------------------
     6. Kejutan terakhir
  --------------------------------------------------------- */
  const sBtn = $("#surpriseBtn");
  const sBox = $("#surpriseReveal");
  const sLabel = $("#surpriseLabel");

  function heartRain() {
    if (reduce) return;
    for (let i = 0; i < 16; i++) {
      const el = document.createElement("div");
      el.className = "floater";
      const size = rand(20, 38);
      el.style.cssText = `left:${rand(2, 96)}%;width:${size}px;height:${size}px;z-index:95;` +
        `animation-duration:${rand(5, 9)}s;animation-delay:${rand(0, 2.5)}s;animation-iteration-count:1;--dx:${rand(-40, 40)}px;`;
      const svg = document.createElementNS(NS, "svg");
      svg.style.setProperty("--c", pick(["#ff8fb8", "#ffb3cf", "#f77aa8"]));
      const use = document.createElementNS(NS, "use");
      use.setAttribute("href", "#i-heart");
      svg.appendChild(use); el.appendChild(svg);
      $("#floaters").appendChild(el);
      setTimeout(() => el.remove(), 12000);
    }
  }

  sBtn.addEventListener("click", () => {
    const first = !sBox.classList.contains("show");
    sBox.classList.add("show");
    sLabel.textContent = "Ulangi kejutannya";
    const r = sBtn.getBoundingClientRect();
    burst(r.left + r.width / 2, r.top + r.height / 2, 130, Math.PI * 2, -Math.PI / 2, 13);
    burst(W * .15, H, 70, Math.PI / 2.2, -Math.PI / 3, 18);
    burst(W * .85, H, 70, Math.PI / 2.2, -Math.PI * 2 / 3, 18);
    rain(4500);
    heartRain();
    setTimeout(() => burst(W / 2, H * .35, 100, Math.PI * 2, -Math.PI / 2, 12), 700);
    setTimeout(() => burst(W * .3, H * .3, 60, Math.PI * 2, -Math.PI / 2, 10), 1500);
    setTimeout(() => burst(W * .7, H * .3, 60, Math.PI * 2, -Math.PI / 2, 10), 2100);
    if (first) {
      setTimeout(() => sBox.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" }), 500);
      setTimeout(() => burst(W / 2, H * .5, 140, Math.PI * 2, -Math.PI / 2, 14), 3600);
    }
  });
})();

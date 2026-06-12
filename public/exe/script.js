/* RANNE.EXE — interactions */
(function () {
  "use strict";

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hasGsap = typeof gsap !== "undefined";
  if (hasGsap) gsap.registerPlugin(ScrollTrigger);

  /* ---------------- smooth scroll ---------------- */
  let lenis = null;
  if (!prefersReduced && typeof Lenis !== "undefined") {
    lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    lenis.on("scroll", () => hasGsap && ScrollTrigger.update());
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const target = document.querySelector(a.getAttribute("href"));
      if (!target) return;
      e.preventDefault();
      if (lenis) lenis.scrollTo(target, { offset: -70, duration: 1.3 });
      else target.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth" });
    });
  });

  /* ---------------- boot sequence ---------------- */
  const boot = document.getElementById("boot");
  const bootPre = document.getElementById("bootPre");
  const BOOT_LINES = [
    "RANNE-OS BIOS v2.6",
    "COPYRIGHT (C) 2026 GERODIAS SYSTEMS",
    "",
    "CPU : FULL-STACK ENGINEER @ 4.0GHZ",
    "MEM : {MEM}K OK",
    "",
    "DETECTING DRIVES...",
    "  C:\\PROJECTS ....... OK",
    "  D:\\SKILLS ......... OK",
    "  E:\\COFFEE ......... OVERFLOW",
    "",
    "BOOTING RANNE.EXE_"
  ];

  function heroIntro() {
    if (!hasGsap || prefersReduced) return;
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.from(".hero__title", { opacity: 0, scale: 0.92, duration: 0.7 })
      .to(".hero .reveal", { opacity: 1, y: 0, duration: 0.7, stagger: 0.1 }, "-=0.3");
  }

  function endBoot() {
    if (!boot || boot.dataset.done) return;
    boot.dataset.done = "1";
    if (hasGsap && !prefersReduced) {
      gsap.to(boot, {
        opacity: 0, duration: 0.45, ease: "power2.in",
        onComplete: () => { boot.remove(); heroIntro(); }
      });
    } else {
      boot.remove();
    }
  }

  if (prefersReduced || !hasGsap || !boot) {
    if (boot) boot.remove();
    document.querySelectorAll(".reveal").forEach((el) => {
      el.style.opacity = 1;
      el.style.transform = "none";
    });
  } else {
    boot.addEventListener("click", endBoot);
    let li = 0;
    const lines = [];
    (function nextLine() {
      if (!document.body.contains(boot) || boot.dataset.done) return;
      if (li >= BOOT_LINES.length) { setTimeout(endBoot, 420); return; }
      const line = BOOT_LINES[li++];
      if (line.includes("{MEM}")) {
        const counter = { k: 0 };
        lines.push(line.replace("{MEM}", "0"));
        const idx = lines.length - 1;
        gsap.to(counter, {
          k: 65536, duration: 0.5, ease: "power1.in",
          onUpdate() {
            lines[idx] = line.replace("{MEM}", String(Math.round(counter.k)));
            bootPre.textContent = lines.join("\n");
          },
          onComplete: nextLine
        });
        return;
      }
      lines.push(line);
      bootPre.textContent = lines.join("\n");
      setTimeout(nextLine, line === "" ? 60 : 130);
    })();
  }

  /* ---------------- generic reveals ---------------- */
  if (hasGsap && !prefersReduced) {
    document.querySelectorAll(".reveal").forEach((el) => {
      if (el.closest(".hero")) return;
      gsap.to(el, {
        opacity: 1, y: 0, duration: 0.8, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 85%" }
      });
    });
  }

  /* ---------------- bars + counters ---------------- */
  function animateBars(scope, containerAnimation) {
    scope.querySelectorAll(".bar").forEach((bar) => {
      const fill = bar.querySelector(".bar__fill");
      const pct = Number(bar.dataset.fill) || 0;
      if (!hasGsap || prefersReduced) { fill.style.width = pct + "%"; return; }
      gsap.to(fill, {
        width: pct + "%", duration: 1.1, ease: "steps(14)",
        scrollTrigger: { trigger: bar, start: "top 88%", containerAnimation }
      });
    });
    scope.querySelectorAll("[data-count]").forEach((el) => {
      const target = Number(el.dataset.count) || 0;
      if (!hasGsap || prefersReduced) { el.textContent = target; return; }
      const obj = { v: 0 };
      gsap.to(obj, {
        v: target, duration: 1.1, ease: "power1.out",
        onUpdate: () => { el.textContent = Math.round(obj.v); },
        scrollTrigger: { trigger: el, start: "top 88%", containerAnimation }
      });
    });
  }
  animateBars(document);

  /* ---------------- quests: pinned horizontal ---------------- */
  const track = document.getElementById("questTrack");
  const counterEl = document.getElementById("questCounter");
  const TOTAL = track ? track.children.length : 0;

  function setQuestCounter(p) {
    const q = Math.max(1, Math.min(TOTAL, Math.round(p * (TOTAL - 1)) + 1));
    counterEl.textContent = "QUEST 0" + q + " / 0" + TOTAL;
  }

  if (hasGsap && !prefersReduced && track) {
    ScrollTrigger.matchMedia({
      "(min-width: 821px)": function () {
        const getDistance = () => track.scrollWidth - window.innerWidth;
        gsap.to(track, {
          x: () => -getDistance(),
          ease: "none",
          scrollTrigger: {
            trigger: ".quests__pin",
            start: "top top",
            end: () => "+=" + getDistance(),
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => setQuestCounter(self.progress)
          }
        });
      }
    });
  }

  /* ---------------- nav behaviour ---------------- */
  const nav = document.getElementById("nav");
  let lastY = 0;
  window.addEventListener("scroll", () => {
    const y = window.scrollY;
    nav.classList.toggle("is-scrolled", y > 40);
    nav.classList.toggle("is-hidden", y > 700 && y > lastY);
    lastY = y;
  }, { passive: true });

  /* ---------------- taskbar ---------------- */
  const clock = document.getElementById("taskbarClock");
  function tickClock() {
    const d = new Date();
    clock.textContent =
      String(d.getHours()).padStart(2, "0") + ":" + String(d.getMinutes()).padStart(2, "0");
  }
  tickClock();
  setInterval(tickClock, 15000);

  document.getElementById("taskbarStart").addEventListener("click", () => {
    if (lenis) lenis.scrollTo(0, { duration: 1.2 });
    else window.scrollTo({ top: 0, behavior: prefersReduced ? "auto" : "smooth" });
  });

  /* ---------------- pixel cursor (grid-snapped) ---------------- */
  const cursor = document.querySelector(".px-cursor");
  if (cursor && window.matchMedia("(hover: hover)").matches && !prefersReduced) {
    const SNAP = 4;
    window.addEventListener("mousemove", (e) => {
      cursor.classList.add("is-active");
      const x = Math.round(e.clientX / SNAP) * SNAP;
      const y = Math.round(e.clientY / SNAP) * SNAP;
      cursor.style.transform = "translate(" + (x - 5) + "px," + (y - 5) + "px)" +
        (cursor.classList.contains("is-hover") ? " scale(1.6)" : "");
    });
    document.querySelectorAll("a, button").forEach((el) => {
      el.addEventListener("mouseenter", () => cursor.classList.add("is-hover"));
      el.addEventListener("mouseleave", () => cursor.classList.remove("is-hover"));
    });
  }

  /* ---------------- konami code ---------------- */
  const KONAMI = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
  let kIdx = 0;
  const toast = document.getElementById("achievement");
  window.addEventListener("keydown", (e) => {
    kIdx = e.key === KONAMI[kIdx] ? kIdx + 1 : (e.key === KONAMI[0] ? 1 : 0);
    if (kIdx !== KONAMI.length) return;
    kIdx = 0;
    document.body.classList.add("konami");
    toast.classList.add("is-shown");
    setTimeout(() => document.body.classList.remove("konami"), 1600);
    setTimeout(() => toast.classList.remove("is-shown"), 4600);
  });

  /* ---------------- hero typewriter ---------------- */
  const heroType = document.getElementById("heroType");
  if (heroType && !prefersReduced) {
    const full = heroType.textContent;
    heroType.textContent = "";
    let i = 0;
    setTimeout(function typeNext() {
      if (i <= full.length) {
        heroType.textContent = full.slice(0, i++);
        setTimeout(typeNext, 45);
      }
    }, 2600);
  }

  /* ================================================================
     THREE.JS — synthwave particle terrain (hero)
     ================================================================ */
  (function initTerrain() {
    const canvas = document.getElementById("heroCanvas");
    if (!canvas || prefersReduced || typeof THREE === "undefined") return;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true, powerPreference: "low-power" });
    } catch (err) {
      return; // no WebGL — CSS grid fallback stays visible
    }
    document.body.classList.add("webgl");

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x07070d, 18, 46);

    const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100);
    camera.position.set(0, 2.4, 9);
    camera.lookAt(0, 0.6, 0);

    // terrain: plane of points, noise-displaced, scrolling toward camera
    const W = 80, D = 60, SEG_X = 79, SEG_Z = 59;
    const geo = new THREE.PlaneGeometry(W, D, SEG_X, SEG_Z);
    geo.rotateX(-Math.PI / 2);
    const basePos = geo.attributes.position.array.slice();

    const mat = new THREE.PointsMaterial({
      color: 0x00ffff, size: 0.07, sizeAttenuation: true,
      transparent: true, opacity: 0.85, fog: true
    });
    const points = new THREE.Points(geo, mat);
    points.position.z = -14;
    scene.add(points);

    // magenta wireframe ridge layer (sparser)
    const ridgeGeo = new THREE.PlaneGeometry(W, D, 26, 20);
    ridgeGeo.rotateX(-Math.PI / 2);
    const ridgeBase = ridgeGeo.attributes.position.array.slice();
    const ridge = new THREE.LineSegments(
      new THREE.WireframeGeometry(ridgeGeo),
      new THREE.LineBasicMaterial({ color: 0xff3399, transparent: true, opacity: 0.10, fog: true })
    );
    ridge.position.copy(points.position);
    ridge.position.y -= 0.04;
    scene.add(ridge);

    // retro sun: flat gradient disc behind the terrain
    const sunCanvas = document.createElement("canvas");
    sunCanvas.width = sunCanvas.height = 256;
    const sctx = sunCanvas.getContext("2d");
    const grad = sctx.createLinearGradient(0, 0, 0, 256);
    grad.addColorStop(0, "#ff3399");
    grad.addColorStop(0.55, "#ffd700");
    grad.addColorStop(1, "rgba(255,51,153,0)");
    sctx.fillStyle = grad;
    sctx.beginPath();
    sctx.arc(128, 128, 120, 0, Math.PI * 2);
    sctx.fill();
    // horizontal CRT slats
    sctx.globalCompositeOperation = "destination-out";
    for (let y = 140; y < 256; y += 14) sctx.fillRect(0, y, 256, 5);
    const sun = new THREE.Sprite(new THREE.SpriteMaterial({
      map: new THREE.CanvasTexture(sunCanvas), transparent: true, opacity: 0.5, fog: false
    }));
    sun.scale.set(13, 13, 1);
    sun.position.set(0, 4.2, -34);
    scene.add(sun);

    // cheap layered "noise"
    function height(x, z, t) {
      const corridor = Math.min(1, Math.max(0, (Math.abs(x) - 4) / 14)); // flat path up the middle
      return corridor * (
        Math.sin(x * 0.32 + t * 0.7) * 0.9 +
        Math.cos(z * 0.24 + t * 0.45) * 0.7 +
        Math.sin((x + z) * 0.12 + t * 0.3) * 1.3
      );
    }

    function displace(attr, base, t, speed) {
      const arr = attr.array;
      for (let i = 0; i < arr.length; i += 3) {
        const x = base[i];
        const z = base[i + 2] + t * speed;
        arr[i + 1] = height(x, z, t);
      }
      attr.needsUpdate = true;
    }

    // mouse parallax (lerped)
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    window.addEventListener("mousemove", (e) => {
      mouse.tx = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.ty = (e.clientY / window.innerHeight - 0.5) * 2;
    }, { passive: true });

    function resize() {
      const w = canvas.offsetWidth, h = canvas.offsetHeight;
      renderer.setSize(w, h, false);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
    resize();
    window.addEventListener("resize", resize);

    // render only while hero is on screen
    let visible = true;
    new IntersectionObserver((entries) => {
      visible = entries[0].isIntersecting;
    }, { threshold: 0.02 }).observe(canvas);

    const clock = new THREE.Clock();
    (function frame() {
      requestAnimationFrame(frame);
      if (!visible) return;
      const t = clock.getElapsedTime();
      displace(geo.attributes.position, basePos, t, 1.6);
      displace(ridgeGeo.attributes.position, ridgeBase, t, 1.6);
      ridge.geometry.dispose();
      ridge.geometry = new THREE.WireframeGeometry(ridgeGeo);
      mouse.x += (mouse.tx - mouse.x) * 0.05;
      mouse.y += (mouse.ty - mouse.y) * 0.05;
      camera.position.x = mouse.x * 1.4;
      camera.position.y = 2.4 - mouse.y * 0.5;
      camera.lookAt(0, 0.6, -6);
      renderer.render(scene, camera);
    })();
  })();

  /* ================================================================
     Micro-interactions
     ================================================================ */

  /* ---- text scramble on section titles ---- */
  const GLYPHS = "!<>-_\\/[]{}=+*^?#01";
  function scramble(el) {
    const original = el.dataset.scrambleText || el.textContent;
    el.dataset.scrambleText = original;
    const len = original.length;
    let frame = 0;
    const total = Math.max(18, len * 1.6);
    (function step() {
      frame++;
      const resolved = Math.floor((frame / total) * len);
      let out = "";
      for (let i = 0; i < len; i++) {
        const ch = original[i];
        if (i < resolved || ch === " ") out += ch;
        else out += GLYPHS[(Math.random() * GLYPHS.length) | 0];
      }
      el.textContent = out;
      if (resolved < len) requestAnimationFrame(step);
      else el.textContent = original;
    })();
  }
  if (hasGsap && !prefersReduced) {
    document.querySelectorAll(".section__title").forEach((el) => {
      ScrollTrigger.create({
        trigger: el, start: "top 86%", once: false,
        onEnter: () => scramble(el)
      });
    });
  }

  /* ---- magnetic buttons ---- */
  if (hasGsap && !prefersReduced && window.matchMedia("(hover: hover)").matches) {
    document.querySelectorAll(".btn").forEach((btn) => {
      const xTo = gsap.quickTo(btn, "x", { duration: 0.35, ease: "power3.out" });
      const yTo = gsap.quickTo(btn, "y", { duration: 0.35, ease: "power3.out" });
      btn.addEventListener("mousemove", (e) => {
        const r = btn.getBoundingClientRect();
        xTo(((e.clientX - r.left) / r.width - 0.5) * 10);
        yTo(((e.clientY - r.top) / r.height - 0.5) * 8);
      });
      btn.addEventListener("mouseleave", () => { xTo(0); yTo(0); });
    });
  }

  /* ---- 3D tilt cards ---- */
  if (hasGsap && !prefersReduced && window.matchMedia("(hover: hover)").matches) {
    document.querySelectorAll("[data-tilt]").forEach((card) => {
      const rx = gsap.quickTo(card, "rotationX", { duration: 0.5, ease: "power3.out" });
      const ry = gsap.quickTo(card, "rotationY", { duration: 0.5, ease: "power3.out" });
      card.addEventListener("pointermove", (e) => {
        const r = card.getBoundingClientRect();
        rx(-((e.clientY - r.top) / r.height - 0.5) * 7);
        ry(((e.clientX - r.left) / r.width - 0.5) * 7);
      });
      card.addEventListener("pointerleave", () => { rx(0); ry(0); });
    });
  }

  /* ---- XP scroll progress ---- */
  const xpFill = document.getElementById("xpFill");
  const xpLabel = document.getElementById("xpLabel");
  const xpWrap = xpFill ? xpFill.parentElement : null;
  let xpTimer = null;
  function updateXP() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const p = max > 0 ? Math.min(1, window.scrollY / max) : 0;
    xpFill.style.width = (p * 100).toFixed(1) + "%";
    xpLabel.textContent = "XP " + Math.round(p * 100) + "%";
    xpWrap.classList.add("is-scrolling");
    clearTimeout(xpTimer);
    xpTimer = setTimeout(() => xpWrap.classList.remove("is-scrolling"), 900);
  }
  if (xpFill) {
    window.addEventListener("scroll", updateXP, { passive: true });
    updateXP();
  }

  /* ---- cursor trail ---- */
  if (window.matchMedia("(hover: hover)").matches && !prefersReduced) {
    const TRAIL = 4;
    const ghosts = [];
    for (let i = 0; i < TRAIL; i++) {
      const g = document.createElement("div");
      g.className = "px-trail";
      g.style.opacity = String(0.34 - i * 0.07);
      document.body.appendChild(g);
      ghosts.push({ el: g, x: -100, y: -100 });
    }
    let mx = -100, my = -100;
    window.addEventListener("mousemove", (e) => { mx = e.clientX; my = e.clientY; }, { passive: true });
    (function trailLoop() {
      let px = mx, py = my;
      ghosts.forEach((g, i) => {
        g.x += (px - g.x) * (0.32 - i * 0.05);
        g.y += (py - g.y) * (0.32 - i * 0.05);
        const sx = Math.round(g.x / 4) * 4, sy = Math.round(g.y / 4) * 4;
        g.el.style.transform = "translate(" + (sx - 3) + "px," + (sy - 3) + "px)";
        px = g.x; py = g.y;
      });
      requestAnimationFrame(trailLoop);
    })();
  }

  /* ---- marquee reacts to scroll velocity ---- */
  const marqueeTrack = document.querySelector(".marquee__track");
  if (marqueeTrack && lenis && hasGsap) {
    let boost = 1;
    lenis.on("scroll", (e) => {
      boost = 1 + Math.min(Math.abs(e.velocity) / 18, 3.5);
    });
    gsap.ticker.add(() => {
      boost += (1 - boost) * 0.04;
      marqueeTrack.style.animationDuration = (30 / boost).toFixed(2) + "s";
    });
  }
})();

// Movimento da página: rolagem suave (Lenis) + GSAP (ScrollTrigger,
// SplitText e DrawSVG — todos gratuitos desde o GSAP 3.13).
// Com "reduzir movimento" ligado no sistema, nada disso roda: o conteúdo
// aparece pronto e as marcas de caneta já vêm desenhadas.
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger, SplitText, DrawSVGPlugin);

const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

function smoothScroll(): Lenis | null {
  if (reduced) return null;
  const lenis = new Lenis({ lerp: 0.1, anchors: { offset: -72 }, autoRaf: false });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
  return lenis;
}

function header() {
  const el = document.querySelector<HTMLElement>("[data-header]");
  const hero = document.querySelector<HTMLElement>("[data-hero]");
  if (!el) return;
  if (hero) {
    ScrollTrigger.create({
      trigger: hero,
      start: "bottom top+=76",
      onEnter: () => el.classList.add("is-solid"),
      onLeaveBack: () => el.classList.remove("is-solid"),
    });
  } else {
    el.classList.add("is-solid");
  }
  // Some ao descer, volta ao subir.
  ScrollTrigger.create({
    start: 0,
    end: "max",
    onUpdate: (self) => {
      const down = self.direction === 1 && self.scroll() > window.innerHeight * 0.6;
      el.classList.toggle("is-hidden", down);
    },
  });
}

function heroIntro() {
  const hero = document.querySelector<HTMLElement>("[data-hero]");
  if (!hero) return;
  const title = hero.querySelector<HTMLElement>("[data-hero-title]");
  const ins = hero.querySelectorAll<HTMLElement>("[data-hero-in]");
  const pen = hero.querySelector<SVGPathElement>("[data-pen-draw]");

  if (reduced) return;

  // O CSS (html.motion) já deixa esses elementos escondidos desde o primeiro
  // quadro; aqui eles só ganham o ponto de partida da animação.
  gsap.set(ins, { y: 24 });
  if (pen) gsap.set(pen, { drawSVG: "0%" });

  const tl = gsap.timeline({ delay: 0.25 });
  if (title) {
    gsap.set(title, { visibility: "visible" });
    const split = SplitText.create(title, { type: "lines", mask: "lines", ignore: ".pen-mark", aria: "auto" });
    tl.from(split.lines, { yPercent: 105, duration: 1.3, ease: "expo.out", stagger: 0.09 }, 0);
  }
  tl.to(ins, { autoAlpha: 1, y: 0, duration: 1.1, ease: "expo.out", stagger: 0.08 }, 0.35);
  if (pen) tl.to(pen, { drawSVG: "100%", duration: 0.9, ease: "power2.inOut" }, 0.95);

  // Ao rolar, o texto sobe devagar e esmaece por cima da poeira.
  const inner = hero.querySelector<HTMLElement>("[data-hero-inner]");
  if (inner) {
    gsap.to(inner, {
      yPercent: -14,
      autoAlpha: 0.15,
      ease: "none",
      scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: true },
    });
  }
}

async function heroParticles() {
  const hero = document.querySelector<HTMLElement>("[data-hero]");
  const canvas = hero?.querySelector<HTMLCanvasElement>("[data-gl]");
  if (!hero || !canvas) return;
  const words: string[] = JSON.parse(canvas.dataset.words || "[]");
  // O Three.js vem num pacote à parte: o texto do hero não espera por ele.
  const { initParticles } = await import("./particles");
  const scene = await initParticles({ hero, canvas, words, reduced });
  if (!scene || reduced) return;
  ScrollTrigger.create({
    trigger: hero,
    start: "top top",
    end: "bottom top",
    scrub: 0.6,
    onUpdate: (self) => scene.setScatter(self.progress),
  });
}

function marquee() {
  const track = document.querySelector<HTMLElement>("[data-marquee-track]");
  if (!track || reduced) return;
  const loop = gsap.to(track, { xPercent: -50, duration: 46, ease: "none", repeat: -1 });
  // A faixa acelera com a rolagem e inverte quando a pessoa sobe.
  let dir = 1;
  ScrollTrigger.create({
    start: 0,
    end: "max",
    onUpdate: (self) => {
      const v = self.getVelocity();
      if (self.direction !== dir) dir = self.direction;
      gsap.to(loop, {
        timeScale: dir * (1 + Math.min(Math.abs(v) / 260, 6)),
        duration: 0.25,
        overwrite: true,
        onComplete: () => {
          gsap.to(loop, { timeScale: dir, duration: 1.2, ease: "power2.out" });
        },
      });
    },
  });
}

function manifesto() {
  const text = document.querySelector<HTMLElement>("[data-manifesto-text]");
  const section = document.querySelector<HTMLElement>("[data-manifesto]");
  if (!text || !section || reduced) return;
  const split = SplitText.create(text, { type: "words", aria: "auto" });
  const mm = gsap.matchMedia();
  mm.add("(min-width: 900px)", () => {
    gsap.fromTo(
      split.words,
      { opacity: 0.13 },
      {
        opacity: 1,
        stagger: 0.1,
        ease: "none",
        scrollTrigger: { trigger: section, start: "top top", end: "+=110%", scrub: true, pin: true },
      },
    );
  });
  mm.add("(max-width: 899px)", () => {
    gsap.fromTo(
      split.words,
      { opacity: 0.13 },
      {
        opacity: 1,
        stagger: 0.1,
        ease: "none",
        scrollTrigger: { trigger: text, start: "top 78%", end: "bottom 42%", scrub: true },
      },
    );
  });
}

function reveals() {
  if (reduced) return;
  ScrollTrigger.batch("[data-reveal]", {
    start: "top 88%",
    once: true,
    onEnter: (batch) =>
      gsap.to(batch, { opacity: 1, y: 0, duration: 1.1, ease: "expo.out", stagger: 0.08, overwrite: true }),
  });
}

function penMarks() {
  if (reduced) return;
  document.querySelectorAll<SVGPathElement>("[data-pen-draw]").forEach((path) => {
    if (path.closest("[data-hero]")) return; // o hero desenha a dele na entrada
    gsap.fromTo(
      path,
      { drawSVG: "0%" },
      {
        drawSVG: "100%",
        duration: 1.2,
        ease: "power2.inOut",
        scrollTrigger: { trigger: path.closest("svg") ?? path, start: "top 82%" },
      },
    );
  });
}

function steps() {
  const list = document.querySelector<HTMLElement>("[data-steps]");
  if (!list) return;
  const bar = list.querySelector<HTMLElement>("[data-steps-progress]");
  if (reduced) return;
  if (bar) {
    gsap.to(bar, {
      scaleY: 1,
      ease: "none",
      scrollTrigger: { trigger: list, start: "top 62%", end: "bottom 62%", scrub: true },
    });
  }
  list.querySelectorAll<HTMLElement>("[data-step]").forEach((step) => {
    ScrollTrigger.create({ trigger: step, start: "top 62%", toggleClass: "is-active" });
  });
}

function card() {
  const el = document.querySelector<HTMLElement>("[data-card]");
  if (!el || reduced) return;
  gsap.fromTo(
    el,
    { rotate: -6, y: 60 },
    {
      rotate: 2,
      y: -30,
      ease: "none",
      scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
    },
  );
}

function counters() {
  if (reduced) return;
  document.querySelectorAll<HTMLElement>("[data-count]").forEach((el) => {
    const raw = el.dataset.count || "";
    const target = parseInt(raw, 10);
    const suffix = raw.replace(/^\d+/, "");
    if (!Number.isFinite(target)) return;
    const obj = { v: 0 };
    el.textContent = `0${suffix}`;
    gsap.to(obj, {
      v: target,
      duration: 1.6,
      ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 88%" },
      onUpdate: () => {
        el.textContent = `${Math.round(obj.v)}${suffix}`;
      },
    });
  });
}

function magnetic() {
  if (reduced || !finePointer) return;
  document.querySelectorAll<HTMLElement>("[data-magnetic]").forEach((el) => {
    const xTo = gsap.quickTo(el, "x", { duration: 0.5, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3.out" });
    el.addEventListener("pointermove", (e) => {
      const r = el.getBoundingClientRect();
      xTo((e.clientX - (r.left + r.width / 2)) * 0.22);
      yTo((e.clientY - (r.top + r.height / 2)) * 0.32);
    });
    el.addEventListener("pointerleave", () => {
      xTo(0);
      yTo(0);
    });
  });
}

function toTop(lenis: Lenis | null) {
  document.querySelectorAll<HTMLAnchorElement>("[data-to-top]").forEach((a) => {
    a.addEventListener("click", (e) => {
      e.preventDefault();
      if (lenis) lenis.scrollTo(0, { duration: 1.6 });
      else window.scrollTo({ top: 0 });
    });
  });
}

export async function start() {
  (window as unknown as { __motionReady?: boolean }).__motionReady = true;
  // Quebra de linha certa depende da fonte: espera ela antes de dividir o texto.
  try {
    await document.fonts.ready;
  } catch {
    /* segue */
  }
  const lenis = smoothScroll();
  header();
  heroIntro();
  marquee();
  manifesto();
  reveals();
  penMarks();
  steps();
  card();
  counters();
  magnetic();
  toTop(lenis);
  void heroParticles();
  ScrollTrigger.refresh();
}

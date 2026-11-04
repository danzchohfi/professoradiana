// Hero em Three.js: milhares de partículas que escrevem uma palavra e,
// a cada poucos segundos, se desfazem e reescrevem a mesma ideia no outro
// idioma (Olá → Hello → Fluência → Fluency). É o trabalho da Diana em
// imagem: a mesma coisa dita nas duas línguas.
//
// Toda a animação roda na GPU (o vertex shader interpola origem → destino);
// a CPU só troca os dois buffers a cada palavra.
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
  PerspectiveCamera,
  Points,
  Scene,
  ShaderMaterial,
  WebGLRenderer,
} from "three";
import { gsap } from "gsap";
import { sampleWord, WORD_FONT, type Box } from "./text-points";

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uProgress;
  uniform float uScatter;
  uniform float uSize;
  uniform float uPixelRatio;
  uniform float uCamZ;
  uniform float uSwirl;
  uniform vec2 uMouse;
  uniform float uMouseOn;
  uniform float uRadius;

  attribute vec3 aFrom;
  attribute vec3 aTo;
  attribute vec3 aRand;
  attribute float aSeed;
  attribute float aAccent;
  attribute float aAmb;

  varying float vAlpha;
  varying float vAccent;

  float easeInOutCubic(float t) {
    return t < 0.5 ? 4.0 * t * t * t : 1.0 - pow(-2.0 * t + 2.0, 3.0) / 2.0;
  }

  void main() {
    // Cada partícula sai num instante um pouco diferente: a palavra se
    // desfaz em onda, não de uma vez.
    float delay = aSeed * 0.35;
    float lt = clamp((uProgress - delay) / 0.65, 0.0, 1.0);
    float e = easeInOutCubic(lt);
    vec3 p = mix(aFrom, aTo, e);
    float arc = sin(lt * 3.14159265);
    p += aRand * arc * uSwirl * (1.0 - aAmb);

    // Respiração: a palavra nunca fica parada.
    float t = uTime;
    float drift = 1.1 + aAmb * 16.0;
    p.x += sin(t * 0.9 + aSeed * 40.0) * drift;
    p.y += cos(t * 0.75 + aSeed * 27.0) * drift;
    p.z += sin(t * 0.6 + aSeed * 13.0) * (5.0 + aAmb * 34.0);

    // O cursor (ou o dedo) abre caminho entre as partículas.
    vec2 d = p.xy - uMouse;
    float dist = length(d);
    float f = (1.0 - smoothstep(0.0, uRadius, dist)) * uMouseOn;
    p.xy += (d / max(dist, 0.001)) * f * uRadius * 0.55;
    p.z += f * 70.0;

    // Ao rolar, a palavra se dissolve em poeira.
    p += aRand * uScatter * (480.0 + aSeed * 620.0);

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;

    float size = uSize * (1.0 + aAccent * 0.5);
    size *= mix(1.0, 0.7 + aSeed * 1.1, aAmb);
    gl_PointSize = size * uPixelRatio * (uCamZ / -mv.z);

    float twinkle = 0.55 + 0.45 * sin(t * 1.6 + aSeed * 60.0);
    vAlpha = mix(0.8, 0.26 * twinkle, aAmb) * (1.0 - uScatter * 0.8) * (1.0 + f * 0.5);
    vAccent = aAccent;
  }
`;

const fragmentShader = /* glsl */ `
  precision highp float;
  uniform vec3 uColor;
  uniform vec3 uAccent;
  varying float vAlpha;
  varying float vAccent;

  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c);
    if (d > 0.5) discard;
    float a = smoothstep(0.5, 0.06, d);
    vec3 col = mix(uColor, uAccent, vAccent);
    gl_FragColor = vec4(col, a * vAlpha);
  }
`;

export type ParticleHero = {
  setScatter(v: number): void;
  destroy(): void;
};

type Opts = {
  hero: HTMLElement;
  canvas: HTMLCanvasElement;
  words: string[];
  reduced: boolean;
};

export async function initParticles({ hero, canvas, words, reduced }: Opts): Promise<ParticleHero | null> {
  let renderer: WebGLRenderer;
  try {
    renderer = new WebGLRenderer({ canvas, antialias: false, alpha: true, powerPreference: "high-performance" });
  } catch {
    hero.classList.add("no-gl");
    return null;
  }

  // As palavras são desenhadas com a Fraunces: espera a fonte (com os acentos).
  try {
    await document.fonts.load(`italic 520 100px ${WORD_FONT}`, words.join(" "));
  } catch {
    /* segue com a fonte de reserva */
  }

  const small = window.matchMedia("(max-width: 700px)").matches;
  const lowPower = (navigator.hardwareConcurrency || 8) <= 4;
  const nWord = small || lowPower ? 4200 : 9000;
  const nAmb = small ? 420 : 1100;
  const N = nWord + nAmb;
  const dpr = Math.min(window.devicePixelRatio || 1, small ? 1.75 : 2);

  const scene = new Scene();
  const fov = 35;
  const camera = new PerspectiveCamera(fov, 1, 1, 6000);

  const geometry = new BufferGeometry();
  const aFrom = new Float32Array(N * 3);
  const aTo = new Float32Array(N * 3);
  const aRand = new Float32Array(N * 3);
  const aSeed = new Float32Array(N);
  const aAccent = new Float32Array(N);
  const aAmb = new Float32Array(N);

  for (let i = 0; i < N; i++) {
    // Direção aleatória na esfera, com raio variado.
    const u = Math.random() * 2 - 1;
    const th = Math.random() * Math.PI * 2;
    const r = 0.35 + Math.random() * 0.65;
    const s = Math.sqrt(1 - u * u);
    aRand[i * 3] = s * Math.cos(th) * r;
    aRand[i * 3 + 1] = s * Math.sin(th) * r;
    aRand[i * 3 + 2] = u * r;
    aSeed[i] = Math.random();
    const amb = i >= nWord;
    aAmb[i] = amb ? 1 : 0;
    aAccent[i] = Math.random() < (amb ? 0.05 : 0.075) ? 1 : 0;
  }

  const fromAttr = new BufferAttribute(aFrom, 3);
  const toAttr = new BufferAttribute(aTo, 3);
  geometry.setAttribute("position", new BufferAttribute(new Float32Array(N * 3), 3));
  geometry.setAttribute("aFrom", fromAttr);
  geometry.setAttribute("aTo", toAttr);
  geometry.setAttribute("aRand", new BufferAttribute(aRand, 3));
  geometry.setAttribute("aSeed", new BufferAttribute(aSeed, 1));
  geometry.setAttribute("aAccent", new BufferAttribute(aAccent, 1));
  geometry.setAttribute("aAmb", new BufferAttribute(aAmb, 1));

  const uniforms = {
    uTime: { value: 0 },
    uProgress: { value: reduced ? 1 : 0 },
    uScatter: { value: 0 },
    uSize: { value: small ? 2.1 : 2.5 },
    uPixelRatio: { value: dpr },
    uCamZ: { value: 1000 },
    uSwirl: { value: small ? 70 : 130 },
    uMouse: { value: { x: 9999, y: 9999 } },
    uMouseOn: { value: 0 },
    uRadius: { value: small ? 80 : 130 },
    uColor: { value: new Color("#f4efe6") },
    uAccent: { value: new Color("#ff6a4d") },
  };

  const material = new ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms,
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
  });

  const points = new Points(geometry, material);
  points.frustumCulled = false;
  scene.add(points);

  let W = 0;
  let H = 0;
  let targets: Float32Array[] = [];
  let index = 0;
  let cycle: gsap.core.Tween | gsap.core.Timeline | null = null;

  // Onde a palavra cabe: entre o cabeçalho e o bloco de texto do hero.
  function wordBox(): Box {
    const heroRect = hero.getBoundingClientRect();
    const copy = hero.querySelector<HTMLElement>("[data-hero-copy]");
    const copyTop = copy ? copy.getBoundingClientRect().top - heroRect.top : H * 0.55;
    const top = 84;
    const bottom = copyTop - 18;
    const width = Math.min(W * (small ? 0.9 : 0.86), 1240);
    let height = bottom - top;
    let boxTop = top;
    if (height < H * 0.2) {
      // Tela baixa (celular deitado): a palavra fica atrás do texto.
      boxTop = H * 0.08;
      height = H * 0.5;
    }
    return { left: (W - width) / 2, top: boxTop, width, height };
  }

  function writeSlice(dst: Float32Array, src: Float32Array) {
    dst.set(src.subarray(0, nWord * 3), 0);
  }

  function scatterAmbient() {
    for (let i = nWord; i < N; i++) {
      const x = (Math.random() - 0.5) * W * 1.15;
      const y = (Math.random() - 0.5) * H * 1.15;
      const z = -420 + Math.random() * 520;
      aFrom[i * 3] = aTo[i * 3] = x;
      aFrom[i * 3 + 1] = aTo[i * 3 + 1] = y;
      aFrom[i * 3 + 2] = aTo[i * 3 + 2] = z;
    }
  }

  function layout() {
    const rect = hero.getBoundingClientRect();
    W = Math.max(1, Math.round(rect.width));
    H = Math.max(1, Math.round(rect.height));
    renderer.setPixelRatio(dpr);
    renderer.setSize(W, H, false);
    camera.aspect = W / H;
    // Distância em que 1 unidade de mundo = 1 px CSS no plano z = 0.
    const z = H / 2 / Math.tan((fov * Math.PI) / 360);
    camera.position.set(0, 0, z);
    camera.near = 1;
    camera.far = z + 3000;
    camera.updateProjectionMatrix();
    uniforms.uCamZ.value = z;

    const box = wordBox();
    targets = words.map((w) => sampleWord(w, box, W, H, nWord));
    scatterAmbient();
  }

  function render() {
    renderer.render(scene, camera);
  }

  function snapTo(i: number) {
    writeSlice(aFrom, targets[i]);
    writeSlice(aTo, targets[i]);
    fromAttr.needsUpdate = true;
    toAttr.needsUpdate = true;
    uniforms.uProgress.value = 1;
  }

  function morph(next: number, duration: number) {
    writeSlice(aFrom, targets[index]);
    writeSlice(aTo, targets[next]);
    fromAttr.needsUpdate = true;
    toAttr.needsUpdate = true;
    index = next;
    uniforms.uProgress.value = 0;
    return gsap.to(uniforms.uProgress, { value: 1, duration, ease: "none" });
  }

  function startCycle() {
    cycle?.kill();
    const tl = gsap.timeline({ repeat: -1, delay: 2.4 });
    tl.add(() => {
      morph((index + 1) % targets.length, 2.1);
    });
    tl.to({}, { duration: 2.1 + 2.6 });
    cycle = tl;
  }

  layout();

  if (reduced) {
    snapTo(0);
    render();
  } else {
    // Entrada: as partículas chegam de longe e escrevem a primeira palavra.
    for (let i = 0; i < nWord; i++) {
      aFrom[i * 3] = aRand[i * 3] * W * 0.9;
      aFrom[i * 3 + 1] = aRand[i * 3 + 1] * H * 0.9;
      aFrom[i * 3 + 2] = aRand[i * 3 + 2] * 900 - 300;
    }
    writeSlice(aTo, targets[0]);
    fromAttr.needsUpdate = true;
    toAttr.needsUpdate = true;
    index = 0;
    gsap.to(uniforms.uProgress, { value: 1, duration: 2.8, ease: "power1.out", delay: 0.15, onComplete: startCycle });
  }

  // Cursor / toque.
  let mouseTarget = { x: 9999, y: 9999 };
  let mouseOn = 0;
  function onPointer(e: PointerEvent) {
    const r = hero.getBoundingClientRect();
    const inside = e.clientY >= r.top && e.clientY <= r.bottom;
    mouseOn = inside ? 1 : 0;
    mouseTarget = { x: e.clientX - r.left - W / 2, y: -(e.clientY - r.top - H / 2) };
  }
  function onLeave() {
    mouseOn = 0;
  }
  if (!reduced) {
    window.addEventListener("pointermove", onPointer, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
  }

  // Só desenha enquanto o hero está na tela e a aba está visível.
  let visible = true;
  const io = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (cycle) visible ? cycle.resume() : cycle.pause();
  });
  io.observe(hero);

  let elapsed = 0;
  const tick = (_t: number, deltaMs: number) => {
    if (!visible || document.hidden || reduced) return;
    elapsed += Math.min(deltaMs, 50) / 1000;
    uniforms.uTime.value = elapsed;
    const m = uniforms.uMouse.value;
    m.x += (mouseTarget.x - m.x) * 0.12;
    m.y += (mouseTarget.y - m.y) * 0.12;
    uniforms.uMouseOn.value += (mouseOn - uniforms.uMouseOn.value) * 0.08;
    render();
  };
  gsap.ticker.add(tick);

  // Redimensionamento: recalcula as palavras. Ignora o vaivém da barra de
  // endereço do celular (só a altura mexendo pouco).
  let lastW = W;
  let lastH = H;
  let resizeTimer = 0;
  const ro = new ResizeObserver(() => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
      const r = hero.getBoundingClientRect();
      if (Math.round(r.width) === lastW && Math.abs(Math.round(r.height) - lastH) < 120) return;
      lastW = Math.round(r.width);
      lastH = Math.round(r.height);
      gsap.killTweensOf(uniforms.uProgress);
      layout();
      snapTo(index);
      if (reduced) render();
      else startCycle();
    }, 180);
  });
  ro.observe(hero);

  return {
    setScatter(v: number) {
      uniforms.uScatter.value = v;
    },
    destroy() {
      cycle?.kill();
      gsap.ticker.remove(tick);
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("pointermove", onPointer);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    },
  };
}

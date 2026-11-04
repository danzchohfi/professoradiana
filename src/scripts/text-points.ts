// Amostra uma palavra desenhada num canvas 2D e devolve `count` pontos
// (x, y, z) em coordenadas de mundo: 1 unidade = 1 px CSS, origem no centro
// da tela, y para cima. Todas as palavras saem com o MESMO número de pontos
// para que as partículas possam viajar de uma para a outra.

export type Box = { left: number; top: number; width: number; height: number };

export const WORD_FONT = '"Fraunces Variable", Georgia, serif';

export function sampleWord(word: string, box: Box, viewW: number, viewH: number, count: number, depth = 18): Float32Array {
  const bw = Math.max(1, Math.floor(box.width));
  const bh = Math.max(1, Math.floor(box.height));
  const cv = document.createElement("canvas");
  cv.width = bw;
  cv.height = bh;
  const ctx = cv.getContext("2d", { willReadFrequently: true });
  const out = new Float32Array(count * 3);
  if (!ctx) return out;

  // Mede em 100px e escala para caber na caixa, nas duas dimensões.
  ctx.font = `italic 520 100px ${WORD_FONT}`;
  const m = ctx.measureText(word);
  const asc = m.actualBoundingBoxAscent || 72;
  const desc = m.actualBoundingBoxDescent || 22;
  const left = m.actualBoundingBoxLeft || 0;
  const right = m.actualBoundingBoxRight || m.width;
  const inkW = left + right;
  const scale = Math.min((bw * 0.96) / inkW, (bh * 0.96) / (asc + desc));
  const size = 100 * scale;

  ctx.font = `italic 520 ${size}px ${WORD_FONT}`;
  ctx.fillStyle = "#fff";
  ctx.textBaseline = "alphabetic";
  const x = (bw - inkW * scale) / 2 + left * scale;
  const y = (bh - (asc + desc) * scale) / 2 + asc * scale;
  ctx.fillText(word, x, y);

  const data = ctx.getImageData(0, 0, bw, bh).data;

  let filled = 0;
  for (let i = 3; i < data.length; i += 4) if (data[i] > 128) filled++;
  const step = Math.max(1, Math.floor(Math.sqrt(filled / (count * 1.15))));

  const pts: number[] = [];
  for (let py = 0; py < bh; py += step) {
    for (let px = 0; px < bw; px += step) {
      if (data[(py * bw + px) * 4 + 3] > 128) {
        pts.push(px + Math.random() * step, py + Math.random() * step);
      }
    }
  }

  const n = pts.length / 2;
  if (n === 0) return out;

  // Embaralha (Fisher–Yates nos pares) para que cada partícula ganhe um
  // destino aleatório: é isso que faz a troca de palavra "explodir" bonito.
  for (let i = n - 1; i > 0; i--) {
    const j = (Math.random() * (i + 1)) | 0;
    const ax = pts[i * 2], ay = pts[i * 2 + 1];
    pts[i * 2] = pts[j * 2];
    pts[i * 2 + 1] = pts[j * 2 + 1];
    pts[j * 2] = ax;
    pts[j * 2 + 1] = ay;
  }

  for (let i = 0; i < count; i++) {
    const k = i < n ? i : (Math.random() * n) | 0;
    const jitter = i < n ? 0 : step * 0.5;
    const px = pts[k * 2] + (Math.random() - 0.5) * jitter;
    const py = pts[k * 2 + 1] + (Math.random() - 0.5) * jitter;
    out[i * 3] = box.left + px - viewW / 2;
    out[i * 3 + 1] = -(box.top + py - viewH / 2);
    out[i * 3 + 2] = (Math.random() - 0.5) * depth;
  }
  return out;
}

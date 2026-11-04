# professoradiana.com

Site institucional da **Professora Diana** (Diana Zollinger) — consultoria de idiomas:
inglês para executivos e empresas, português para estrangeiros, preparação para
TOEFL/TOEIC/Cambridge e tradução. Português em `/`, inglês em `/en/`.

Sem formulário, sem newsletter, sem captura de nome/e-mail: o contato é por
WhatsApp e e-mail, direto.

## Stack

| | |
|---|---|
| **Astro 7** | Site estático (HTML pronto no build, zero framework no navegador). |
| **Three.js** | Hero: ~9 mil partículas (4 mil no celular) escrevem "Olá → Hello → Fluência → Fluency". Morph inteiro na GPU (shader); o cursor/dedo abre caminho; a palavra vira poeira ao rolar. Carrega à parte, depois do texto. |
| **GSAP 3.15** | ScrollTrigger, SplitText e DrawSVG (gratuitos desde a 3.13): entrada do título por linha, manifesto que acende palavra por palavra, traços de "caneta vermelha" desenhados à mão, faixa que acelera com a rolagem, linha do método, contadores, botões magnéticos. |
| **Lenis** | Rolagem suave, sincronizada com o ScrollTrigger. |
| **Fontes** | Fraunces (variável, eixos SOFT/WONK) + Inter, servidas do próprio site. |

Acessibilidade: com "reduzir movimento" ligado no sistema nada anima (a palavra
de partículas fica parada); sem JavaScript tudo aparece; WebGL indisponível cai
numa palavra em CSS. HTML semântico, `hreflang` PT/EN, JSON-LD
(`ProfessionalService` + `Person`), sitemap e imagens de compartilhamento por idioma.

## Identidade

Tinta (`#0e1524`) + papel (`#f4efe6`) + **caneta vermelha** (`#e2462c`) — o gesto
da professora que corrige. A caneta só aparece em marcas desenhadas à mão
(sublinhado, círculo, visto ✓) e em detalhes pontuais.

- Marca: "D" itálico da Fraunces com o visto vermelho — `brand/marca-d.svg`, `public/favicon.svg`.
- Imagens de compartilhamento: `public/og.png` (PT) e `public/og-en.png` (EN).
  Para regerar (precisa de Playwright com Chromium): `npm run imagens`.

## Rodar

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # gera dist/
npm run preview
```

## Onde mexer

- **Textos (PT e EN):** `src/i18n/content.ts` — um arquivo, os dois idiomas.
- **WhatsApp, e-mail, Facebook:** `src/data/site.ts` — único lugar. WhatsApp vazio = o botão não aparece.
- **Foto da Diana:** salve como `src/assets/diana.jpg` (ou `.png`/`.webp`). O build gera AVIF/WebP em
  vários tamanhos e aplica o duotone da marca (preto → tinta, branco → papel), o que deixa uma foto de
  celular com cara de retrato editorial. Sem foto, a ficha mostra o monograma "DZ".
- **Cores e tipografia:** `src/styles/global.css` (tokens no `:root`).

## Pendências — confirmar com a Diana antes de apontar o domínio

1. **WhatsApp** (número com DDI e DDD) → `src/data/site.ts`. Hoje o site só oferece e-mail.
2. **E-mail**: `contato@professoradiana.com` é um palpite sobre o domínio dela; confirmar a caixa.
3. **"Mais de 30 anos"** de ensino (hero, sobre, números): vem de um perfil público que bate com a
   formação dela, mas não foi confirmado por ela.
4. **Foto** para a ficha (ver acima).
5. **Copy**: o método em 4 passos, os formatos (online / presencial em São Paulo / in company) e a
   frase "Ninguém deveria se sentir menor por estar falando outra língua" foram escritos para ela
   aprovar — não são citação dela.
6. **Domínio**: `professoradiana.com` está estacionado no WordPress.com. Para publicar, o DNS
   precisa apontar para a Vercel (ou onde o site for hospedado).

## Publicar

Saída 100% estática (`dist/`). Na Vercel, o preset Astro é detectado sozinho (`vercel.json`
só acrescenta cache longo para `/_astro/*` e cabeçalhos básicos de segurança).

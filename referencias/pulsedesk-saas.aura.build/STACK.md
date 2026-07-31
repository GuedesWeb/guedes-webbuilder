# Stack — Pulsedesk

- **Tailwind CSS 3.4.17** — framework CSS utility-first via runtime no navegador (cdn.tailwindcss.com), responsável por todo o layout e estilização.
- **Three.js r160** — biblioteca WebGL 3D usada no fundo animado do herói (light trails fluindo sobre um piso curvo), carregada como módulo ES via importmap.
- **Three.js postprocessing (EffectComposer, RenderPass, UnrealBloomPass, ShaderPass, SMAAPass, OutputPass)** — pipeline de pós-processamento que aplica bloom, anti-aliasing SMAA e um shader de blur de primeiro plano à cena WebGL.
- **Iconify (iconify-icon 2.1.0)** — runtime de ícones que renderiza os elementos `<iconify-icon>` (ícones do conjunto Solar usados em botões e CTAs).
- **Geist** — fonte do Google Fonts usada no texto de corpo (classe `.font-geist`).
- **Plus Jakarta Sans** — fonte do Google Fonts usada nos títulos (classe `.font-jakarta`).
- **IntersectionObserver API** — API nativa do navegador usada para o scroll-reveal das seções (fade + slide ao entrar na viewport).
- **GLSL** — shaders customizados de vértice e fragmento escritos para as trilhas de luz e o blur de primeiro plano na cena Three.js.

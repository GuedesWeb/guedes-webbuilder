const TEMPLATES = {
  landing: `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title data-editable="seo-title">Sua Empresa</title>
<meta name="description" content="Domine seu corpo e mente com o poder do Pilates. Agende uma aula experimental." data-editable="seo-description">
<link rel="icon" href="https://pilatesamandacarvalho.com.br/wp-content/uploads/2026/03/cropped-FAVICON-32x32.png" data-editable="favicon">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Work+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet">

<style>
:root {
  --cor-fundo: #FBF7F2;
  --cor-superficie: #FFFFFF;
  --cor-escuro: #3A2D28;
  --cor-medio: #5C4033;
  --cor-acento: #C17B5E;
  --cor-texto: #2C2420;
  --cor-texto-suave: #7A6E66;
  --cor-borda: #E8E0D8;
  --sombra-sm: 0 1px 3px rgba(58,45,40,.06);
  --sombra-md: 0 8px 30px rgba(58,45,40,.08);
  --sombra-lg: 0 20px 60px rgba(58,45,40,.10);
  --raio: 12px;
  --fonte-display: 'Cormorant Garamond', Georgia, serif;
  --fonte-corpo: 'Work Sans', system-ui, sans-serif;
}

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth;overflow-x:hidden}
body{font-family:var(--fonte-corpo);color:var(--cor-texto);background:var(--cor-fundo);line-height:1.6;overflow-x:hidden;font-weight:400;font-size:16px;-webkit-font-smoothing:antialiased}
img{max-width:100%;height:auto;display:block}
a{text-decoration:none;color:inherit}
ul{list-style:none}

.container{max-width:1200px;margin:0 auto;padding:0 24px}
.section{padding:80px 0}
@media(max-width:768px){.section{padding:56px 0}}

.display{font-family:var(--fonte-display);font-weight:600;letter-spacing:-.01em;line-height:1.12}

.btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:14px 36px;border-radius:100px;font-family:var(--fonte-corpo);font-weight:600;font-size:14px;letter-spacing:.01em;cursor:pointer;transition:all .3s cubic-bezier(.4,0,.2,1);border:none;white-space:nowrap}
.btn-primary{background:var(--cor-medio);color:#fff}
.btn-primary:hover{background:var(--cor-escuro);transform:translateY(-2px);box-shadow:0 8px 25px rgba(92,64,51,.3)}
.btn-accent{background:var(--cor-acento);color:#fff}
.btn-accent:hover{background:#b06e52;transform:translateY(-2px);box-shadow:0 8px 25px rgba(193,123,94,.35)}
@media(max-width:768px){.btn{width:100%;padding:16px 24px;font-size:15px}}

/* HEADER */
.header{position:fixed;top:0;left:0;right:0;z-index:100;padding:20px 0;transition:all .35s}
.header.scrolled{background:rgba(251,247,242,.9);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);padding:10px 0;box-shadow:0 1px 0 var(--cor-borda)}
.header .container{display:flex;align-items:center;justify-content:space-between}
.logo-img{height:44px;width:auto}
.nav{display:flex;align-items:center;gap:36px}
.nav a{font-size:14px;font-weight:500;color:var(--cor-texto);transition:color .25s;position:relative}
.nav a::after{content:'';position:absolute;bottom:-4px;left:0;width:0;height:2px;background:var(--cor-acento);transition:width .25s}
.nav a:hover::after{width:100%}
.nav a:hover{color:var(--cor-acento)}
.menu-btn{display:none;background:none;border:none;cursor:pointer;padding:4px;width:40px;height:40px;position:relative;z-index:101}
.menu-btn span{display:block;width:24px;height:2px;background:var(--cor-escuro);border-radius:2px;position:absolute;left:8px;top:19px;transition:all .3s}
.menu-btn::before,.menu-btn::after{content:'';display:block;width:24px;height:2px;background:var(--cor-escuro);border-radius:2px;position:absolute;left:8px;transition:all .3s}
.menu-btn::before{top:12px}.menu-btn::after{bottom:12px}
.menu-btn.active::before{top:19px;transform:rotate(45deg)}.menu-btn.active::after{bottom:19px;transform:rotate(-45deg)}.menu-btn.active span{opacity:0}
@media(max-width:768px){
.nav{display:none;position:fixed;top:0;left:0;right:0;bottom:0;background:var(--cor-superficie);flex-direction:column;justify-content:center;gap:32px;z-index:100}.nav.active{display:flex}.nav a{font-size:20px}.menu-btn{display:block}
}

/* HERO */
.hero{position:relative;min-height:80vh;display:flex;align-items:center;justify-content:center;overflow:hidden;background:var(--cor-fundo)}
/* Imagens decorativas laterais */
.hero-img{position:absolute;top:0;width:50%;height:100%;object-fit:cover;object-position:center;filter:saturate(0.4) brightness(1.05) contrast(0.9);opacity:.5;mix-blend-mode:luminosity;pointer-events:none}
.hero-img.left{left:0;mask-image:linear-gradient(to right,black 25%,transparent 100%);-webkit-mask-image:linear-gradient(to right,black 25%,transparent 100%)}
.hero-img.right{right:0;mask-image:linear-gradient(to left,black 25%,transparent 100%);-webkit-mask-image:linear-gradient(to left,black 25%,transparent 100%)}
/* Overlay suave branco/creme */
.hero::after{content:'';position:absolute;inset:0;background:rgba(255,255,255,.5);z-index:1;pointer-events:none}
/* Glow central */
.hero-glow{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:60%;height:70%;background:radial-gradient(ellipse at center,rgba(255,255,255,.7) 0%,transparent 70%);z-index:1;pointer-events:none}
/* Conteúdo central */
.hero .container{position:relative;z-index:2;display:flex;flex-direction:column;align-items:center;text-align:center;gap:24px;padding:0 24px}
.hero-logo{width:27%;min-width:180px;margin-bottom:8px}
.hero h2{font-size:clamp(24px,3.5vw,32px);font-weight:400;color:var(--cor-texto);max-width:700px;line-height:1.3}
.hero .btn{margin-top:8px;font-size:18px;padding:16px 48px;border:3px solid #fff}
@media(max-width:768px){.hero{min-height:85vh}.hero-img{width:100%;opacity:.3;filter:saturate(0.4) brightness(1.05) contrast(0.9);mix-blend-mode:luminosity}.hero-img.left{mask-image:linear-gradient(to bottom,black 20%,transparent 80%);-webkit-mask-image:linear-gradient(to bottom,black 20%,transparent 80%)}.hero-img.right{display:none}.hero-logo{width:55%;min-width:140px}.hero h2 br{display:none}.hero .btn{font-size:14px;padding:14px 28px;width:auto}}

/* "O QUE VOCÊ BUSCA?" */
.busca-section{background:var(--cor-superficie)}
.busca-section .container{text-align:center}
.busca-title{font-size:clamp(28px,3.5vw,40px);font-weight:500;color:var(--cor-escuro);margin-bottom:40px}
.cards-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:20px}
.card-busca{padding:280px 16px 32px;background-size:cover;background-position:top center;background-repeat:no-repeat;border-radius:var(--raio);box-shadow:var(--sombra-sm);text-align:center;transition:all .3s}
.card-busca:hover{transform:translateY(-4px);box-shadow:var(--sombra-md)}
.card-busca h3{font-family:var(--fonte-display);font-size:22px;font-weight:600;color:var(--cor-escuro);margin-bottom:4px}
.card-busca p{font-size:15px;color:var(--cor-texto-suave);line-height:1.4}
@media(max-width:768px){.cards-grid{grid-template-columns:1fr 1fr;gap:10px}.card-busca{padding:200px 12px 20px}.card-busca h3{font-size:17px}.card-busca p{font-size:12px}}

/* CTA */
.cta-block{background:var(--cor-escuro);padding:80px 0;text-align:center;position:relative;overflow:hidden}
.cta-block::before{content:'';position:absolute;top:-50%;left:-50%;width:200%;height:200%;background:radial-gradient(circle at 30% 70%,rgba(193,123,94,.08) 0%,transparent 50%);pointer-events:none}
.cta-block .container{position:relative;z-index:1;display:flex;flex-direction:column;align-items:center;gap:24px}
.cta-block h2{font-size:clamp(24px,3.5vw,36px);color:#fff;font-weight:400;max-width:600px}
.cta-block .btn{background:#fff;color:var(--cor-escuro);font-size:18px;padding:16px 48px;border:3px solid #fff}
.cta-block .btn:hover{background:var(--cor-fundo);box-shadow:0 8px 30px rgba(0,0,0,.2)}
@media(max-width:768px){.cta-block h2{font-size:22px}.cta-block .btn{font-size:15px;padding:16px 24px}}

/* "ALÉM DISSO..." */
.aulas-section{background:var(--cor-superficie)}
.aulas-title{text-align:center;font-size:clamp(24px,3.5vw,36px);font-weight:500;color:var(--cor-escuro);margin-bottom:40px}
.aulas-grid{display:grid;grid-template-columns:repeat(4,1fr);grid-template-rows:auto auto;gap:0}
.aulas-grid img{width:100%;height:300px;object-fit:cover}
.aulas-texto{background:var(--cor-escuro);color:#fff;padding:32px 24px;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center}
.aulas-texto h3{font-family:var(--fonte-display);font-size:22px;font-weight:600;margin-bottom:6px}
.aulas-texto p{font-size:13px;line-height:1.7;opacity:.9}
@media(max-width:768px){.aulas-grid{grid-template-columns:1fr}.aulas-grid img{height:220px;width:100%}.aulas-texto{padding:24px 20px}.aulas-texto h3{font-size:18px}.aulas-texto p{font-size:13px}}

/* CARROSSEL */
.espaco-section{background:var(--cor-superficie)}
.espaco-title{text-align:center;font-size:clamp(28px,3.5vw,40px);font-weight:500;color:var(--cor-escuro);margin-bottom:40px}
.carousel{overflow:hidden;position:relative;max-width:100%}
.carousel-track{display:flex;transition:transform .5s ease}
.carousel-slide{flex:0 0 calc(100%/3);padding:0 6px}
.carousel-slide img{width:100%;aspect-ratio:3/4;object-fit:cover;border-radius:var(--raio)}
.carousel-dots{display:flex;justify-content:center;gap:8px;margin-top:24px}
.carousel-dot{width:10px;height:10px;border-radius:50%;background:var(--cor-borda);border:none;cursor:pointer;transition:all .3s}
.carousel-dot.active{background:var(--cor-acento);width:28px;border-radius:5px}
@media(max-width:768px){.carousel-slide{flex:0 0 100%}}

/* DIFERENCIAIS */
.dif-section .container{max-width:700px}
.dif-list{display:flex;flex-direction:column;gap:8px}
.dif-item{display:flex;align-items:center;gap:10px;font-size:16px;color:var(--cor-texto);padding:8px 0;border-bottom:1px solid var(--cor-borda)}
.dif-dot{width:7px;height:7px;border-radius:50%;background:var(--cor-acento);flex-shrink:0}
@media(max-width:768px){.dif-item{font-size:14px}}

/* DEPOIMENTOS */
.depoimentos{background:var(--cor-superficie)}
.depo-header{text-align:center;margin-bottom:40px}
.depo-header .titulo{font-family:var(--fonte-display);font-size:24px;font-weight:400;color:var(--cor-texto)}
.depo-header .subtitulo{font-size:clamp(28px,3.5vw,40px);font-weight:500;color:var(--cor-escuro)}
.depo-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
.depo-card{background:var(--cor-fundo);padding:28px 24px;border-radius:var(--raio);border:1px solid var(--cor-borda);transition:all .3s}
.depo-card:hover{box-shadow:var(--sombra-md)}
.depo-stars{color:#D4A853;font-size:14px;letter-spacing:2px;margin-bottom:12px}
.depo-card blockquote{font-size:14px;line-height:1.7;color:var(--cor-texto-suave);font-style:italic;margin-bottom:16px}
.depo-autor{display:flex;align-items:center;gap:10px}
.depo-avatar{width:36px;height:36px;border-radius:50%;background:var(--cor-medio);display:flex;align-items:center;justify-content:center;color:#fff;font-weight:600;font-size:13px;flex-shrink:0}
.depo-nome{font-weight:600;font-size:13px;color:var(--cor-texto)}
@media(max-width:768px){.depo-grid{grid-template-columns:1fr}}

/* POR QUE */
.porque-section{min-height:500px;display:flex;align-items:center;background:var(--cor-escuro);padding:80px 0}
.porque-section .container{max-width:700px}
.porque-label{font-size:clamp(28px,3.5vw,40px);font-weight:500;color:#fff;margin-bottom:16px}
.porque-texto{font-size:17px;color:rgba(255,255,255,.75);line-height:1.8}
@media(max-width:768px){.porque-section{min-height:400px;padding:56px 0}.porque-texto{font-size:15px}}

/* CONTATO */
.contato-section{background:var(--cor-superficie)}
.contato-header{text-align:center;margin-bottom:32px}
.contato-header .titulo{font-family:var(--fonte-display);font-size:24px;font-weight:400;color:var(--cor-texto)}
.contato-header .subtitulo{font-size:clamp(28px,3.5vw,40px);font-weight:500;color:var(--cor-escuro)}
.contato-sub{text-align:center;font-size:16px;color:var(--cor-texto-suave);margin-bottom:40px;max-width:500px;margin-left:auto;margin-right:auto;padding:0 16px}
.contato-grid{display:grid;grid-template-columns:1fr 1fr;gap:0;max-width:700px;margin:0 auto}
.contato-card{background:var(--cor-escuro);padding:48px 32px;text-align:center;color:#fff;display:flex;flex-direction:column;align-items:center;gap:12px}
.contato-card:first-child{border-radius:var(--raio) 0 0 var(--raio)}
.contato-card:last-child{border-radius:0 var(--raio) var(--raio) 0;border-left:1px solid rgba(255,255,255,.1)}
.contato-card svg{width:40px;height:40px;fill:#fff;opacity:.8}
.contato-card h3{font-family:var(--fonte-display);font-size:22px;font-weight:600}
.contato-card .btn{background:#fff;color:var(--cor-escuro);font-size:14px;margin-top:8px}
.contato-card .btn:hover{background:var(--cor-fundo)}
.contato-card p{font-size:15px;opacity:.8}
@media(max-width:768px){.contato-card{padding:40px 24px}.contato-card svg{width:32px;height:32px}}

/* LOCALIZAÇÃO */
.local-section{background:var(--cor-superficie)}
.local-section .container{text-align:center}
.local-title{font-size:clamp(28px,3.5vw,40px);font-weight:600;color:var(--cor-escuro);margin-bottom:12px}
.local-endereco{font-size:16px;color:var(--cor-texto-suave);margin-bottom:24px;padding:0 16px;word-wrap:break-word;overflow-wrap:break-word}
.mapa{line-height:0}
.mapa iframe{width:100%;height:400px;border:none}

/* INSTAGRAM */
.insta-section{text-align:left}
@media(max-width:768px){.insta-section{text-align:center}.insta-section .container>div{flex-direction:column!important;gap:32px!important;text-align:center}.insta-section .container>div>div:first-child{text-align:center}}

/* FOOTER */
.footer{background:var(--cor-escuro);padding:28px 0;text-align:center}
.footer p{font-size:13px;color:rgba(255,255,255,.5)}

/* WHATSAPP */
.wpp-float{position:fixed;bottom:24px;right:24px;z-index:999;width:56px;height:56px;background:#25D366;border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 6px 20px rgba(37,211,102,.35);transition:all .3s}
.wpp-float:hover{transform:scale(1.1)}
.wpp-float svg{width:26px;height:26px;fill:#fff}
</style>
</head>
<body>

<!-- WhatsApp número (oculto, editar na aba Textos) -->
<span data-editable="whatsapp-numero" style="display:none">5538998760323</span>

<!-- HEADER -->
<header class="header" id="header">
<div class="container">
<a href="#" class="logo-img-link"><img class="logo-img" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='376' height='143'%3E%3Crect width='376' height='143' fill='none'/%3E%3Ctext x='188' y='80' text-anchor='middle' fill='%233A2D28' font-family='Georgia,serif' font-size='36' font-weight='bold'%3ESua Logo%3C/text%3E%3C/svg%3E" alt="Logo" data-editable="logo"></a>
<nav class="nav" id="nav">
<a href="#faleconosco" data-editable="menu-1">Fale conosco</a>
<a href="#nossoespaco" data-editable="menu-2">Nosso espaço</a>
<a href="#localizacao" data-editable="menu-3">Localização</a>
</nav>
<button class="menu-btn" id="menuBtn" onclick="document.getElementById('nav').classList.toggle('active');this.classList.toggle('active')"><span></span></button>
</div>
</header>

<!-- HERO -->
<section class="hero">
<img class="hero-img left" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='600'%3E%3C/svg%3E" alt="" data-editable="hero-img-left">
<img class="hero-img right" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='600'%3E%3C/svg%3E" alt="" data-editable="hero-img-right">
<div class="hero-glow"></div>
<div class="container">
<img class="hero-logo" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='376' height='143'%3E%3Crect width='376' height='143' fill='none'/%3E%3Ctext x='188' y='80' text-anchor='middle' fill='%233A2D28' font-family='Georgia,serif' font-size='36' font-weight='bold'%3ESua Logo%3C/text%3E%3C/svg%3E" alt="Logo" data-editable="logo-hero">
<h2 data-editable="hero-headline">Domine seu corpo e mente com o poder do Pilates.</h2>
<a href="#" class="btn btn-accent" data-editable="hero-btn-link" data-editable-text="hero-btn-text">Agende uma aula experimental</a>
</div>
</section>

<!-- O QUE VOCÊ BUSCA? -->
<section class="section busca-section">
<div class="container">
<p class="busca-title display" data-editable="busca-title">O que você busca?</p>
<div class="cards-grid">
<div class="card-busca" style="background-image:url(https://pilatesamandacarvalho.com.br/wp-content/uploads/2026/03/img-new-card1.avif)" <h3 data-editable="card1-titulo">Melhorar a saúde</h3><p data-editable="card1-desc">Trabalhe o tônus muscular, flexibilidade, força e postura.</p></div>
<div class="card-busca" style="background-image:url(https://pilatesamandacarvalho.com.br/wp-content/uploads/2026/03/img-new-card2.avif)"><h3 data-editable="card2-titulo">Dê adeus ás dores</h3><p data-editable="card2-desc">Alivie o stress melhore a disposição e a auto estima.</p></div>
<div class="card-busca" style="background-image:url(https://pilatesamandacarvalho.com.br/wp-content/uploads/2026/03/card3.avif)"><h3 data-editable="card3-titulo">Qualidade de vida</h3><p data-editable="card3-desc">Tenha uma rotina sem desconforto com um corpo totalmente transformado.</p></div>
<div class="card-busca" style="background-image:url(https://pilatesamandacarvalho.com.br/wp-content/uploads/2026/03/card4.avif)"><h3 data-editable="card4-titulo">Desempenho</h3><p data-editable="card4-desc">Otimize o desempenho das atividades diárias e de outras atividades físicas.</p></div>
</div>
</div>
</section>

<!-- CTA -->
<section class="cta-block">
<div class="container">
<h2 class="display" data-editable="cta-headline">Clique no botão abaixo e agende sua aula experimental grátis</h2>
<a href="#" class="btn" data-editable="cta-link" data-editable-text="cta-btn">Agende seu horário</a>
</div>
</section>

<!-- ALÉM DISSO, NOSSAS AULAS SÃO INDICADAS PARA -->
<section class="section aulas-section">
<div class="container">
<h2 class="aulas-title display" data-editable="aulas-title">Além disso, nossas aulas são indicadas para:</h2>
<div class="aulas-grid">
<img src="https://pilatesamandacarvalho.com.br/wp-content/uploads/2026/03/img_gravida.webp" alt="Gestantes">
<div class="aulas-texto"><h3 data-editable="aulas-t1">Pós-reabilitação no Pilates</h3><p data-editable="aulas-d1">Após a liberação da fisioterapia, o Pilates é um grande aliado na continuidade do cuidado com o corpo. Trabalhamos de forma segura e personalizada para fortalecer a musculatura, melhorar a mobilidade e prevenir novas lesões, respeitando sempre os limites e a fase de cada aluno.</p></div>
<img src="https://pilatesamandacarvalho.com.br/wp-content/uploads/2026/03/img_dores.webp" alt="Idosos">
<div class="aulas-texto"><h3 data-editable="aulas-t2">Idosos</h3><p data-editable="aulas-d2">Prevenção de quedas, manutenção de força, alivio de dores, aumento da flexibilidade e melhora da postura para os alunos na melhor idade.</p></div>
<div class="aulas-texto"><h3 data-editable="aulas-t3">Gestantes</h3><p data-editable="aulas-d3">Se mantenha ativa com segurança durante a gestação e pós parto.</p></div>
<img src="https://pilatesamandacarvalho.com.br/wp-content/uploads/2026/03/img_reabilitacao.webp" alt="Dores">
<div class="aulas-texto"><h3 data-editable="aulas-t4">Dores Crônicas</h3><p data-editable="aulas-d4">Reduza a dor que te acompanha por mais de três meses, temos profissionais capacitadas para isso.</p></div>
<img src="https://pilatesamandacarvalho.com.br/wp-content/uploads/2026/03/img-new-idoso.avif" alt="Idosos">
</div>
</div>
</section>

<!-- CONHEÇA NOSSO ESPAÇO -->
<section class="section espaco-section" id="nossoespaco" style="scroll-margin-top:80px">
<div class="container">
<p class="espaco-title display" data-editable="espaco-title">Conheça nosso Espaço</p>
</div>
<div class="carousel" id="carousel">
<div class="carousel-track" id="carouselTrack">
<div class="carousel-slide"><img src="https://pilatesamandacarvalho.com.br/wp-content/uploads/2026/06/WhatsApp-Image-2026-06-08-at-22.43.09.jpeg" data-editable="galeria-1" style="width:100%;aspect-ratio:3/4;object-fit:cover;border-radius:var(--raio)"></div>
<div class="carousel-slide"><img src="https://pilatesamandacarvalho.com.br/wp-content/uploads/2026/06/WhatsApp-Image-2026-06-08-at-22.42.17-1.jpeg" data-editable="galeria-2" style="width:100%;aspect-ratio:3/4;object-fit:cover;border-radius:var(--raio)"></div>
<div class="carousel-slide"><img src="https://pilatesamandacarvalho.com.br/wp-content/uploads/2026/06/WhatsApp-Image-2026-06-08-at-22.42.17.jpeg" data-editable="galeria-3" style="width:100%;aspect-ratio:3/4;object-fit:cover;border-radius:var(--raio)"></div>
<div class="carousel-slide"><img src="https://pilatesamandacarvalho.com.br/wp-content/uploads/2026/06/WhatsApp-Image-2026-06-08-at-22.42.16-2.jpeg" data-editable="galeria-4" style="width:100%;aspect-ratio:3/4;object-fit:cover;border-radius:var(--raio)"></div>
<div class="carousel-slide"><img src="https://pilatesamandacarvalho.com.br/wp-content/uploads/2026/06/WhatsApp-Image-2026-06-08-at-22.42.16-1.jpeg" data-editable="galeria-5" style="width:100%;aspect-ratio:3/4;object-fit:cover;border-radius:var(--raio)"></div>
<div class="carousel-slide"><img src="https://pilatesamandacarvalho.com.br/wp-content/uploads/2026/06/WhatsApp-Image-2026-06-08-at-22.42.16.jpeg" data-editable="galeria-6" style="width:100%;aspect-ratio:3/4;object-fit:cover;border-radius:var(--raio)"></div>
<div class="carousel-slide"><img src="https://pilatesamandacarvalho.com.br/wp-content/uploads/2026/06/WhatsApp-Image-2026-06-08-at-22.42.15.jpeg" data-editable="galeria-7" style="width:100%;aspect-ratio:3/4;object-fit:cover;border-radius:var(--raio)"></div>
<div class="carousel-slide"><img src="https://pilatesamandacarvalho.com.br/wp-content/uploads/2026/06/WhatsApp-Image-2026-06-08-at-22.43.32.jpeg" data-editable="galeria-8" style="width:100%;aspect-ratio:3/4;object-fit:cover;border-radius:var(--raio)"></div>
</div>
</div>
<div class="carousel-dots" id="carouselDots"></div>
</section>

<!-- DIFERENCIAIS -->
<section class="section dif-section">
<div class="container">
<div class="dif-list">
<div class="dif-item"><span class="dif-dot"></span> <span data-editable="dif-1">Ambiente climatizado;</span></div>
<div class="dif-item"><span class="dif-dot"></span> <span data-editable="dif-2">Sala ampla;</span></div>
<div class="dif-item"><span class="dif-dot"></span> <span data-editable="dif-3">Estacionamento facilitado;</span></div>
<div class="dif-item"><span class="dif-dot"></span> <span data-editable="dif-4">Profissionais treinadas e altamente capacitadas;</span></div>
<div class="dif-item"><span class="dif-dot"></span> <span data-editable="dif-5">Atendimento direcionado para os seus objetivos;</span></div>
<div class="dif-item"><span class="dif-dot"></span> <span data-editable="dif-6">Equipe de 4 instrutoras;</span></div>
<div class="dif-item"><span class="dif-dot"></span> <span data-editable="dif-7">Máximo 4 alunos por instrutora no horário;</span></div>
<div class="dif-item"><span class="dif-dot"></span> <span data-editable="dif-8">Melhores aparelhos do mercado;</span></div>
<div class="dif-item"><span class="dif-dot"></span> <span data-editable="dif-9">Flexibilidade para agendamentos.</span></div>
</div>
</div>
</section>

<!-- DEPOIMENTOS -->
<section class="section depoimentos">
<div class="container">
<div class="depo-header">
<p class="titulo" data-editable="depo-label">FEEDBACKS</p>
<p class="subtitulo display" data-editable="depo-title">Veja o que os nossos alunos falam de nós</p>
</div>
<div id="reviews-widget" style="max-width:900px;margin:0 auto;min-height:60px" data-editable-html="google-reviews"></div>
</div>
</section>

<!-- PORQUE FAZER PILATES? -->
<section class="porque-section">
<div class="container">
<p class="porque-label display" data-editable="porque-label">Porque fazer pilates?</p>
<p class="porque-texto" data-editable="porque-texto">Porque seu corpo merece cuidado, atenção e movimento com propósito. O Pilates respeita seus limites, fortalece de dentro para fora, alivia dores e devolve a liberdade de se mover sem medo. Cada exercício é um convite ao autoconhecimento, ao equilíbrio e ao bem-estar, unindo corpo e mente para uma vida com mais leveza, consciência e qualidade.</p>
</div>
</section>

<!-- CONTATO -->
<section class="section contato-section" id="faleconosco" style="scroll-margin-top:80px">
<div class="container">
<div class="contato-header">
<p class="titulo" data-editable="contato-label">Contato</p>
<p class="subtitulo display" data-editable="contato-title">Fale Conosco</p>
</div>
<p class="contato-sub" data-editable="contato-sub">Entre em contato conosco em um de nossos canais de sua preferência</p>
<div class="contato-grid">
<div class="contato-card">
<svg viewBox="0 0 448 512"><path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/></svg>
<h3>WhatsApp</h3>
<a href="#" class="btn" data-editable="whatsapp-link" data-editable-text="whatsapp-btn">Agende seu horário</a>
</div>
<div class="contato-card">
<svg viewBox="0 0 512 512"><path d="M497.39 361.8l-112-48a24 24 0 0 0-28 6.9l-49.6 60.6A370.66 370.66 0 0 1 130.6 204.11l60.6-49.6a23.94 23.94 0 0 0 6.9-28l-48-112A24.16 24.16 0 0 0 122.6.61l-104 24A24 24 0 0 0 0 48c0 256.5 207.9 464 464 464a24 24 0 0 0 23.4-18.6l24-104a24.29 24.29 0 0 0-14.01-27.6z"/></svg>
<h3>Telefone</h3>
<a href="tel:+5538998760323" style="color:#fff;font-size:18px;font-weight:600" data-editable="telefone-link" data-editable-text="telefone-numero">(38) 99876-0323</a>
</div>
</div>
</div>
</section>

<!-- LOCALIZAÇÃO -->
<section class="section local-section" id="localizacao" style="padding-bottom:0;scroll-margin-top:80px">
<div class="container">
<h3 class="local-title display" data-editable="local-title">Localização</h3>
<p class="local-endereco" data-editable="local-endereco">Estamos localizados na AV PAULISTA 1159 8° ANDAR SALA 817/818 - Bela Vista, São Paulo - SP, 01311-921</p>
</div>
<div class="mapa" style="margin:0;padding:0;line-height:0"><iframe loading="lazy" id="mapaIframe" src="" style="width:100%;height:400px;border:none" title="Localização"></iframe></div>
<script>
(function(){
var endereco = document.querySelector('[data-editable="local-endereco"]');
var iframe = document.getElementById('mapaIframe');
function updateMap(){
var txt = endereco ? endereco.textContent.trim() : 'São Paulo';
iframe.src = 'https://maps.google.com/maps?q=' + encodeURIComponent(txt) + '&t=m&z=15&output=embed&iwloc=near';
}
updateMap();
if(endereco){ var obs = new MutationObserver(updateMap); obs.observe(endereco, {characterData:true, subtree:true}); }
})();
</script>
</section>

<!-- INSTAGRAM -->
<section class="section insta-section">
<div class="container">
<div style="display:flex;align-items:center;justify-content:center;gap:60px;flex-wrap:wrap">
<div style="text-align:left;flex:1;min-width:280px">
<h2 style="font-size:clamp(28px,3.5vw,44px);font-weight:600;color:var(--cor-escuro);margin-bottom:16px;line-height:1.2" data-editable="insta-hashtag">#Siga Nosso Instagram</h2>
<div style="display:inline-flex;align-items:center;gap:10px;font-family:var(--fonte-display);font-size:20px;font-weight:500;color:var(--cor-acento);margin-bottom:8px;transition:opacity .3s">
<svg width="24" height="24" viewBox="0 0 448 512" fill="currentColor"><path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8z"/></svg>
<a href="#" style="color:var(--cor-acento);font-family:var(--fonte-display);font-size:20px;font-weight:500" data-editable="insta-link" data-editable-text="insta-handle">@seuinstagram</a>
</div>
</div>
<div style="flex-shrink:0">
<div style="width:240px;background:#1a1a1a;border-radius:32px;padding:12px;box-shadow:0 0 0 2px #333,0 0 0 5px #1a1a1a,0 30px 50px rgba(0,0,0,.18)">
<div style="width:66px;height:18px;background:#1a1a1a;border-radius:0 0 12px 12px;margin:0 auto 8px"></div>
<div style="border-radius:20px;overflow:hidden;background:#fff"><img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='420'%3E%3Crect width='240' height='420' fill='%23F5F0EB'/%3E%3Ccircle cx='120' cy='150' r='45' fill='none' stroke='%235C4033' stroke-width='1' opacity='.15'/%3E%3Ctext x='120' y='230' text-anchor='middle' fill='%235C4033' font-family='sans-serif' font-size='12' opacity='.3'%3E@seuinstagram%3C/text%3E%3C/svg%3E" alt="Instagram" style="width:100%;aspect-ratio:9/19;object-fit:cover;display:block" src="https://pilatesamandacarvalho.com.br/wp-content/uploads/2026/03/img-mockup.avif" alt="Instagram" style="width:100%;aspect-ratio:9/19;object-fit:cover;display:block" data-editable="insta-mockup"></div>
</div>
</div>
</div>
<p style="text-align:center;font-size:14px;color:var(--cor-texto-suave);margin-top:32px" data-editable="footer-texto">&copy;2026 - Pilates Amanda Carvalho - Todos os direitos reservados</p>
</div>
</section>

<!-- Google Place ID — cole o ID do seu negócio -->

<a href="#" class="wpp-float" data-editable="whatsapp-float-link" title="WhatsApp"><svg viewBox="0 0 448 512"><path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/></svg></a>

<script>
window.addEventListener('scroll',()=>document.getElementById('header').classList.toggle('scrolled',window.scrollY>50));

// Unificar links do WhatsApp
(function(){
var numEl=document.querySelector('[data-editable="whatsapp-numero"]');
if(!numEl)return;
var num=numEl.textContent.replace(/\\D/g,'');
if(!num)return;
var whatsUrl='https://wa.me/'+num+'?text=Ol%C3%A1%2C%20vim%20do%20site%20e%20gostaria%20de%20mais%20informa%C3%A7%C3%B5es';
document.querySelectorAll('[data-editable="hero-btn-link"],[data-editable="cta-link"],[data-editable="whatsapp-link"],[data-editable="whatsapp-float-link"]').forEach(function(a){a.href=whatsUrl});
})();
// Google Reviews — renderiza HTML do campo google-reviews
(function(){
var el=document.querySelector('[data-editable-html="google-reviews"]');
if(el&&el.textContent.trim()){el.innerHTML=el.textContent.trim()}
})();

// Carrossel — dots e autoplay
(function(){
const t=document.getElementById('carouselTrack'),d=document.getElementById('carouselDots');
const slides=t.querySelectorAll('.carousel-slide');
slides.forEach((s,i)=>{
const dot=document.createElement('button');dot.className='carousel-dot'+(i===0?' active':'');dot.onclick=()=>goTo(i);d.appendChild(dot);
});
let cur=0;const dots=d.querySelectorAll('.carousel-dot');
function goTo(i){cur=i;t.style.transform='translateX(-'+(cur*(100/slides.length))+'%)';dots.forEach((dt,j)=>dt.classList.toggle('active',j===cur))}
setInterval(()=>goTo((cur+1)%slides.length),4000);
})();
</script>
</body>
</html>
`,
  planos: `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title data-editable="seo-title">Planos - Sua Empresa</title>
<meta name="description" content="Informações sobre planos e aulas." data-editable="seo-description">
<link rel="icon" href="https://pilatesamandacarvalho.com.br/wp-content/uploads/2026/03/cropped-FAVICON-32x32.png" data-editable="favicon">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Work+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet">

<style>
:root {
  --cor-fundo: #FBF7F2;
  --cor-superficie: #FFFFFF;
  --cor-escuro: #3A2D28;
  --cor-medio: #5C4033;
  --cor-acento: #C17B5E;
  --cor-texto: #2C2420;
  --cor-texto-suave: #7A6E66;
  --cor-borda: #E8E0D8;
  --raio: 12px;
  --fonte-display: 'Cormorant Garamond', Georgia, serif;
  --fonte-corpo: 'Work Sans', system-ui, sans-serif;
}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth;overflow-x:hidden}
body{font-family:var(--fonte-corpo);color:var(--cor-texto);background:var(--cor-fundo);line-height:1.6;overflow-x:hidden;font-weight:400;font-size:16px;-webkit-font-smoothing:antialiased}
img{max-width:100%;height:auto;display:block}
a{text-decoration:none;color:inherit}
ul{list-style:none}
.container{max-width:1200px;margin:0 auto;padding:0 24px}
.section{padding:80px 0}
@media(max-width:768px){.section{padding:56px 0}}
.display{font-family:var(--fonte-display);font-weight:600;letter-spacing:-.01em;line-height:1.12}

.btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:14px 36px;border-radius:100px;font-family:var(--fonte-corpo);font-weight:600;font-size:14px;letter-spacing:.01em;cursor:pointer;transition:all .3s cubic-bezier(.4,0,.2,1);border:none;white-space:nowrap}
.btn-primary{background:var(--cor-medio);color:#fff}
.btn-primary:hover{background:var(--cor-escuro);transform:translateY(-2px);box-shadow:0 8px 25px rgba(92,64,51,.3)}
@media(max-width:768px){.btn{width:100%;padding:16px 24px;font-size:15px}}

/* HEADER */
.header{position:fixed;top:0;left:0;right:0;z-index:100;padding:20px 0;transition:all .35s}
.header.scrolled{background:rgba(251,247,242,.9);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);padding:10px 0;box-shadow:0 1px 0 var(--cor-borda)}
.header .container{display:flex;align-items:center;justify-content:center}
.logo-img{height:44px;width:auto}

/* HERO */
.hero{position:relative;min-height:55vh;display:flex;align-items:center;justify-content:center;overflow:hidden;background:var(--cor-fundo)}
.hero-img{position:absolute;top:0;width:50%;height:100%;object-fit:cover;object-position:center;filter:saturate(0.4) brightness(1.05) contrast(0.9);opacity:.5;mix-blend-mode:luminosity;pointer-events:none}
.hero-img.left{left:0;mask-image:linear-gradient(to right,black 25%,transparent 100%);-webkit-mask-image:linear-gradient(to right,black 25%,transparent 100%)}
.hero-img.right{right:0;mask-image:linear-gradient(to left,black 25%,transparent 100%);-webkit-mask-image:linear-gradient(to left,black 25%,transparent 100%)}
.hero::after{content:'';position:absolute;inset:0;background:rgba(255,255,255,.5);z-index:1;pointer-events:none}
.hero-glow{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:60%;height:70%;background:radial-gradient(ellipse at center,rgba(255,255,255,.7) 0%,transparent 70%);z-index:1;pointer-events:none}
.hero .container{position:relative;z-index:2;text-align:center}
.hero h1{font-size:clamp(30px,4.5vw,48px);color:var(--cor-escuro);margin-bottom:8px}
.hero-arrow{font-size:36px;color:var(--cor-acento);animation:bounce 2s infinite;margin-top:32px;display:inline-block}
@keyframes bounce{0%,20%,50%,80%,100%{transform:translateY(0)}40%{transform:translateY(-20px)}60%{transform:translateY(-10px)}}
@media(max-width:768px){.hero{min-height:45vh}.hero-img{width:100%;opacity:.3;filter:saturate(0.4) brightness(1.05) contrast(0.9);mix-blend-mode:luminosity}.hero-img.left{mask-image:linear-gradient(to bottom,black 20%,transparent 80%);-webkit-mask-image:linear-gradient(to bottom,black 20%,transparent 80%)}.hero-img.right{display:none}.hero h1{font-size:28px}}

/* INFO */
.info-section{background:var(--cor-superficie)}
.info-section .container{max-width:800px}
.info-label{text-align:center;font-size:clamp(22px,2.8vw,32px);font-weight:500;color:var(--cor-escuro);margin-bottom:32px}
.info-list{display:flex;flex-direction:column;gap:16px}
.info-item{display:flex;align-items:flex-start;gap:12px;font-size:16px;color:var(--cor-texto);padding:8px 0}
.info-dot{width:7px;height:7px;border-radius:50%;background:var(--cor-acento);flex-shrink:0;margin-top:7px}

/* PLANOS */
.planos-section{background:var(--cor-superficie)}
.planos-label{text-align:center;font-size:clamp(22px,2.8vw,32px);font-weight:500;color:var(--cor-escuro);margin-bottom:40px}
.planos-grid{display:flex;gap:24px;justify-content:center;flex-wrap:wrap}
.plano-card{flex:1;min-width:280px;max-width:360px;background:var(--cor-fundo);border-radius:var(--raio);padding:40px 28px 28px;border:1px solid var(--cor-borda);display:flex;flex-direction:column;text-align:center;transition:all .35s;position:relative}
.plano-card:hover{box-shadow:0 8px 30px rgba(58,45,40,.08);transform:translateY(-4px)}
.plano-card.destaque{background:var(--cor-escuro);border-color:var(--cor-escuro);color:#fff;box-shadow:0 20px 60px rgba(58,45,40,.12)}
.plano-card.destaque::before{content:'Mais popular';position:absolute;top:-14px;left:50%;transform:translateX(-50%);background:var(--cor-acento);color:#fff;padding:6px 22px;border-radius:100px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;white-space:nowrap}
.plano-card h3{font-family:var(--fonte-display);font-size:26px;font-weight:600;margin-bottom:20px;color:var(--cor-escuro)}
.plano-card.destaque h3{color:#fff}
.plano-item{display:flex;justify-content:space-between;align-items:center;padding:12px 0;border-bottom:1px solid var(--cor-borda)}
.plano-card.destaque .plano-item{border-bottom-color:rgba(255,255,255,.1)}
.plano-item:last-child{border-bottom:none}
.plano-item-label{font-size:14px;color:var(--cor-texto);text-align:left;flex:1}
.plano-card.destaque .plano-item-label{color:rgba(255,255,255,.8)}
.plano-item-preco{font-family:var(--fonte-display);font-size:20px;font-weight:700;white-space:nowrap;margin-left:16px;color:var(--cor-escuro)}
.plano-card.destaque .plano-item-preco{color:#fff}
.plano-obs{font-size:12px;color:var(--cor-texto-suave);margin-top:20px;padding-top:16px;border-top:1px solid var(--cor-borda);font-style:italic}
.plano-card.destaque .plano-obs{color:rgba(255,255,255,.5);border-top-color:rgba(255,255,255,.1)}
.avulso{text-align:center;margin-top:32px;padding:24px 32px;background:var(--cor-fundo);border:1px solid var(--cor-borda);border-radius:var(--raio);max-width:500px;margin-left:auto;margin-right:auto}
.avulso p{font-size:15px;color:var(--cor-texto);line-height:1.8}
.avulso strong{color:var(--cor-acento)}
@media(max-width:768px){
.planos-grid{flex-direction:column;align-items:center}.plano-card{max-width:100%;min-width:0;padding:32px 20px}
.hero h1{font-size:28px}.hero{padding:100px 24px 60px}
.cta-block h2{font-size:22px}.cta-block .btn{font-size:15px;padding:16px 24px}
.info-item{font-size:14px}
.plano-card h3{font-size:22px}.plano-item-preco{font-size:17px}
}

/* CTA */
.cta-block{background:var(--cor-escuro);padding:80px 0;text-align:center;position:relative;overflow:hidden}
.cta-block::before{content:'';position:absolute;top:-50%;left:-50%;width:200%;height:200%;background:radial-gradient(circle at 30% 70%,rgba(193,123,94,.08) 0%,transparent 50%);pointer-events:none}
.cta-block .container{position:relative;z-index:1;display:flex;flex-direction:column;align-items:center;gap:24px}
.cta-block h2{font-size:clamp(24px,3.5vw,36px);color:#fff;font-weight:400;max-width:600px}
.cta-block .btn{background:#fff;color:var(--cor-escuro);font-size:18px;padding:16px 48px;border:3px solid #fff}
.cta-block .btn:hover{background:var(--cor-fundo)}

/* INSTAGRAM */
.insta-section{text-align:center}
.insta-link{display:inline-flex;align-items:center;gap:10px;font-family:var(--fonte-display);font-size:22px;font-weight:500;color:var(--cor-acento);margin-bottom:16px;transition:opacity .3s}
.insta-link:hover{opacity:.7}
.insta-link svg{width:28px;height:28px;fill:currentColor}
.copyright{text-align:center;font-size:14px;color:var(--cor-texto-suave);margin-top:8px}

/* FOOTER */
.footer{background:var(--cor-escuro);padding:28px 0;text-align:center}
.footer p{font-size:13px;color:rgba(255,255,255,.5)}

/* WHATSAPP */
.wpp-float{position:fixed;bottom:24px;right:24px;z-index:999;width:56px;height:56px;background:#25D366;border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 6px 20px rgba(37,211,102,.35);transition:all .3s}
.wpp-float:hover{transform:scale(1.1)}
.wpp-float svg{width:26px;height:26px;fill:#fff}
</style>
</head>
<body>

<!-- WhatsApp número -->
<span data-editable="whatsapp-numero" style="display:none">5538998760323</span>

<header class="header" id="header">
<div class="container"><a href="#" class="logo-link"><img class="logo-img" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='376' height='143'%3E%3Crect width='376' height='143' fill='none'/%3E%3Ctext x='188' y='80' text-anchor='middle' fill='%233A2D28' font-family='Georgia,serif' font-size='36' font-weight='bold'%3ESua Logo%3C/text%3E%3C/svg%3E" alt="Logo" data-editable="logo"></a></div>
</header>

<section class="hero">
<img class="hero-img left" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='600'%3E%3C/svg%3E" alt="" data-editable="hero-img-left">
<img class="hero-img right" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='600'%3E%3C/svg%3E" alt="" data-editable="hero-img-right">
<div class="hero-glow"></div>
<div class="container">
<h1 class="display" data-editable="page-title">Informações sobre planos e aulas</h1>
<div class="hero-arrow">↓</div>
</div>
</section>

<section class="section info-section">
<div class="container">
<p class="info-label display" data-editable="info-label">Sobre as aulas</p>
<div class="info-list">
<div class="info-item"><span class="info-dot"></span><span data-editable="info-1">Nossas aulas tem a duração de 50 minutos, sendo no máximo 4 alunos por instrutora no horário.</span></div>
<div class="info-item"><span class="info-dot"></span><span data-editable="info-2">Trabalhamos com horário fixo e por escala, onde ambos devem ser acordados conforme disponibilidade em agenda.</span></div>
<div class="info-item"><span class="info-dot"></span><span data-editable="info-3">Oferecemos uma aula experimental para que entenda melhor como funciona o nosso espaço, a mesma deve ser agendada, conforme disponibilidade da agenda.</span></div>
</div>
</div>
</section>

<section class="section planos-section">
<div class="container">
<p class="planos-label display" data-editable="planos-label">Sobre os planos</p>
<div class="planos-grid">
<div class="plano-card">
<h3 data-editable="plano1-nome">Mensal</h3>
<div class="plano-item"><span class="plano-item-label" data-editable="plano1-op1-label">1x na semana - 4 aulas</span><span class="plano-item-preco" data-editable="plano1-op1-preco">R$499,42</span></div>
<div class="plano-item"><span class="plano-item-label" data-editable="plano1-op2-label">2x na semana - 8 aulas</span><span class="plano-item-preco" data-editable="plano1-op2-preco">R$750,00</span></div>
<div class="plano-item"><span class="plano-item-label" data-editable="plano1-op3-label">3x na semana - 12 aulas</span><span class="plano-item-preco" data-editable="plano1-op3-preco">R$1.045,00</span></div>
<p class="plano-obs" data-editable="plano1-obs">No plano mensal, ás aulas são realizadas no período de 30 dias.</p>
</div>
<div class="plano-card destaque">
<h3 data-editable="plano2-nome">Trimestral</h3>
<div class="plano-item"><span class="plano-item-label" data-editable="plano2-op1-label">1x na semana - 12 aulas</span><span class="plano-item-preco" data-editable="plano2-op1-preco">R$410,02</span></div>
<div class="plano-item"><span class="plano-item-label" data-editable="plano2-op2-label">2x na semana - 24 aulas</span><span class="plano-item-preco" data-editable="plano2-op2-preco">R$626,22</span></div>
<div class="plano-item"><span class="plano-item-label" data-editable="plano2-op3-label">3x na semana - 36 aulas</span><span class="plano-item-preco" data-editable="plano2-op3-preco">R$905,14</span></div>
<p class="plano-obs" data-editable="plano2-obs">No plano trimestral, ás aulas são realizadas no período de 90 dias.</p>
</div>
<div class="plano-card">
<h3 data-editable="plano3-nome">Semestral</h3>
<div class="plano-item"><span class="plano-item-label" data-editable="plano3-op1-label">1x na semana - 24 aulas</span><span class="plano-item-preco" data-editable="plano3-op1-preco">R$350,40</span></div>
<div class="plano-item"><span class="plano-item-label" data-editable="plano3-op2-label">2x na semana - 48 aulas</span><span class="plano-item-preco" data-editable="plano3-op2-preco">R$568,00</span></div>
<div class="plano-item"><span class="plano-item-label" data-editable="plano3-op3-label">3x na semana - 72 aulas</span><span class="plano-item-preco" data-editable="plano3-op3-preco">R$766,00</span></div>
<p class="plano-obs" data-editable="plano3-obs">No plano semestral, ás aulas são realizadas no período de 180 dias.</p>
</div>
</div>
<div class="avulso"><p data-editable="avulso">Aulas avulsas: <strong>R$180,00</strong> cada aula.<br>Descontos para o pagamento no pix</p></div>
</div>
</section>

<section class="cta-block">
<div class="container">
<h2 class="display" data-editable="cta-headline">Clique no botão abaixo e agende sua aula experimental grátis</h2>
<a href="#" class="btn" data-editable="cta-link" data-editable-text="cta-btn">Agende seu horário</a>
</div>
</section>

<section class="section insta-section">
<div class="container">
<a href="#" class="insta-link" data-editable="insta-link">
<svg viewBox="0 0 448 512"><path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8z"/></svg>
<span data-editable-text="insta-handle">@seuinstagram</span>
</a>
<p class="copyright" data-editable="footer-texto">&copy;2026 - Todos os direitos reservados</p>
</div>
</section>

<a href="#" class="wpp-float" data-editable="whatsapp-float-link" title="WhatsApp"><svg viewBox="0 0 448 512"><path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/></svg></a>

<script>
window.addEventListener('scroll',()=>document.getElementById('header').classList.toggle('scrolled',window.scrollY>50));
// Unificar links do WhatsApp
(function(){
var numEl=document.querySelector('[data-editable="whatsapp-numero"]');
if(!numEl)return;
var num=numEl.textContent.replace(/\\D/g,'');
if(!num)return;
var whatsUrl='https://wa.me/'+num+'?text=Ol%C3%A1%2C%20vim%20do%20site%20e%20gostaria%20de%20mais%20informa%C3%A7%C3%B5es';
document.querySelectorAll('[data-editable="cta-link"],[data-editable="whatsapp-float-link"]').forEach(function(a){a.href=whatsUrl});
})();
</script>
</body>
</html>
`,
  get: function(type) { return this[type] || ''; }
};

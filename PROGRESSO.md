# Progresso do Projeto — Guedes WebBuilder

**Última atualização:** 12/08/2026
**Último commit enviado:** `efec592` — "Tela de edicao estilo CMS com seletor de paginas em destaque" (branch `main`, GitHub `GuedesWeb/guedes-webbuilder`)

---

## Visão geral do projeto

Builder de sites para estúdios de Pilates/wellness, com fluxo completo:

1. **Boas-vindas** (`webbuilder.html`) — apresentação + pagamento de R$300 via Asaas/PIX (verificação automática a cada 10s, confirmação via WhatsApp como fallback)
2. **Pré-Configuração** — 4 sub-etapas (Identidade/Cores, Fotos, Contato/Localização, Planos e Valores), aplicadas nas duas páginas
3. **Tela de edição** — edição com preview ao vivo e clique direto nos textos/imagens
4. **Publicação** — domínio próprio (R$79,90/ano via Asaas) ou subdomínio grátis `.vercel.app` na Vercel

- **Página de Planos** é publicada como `/planos`, com `noindex` e **sem nenhum link a partir da landing** — só abre pelo link direto enviado ao cliente
- **CMS** (`cms.html`) — painel do cliente pós-publicação (login via `/api/client-auth`)
- **Templates reais** estão em `templates-data.js` (slots dinâmicos `depo-0..14`, `gal-0..19`, `galeria-1..8`). ⚠️ Os arquivos em `Templates/` estão desatualizados — o app usa `templates-data.js`
- **API** (`api/`) — serverless functions Vercel (Asaas, leads, auth, publish)

---

## O que foi feito na sessão de 12/08/2026

### 1. Tela de edição do WebBuilder replicada no estilo CMS
O wizard de etapas pós-pré-configuração (Identidade, Cores, Imagens, Contato, Avaliações, Publicar) foi **substituído por abas estilo CMS**:

```
🎨 Cores | 🖼️ Imagens | 🔗 Links | 💬 Depoimentos | 📸 Galeria | ⚙️ Ajustes | 🚀 Publicar
```

- Rodapé do painel: `💾 Salvar · 📥 Baixar · 🚀 Publicar`
- Depoimentos e Galeria com **multi-upload** (selecionar várias de uma vez)
- Aba **Ajustes** reúne: SEO, WhatsApp, código Elfsight (avaliações do Google) e código customizado (head/body/footer)
- O wizard ficou apenas para Boas-vindas e Pré-Configuração (`STEPS` agora só tem 2 itens; `editMode=true` após `applySetup()`)
- **Rascunho automático** em localStorage (`wb_rascunho`): autosave ao sair da página + botão Salvar

### 2. Seletor de páginas em destaque + aviso da página de planos
- Botões grandes e nomeados na barra de abas: `🏠 Página Principal` e `💎 Página de Planos` (com tag `via link`)
- Botão ativo em roxo com brilho (`.psbtn.on`)
- **Banner de aviso** ao selecionar a Página de Planos: ela não aparece no site, só abre pelo link enviado e não é indexada pelo Google
- Aviso também na tela Publicar (antes e depois de publicar)

### 3. CMS atualizado igual
- Mesmo seletor de páginas em destaque e o mesmo banner de aviso aplicados ao `cms.html`

### 4. Enviado ao GitHub
- Commit `efec592` publicado em `main` (2 arquivos: `webbuilder.html` + `cms.html`)

### 5. Criação automática da conta CMS ao publicar (13/08/2026)
- **Antes:** publicar só enviava o site à Vercel — a conta do CMS tinha que ser criada manualmente pelo admin
- **Agora:** `publishToVercel()` chama o novo endpoint `POST /api/criar-acesso-cliente` logo após publicar
  - Cria `cms-user:<email>` (senha gerada e mostrada na tela), `site:<slug>` (com edits, customCode, vercelProject e siteUrl) e adiciona à lista `clients`
  - Se o email já tem conta: apenas atualiza o site doc e mostra "painel já ativo"
  - Se o site tem imagens demais (>4,2MB, limite da Vercel): tenta de novo sem o conteúdo — acesso é criado mesmo assim
  - Na tela de sucesso aparece a caixa "🔐 Seu painel de edição foi criado!" com email + senha (copiar) + link para o CMS
- Novo arquivo: `api/criar-acesso-cliente.js` (registrado no `vercel.json` com 512MB)
- ⚠️ O endpoint é aberto (sem autenticação), como `salvar-lead` — risco baixo (só cria registros no KV), mas se quiser posso exigir confirmação de pagamento via Asaas
- Testado com KV simulado: criação 201 + senha, repetição 200, inválido 400 ✅
- ✅ Enviado ao GitHub no commit `f65f065`

### 6. Acesso CMS visível na listagem do painel admin (13/08/2026)
- Listagem de projetos do `admin.html` ganhou a coluna **"Acesso CMS"**: senha do cliente (clique copia), botão 📋 copiar, botão 🔄 gerar nova senha, link 🌐 do site publicado e link 🖊️ para o CMS
- `api/admin-leads.js` enriquece cada lead buscando `cms-user:<email>` e `site:<slug>` no KV (senha, siteUrl, vercelProject)
- Senha agora é gravada (campo `senha`) em `admin-criar-acesso.js` e `criar-acesso-cliente.js` — contas antigas aparecem como "senha não visível" e podem ser resolvidas com 🔄
- Novo endpoint `api/admin-resetar-senha.js` (auth admin): gera nova senha para o cliente (a atual deixa de funcionar), registrado no `vercel.json`
- ⚠️ Trade-off de segurança: a senha fica armazenada em texto puro no KV (necessário para o admin vê-la na listagem). Alternativa seria armazenar só o hash + botão de reset — avalie
- Testado com KV simulado: enriquecimento por lead ✅, reset 200 ✅, reset inexistente 404 ✅
- ✅ Enviado ao GitHub no commit `22acb50`

### 7. Admin no domínio raiz vê a tela normal de cliente (13/08/2026)
- O modo admin do builder não ativa mais sozinho pela presença do token — só ativa pelo link específico `/?admin=1`
- No domínio raiz, o admin (e qualquer visitante) vê a tela normal de boas-vindas com pagamento
- O fluxo "Criar site para cliente" (sem pagamento) continua disponível: botão **➕ Criar Site para Cliente** no painel admin abre o builder com `?admin=1`
- ✅ Enviado ao GitHub no commit `31509e0`

### 8. ⚠️ TESTE — preço reduzido para R$5 (13/08/2026) → ✅ REVERTIDO
- Valor de R$300 → **R$5** em `webbuilder.html` (cards, botão, tela de investimento) e em `api/criar-cobranca.js` (`value: 5`) — commit `7105f36`
- Revertido para **R$300** em 13/08/2026 (4 pontos conferidos: cards, botão, tela de investimento, value da cobrança)

### 9. Publicação grátis agora é feita pelo servidor (13/08/2026)
- **Problema:** "Publicar Grátis" usava o token da Vercel do navegador do cliente (localStorage) — ninguém tinha, dava "Erro interno: token não encontrado"
- **Solução:** novo endpoint `api/publicar-site.js` publica usando `process.env.VERCEL_TOKEN` do servidor (mesmo token usado pelo `client-publish` do CMS)
- `publishToVercel()` no webbuilder agora chama `/api/publicar-site` e mostra os erros de forma amigável (nome em uso, site grande demais, token não configurado)
- ⚠️ Requer a variável `VERCEL_TOKEN` configurada no projeto da Vercel
- ⚠️ Pendente: o fluxo de **domínio pago** (`checkDomain`/`buyDomainVercel`/`registerDomain`) ainda usa o token do navegador — tem o mesmo problema e deve ir para o servidor também
- Testado com Vercel API simulada: sucesso 200 ✅, nome em uso 502 ✅, arquivo inválido 400 ✅, >4MB 413 ✅, sem token 500 ✅
- ✅ Enviado ao GitHub no commit `b471ebd`

### 10. HTML baixado/publicado sem o editor inline (13/08/2026)
- **Problema:** o `buildHTML` do CMS injetava o script de edição (efeito do lápis no hover) em todos os arquivos — baixar/publicar levava o editor junto
- **Solução:** `buildHTML(page, noindex, injetarEditor)` — o editor só é injetado no preview (`updatePreview`); `cmsBaixar` e `cmsPublicar` geram arquivos limpos
- O export/publicação do WebBuilder (`buildPageHTML`) já era limpo
- ✅ Enviado ao GitHub no commit `4f9756a`

---

## Onde paramos / próximos passos

- ✅ Tudo o que foi pedido nesta sessão está pronto e enviado
- ⏳ **Pendente de teste manual no navegador** — validar o fluxo completo: pagamento → pré-configuração → abas de edição → troca de páginas → publicação
- 💡 Ideias levantadas (não implementadas):
  - Clientes que já pagaram poderiam pular direto para a tela de edição ao reabrir o builder (hoje passam pela pré-configuração de novo, com campos pré-preenchidos)
  - A pasta `Templates/` está desatualizada em relação ao `templates-data.js` — considerar remover/atualizar para evitar confusão
- 📄 Este arquivo (`PROGRESSO.md`) ainda **não foi commitado** — commit apenas se desejar

## Como testar

```
cd "C:\Users\55389\Documents\Guedes WebBuilder"
.\start-server.ps1        # porta 8080
```
Depois abrir `http://localhost:8080/webbuilder.html` (builder) e `http://localhost:8080/cms.html` (painel do cliente).

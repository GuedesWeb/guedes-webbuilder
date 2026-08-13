/**
 * POST /api/publicar-site
 * Publica o site do cliente na Vercel usando o token do servidor (VERCEL_TOKEN).
 * Chamado pelo WebBuilder ao clicar em "Publicar Grátis".
 *
 * Body: { name, files: [{file,data}] }
 * Retorna: { ok: true, url }
 */

var LIMITE_ARQUIVO = 4200000; // ~4,2MB por arquivo (limite da Vercel ~4,5MB)

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') { res.statusCode = 204; return res.end(); }
  if (req.method !== 'POST') { res.statusCode = 405; res.setHeader('Content-Type', 'application/json'); return res.end(JSON.stringify({ erro: 'Use POST.' })); }

  try {
    var vercelToken = process.env.VERCEL_TOKEN;
    if (!vercelToken) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify({ erro: 'VERCEL_TOKEN não configurado no servidor. Fale com o Guedes.' }));
    }

    var body = '';
    req.on('data', function (c) { body += c; });
    await new Promise(function (r) { req.on('end', r); });

    var d = JSON.parse(body);
    var name = String(d.name || '').trim().toLowerCase()
      .normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')
      .substring(0, 60);
    var files = d.files || [];

    if (!name) {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify({ erro: 'Nome do projeto obrigatório.' }));
    }

    // Valida arquivos
    var permitidos = ['index.html', 'planos.html', 'vercel.json'];
    for (var i = 0; i < files.length; i++) {
      if (permitidos.indexOf(files[i].file) === -1) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        return res.end(JSON.stringify({ erro: 'Arquivo não permitido: ' + files[i].file }));
      }
      if (typeof files[i].data !== 'string' || files[i].data.length === 0) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        return res.end(JSON.stringify({ erro: 'Arquivo ' + files[i].file + ' vazio ou inválido.' }));
      }
      if (files[i].data.length > LIMITE_ARQUIVO) {
        res.statusCode = 413;
        res.setHeader('Content-Type', 'application/json');
        return res.end(JSON.stringify({ erro: 'O site está grande demais (' + files[i].file + ' com ' + Math.round(files[i].data.length / 1000) + 'KB, limite ~4MB). Remova algumas fotos da galeria/depoimentos e tente de novo.' }));
      }
    }

    // Cria/atualiza projeto (ignora erro se já existe)
    try {
      await fetch('https://api.vercel.com/v9/projects', {
        method: 'POST',
        headers: { 'Authorization': 'Bearer ' + vercelToken, 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name, framework: null, gitRepository: { type: 'github', repo: null } }),
      });
    } catch (e) {}

    // Deploy
    var deployRes = await fetch('https://api.vercel.com/v13/deployments', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + vercelToken, 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: name, files: files, projectSettings: { framework: null }, target: 'production' }),
    });

    var deployJson = await deployRes.json();

    if (!deployRes.ok) {
      var msg = (deployJson.error && deployJson.error.message) || deployJson.message || 'Erro desconhecido';
      if (deployJson.error && deployJson.error.code) msg = '[' + deployJson.error.code + '] ' + msg;
      res.statusCode = 502;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify({ erro: 'Erro na Vercel: ' + msg }));
    }

    var url = 'https://' + name + '.vercel.app';
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({ ok: true, url: url }));
  } catch (e) {
    console.error('[publicar-site]', e.message);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({ erro: 'Erro interno.' }));
  }
};

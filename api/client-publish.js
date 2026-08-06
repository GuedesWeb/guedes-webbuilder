/**
 * POST /api/client-publish
 * Republica o site na Vercel.
 *
 * Auth: Bearer <token>
 * Body: { "vercelProject": "...", "files": [{file,data},...], "edits": {...}, "customCode": {...} }
 */

var kv = require('../lib/kv.js');
var clientAuth = require('./client-auth.js');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') { res.statusCode = 204; return res.end(); }
  if (req.method !== 'POST') { res.statusCode = 405; res.setHeader('Content-Type', 'application/json'); return res.end(JSON.stringify({ erro: 'Use POST.' })); }

  try {
    var token = (req.headers.authorization || '').replace('Bearer ', '').trim();
    var payload = clientAuth.validarToken(token);
    if (!payload) { res.statusCode = 401; res.setHeader('Content-Type', 'application/json'); return res.end(JSON.stringify({ erro: 'Não autorizado.' })); }

    var vercelToken = process.env.VERCEL_TOKEN;
    if (!vercelToken) { res.statusCode = 500; res.setHeader('Content-Type', 'application/json'); return res.end(JSON.stringify({ erro: 'VERCEL_TOKEN não configurado no servidor.' })); }

    var body = '';
    req.on('data', function (c) { body += c; });
    await new Promise(function (r) { req.on('end', r); });

    var d = JSON.parse(body);
    var project = String(d.vercelProject || payload.slug).substring(0, 100);
    var files = d.files || [];

    // Validar arquivos
    var permitidos = ['index.html', 'planos.html', 'vercel.json'];
    for (var i = 0; i < files.length; i++) {
      if (permitidos.indexOf(files[i].file) === -1) { res.statusCode = 400; res.setHeader('Content-Type', 'application/json'); return res.end(JSON.stringify({ erro: 'Arquivo não permitido: ' + files[i].file })); }
      if (typeof files[i].data !== 'string' || files[i].data.length > 2000000) { res.statusCode = 400; res.setHeader('Content-Type', 'application/json'); return res.end(JSON.stringify({ erro: 'Arquivo ' + files[i].file + ' inválido.' })); }
    }

    // Criar/atualizar projeto
    try {
      await fetch('https://api.vercel.com/v9/projects', {
        method: 'POST',
        headers: { 'Authorization': 'Bearer ' + vercelToken, 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: project, framework: null, gitRepository: { type: 'github', repo: null } }),
      });
    } catch (e) {}

    // Deploy
    var deployRes = await fetch('https://api.vercel.com/v13/deployments', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + vercelToken, 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: project, files: files, projectSettings: { framework: null }, target: 'production' }),
    });

    if (!deployRes.ok) {
      var errTxt = '';
      try { errTxt = await deployRes.text(); } catch (e) {}
      res.statusCode = 502;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify({ erro: 'Erro Vercel HTTP ' + deployRes.status }));
    }

    var deployJson = await deployRes.json();
    var siteUrl = deployJson.url ? ('https:' + deployJson.url) : ('https://' + project + '.vercel.app');

    // Atualizar KV
    var raw = await kv.cmd('GET', 'site:' + payload.slug);
    if (raw) {
      var site = typeof raw === 'string' ? JSON.parse(raw) : raw;
      site.vercelProject = project;
      site.siteUrl = siteUrl;
      site.publishedAt = new Date().toISOString();
      site.atualizadoEm = new Date().toISOString();
      if (d.edits) site.edits = d.edits;
      if (d.customCode) site.customCode = d.customCode;
      await kv.cmd('SET', 'site:' + payload.slug, JSON.stringify(site));
    }

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({ ok: true, url: siteUrl }));
  } catch (e) {
    console.error('[client-publish]', e.message);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({ erro: 'Erro interno.' }));
  }
};

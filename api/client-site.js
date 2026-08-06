/**
 * GET  /api/client-site?slug=xxx  → carrega dados do site
 * POST /api/client-site           → salva rascunho
 *
 * Auth: Bearer <token> (JWT do cliente)
 */

var kv = require('../lib/kv.js');
var clientAuth = require('./client-auth.js');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') { res.statusCode = 204; return res.end(); }

  try {
    var token = (req.headers.authorization || '').replace('Bearer ', '').trim();
    var payload = clientAuth.validarToken(token);
    if (!payload) { res.statusCode = 401; res.setHeader('Content-Type', 'application/json'); return res.end(JSON.stringify({ erro: 'Não autorizado.' })); }

    if (req.method === 'GET') {
      var url = new URL(req.url, 'http://localhost');
      var slug = url.searchParams.get('slug') || payload.slug;
      if (slug !== payload.slug) { res.statusCode = 403; res.setHeader('Content-Type', 'application/json'); return res.end(JSON.stringify({ erro: 'Acesso negado.' })); }

      var raw = await kv.cmd('GET', 'site:' + slug);
      if (!raw) { res.statusCode = 404; res.setHeader('Content-Type', 'application/json'); return res.end(JSON.stringify({ erro: 'Site não encontrado.' })); }

      var site = typeof raw === 'string' ? JSON.parse(raw) : raw;
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify({
        slug: site.slug, studio: site.studio, email: site.email,
        edits: site.edits || null,
        customCode: site.customCode || { head: '', bodyStart: '', footer: '' },
        vercelProject: site.vercelProject || '',
        siteUrl: site.siteUrl || '',
        publishedAt: site.publishedAt || null,
      }));
    }

    if (req.method === 'POST') {
      var body = '';
      req.on('data', function (c) { body += c; });
      await new Promise(function (r) { req.on('end', r); });
      if (body.length > 500000) { res.statusCode = 413; res.setHeader('Content-Type', 'application/json'); return res.end(JSON.stringify({ erro: 'Dados muito grandes.' })); }

      var d = JSON.parse(body);
      var rawExisting = await kv.cmd('GET', 'site:' + payload.slug);
      if (!rawExisting) { res.statusCode = 404; res.setHeader('Content-Type', 'application/json'); return res.end(JSON.stringify({ erro: 'Site não encontrado.' })); }

      var site = typeof rawExisting === 'string' ? JSON.parse(rawExisting) : rawExisting;
      if (d.edits) site.edits = d.edits;
      if (d.customCode) site.customCode = d.customCode;
      if (d.vercelProject) site.vercelProject = d.vercelProject;
      if (d.siteUrl) site.siteUrl = d.siteUrl;
      site.atualizadoEm = new Date().toISOString();

      await kv.cmd('SET', 'site:' + payload.slug, JSON.stringify(site));
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify({ ok: true }));
    }

    res.statusCode = 405; res.setHeader('Content-Type', 'application/json'); return res.end(JSON.stringify({ erro: 'Use GET ou POST.' }));
  } catch (e) {
    console.error('[client-site]', e.message);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({ erro: 'Erro interno.' }));
  }
};

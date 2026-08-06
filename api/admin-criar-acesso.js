/**
 * POST /api/admin-criar-acesso
 * Admin cria acesso para um cliente (sem pagamento).
 *
 * Headers: Authorization: Bearer <admin_token>
 * Body: { email, nome, studio, cpfCnpj? }
 * Retorna: { email, senha, slug }
 */

var kv = require('../lib/kv.js');
var auth = require('../lib/auth.js');
var adminLogin = require('./admin-login.js');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') { res.statusCode = 204; return res.end(); }
  if (req.method !== 'POST') { res.statusCode = 405; res.setHeader('Content-Type', 'application/json'); return res.end(JSON.stringify({ erro: 'Use POST.' })); }

  try {
    var authHdr = req.headers.authorization || '';
    var adminToken = authHdr.replace('Bearer ', '').trim();
    if (!adminLogin.validarToken(adminToken)) {
      res.statusCode = 401;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify({ erro: 'Admin não autorizado.' }));
    }

    var body = '';
    req.on('data', function (c) { body += c; });
    await new Promise(function (r) { req.on('end', r); });

    var d = JSON.parse(body);
    var email = (d.email || '').trim().toLowerCase();
    var nome = (d.nome || '').trim();
    var studio = (d.studio || '').trim();
    var cpfCnpj = (d.cpfCnpj || '').replace(/\D/g, '');

    if (!email || !nome || !studio) {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify({ erro: 'Email, nome e estúdio obrigatórios.' }));
    }

    // Slug único: nome + timestamp curto
    var slug = auth.slugify(studio) + '-' + Date.now().toString(36);

    var senha = auth.gerarSenha();
    var hash = auth.hashSenha(senha);

    var userDoc = { email, slug, nome, studio, passwordHash: hash, criadoEm: new Date().toISOString() };
    await kv.cmd('SET', 'cms-user:' + email, JSON.stringify(userDoc));

    var siteDoc = { slug, nome, email, studio, cpfCnpj, edits: null, customCode: null, criadoEm: new Date().toISOString() };
    await kv.cmd('SET', 'site:' + slug, JSON.stringify(siteDoc));

    await kv.cmd('RPUSH', 'clients', email);

    res.statusCode = 201;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({ email, senha, slug, studio }));
  } catch (e) {
    console.error('[admin-criar-acesso]', e.message);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({ erro: 'Erro interno.' }));
  }
};

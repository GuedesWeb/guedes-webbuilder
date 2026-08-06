/**
 * POST /api/client-auth
 * Login do cliente no CMS.
 *
 * Body: { "email": "...", "senha": "..." }
 * Retorna: { "token": "...", "slug": "...", "studio": "...", "siteUrl": "..." }
 */

var crypto = require('crypto');
var kv = require('../lib/kv.js');
var auth = require('../lib/auth.js');

function getSecret() {
  return crypto.createHash('sha256').update('guedes-cms-secret-' + (process.env.ADMIN_PASSWORD || '')).digest();
}

function criarToken(email, slug) {
  var payload = { email: email, slug: slug, exp: Date.now() + (12 * 60 * 60 * 1000) };
  var b64 = Buffer.from(JSON.stringify(payload)).toString('base64');
  var sig = crypto.createHmac('sha256', getSecret()).update(b64).digest('base64');
  return b64 + '.' + sig;
}

// Exportado para outros endpoints validarem
function validarToken(token) {
  try {
    var parts = token.split('.');
    if (parts.length !== 2) return null;
    var expected = crypto.createHmac('sha256', getSecret()).update(parts[0]).digest('base64');
    if (parts[1] !== expected) return null;
    var p = JSON.parse(Buffer.from(parts[0], 'base64').toString('utf8'));
    if (p.exp < Date.now()) return null;
    return p;
  } catch (e) { return null; }
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') { res.statusCode = 204; return res.end(); }
  if (req.method !== 'POST') { res.statusCode = 405; res.setHeader('Content-Type', 'application/json'); return res.end(JSON.stringify({ erro: 'Use POST.' })); }

  try {
    var body = '';
    req.on('data', function (c) { body += c; });
    await new Promise(function (r) { req.on('end', r); });

    var d = JSON.parse(body);
    var email = (d.email || '').trim().toLowerCase();
    var senha = (d.senha || '').trim();

    if (!email || !senha) {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify({ erro: 'Email e senha obrigatórios.' }));
    }

    // Brute-force
    var tentativasKey = 'login-t:' + email;
    var tentativas = parseInt(await kv.cmd('GET', tentativasKey) || '0');
    if (tentativas >= 5) {
      res.statusCode = 429;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify({ erro: 'Muitas tentativas. Aguarde 15 min.' }));
    }

    var raw = await kv.cmd('GET', 'cms-user:' + email);
    if (!raw) {
      await kv.cmd('INCR', tentativasKey);
      await kv.cmd('EXPIRE', tentativasKey, '900');
      res.statusCode = 401;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify({ erro: 'Email ou senha incorretos.' }));
    }

    var user = typeof raw === 'string' ? JSON.parse(raw) : raw;
    var hash = auth.hashSenha(senha);
    if (hash !== user.passwordHash) {
      await kv.cmd('INCR', tentativasKey);
      await kv.cmd('EXPIRE', tentativasKey, '900');
      res.statusCode = 401;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify({ erro: 'Email ou senha incorretos.' }));
    }

    await kv.cmd('DEL', tentativasKey);

    var rawSite = await kv.cmd('GET', 'site:' + user.slug);
    var site = rawSite ? (typeof rawSite === 'string' ? JSON.parse(rawSite) : rawSite) : {};

    var token = criarToken(email, user.slug);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({
      token: token,
      slug: user.slug,
      studio: user.studio || '',
      siteUrl: site.siteUrl || '',
    }));
  } catch (e) {
    console.error('[client-auth]', e.message);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({ erro: 'Erro interno.' }));
  }
};

module.exports.validarToken = validarToken;

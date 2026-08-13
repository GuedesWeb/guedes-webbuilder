/**
 * POST /api/admin-resetar-senha
 * Admin gera uma nova senha de acesso ao CMS para um cliente.
 * A senha antiga deixa de funcionar.
 *
 * Headers: Authorization: Bearer <admin_token>
 * Body: { email }
 * Retorna: { email, senha }
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
    if (!email) {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify({ erro: 'Email obrigatório.' }));
    }

    var raw = await kv.cmd('GET', 'cms-user:' + email);
    if (!raw) {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify({ erro: 'Nenhuma conta CMS encontrada para este email. Use "Criar Acesso para Cliente".' }));
    }

    var user = typeof raw === 'string' ? JSON.parse(raw) : raw;
    var senha = auth.gerarSenha();
    user.passwordHash = auth.hashSenha(senha);
    user.senha = senha;
    await kv.cmd('SET', 'cms-user:' + email, JSON.stringify(user));

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({ email: email, senha: senha, slug: user.slug }));
  } catch (e) {
    console.error('[admin-resetar-senha]', e.message);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({ erro: 'Erro interno.' }));
  }
};

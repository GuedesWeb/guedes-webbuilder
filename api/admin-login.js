/**
 * POST /api/admin-login
 * Autentica o administrador e retorna um token de sessão.
 *
 * Variáveis de ambiente:
 *   ADMIN_EMAIL    — email do admin
 *   ADMIN_PASSWORD — senha do admin
 *
 * Body: { "email": "...", "password": "..." }
 * Retorna: { "token": "...", "expires": "..." }
 */

var crypto = require('crypto');

function gerarToken() {
  return 'adm_' + crypto.randomBytes(32).toString('hex');
}

// Armazena tokens válidos em memória (reseta a cada deploy — admin faz login de novo)
var tokensValidos = {};

// Limpa tokens expirados a cada 5 minutos
setInterval(function () {
  var agora = Date.now();
  Object.keys(tokensValidos).forEach(function (t) {
    if (tokensValidos[t] < agora) delete tokensValidos[t];
  });
}, 300000);

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') { res.statusCode = 204; return res.end(); }
  if (req.method !== 'POST') { res.statusCode = 405; res.setHeader('Content-Type', 'application/json'); return res.end(JSON.stringify({ erro: 'Use POST.' })); }

  try {
    var body = '';
    req.on('data', function (chunk) { body += chunk; });
    await new Promise(function (resolve) { req.on('end', resolve); });

    var parsed = JSON.parse(body);
    var email = (parsed.email || '').trim();
    var password = (parsed.password || '').trim();

    var adminEmail = process.env.ADMIN_EMAIL;
    var adminPass = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPass) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify({ erro: 'Credenciais de admin não configuradas no servidor.' }));
    }

    if (email !== adminEmail || password !== adminPass) {
      res.statusCode = 401;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify({ erro: 'Email ou senha incorretos.' }));
    }

    var token = gerarToken();
    tokensValidos[token] = Date.now() + (8 * 60 * 60 * 1000); // 8 horas

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({ token: token, expiresIn: '8h' }));
  } catch (err) {
    console.error('[admin-login] Erro:', err.message);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({ erro: 'Erro interno.' }));
  }
};

// Exporta para uso em outros endpoints (verificar token)
module.exports.validarToken = function (token) {
  return token && tokensValidos[token] && tokensValidos[token] > Date.now();
};

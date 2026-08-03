/**
 * POST /api/admin-login — autentica e retorna token JWT
 * O token é auto-contido (assinado com HMAC) — funciona sem estado entre funções.
 *
 * Variáveis de ambiente:
 *   ADMIN_EMAIL / ADMIN_PASSWORD — credenciais
 *
 * Body: { "email": "...", "password": "..." }
 * Retorna: { "token": "..." }
 */

var crypto = require('crypto');

// Segredo para assinar tokens (derivado da senha admin + salt fixo)
function getSecret() {
  return crypto.createHash('sha256').update('guedes-wb-' + (process.env.ADMIN_PASSWORD || '')).digest();
}

// Cria token: base64(json).assinatura
function criarToken(email) {
  var payload = {
    email: email,
    exp: Date.now() + (8 * 60 * 60 * 1000), // 8 horas
  };
  var payloadB64 = Buffer.from(JSON.stringify(payload)).toString('base64');
  var sig = crypto.createHmac('sha256', getSecret()).update(payloadB64).digest('base64');
  return payloadB64 + '.' + sig;
}

// Valida token — retorna true se válido
function validarToken(token) {
  try {
    var parts = token.split('.');
    if (parts.length !== 2) return false;
    var payloadB64 = parts[0];
    var sig = parts[1];
    var expectedSig = crypto.createHmac('sha256', getSecret()).update(payloadB64).digest('base64');
    if (sig !== expectedSig) return false;
    var payload = JSON.parse(Buffer.from(payloadB64, 'base64').toString('utf8'));
    if (payload.exp < Date.now()) return false;
    return true;
  } catch (e) {
    return false;
  }
}

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
      return res.end(JSON.stringify({ erro: 'Credenciais de admin não configuradas. Configure ADMIN_EMAIL e ADMIN_PASSWORD na Vercel.' }));
    }

    if (email !== adminEmail || password !== adminPass) {
      res.statusCode = 401;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify({ erro: 'Email ou senha incorretos.' }));
    }

    var token = criarToken(email);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({ token: token }));
  } catch (err) {
    console.error('[admin-login] Erro:', err.message);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({ erro: 'Erro interno.' }));
  }
};

// Exporta para admin-leads.js poder validar
module.exports.validarToken = validarToken;

/**
 * Wrapper simples para Vercel KV (Upstash Redis) via REST API.
 * Não requer npm packages — usa fetch nativo (Node 18+).
 *
 * Variáveis de ambiente necessárias:
 *   KV_REST_API_URL  — ex: https://xxx.upstash.io
 *   KV_REST_API_TOKEN — token de acesso
 */

var KV_URL = process.env.KV_REST_API_URL;
var KV_TOKEN = process.env.KV_REST_API_TOKEN;

/**
 * Executa um comando Redis via REST API.
 * Ex: cmd('RPUSH', 'leads', JSON.stringify(lead))
 * Ex: cmd('LRANGE', 'leads', '0', '-1')
 */
async function cmd(command, key) {
  if (!KV_URL || !KV_TOKEN) {
    throw new Error('KV não configurado. Defina KV_REST_API_URL e KV_REST_API_TOKEN.');
  }

  // Upstash REST API: comando é o primeiro elemento do array
  var body = [command];
  for (var i = 1; i < arguments.length; i++) {
    body.push(arguments[i]);
  }

  var res = await fetch(KV_URL, {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + KV_TOKEN,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    var err = await res.text();
    throw new Error('KV erro HTTP ' + res.status + ': ' + err);
  }

  var json = await res.json();
  return json.result;
}

module.exports = { cmd: cmd };

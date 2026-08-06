/**
 * Wrapper para Upstash Redis REST API.
 *
 * Formato oficial: POST {base_url} com body ["COMMAND", "key", "arg1", ...]
 * Ex: POST https://xxx.upstash.io
 *     Body: ["SET", "foo", "bar"]
 *     Body: ["GET", "foo"]
 *     Body: ["LRANGE", "list", "0", "-1"]
 *     Body: ["RPUSH", "list", "value"]
 */

var KV_URL = process.env.KV_REST_API_URL;
var KV_TOKEN = process.env.KV_REST_API_TOKEN;

async function cmd(command, key) {
  if (!KV_URL || !KV_TOKEN) {
    throw new Error('KV não configurado. Defina KV_REST_API_URL e KV_REST_API_TOKEN.');
  }

  // Monta array: [COMMAND, key, arg1, arg2, ...]
  var body = [];
  for (var i = 0; i < arguments.length; i++) {
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

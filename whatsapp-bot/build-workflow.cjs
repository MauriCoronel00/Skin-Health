const fs = require('fs');

const RICH_QUERY = "select p.nombre, p.marca, p.subtitle, p.categoria_label, p.precio_gs, p.rating, p.reviews_count, p.descripcion, p.key_ingredients, p.skin_type, p.how_to_use, string_agg(pb.titulo || ': ' || pb.descripcion, ' | ' order by pb.orden) as beneficios from productos p left join producto_beneficios pb on pb.producto_id = p.id where p.activo = true group by p.id order by p.reviews_count desc;";

const codeExtraer = [
'const b = $input.first().json.body || $input.first().json;',
'const entry = (b.entry || [])[0] || {};',
'const change = (entry.changes || [])[0] || {};',
'const msg = ((change.value || {}).messages || [])[0] || {};',
'return [{ json: {',
"  from: msg.from || '',",
"  text: ((msg.text || {}).body || '').trim(),",
"  TIENDA_URL: 'https://skin-health-three.vercel.app/'",
'} }];',
].join('\n');

const codeMenu = [
'const j = $input.first().json;',
'return [{ json: { to: j.from, reply:',
"'Hola, somos Skin Health 💙\\n1️⃣ Catálogo: ' + j.TIENDA_URL + '\\n2️⃣ Contame tu tipo de piel y te recomiendo\\n3️⃣ Envío: 8.000 base + 2.000/km\\nRespondé con el número o tu consulta.'",
'} }];',
].join('\n');

const codeContexto = [
'const items = $input.all().map(i => i.json);',
"const prev = $('Extraer mensaje').first().json;",
'const ficha = (p) => {',
"  const ing = Array.isArray(p.key_ingredients) ? p.key_ingredients.join(', ') : (p.key_ingredients || '');",
'  return [',
"    'PRODUCTO: ' + p.nombre + ' (' + p.marca + ') — Gs ' + p.precio_gs + ' | ' + p.rating + ' estrellas (' + p.reviews_count + ' reviews)',",
"    'Para qué sirve: ' + (p.subtitle || '') + '. ' + (p.descripcion || ''),",
"    'Ingredientes clave: ' + ing,",
"    'Tipo de piel: ' + (p.skin_type || 'todo tipo') + '. Uso: ' + (p.how_to_use || ''),",
"    'Beneficios: ' + (p.beneficios || ''),",
"  ].join('\\n');",
'};',
"const catalogo = items.map(ficha).join('\\n---\\n');",
'return [{ json: { from: prev.from, TIENDA_URL: prev.TIENDA_URL, pregunta: prev.text, catalogo } }];',
].join('\n');

const codeReply = [
"const prev = $('Armar contexto').first().json;",
'const ai = $input.first().json;',
"const texto = ai.text || ai.content || ai.message || '';",
"return [{ json: { to: prev.from, reply: texto + '\\n\\nPedilo: ' + prev.TIENDA_URL } }];",
].join('\n');

const wf = {
  name: 'Skin Health bot WhatsApp',
  description: 'Bot Skin Health: responde consultas por WhatsApp con catalogo real de Supabase. Conectar credenciales en la UI de n8n antes de activar.',
  tags: [{ name: 'bot' }, { name: 'whatsapp' }, { name: 'skinhealth' }],
  nodes: [
    { name: 'Nota setup', type: 'n8n-nodes-base.stickyNote', typeVersion: 1,
      parameters: { content: '## Setup\n1. Meta WhatsApp Business: phone_number_id + token.\n2. Supabase: credential del proyecto.\n3. IA: credential OpenAI/Gemini.\n4. Webhook URL en Meta App > WhatsApp > Configuration.', height: 420, width: 400 } },
    { name: 'Webhook WhatsApp', type: 'n8n-nodes-base.webhook', typeVersion: 2,
      parameters: { httpMethod: 'POST', path: 'skinhealth-bot', responseMode: 'responseNode' } },
    { name: 'Extraer mensaje', type: 'n8n-nodes-base.code', typeVersion: 2,
      parameters: { jsCode: codeExtraer } },
    { name: 'Es cliente?', type: 'n8n-nodes-base.if', typeVersion: 2,
      parameters: { conditions: { options: { caseSensitive: false }, combinator: 'or',
        conditions: [{ id: 'menu', leftValue: '={{ $json.text }}',
          operator: { type: 'string', operation: 'regex', regex: '^(hola|menu|ayuda|precio|envio|pedido)' } }] } } },
    { name: 'Responder menu', type: 'n8n-nodes-base.code', typeVersion: 2,
      parameters: { jsCode: codeMenu } },
    { name: 'Buscar catalogo', type: 'n8n-nodes-base.supabase', typeVersion: 1,
      parameters: { operation: 'executeQuery', query: RICH_QUERY } },
    { name: 'Armar contexto', type: 'n8n-nodes-base.code', typeVersion: 2,
      parameters: { jsCode: codeContexto } },
    { name: 'Respuesta IA', type: '@n8n/n8n-nodes-langchain.openAi', typeVersion: 1.8,
      parameters: { operation: 'message', model: 'gpt-4o-mini',
        messages: { values: [{ role: 'system', content: [
'Sos la asesora de Skin Health Paraguay. Hablás como una persona: español PY con voseo, cálida, corta (máximo 4 líneas por mensaje), un tema por mensaje, hacés UNA pregunta por vez para entender la piel del cliente.',
'Usás SOLO la info del catálogo de abajo: para qué sirve cada producto, ingredientes, tipo de piel, modo de uso, precio en Gs. Si no sabés algo, decilo y ofrecé pasarle con una asesora humana.',
'Nunca diagnostiques enfermedades ni prometas resultados médicos; ante casos serios sugerí dermatólogo.',
'Cerrás con el link de la tienda para pedir. Envío: 8.000 base + 2.000/km.',
'FICHAS DE PRODUCTOS:',
'{{ $json.catalogo }}',
'Pregunta del cliente: {{ $json.pregunta }}',
        ].join('\n') }] } } },
    { name: 'Responder producto', type: 'n8n-nodes-base.code', typeVersion: 2,
      parameters: { jsCode: codeReply } },
    { name: 'Enviar WhatsApp', type: 'n8n-nodes-base.httpRequest', typeVersion: 4.2,
      parameters: { method: 'POST',
        url: '=https://graph.facebook.com/v21.0/CAMBIA_PHONE_NUMBER_ID/messages',
        sendBody: true, specifyBody: 'json',
        jsonBody: '={ "messaging_product": "whatsapp", "to": "{{ $json.to }}", "type": "text", "text": { "body": "{{ $json.reply }}" } }' } },
  ],
  connections: {
    'Webhook WhatsApp': { main: [[{ node: 'Extraer mensaje', type: 'main', index: 0 }]] },
    'Extraer mensaje': { main: [[{ node: 'Es cliente?', type: 'main', index: 0 }]] },
    'Es cliente?': { main: [
      [{ node: 'Buscar catalogo', type: 'main', index: 0 }],
      [{ node: 'Responder menu', type: 'main', index: 0 }]] },
    'Responder menu': { main: [[{ node: 'Enviar WhatsApp', type: 'main', index: 0 }]] },
    'Buscar catalogo': { main: [[{ node: 'Armar contexto', type: 'main', index: 0 }]] },
    'Armar contexto': { main: [[{ node: 'Respuesta IA', type: 'main', index: 0 }]] },
    'Respuesta IA': { main: [[{ node: 'Responder producto', type: 'main', index: 0 }]] },
    'Responder producto': { main: [[{ node: 'Enviar WhatsApp', type: 'main', index: 0 }]] },
  },
  settings: {},
};

fs.writeFileSync('./whatsapp-bot/workflow.json', JSON.stringify(wf));
console.log('escrito OK, nodos:', wf.nodes.length);

const fs = require('fs');

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
"const catalogo = items.map(p => '- ' + p.nombre + ' ' + p.marca + ': Gs ' + p.precio_gs + ' (' + p.rating + ', ' + p.reviews_count + ' reviews)').join('\\n');",
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
      parameters: { operation: 'executeQuery',
        query: 'select nombre, marca, precio_gs, rating, reviews_count from productos where activo=true order by reviews_count desc limit 20;' } },
    { name: 'Armar contexto', type: 'n8n-nodes-base.code', typeVersion: 2,
      parameters: { jsCode: codeContexto } },
    { name: 'Respuesta IA', type: '@n8n/n8n-nodes-langchain.openAi', typeVersion: 1.8,
      parameters: { operation: 'message', model: 'gpt-4o-mini',
        messages: { values: [{ role: 'system',
          content: '=Eres de Skin Health PY. Responde en español PY, corto, precio en Gs, CTA a {{ $json.TIENDA_URL }}. Catálogo:\n{{ $json.catalogo }}\nPregunta: {{ $json.pregunta }}' }] } } },
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

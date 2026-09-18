import crypto from 'crypto';

// Vercel: disable auto JSON parsing to verify raw body
export const config = { api: { bodyParser: false } };

async function getRawBody(req: any): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on('data', (c: Buffer) => chunks.push(c));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  const raw = await getRawBody(req);
  const signature = req.headers['x-webhook-signature'] as string | undefined;
  const event = req.headers['x-webhook-event'] as string | undefined;
  const secret = process.env.KAPSO_WEBHOOK_SECRET;

  // Verify signature if secret configured (SKILL: references/webhooks-overview.md:35)
  if (secret && signature) {
    const expected = crypto.createHmac('sha256', secret).update(raw).digest('hex');
    if (expected !== signature) {
      console.error('Invalid webhook signature', { event, expected: expected.slice(0,8)+'…' });
      return res.status(401).send('Invalid signature');
    }
  }

  // Must return 200 within 10s (SKILL: webhooks-overview.md:27)
  let payload: any;
  try {
    payload = JSON.parse(raw.toString('utf8'));
  } catch {
    payload = {};
  }

  console.log(`[whatsapp webhook] ${event}`, JSON.stringify(payload).slice(0, 2000));

  // Handle batching: Kapso may send X-Webhook-Batch: true with array
  const events = Array.isArray(payload) ? payload : [payload];

  for (const evt of events) {
    // v2 payload: phone_number_id at root, message in evt.data or evt.payload
    const type = evt.type || evt.event || event;
    if (type === 'whatsapp.message.received' || event === 'whatsapp.message.received') {
      const msg = evt.data || evt.payload || evt;
      const from = msg.from || msg.source || msg.contact?.wa_id || msg.from_number;
      const text = msg.text?.body || msg.message?.text?.body || '';
      console.log(`Inbound from ${from}: ${text}`);

      // SKIN HEALTH auto-reply
      if (from) {
        const phoneNumberId = process.env.KAPSO_PHONE_NUMBER_ID || '597907523413541';
        const apiKey = process.env.KAPSO_API_KEY;
        if (!apiKey) {
          console.warn('KAPSO_API_KEY missing — skipping auto-reply');
        } else {
          try {
            const resp = await fetch(`https://api.kapso.ai/meta/whatsapp/v24.0/${phoneNumberId}/messages`, {
              method: 'POST',
              headers: {
                'X-API-Key': apiKey,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                messaging_product: 'whatsapp',
                to: from,
                type: 'text',
                text: { body: '¡Hola! 👋 Aquí Skin Health 💙✨ ¿En qué puedo ayudarte hoy?' },
              }),
            });
            console.log(`Auto-reply to ${from}: ${resp.status} ${await resp.text().then(t=>t.slice(0,300))}`);
          } catch (e) {
            console.error('Auto-reply failed', e);
          }
        }
      }
    }
  }

  return res.status(200).json({ received: true });
}

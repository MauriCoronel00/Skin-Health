# Bot WhatsApp Skin Health (n8n)

Responde consultas con tu catálogo real de Supabase. Español PY, precios en Gs, CTA a la tienda.

## Importar
n8n → Workflows → Import from file → `workflow.json`.
(Regenerar: `node whatsapp-bot/build-workflow.cjs`.)

## Conectar (todo en la UI de n8n, nada viene pre-conectado)
1. **Meta WhatsApp Business**: `Enviar WhatsApp` → cambia `CAMBIA_PHONE_NUMBER_ID` en la URL + credential con tu token de Meta.
2. **Supabase**: nodo `Buscar catalogo` → tu credential del proyecto.
3. **IA**: nodo `Respuesta IA` → tu credential (OpenAI o Gemini, ajusta el modelo).
4. **Webhook**: copia la URL del nodo `Webhook WhatsApp` → Meta App → WhatsApp → Configuration.

## Flujo
Mensaje → menú (hola/precio/envío/pedido) o respuesta IA con catálogo → envío por WhatsApp.

## Límites honestos
- Sin MCP n8n en esta sesión: no validado ni probado acá. Probalo en n8n con un mensaje real antes de publicar.
- El número que atiende debe ser WhatsApp Business API (no sirve tu número personal con esta plantilla).

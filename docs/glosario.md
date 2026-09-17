# Glosario — Skin Health Shop

Lenguaje compartido del dominio. Si el código usa otro nombre, el código está mal.

| Término | Definición | Tabla / código |
|---|---|---|
| Pedido | Compra de un cliente. Fuente de verdad en `pedidos`; WhatsApp es solo aviso. | `pedidos` |
| PedidoItem | Línea del pedido: producto + cantidad + precio unitario al momento de compra. | `pedido_items` |
| Producto | Ítem vendible del catálogo. Solo se vende si `activo = true`. | `productos` |
| Categoría | Agrupación del catálogo (`hydrate, brighten, calm, protect, cleanse`). | `categorias` |
| Beneficio | Punto de venta de un producto, con orden de display. | `producto_beneficios` |
| Perfil | Datos del usuario autenticado (1:1 con `auth.users`). | `perfiles` |
| Rol | `cliente` (default) o `admin`. Define acceso al panel y a policies. | `perfiles.rol` |
| MovimientoStock | Registro de entrada/salida de stock ligado a un pedido (`motivo='venta'`). | `movimientos_stock` |
| Review | Opinión de un producto. Solo las `approved` son públicas y agregan rating. | `reviews` |
| EstadoPedido | `pendiente → pagado → enviado → entregado`, o `cancelado`. Solo admin avanza estados. | `pedidos.estado` |
| ComprobantePago | Referencia/URL del comprobante de transferencia enviado por WhatsApp. | `pedidos.referencia_pago`, `comprobante_url` |
| CódigoPedido | Identificador legible del pedido (`SKIN-XXXXXXXX`), generado server-side, único. | `pedidos.codigo_pedido` |
| TotalGs | Total del pedido en guaraníes, calculado server-side por `crear_pedido`. | `pedidos.total_gs` |
| Stock | Existencias por producto. Se descuenta al pasar a `pagado` (trigger). | `productos.stock` |

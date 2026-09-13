import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Trash2,
  Plus,
  Minus,
  MessageCircle,
  ShoppingBag,
  ArrowRight,
  Check,
  Copy,
  Sparkles,
  MapPin,
  User,
  Link2,
} from 'lucide-react';
import { CartItem } from '../types';
import { formatGuarani, STORE_PHONE_NUMBER } from '../data/products';
import { BrandLogo } from './BrandLogo';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}) => {
  const [customerName, setCustomerName] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [googleMapsUrl, setGoogleMapsUrl] = useState('');
  const [isOrdering, setIsOrdering] = useState(false);
  const [copied, setCopied] = useState(false);

  const totalAmount = cartItems.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // Generate WhatsApp Message strictly following Section 14 specifications
  const buildWhatsAppMessage = () => {
    const itemsLines = cartItems
      .map(
        (item) =>
          `• ${item.product.name} x${item.quantity} — ${formatGuarani(
            item.product.price * item.quantity
          )}`
      )
      .join('\n');

    let message = `Hola 👋 Quiero realizar el siguiente pedido:\n\n🛍️ MI PEDIDO\n\n${itemsLines}\n\n💰 TOTAL: ${formatGuarani(
      totalAmount
    )}\n\nQuisiera confirmar disponibilidad y coordinar la entrega.`;

    message += `\n\n📍 DATOS PARA EL ENVÍO (REQUISITOS):\n• Nombre del cliente: ${
      customerName.trim() ? customerName.trim() : '[Indicar mi nombre]'
    }\n• Lugar de ubicación: ${
      customerAddress.trim() ? customerAddress.trim() : '[Indicar ciudad/dirección]'
    }\n• Link de Google Maps: ${
      googleMapsUrl.trim() ? googleMapsUrl.trim() : '[Adjuntar enlace de Google Maps o ubicación]'
    }\n\n¡Muchas gracias!`;

    return message;
  };

  const handleOrderWhatsApp = () => {
    if (cartItems.length === 0) return;

    setIsOrdering(true);

    const message = buildWhatsAppMessage();
    const encoded = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${STORE_PHONE_NUMBER}?text=${encoded}`;

    // Microinteraction delay
    setTimeout(() => {
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
      setIsOrdering(false);
    }, 450);
  };

  const handleCopyOrder = () => {
    const message = buildWhatsAppMessage();
    navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
      />

      {/* Drawer Container: Responsive Bottom Sheet on mobile, Right Drawer on Desktop */}
      <div className="fixed inset-y-0 right-0 flex max-w-full pl-0 sm:pl-10 pointer-events-none items-end sm:items-stretch">
        <motion.div
          initial={{ y: '100%', opacity: 0.5 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          className="pointer-events-auto w-screen max-w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-l-3xl sm:rounded-tr-none shadow-2xl flex flex-col max-h-[92vh] sm:max-h-screen h-full"
        >
          {/* Mobile Drag Indicator Pill */}
          <div className="sm:hidden pt-3 pb-1 flex justify-center">
            <div className="w-12 h-1.5 bg-neutral-300 rounded-full" />
          </div>

          {/* Drawer Header */}
          <div className="px-5 py-4 border-b border-neutral-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#102A43]" />
              <h2 className="font-semibold text-lg text-[#102A43]">
                Mi Pedido
              </h2>
              {totalItems > 0 && (
                <span className="bg-[#102A43]/10 text-[#102A43] text-xs font-bold px-2 py-0.5 rounded-full">
                  {totalItems}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1">
              {cartItems.length > 0 && (
                <button
                  onClick={onClearCart}
                  className="text-xs text-neutral-400 hover:text-red-600 px-2 py-1 rounded-md transition-colors"
                  title="Vaciar carrito"
                >
                  Vaciar
                </button>
              )}
              <button
                onClick={onClose}
                className="p-1.5 rounded-full text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
                aria-label="Cerrar pedido"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
            {cartItems.length === 0 ? (
              <div className="text-center py-16 flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-[#FAF8F5] flex items-center justify-center text-neutral-300 mb-4">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="font-medium text-neutral-800 text-base mb-1">
                  Tu carrito está vacío
                </h3>
                <p className="text-sm text-neutral-400 max-w-xs mb-6">
                  Explora nuestro catálogo y presiona &quot;+&quot; en los productos que deseas pedir.
                </p>
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 bg-[#102A43] text-white text-sm font-medium rounded-full hover:bg-[#102A43]/90 transition-colors"
                >
                  Explorar Catálogo
                </button>
              </div>
            ) : (
              <AnimatePresence initial={false}>
                {cartItems.map((item) => (
                  <motion.div
                    key={item.product.id}
                    layout
                    initial={{ opacity: 0, height: 0, y: -10 }}
                    animate={{ opacity: 1, height: 'auto', y: 0 }}
                    exit={{ opacity: 0, height: 0, scale: 0.9 }}
                    transition={{ duration: 0.25 }}
                    className="flex items-start gap-3 p-3 bg-[#FAF8F5] rounded-2xl border border-[#102A43]/5"
                  >
                    {/* Item Image */}
                    <div className="w-16 h-16 shrink-0 rounded-xl bg-white p-1.5 flex items-center justify-center border border-neutral-100 overflow-hidden">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-full h-full object-contain mix-blend-multiply"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-1">
                        <div>
                          <span className="text-[10px] font-semibold uppercase tracking-wider text-[#102A43]/60">
                            {item.product.brand}
                          </span>
                          <h4 className="text-sm font-medium text-neutral-900 leading-tight line-clamp-2">
                            {item.product.name}
                          </h4>
                        </div>
                        <button
                          onClick={() => onRemoveItem(item.product.id)}
                          className="text-neutral-400 hover:text-red-500 p-1 transition-colors"
                          title="Eliminar del pedido"
                          aria-label={`Eliminar ${item.product.name}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="text-xs text-neutral-500 mt-0.5">
                        Unitario: {formatGuarani(item.product.price)}
                      </div>

                      {/* Quantity Controls & Subtotal */}
                      <div className="flex items-center justify-between mt-2.5">
                        {/* Stepper */}
                        <div className="flex items-center bg-white rounded-lg border border-neutral-200 p-0.5 shadow-2xs">
                          <button
                            onClick={() => onUpdateQuantity(item.product.id, -1)}
                            className="w-6 h-6 flex items-center justify-center text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-md transition-colors"
                            aria-label="Disminuir cantidad"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <motion.span
                            key={item.quantity}
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            className="w-8 text-center text-xs font-semibold text-neutral-800"
                          >
                            {item.quantity}
                          </motion.span>
                          <button
                            onClick={() => onUpdateQuantity(item.product.id, 1)}
                            className="w-6 h-6 flex items-center justify-center text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-md transition-colors"
                            aria-label="Aumentar cantidad"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Line subtotal */}
                        <span className="font-semibold text-sm text-[#102A43]">
                          {formatGuarani(item.product.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}

            {/* Requisitos para el envío (Paso 4) */}
            {cartItems.length > 0 && (
              <div className="pt-2">
                <div className="p-3.5 bg-[#FAF8F5] rounded-2xl border border-emerald-600/20 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                        4
                      </span>
                      <span className="text-xs font-semibold text-[#102A43]">
                        Requisitos para el envío
                      </span>
                    </div>
                    <span className="text-[10px] text-neutral-400">Paso 4 de 4</span>
                  </div>

                  <div className="space-y-2.5">
                    {/* 1. Nombre del cliente */}
                    <div>
                      <label className="block text-[11px] font-medium text-neutral-700 mb-1">
                        Nombre del cliente:
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Ej. María Coronel"
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          className="w-full text-xs bg-white border border-neutral-200 rounded-lg py-1.5 pl-7 pr-2 text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:border-[#102A43]"
                        />
                        <User className="w-3.5 h-3.5 text-neutral-400 absolute left-2 top-1/2 -translate-y-1/2" />
                      </div>
                    </div>

                    {/* 2. Lugar de ubicación para envío */}
                    <div>
                      <label className="block text-[11px] font-medium text-neutral-700 mb-1">
                        Lugar de ubicación para el envío:
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Ej. Barrio Herrera, Asunción"
                          value={customerAddress}
                          onChange={(e) => setCustomerAddress(e.target.value)}
                          className="w-full text-xs bg-white border border-neutral-200 rounded-lg py-1.5 pl-7 pr-2 text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:border-[#102A43]"
                        />
                        <MapPin className="w-3.5 h-3.5 text-neutral-400 absolute left-2 top-1/2 -translate-y-1/2" />
                      </div>
                    </div>

                    {/* 3. Link de Google Maps */}
                    <div>
                      <label className="block text-[11px] font-medium text-neutral-700 mb-1">
                        Link de Google Maps:
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Ej. https://maps.app.goo.gl/... o enlace de ubicación"
                          value={googleMapsUrl}
                          onChange={(e) => setGoogleMapsUrl(e.target.value)}
                          className="w-full text-xs bg-white border border-neutral-200 rounded-lg py-1.5 pl-7 pr-2 text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:border-[#102A43]"
                        />
                        <Link2 className="w-3.5 h-3.5 text-neutral-400 absolute left-2 top-1/2 -translate-y-1/2" />
                      </div>
                      <p className="text-[10px] text-neutral-500 mt-1">
                        💡 Si no tenés el link ahora, también podés adjuntar tu ubicación en vivo directamente en WhatsApp.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Drawer Footer (Summary & WhatsApp Checkout CTA) */}
          {cartItems.length > 0 && (
            <div className="p-5 bg-white border-t border-neutral-100 shadow-lg space-y-3">
              {/* Pricing breakdown */}
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between text-neutral-500 text-xs">
                  <span>Productos ({totalItems})</span>
                  <span>{formatGuarani(totalAmount)}</span>
                </div>
                <div className="flex justify-between text-neutral-500 text-xs">
                  <span>Envío</span>
                  <span className="text-emerald-600 font-medium">A coordinar por WhatsApp</span>
                </div>
                <div className="flex justify-between items-baseline pt-2 border-t border-neutral-100">
                  <span className="font-semibold text-base text-neutral-900">
                    TOTAL ESTIMADO
                  </span>
                  <motion.span
                    key={totalAmount}
                    initial={{ scale: 0.95 }}
                    animate={{ scale: 1 }}
                    className="font-bold text-xl text-[#102A43]"
                  >
                    {formatGuarani(totalAmount)}
                  </motion.span>
                </div>
              </div>

              {/* SECTION 14: Primary CTA - PEDIR POR WHATSAPP */}
              <motion.button
                id="whatsapp-checkout-btn"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleOrderWhatsApp}
                disabled={isOrdering}
                className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-base py-3.5 px-5 rounded-2xl shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2.5 transition-all cursor-pointer relative overflow-hidden group"
              >
                <MessageCircle className="w-5 h-5 fill-white text-[#25D366]" />
                <span>
                  {isOrdering ? 'Preparando pedido...' : 'PEDIR POR WHATSAPP →'}
                </span>
              </motion.button>

              {/* Micro-helper to copy message as fallback */}
              <div className="flex items-center justify-between pt-1 text-[11px] text-neutral-400">
                <span>Respuesta rápida garantizada</span>
                <button
                  type="button"
                  onClick={handleCopyOrder}
                  className="hover:text-[#102A43] flex items-center gap-1 transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span className="text-emerald-600 font-medium">Copiado al portapapeles</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copiar texto del pedido</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

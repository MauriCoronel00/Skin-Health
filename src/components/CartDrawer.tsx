import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Trash2,
  Plus,
  Minus,
  MessageCircle,
  ShoppingBag,
  Check,
  Copy,
  MapPin,
  User,
  Phone,
  Link2,
  ShieldCheck,
  Truck,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { CartItem } from '../types';
import { formatGuarani, STORE_PHONE_NUMBER } from '../data/products';
import { trackBeginCheckout, trackOrderSubmitted } from '../utils/analytics';
import { OrderDetails } from './OrderConfirmationModal';

const CUSTOMER_DATA_KEY = 'skinhealth_customer_data_v1';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onOrderSuccess: (order: OrderDetails) => void;
  onShowToast: (title: string, description?: string, type?: 'success' | 'error' | 'info', showWhatsAppFallback?: boolean) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onOrderSuccess,
  onShowToast,
}) => {
  // Customer data state with localStorage persistence
  const [customerName, setCustomerName] = useState(() => {
    try {
      const saved = localStorage.getItem(CUSTOMER_DATA_KEY);
      if (saved) return JSON.parse(saved).customerName || '';
    } catch {}
    return '';
  });

  const [customerPhone, setCustomerPhone] = useState(() => {
    try {
      const saved = localStorage.getItem(CUSTOMER_DATA_KEY);
      if (saved) return JSON.parse(saved).customerPhone || '';
    } catch {}
    return '';
  });

  const [customerAddress, setCustomerAddress] = useState(() => {
    try {
      const saved = localStorage.getItem(CUSTOMER_DATA_KEY);
      if (saved) return JSON.parse(saved).customerAddress || '';
    } catch {}
    return '';
  });

  const [googleMapsUrl, setGoogleMapsUrl] = useState(() => {
    try {
      const saved = localStorage.getItem(CUSTOMER_DATA_KEY);
      if (saved) return JSON.parse(saved).googleMapsUrl || '';
    } catch {}
    return '';
  });

  // Inline validation state on blur
  const [touched, setTouched] = useState<{
    name?: boolean;
    phone?: boolean;
    address?: boolean;
  }>({});

  const [isOrdering, setIsOrdering] = useState(false);
  const [copied, setCopied] = useState(false);

  // Synchronize customer info with localStorage
  useEffect(() => {
    try {
      localStorage.setItem(
        CUSTOMER_DATA_KEY,
        JSON.stringify({
          customerName,
          customerPhone,
          customerAddress,
          googleMapsUrl,
        })
      );
    } catch {}
  }, [customerName, customerPhone, customerAddress, googleMapsUrl]);

  const totalAmount = cartItems.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // Track begin_checkout when the drawer opens with items
  useEffect(() => {
    if (isOpen && cartItems.length > 0) {
      trackBeginCheckout(cartItems, totalAmount);
    }
  }, [isOpen, cartItems.length, totalAmount]);

  const handleBlur = (field: 'name' | 'phone' | 'address') => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const nameError = touched.name && !customerName.trim() ? 'Ingresá tu nombre para registrar tu pedido.' : null;
  const addressError =
    touched.address && !customerAddress.trim()
      ? 'Indicá tu barrio y ciudad para coordinar el envío.'
      : null;

  // Generate WhatsApp Message
  const buildWhatsAppMessage = (orderId: string) => {
    const itemsLines = cartItems
      .map(
        (item) =>
          `• ${item.product.name} x${item.quantity} — ${formatGuarani(
            item.product.price * item.quantity
          )}`
      )
      .join('\n');

    let message = `Hola 👋 Quiero realizar el pedido *${orderId}* en *Skin Health*:\n\n🛍️ *PRODUCTOS SELECCIONADOS*\n${itemsLines}\n\n💰 *TOTAL ESTIMADO*: ${formatGuarani(
      totalAmount
    )}\n\n📍 *REQUISITOS PARA EL ENVÍO*:\n• *Nombre del cliente*: ${
      customerName.trim() ? customerName.trim() : '[Por especificar]'
    }\n• *Teléfono de contacto*: ${
      customerPhone.trim() ? customerPhone.trim() : '[Por especificar]'
    }\n• *Lugar de ubicación*: ${
      customerAddress.trim() ? customerAddress.trim() : '[Por especificar]'
    }`;

    if (googleMapsUrl.trim()) {
      message += `\n• *Link de Google Maps*: ${googleMapsUrl.trim()}`;
    }

    message += `\n\nQuedo a la espera de confirmación de stock y métodos de pago. ¡Muchas gracias!`;

    return message;
  };

  const handleOrderWhatsApp = () => {
    if (cartItems.length === 0) {
      onShowToast('El carrito está vacío', 'Agregá productos antes de confirmar.', 'error');
      return;
    }

    // Require at least name or address, but guide user gently
    if (!customerName.trim() || !customerAddress.trim()) {
      setTouched({ name: true, address: true });
      onShowToast(
        'Datos para el envío',
        'Por favor completa tu nombre y ubicación para que podamos coordinar la entrega.',
        'info'
      );
    }

    setIsOrdering(true);

    const orderId = `#SKIN-${Math.floor(10000 + Math.random() * 90000)}`;
    const message = buildWhatsAppMessage(orderId);
    const encoded = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${STORE_PHONE_NUMBER}?text=${encoded}`;

    // Track purchase / order submission event
    trackOrderSubmitted(orderId, cartItems, totalAmount);

    setTimeout(() => {
      let opened = false;
      try {
        const win = window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
        if (win) {
          opened = true;
        }
      } catch (err) {
        opened = false;
      }

      setIsOrdering(false);

      // Trigger post-purchase confirmation modal with unique order code
      onOrderSuccess({
        orderId,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerAddress: customerAddress.trim(),
        googleMapsUrl: googleMapsUrl.trim(),
        items: [...cartItems],
        totalAmount,
        date: new Date().toLocaleDateString('es-PY', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        }),
      });

      if (!opened) {
        onShowToast(
          'Tu pedido fue registrado',
          'Si no se abrió WhatsApp automáticamente, podés hacer clic abajo.',
          'info',
          true
        );
      }
    }, 400);
  };

  const handleCopyOrder = () => {
    const tempOrderId = `#SKIN-${Math.floor(10000 + Math.random() * 90000)}`;
    const message = buildWhatsAppMessage(tempOrderId);
    try {
      navigator.clipboard.writeText(message);
      setCopied(true);
      onShowToast('Copiado al portapapeles', 'Texto del pedido listo para pegar en WhatsApp.', 'success');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      onShowToast('Error al copiar', 'Copia manualmente el texto del pedido.', 'error');
    }
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

      {/* Drawer Container */}
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
          <div className="px-5 py-4 border-b border-neutral-100 flex items-center justify-between shrink-0">
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
                  className="text-xs text-neutral-400 hover:text-red-600 px-2 py-1 rounded-md transition-colors cursor-pointer"
                  title="Vaciar carrito"
                >
                  Vaciar
                </button>
              )}
              <button
                onClick={onClose}
                className="p-1.5 rounded-full text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer"
                aria-label="Cerrar pedido"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Scrollable Content Area: REQUISITOS DEL CLIENTE PRIMERO, SEGUIDOS DE LA VISTA PREVIA DE PRODUCTOS */}
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
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
                  className="px-5 py-2.5 bg-[#102A43] text-white text-sm font-medium rounded-full hover:bg-[#102A43]/90 transition-colors cursor-pointer"
                >
                  Explorar Catálogo
                </button>
              </div>
            ) : (
              <>
                {/* Datos para el envío (Casillas de completado) */}
                <div className="p-4 bg-[#FAF8F5] rounded-2xl border border-neutral-200/80 space-y-3.5 shadow-2xs">
                  <div className="space-y-3">
                    {/* 1. Nombre del cliente */}
                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                        Nombre del cliente <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          id="cart-customer-name"
                          type="text"
                          name="name"
                          autoComplete="name"
                          autoCapitalize="words"
                          placeholder="Ej. María Coronel"
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          onBlur={() => handleBlur('name')}
                          className={`w-full text-xs bg-white border rounded-lg py-2 pl-7 pr-2.5 text-neutral-800 placeholder:text-neutral-400 focus:outline-none transition-colors ${
                            nameError
                              ? 'border-rose-400 focus:border-rose-500 bg-rose-50/20'
                              : 'border-neutral-200 focus:border-[#102A43]'
                          }`}
                        />
                        <User className="w-3.5 h-3.5 text-neutral-400 absolute left-2 top-1/2 -translate-y-1/2" />
                      </div>
                      {nameError && (
                        <p className="text-[10px] text-rose-500 flex items-center gap-1 mt-1 font-medium">
                          <AlertCircle className="w-3 h-3 shrink-0" />
                          <span>{nameError}</span>
                        </p>
                      )}
                    </div>

                    {/* 2. Teléfono de contacto */}
                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                        Teléfono de contacto (WhatsApp):
                      </label>
                      <div className="relative">
                        <input
                          id="cart-customer-phone"
                          type="tel"
                          inputMode="tel"
                          name="tel"
                          autoComplete="tel"
                          placeholder="Ej. 0971 123 456"
                          value={customerPhone}
                          onChange={(e) => setCustomerPhone(e.target.value)}
                          onBlur={() => handleBlur('phone')}
                          className="w-full text-xs bg-white border border-neutral-200 rounded-lg py-2 pl-7 pr-2.5 text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:border-[#102A43] transition-colors"
                        />
                        <Phone className="w-3.5 h-3.5 text-neutral-400 absolute left-2 top-1/2 -translate-y-1/2" />
                      </div>
                    </div>

                    {/* 3. Lugar de ubicación para envío */}
                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                        Lugar de ubicación para el envío <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          id="cart-customer-address"
                          type="text"
                          name="street-address"
                          autoComplete="street-address"
                          autoCapitalize="sentences"
                          placeholder="Ej. Barrio Herrera, Asunción"
                          value={customerAddress}
                          onChange={(e) => setCustomerAddress(e.target.value)}
                          onBlur={() => handleBlur('address')}
                          className={`w-full text-xs bg-white border rounded-lg py-2 pl-7 pr-2.5 text-neutral-800 placeholder:text-neutral-400 focus:outline-none transition-colors ${
                            addressError
                              ? 'border-rose-400 focus:border-rose-500 bg-rose-50/20'
                              : 'border-neutral-200 focus:border-[#102A43]'
                          }`}
                        />
                        <MapPin className="w-3.5 h-3.5 text-neutral-400 absolute left-2 top-1/2 -translate-y-1/2" />
                      </div>
                      {addressError && (
                        <p className="text-[10px] text-rose-500 flex items-center gap-1 mt-1 font-medium">
                          <AlertCircle className="w-3 h-3 shrink-0" />
                          <span>{addressError}</span>
                        </p>
                      )}
                    </div>

                    {/* 4. Link de Google Maps */}
                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                        Link de Google Maps:
                      </label>
                      <div className="relative">
                        <input
                          id="cart-customer-maps"
                          type="url"
                          inputMode="url"
                          autoComplete="off"
                          placeholder="Ej. https://maps.app.goo.gl/... o enlace de ubicación"
                          value={googleMapsUrl}
                          onChange={(e) => setGoogleMapsUrl(e.target.value)}
                          className="w-full text-xs bg-white border border-neutral-200 rounded-lg py-2 pl-7 pr-2.5 text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:border-[#102A43] transition-colors"
                        />
                        <Link2 className="w-3.5 h-3.5 text-neutral-400 absolute left-2 top-1/2 -translate-y-1/2" />
                      </div>
                      <p className="text-[10px] text-neutral-500 mt-1">
                        💡 Si no tenés el link ahora, también podés adjuntar tu ubicación en tiempo real directamente en WhatsApp.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Lista de productos seleccionados */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-xs text-neutral-500 px-1">
                    <span className="font-semibold uppercase tracking-wider text-[#102A43]">
                      Productos seleccionados ({totalItems})
                    </span>
                    <span>Subtotal</span>
                  </div>

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
                            loading="lazy"
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
                              className="text-neutral-400 hover:text-red-500 p-1 transition-colors cursor-pointer"
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
                                className="w-6 h-6 flex items-center justify-center text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-md transition-colors cursor-pointer"
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
                                className="w-6 h-6 flex items-center justify-center text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-md transition-colors cursor-pointer"
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
                </div>
              </>
            )}
          </div>

          {/* Sticky Drawer Footer (Summary & WhatsApp Checkout CTA) with safe area padding */}
          {cartItems.length > 0 && (
            <div className="p-4 sm:p-5 bg-white border-t border-neutral-100 shadow-xl space-y-3 shrink-0 pb-[calc(env(safe-area-inset-bottom)+1rem)]">
              {/* Pricing breakdown */}
              <div className="space-y-1 text-sm">
                <div className="flex justify-between text-neutral-500 text-xs">
                  <span>Productos ({totalItems})</span>
                  <span>{formatGuarani(totalAmount)}</span>
                </div>
                <div className="flex justify-between text-neutral-500 text-xs">
                  <span>Envío</span>
                  <span className="text-emerald-600 font-medium">A coordinar por WhatsApp</span>
                </div>
                <div className="flex justify-between items-baseline pt-1.5 border-t border-neutral-100">
                  <span className="font-semibold text-sm sm:text-base text-neutral-900">
                    TOTAL ESTIMADO
                  </span>
                  <motion.span
                    key={totalAmount}
                    initial={{ scale: 0.95 }}
                    animate={{ scale: 1 }}
                    className="font-bold text-lg sm:text-xl text-[#102A43]"
                  >
                    {formatGuarani(totalAmount)}
                  </motion.span>
                </div>
              </div>

              {/* PRIMARY CTA - PEDIR POR WHATSAPP with loading state, anti-double click protection */}
              <motion.button
                id="whatsapp-checkout-btn"
                whileHover={!isOrdering ? { scale: 1.01 } : {}}
                whileTap={!isOrdering ? { scale: 0.98 } : {}}
                onClick={handleOrderWhatsApp}
                disabled={isOrdering}
                className={`w-full font-bold text-base py-3.5 px-5 rounded-2xl shadow-lg flex items-center justify-center gap-2.5 transition-all cursor-pointer relative overflow-hidden ${
                  isOrdering
                    ? 'bg-neutral-400 text-white cursor-not-allowed shadow-none'
                    : 'bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-emerald-500/25'
                }`}
              >
                {isOrdering ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Preparando tu pedido...</span>
                  </>
                ) : (
                  <>
                    <MessageCircle className="w-5 h-5 fill-white text-[#25D366]" />
                    <span>PEDIR POR WHATSAPP →</span>
                  </>
                )}
              </motion.button>

              {/* Micro-copys de confianza */}
              <div className="grid grid-cols-3 gap-1 pt-1 text-[10px] text-neutral-500 text-center border-t border-neutral-100/80">
                <div className="flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-600 shrink-0" />
                  <span>Pago 100% seguro</span>
                </div>
                <div className="flex items-center justify-center gap-1">
                  <Truck className="w-3 h-3 text-sky-600 shrink-0" />
                  <span>Envío coordinado</span>
                </div>
                <div className="flex items-center justify-center gap-1">
                  <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                  <span>Stock verificado</span>
                </div>
              </div>

              {/* Fallback to copy order text */}
              <div className="flex items-center justify-between text-[11px] text-neutral-400 pt-0.5">
                <span>Atención oficial Skin Health</span>
                <button
                  type="button"
                  onClick={handleCopyOrder}
                  className="hover:text-[#102A43] flex items-center gap-1 transition-colors cursor-pointer"
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

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Trash2,
  Plus,
  Minus,
  MessageCircle,
  ShoppingBag,
  Check,
  MapPin,
  User,
  Phone,
  Link2,
  ShieldCheck,
  Truck,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { CartItem } from '../types';
import { productImageUrl } from '../data/productImage';
import { ZONAS_COBERTURA, METODOS_PAGO, type ZonaEnvio, type MetodoPagoId } from '../data/zonasEnvio';
import { trackBeginCheckout } from '../utils/analytics';
import { OrderDetails } from './OrderConfirmationModal';
import { ZonaCard } from './ZonaCard';
import {
  createPedido,
  PedidoError,
  PedidoReceipt,
} from '../data/pedidos';
import { useLanguage } from '../contexts/LanguageContext';

const CUSTOMER_DATA_KEY = 'skinhealth_customer_data_v1';
/** Anti-spam: segundos mínimos entre pedidos desde el mismo dispositivo. */
const ORDER_THROTTLE_KEY = 'skinhealth_last_order_ts';
const ORDER_MIN_GAP_SECONDS = 45;

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
  const { t, formatCurrency, dateLocale } = useLanguage();

  /** Descripción del error de pedido localizada por código. */
  const pedErrDesc = (err: PedidoError): string => {
    switch (err.code) {
      case 'EMPTY': return t.pedErrEmpty;
      case 'CUSTOMER_DATA': return t.pedErrCustomerData;
      case 'NOT_AUTHENTICATED': return t.pedErrAuth;
      case 'NO_STOCK': return t.pedErrStock;
      case 'UNAVAILABLE': return t.pedErrUnavailable;
      default: return t.pedErrFailed;
    }
  };

  // Customer data state with localStorage persistence
  const [customerName, setCustomerName] = useState(() => {
    try {
      const saved = localStorage.getItem(CUSTOMER_DATA_KEY);
      if (saved) return JSON.parse(saved).customerName || '';
    } catch {
      // ignore
    }
    return '';
  });

  const [customerPhone, setCustomerPhone] = useState(() => {
    try {
      const saved = localStorage.getItem(CUSTOMER_DATA_KEY);
      if (saved) return JSON.parse(saved).customerPhone || '';
    } catch {
      // ignore
    }
    return '';
  });

  const [googleMapsUrl, setGoogleMapsUrl] = useState(() => {
    try {
      const saved = localStorage.getItem(CUSTOMER_DATA_KEY);
      if (saved) return JSON.parse(saved).googleMapsUrl || '';
    } catch {
      // ignore
    }
    return '';
  });

  // Inline validation state on blur
  const [touched, setTouched] = useState<{
    name?: boolean;
    phone?: boolean;
    address?: boolean;
  }>({});

  const [isOrdering, setIsOrdering] = useState(false);
  const [selectedZonaKey, setSelectedZonaKey] = useState<string>('LUQUE');
  const [selectedBarrio, setSelectedBarrio] = useState<string>('');
  const [metodoPago, setMetodoPago] = useState<MetodoPagoId>('TRANSFERENCIA');
  const [showMapsInput, setShowMapsInput] = useState(() => {
    try {
      const saved = localStorage.getItem('skinhealth_customer_data_v1');
      if (saved) return !!JSON.parse(saved).googleMapsUrl;
    } catch {}
    return false;
  });
  /** Honeypot anti-bots: los humanos nunca lo completan (campo oculto). */
  const [website, setWebsite] = useState('');
  const lastOrderTimeRef = useRef<number>(0);

  // Swipe to close state
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<number>(0);
  const lastHapticRef = useRef<number>(0);

  // Synchronize customer info with localStorage
  useEffect(() => {
    try {
      localStorage.setItem(
        CUSTOMER_DATA_KEY,
        JSON.stringify({
          customerName,
          customerPhone,
          googleMapsUrl,
        })
      );
    } catch {
      // ignore
    }
  }, [customerName, customerPhone, googleMapsUrl]);

  // Haptic feedback helper
  const triggerHaptic = (type: 'light' | 'medium' | 'heavy' = 'light') => {
    if ('vibrate' in navigator) {
      const patterns = {
        light: 10,
        medium: 20,
        heavy: 30,
      };
      navigator.vibrate(patterns[type]);
    }
  };

  // Drag to close handlers
  const handleDragStart = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isOpen) return;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    dragStartRef.current = clientY;
    setIsDragging(true);
    triggerHaptic('light');
  };

  const handleDragMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDragging) return;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const delta = clientY - dragStartRef.current;
    // Only allow dragging down (positive delta)
    if (delta > 0) {
      setDragY(delta);
      // Haptic at thresholds
      if (delta > 100 && Date.now() - lastHapticRef.current > 100) {
        triggerHaptic('light');
        lastHapticRef.current = Date.now();
      }
      if (delta > 200 && Date.now() - lastHapticRef.current > 100) {
        triggerHaptic('medium');
        lastHapticRef.current = Date.now();
      }
    }
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    if (dragY > 150) {
      triggerHaptic('medium');
      onClose();
    } else {
      // Snap back
      triggerHaptic('light');
    }
    setDragY(0);
    dragStartRef.current = 0;
  };

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    };
  }, [isOpen]);

  const totalAmount = cartItems.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const zonaActual: ZonaEnvio = ZONAS_COBERTURA[selectedZonaKey] ?? ZONAS_COBERTURA['LUQUE'];
  const envioGs = zonaActual.precioGs;
  const totalConEnvio = totalAmount + envioGs;

  // Track begin_checkout when the drawer opens with items
  useEffect(() => {
    if (isOpen && cartItems.length > 0) {
      trackBeginCheckout(cartItems, totalAmount);
    }
  }, [isOpen, cartItems, totalAmount]);

  const handleBlur = (field: 'name' | 'phone' | 'address') => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const nameError = touched.name && !customerName.trim() ? t.errName : null;
  const phoneError =
    touched.phone && customerPhone.replace(/\D/g, '').length < 8
      ? t.errPhone
      : null;

  const handleOrderWhatsApp = async () => {
    // Honeypot: bot detectado → salida silenciosa
    if (website.trim()) return;

    // Throttle por dispositivo: frena ráfagas de pedidos duplicados/spam
    try {
      const last = Number(localStorage.getItem(ORDER_THROTTLE_KEY) || 0);
      // eslint-disable-next-line react-hooks/purity
      const now = lastOrderTimeRef.current || Date.now();
      if (now - last < ORDER_MIN_GAP_SECONDS * 1000) {
        onShowToast(
          t.cartWait,
          t.cartWaitDesc,
          'info'
        );
        return;
      }
    } catch {
      // storage no disponible: seguir igual
    }

    if (cartItems.length === 0) {
      onShowToast(t.cartEmptyError, t.cartEmptyErrorDesc, 'error');
      return;
    }

    if (!customerName.trim() || customerPhone.replace(/\D/g, '').length < 8) {
      setTouched({ name: true, phone: true });
      onShowToast(
        t.cartFillData,
        t.cartFillDataDesc,
        'info'
      );
      return;
    }

    // Checkout invitado: sin login obligatorio (la RPC acepta user_id NULL).
    setIsOrdering(true);

    // Pedido intake module: valida, registra en Supabase y arma el aviso (ADR-002/003).
    // Si falla, no hay recibo: no se abre WhatsApp.
    let receipt: PedidoReceipt;
    try {
      receipt = await createPedido({
        nombre: customerName,
        telefono: customerPhone,
        costoEnvioGs: envioGs,
        zonaNombre: zonaActual.nombre,
        barrio: selectedBarrio,
        metodoPago,
        items: cartItems.map((item) => ({
          productoId: item.product.id,
          cantidad: item.quantity,
        })),
      });
    } catch (err) {
      console.error('Error registrando el pedido:', err);
      setIsOrdering(false);
      if (err instanceof PedidoError) {
        if (err.code === 'EMPTY' || err.code === 'CUSTOMER_DATA') {
          setTouched({ name: true, address: true });
        }
        if (err.code === 'NOT_AUTHENTICATED') {
          onShowToast(t.cartLoginRequired, pedErrDesc(err), 'info');
        } else if (err.code === 'NO_STOCK') {
          onShowToast(t.cartNoStock, pedErrDesc(err), 'error');
        } else if (err.code === 'UNAVAILABLE') {
          onShowToast(t.cartUnavailable, pedErrDesc(err), 'error');
        } else {
          onShowToast(t.cartOrderError, pedErrDesc(err), 'error');
        }
      } else {
        onShowToast(
          t.cartOrderError,
          t.cartOrderErrorDesc,
          'error'
        );
      }
      return;
    }

    const { codigo: orderId, totalGs: serverTotal, costoEnvioGs: serverEnvio, whatsappUrl } = receipt;

    try {
      // eslint-disable-next-line react-hooks/purity
      const now = Date.now();
      lastOrderTimeRef.current = now;
      localStorage.setItem(ORDER_THROTTLE_KEY, String(now));
    } catch {
      // ignore
    }

    setTimeout(() => {
      let opened = false;
      try {
        const win = window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
        if (win) {
          opened = true;
        }
      } catch {
        opened = false;
      }

      setIsOrdering(false);

      // Trigger post-purchase confirmation modal with unique order code
      onOrderSuccess({
        orderId,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        googleMapsUrl: googleMapsUrl.trim(),
        items: [...cartItems],
        totalAmount: serverTotal,
        costoEnvioGs: serverEnvio,
        date: new Date().toLocaleDateString(dateLocale, {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        }),
      });

      if (!opened) {
        onShowToast(
          t.cartOrderRegistered,
          t.cartWhatsAppFallback,
          'info',
          true
        );
      }
    }, 400);
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
          className="pointer-events-auto w-screen max-w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-l-3xl sm:rounded-tr-none shadow-2xl flex flex-col max-h-[92vh] sm:max-h-screen h-full animate-sheet-in"
          style={{ transform: `translateY(${dragY}px)` }}
          onTouchStart={handleDragStart}
          onTouchMove={handleDragMove}
          onTouchEnd={handleDragEnd}
          onMouseDown={handleDragStart}
          onMouseMove={handleDragMove}
          onMouseUp={handleDragEnd}
          onMouseLeave={handleDragEnd}
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
                {t.cartTitle}
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
                  title={t.cartClearTitle}
                >
                  {t.cartClear}
                </button>
              )}
              <button
                onClick={onClose}
                className="p-1.5 rounded-full text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer"
                aria-label={t.cartClose}
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
                  {t.cartEmptyTitle}
                </h3>
                <p className="text-sm text-neutral-400 max-w-xs mb-6">
                  {t.cartEmptyDesc}
                </p>
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 bg-[#102A43] text-white text-sm font-medium rounded-full hover:bg-[#102A43]/90 transition-colors cursor-pointer"
                >
                  {t.cartExplore}
                </button>
              </div>
            ) : (
              <>
                {/* Datos para el envío (Casillas de completado) */}
                <div className="p-4 bg-[#FAF8F5] rounded-2xl border border-neutral-200/80 space-y-3.5 shadow-2xs">
                  {/* Honeypot anti-bots: invisible para humanos */}
                  <input
                    type="text"
                    name="website"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    autoComplete="off"
                    tabIndex={-1}
                    aria-hidden="true"
                    className="hidden"
                  />
                  <div className="space-y-3">
                    {/* 1. Nombre del cliente */}
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1">
                        {t.cartNameLabel} <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          id="cart-customer-name"
                          type="text"
                          name="name"
                          autoComplete="name"
                          autoCapitalize="words"
                          placeholder={t.cartNamePlaceholder}
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
                        <p className="text-xs text-rose-500 flex items-center gap-1 mt-1 font-medium">
                          <AlertCircle className="w-3 h-3 shrink-0" />
                          <span>{nameError}</span>
                        </p>
                      )}
                    </div>

                    {/* 2. Teléfono de contacto */}
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1">
                        {t.cartPhoneLabel} <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          id="cart-customer-phone"
                          type="tel"
                          inputMode="tel"
                          name="tel"
                          autoComplete="tel"
                          placeholder={t.cartPhonePlaceholder}
                          value={customerPhone}
                          onChange={(e) => setCustomerPhone(e.target.value)}
                          onBlur={() => handleBlur('phone')}
                          className={`w-full text-xs bg-white border rounded-lg py-2 pl-7 pr-2.5 text-neutral-800 placeholder:text-neutral-400 focus:outline-none transition-colors ${
                            phoneError
                              ? 'border-rose-400 focus:border-rose-500 bg-rose-50/20'
                              : 'border-neutral-200 focus:border-[#102A43]'
                          }`}
                        />
                        <Phone className="w-3.5 h-3.5 text-neutral-400 absolute left-2 top-1/2 -translate-y-1/2" />
                      </div>
                      {phoneError && (
                        <p className="text-xs text-rose-500 flex items-center gap-1 mt-1 font-medium">
                          <AlertCircle className="w-3 h-3 shrink-0" />
                          <span>{phoneError}</span>
                        </p>
                      )}
                    </div>

                    

                    {/* 4. Link de Google Maps (collapsible) */}
                    <div>
                      <button
                        type="button"
                        onClick={() => setShowMapsInput(!showMapsInput)}
                        className="text-xs text-neutral-500 hover:text-neutral-700 flex items-center gap-1 transition-colors"
                      >
                        <Link2 className="w-3.5 h-3.5" />
                        {showMapsInput ? '− Ocultar pin de Google Maps' : '+ Añadir pin de Google Maps (Recomendado para entrega rápida)'}
                      </button>
                      {showMapsInput && (
                        <div className="relative mt-2">
                          <input
                            id="cart-customer-maps"
                            type="url"
                            inputMode="url"
                            autoComplete="off"
                            placeholder={t.cartMapsPlaceholder}
                            value={googleMapsUrl}
                            onChange={(e) => setGoogleMapsUrl(e.target.value)}
                            className="w-full text-xs bg-white border border-neutral-200 rounded-lg py-2 pl-7 pr-2.5 text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:border-[#102A43] transition-colors"
                          />
                          <Link2 className="w-3.5 h-3.5 text-neutral-400 absolute left-2 top-1/2 -translate-y-1/2" />
                          <p className="text-xs text-neutral-500 mt-1">
                            💡 {t.cartMapsHint}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 5. Zona de Entrega (cards) */}
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-neutral-700">
                      Zona de Entrega <span className="text-rose-500">*</span>
                    </label>
                    <div className="space-y-2">
                      {Object.entries(ZONAS_COBERTURA).map(([key, zona]) => (
                        <ZonaCard
                          key={key}
                          zona={zona}
                          isSelected={selectedZonaKey === key}
                          onSelect={() => {
                            setSelectedZonaKey(key);
                            setSelectedBarrio('');
                            if (!zona.permiteEfectivoContraEntrega && metodoPago === 'EFECTIVO') {
                              setMetodoPago('TRANSFERENCIA');
                            }
                          }}
                        />
                      ))}
                    </div>
                    {zonaActual.barrios && zonaActual.barrios.length > 0 && (
                      <div className="pt-2 space-y-1.5">
                        <p className="text-xs text-neutral-500 font-medium">Barrio:</p>
                        <div className="flex flex-wrap gap-1.5">
                          {zonaActual.barrios.map((barrio) => (
                            <button
                              key={barrio}
                              type="button"
                              onClick={() => setSelectedBarrio(barrio === selectedBarrio ? '' : barrio)}
                              className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                                selectedBarrio === barrio
                                  ? 'bg-[#102A43] text-white border-[#102A43]'
                                  : 'bg-white text-neutral-700 border-neutral-300 hover:border-neutral-400'
                              }`}
                            >
                              {barrio}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 6. Método de Pago */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-neutral-700">
                      Método de Pago <span className="text-rose-500">*</span>
                    </label>
                    <div className="space-y-2">
                      {METODOS_PAGO.map((metodo) => {
                        const deshabilitado = !zonaActual.permiteEfectivoContraEntrega && !metodo.requierePagoPrevio;
                        return (
                          <label
                            key={metodo.id}
                            className={`flex items-center justify-between p-3 border rounded-xl transition-all ${
                              deshabilitado
                                ? 'opacity-50 bg-neutral-100 cursor-not-allowed border-neutral-200'
                                : metodoPago === metodo.id
                                  ? 'border-[#102A43] bg-[#102A43]/5'
                                  : 'border-neutral-200 hover:border-neutral-300'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <input
                                type="radio"
                                name="metodoPago"
                                value={metodo.id}
                                disabled={deshabilitado}
                                checked={metodoPago === metodo.id}
                                onChange={(e) => setMetodoPago(e.target.value as MetodoPagoId)}
                                className="text-[#102A43]"
                              />
                              <span className="text-xs font-medium text-neutral-800">{metodo.label}</span>
                            </div>
                            {deshabilitado && (
                              <span className="text-[10px] text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded">
                                No disponible en tu zona
                              </span>
                            )}
                          </label>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Lista de productos seleccionados */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-xs text-neutral-500 px-1">
                    <span className="font-semibold uppercase tracking-wider text-[#102A43]">
                      Productos seleccionados ({totalItems})
                    </span>
                    <span>{t.cartSubtotal}</span>
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
                            src={productImageUrl(item.product.image, 200)}
                            alt={item.product.name}
                            className="w-full h-full object-contain"
                            loading="lazy"
                          />
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-1">
                            <div>
                              <span className="text-xs font-semibold uppercase tracking-wider text-[#102A43]/60">
                                {item.product.brand}
                              </span>
                              <h4 className="text-sm font-medium text-neutral-900 leading-tight line-clamp-2">
                                {item.product.name}
                              </h4>
                            </div>
                            <button
                              onClick={() => onRemoveItem(item.product.id)}
                              className="text-neutral-400 hover:text-red-500 p-1 transition-colors cursor-pointer"
                              title={t.cartRemoveTitle}
                              aria-label={t.cartRemoveItem.replace('{name}', item.product.name)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="text-xs text-neutral-500 mt-0.5">
                            {t.cartUnitPrice} {formatCurrency(item.product.price)}
                          </div>

                          {/* Quantity Controls & Subtotal */}
                          <div className="flex items-center justify-between mt-2.5">
                            {/* Stepper */}
                            <div className="flex items-center bg-white rounded-lg border border-neutral-200 p-0.5 shadow-2xs">
                              <button
                                onClick={() => onUpdateQuantity(item.product.id, -1)}
                                className="w-6 h-6 flex items-center justify-center text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-md transition-colors cursor-pointer"
                                aria-label={t.cartDecrease}
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
                                aria-label={t.cartIncrease}
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>

                            {/* Line subtotal */}
                            <span className="font-semibold text-sm text-[#102A43]">
                              {formatCurrency(item.product.price * item.quantity)}
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
                  <span>{t.cartProductsCount.replace('{count}', String(totalItems))}</span>
                  <span>{formatCurrency(totalAmount)}</span>
                </div>
                <div className="flex justify-between text-neutral-500 text-xs">
                  <span>{t.cartShipping}</span>
                  <span className="font-semibold text-neutral-800">{formatCurrency(envioGs)}</span>
                </div>
                <p className="text-xs text-neutral-400">
                  {zonaActual.tiempoEstimado}
                  {!zonaActual.permiteEfectivoContraEntrega && ' — Solo pago previo'}
                </p>
                <div className="flex justify-between items-baseline pt-1.5 border-t border-neutral-100">
                  <span className="font-semibold text-sm sm:text-base text-neutral-900">
                    {t.cartTotal}
                  </span>
                  <motion.span
                    key={totalConEnvio}
                    initial={{ scale: 0.95 }}
                    animate={{ scale: 1 }}
                    className="font-bold text-lg sm:text-xl text-[#102A43]"
                  >
                    {formatCurrency(totalConEnvio)}
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
                    : 'bg-[#102A43] hover:bg-[#1e3a5f] text-white shadow-[#102A43]/25'
                }`}
              >
                {isOrdering ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>{t.cartPreparing}</span>
                  </>
                ) : (
                  <>
                    <MessageCircle className="w-5 h-5" />
                    <span>{t.cartOrderCta}</span>
                  </>
                )}
              </motion.button>

              {/* Micro-copys de confianza */}
              <div className="grid grid-cols-3 gap-1 pt-1 text-xs text-neutral-500 text-center border-t border-neutral-100/80">
                <div className="flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-600 shrink-0" />
                  <span>{t.cartPayTransfer}</span>
                </div>
                <div className="flex items-center justify-center gap-1">
                  <Truck className="w-3 h-3 text-sky-600 shrink-0" />
                  <span>{t.cartShippingMode}</span>
                </div>
                <div className="flex items-center justify-center gap-1">
                  <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                  <span>{t.cartStockVerified}</span>
                </div>
              </div>

              {/* Atención oficial */}
              <div className="flex items-center text-xs pt-0.5">
                <span className="text-neutral-400">{t.cartOfficialCare}</span>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

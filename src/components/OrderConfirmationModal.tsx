import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  CheckCircle2,
  Copy,
  Check,
  MessageCircle,
  Package,
  MapPin,
  Clock,
  Sparkles,
  X,
} from 'lucide-react';
import { CartItem } from '../types';
import { formatGuarani, STORE_PHONE_NUMBER, STORE_PHONE_DISPLAY } from '../data/products';
import { buildPedidoMessage } from '../data/pedidos';

export interface OrderDetails {
  orderId: string;
  customerName: string;
  customerPhone?: string;
  customerAddress: string;
  googleMapsUrl?: string;
  items: CartItem[];
  totalAmount: number;
  costoEnvioGs?: number;
  date: string;
}

interface OrderConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: OrderDetails | null;
}

export const OrderConfirmationModal: React.FC<OrderConfirmationModalProps> = ({
  isOpen,
  onClose,
  order,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !order) return null;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(order.orderId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const reOpenWhatsApp = () => {
    const message = buildPedidoMessage({
      codigo: order.orderId,
      lines: order.items.map((item) => ({
        productId: item.product.id,
        name: item.product.name,
        quantity: item.quantity,
        unitPrice: item.product.price,
        lineTotal: item.product.price * item.quantity,
      })),
      totalGs: order.totalAmount,
      costoEnvioGs: order.costoEnvioGs ?? 0,
      nombre: order.customerName,
      telefono: order.customerPhone ?? '',
      direccion: `${order.customerAddress}${order.googleMapsUrl ? ' — ' + order.googleMapsUrl : ''}`,
    });

    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/${STORE_PHONE_NUMBER}?text=${encoded}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-neutral-100 flex flex-col my-8"
      >
        {/* Header with success badge */}
        <div className="bg-[#FAF8F5] p-6 text-center border-b border-neutral-100 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-neutral-700 rounded-full hover:bg-neutral-200/50 transition-colors"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-3 shadow-inner">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
            ¡Pedido Registrado con Éxito!
          </span>

          <h3 className="font-serif text-2xl font-bold text-[#102A43] mt-2 mb-1">
            Gracias por tu compra
          </h3>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto">
            Hemos preparado tu pedido y te redirigimos al WhatsApp oficial para coordinar el despacho.
          </p>

          {/* Unique Order Code Box */}
          <div className="mt-4 inline-flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-neutral-200 shadow-2xs">
            <span className="text-xs text-neutral-400 font-medium">Código de Pedido:</span>
            <span className="font-mono font-bold text-sm text-[#102A43]">{order.orderId}</span>
            <button
              onClick={handleCopyCode}
              className="text-neutral-400 hover:text-[#102A43] transition-colors p-1"
              title="Copiar código"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-emerald-600" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>

        {/* Modal Body: Next steps and order summary */}
        <div className="p-6 space-y-5 overflow-y-auto max-h-[55vh]">
          {/* Next steps list */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#102A43] mb-3 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-emerald-600" />
              <span>Siguientes pasos de entrega</span>
            </h4>
            <div className="space-y-2.5 text-xs">
              <div className="p-3 bg-[#FAF8F5] rounded-xl border border-neutral-100 flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-[#102A43] text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                  1
                </span>
                <div>
                  <p className="font-semibold text-neutral-900">Confirmación por WhatsApp</p>
                  <p className="text-neutral-500 mt-0.5 leading-relaxed">
                    Nuestro equipo en {STORE_PHONE_DISPLAY} confirmará la disponibilidad inmediata de tus productos.
                  </p>
                </div>
              </div>

              <div className="p-3 bg-[#FAF8F5] rounded-xl border border-neutral-100 flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-[#102A43] text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                  2
                </span>
                <div>
                  <p className="font-semibold text-neutral-900">Método de pago flexible</p>
                  <p className="text-neutral-500 mt-0.5 leading-relaxed">
                    Podés abonar vía transferencia bancaria (SIPAP) o en efectivo / POS al recibir el paquete.
                  </p>
                </div>
              </div>

              <div className="p-3 bg-[#FAF8F5] rounded-xl border border-neutral-100 flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-[#102A43] text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                  3
                </span>
                <div>
                  <p className="font-semibold text-neutral-900">Entrega rápida a tu ubicación</p>
                  <p className="text-neutral-500 mt-0.5 leading-relaxed">
                    Envío seguro con motodelivery en Asunción y Gran Asunción o encomienda express al interior del país.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Order items preview */}
          <div className="border-t border-neutral-100 pt-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#102A43] mb-2 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Package className="w-3.5 h-3.5 text-neutral-500" />
                <span>Resumen de Productos</span>
              </span>
              <span className="font-normal text-neutral-500 text-[11px]">{order.items.length} ítems</span>
            </h4>

            <div className="divide-y divide-neutral-100 bg-[#FAF8F5] rounded-xl p-3 border border-neutral-100 text-xs">
              {order.items.map((item) => (
                <div key={item.product.id} className="py-2 flex justify-between items-center first:pt-0 last:pb-0">
                  <div>
                    <span className="font-medium text-neutral-900">{item.product.name}</span>
                    <span className="text-neutral-400 ml-1.5 font-normal">x{item.quantity}</span>
                  </div>
                  <span className="font-semibold text-[#102A43]">
                    {formatGuarani(item.product.price * item.quantity)}
                  </span>
                </div>
              ))}

              <div className="pt-2.5 mt-1 border-t border-neutral-200 flex justify-between items-baseline text-xs text-neutral-500">
                <span>Envío</span>
                <span className="font-semibold text-neutral-700">
                  {formatGuarani(order.costoEnvioGs ?? 0)}
                </span>
              </div>
              <div className="pt-2.5 mt-1 border-t border-neutral-200 flex justify-between items-baseline font-bold text-sm text-[#102A43]">
                <span>Total</span>
                <span>{formatGuarani(order.totalAmount + (order.costoEnvioGs ?? 0))}</span>
              </div>
            </div>
          </div>

          {/* Delivery destination */}
          {order.customerAddress && (
            <div className="bg-neutral-50 rounded-xl p-3 border border-neutral-100 text-xs flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-neutral-900 block">Destino de envío:</span>
                <span className="text-neutral-600">{order.customerAddress}</span>
                {order.customerName && (
                  <span className="text-neutral-400 block mt-0.5">Destinatario: {order.customerName}</span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal footer actions */}
        <div className="p-4 sm:p-5 bg-white border-t border-neutral-100 flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={reOpenWhatsApp}
            className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md shadow-emerald-500/20"
          >
            <MessageCircle className="w-4 h-4 fill-white text-[#25D366]" />
            <span>Reabrir chat de WhatsApp</span>
          </button>

          <button
            onClick={onClose}
            className="w-full sm:w-auto py-3 px-5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-semibold text-xs sm:text-sm transition-colors cursor-pointer"
          >
            Seguir explorando
          </button>
        </div>
      </motion.div>
    </div>
  );
};

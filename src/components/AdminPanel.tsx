import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import {
  X,
  Package,
  Boxes,
  MessageSquareText,
  MessageCircle,
  CheckCircle2,
  Truck,
  Home,
  Ban,
  AlertCircle,
  Loader2,
  Minus,
  Plus,
} from 'lucide-react';
import {
  AdminPedido,
  AdminPedidoItem,
  StockRow,
  PedidoEstado,
  fetchPedidos,
  fetchPedidoItems,
  setPedidoEstado,
  registrarPago,
  fetchStock,
  ajustarStock,
  actualizarPrecio,
} from '../data/admin';
import { ProductReview } from '../types';
import { fetchAllReviews, setReviewStatus } from '../data/reviews';
import { formatGuarani } from '../data/products';
import { formatReviewDate } from '../utils/reviewsStorage';
import {
  linkRecuperacion,
  mensajeReactivacion,
  mensajeRecuperacion,
} from '../utils/recuperacion';
import { trackingLink } from '../data/tracking';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (title: string, description?: string, type?: 'success' | 'error' | 'info') => void;
}

type Tab = 'pedidos' | 'stock' | 'reviews';

const ESTADO_LABEL: Record<PedidoEstado, string> = {
  pendiente: 'Pendiente',
  pagado: 'Pagado',
  enviado: 'Enviado',
  entregado: 'Entregado',
  cancelado: 'Cancelado',
};

const ESTADO_STYLE: Record<PedidoEstado, string> = {
  pendiente: 'bg-amber-50 text-amber-700 border-amber-200',
  pagado: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  enviado: 'bg-sky-50 text-sky-700 border-sky-200',
  entregado: 'bg-neutral-100 text-neutral-600 border-neutral-200',
  cancelado: 'bg-rose-50 text-rose-700 border-rose-200',
};

/** Siguiente acción válida según estado (flujo manual: transferencia + WhatsApp). */
function nextActions(estado: PedidoEstado): { label: string; to: PedidoEstado; icon: React.ReactNode; form?: boolean }[] {
  if (estado === 'pendiente')
    return [
      { label: 'Registrar pago', to: 'pagado', icon: <CheckCircle2 className="w-3.5 h-3.5" />, form: true },
      { label: 'Cancelar', to: 'cancelado', icon: <Ban className="w-3.5 h-3.5" /> },
    ];
  if (estado === 'pagado')
    return [
      { label: 'Marcar enviado', to: 'enviado', icon: <Truck className="w-3.5 h-3.5" /> },
      { label: 'Cancelar', to: 'cancelado', icon: <Ban className="w-3.5 h-3.5" /> },
    ];
  if (estado === 'enviado')
    return [{ label: 'Marcar entregado', to: 'entregado', icon: <Home className="w-3.5 h-3.5" /> }];
  return [];
}

/** Editor inline de stock: steppers + input con commit en blur/Enter. */
const StockEditor: React.FC<{
  row: StockRow;
  saving: boolean;
  onSave: (nuevo: number) => void;
}> = ({ row, saving, onSave }) => {
  const [draft, setDraft] = useState<string | null>(null);
  const shown = draft ?? String(row.stock);
  const parsed = Number.parseInt(shown, 10);

  const commit = () => {
    setDraft(null);
    if (Number.isFinite(parsed) && parsed >= 0) onSave(parsed);
  };

  return (
    <span className="inline-flex items-center gap-1 justify-end">
      <button
        type="button"
        disabled={saving}
        onClick={() => onSave(row.stock - 1)}
        className="w-6 h-6 rounded-lg bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-neutral-600 disabled:opacity-40 cursor-pointer"
        aria-label="Quitar uno"
      >
        <Minus className="w-3.5 h-3.5" />
      </button>
      <input
        type="number"
        min={0}
        disabled={saving}
        value={shown}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === 'Enter') (e.target as HTMLInputElement).blur();
        }}
        className={`w-14 text-center font-bold text-sm border rounded-lg py-1 px-1 focus:outline-none focus:border-[#102A43] disabled:opacity-40 ${
          row.stock <= 0
            ? 'text-rose-600 border-rose-200 bg-rose-50/50'
            : row.stock <= 3
              ? 'text-amber-600 border-amber-200 bg-amber-50/50'
              : 'text-emerald-700 border-neutral-200'
        }`}
        aria-label={`Stock de ${row.nombre}`}
      />
      <button
        type="button"
        disabled={saving}
        onClick={() => onSave(row.stock + 1)}
        className="w-6 h-6 rounded-lg bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-neutral-600 disabled:opacity-40 cursor-pointer"
        aria-label="Agregar uno"
      >
        <Plus className="w-3.5 h-3.5" />
      </button>
    </span>
  );
};

/** Editor inline de precio (Gs): input con commit en blur/Enter. */
const PriceEditor: React.FC<{
  row: StockRow;
  saving: boolean;
  onSave: (nuevo: number) => void;
}> = ({ row, saving, onSave }) => {
  const [draft, setDraft] = useState<string | null>(null);
  const shown = draft ?? String(row.precio_gs);
  const parsed = Number.parseInt(shown.replace(/\D/g, ''), 10);

  const commit = () => {
    setDraft(null);
    if (Number.isFinite(parsed) && parsed > 0) onSave(parsed);
  };

  return (
    <input
      type="text"
      inputMode="numeric"
      disabled={saving}
      value={draft ?? formatGuarani(row.precio_gs).replace('₲', '').trim()}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={commit}
      onKeyDown={(e) => {
        if (e.key === 'Enter') (e.target as HTMLInputElement).blur();
      }}
      className="w-28 text-right text-sm text-neutral-700 border border-neutral-200 rounded-lg py-1 px-2 focus:outline-none focus:border-[#102A43] disabled:opacity-40"
      aria-label={`Precio de ${row.nombre}`}
      title={formatGuarani(row.precio_gs)}
    />
  );
};

export const AdminPanel: React.FC<AdminPanelProps> = ({ isOpen, onClose, onShowToast }) => {
  const [tab, setTab] = useState<Tab>('pedidos');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pedidos, setPedidos] = useState<AdminPedido[]>([]);
  const [estadoFilter, setEstadoFilter] = useState<'all' | PedidoEstado>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [itemsCache, setItemsCache] = useState<Record<string, AdminPedidoItem[]>>({});
  const [stock, setStock] = useState<StockRow[]>([]);
  const [pendingReviews, setPendingReviews] = useState<ProductReview[]>([]);
  const [savingStock, setSavingStock] = useState<Record<string, boolean>>({});
  const [payingId, setPayingId] = useState<string | null>(null);
  const [payRef, setPayRef] = useState('');
  const [payUrl, setPayUrl] = useState('');
  const [payingBusy, setPayingBusy] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const [peds, stk, revs] = await Promise.all([
        fetchPedidos(),
        fetchStock(),
        fetchAllReviews(),
      ]);
      setPedidos(peds);
      setStock(stk);
      setPendingReviews(revs.filter((r) => r.status === 'pending'));
    } catch {
      setError('No se pudieron cargar los datos. Verificá tu sesión de administrador.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen ]);

  if (!isOpen) return null;

  const handleExpand = async (pedido: AdminPedido) => {
    if (expandedId === pedido.id) {
      setExpandedId(null);
      return;
    }
    setExpandedId(pedido.id);
    if (!itemsCache[pedido.id]) {
      try {
        const items = await fetchPedidoItems(pedido.id);
        setItemsCache((prev) => ({ ...prev, [pedido.id]: items }));
      } catch {
        onShowToast('No se pudieron cargar los ítems', undefined, 'error');
      }
    }
  };

  const handleEstado = async (pedido: AdminPedido, to: PedidoEstado) => {
    try {
      await setPedidoEstado(pedido.id, to);
      setPedidos((prev) => prev.map((p) => (p.id === pedido.id ? { ...p, estado: to } : p)));
      onShowToast(
        `Pedido ${to}`,
        to === 'pagado' ? 'Se descontó stock automáticamente.' : undefined,
        'success'
      );
    } catch {
      onShowToast('No se pudo actualizar el estado', undefined, 'error');
    }
  };

  const handleConfirmPago = async (pedido: AdminPedido) => {
    setPayingBusy(true);
    try {
      await registrarPago(pedido.id, { referencia: payRef, comprobanteUrl: payUrl });
      setPedidos((prev) =>
        prev.map((p) =>
          p.id === pedido.id
            ? {
                ...p,
                estado: 'pagado' as PedidoEstado,
                referencia_pago: payRef.trim() || null,
                comprobante_url: payUrl.trim() || null,
              }
            : p
        )
      );
      setPayingId(null);
      setPayRef('');
      setPayUrl('');
      onShowToast('Pago registrado', 'Se descontó stock automáticamente.', 'success');
    } catch {
      onShowToast('No se pudo registrar el pago', undefined, 'error');
    } finally {
      setPayingBusy(false);
    }
  };

  const handleApproveReview = async (id: string) => {
    try {
      await setReviewStatus(id, 'approved');
      setPendingReviews((prev) => prev.filter((r) => r.id !== id));
      onShowToast('Reseña aprobada', undefined, 'success');
    } catch {
      onShowToast('No se pudo aprobar', undefined, 'error');
    }
  };

  const handleHideReview = async (id: string) => {
    try {
      await setReviewStatus(id, 'hidden');
      setPendingReviews((prev) => prev.filter((r) => r.id !== id));
      onShowToast('Reseña ocultada', undefined, 'info');
    } catch {
      onShowToast('No se pudo ocultar', undefined, 'error');
    }
  };

  const handleStockSave = async (id: string, nuevo: number) => {
    const current = stock.find((p) => p.id === id);
    if (!current || nuevo < 0 || nuevo === current.stock) return;
    setSavingStock((prev) => ({ ...prev, [id]: true }));
    try {
      await ajustarStock(id, nuevo);
      setStock((prev) => prev.map((p) => (p.id === id ? { ...p, stock: nuevo } : p)));
      onShowToast('Stock actualizado', `${current.nombre}: ${nuevo} unidades.`, 'success');
    } catch {
      onShowToast('No se pudo actualizar el stock', undefined, 'error');
    } finally {
      setSavingStock((prev) => ({ ...prev, [id]: false }));
    }
  };

  const handlePrecioSave = async (id: string, nuevo: number) => {
    const current = stock.find((p) => p.id === id);
    if (!current || nuevo <= 0 || nuevo === current.precio_gs) return;
    setSavingStock((prev) => ({ ...prev, [id]: true }));
    try {
      await actualizarPrecio(id, nuevo);
      setStock((prev) => prev.map((p) => (p.id === id ? { ...p, precio_gs: nuevo } : p)));
      onShowToast(
        'Precio actualizado',
        `${current.nombre}: ${formatGuarani(nuevo)}.`,
        'success'
      );
    } catch {
      onShowToast('No se pudo actualizar el precio', undefined, 'error');
    } finally {
      setSavingStock((prev) => ({ ...prev, [id]: false }));
    }
  };

  const filteredPedidos = pedidos.filter(
    (p) => estadoFilter === 'all' || p.estado === estadoFilter
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-2xs"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 10 }}
        className="relative bg-[#FAF8F5] w-full max-w-4xl rounded-3xl p-5 sm:p-6 shadow-2xl z-10 border border-neutral-200 max-h-[88vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-200 mb-4">
          <div>
            <h3 className="font-semibold text-lg text-[#102A43]">Panel de administración</h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              Pedidos, stock y reseñas pendientes de moderación.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-neutral-200/70 hover:bg-neutral-300 flex items-center justify-center text-neutral-600"
            aria-label="Cerrar panel"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 mb-4">
          {(
            [
              { id: 'pedidos', label: `Pedidos (${pedidos.length})`, icon: <Package className="w-4 h-4" /> },
              { id: 'stock', label: 'Stock', icon: <Boxes className="w-4 h-4" /> },
              { id: 'reviews', label: `Reseñas (${pendingReviews.length})`, icon: <MessageSquareText className="w-4 h-4" /> },
            ] as { id: Tab; label: string; icon: React.ReactNode }[]
          ).map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors ${
                tab === t.id
                  ? 'bg-[#102A43] text-white'
                  : 'bg-white text-neutral-600 border border-neutral-200 hover:border-neutral-400'
              }`}
            >
              {t.icon}
              <span>{t.label}</span>
            </button>
          ))}
          <button
            onClick={() => void load()}
            className="ml-auto text-xs text-neutral-500 hover:text-neutral-800 px-2 py-1 cursor-pointer"
          >
            Recargar
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 pr-1">
          {loading ? (
            <div className="flex items-center justify-center py-14 text-neutral-500 text-sm gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Cargando…</span>
            </div>
          ) : error ? (
            <div className="flex items-start gap-2 text-xs text-rose-700 bg-rose-50 p-3 rounded-xl border border-rose-100">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          ) : tab === 'pedidos' ? (
            <div className="space-y-3">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {(['all', 'pendiente', 'pagado', 'enviado', 'entregado', 'cancelado'] as const).map(
                  (e) => (
                    <button
                      key={e}
                      onClick={() => setEstadoFilter(e)}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap cursor-pointer ${
                        estadoFilter === e
                          ? 'bg-[#102A43] text-white'
                          : 'bg-white text-neutral-500 border border-neutral-200'
                      }`}
                    >
                      {e === 'all' ? 'Todos' : ESTADO_LABEL[e]}
                    </button>
                  )
                )}
              </div>

              {filteredPedidos.length === 0 ? (
                <p className="text-center text-xs text-neutral-400 py-10">
                  No hay pedidos en este estado.
                </p>
              ) : (
                filteredPedidos.map((p) => (
                  <div key={p.id} className="bg-white rounded-2xl border border-neutral-200 p-4 text-xs">
                    <button
                      onClick={() => void handleExpand(p)}
                      className="w-full flex items-center justify-between gap-3 text-left cursor-pointer"
                    >
                      <div className="min-w-0">
                        <div className="font-bold text-neutral-900 text-sm">
                          {p.codigo_pedido ?? p.id.slice(0, 8)}
                          <span className="ml-2 font-semibold text-[#102A43]">
                            {formatGuarani(p.total_gs + (p.costo_envio_gs ?? 0))}
                          </span>
                        </div>
                        <div className="text-neutral-500 mt-0.5 truncate">
                          {p.cliente_nombre} · {p.cliente_telefono} ·{' '}
                          {new Date(p.creado_en).toLocaleDateString('es-PY', {
                            day: '2-digit',
                            month: 'short',
                          })}
                        </div>
                      </div>
                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${ESTADO_STYLE[p.estado]}`}
                      >
                        {ESTADO_LABEL[p.estado]}
                      </span>
                    </button>

                    {expandedId === p.id && (
                      <div className="mt-3 pt-3 border-t border-neutral-100 space-y-2">
                        {(itemsCache[p.id] ?? []).map((it) => (
                          <div key={it.id} className="flex items-center justify-between text-neutral-700">
                            <span>
                              {it.producto_nombre ?? it.producto_id} × {it.cantidad}
                            </span>
                            <span className="font-semibold">
                              {formatGuarani(it.precio_unitario_gs * it.cantidad)}
                            </span>
                          </div>
                        ))}
                        <div className="flex items-center justify-between text-neutral-500">
                          <span>Envío</span>
                          <span className="font-semibold">
                            {formatGuarani(p.costo_envio_gs ?? 0)}
                          </span>
                        </div>
                        {p.direccion_envio && (
                          <p className="text-neutral-500">📍 {p.direccion_envio}</p>
                        )}
                        {p.referencia_pago && (
                          <p className="text-neutral-500">🧾 Ref: {p.referencia_pago}</p>
                        )}
                        {p.comprobante_url && (
                          <a
                            href={p.comprobante_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sky-700 underline"
                          >
                            Ver comprobante
                          </a>
                        )}
                        {p.confirmado_por && (
                          <p className="text-neutral-500">✅ Confirmado por: {p.confirmado_por}</p>
                        )}
                        <div className="flex items-center gap-2 pt-1 flex-wrap">
                          {nextActions(p.estado).map((a) => (
                            <button
                              key={a.to}
                              onClick={() =>
                                a.form
                                  ? (setPayingId(p.id), setPayRef(''), setPayUrl(''))
                                  : void handleEstado(p, a.to)
                              }
                              className="px-3 py-1.5 rounded-xl bg-[#102A43] text-white text-xs font-semibold flex items-center gap-1.5 hover:bg-[#102A43]/90 cursor-pointer"
                            >
                              {a.icon}
                              <span>{a.label}</span>
                            </button>
                          ))}
                          {(p.estado === 'pendiente' || p.estado === 'cancelado') &&
                            (() => {
                              const items = itemsCache[p.id] ?? [];
                              const msg =
                                p.estado === 'pendiente'
                                  ? mensajeRecuperacion(
                                      p.cliente_nombre,
                                      p.codigo_pedido ?? p.id.slice(0, 8),
                                      p.total_gs,
                                      items
                                    )
                                  : mensajeReactivacion(
                                      p.cliente_nombre,
                                      p.codigo_pedido ?? p.id.slice(0, 8),
                                      p.total_gs,
                                      items
                                    );
                              const link = linkRecuperacion(p.cliente_telefono, msg);
                              if (!link) return null;
                              return (
                                <a
                                  href={link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="px-3 py-1.5 rounded-xl bg-[#25D366] text-white text-xs font-semibold flex items-center gap-1.5 hover:bg-[#20bd5a] cursor-pointer"
                                >
                                  <MessageCircle className="w-3.5 h-3.5" />
                                  <span>Reclamar</span>
                                </a>
                              );
                            })()}
                          {(p.estado === 'pagado' || p.estado === 'enviado' || p.estado === 'entregado') &&
                            (() => {
                              const primero = (p.cliente_nombre ?? '').trim().split(' ')[0] || 'hola';
                              const estadoTxt =
                                p.estado === 'pagado' ? 'confirmado el pago ✅' :
                                p.estado === 'enviado' ? 'va en camino 🛵' : 'fue entregado 📦';
                              const link = linkRecuperacion(
                                p.cliente_telefono,
                                `Hola ${primero}, somos Skin Health 💙 tu pedido ${p.codigo_pedido ?? p.id.slice(0, 8)} ${estadoTxt}. Seguilo en vivo acá: ${trackingLink(p.codigo_pedido ?? p.id.slice(0, 8))}`
                              );
                              if (!link) return null;
                              return (
                                <a
                                  href={link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="px-3 py-1.5 rounded-xl bg-sky-600 text-white text-xs font-semibold flex items-center gap-1.5 hover:bg-sky-500 cursor-pointer"
                                >
                                  <MessageCircle className="w-3.5 h-3.5" />
                                  <span>Avisar</span>
                                </a>
                              );
                            })()}
                        </div>
                        {payingId === p.id && (
                          <div className="pt-3 mt-1 border-t border-neutral-100 space-y-2">
                            <p className="font-semibold text-neutral-800">Registrar pago</p>
                            <input
                              type="text"
                              value={payRef}
                              onChange={(e) => setPayRef(e.target.value)}
                              placeholder="Referencia / N° de comprobante (opcional)"
                              className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:border-[#102A43]"
                            />
                            <input
                              type="url"
                              value={payUrl}
                              onChange={(e) => setPayUrl(e.target.value)}
                              placeholder="URL del comprobante (opcional)"
                              className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:border-[#102A43]"
                            />
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => void handleConfirmPago(p)}
                                disabled={payingBusy}
                                className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 disabled:opacity-50 cursor-pointer"
                              >
                                {payingBusy ? 'Guardando…' : 'Confirmar pago'}
                              </button>
                              <button
                                onClick={() => setPayingId(null)}
                                className="px-3 py-1.5 rounded-xl bg-neutral-100 text-neutral-700 text-xs font-semibold hover:bg-neutral-200 cursor-pointer"
                              >
                                Cancelar
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          ) : tab === 'stock' ? (
            <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-left text-neutral-400 border-b border-neutral-100">
                    <th className="px-4 py-2.5 font-semibold">Producto</th>
                    <th className="px-4 py-2.5 font-semibold text-right">Precio</th>
                    <th className="px-4 py-2.5 font-semibold text-right">Stock</th>
                  </tr>
                </thead>
                <tbody>
                  {stock.map((s) => (
                    <tr key={s.id} className="border-b border-neutral-50 last:border-0">
                      <td className="px-4 py-2.5">
                        <span className="font-semibold text-neutral-800">{s.nombre}</span>
                        <span className="text-neutral-400 ml-1.5">{s.marca}</span>
                        {!s.activo && (
                          <span className="ml-1.5 text-[10px] bg-neutral-200 text-neutral-600 px-1.5 py-0.5 rounded font-semibold">
                            Inactivo
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-2.5 text-right">
                        <PriceEditor
                          row={s}
                          saving={!!savingStock[s.id]}
                          onSave={(nuevo) => void handlePrecioSave(s.id, nuevo)}
                        />
                      </td>
                      <td className="px-4 py-2.5 text-right">
                        <StockEditor
                          row={s}
                          saving={!!savingStock[s.id]}
                          onSave={(nuevo) => void handleStockSave(s.id, nuevo)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingReviews.length === 0 ? (
                <p className="text-center text-xs text-neutral-400 py-10">
                  No hay reseñas pendientes. ¡Todo moderado! 🎉
                </p>
              ) : (
                pendingReviews.map((r) => (
                  <div key={r.id} className="bg-white rounded-2xl border border-neutral-200 p-4 text-xs">
                    <div className="flex items-center justify-between gap-3 mb-1.5">
                      <span className="font-semibold text-neutral-900">
                        {r.author.name}{' '}
                        <span className="text-amber-500 font-bold">★ {r.rating}</span>
                      </span>
                      <span className="text-[11px] text-neutral-400">
                        {formatReviewDate(r.createdAt)}
                      </span>
                    </div>
                    <p className="text-neutral-700 italic mb-1">&quot;{r.comment}&quot;</p>
                    <p className="text-[11px] text-neutral-400 font-mono mb-2.5">
                      {r.productId}
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => void handleApproveReview(r.id)}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-semibold flex items-center gap-1.5 hover:bg-emerald-700 cursor-pointer"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Aprobar</span>
                      </button>
                      <button
                        onClick={() => void handleHideReview(r.id)}
                        className="px-3 py-1.5 rounded-xl bg-neutral-100 text-neutral-700 text-xs font-semibold hover:bg-neutral-200 cursor-pointer"
                      >
                        Ocultar
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

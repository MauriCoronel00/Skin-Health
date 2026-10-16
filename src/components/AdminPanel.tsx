import React, { useEffect, useRef, useState, useCallback } from 'react';
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
  Search,
  Star,
  EyeOff,
  Trash2,
  Pencil,
  RefreshCw,
} from 'lucide-react';
import {
  AdminPedido,
  AdminPedidoItem,
  StockRow,
  PedidoEstado,
  ProductoAdmin,
  fetchPedidos,
  fetchPedidoItems,
  setPedidoEstado,
  registrarPago,
  fetchStock,
  ajustarStock,
  actualizarPrecio,
  fetchAuditLog,
  fetchProductoAdmin,
  setProductoActivo,
  isCurrentUserAdmin,
} from '../data/admin';
import { ProductReview, AuditLogEntry, CategoryOption } from '../types';
import { fetchReviews, setReviewStatus, setReviewFeatured, deleteReview, responderReview } from '../data/reviews';
import { formatGuarani, fetchCategories } from '../data/products';
import { formatReviewDate } from '../utils/reviewsStorage';
import {
  linkRecuperacion,
  mensajeReactivacion,
  mensajeRecuperacion,
} from '../utils/recuperacion';
import { trackingLink } from '../data/tracking';
import { useModalA11y } from '../hooks/useModalA11y';
import { ProductEditModal } from './ProductEditModal';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (title: string, description?: string, type?: 'success' | 'error' | 'info') => void;
}

type Tab = 'pedidos' | 'stock' | 'reviews' | 'audit_log';
type ReviewFilter = 'pending' | 'approved' | 'hidden' | 'all';

const PAGE_SIZE = 50;

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

const REVIEW_FILTERS: { id: ReviewFilter; label: string }[] = [
  { id: 'pending', label: 'Pendientes' },
  { id: 'approved', label: 'Aprobadas' },
  { id: 'hidden', label: 'Ocultas' },
  { id: 'all', label: 'Todas' },
];

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

/**
 * Editor inline de stock: steppers + input con commit en blur/Enter.
 * Los botones dejan de robar el foco (mousedown preventDefault) para que un
 * click no dispare a la vez el commit del input y el guardado del stepper.
 */
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
    if (Number.isFinite(parsed) && parsed >= 0 && parsed !== row.stock) onSave(parsed);
  };

  const step = (delta: number) => {
    const base = Number.isFinite(parsed) ? parsed : row.stock;
    const next = Math.max(0, base + delta);
    setDraft(String(next));
    if (next !== row.stock) onSave(next);
  };

  return (
    <span className="inline-flex items-center gap-1 justify-end">
      <button
        type="button"
        disabled={saving}
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => step(-1)}
        className="w-6 h-6 rounded-lg bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-neutral-600 disabled:opacity-40 cursor-pointer"
        aria-label={`Quitar uno a ${row.nombre}`}
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
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => step(1)}
        className="w-6 h-6 rounded-lg bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-neutral-600 disabled:opacity-40 cursor-pointer"
        aria-label={`Agregar uno a ${row.nombre}`}
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
  const parsed = Number.parseInt((draft ?? String(row.precio_gs)).replace(/\D/g, ''), 10);

  const commit = () => {
    setDraft(null);
    if (Number.isFinite(parsed) && parsed > 0 && parsed !== row.precio_gs) onSave(parsed);
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
  const [accessDenied, setAccessDenied] = useState(false);
  const [granted, setGranted] = useState(false);

  // Pedidos
  const [pedidos, setPedidos] = useState<AdminPedido[]>([]);
  const [pedidosLoading, setPedidosLoading] = useState(false);
  const [pedidosHasMore, setPedidosHasMore] = useState(false);
  const [pedidosError, setPedidosError] = useState<string | null>(null);
  const [estadoFilter, setEstadoFilter] = useState<'all' | PedidoEstado>('all');
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [itemsCache, setItemsCache] = useState<Record<string, AdminPedidoItem[]>>({});

  // Stock
  const [stock, setStock] = useState<StockRow[]>([]);
  const [stockLoading, setStockLoading] = useState(false);
  const [stockError, setStockError] = useState<string | null>(null);
  const [savingStock, setSavingStock] = useState<Record<string, boolean>>({});

  // Reseñas
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewsError, setReviewsError] = useState<string | null>(null);
  const [reviewFilter, setReviewFilter] = useState<ReviewFilter>('pending');
  const [reviewBusyId, setReviewBusyId] = useState<string | null>(null);

  // Auditoría
  const [auditLog, setAuditLog] = useState<AuditLogEntry[]>([]);
  const [auditError, setAuditError] = useState<string | null>(null);

  // Categorías + editor de producto
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [productEditor, setProductEditor] = useState<{ open: boolean; producto: ProductoAdmin | null; loading: boolean }>({
    open: false,
    producto: null,
    loading: false,
  });

  // Confirmaciones
  const [confirmingCancelId, setConfirmingCancelId] = useState<string | null>(null);
  const [confirmingDeleteId, setConfirmingDeleteId] = useState<string | null>(null);

  // Pago
  const [payingId, setPayingId] = useState<string | null>(null);
  const [payRef, setPayRef] = useState('');
  const [payUrl, setPayUrl] = useState('');
  const [payingBusy, setPayingBusy] = useState(false);

  // Respuesta a reseña
  const [respondingId, setRespondingId] = useState<string | null>(null);
  const [respuestaText, setRespuestaText] = useState('');
  const [savingRespuesta, setSavingRespuesta] = useState(false);

  const productEditorOpenRef = useRef(false);
  useEffect(() => {
    productEditorOpenRef.current = productEditor.open;
  }, [productEditor.open]);

  const handleModalClose = useCallback(() => {
    if (productEditorOpenRef.current) return;
    onClose();
  }, [onClose]);

  const dialogRef = useModalA11y(isOpen, handleModalClose);

  const loadStock = useCallback(async () => {
    setStockLoading(true);
    setStockError(null);
    try {
      setStock(await fetchStock());
    } catch {
      setStockError('No se pudo cargar el stock.');
    } finally {
      setStockLoading(false);
    }
  }, []);

  const loadAudit = useCallback(async () => {
    setAuditError(null);
    try {
      setAuditLog(await fetchAuditLog());
    } catch {
      setAuditError('No se pudo cargar la auditoría.');
    }
  }, []);

  const loadCategories = useCallback(async () => {
    try {
      setCategories(await fetchCategories());
    } catch {
      setCategories([]);
    }
  }, []);

  const loadReviews = useCallback(async (filter: ReviewFilter) => {
    setReviewsLoading(true);
    setReviewsError(null);
    try {
      setReviews(await fetchReviews(filter === 'all' ? undefined : filter));
    } catch {
      setReviewsError('No se pudieron cargar las reseñas.');
    } finally {
      setReviewsLoading(false);
    }
  }, []);

  const loadPedidos = useCallback(
    async (offset: number, append: boolean) => {
      setPedidosLoading(true);
      setPedidosError(null);
      try {
        const { rows, hasMore } = await fetchPedidos({
          estado: estadoFilter === 'all' ? undefined : estadoFilter,
          search: searchTerm,
          limit: PAGE_SIZE,
          offset,
        });
        setPedidos((prev) => (append ? [...prev, ...rows] : rows));
        setPedidosHasMore(hasMore);
      } catch {
        setPedidosError('No se pudieron cargar los pedidos.');
      } finally {
        setPedidosLoading(false);
      }
    },
    [estadoFilter, searchTerm]
  );

  // Gate de acceso + carga inicial (stock, auditoría, categorías).
  useEffect(() => {
    if (!isOpen) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      setAccessDenied(false);
      setGranted(false);
      const ok = await isCurrentUserAdmin();
      if (cancelled) return;
      if (!ok) {
        setAccessDenied(true);
        setLoading(false);
        return;
      }
      setGranted(true);
      await Promise.all([loadStock(), loadAudit(), loadCategories()]);
      if (!cancelled) setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [isOpen, loadStock, loadAudit, loadCategories]);

  // Pedidos: recarga al abrir y cuando cambia filtro/búsqueda.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (isOpen && granted) void loadPedidos(0, false);
  }, [isOpen, granted, loadPedidos]);

  // Reseñas: recarga al abrir y cuando cambia el filtro.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (isOpen && granted) void loadReviews(reviewFilter);
  }, [isOpen, granted, reviewFilter, loadReviews]);

  // Debounce de búsqueda.
  useEffect(() => {
    const id = setTimeout(() => setSearchTerm(searchInput), 300);
    return () => clearTimeout(id);
  }, [searchInput]);

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
      setConfirmingCancelId(null);
      onShowToast(`Pedido ${ESTADO_LABEL[to].toLowerCase()}`, undefined, 'success');
    } catch {
      onShowToast('No se pudo actualizar el estado', 'Revisá tu sesión de administrador.', 'error');
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
      onShowToast('No se pudo registrar el pago', 'Revisá tu sesión de administrador.', 'error');
    } finally {
      setPayingBusy(false);
    }
  };

  const moderateReview = async (
    review: ProductReview,
    action: 'approve' | 'hide' | 'feature' | 'delete'
  ) => {
    setReviewBusyId(review.id);
    try {
      if (action === 'approve') await setReviewStatus(review.id, 'approved');
      else if (action === 'hide') await setReviewStatus(review.id, 'hidden');
      else if (action === 'feature') await setReviewFeatured(review.id, !review.isFeatured);
      else await deleteReview(review.id);
      const label =
        action === 'approve' ? 'Reseña aprobada'
        : action === 'hide' ? 'Reseña ocultada'
        : action === 'feature' ? (review.isFeatured ? 'Quitada de destacadas' : 'Marcada como destacada')
        : 'Reseña eliminada';
      onShowToast(label, undefined, action === 'delete' ? 'info' : 'success');
      setConfirmingDeleteId(null);
      await loadReviews(reviewFilter);
    } catch {
      onShowToast('No se pudo completar la acción', undefined, 'error');
    } finally {
      setReviewBusyId(null);
    }
  };

  const saveResponder = async () => {
    if (!respondingId) return;
    setSavingRespuesta(true);
    try {
      await responderReview(respondingId, respuestaText);
      onShowToast(respuestaText.trim() ? 'Respuesta publicada' : 'Respuesta eliminada', undefined, 'success');
      setRespondingId(null);
      setRespuestaText('');
      await loadReviews(reviewFilter);
    } catch {
      onShowToast('No se pudo guardar la respuesta', undefined, 'error');
    } finally {
      setSavingRespuesta(false);
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
      onShowToast('Precio actualizado', `${current.nombre}: ${formatGuarani(nuevo)}.`, 'success');
    } catch {
      onShowToast('No se pudo actualizar el precio', undefined, 'error');
    } finally {
      setSavingStock((prev) => ({ ...prev, [id]: false }));
    }
  };

  const handleToggleActivo = async (row: StockRow) => {
    setSavingStock((prev) => ({ ...prev, [row.id]: true }));
    try {
      await setProductoActivo(row.id, !row.activo);
      setStock((prev) => prev.map((p) => (p.id === row.id ? { ...p, activo: !p.activo } : p)));
      onShowToast(row.activo ? 'Producto desactivado' : 'Producto activado', row.nombre, 'success');
    } catch {
      onShowToast('No se pudo cambiar el estado', undefined, 'error');
    } finally {
      setSavingStock((prev) => ({ ...prev, [row.id]: false }));
    }
  };

  const openEditProduct = async (id: string) => {
    setProductEditor({ open: true, producto: null, loading: true });
    try {
      const producto = await fetchProductoAdmin(id);
      setProductEditor({ open: true, producto, loading: false });
    } catch {
      setProductEditor({ open: false, producto: null, loading: false });
      onShowToast('No se pudo abrir el producto', undefined, 'error');
    }
  };

  if (!isOpen) return null;

  if (accessDenied && !loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60" onClick={onClose}>
        <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center" onClick={(e) => e.stopPropagation()}>
          <h3 className="font-semibold text-neutral-900 mb-1">Zona de administradores</h3>
          <p className="text-sm text-neutral-500 mb-5">Iniciá sesión con una cuenta administradora.</p>
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-[#102A43] text-white text-sm font-semibold rounded-full cursor-pointer"
          >
            Entendido
          </button>
        </div>
      </div>
    );
  }

  const sectionErrors = [pedidosError, stockError, reviewsError, auditError].filter(Boolean) as string[];

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
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-panel-title"
        initial={{ opacity: 0, scale: 0.97, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 10 }}
        className="relative bg-[#FAF8F5] w-full max-w-4xl rounded-3xl p-5 sm:p-6 shadow-2xl z-10 border border-neutral-200 max-h-[88vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-200 mb-4">
          <div>
            <h3 id="admin-panel-title" className="font-semibold text-lg text-[#102A43]">
              Panel de administración
            </h3>
            <p className="text-xs text-neutral-500 mt-0.5">Pedidos, stock, reseñas y auditoría.</p>
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
        <div role="tablist" className="flex items-center gap-2 mb-4">
          {(
            [
              { id: 'pedidos', label: `Pedidos${pedidos.length ? ` (${pedidos.length}${pedidosHasMore ? '+' : ''})` : ''}`, icon: <Package className="w-4 h-4" /> },
              { id: 'stock', label: 'Stock', icon: <Boxes className="w-4 h-4" /> },
              { id: 'reviews', label: `Reseñas${reviews.length ? ` (${reviews.length})` : ''}`, icon: <MessageSquareText className="w-4 h-4" /> },
              { id: 'audit_log', label: `Auditoría (${auditLog.length})`, icon: <CheckCircle2 className="w-4 h-4" /> },
            ] as { id: Tab; label: string; icon: React.ReactNode }[]
          ).map((t) => (
            <button
              key={t.id}
              role="tab"
              aria-selected={tab === t.id}
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
            onClick={() => {
              void loadStock();
              void loadAudit();
              void loadReviews(reviewFilter);
            }}
            className="ml-auto text-xs text-neutral-500 hover:text-neutral-800 px-2 py-1 cursor-pointer inline-flex items-center gap-1"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Recargar
          </button>
        </div>

        {sectionErrors.length > 0 && (
          <div className="flex items-start gap-2 text-xs text-rose-700 bg-rose-50 p-3 rounded-xl border border-rose-100 mb-3">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{sectionErrors.join(' ')}</span>
          </div>
        )}

        {/* Body */}
        <div className="overflow-y-auto flex-1 pr-1">
          {loading ? (
            <div className="flex items-center justify-center py-14 text-neutral-500 text-sm gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Cargando…</span>
            </div>
          ) : tab === 'pedidos' ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2 flex-wrap">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="search"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder="Buscar por cliente, teléfono o código…"
                    aria-label="Buscar pedidos"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-neutral-200 text-xs bg-white focus:outline-none focus:border-[#102A43]"
                  />
                </div>
              </div>
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {(['all', 'pendiente', 'pagado', 'enviado', 'entregado', 'cancelado'] as const).map((e) => (
                  <button
                    key={e}
                    onClick={() => setEstadoFilter(e)}
                    aria-pressed={estadoFilter === e}
                    className={`px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap cursor-pointer ${
                      estadoFilter === e
                        ? 'bg-[#102A43] text-white'
                        : 'bg-white text-neutral-500 border border-neutral-200'
                    }`}
                  >
                    {e === 'all' ? 'Todos' : ESTADO_LABEL[e]}
                  </button>
                ))}
              </div>

              {pedidos.length === 0 && !pedidosLoading ? (
                <p className="text-center text-xs text-neutral-400 py-10">No hay pedidos para mostrar.</p>
              ) : (
                pedidos.map((p) => (
                  <div key={p.id} className="bg-white rounded-2xl border border-neutral-200 p-4 text-xs">
                    <button
                      onClick={() => void handleExpand(p)}
                      aria-expanded={expandedId === p.id}
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
                          {new Date(p.creado_en).toLocaleDateString('es-PY', { day: '2-digit', month: 'short' })}
                        </div>
                      </div>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full border shrink-0 ${ESTADO_STYLE[p.estado]}`}>
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
                          <span className="font-semibold">{formatGuarani(p.costo_envio_gs ?? 0)}</span>
                        </div>
                        {p.direccion_envio && <p className="text-neutral-500">📍 {p.direccion_envio}</p>}
                        {p.referencia_pago && <p className="text-neutral-500">🧾 Ref: {p.referencia_pago}</p>}
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
                        {p.confirmado_por && <p className="text-neutral-500">✅ Confirmado por: {p.confirmado_por}</p>}

                        {confirmingCancelId === p.id ? (
                          <div className="flex items-center gap-2 pt-1 flex-wrap bg-rose-50 border border-rose-100 rounded-xl p-2.5">
                            <span className="text-rose-700 font-semibold">¿Cancelar este pedido? Es irreversible.</span>
                            <button
                              onClick={() => void handleEstado(p, 'cancelado')}
                              className="px-3 py-1.5 rounded-xl bg-rose-600 text-white text-xs font-semibold hover:bg-rose-700 cursor-pointer"
                            >
                              Sí, cancelar
                            </button>
                            <button
                              onClick={() => setConfirmingCancelId(null)}
                              className="px-3 py-1.5 rounded-xl bg-neutral-100 text-neutral-700 text-xs font-semibold hover:bg-neutral-200 cursor-pointer"
                            >
                              No
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 pt-1 flex-wrap">
                            {nextActions(p.estado).map((a) => (
                              <button
                                key={a.to}
                                onClick={() =>
                                  a.to === 'cancelado'
                                    ? setConfirmingCancelId(p.id)
                                    : a.form
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
                                  p.estado === 'pagado' ? 'confirmado el pago ✅'
                                  : p.estado === 'enviado' ? 'va en camino 🛵' : 'fue entregado 📦';
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
                        )}

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

              {pedidosHasMore && (
                <div className="flex justify-center pt-1">
                  <button
                    onClick={() => void loadPedidos(pedidos.length, true)}
                    disabled={pedidosLoading}
                    className="px-4 py-2 rounded-xl bg-white border border-neutral-200 text-xs font-semibold text-neutral-700 hover:border-neutral-400 disabled:opacity-50 cursor-pointer inline-flex items-center gap-2"
                  >
                    {pedidosLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    Cargar más
                  </button>
                </div>
              )}
            </div>
          ) : tab === 'stock' ? (
            <div className="space-y-3">
              <div className="flex justify-end">
                <button
                  onClick={() => setProductEditor({ open: true, producto: null, loading: false })}
                  className="px-3 py-2 rounded-xl bg-[#102A43] text-white text-xs font-semibold flex items-center gap-1.5 hover:bg-[#102A43]/90 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Nuevo producto
                </button>
              </div>
              {stockLoading ? (
                <div className="flex items-center justify-center py-10 text-neutral-500 text-sm gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" /> <span>Cargando…</span>
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="text-left text-neutral-400 border-b border-neutral-100">
                        <th className="px-4 py-2.5 font-semibold">Producto</th>
                        <th className="px-4 py-2.5 font-semibold text-right">Precio</th>
                        <th className="px-4 py-2.5 font-semibold text-right">Stock</th>
                        <th className="px-4 py-2.5 font-semibold text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stock.map((s) => (
                        <tr key={s.id} className="border-b border-neutral-50 last:border-0">
                          <td className="px-4 py-2.5">
                            <span className="font-semibold text-neutral-800">{s.nombre}</span>
                            <span className="text-neutral-400 ml-1.5">{s.marca}</span>
                            {!s.activo && (
                              <span className="ml-1.5 text-xs bg-neutral-200 text-neutral-600 px-1.5 py-0.5 rounded font-semibold">
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
                          <td className="px-4 py-2.5">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => void openEditProduct(s.id)}
                                disabled={!!savingStock[s.id]}
                                className="p-1.5 rounded-lg text-neutral-500 hover:text-[#102A43] hover:bg-neutral-100 disabled:opacity-40 cursor-pointer"
                                aria-label={`Editar ${s.nombre}`}
                                title="Editar producto"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => void handleToggleActivo(s)}
                                disabled={!!savingStock[s.id]}
                                className="px-2 py-1 rounded-lg text-xs font-semibold bg-neutral-100 text-neutral-600 hover:bg-neutral-200 disabled:opacity-40 cursor-pointer"
                              >
                                {s.activo ? 'Desactivar' : 'Activar'}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ) : tab === 'audit_log' ? (
            <div className="space-y-3">
              {auditLog.length === 0 ? (
                <p className="text-center text-xs text-neutral-400 py-10">Sin acciones registradas.</p>
              ) : (
                auditLog.map((entry) => (
                  <div key={entry.id} className="bg-white rounded-2xl border border-neutral-200 p-4 text-xs">
                    <div className="flex items-center justify-between gap-3 mb-1.5">
                      <span className="font-semibold text-neutral-900">{entry.accion}</span>
                      <span className="text-xs text-neutral-400">{formatReviewDate(entry.realizado_en)}</span>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-xs bg-[#102A43]/5 text-[#102A43] font-semibold px-2 py-0.5 rounded-md">
                        {entry.tabla_objetivo}
                      </span>
                      {entry.registro_objetivo && (
                        <span className="text-xs text-neutral-400 font-mono">#{entry.registro_objetivo.slice(0, 8)}</span>
                      )}
                    </div>
                    {entry.detalle && <p className="text-xs text-neutral-600 italic">{entry.detalle}</p>}
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {REVIEW_FILTERS.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setReviewFilter(f.id)}
                    aria-pressed={reviewFilter === f.id}
                    className={`px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap cursor-pointer ${
                      reviewFilter === f.id
                        ? 'bg-[#102A43] text-white'
                        : 'bg-white text-neutral-500 border border-neutral-200'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              {reviewsLoading ? (
                <div className="flex items-center justify-center py-10 text-neutral-500 text-sm gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" /> <span>Cargando…</span>
                </div>
              ) : reviews.length === 0 ? (
                <p className="text-center text-xs text-neutral-400 py-10">No hay reseñas en este filtro.</p>
              ) : (
                reviews.map((r) => (
                  <div key={r.id} className="bg-white rounded-2xl border border-neutral-200 p-4 text-xs">
                    <div className="flex items-center justify-between gap-3 mb-1.5">
                      <span className="font-semibold text-neutral-900 flex items-center gap-1.5 flex-wrap">
                        {r.author.name}
                        <span className="text-amber-500 font-bold">★ {r.rating}</span>
                        {r.status === 'hidden' && (
                          <span className="text-xs bg-neutral-200 text-neutral-600 px-1.5 py-0.5 rounded font-semibold">Oculta</span>
                        )}
                        {r.status === 'pending' && (
                          <span className="text-xs bg-amber-50 text-amber-700 border border-amber-200 px-1.5 py-0.5 rounded font-semibold">Pendiente</span>
                        )}
                        {r.isFeatured && (
                          <span className="text-xs bg-[#102A43]/10 text-[#102A43] px-1.5 py-0.5 rounded font-semibold">Destacada</span>
                        )}
                        {r.isVerifiedPurchase && (
                          <span className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 font-semibold px-1.5 py-0.5 rounded-md">
                            Compra verificada
                          </span>
                        )}
                      </span>
                      <span className="text-xs text-neutral-400">{formatReviewDate(r.createdAt)}</span>
                    </div>
                    <p className="text-neutral-700 italic mb-1">&quot;{r.comment}&quot;</p>
                    {r.fotos && r.fotos.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {r.fotos.map((url) => (
                          <img
                            key={url}
                            src={url}
                            alt={`Foto de la reseña de ${r.author.name}`}
                            className="w-14 h-14 object-cover rounded-lg border border-neutral-200"
                            loading="lazy"
                          />
                        ))}
                      </div>
                    )}
                    <p className="text-xs text-neutral-400 font-mono mb-2.5">{r.productId}</p>

                    {r.respuestaAdmin && respondingId !== r.id && (
                      <div className="bg-[#102A43]/5 border-l-2 border-[#102A43] rounded-r-lg px-3 py-2 mb-2.5">
                        <div className="text-xs font-bold text-[#102A43] mb-0.5">Ya respondiste:</div>
                        <p className="text-xs text-neutral-700">{r.respuestaAdmin}</p>
                      </div>
                    )}

                    {respondingId === r.id && (
                      <div className="mb-2.5">
                        <textarea
                          rows={3}
                          maxLength={1000}
                          placeholder="Tu respuesta pública como Skin Health…"
                          value={respuestaText}
                          onChange={(e) => setRespuestaText(e.target.value)}
                          className="w-full p-2 rounded-lg border border-neutral-300 text-xs focus:outline-none focus:border-[#102A43]"
                        />
                        <div className="flex items-center gap-2 mt-1.5">
                          <button
                            type="button"
                            disabled={savingRespuesta}
                            onClick={() => void saveResponder()}
                            className="px-3 py-1.5 rounded-lg bg-[#102A43] text-white text-xs font-semibold hover:bg-[#102A43]/90 disabled:opacity-50 cursor-pointer"
                          >
                            {savingRespuesta ? 'Guardando…' : 'Publicar respuesta'}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setRespondingId(null);
                              setRespuestaText('');
                            }}
                            className="px-3 py-1.5 rounded-lg bg-neutral-100 text-neutral-700 text-xs font-semibold hover:bg-neutral-200 cursor-pointer"
                          >
                            Cancelar
                          </button>
                          <span className="text-xs text-neutral-400 ml-auto">{respuestaText.length}/1000</span>
                        </div>
                      </div>
                    )}

                    {confirmingDeleteId === r.id ? (
                      <div className="flex items-center gap-2 flex-wrap bg-rose-50 border border-rose-100 rounded-xl p-2.5">
                        <span className="text-rose-700 font-semibold">¿Eliminar esta reseña? No se puede deshacer.</span>
                        <button
                          onClick={() => void moderateReview(r, 'delete')}
                          disabled={reviewBusyId === r.id}
                          className="px-3 py-1.5 rounded-xl bg-rose-600 text-white text-xs font-semibold hover:bg-rose-700 disabled:opacity-50 cursor-pointer"
                        >
                          Sí, eliminar
                        </button>
                        <button
                          onClick={() => setConfirmingDeleteId(null)}
                          className="px-3 py-1.5 rounded-xl bg-neutral-100 text-neutral-700 text-xs font-semibold hover:bg-neutral-200 cursor-pointer"
                        >
                          No
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 flex-wrap">
                        {r.status !== 'approved' && (
                          <button
                            onClick={() => void moderateReview(r, 'approve')}
                            disabled={reviewBusyId === r.id}
                            className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-semibold flex items-center gap-1.5 hover:bg-emerald-700 disabled:opacity-50 cursor-pointer"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Aprobar</span>
                          </button>
                        )}
                        {r.status !== 'hidden' && (
                          <button
                            onClick={() => void moderateReview(r, 'hide')}
                            disabled={reviewBusyId === r.id}
                            className="px-3 py-1.5 rounded-xl bg-neutral-100 text-neutral-700 text-xs font-semibold flex items-center gap-1.5 hover:bg-neutral-200 disabled:opacity-50 cursor-pointer"
                          >
                            <EyeOff className="w-3.5 h-3.5" />
                            <span>Ocultar</span>
                          </button>
                        )}
                        <button
                          onClick={() => void moderateReview(r, 'feature')}
                          disabled={reviewBusyId === r.id}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 disabled:opacity-50 cursor-pointer ${
                            r.isFeatured
                              ? 'bg-[#102A43] text-white hover:bg-[#102A43]/90'
                              : 'bg-white border border-[#102A43]/30 text-[#102A43] hover:bg-[#102A43]/5'
                          }`}
                        >
                          <Star className="w-3.5 h-3.5" />
                          <span>{r.isFeatured ? 'Quitar destacada' : 'Destacar'}</span>
                        </button>
                        {respondingId !== r.id && (
                          <button
                            onClick={() => {
                              setRespondingId(r.id);
                              setRespuestaText(r.respuestaAdmin || '');
                            }}
                            className="px-3 py-1.5 rounded-xl bg-white border border-[#102A43]/30 text-[#102A43] text-xs font-semibold hover:bg-[#102A43]/5 cursor-pointer"
                          >
                            {r.respuestaAdmin ? 'Editar respuesta' : 'Responder'}
                          </button>
                        )}
                        <button
                          onClick={() => setConfirmingDeleteId(r.id)}
                          disabled={reviewBusyId === r.id}
                          className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-600 hover:bg-rose-50 disabled:opacity-40 cursor-pointer ml-auto"
                          aria-label={`Eliminar reseña de ${r.author.name}`}
                          title="Eliminar reseña"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </motion.div>

      <ProductEditModal
        key={productEditor.producto?.id ?? 'nuevo'}
        isOpen={productEditor.open && !productEditor.loading}
        producto={productEditor.producto}
        categories={categories}
        onClose={() => setProductEditor({ open: false, producto: null, loading: false })}
        onSaved={() => void loadStock()}
        onShowToast={onShowToast}
      />
    </div>
  );
};

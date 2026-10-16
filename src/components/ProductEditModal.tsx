import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Plus, Trash2, Loader2 } from 'lucide-react';
import { CategoryOption } from '../types';
import { ProductoAdmin, createProducto, updateProducto } from '../data/admin';
import { formatGuarani } from '../data/products';
import { useModalA11y } from '../hooks/useModalA11y';

interface ProductEditModalProps {
  isOpen: boolean;
  /** null = alta nueva */
  producto: ProductoAdmin | null;
  categories: CategoryOption[];
  onClose: () => void;
  onSaved: () => void;
  onShowToast: (title: string, description?: string, type?: 'success' | 'error' | 'info') => void;
}

const SKIN_TYPES = ['normal', 'grasa', 'seca', 'mixta', 'sensible'];

const EMPTY: ProductoAdmin = {
  id: '',
  nombre: '',
  marca: '',
  subtitle: '',
  categoria_id: '',
  categoria_label: '',
  precio_gs: 0,
  stock: 0,
  volumen: '',
  badge: '',
  descripcion: '',
  key_ingredients: '',
  skin_type: '',
  how_to_use: '',
  imagen_url: '',
  activo: true,
  beneficios: [],
};

function slugify(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}

const field =
  'w-full px-3 py-2 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:border-[#102A43]';
const label = 'block text-xs font-semibold text-neutral-600 mb-1';

export const ProductEditModal: React.FC<ProductEditModalProps> = ({
  isOpen,
  producto,
  categories,
  onClose,
  onSaved,
  onShowToast,
}) => {
  // El padre monta este modal con `key` según el producto, así que el estado
  // inicial se calcula una sola vez a partir de las props.
  const [form, setForm] = useState<ProductoAdmin>(() =>
    producto ? { ...producto, beneficios: producto.beneficios.map((b) => ({ ...b })) } : { ...EMPTY }
  );
  const [saving, setSaving] = useState(false);
  const ref = useModalA11y(isOpen, onClose);

  const isEditing = producto !== null;

  if (!isOpen) return null;

  const set = <K extends keyof ProductoAdmin>(key: K, value: ProductoAdmin[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const onNombreChange = (value: string) =>
    setForm((prev) => ({
      ...prev,
      nombre: value,
      id: isEditing ? prev.id : slugify(value),
    }));

  const onCategoryChange = (id: string) => {
    const cat = categories.find((c) => c.id === id);
    setForm((prev) => ({ ...prev, categoria_id: id, categoria_label: cat?.label ?? prev.categoria_label }));
  };

  const setBeneficio = (index: number, patch: Partial<{ titulo: string; descripcion: string }>) =>
    setForm((prev) => ({
      ...prev,
      beneficios: prev.beneficios.map((b, i) => (i === index ? { ...b, ...patch } : b)),
    }));

  const addBeneficio = () =>
    setForm((prev) => ({
      ...prev,
      beneficios: [...prev.beneficios, { titulo: '', descripcion: '', orden: prev.beneficios.length }],
    }));

  const removeBeneficio = (index: number) =>
    setForm((prev) => ({
      ...prev,
      beneficios: prev.beneficios.filter((_, i) => i !== index).map((b, i) => ({ ...b, orden: i })),
    }));

  const handleSave = async () => {
    if (!form.nombre.trim()) return onShowToast('Falta el nombre', undefined, 'error');
    if (!form.marca.trim()) return onShowToast('Falta la marca', undefined, 'error');
    if (!isEditing && !/^[a-z0-9-]+$/.test(form.id)) {
      return onShowToast('ID inválido', 'Usá minúsculas, números y guiones.', 'error');
    }
    if (!form.categoria_id) return onShowToast('Elegí una categoría', undefined, 'error');
    if (!(form.precio_gs > 0)) return onShowToast('Precio inválido', undefined, 'error');
    if (form.stock < 0) return onShowToast('Stock inválido', undefined, 'error');

    const payload: ProductoAdmin = {
      ...form,
      beneficios: form.beneficios
        .filter((b) => b.titulo.trim() || b.descripcion.trim())
        .map((b, i) => ({ ...b, orden: i })),
    };

    setSaving(true);
    try {
      if (isEditing) await updateProducto(form.id, payload);
      else await createProducto(payload);
      onShowToast(isEditing ? 'Producto actualizado' : 'Producto creado', form.nombre, 'success');
      onSaved();
      onClose();
    } catch (err) {
      const msg = (err as { message?: string })?.message ?? '';
      onShowToast(
        isEditing ? 'No se pudo guardar' : 'No se pudo crear',
        msg.includes('duplicate')
          ? 'Ya existe un producto con ese ID.'
          : 'Revisá la migración 015 (permisos admin) en Supabase.',
        'error'
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] overflow-y-auto p-4 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-2xs"
      />
      <motion.div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-edit-title"
        initial={{ opacity: 0, scale: 0.97, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 10 }}
        className="relative bg-[#FAF8F5] w-full max-w-2xl rounded-3xl p-5 sm:p-6 shadow-2xl z-10 border border-neutral-200 max-h-[90vh] flex flex-col"
      >
        <div className="flex items-center justify-between pb-4 border-b border-neutral-200 mb-4">
          <h3 id="product-edit-title" className="font-semibold text-lg text-[#102A43]">
            {isEditing ? 'Editar producto' : 'Nuevo producto'}
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-neutral-200/70 hover:bg-neutral-300 flex items-center justify-center text-neutral-600"
            aria-label="Cerrar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 pr-1 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className={label} htmlFor="pe-nombre">Nombre *</label>
              <input id="pe-nombre" className={field} value={form.nombre} onChange={(e) => onNombreChange(e.target.value)} />
            </div>
            <div>
              <label className={label} htmlFor="pe-marca">Marca *</label>
              <input id="pe-marca" className={field} value={form.marca} onChange={(e) => set('marca', e.target.value)} />
            </div>
            <div>
              <label className={label} htmlFor="pe-id">ID (slug) {isEditing ? '' : '*'}</label>
              <input
                id="pe-id"
                className={`${field} font-mono text-xs disabled:bg-neutral-100 disabled:text-neutral-400`}
                value={form.id}
                disabled={isEditing}
                onChange={(e) => set('id', slugify(e.target.value))}
              />
            </div>
            <div>
              <label className={label} htmlFor="pe-categoria">Categoría *</label>
              <select id="pe-categoria" className={field} value={form.categoria_id} onChange={(e) => onCategoryChange(e.target.value)}>
                <option value="">— Elegir —</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={label} htmlFor="pe-precio">Precio (Gs) *</label>
              <input
                id="pe-precio"
                inputMode="numeric"
                className={field}
                value={form.precio_gs || ''}
                onChange={(e) => set('precio_gs', Number.parseInt(e.target.value.replace(/\D/g, ''), 10) || 0)}
              />
              <span className="text-xs text-neutral-400">{formatGuarani(form.precio_gs || 0)}</span>
            </div>
            <div>
              <label className={label} htmlFor="pe-stock">Stock *</label>
              <input
                id="pe-stock"
                type="number"
                min={0}
                className={field}
                value={form.stock}
                onChange={(e) => set('stock', Math.max(0, Number.parseInt(e.target.value, 10) || 0))}
              />
            </div>
            <div>
              <label className={label} htmlFor="pe-volumen">Volumen</label>
              <input id="pe-volumen" className={field} value={form.volumen} onChange={(e) => set('volumen', e.target.value)} placeholder="50ml" />
            </div>
            <div>
              <label className={label} htmlFor="pe-badge">Badge</label>
              <input id="pe-badge" className={field} value={form.badge} onChange={(e) => set('badge', e.target.value)} placeholder="Bestseller" />
            </div>
            <div>
              <label className={label} htmlFor="pe-skintype">Tipo de piel</label>
              <select id="pe-skintype" className={field} value={form.skin_type} onChange={(e) => set('skin_type', e.target.value)}>
                <option value="">—</option>
                {SKIN_TYPES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={label} htmlFor="pe-imagen">Imagen (URL)</label>
              <input id="pe-imagen" className={field} value={form.imagen_url} onChange={(e) => set('imagen_url', e.target.value)} placeholder="https://…" />
            </div>
          </div>

          <div>
            <label className={label} htmlFor="pe-subtitle">Subtítulo</label>
            <input id="pe-subtitle" className={field} value={form.subtitle} onChange={(e) => set('subtitle', e.target.value)} />
          </div>
          <div>
            <label className={label} htmlFor="pe-desc">Descripción</label>
            <textarea id="pe-desc" rows={3} className={field} value={form.descripcion} onChange={(e) => set('descripcion', e.target.value)} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className={label} htmlFor="pe-ing">Ingredientes clave</label>
              <textarea id="pe-ing" rows={2} className={field} value={form.key_ingredients} onChange={(e) => set('key_ingredients', e.target.value)} placeholder="Niacinamida, Zinc…" />
            </div>
            <div>
              <label className={label} htmlFor="pe-how">Modo de uso</label>
              <textarea id="pe-how" rows={2} className={field} value={form.how_to_use} onChange={(e) => set('how_to_use', e.target.value)} />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <span className={label}>Beneficios</span>
              <button
                type="button"
                onClick={addBeneficio}
                className="text-xs font-semibold text-[#102A43] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Agregar
              </button>
            </div>
            <div className="space-y-2">
              {form.beneficios.map((b, i) => (
                <div key={i} className="flex items-start gap-2">
                  <input
                    className={`${field} max-w-[40%]`}
                    value={b.titulo}
                    placeholder="Título"
                    onChange={(e) => setBeneficio(i, { titulo: e.target.value })}
                    aria-label={`Título del beneficio ${i + 1}`}
                  />
                  <input
                    className={field}
                    value={b.descripcion}
                    placeholder="Descripción"
                    onChange={(e) => setBeneficio(i, { descripcion: e.target.value })}
                    aria-label={`Descripción del beneficio ${i + 1}`}
                  />
                  <button
                    type="button"
                    onClick={() => removeBeneficio(i)}
                    className="p-2 rounded-lg text-neutral-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                    aria-label={`Quitar beneficio ${i + 1}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm text-neutral-700">
            <input
              type="checkbox"
              checked={form.activo}
              onChange={(e) => set('activo', e.target.checked)}
              className="w-4 h-4"
            />
            Producto activo (visible en la tienda)
          </label>
        </div>

        <div className="flex items-center justify-end gap-2 pt-4 mt-4 border-t border-neutral-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-neutral-100 text-neutral-700 text-sm font-semibold hover:bg-neutral-200 cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={() => void handleSave()}
            disabled={saving}
            className="px-4 py-2 rounded-xl bg-[#102A43] text-white text-sm font-semibold hover:bg-[#102A43]/90 disabled:opacity-50 cursor-pointer inline-flex items-center gap-2"
          >
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            {saving ? 'Guardando…' : isEditing ? 'Guardar cambios' : 'Crear producto'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import type { Pedido, PedidoCreateDto, PedidoUpdateDto } from '../types/pedido';
import { X, Save, AlertCircle, Hash, User, Calendar, DollarSign, Activity } from 'lucide-react';
import toast from 'react-hot-toast';

interface PedidoFormModalProps {
  isOpen: boolean;
  pedidoToEdit: Pedido | null;
  isLoading: boolean;
  onClose: () => void;
  onSubmit: (data: PedidoCreateDto | PedidoUpdateDto, id?: number) => Promise<void>;
}

export const PedidoFormModal: React.FC<PedidoFormModalProps> = ({
  isOpen,
  pedidoToEdit,
  isLoading,
  onClose,
  onSubmit,
}) => {
  const isEditing = !!pedidoToEdit;

  const [numeroPedido, setNumeroPedido] = useState('');
  const [cliente, setCliente] = useState('');
  const [fecha, setFecha] = useState('');
  const [total, setTotal] = useState<string>('');
  const [estado, setEstado] = useState<string>('Registrado');

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (pedidoToEdit) {
      setNumeroPedido(pedidoToEdit.numeroPedido);
      setCliente(pedidoToEdit.cliente);
      // Extraer YYYY-MM-DD para el input date
      const dateStr = pedidoToEdit.fecha ? pedidoToEdit.fecha.substring(0, 10) : '';
      setFecha(dateStr);
      setTotal(pedidoToEdit.total.toString());
      setEstado(pedidoToEdit.estado || 'Registrado');
    } else {
      // Valor por defecto para creación
      const today = new Date().toISOString().substring(0, 10);
      const randomId = Math.floor(100 + Math.random() * 900);
      setNumeroPedido(`PED-${randomId}`);
      setCliente('');
      setFecha(today);
      setTotal('');
      setEstado('Registrado');
    }
    setErrors({});
  }, [pedidoToEdit, isOpen]);

  if (!isOpen) return null;

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!isEditing) {
      if (!numeroPedido.trim()) {
        newErrors.numeroPedido = 'El número de pedido es obligatorio';
      } else if (numeroPedido.trim().length < 3) {
        newErrors.numeroPedido = 'Debe tener al menos 3 caracteres (ej: PED-101)';
      }
    }

    if (!cliente.trim()) {
      newErrors.cliente = 'El nombre del cliente es obligatorio';
    } else if (cliente.trim().length < 3) {
      newErrors.cliente = 'El cliente debe tener al menos 3 caracteres';
    }

    if (!fecha) {
      newErrors.fecha = 'La fecha del pedido es obligatoria';
    }

    const numTotal = parseFloat(total);
    if (!total || isNaN(numTotal)) {
      newErrors.total = 'Debe ingresar un monto válido';
    } else if (numTotal <= 0) {
      newErrors.total = 'Regla de negocio: El total debe ser mayor a 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      toast.error('Por favor complete los campos correctamente');
      return;
    }

    const parsedTotal = parseFloat(total);

    if (isEditing && pedidoToEdit) {
      const updateDto: PedidoUpdateDto = {
        cliente: cliente.trim(),
        fecha: new Date(fecha).toISOString(),
        total: parsedTotal,
        estado,
      };
      await onSubmit(updateDto, pedidoToEdit.id);
    } else {
      const createDto: PedidoCreateDto = {
        numeroPedido: numeroPedido.trim().toUpperCase(),
        cliente: cliente.trim(),
        fecha: new Date(fecha).toISOString(),
        total: parsedTotal,
        estado,
      };
      await onSubmit(createDto);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 transform transition-all"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-xl font-bold text-slate-900">
              {isEditing ? 'Editar Pedido' : 'Registrar Nuevo Pedido'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {isEditing ? `Modificando pedido #${numeroPedido}` : 'Complete la información para generar la orden'}
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          
          {/* Numero Pedido */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Número de Pedido {isEditing && <span className="text-slate-400 normal-case">(No editable)</span>}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Hash className="w-4 h-4" />
              </div>
              <input
                type="text"
                disabled={isEditing || isLoading}
                value={numeroPedido}
                onChange={(e) => setNumeroPedido(e.target.value.toUpperCase())}
                placeholder="PED-001"
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-hidden ${
                  errors.numeroPedido 
                    ? 'border-rose-300 bg-rose-50/30 text-rose-900 focus:border-rose-500 focus:ring-2 focus:ring-rose-200' 
                    : 'border-slate-200 bg-white text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100'
                } ${isEditing ? 'bg-slate-100 text-slate-500 cursor-not-allowed' : ''}`}
              />
            </div>
            {errors.numeroPedido && (
              <p className="text-xs text-rose-600 mt-1 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.numeroPedido}
              </p>
            )}
          </div>

          {/* Cliente */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Nombre del Cliente
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                disabled={isLoading}
                value={cliente}
                onChange={(e) => setCliente(e.target.value)}
                placeholder="Ej. Juan Pérez"
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-hidden ${
                  errors.cliente 
                    ? 'border-rose-300 bg-rose-50/30 text-rose-900 focus:border-rose-500 focus:ring-2 focus:ring-rose-200' 
                    : 'border-slate-200 bg-white text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100'
                }`}
              />
            </div>
            {errors.cliente && (
              <p className="text-xs text-rose-600 mt-1 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.cliente}
              </p>
            )}
          </div>

          {/* Fecha y Total (Grid de 2 columnas) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Fecha */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Fecha
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Calendar className="w-4 h-4" />
                </div>
                <input
                  type="date"
                  disabled={isLoading}
                  value={fecha}
                  onChange={(e) => setFecha(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-hidden ${
                    errors.fecha 
                      ? 'border-rose-300 bg-rose-50/30 text-rose-900 focus:border-rose-500 focus:ring-2 focus:ring-rose-200' 
                      : 'border-slate-200 bg-white text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100'
                  }`}
                />
              </div>
              {errors.fecha && (
                <p className="text-xs text-rose-600 mt-1 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.fecha}
                </p>
              )}
            </div>

            {/* Total */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Total ($ USD)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <DollarSign className="w-4 h-4" />
                </div>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  disabled={isLoading}
                  value={total}
                  onChange={(e) => setTotal(e.target.value)}
                  placeholder="0.00"
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-hidden ${
                    errors.total 
                      ? 'border-rose-300 bg-rose-50/30 text-rose-900 focus:border-rose-500 focus:ring-2 focus:ring-rose-200' 
                      : 'border-slate-200 bg-white text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100'
                  }`}
                />
              </div>
              {errors.total && (
                <p className="text-xs text-rose-600 mt-1 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.total}
                </p>
              )}
            </div>
          </div>

          {/* Estado */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Estado del Pedido
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Activity className="w-4 h-4" />
              </div>
              <select
                disabled={isLoading}
                value={estado}
                onChange={(e) => setEstado(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:outline-hidden cursor-pointer"
              >
                <option value="Registrado">Registrado</option>
                <option value="Procesado">Procesado</option>
                <option value="Entregado">Entregado</option>
                <option value="Cancelado">Cancelado</option>
              </select>
            </div>
          </div>

          {/* Acciones */}
          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-600/30 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              {isLoading ? 'Guardando...' : (isEditing ? 'Guardar Cambios' : 'Crear Pedido')}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

import React, { useState, useEffect, useMemo } from 'react';
import type { Pedido, PedidoCreateDto, PedidoUpdateDto } from '../types/pedido';
import { pedidosService } from '../services/pedidosService';
import { Navbar } from '../components/Navbar';
import { PedidoFormModal } from '../components/PedidoFormModal';
import { ConfirmModal } from '../components/ConfirmModal';
import toast from 'react-hot-toast';
import { 
  Plus, 
  Search, 
  Filter, 
  DollarSign, 
  ShoppingBag, 
  CheckCircle2, 
  Clock, 
  Edit3, 
  Trash2, 
  RefreshCw,
  TrendingUp,
  AlertCircle
} from 'lucide-react';

export const PedidosListPage: React.FC = () => {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedEstado, setSelectedEstado] = useState<string>('Todos');
  const [sortBy, setSortBy] = useState<'date-desc' | 'date-asc' | 'total-desc' | 'total-asc'>('date-desc');

  // Modal States
  const [isFormModalOpen, setIsFormModalOpen] = useState<boolean>(false);
  const [pedidoToEdit, setPedidoToEdit] = useState<Pedido | null>(null);
  const [isFormSubmitting, setIsFormSubmitting] = useState<boolean>(false);

  // Delete Modal States
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [pedidoToDelete, setPedidoToDelete] = useState<Pedido | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  // Carga de pedidos desde la API
  const fetchPedidos = async () => {
    setIsLoading(true);
    try {
      const data = await pedidosService.getAll();
      setPedidos(data);
    } catch (error: any) {
      console.error('Error al obtener pedidos:', error);
      toast.error('No se pudo conectar con la API de Pedidos. ¿Está encendido el Backend?');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPedidos();
  }, []);

  // Cálculos estadísticos para las tarjetas métricas
  const stats = useMemo(() => {
    const totalCount = pedidos.length;
    const totalAmount = pedidos.reduce((sum, p) => sum + (Number(p.total) || 0), 0);
    const registrados = pedidos.filter((p) => p.estado === 'Registrado').length;
    const completados = pedidos.filter((p) => p.estado === 'Entregado' || p.estado === 'Procesado').length;

    return {
      totalCount,
      totalAmount,
      registrados,
      completados,
    };
  }, [pedidos]);

  // Filtrado y ordenamiento en cliente
  const filteredPedidos = useMemo(() => {
    return pedidos
      .filter((p) => {
        const matchesSearch =
          p.numeroPedido.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.cliente.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesEstado =
          selectedEstado === 'Todos' || p.estado === selectedEstado;

        return matchesSearch && matchesEstado;
      })
      .sort((a, b) => {
        if (sortBy === 'date-desc') {
          return new Date(b.fecha).getTime() - new Date(a.fecha).getTime();
        }
        if (sortBy === 'date-asc') {
          return new Date(a.fecha).getTime() - new Date(b.fecha).getTime();
        }
        if (sortBy === 'total-desc') {
          return b.total - a.total;
        }
        if (sortBy === 'total-asc') {
          return a.total - b.total;
        }
        return 0;
      });
  }, [pedidos, searchTerm, selectedEstado, sortBy]);

  // Manejadores de Formularios
  const handleOpenCreateModal = () => {
    setPedidoToEdit(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (pedido: Pedido) => {
    setPedidoToEdit(pedido);
    setIsFormModalOpen(true);
  };

  const handleFormSubmit = async (data: PedidoCreateDto | PedidoUpdateDto, id?: number) => {
    setIsFormSubmitting(true);
    try {
      if (id) {
        // Actualizar
        const updated = await pedidosService.update(id, data as PedidoUpdateDto);
        setPedidos((prev) => prev.map((p) => (p.id === id ? updated : p)));
        toast.success(`Pedido #${updated.numeroPedido} actualizado exitosamente`);
      } else {
        // Crear
        const created = await pedidosService.create(data as PedidoCreateDto);
        setPedidos((prev) => [created, ...prev]);
        toast.success(`Pedido #${created.numeroPedido} registrado correctamente`);
      }
      setIsFormModalOpen(false);
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Error al procesar la solicitud.';
      toast.error(msg);
    } finally {
      setIsFormSubmitting(false);
    }
  };

  // Manejadores de Eliminación
  const handleOpenDeleteModal = (pedido: Pedido) => {
    setPedidoToDelete(pedido);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!pedidoToDelete) return;
    setIsDeleting(true);
    try {
      await pedidosService.delete(pedidoToDelete.id);
      setPedidos((prev) => prev.filter((p) => p.id !== pedidoToDelete.id));
      toast.success(`Pedido #${pedidoToDelete.numeroPedido} eliminado`);
      setIsDeleteModalOpen(false);
      setPedidoToDelete(null);
    } catch (error: any) {
      const msg = error.response?.data?.message || 'No se pudo eliminar el pedido';
      toast.error(msg);
    } finally {
      setIsDeleting(false);
    }
  };

  // Renderizador de Badge según estado
  const renderEstadoBadge = (estado: string) => {
    switch (estado) {
      case 'Registrado':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-50 text-blue-700 border border-blue-200">
            <Clock className="w-3 h-3" />
            Registrado
          </span>
        );
      case 'Procesado':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-50 text-amber-700 border border-amber-200">
            <TrendingUp className="w-3 h-3" />
            Procesado
          </span>
        );
      case 'Entregado':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" />
            Entregado
          </span>
        );
      case 'Cancelado':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full bg-rose-50 text-rose-700 border border-rose-200">
            <AlertCircle className="w-3 h-3" />
            Cancelado
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full bg-slate-100 text-slate-700">
            {estado}
          </span>
        );
    }
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(val);
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/70 pb-16">
      {/* Header & Navigation */}
      <Navbar onOpenCreateModal={handleOpenCreateModal} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Page Title & Main Action */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Control de Pedidos
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Monitoreo, registro y administración de transacciones comerciales
            </p>
          </div>
          
          <div className="flex items-center gap-2.5">
            <button
              onClick={fetchPedidos}
              title="Refrescar lista"
              className="p-2.5 text-slate-600 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl shadow-xs transition-colors hover:text-indigo-600"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-indigo-600' : ''}`} />
            </button>
            <button
              onClick={handleOpenCreateModal}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-600/30 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Nuevo Pedido
            </button>
          </div>
        </div>

        {/* Stat Cards Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Pedidos</p>
              <p className="text-2xl font-extrabold text-slate-900 mt-0.5">{stats.totalCount}</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Monto Acumulado</p>
              <p className="text-2xl font-extrabold text-slate-900 mt-0.5">{formatCurrency(stats.totalAmount)}</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pendientes</p>
              <p className="text-2xl font-extrabold text-slate-900 mt-0.5">{stats.registrados}</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Completados</p>
              <p className="text-2xl font-extrabold text-slate-900 mt-0.5">{stats.completados}</p>
            </div>
          </div>

        </div>

        {/* Filter and Search Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs mb-6 flex flex-col md:flex-row gap-3 items-center justify-between">
          
          {/* Search Input */}
          <div className="relative w-full md:w-96">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por cliente o número de pedido..."
              className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:outline-hidden transition-all"
            />
          </div>

          {/* Estado Filter & Sort */}
          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
              <Filter className="w-3.5 h-3.5" />
              <span>Estado:</span>
            </div>
            <select
              value={selectedEstado}
              onChange={(e) => setSelectedEstado(e.target.value)}
              className="py-1.5 px-3 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 bg-white focus:outline-hidden focus:border-indigo-500 cursor-pointer"
            >
              <option value="Todos">Todos los Estados</option>
              <option value="Registrado">Registrado</option>
              <option value="Procesado">Procesado</option>
              <option value="Entregado">Entregado</option>
              <option value="Cancelado">Cancelado</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="py-1.5 px-3 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 bg-white focus:outline-hidden focus:border-indigo-500 cursor-pointer"
            >
              <option value="date-desc">Fecha: Más reciente</option>
              <option value="date-asc">Fecha: Más antiguo</option>
              <option value="total-desc">Total: Mayor a menor</option>
              <option value="total-asc">Total: Menor a mayor</option>
            </select>
          </div>

        </div>

        {/* Data Table */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          
          {isLoading ? (
            <div className="py-20 flex flex-col items-center justify-center text-slate-400 gap-3">
              <RefreshCw className="w-8 h-8 animate-spin text-indigo-600" />
              <p className="text-sm font-medium">Cargando pedidos en tiempo real...</p>
            </div>
          ) : filteredPedidos.length === 0 ? (
            <div className="py-16 text-center px-4">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-slate-800">No se encontraron pedidos</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                {searchTerm || selectedEstado !== 'Todos'
                  ? 'Intenta ajustar los filtros de búsqueda para encontrar lo que necesitas.'
                  : 'Aún no hay pedidos registrados en el sistema. Comienza creando el primero.'}
              </p>
              {!(searchTerm || selectedEstado !== 'Todos') && (
                <button
                  onClick={handleOpenCreateModal}
                  className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all"
                >
                  <Plus className="w-4 h-4" />
                  Crear Primer Pedido
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/75 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-3.5 px-5">ID / Pedido</th>
                    <th className="py-3.5 px-5">Cliente</th>
                    <th className="py-3.5 px-5">Fecha</th>
                    <th className="py-3.5 px-5">Monto Total</th>
                    <th className="py-3.5 px-5">Estado</th>
                    <th className="py-3.5 px-5 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {filteredPedidos.map((pedido) => (
                    <tr 
                      key={pedido.id}
                      className="hover:bg-slate-50/80 transition-colors group"
                    >
                      <td className="py-4 px-5">
                        <span className="font-mono font-bold text-indigo-700 bg-indigo-50/80 px-2.5 py-1 rounded-md border border-indigo-100 text-xs">
                          {pedido.numeroPedido}
                        </span>
                      </td>

                      <td className="py-4 px-5 font-semibold text-slate-900">
                        {pedido.cliente}
                      </td>

                      <td className="py-4 px-5 text-slate-500 text-xs">
                        {formatDate(pedido.fecha)}
                      </td>

                      <td className="py-4 px-5 font-bold text-slate-900">
                        {formatCurrency(pedido.total)}
                      </td>

                      <td className="py-4 px-5">
                        {renderEstadoBadge(pedido.estado)}
                      </td>

                      <td className="py-4 px-5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEditModal(pedido)}
                            title="Editar pedido"
                            className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOpenDeleteModal(pedido)}
                            title="Eliminar pedido"
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Table Footer */}
          {!isLoading && filteredPedidos.length > 0 && (
            <div className="py-3 px-5 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs text-slate-500 font-medium">
              <span>Mostrando {filteredPedidos.length} de {pedidos.length} pedidos</span>
              <span>Actualizado automáticamente</span>
            </div>
          )}

        </div>

      </main>

      {/* Form Modal (Crear / Editar) */}
      <PedidoFormModal
        isOpen={isFormModalOpen}
        pedidoToEdit={pedidoToEdit}
        isLoading={isFormSubmitting}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleFormSubmit}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        title="¿Eliminar Pedido?"
        message={`¿Estás seguro de que deseas eliminar permanentemente el pedido #${pedidoToDelete?.numeroPedido} del cliente "${pedidoToDelete?.cliente}"? Esta acción no se puede deshacer.`}
        confirmText="Sí, Eliminar"
        cancelText="Cancelar"
        isDanger={true}
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onClose={() => setIsDeleteModalOpen(false)}
      />

    </div>
  );
};

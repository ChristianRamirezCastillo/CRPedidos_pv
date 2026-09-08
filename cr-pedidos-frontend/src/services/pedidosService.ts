import { api } from './api';
import type { Pedido, PedidoCreateDto, PedidoUpdateDto } from '../types/pedido';

export const pedidosService = {
  getAll: async (): Promise<Pedido[]> => {
    const response = await api.get<Pedido[]>('/api/pedidos');
    return response.data;
  },

  getById: async (id: number): Promise<Pedido> => {
    const response = await api.get<Pedido>(`/api/pedidos/${id}`);
    return response.data;
  },

  create: async (dto: PedidoCreateDto): Promise<Pedido> => {
    const response = await api.post<Pedido>('/api/pedidos', dto);
    return response.data;
  },

  update: async (id: number, dto: PedidoUpdateDto): Promise<Pedido> => {
    const response = await api.put<Pedido>(`/api/pedidos/${id}`, dto);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/api/pedidos/${id}`);
  },
};

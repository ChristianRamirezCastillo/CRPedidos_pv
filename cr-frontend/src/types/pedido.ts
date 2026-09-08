export type EstadoPedido = 'Registrado' | 'Procesado' | 'Entregado' | 'Cancelado';

export interface Pedido {
  id: number;
  numeroPedido: string;
  cliente: string;
  fecha: string;
  total: number;
  estado: EstadoPedido | string;
}

export interface PedidoCreateDto {
  numeroPedido: string;
  cliente: string;
  fecha: string;
  total: number;
  estado?: string;
}

export interface PedidoUpdateDto {
  cliente: string;
  fecha: string;
  total: number;
  estado: string;
}

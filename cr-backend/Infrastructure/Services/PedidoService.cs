using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CR.PedidosApi.Application.DTOs;
using CR.PedidosApi.Application.Interfaces;
using CR.PedidosApi.Domain.Entities;
using CR.PedidosApi.Domain.Interfaces;

namespace CR.PedidosApi.Infrastructure.Services
{
    public class PedidoService : IPedidoService
    {
        private readonly IUnidadDeTrabajo _unidadDeTrabajo;

        public PedidoService(IUnidadDeTrabajo unidadDeTrabajo)
        {
            _unidadDeTrabajo = unidadDeTrabajo;
        }

        public async Task<IEnumerable<PedidoDto>> ObtenerTodosAsync()
        {
            var pedidos = await _unidadDeTrabajo.Pedidos.ObtenerTodosAsync();
            return pedidos.Select(MapToDto);
        }

        public async Task<PedidoDto?> ObtenerPorIdAsync(int id)
        {
            var pedido = await _unidadDeTrabajo.Pedidos.ObtenerPorIdAsync(id);
            return pedido != null ? MapToDto(pedido) : null;
        }

        public async Task<PedidoDto> CrearAsync(PedidoCreateDto dto)
        {
            // Validaciones de negocio
            if (dto.Total <= 0)
                throw new ArgumentException("El total debe ser mayor a 0");

            var existe = await _unidadDeTrabajo.Pedidos.ObtenerPorNumeroAsync(dto.NumeroPedido);
            if (existe != null)
                throw new InvalidOperationException("El número de pedido ya existe");

            var pedido = new Pedido
            {
                NumeroPedido = dto.NumeroPedido,
                Cliente = dto.Cliente,
                Fecha = dto.Fecha,
                Total = dto.Total,
                Estado = dto.Estado
            };

            await _unidadDeTrabajo.Pedidos.CrearAsync(pedido);
            await _unidadDeTrabajo.GuardarCambiosAsync();

            return MapToDto(pedido);
        }

        public async Task<PedidoDto> ActualizarAsync(int id, PedidoUpdateDto dto)
        {
            var pedido = await _unidadDeTrabajo.Pedidos.ObtenerPorIdAsync(id);
            if (pedido == null)
                throw new KeyNotFoundException("Pedido no encontrado");

            if (dto.Total <= 0)
                throw new ArgumentException("El total debe ser mayor a 0");

            pedido.Cliente = dto.Cliente;
            pedido.Fecha = dto.Fecha;
            pedido.Total = dto.Total;
            pedido.Estado = dto.Estado;

            await _unidadDeTrabajo.Pedidos.ActualizarAsync(pedido);
            await _unidadDeTrabajo.GuardarCambiosAsync();

            return MapToDto(pedido);
        }

        public async Task EliminarAsync(int id)
        {
            var pedido = await _unidadDeTrabajo.Pedidos.ObtenerPorIdAsync(id);
            if (pedido == null)
                throw new KeyNotFoundException("Pedido no encontrado");

            await _unidadDeTrabajo.Pedidos.EliminarAsync(id);
            await _unidadDeTrabajo.GuardarCambiosAsync();
        }

        private static PedidoDto MapToDto(Pedido p) => new()
        {
            Id = p.Id,
            NumeroPedido = p.NumeroPedido,
            Cliente = p.Cliente,
            Fecha = p.Fecha,
            Total = p.Total,
            Estado = p.Estado
        };
    }
}
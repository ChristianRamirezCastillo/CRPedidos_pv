using System.Collections.Generic;
using System.Threading.Tasks;
using CR.PedidosApi.Domain.Entities;

namespace CR.PedidosApi.Domain.Interfaces
{
    public interface IRepositorioPedidos
    {
        Task<IEnumerable<Pedido>> ObtenerTodosAsync();
        Task<Pedido?> ObtenerPorIdAsync(int id);
        Task<Pedido?> ObtenerPorNumeroAsync(string numeroPedido);
        Task<Pedido> CrearAsync(Pedido pedido);
        Task<Pedido> ActualizarAsync(Pedido pedido);
        Task EliminarAsync(int id);
    }
}
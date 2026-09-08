using System.Collections.Generic;
using System.Threading.Tasks;
using CR.PedidosApi.Application.DTOs;

namespace CR.PedidosApi.Application.Interfaces
{
    public interface IPedidoService
    {
        Task<IEnumerable<PedidoDto>> ObtenerTodosAsync();
        Task<PedidoDto?> ObtenerPorIdAsync(int id);
        Task<PedidoDto> CrearAsync(PedidoCreateDto dto);
        Task<PedidoDto> ActualizarAsync(int id, PedidoUpdateDto dto);
        Task EliminarAsync(int id);
    }
}

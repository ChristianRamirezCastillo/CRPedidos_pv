using System.Threading.Tasks;

namespace CR.PedidosApi.Domain.Interfaces
{
    public interface IUnidadDeTrabajo
    {
        IRepositorioPedidos Pedidos { get; }
        Task<int> GuardarCambiosAsync();
    }
}

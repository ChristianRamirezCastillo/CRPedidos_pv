using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using CR.PedidosApi.Domain.Entities;
using CR.PedidosApi.Domain.Interfaces;
using CR.PedidosApi.Infrastructure.Data;

namespace CR.PedidosApi.Infrastructure.Repositories
{
    public class RepositorioPedidos : IRepositorioPedidos
    {
        private readonly AppDbContext _context;

        public RepositorioPedidos(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Pedido>> ObtenerTodosAsync()
        {
            return await _context.Pedidos.ToListAsync();
        }

        public async Task<Pedido?> ObtenerPorIdAsync(int id)
        {
            return await _context.Pedidos.FindAsync(id);
        }

        public async Task<Pedido?> ObtenerPorNumeroAsync(string numeroPedido)
        {
            return await _context.Pedidos.FirstOrDefaultAsync(p => p.NumeroPedido == numeroPedido);
        }

        public async Task<Pedido> CrearAsync(Pedido pedido)
        {
            _context.Pedidos.Add(pedido);
            await _context.SaveChangesAsync();
            return pedido;
        }

        public async Task<Pedido> ActualizarAsync(Pedido pedido)
        {
            _context.Pedidos.Update(pedido);
            await _context.SaveChangesAsync();
            return pedido;
        }

        public async Task EliminarAsync(int id)
        {
            var pedido = await _context.Pedidos.FindAsync(id);
            if (pedido != null)
            {
                _context.Pedidos.Remove(pedido);
                await _context.SaveChangesAsync();
            }
        }
    }

    public class UnidadDeTrabajo : IUnidadDeTrabajo
    {
        private readonly AppDbContext _context;
        private RepositorioPedidos? _pedidos;

        public UnidadDeTrabajo(AppDbContext context)
        {
            _context = context;
        }

        public IRepositorioPedidos Pedidos => _pedidos ??= new RepositorioPedidos(_context);

        public async Task<int> GuardarCambiosAsync()
        {
            return await _context.SaveChangesAsync();
        }
    }
}
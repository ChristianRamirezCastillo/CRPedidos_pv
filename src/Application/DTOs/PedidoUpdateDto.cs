using System;

namespace CR.PedidosApi.Application.DTOs
{
    public class PedidoUpdateDto
    {
        public string Cliente { get; set; } = string.Empty;
        public DateTime Fecha { get; set; }
        public decimal Total { get; set; }
        public string Estado { get; set; } = string.Empty;
    }
}

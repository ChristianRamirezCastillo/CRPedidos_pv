using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using CR.PedidosApi.Application.Interfaces;
using CR.PedidosApi.Domain.Entities;
using CR.PedidosApi.Infrastructure.Data;

using Microsoft.Extensions.Options;
using CR.PedidosApi.Infrastructure.Auth;

namespace CR.PedidosApi.Infrastructure.Services
{
    public class AuthService : IAuthService
    {
        private readonly AppDbContext _context;
        private readonly IPasswordHasher _hasher;
        private readonly IJwtTokenGenerator _tokenGenerator;
        private readonly JwtSettings _jwtSettings;

        public AuthService(AppDbContext context, IPasswordHasher hasher, IJwtTokenGenerator tokenGenerator, IOptions<JwtSettings> jwtOptions)
        {
            _context = context;
            _hasher = hasher;
            _tokenGenerator = tokenGenerator;
            _jwtSettings = jwtOptions.Value;
        }

        public async Task<(string token, int expiresIn)> LoginAsync(string email, string password)
        {
            var usuario = await _context.Usuarios.FirstOrDefaultAsync(u => u.Email == email);
            if (usuario == null || !_hasher.Verify(password, usuario.PasswordHash))
            {
                throw new UnauthorizedAccessException("Credenciales inválidas");
            }

            var token = _tokenGenerator.GenerateToken(usuario.Id, usuario.Email, usuario.Rol);
            var expiresInSeconds = (_jwtSettings.ExpiryMinutes > 0 ? _jwtSettings.ExpiryMinutes : 60) * 60;
            return (token, expiresInSeconds);
        }
    }
}
using System.Threading.Tasks;

namespace CR.PedidosApi.Application.Interfaces
{
    public interface IAuthService
    {
        Task<(string token, int expiresIn)> LoginAsync(string email, string password);
    }

    public interface IJwtTokenGenerator
    {
        string GenerateToken(int userId, string email, string rol);
    }

    public interface IPasswordHasher
    {
        string Hash(string password);
        bool Verify(string password, string hash);
    }
}

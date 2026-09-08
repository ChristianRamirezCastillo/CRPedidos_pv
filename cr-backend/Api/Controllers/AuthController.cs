using Microsoft.AspNetCore.Mvc;
using CR.PedidosApi.Application.Interfaces;
using CR.PedidosApi.Application.DTOs;

namespace CR.PedidosApi.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Route("auth")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("login")]
        public async Task<ActionResult<LoginResponseDto>> Login([FromBody] LoginRequestDto request)
        {
            try
            {
                var (token, expiresIn) = await _authService.LoginAsync(request.Email, request.Password);
                return Ok(new LoginResponseDto
                {
                    Token = token,
                    ExpiresIn = expiresIn
                });
            }
            catch (UnauthorizedAccessException)
            {
                return Unauthorized(new { message = "Credenciales inválidas" });
            }
        }
    }
}
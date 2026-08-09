using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AutoPrime.Facturacion.Data;
using AutoPrime.Facturacion.Models;

namespace AutoPrime.Facturacion.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AutoPrimeDbContext _context;

        public AuthController(AutoPrimeDbContext context)
        {
            _context = context;
        }

        public class LoginDto
        {
            public string NombreUsuario { get; set; } = string.Empty;
            public string Password { get; set; } = string.Empty;
        }

        public class UsuarioRespuestaDto
        {
            public int Id { get; set; }
            public string NombreUsuario { get; set; } = string.Empty;
            public string Nombre { get; set; } = string.Empty;
            public string Rol { get; set; } = string.Empty;
        }

        [HttpPost("login")]
        public async Task<ActionResult<UsuarioRespuestaDto>> Login(LoginDto dto)
        {
            var usuario = await _context.Usuarios
                .FirstOrDefaultAsync(u => u.NombreUsuario == dto.NombreUsuario && u.Activo);

            if (usuario == null || !BCrypt.Net.BCrypt.Verify(dto.Password, usuario.PasswordHash))
                return Unauthorized("Usuario o contraseña incorrectos.");

            return new UsuarioRespuestaDto
            {
                Id = usuario.Id,
                NombreUsuario = usuario.NombreUsuario,
                Nombre = usuario.Nombre,
                Rol = usuario.Rol.ToString()
            };
        }
    }
}
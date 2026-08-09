using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AutoPrime.Facturacion.Data;
using AutoPrime.Facturacion.Models;

namespace AutoPrime.Facturacion.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsuariosController : ControllerBase
    {
        private readonly AutoPrimeDbContext _context;

        public UsuariosController(AutoPrimeDbContext context)
        {
            _context = context;
        }

        public class UsuarioListadoDto
        {
            public int Id { get; set; }
            public string NombreUsuario { get; set; } = string.Empty;
            public string Nombre { get; set; } = string.Empty;
            public string Rol { get; set; } = string.Empty;
            public bool Activo { get; set; }
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<UsuarioListadoDto>>> GetUsuarios()
        {
            return await _context.Usuarios
                .Select(u => new UsuarioListadoDto
                {
                    Id = u.Id,
                    NombreUsuario = u.NombreUsuario,
                    Nombre = u.Nombre,
                    Rol = u.Rol.ToString(),
                    Activo = u.Activo
                })
                .ToListAsync();
        }

        public class CrearUsuarioDto
        {
            public string NombreUsuario { get; set; } = string.Empty;
            public string Nombre { get; set; } = string.Empty;
            public string Password { get; set; } = string.Empty;
            public RolUsuario Rol { get; set; }
        }

        [HttpPost]
        public async Task<ActionResult> PostUsuario(CrearUsuarioDto dto)
        {
            var existe = await _context.Usuarios.AnyAsync(u => u.NombreUsuario == dto.NombreUsuario);
            if (existe)
                return BadRequest("Ese nombre de usuario ya existe.");

            var usuario = new Usuario
            {
                NombreUsuario = dto.NombreUsuario,
                Nombre = dto.Nombre,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                Rol = dto.Rol,
                Activo = true
            };

            _context.Usuarios.Add(usuario);
            await _context.SaveChangesAsync();

            return Ok(new { usuario.Id, usuario.NombreUsuario, usuario.Nombre, Rol = usuario.Rol.ToString() });
        }

        public class ActualizarUsuarioDto
        {
            public string Nombre { get; set; } = string.Empty;
            public RolUsuario Rol { get; set; }
            public bool Activo { get; set; }
            public string? NuevaPassword { get; set; } // opcional, solo si se quiere cambiar
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutUsuario(int id, ActualizarUsuarioDto dto)
        {
            var usuario = await _context.Usuarios.FindAsync(id);
            if (usuario == null) return NotFound();

            usuario.Nombre = dto.Nombre;
            usuario.Rol = dto.Rol;
            usuario.Activo = dto.Activo;

            if (!string.IsNullOrWhiteSpace(dto.NuevaPassword))
                usuario.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.NuevaPassword);

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUsuario(int id)
        {
            var usuario = await _context.Usuarios.FindAsync(id);
            if (usuario == null) return NotFound();

            _context.Usuarios.Remove(usuario);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
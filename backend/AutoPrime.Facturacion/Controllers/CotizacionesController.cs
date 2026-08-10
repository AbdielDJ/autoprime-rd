using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AutoPrime.Facturacion.Data;
using AutoPrime.Facturacion.Models;

namespace AutoPrime.Facturacion.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CotizacionesController : ControllerBase
    {
        private readonly AutoPrimeDbContext _context;

        public CotizacionesController(AutoPrimeDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Cotizacion>>> GetCotizaciones()
        {
            return await _context.Cotizaciones
                .Include(c => c.Vehiculo)
                .OrderByDescending(c => c.Fecha)
                .ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Cotizacion>> GetCotizacion(int id)
        {
            var cotizacion = await _context.Cotizaciones.Include(c => c.Vehiculo).FirstOrDefaultAsync(c => c.Id == id);
            if (cotizacion == null) return NotFound();
            return cotizacion;
        }

        public class CrearCotizacionDto
        {
            public string Nombre { get; set; } = string.Empty;
            public string Telefono { get; set; } = string.Empty;
            public string? Correo { get; set; }
            public string? VehiculoInteres { get; set; }
            public int? VehiculoId { get; set; }
            public string? Mensaje { get; set; }
        }

        [HttpPost]
        public async Task<ActionResult<Cotizacion>> PostCotizacion(CrearCotizacionDto dto)
        {
            var cotizacion = new Cotizacion
            {
                Nombre = dto.Nombre,
                Telefono = dto.Telefono,
                Correo = dto.Correo,
                VehiculoInteres = dto.VehiculoInteres,
                VehiculoId = dto.VehiculoId,
                Mensaje = dto.Mensaje,
                Fecha = DateTime.UtcNow,
                Estado = EstadoCotizacion.Nueva
            };

            _context.Cotizaciones.Add(cotizacion);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetCotizacion), new { id = cotizacion.Id }, cotizacion);
        }

        [HttpPut("{id}/estado")]
        public async Task<IActionResult> ActualizarEstado(int id, [FromBody] EstadoCotizacion nuevoEstado)
        {
            var cotizacion = await _context.Cotizaciones.FindAsync(id);
            if (cotizacion == null) return NotFound();

            cotizacion.Estado = nuevoEstado;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCotizacion(int id)
        {
            var cotizacion = await _context.Cotizaciones.FindAsync(id);
            if (cotizacion == null) return NotFound();

            _context.Cotizaciones.Remove(cotizacion);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
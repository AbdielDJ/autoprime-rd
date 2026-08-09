using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AutoPrime.Facturacion.Data;
using AutoPrime.Facturacion.Models;

namespace AutoPrime.Facturacion.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class VehiculosController : ControllerBase
    {
        private readonly AutoPrimeDbContext _context;

        public VehiculosController(AutoPrimeDbContext context)
        {
            _context = context;
        }

        // GET: api/vehiculos
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Vehiculo>>> GetVehiculos()
        {
            return await _context.Vehiculos.ToListAsync();
        }

        // GET: api/vehiculos/disponibles
        [HttpGet("disponibles")]
        public async Task<ActionResult<IEnumerable<Vehiculo>>> GetVehiculosDisponibles()
        {
            return await _context.Vehiculos
                .Where(v => v.Estado == EstadoVehiculo.Disponible)
                .ToListAsync();
        }

        // GET: api/vehiculos/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Vehiculo>> GetVehiculo(int id)
        {
            var vehiculo = await _context.Vehiculos.FindAsync(id);

            if (vehiculo == null)
                return NotFound();

            return vehiculo;
        }
        // GET: api/vehiculos/slug/toyota-corolla-2021
        [HttpGet("slug/{slug}")]
        public async Task<ActionResult<Vehiculo>> GetVehiculoPorSlug(string slug)
        {
            var vehiculo = await _context.Vehiculos.FirstOrDefaultAsync(v => v.Slug == slug);

            if (vehiculo == null)
                return NotFound();

            return vehiculo;
        }

        // POST: api/vehiculos
        [HttpPost]
        public async Task<ActionResult<Vehiculo>> PostVehiculo(Vehiculo vehiculo)
        {
            _context.Vehiculos.Add(vehiculo);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetVehiculo), new { id = vehiculo.Id }, vehiculo);
        }

        // PUT: api/vehiculos/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutVehiculo(int id, Vehiculo vehiculo)
        {
            if (id != vehiculo.Id)
                return BadRequest();

            _context.Entry(vehiculo).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Vehiculos.Any(v => v.Id == id))
                    return NotFound();
                else
                    throw;
            }

            return NoContent();
        }

        // DELETE: api/vehiculos/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteVehiculo(int id)
        {
            var vehiculo = await _context.Vehiculos.FindAsync(id);
            if (vehiculo == null)
                return NotFound();

            _context.Vehiculos.Remove(vehiculo);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AutoPrime.Facturacion.Data;
using AutoPrime.Facturacion.Models;
using AutoPrime.Facturacion.Services;

namespace AutoPrime.Facturacion.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FacturasController : ControllerBase
    {
        private readonly AutoPrimeDbContext _context;
        private readonly FacturaService _facturaService;

        public FacturasController(AutoPrimeDbContext context, FacturaService facturaService)
        {
            _context = context;
            _facturaService = facturaService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Factura>>> GetFacturas()
        {
            return await _context.Facturas
                .Include(f => f.Cliente)
                .Include(f => f.Vehiculo)
                .ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Factura>> GetFactura(int id)
        {
            var factura = await _context.Facturas
                .Include(f => f.Cliente)
                .Include(f => f.Vehiculo)
                .FirstOrDefaultAsync(f => f.Id == id);

            if (factura == null)
                return NotFound();

            return factura;
        }

        public class CrearFacturaDto
        {
            public int ClienteId { get; set; }
            public int VehiculoId { get; set; }
            public string? Vendedor { get; set; }
            public decimal Descuento { get; set; } = 0;
            public string? MetodoPago { get; set; }
            public string? Observaciones { get; set; }
        }

        [HttpPost]
        public async Task<ActionResult<Factura>> PostFactura(CrearFacturaDto dto)
        {
            var vehiculo = await _context.Vehiculos.FindAsync(dto.VehiculoId);
            if (vehiculo == null)
                return NotFound("Vehículo no encontrado.");

            if (vehiculo.Estado != EstadoVehiculo.Disponible)
                return BadRequest("Este vehículo no está disponible para la venta.");

            var cliente = await _context.Clientes.FindAsync(dto.ClienteId);
            if (cliente == null)
                return NotFound("Cliente no encontrado.");

            var subtotal = vehiculo.Precio;
            var (itbis, total) = _facturaService.CalcularMontos(subtotal, dto.Descuento);
            var numeroFactura = await _facturaService.GenerarNumeroFacturaAsync();
            var ncf = await _facturaService.GenerarNcfAsync(cliente.CedulaORnc);

            var factura = new Factura
            {
                NumeroFactura = numeroFactura,
                Ncf = ncf,
                Fecha = DateTime.Now,
                ClienteId = dto.ClienteId,
                VehiculoId = dto.VehiculoId,
                Vendedor = dto.Vendedor,
                Subtotal = subtotal,
                Descuento = dto.Descuento,
                Itbis = itbis,
                Total = total,
                MetodoPago = dto.MetodoPago,
                Estado = EstadoFactura.Pagada,
                Observaciones = dto.Observaciones
            };

            _context.Facturas.Add(factura);

            vehiculo.Estado = EstadoVehiculo.Vendido;

            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetFactura), new { id = factura.Id }, factura);
        }

        [HttpPut("{id}/anular")]
        public async Task<IActionResult> AnularFactura(int id)
        {
            var factura = await _context.Facturas.Include(f => f.Vehiculo).FirstOrDefaultAsync(f => f.Id == id);
            if (factura == null)
                return NotFound();

            factura.Estado = EstadoFactura.Anulada;

            if (factura.Vehiculo != null)
                factura.Vehiculo.Estado = EstadoVehiculo.Disponible;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteFactura(int id)
        {
            var factura = await _context.Facturas.FindAsync(id);
            if (factura == null)
                return NotFound();

            _context.Facturas.Remove(factura);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
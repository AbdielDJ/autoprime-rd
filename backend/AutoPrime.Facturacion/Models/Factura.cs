using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AutoPrime.Facturacion.Models
{
    public enum EstadoFactura
    {
        Pagada,
        Pendiente,
        Anulada
    }

    public class Factura
    {
        public int Id { get; set; }

        [Required, MaxLength(20)]
        public string NumeroFactura { get; set; } = string.Empty; // Ej: FACT-0001

        public DateTime Fecha { get; set; } = DateTime.Now;

        // Relación con Cliente
        public int ClienteId { get; set; }
        public Cliente? Cliente { get; set; }

        // Relación con Vehiculo
        public int VehiculoId { get; set; }
        public Vehiculo? Vehiculo { get; set; }

        [MaxLength(100)]
        public string? Vendedor { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal Subtotal { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal Descuento { get; set; } = 0;

        [Column(TypeName = "decimal(18,2)")]
        public decimal Itbis { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal Total { get; set; }

        [MaxLength(30)]
        public string? MetodoPago { get; set; } // Contado / Financiamiento / Tarjeta / Transferencia

        public EstadoFactura Estado { get; set; } = EstadoFactura.Pendiente;

        [MaxLength(500)]
        public string? Observaciones { get; set; }

        [MaxLength(20)]
        public string? Ncf { get; set; }
    }
}
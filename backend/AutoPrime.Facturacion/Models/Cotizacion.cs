using System.ComponentModel.DataAnnotations;

namespace AutoPrime.Facturacion.Models
{
    public enum EstadoCotizacion
    {
        Nueva,
        Contactada,
        Cerrada
    }

    public class Cotizacion
    {
        public int Id { get; set; }

        [Required, MaxLength(150)]
        public string Nombre { get; set; } = string.Empty;

        [Required, MaxLength(20)]
        public string Telefono { get; set; } = string.Empty;

        [MaxLength(150)]
        public string? Correo { get; set; }

        [MaxLength(150)]
        public string? VehiculoInteres { get; set; }

        public int? VehiculoId { get; set; }
        public Vehiculo? Vehiculo { get; set; }

        [MaxLength(500)]
        public string? Mensaje { get; set; }

        public DateTime Fecha { get; set; } = DateTime.UtcNow;

        public EstadoCotizacion Estado { get; set; } = EstadoCotizacion.Nueva;
    }
}
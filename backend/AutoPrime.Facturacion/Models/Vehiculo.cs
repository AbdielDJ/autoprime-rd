using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AutoPrime.Facturacion.Models
{
    public enum EstadoVehiculo
    {
        Disponible,
        Vendido,
        Reservado
    }

    public class Vehiculo
    {
        public int Id { get; set; }

        [Required, MaxLength(20)]
        public string Codigo { get; set; } = string.Empty; // Ej: AP-0001

        [Required, MaxLength(150)]
        public string Slug { get; set; } = string.Empty; // Ej: toyota-corolla-2021

        [Required, MaxLength(50)]
        public string Marca { get; set; } = string.Empty;

        [Required, MaxLength(50)]
        public string Modelo { get; set; } = string.Empty;

        public int Anio { get; set; }

        public int Kilometraje { get; set; }

        [MaxLength(30)]
        public string? Transmision { get; set; }

        [MaxLength(30)]
        public string? Combustible { get; set; }

        [MaxLength(50)]
        public string? Motor { get; set; }

        [MaxLength(30)]
        public string? Traccion { get; set; }

        [MaxLength(30)]
        public string? ColorExterior { get; set; }

        [MaxLength(30)]
        public string? ColorInterior { get; set; }

        public int Pasajeros { get; set; } = 5;

        [MaxLength(500)]
        public string? Descripcion { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal Precio { get; set; }

        public EstadoVehiculo Estado { get; set; } = EstadoVehiculo.Disponible;

        // Listas guardadas como texto separado por "|" (simple, sin tablas extra)
        public string ImagenesRaw { get; set; } = string.Empty;
        public string CaracteristicasRaw { get; set; } = string.Empty;

        [NotMapped]
        public List<string> Imagenes
        {
            get => string.IsNullOrEmpty(ImagenesRaw)
                ? new List<string>()
                : ImagenesRaw.Split('|', StringSplitOptions.RemoveEmptyEntries).ToList();
            set => ImagenesRaw = string.Join('|', value);
        }

        [NotMapped]
        public List<string> Caracteristicas
        {
            get => string.IsNullOrEmpty(CaracteristicasRaw)
                ? new List<string>()
                : CaracteristicasRaw.Split('|', StringSplitOptions.RemoveEmptyEntries).ToList();
            set => CaracteristicasRaw = string.Join('|', value);
        }

        public ICollection<Factura> Facturas { get; set; } = new List<Factura>();
    }
}
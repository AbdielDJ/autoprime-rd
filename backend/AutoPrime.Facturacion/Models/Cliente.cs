using System.ComponentModel.DataAnnotations;

namespace AutoPrime.Facturacion.Models
{
    public class Cliente
    {
        public int Id { get; set; }

        [Required, MaxLength(150)]
        public string Nombre { get; set; } = string.Empty;

        [Required, MaxLength(20)]
        public string CedulaORnc { get; set; } = string.Empty;

        [MaxLength(20)]
        public string? Telefono { get; set; }

        [MaxLength(150)]
        public string? Correo { get; set; }

        [MaxLength(250)]
        public string? Direccion { get; set; }

        // Un cliente puede tener varias facturas
        public ICollection<Factura> Facturas { get; set; } = new List<Factura>();
    }
}
using System.ComponentModel.DataAnnotations;

namespace AutoPrime.Facturacion.Models
{
    public enum RolUsuario
    {
        Administrador,
        Cajero
    }

    public class Usuario
    {
        public int Id { get; set; }

        [Required, MaxLength(50)]
        public string NombreUsuario { get; set; } = string.Empty;

        [Required, MaxLength(100)]
        public string Nombre { get; set; } = string.Empty;

        [Required]
        public string PasswordHash { get; set; } = string.Empty;

        public RolUsuario Rol { get; set; } = RolUsuario.Cajero;

        public bool Activo { get; set; } = true;
    }
}
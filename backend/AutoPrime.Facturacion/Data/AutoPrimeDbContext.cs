using Microsoft.EntityFrameworkCore;
using AutoPrime.Facturacion.Models;

namespace AutoPrime.Facturacion.Data
{
    public class AutoPrimeDbContext : DbContext
    {
        public AutoPrimeDbContext(DbContextOptions<AutoPrimeDbContext> options)
            : base(options)
        {
        }

        public DbSet<Cliente> Clientes { get; set; }
        public DbSet<Vehiculo> Vehiculos { get; set; }
        public DbSet<Factura> Facturas { get; set; }
        public DbSet<Cotizacion> Cotizaciones { get; set; }
        public DbSet<Usuario> Usuarios { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Evita que un vehículo se borre en cascada al borrar sus facturas
            modelBuilder.Entity<Factura>()
                .HasOne(f => f.Vehiculo)
                .WithMany(v => v.Facturas)
                .HasForeignKey(f => f.VehiculoId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Usuario>()
                .HasIndex(u => u.NombreUsuario)
                .IsUnique();

            modelBuilder.Entity<Factura>()
                .HasOne(f => f.Cliente)
                .WithMany(c => c.Facturas)
                .HasForeignKey(f => f.ClienteId)
                .OnDelete(DeleteBehavior.Restrict);

            // Que el código de vehículo y número de factura sean únicos
            modelBuilder.Entity<Vehiculo>()
                .HasIndex(v => v.Codigo)
                .IsUnique();

            modelBuilder.Entity<Factura>()
                .HasIndex(f => f.NumeroFactura)
                .IsUnique();
        }
    }
}

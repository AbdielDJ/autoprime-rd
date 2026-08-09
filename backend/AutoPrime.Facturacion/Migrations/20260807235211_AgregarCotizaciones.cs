using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AutoPrime.Facturacion.Migrations
{
    /// <inheritdoc />
    public partial class AgregarCotizaciones : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Cotizaciones",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Nombre = table.Column<string>(type: "TEXT", maxLength: 150, nullable: false),
                    Telefono = table.Column<string>(type: "TEXT", maxLength: 20, nullable: false),
                    Correo = table.Column<string>(type: "TEXT", maxLength: 150, nullable: true),
                    VehiculoInteres = table.Column<string>(type: "TEXT", maxLength: 150, nullable: true),
                    VehiculoId = table.Column<int>(type: "INTEGER", nullable: true),
                    Mensaje = table.Column<string>(type: "TEXT", maxLength: 500, nullable: true),
                    Fecha = table.Column<DateTime>(type: "TEXT", nullable: false),
                    Estado = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Cotizaciones", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Cotizaciones_Vehiculos_VehiculoId",
                        column: x => x.VehiculoId,
                        principalTable: "Vehiculos",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_Cotizaciones_VehiculoId",
                table: "Cotizaciones",
                column: "VehiculoId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Cotizaciones");
        }
    }
}

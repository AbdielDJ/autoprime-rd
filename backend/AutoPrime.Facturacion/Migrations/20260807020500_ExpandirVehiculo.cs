using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AutoPrime.Facturacion.Migrations
{
    /// <inheritdoc />
    public partial class ExpandirVehiculo : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "CaracteristicasRaw",
                table: "Vehiculos",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "ColorExterior",
                table: "Vehiculos",
                type: "TEXT",
                maxLength: 30,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ColorInterior",
                table: "Vehiculos",
                type: "TEXT",
                maxLength: 30,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Descripcion",
                table: "Vehiculos",
                type: "TEXT",
                maxLength: 500,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ImagenesRaw",
                table: "Vehiculos",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Motor",
                table: "Vehiculos",
                type: "TEXT",
                maxLength: 50,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Pasajeros",
                table: "Vehiculos",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "Slug",
                table: "Vehiculos",
                type: "TEXT",
                maxLength: 150,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Traccion",
                table: "Vehiculos",
                type: "TEXT",
                maxLength: 30,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CaracteristicasRaw",
                table: "Vehiculos");

            migrationBuilder.DropColumn(
                name: "ColorExterior",
                table: "Vehiculos");

            migrationBuilder.DropColumn(
                name: "ColorInterior",
                table: "Vehiculos");

            migrationBuilder.DropColumn(
                name: "Descripcion",
                table: "Vehiculos");

            migrationBuilder.DropColumn(
                name: "ImagenesRaw",
                table: "Vehiculos");

            migrationBuilder.DropColumn(
                name: "Motor",
                table: "Vehiculos");

            migrationBuilder.DropColumn(
                name: "Pasajeros",
                table: "Vehiculos");

            migrationBuilder.DropColumn(
                name: "Slug",
                table: "Vehiculos");

            migrationBuilder.DropColumn(
                name: "Traccion",
                table: "Vehiculos");
        }
    }
}

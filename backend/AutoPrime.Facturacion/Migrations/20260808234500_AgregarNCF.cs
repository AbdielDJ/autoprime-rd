using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AutoPrime.Facturacion.Migrations
{
    /// <inheritdoc />
    public partial class AgregarNCF : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Ncf",
                table: "Facturas",
                type: "TEXT",
                maxLength: 20,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Ncf",
                table: "Facturas");
        }
    }
}

using AutoPrime.Facturacion.Data;
using Microsoft.EntityFrameworkCore;

namespace AutoPrime.Facturacion.Services
{
    public class FacturaService
    {
        private readonly AutoPrimeDbContext _context;
        private const decimal PORCENTAJE_ITBIS = 0.18m; // 18% ITBIS en RD

        public FacturaService(AutoPrimeDbContext context)
        {
            _context = context;
        }

        public async Task<string> GenerarNumeroFacturaAsync()
        {
            var cantidad = await _context.Facturas.CountAsync();
            var siguiente = cantidad + 1;
            return $"FACT-{siguiente:D4}"; // FACT-0001, FACT-0002...
        }

        // Determina el tipo de NCF según el documento del cliente:
        // RNC (empresa, 9 dígitos) => B01 Crédito Fiscal
        // Cédula (persona, 11 dígitos) => B02 Consumidor Final
        public async Task<string> GenerarNcfAsync(string cedulaORnc)
        {
            var soloDigitos = new string(cedulaORnc.Where(char.IsDigit).ToArray());
            var esRnc = soloDigitos.Length == 9;

            var tipo = esRnc ? "B01" : "B02";

            var cantidad = await _context.Facturas.CountAsync(f => f.Ncf != null && f.Ncf.StartsWith(tipo));
            var siguiente = cantidad + 1;
            return $"{tipo}{siguiente:D10}"; // B0100000001 o B0200000001
        }

        public (decimal itbis, decimal total) CalcularMontos(decimal subtotal, decimal descuento)
        {
            var baseImponible = subtotal - descuento;
            var itbis = Math.Round(baseImponible * PORCENTAJE_ITBIS, 2);
            var total = baseImponible + itbis;
            return (itbis, total);
        }
    }
}
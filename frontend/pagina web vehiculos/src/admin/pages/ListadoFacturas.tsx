import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api, type Factura } from "../services/api";

export default function ListadoFacturas() {
  const [facturas, setFacturas] = useState<Factura[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .getFacturas()
      .then(setFacturas)
      .catch(() => setError("No se pudieron cargar las facturas."))
      .finally(() => setCargando(false));
  }, []);

  const formatearMoneda = (valor: number) =>
    `RD$${valor.toLocaleString("es-DO", { maximumFractionDigits: 0 })}`;

  const formatearFecha = (fecha: string) =>
    new Date(fecha).toLocaleDateString("es-DO", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const estadoTexto = (estado: number) =>
    ["Pagada", "Pendiente", "Anulada"][estado] ?? "—";

  if (cargando) return <p>Cargando facturas...</p>;
  if (error) return <div className="admin-error">{error}</div>;

  return (
    <div className="admin-listado-facturas">
      <div className="admin-listado-header">
        <h1>Facturas</h1>
        <Link to="/admin/facturar" className="admin-btn-primario">
          + Nueva factura
        </Link>
      </div>

      <table className="admin-tabla">
        <thead>
          <tr>
            <th>Número</th>
            <th>NCF</th>
            <th>Fecha</th>
            <th>Cliente</th>
            <th>Vehículo</th>
            <th>Total</th>
            <th>Estado</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {facturas.length === 0 && (
            <tr>
              <td colSpan={7}>No hay facturas registradas todavía.</td>
            </tr>
          )}
          {facturas.map((f) => (
            <tr key={f.id}>
              <td>{f.numeroFactura}</td>
              <td>{f.ncf ?? "—"}</td>
              <td>{formatearFecha(f.fecha)}</td>
              <td>{f.cliente?.nombre}</td>
              <td>
                {f.vehiculo?.marca} {f.vehiculo?.modelo}
              </td>
              <td>{formatearMoneda(f.total)}</td>
              <td>
                <span className={`admin-badge admin-badge-${estadoTexto(f.estado).toLowerCase()}`}>
                  {estadoTexto(f.estado)}
                </span>
              </td>
              <td>
                <Link to={`/admin/facturas/${f.id}`}>Ver</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
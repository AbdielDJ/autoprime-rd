import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api, type Factura } from "../services/api";

export default function DetalleFactura() {
  const { id } = useParams();
  const [factura, setFactura] = useState<Factura | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    api
      .getFactura(Number(id))
      .then(setFactura)
      .catch(() => setError("No se pudo cargar la factura."));
  }, [id]);

  const formatearMoneda = (valor: number) =>
    `RD$${valor.toLocaleString("es-DO", { maximumFractionDigits: 0 })}`;

  const formatearFecha = (fecha: string) =>
    new Date(fecha).toLocaleDateString("es-DO", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  if (error) return <div className="admin-error">{error}</div>;
  if (!factura) return <p>Cargando factura...</p>;

  const estadoTexto = ["Pagada", "Pendiente", "Anulada"][factura.estado] ?? "—";

  return (
    <div className="admin-factura-detalle">
      <div className="admin-factura-header">
        <div>
          <h1>AutoPrime</h1>
          <p>República Dominicana</p>
        </div>
        <div className="admin-factura-numero">
          <p>{factura.numeroFactura}</p>
            {factura.ncf && <p className="admin-label">NCF: {factura.ncf}</p>}
          <p>{formatearFecha(factura.fecha)}</p>
          <span className={`admin-badge admin-badge-${estadoTexto.toLowerCase()}`}>
            {estadoTexto}
          </span>
        </div>
      </div>

      <div className="admin-factura-partes">
        <div>
          <p className="admin-label">Cliente</p>
          <p>{factura.cliente?.nombre}</p>
          <p>{factura.cliente?.cedulaORnc}</p>
          <p>{factura.cliente?.telefono}</p>
        </div>
        <div>
          <p className="admin-label">Vehículo</p>
          <p>
            {factura.vehiculo?.marca} {factura.vehiculo?.modelo} {factura.vehiculo?.anio}
          </p>
          <p>Código: {factura.vehiculo?.codigo}</p>
        </div>
      </div>

      <table className="admin-factura-tabla">
        <thead>
          <tr>
            <th>Descripción</th>
            <th>Monto</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              {factura.vehiculo?.marca} {factura.vehiculo?.modelo} {factura.vehiculo?.anio} —{" "}
              {factura.vehiculo?.codigo}
            </td>
            <td>{formatearMoneda(factura.subtotal)}</td>
          </tr>
        </tbody>
      </table>

      <div className="admin-factura-totales">
        <div>
          <span>Subtotal</span>
          <span>{formatearMoneda(factura.subtotal)}</span>
        </div>
        <div>
          <span>Descuento</span>
          <span>{formatearMoneda(factura.descuento)}</span>
        </div>
        <div>
          <span>ITBIS (18%)</span>
          <span>{formatearMoneda(factura.itbis)}</span>
        </div>
        <div className="admin-factura-total-final">
          <span>Total</span>
          <span>{formatearMoneda(factura.total)}</span>
        </div>
      </div>

      <div className="admin-factura-meta">
        <p>Vendedor: {factura.vendedor}</p>
        <p>Método de pago: {factura.metodoPago}</p>
        {factura.observaciones && <p>Observaciones: {factura.observaciones}</p>}
      </div>

      <div className="admin-factura-acciones">
        <button onClick={() => window.print()}>Imprimir</button>
        <Link to="/admin/facturas">Ver todas las facturas</Link>
      </div>
    </div>
  );
}
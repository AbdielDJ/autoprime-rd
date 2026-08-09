import { useEffect, useState } from "react";
import { api, type Cotizacion } from "../services/api";

const ESTADO_TEXTO = ["Nueva", "Contactada", "Cerrada"];

export default function Cotizaciones() {
  const [cotizaciones, setCotizaciones] = useState<Cotizacion[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  function cargar() {
    setCargando(true);
    api
      .getCotizaciones()
      .then(setCotizaciones)
      .catch(() => setError("No se pudieron cargar las cotizaciones."))
      .finally(() => setCargando(false));
  }

  useEffect(() => {
    cargar();
  }, []);

  async function handleCambiarEstado(id: number, nuevoEstado: number) {
    try {
      await api.actualizarEstadoCotizacion(id, nuevoEstado);
      setCotizaciones((prev) =>
        prev.map((c) => (c.id === id ? { ...c, estado: nuevoEstado } : c))
      );
    } catch {
      setError("No se pudo actualizar el estado.");
    }
  }

  async function handleEliminar(id: number) {
    if (!confirm("¿Eliminar esta solicitud?")) return;
    try {
      await api.eliminarCotizacion(id);
      setCotizaciones((prev) => prev.filter((c) => c.id !== id));
    } catch {
      setError("No se pudo eliminar la solicitud.");
    }
  }

  const formatearFecha = (fecha: string) =>
    new Date(fecha).toLocaleDateString("es-DO", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  if (cargando) return <p>Cargando cotizaciones...</p>;

  return (
    <div className="admin-cotizaciones">
      <div className="admin-listado-header">
        <h1>Cotizaciones y solicitudes</h1>
      </div>

      {error && <div className="admin-error">{error}</div>}

      <table className="admin-tabla">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Nombre</th>
            <th>Teléfono</th>
            <th>Vehículo de interés</th>
            <th>Mensaje</th>
            <th>Estado</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {cotizaciones.length === 0 && (
            <tr>
              <td colSpan={7}>No hay solicitudes registradas todavía.</td>
            </tr>
          )}
          {cotizaciones.map((c) => (
            <tr key={c.id}>
              <td>{formatearFecha(c.fecha)}</td>
              <td>
                {c.nombre}
                {c.correo && <div className="admin-label">{c.correo}</div>}
              </td>
              <td>{c.telefono}</td>
              <td>{c.vehiculoInteres ?? "—"}</td>
              <td>{c.mensaje ?? "—"}</td>
                <td>
                    <span className={`admin-badge admin-badge-${ESTADO_TEXTO[c.estado]?.toLowerCase()}`}>
                    {ESTADO_TEXTO[c.estado]}
                    </span>
                    <select
                    value={c.estado}
                    onChange={(e) => handleCambiarEstado(c.id, Number(e.target.value))}
                    style={{ marginLeft: "8px" }}
                    >
                    <option value={0}>Nueva</option>
                    <option value={1}>Contactada</option>
                    <option value={2}>Cerrada</option>
                    </select>
                </td>
              <td>
                <button onClick={() => handleEliminar(c.id)} className="admin-eliminar-btn">
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
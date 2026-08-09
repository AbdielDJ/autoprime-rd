import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { api, type Vehiculo } from "../services/api";

const ESTADO_TEXTO = ["Disponible", "Vendido", "Reservado"];

export default function ListadoVehiculos() {
  const location = useLocation();
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const creado = (location.state as { creado?: string })?.creado;
  const actualizado = (location.state as { actualizado?: string })?.actualizado;

  function cargar() {
    setCargando(true);
    api.getVehiculos().then(setVehiculos).finally(() => setCargando(false));
  }

  useEffect(() => {
    cargar();
  }, []);

  async function handleEliminar(id: number, codigo: string) {
    if (!confirm(`¿Eliminar el vehículo ${codigo}? Esta acción no se puede deshacer.`)) return;

    setError(null);
    try {
      await api.eliminarVehiculo(id);
      setVehiculos((prev) => prev.filter((v) => v.id !== id));
    } catch (err: any) {
      setError(err.message ?? "No se pudo eliminar el vehículo.");
    }
  }

  if (cargando) return <p>Cargando inventario...</p>;

  return (
    <div className="admin-listado-vehiculos">
      <div className="admin-listado-header">
        <h1>Inventario de vehículos</h1>
        <Link to="/admin/vehiculos/nuevo" className="admin-btn-primario">
          + Agregar vehículo
        </Link>
      </div>

      {creado && (
        <div className="admin-error" style={{ background: "#1d3c2c", color: "#5dcaa5", borderColor: "#2a5540" }}>
          Vehículo {creado} agregado correctamente.
        </div>
      )}
      {actualizado && (
        <div className="admin-error" style={{ background: "#1d3c2c", color: "#5dcaa5", borderColor: "#2a5540" }}>
          Vehículo {actualizado} actualizado correctamente.
        </div>
      )}
      {error && <div className="admin-error">{error}</div>}

      <table className="admin-tabla">
        <thead>
          <tr>
            <th>Código</th>
            <th>Vehículo</th>
            <th>Año</th>
            <th>Precio</th>
            <th>Estado</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {vehiculos.length === 0 && (
            <tr>
              <td colSpan={6}>No hay vehículos registrados todavía.</td>
            </tr>
          )}
          {vehiculos.map((v) => (
            <tr key={v.id}>
              <td>{v.codigo}</td>
              <td>{v.marca} {v.modelo}</td>
              <td>{v.anio}</td>
              <td>RD${v.precio.toLocaleString("es-DO")}</td>
              <td>
                <span className={`admin-badge admin-badge-${ESTADO_TEXTO[v.estado]?.toLowerCase()}`}>
                  {ESTADO_TEXTO[v.estado]}
                </span>
              </td>
              <td style={{ display: "flex", gap: "8px" }}>
                <Link to={`/admin/vehiculos/${v.id}/editar`}>Editar</Link>
                <button onClick={() => handleEliminar(v.id, v.codigo)} className="admin-eliminar-btn">
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
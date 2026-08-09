import { useEffect, useState } from "react";
import { api, type Cliente } from "../services/api";

export default function ListadoClientes() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState("");

  const [editando, setEditando] = useState<Cliente | null>(null);

  function cargar() {
    setCargando(true);
    api.getClientes().then(setClientes).finally(() => setCargando(false));
  }

  useEffect(() => {
    cargar();
  }, []);

  async function handleEliminar(id: number, nombre: string) {
    if (!confirm(`¿Eliminar al cliente ${nombre}?`)) return;
    setError(null);
    try {
      await api.eliminarCliente(id);
      setClientes((prev) => prev.filter((c) => c.id !== id));
    } catch (err: any) {
      setError(err.message ?? "No se pudo eliminar el cliente.");
    }
  }

  async function handleGuardarEdicion() {
    if (!editando) return;
    setError(null);
    try {
      await api.actualizarCliente(editando.id, editando);
      setClientes((prev) => prev.map((c) => (c.id === editando.id ? editando : c)));
      setEditando(null);
    } catch (err: any) {
      setError(err.message ?? "No se pudo actualizar el cliente.");
    }
  }

  const filtrados = clientes.filter((c) =>
    `${c.nombre} ${c.cedulaORnc}`.toLowerCase().includes(busqueda.toLowerCase())
  );

  if (cargando) return <p>Cargando clientes...</p>;

  return (
    <div className="admin-listado-clientes">
      <div className="admin-listado-header">
        <h1>Clientes</h1>
      </div>

      {error && <div className="admin-error">{error}</div>}

      <div className="admin-card" style={{ marginBottom: "1rem" }}>
        <label>Buscar</label>
        <input
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Nombre o cédula/RNC"
        />
      </div>

      {editando && (
        <div className="admin-card">
          <label>Editando: {editando.nombre}</label>
          <div className="admin-grid-2" style={{ marginTop: "8px" }}>
            <div>
              <label>Nombre</label>
              <input
                value={editando.nombre}
                onChange={(e) => setEditando({ ...editando, nombre: e.target.value })}
              />
            </div>
            <div>
              <label>Cédula/RNC</label>
              <input
                value={editando.cedulaORnc}
                onChange={(e) => setEditando({ ...editando, cedulaORnc: e.target.value })}
              />
            </div>
            <div>
              <label>Teléfono</label>
              <input
                value={editando.telefono ?? ""}
                onChange={(e) => setEditando({ ...editando, telefono: e.target.value })}
              />
            </div>
            <div>
              <label>Correo</label>
              <input
                value={editando.correo ?? ""}
                onChange={(e) => setEditando({ ...editando, correo: e.target.value })}
              />
            </div>
            <div>
              <label>Dirección</label>
              <input
                value={editando.direccion ?? ""}
                onChange={(e) => setEditando({ ...editando, direccion: e.target.value })}
              />
            </div>
          </div>
          <div style={{ marginTop: "10px", display: "flex", gap: "8px" }}>
            <button type="button" onClick={handleGuardarEdicion} className="admin-btn-primario">
              Guardar cambios
            </button>
            <button type="button" onClick={() => setEditando(null)}>
              Cancelar
            </button>
          </div>
        </div>
      )}

      <table className="admin-tabla">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Cédula/RNC</th>
            <th>Teléfono</th>
            <th>Correo</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {filtrados.length === 0 && (
            <tr>
              <td colSpan={5}>No hay clientes registrados todavía.</td>
            </tr>
          )}
          {filtrados.map((c) => (
            <tr key={c.id}>
              <td>{c.nombre}</td>
              <td>{c.cedulaORnc}</td>
              <td>{c.telefono ?? "—"}</td>
              <td>{c.correo ?? "—"}</td>
              <td style={{ display: "flex", gap: "8px" }}>
                <button type="button" onClick={() => setEditando(c)}>
                  Editar
                </button>
                <button
                  type="button"
                  onClick={() => handleEliminar(c.id, c.nombre)}
                  className="admin-eliminar-btn"
                >
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
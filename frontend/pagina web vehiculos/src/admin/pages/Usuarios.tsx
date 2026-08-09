import { useEffect, useState } from "react";
import { api, type UsuarioListado } from "../services/api";

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState<UsuarioListado[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [mostrarNuevo, setMostrarNuevo] = useState(false);
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [nombre, setNombre] = useState("");
  const [password, setPassword] = useState("");
  const [rol, setRol] = useState("1");

  function cargar() {
    setCargando(true);
    api.getUsuarios().then(setUsuarios).finally(() => setCargando(false));
  }

  useEffect(() => {
    cargar();
  }, []);

  async function handleCrear() {
    setError(null);
    try {
      await api.crearUsuario({ nombreUsuario, nombre, password, rol: Number(rol) });
      setNombreUsuario("");
      setNombre("");
      setPassword("");
      setRol("1");
      setMostrarNuevo(false);
      cargar();
    } catch (err: any) {
      setError(err.message);
    }
  }

  async function handleToggleActivo(u: UsuarioListado) {
    setError(null);
    try {
      await api.actualizarUsuario(u.id, {
        nombre: u.nombre,
        rol: u.rol === "Administrador" ? 0 : 1,
        activo: !u.activo,
      });
      cargar();
    } catch (err: any) {
      setError(err.message);
    }
  }

  async function handleEliminar(id: number, nombreUsuario: string) {
    if (!confirm(`¿Eliminar al usuario ${nombreUsuario}?`)) return;
    setError(null);
    try {
      await api.eliminarUsuario(id);
      cargar();
    } catch (err: any) {
      setError(err.message);
    }
  }

  if (cargando) return <p>Cargando usuarios...</p>;

  return (
    <div className="admin-usuarios">
      <div className="admin-listado-header">
        <h1>Usuarios del sistema</h1>
        <button className="admin-btn-primario" onClick={() => setMostrarNuevo(!mostrarNuevo)}>
          {mostrarNuevo ? "Cancelar" : "+ Nuevo usuario"}
        </button>
      </div>

      {error && <div className="admin-error">{error}</div>}

      {mostrarNuevo && (
        <div className="admin-card admin-grid-2">
          <div>
            <label>Nombre de usuario</label>
            <input value={nombreUsuario} onChange={(e) => setNombreUsuario(e.target.value)} />
          </div>
          <div>
            <label>Nombre completo</label>
            <input value={nombre} onChange={(e) => setNombre(e.target.value)} />
          </div>
          <div>
            <label>Contraseña</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <div>
            <label>Rol</label>
            <select value={rol} onChange={(e) => setRol(e.target.value)}>
              <option value="1">Cajero</option>
              <option value="0">Administrador</option>
            </select>
          </div>
          <div style={{ gridColumn: "span 2" }}>
            <button type="button" onClick={handleCrear} className="admin-btn-primario">
              Guardar usuario
            </button>
          </div>
        </div>
      )}

      <table className="admin-tabla">
        <thead>
          <tr>
            <th>Usuario</th>
            <th>Nombre</th>
            <th>Rol</th>
            <th>Estado</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((u) => (
            <tr key={u.id}>
              <td>{u.nombreUsuario}</td>
              <td>{u.nombre}</td>
              <td>{u.rol}</td>
              <td>
                <span className={`admin-badge admin-badge-${u.activo ? "pagada" : "anulada"}`}>
                  {u.activo ? "Activo" : "Inactivo"}
                </span>
              </td>
              <td style={{ display: "flex", gap: "8px" }}>
                <button type="button" onClick={() => handleToggleActivo(u)}>
                  {u.activo ? "Desactivar" : "Activar"}
                </button>
                <button
                  type="button"
                  onClick={() => handleEliminar(u.id, u.nombreUsuario)}
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
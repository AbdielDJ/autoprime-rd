import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ICONOS: Record<string, string> = {
  inicio: "⌂",
  facturar: "＋",
  facturas: "▤",
  clientes: "◑",
  vehiculos: "⛯",
  cotizaciones: "✉",
  usuarios: "◈",
};

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, usuario } = useAuth();

  const esAdmin = usuario?.rol === "Administrador";

  const esActivo = (ruta: string) =>
    location.pathname === ruta ? "admin-nav-activo" : "";

  function handleLogout() {
    logout();
    navigate("/admin/login");
  }

  const iniciales = usuario?.nombre
    ?.split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-logo">
          <span className="admin-logo-badge">AP</span>
          <div>
            <p>AutoPrime</p>
            <p className="admin-label">Panel administrativo</p>
          </div>
        </div>

        <nav>
          {esAdmin && (
            <Link to="/admin" className={esActivo("/admin")}>
              <span className="admin-nav-icono">{ICONOS.inicio}</span> Inicio
            </Link>
          )}
          <Link to="/admin/facturar" className={esActivo("/admin/facturar")}>
            <span className="admin-nav-icono">{ICONOS.facturar}</span> Nueva factura
          </Link>
          <Link to="/admin/facturas" className={esActivo("/admin/facturas")}>
            <span className="admin-nav-icono">{ICONOS.facturas}</span> Facturas
          </Link>
          <Link to="/admin/clientes" className={esActivo("/admin/clientes")}>
            <span className="admin-nav-icono">{ICONOS.clientes}</span> Clientes
          </Link>
          {esAdmin && (
            <>
              <Link to="/admin/vehiculos" className={esActivo("/admin/vehiculos")}>
                <span className="admin-nav-icono">{ICONOS.vehiculos}</span> Vehículos
              </Link>
              <Link to="/admin/cotizaciones" className={esActivo("/admin/cotizaciones")}>
                <span className="admin-nav-icono">{ICONOS.cotizaciones}</span> Cotizaciones
              </Link>
              <Link to="/admin/usuarios" className={esActivo("/admin/usuarios")}>
                <span className="admin-nav-icono">{ICONOS.usuarios}</span> Usuarios
              </Link>
            </>
          )}
          <div className="admin-nav-separador" />
          <Link to="/">← Volver al sitio</Link>
        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-avatar">{iniciales}</div>
          <div className="admin-sidebar-footer-info">
            <p>{usuario?.nombre}</p>
            <p className="admin-label">{usuario?.rol}</p>
          </div>
          <button onClick={handleLogout} className="admin-logout-icono" title="Cerrar sesión">
            ⏻
          </button>
        </div>
      </aside>
      <main className="admin-contenido">
        <Outlet />
      </main>
    </div>
  );
}
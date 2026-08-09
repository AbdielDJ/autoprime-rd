import { useState, type FormEvent } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [nombreUsuario, setNombreUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [cargando, setCargando] = useState(false);

  const destino = (location.state as { from?: string })?.from ?? "/admin";

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setCargando(true);
    setError(false);

    const ok = await login(nombreUsuario, password);

    setCargando(false);

    if (ok) {
      navigate(destino, { replace: true });
    } else {
      setError(true);
    }
  }

  return (
    <div className="admin-login-pantalla">
      <form className="admin-login-card" onSubmit={handleSubmit}>
        <div className="admin-login-icono">🔒</div>
        <h1>Acceso administrativo</h1>
        <p className="admin-label">AutoPrime — Panel de facturación</p>

        {error && (
          <div className="admin-error">Usuario o contraseña incorrectos.</div>
        )}

        <label>Usuario</label>
        <input
          value={nombreUsuario}
          onChange={(e) => setNombreUsuario(e.target.value)}
          autoFocus
        />

        <label>Contraseña</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit" className="admin-btn-primario" disabled={cargando}>
          {cargando ? "Ingresando..." : "Ingresar"}
        </button>
      </form>
    </div>
  );
}
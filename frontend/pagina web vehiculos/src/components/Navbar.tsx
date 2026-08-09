import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();
  const inicio = location.pathname === "/";
  const [abierto, setAbierto] = useState(false);

  const href = (ancla: string) => (inicio ? ancla : `/${ancla}`);

  return (
    <header className="navbar">
      <Link className="brand" to="/" aria-label="AutoPrime RD - Inicio">
        <span className="brandMark">AP</span>
        <span><strong>AutoPrime</strong><small>República Dominicana</small></span>
      </Link>

      <button className="menuToggle" onClick={() => setAbierto(!abierto)} aria-label="Abrir menú">
        {abierto ? "✕" : "☰"}
      </button>

      <nav className={abierto ? "open" : ""} onClick={() => setAbierto(false)}>
        <Link to="/">Inicio</Link>
        <a href={href("#vehiculos")}>Inventario</a>
        <a href={href("#servicios")}>Servicios</a>
        <a href={href("#financiamiento")}>Financiamiento</a>
        <a href={href("#contacto")}>Contacto</a>
        <a className="navCta" href="https://wa.me/18090000000" target="_blank" rel="noreferrer">WhatsApp</a>
      </nav>
    </header>
  );
}
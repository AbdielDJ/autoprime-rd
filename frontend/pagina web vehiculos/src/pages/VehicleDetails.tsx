import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import VehicleCard from "../components/VehicleCard";
import { getVehiculoPorSlug, getVehiculos, crearCotizacion } from "../services/api";
import { formatearPrecio } from "../data/vehicles";
import type { Vehiculo } from "../types/vehicle";

export default function VehicleDetails() {
  const { slug } = useParams();
  const [vehiculo, setVehiculo] = useState<Vehiculo | null>(null);
  const [todos, setTodos] = useState<Vehiculo[]>([]);
  const [imagenActiva, setImagenActiva] = useState(0);
  const [enviado, setEnviado] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [errorEnvio, setErrorEnvio] = useState<string | null>(null);
  const [cargando, setCargando] = useState(true);

  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [correo, setCorreo] = useState("");
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    if (!slug) return;
    setCargando(true);
    setImagenActiva(0);
    Promise.all([getVehiculoPorSlug(slug), getVehiculos()])
      .then(([actual, lista]) => {
        setVehiculo(actual);
        setTodos(lista);
      })
      .finally(() => setCargando(false));
  }, [slug]);

  const similares = useMemo(
    () => todos.filter((item) => item.id !== vehiculo?.id && (item.marca === vehiculo?.marca || Math.abs(item.precio - (vehiculo?.precio ?? 0)) < 500000)).slice(0, 3),
    [todos, vehiculo]
  );

  if (cargando) {
    return <main className="page"><Navbar /><section className="notFound"><h1>Cargando...</h1></section></main>;
  }

  if (!vehiculo) {
    return (
      <main className="page">
        <Navbar />
        <section className="notFound">
          <span className="badge">404</span>
          <h1>Vehículo no encontrado</h1>
          <p>La unidad que buscas no está disponible o cambió de dirección.</p>
          <Link className="detailButton inlineButton" to="/">Volver al inventario</Link>
        </section>
      </main>
    );
  }

  const codigo = vehiculo.codigo;
  const mensajeWhatsapp = encodeURIComponent(`Hola, me interesa el ${vehiculo.marca} ${vehiculo.modelo} ${vehiculo.anio}, código ${codigo}, publicado en ${formatearPrecio(vehiculo.precio)}.`);

  async function handleEnviarCotizacion(event: React.FormEvent) {
    event.preventDefault();
    if (!vehiculo) return;

    setEnviando(true);
    setErrorEnvio(null);

    try {
      await crearCotizacion({
        nombre,
        telefono,
        correo: correo || undefined,
        vehiculoInteres: `${vehiculo.marca} ${vehiculo.modelo} ${vehiculo.anio}`,
        vehiculoId: vehiculo.id,
        mensaje: mensaje || undefined,
      });
      setEnviado(true);
      setNombre("");
      setTelefono("");
      setCorreo("");
      setMensaje("");
    } catch {
      setErrorEnvio("No se pudo enviar la solicitud. Intenta de nuevo.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <main className="page">
      <Navbar />
      <section className="detailsPage sectionShell">
        <div className="breadcrumb"><Link to="/">Inicio</Link><span>›</span><Link to="/#vehiculos">Inventario</Link><span>›</span><strong>{vehiculo.marca} {vehiculo.modelo}</strong></div>

        <div className="detailsLayout">
          <div className="gallery">
            <div className="mainImageWrap"><img className="mainImage" src={vehiculo.imagenes[imagenActiva]} alt={`${vehiculo.marca} ${vehiculo.modelo}`} /><span className="photoCounter">{imagenActiva + 1} / {vehiculo.imagenes.length}</span></div>
            <div className="thumbnails">{vehiculo.imagenes.map((imagen, index) => <button className={index === imagenActiva ? "active" : ""} key={imagen} onClick={() => setImagenActiva(index)}><img src={imagen} alt={`Vista ${index + 1}`} /></button>)}</div>
          </div>

          <aside className="summaryCard">
            <div className="summaryTop"><span className="status">{["Disponible", "Vendido", "Reservado"][vehiculo.estado] ?? "Disponible"}</span><span className="vehicleCode detailCode">{codigo}</span></div>
            <p className="eyebrow">{vehiculo.marca}</p>
            <h1>{vehiculo.modelo}</h1>
            <p className="detailYear">{vehiculo.anio} · {vehiculo.transmision} · {vehiculo.combustible}</p>
            <strong className="detailPrice">{formatearPrecio(vehiculo.precio)}</strong>
            <div className="quickSpecs"><span><b>{vehiculo.kilometraje.toLocaleString("es-DO")}</b> km</span><span><b>{vehiculo.motor}</b> motor</span><span><b>{vehiculo.traccion}</b> tracción</span></div>
            <p>{vehiculo.descripcion}</p>
            <a className="whatsappButton" href={`https://wa.me/18090000000?text=${mensajeWhatsapp}`} target="_blank" rel="noreferrer">Consultar por WhatsApp</a>
            <a className="secondaryAction" href="#cotizacion">Solicitar cotización</a>
            <p className="secureNote">✓ Atención personalizada · ✓ Información transparente</p>
          </aside>
        </div>

        <section className="specSection"><div className="sectionHeading left"><span className="eyebrow">FICHA TÉCNICA</span><h2>Detalles del vehículo</h2></div><div className="specGrid">
          <article><span>Año</span><strong>{vehiculo.anio}</strong></article><article><span>Kilometraje</span><strong>{vehiculo.kilometraje.toLocaleString("es-DO")} km</strong></article><article><span>Transmisión</span><strong>{vehiculo.transmision}</strong></article><article><span>Combustible</span><strong>{vehiculo.combustible}</strong></article><article><span>Motor</span><strong>{vehiculo.motor}</strong></article><article><span>Tracción</span><strong>{vehiculo.traccion}</strong></article><article><span>Color exterior</span><strong>{vehiculo.colorExterior}</strong></article><article><span>Color interior</span><strong>{vehiculo.colorInterior}</strong></article><article><span>Pasajeros</span><strong>{vehiculo.pasajeros}</strong></article>
        </div></section>

        <section className="featuresSection"><div className="sectionHeading left"><span className="eyebrow">EQUIPAMIENTO</span><h2>Comodidad, tecnología y seguridad</h2></div><div className="featuresGrid">{vehiculo.caracteristicas.map((item) => <div key={item}><span>✓</span>{item}</div>)}</div></section>

        <section id="cotizacion" className="quoteSection">
          <div><span className="badge">Respuesta rápida</span><h2>Solicita una cotización personalizada.</h2><p>Completa tus datos y un asesor te contactará con disponibilidad, inicial y opciones de financiamiento.</p><ul><li>Sin compromiso</li><li>Atención personalizada</li><li>Respuesta en horario laboral</li></ul></div>
          <form onSubmit={handleEnviarCotizacion}>
            <input type="text" placeholder="Nombre completo" required value={nombre} onChange={(e) => setNombre(e.target.value)} />
            <input type="tel" placeholder="Teléfono" required value={telefono} onChange={(e) => setTelefono(e.target.value)} />
            <input type="email" placeholder="Correo electrónico" value={correo} onChange={(e) => setCorreo(e.target.value)} />
            <input type="text" value={`${vehiculo.marca} ${vehiculo.modelo} ${vehiculo.anio}`} readOnly />
            <textarea rows={3} placeholder="Indica tu inicial o consulta" value={mensaje} onChange={(e) => setMensaje(e.target.value)} />
            <button type="submit" disabled={enviando}>{enviando ? "Enviando..." : "Enviar solicitud"}</button>
            {enviado && <p className="successMessage">Solicitud registrada correctamente.</p>}
            {errorEnvio && <p className="successMessage">{errorEnvio}</p>}
          </form>
        </section>

        <section className="similarSection"><div className="sectionHeading left"><span className="eyebrow">OTRAS OPCIONES</span><h2>También podrían interesarte</h2></div><div className="vehicleGrid">{(similares.length ? similares : todos.filter(v => v.id !== vehiculo.id).slice(0,3)).map((item) => <VehicleCard key={item.id} vehiculo={item} />)}</div></section>
      </section>
      <footer className="miniFooter">© {new Date().getFullYear()} AutoPrime RD · Atención profesional en República Dominicana</footer>
      <a className="floatingWhatsapp" href={`https://wa.me/18090000000?text=${mensajeWhatsapp}`} target="_blank" rel="noreferrer">WA</a>
    </main>
  );
}
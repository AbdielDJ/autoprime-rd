import { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import VehicleCard from "../components/VehicleCard";
import { getVehiculos, crearCotizacion } from "../services/api";
import type { Vehiculo } from "../types/vehicle";

export default function Home() {
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState<string | null>(null);

  const [busqueda, setBusqueda] = useState("");
  const [marca, setMarca] = useState("Todas");
  const [precioMax, setPrecioMax] = useState("Todos");
  const [orden, setOrden] = useState("destacados");

  const [nombreContacto, setNombreContacto] = useState("");
  const [telefonoContacto, setTelefonoContacto] = useState("");
  const [correoContacto, setCorreoContacto] = useState("");
  const [vehiculoInteres, setVehiculoInteres] = useState("");
  const [mensajeContacto, setMensajeContacto] = useState("");
  const [enviandoContacto, setEnviandoContacto] = useState(false);
  const [mensajeEnviado, setMensajeEnviado] = useState(false);
  const [errorContacto, setErrorContacto] = useState<string | null>(null);

  useEffect(() => {
    getVehiculos()
      .then((data) => setVehiculos(data.filter((v) => v.estado === 0)))
      .catch(() => setErrorCarga("No se pudo cargar el inventario. Intenta de nuevo más tarde."))
      .finally(() => setCargando(false));
  }, []);

  const marcas = ["Todas", ...Array.from(new Set(vehiculos.map((v) => v.marca)))];

  const filtrados = useMemo(() => {
    let lista = vehiculos.filter((v) => {
      const texto = `${v.marca} ${v.modelo} ${v.anio} ${v.combustible}`.toLowerCase();
      const coincideTexto = texto.includes(busqueda.toLowerCase());
      const coincideMarca = marca === "Todas" || v.marca === marca;
      const coincidePrecio = precioMax === "Todos" || v.precio <= Number(precioMax);
      return coincideTexto && coincideMarca && coincidePrecio;
    });

    if (orden === "precio-asc") lista = [...lista].sort((a, b) => a.precio - b.precio);
    if (orden === "precio-desc") lista = [...lista].sort((a, b) => b.precio - a.precio);
    if (orden === "anio") lista = [...lista].sort((a, b) => b.anio - a.anio);
    return lista;
  }, [vehiculos, busqueda, marca, precioMax, orden]);

  async function handleEnviarContacto(event: React.FormEvent) {
    event.preventDefault();
    setEnviandoContacto(true);
    setErrorContacto(null);

    try {
      await crearCotizacion({
        nombre: nombreContacto,
        telefono: telefonoContacto,
        correo: correoContacto || undefined,
        vehiculoInteres: vehiculoInteres || undefined,
        mensaje: mensajeContacto || undefined,
      });
      setMensajeEnviado(true);
      setNombreContacto("");
      setTelefonoContacto("");
      setCorreoContacto("");
      setVehiculoInteres("");
      setMensajeContacto("");
    } catch {
      setErrorContacto("No se pudo enviar la solicitud. Intenta de nuevo.");
    } finally {
      setEnviandoContacto(false);
    }
  }

  return (
    <main className="page">
      <Navbar />

      <section id="inicio" className="hero">
        <div className="heroOverlay" />
        <div className="heroText">
          <span className="badge">Movilidad premium, atención humana</span>
          <h1>Tu próximo vehículo empieza con una decisión segura.</h1>
          <p>Vehículos seleccionados, financiamiento flexible y acompañamiento completo para que compres con confianza en República Dominicana.</p>
          <div className="heroButtons">
            <a href="#vehiculos" className="btn primary">Explorar inventario</a>
            <a href="#contacto" className="btn secondary">Hablar con un asesor</a>
          </div>
          <div className="trustRow">
            <span>✓ Unidades verificadas</span><span>✓ Trámites asistidos</span><span>✓ Respuesta rápida</span>
          </div>
        </div>

        <div className="heroCard">
          <p className="eyebrow">FINANCIAMIENTO</p>
          <h3>Compra con una cuota que se adapte a ti.</h3>
          <p>Simula tu inicial, plazo y cuota mensual antes de solicitar evaluación.</p>
          <a href="#financiamiento">Calcular mi cuota <span>→</span></a>
        </div>
      </section>

      <section className="statsBar">
        <article><strong>{vehiculos.length}+</strong><span>Vehículos disponibles</span></article>
        <article><strong>24h</strong><span>Tiempo promedio de respuesta</span></article>
        <article><strong>100%</strong><span>Atención personalizada</span></article>
        <article><strong>RD</strong><span>Servicio local y confiable</span></article>
      </section>

      <section id="servicios" className="services sectionShell">
        <div className="sectionHeading">
          <span className="eyebrow">SOLUCIONES INTEGRALES</span>
          <h2>Más que vender vehículos, facilitamos todo el proceso.</h2>
          <p>Desde la búsqueda inicial hasta la entrega, te acompañamos con información clara y gestión organizada.</p>
        </div>
        <div className="serviceGrid">
          <article><span className="serviceIcon">01</span><h3>Venta de vehículos</h3><p>Inventario actualizado con ficha técnica, precio, fotografías y condiciones transparentes.</p></article>
          <article><span className="serviceIcon">02</span><h3>Financiamiento</h3><p>Simulación de cuotas y orientación para elegir una opción acorde con tu presupuesto.</p></article>
          <article><span className="serviceIcon">03</span><h3>Gestión documental</h3><p>Apoyo en contratos, traspaso, seguro y documentos necesarios para completar la compra.</p></article>
          <article><span className="serviceIcon">04</span><h3>Recibimos tu vehículo</h3><p>Evaluamos tu unidad actual como parte del pago para facilitar la renovación.</p></article>
        </div>
      </section>

      <section id="vehiculos" className="vehicles sectionShell">
        <div className="sectionHeading rowHeading">
          <div><span className="eyebrow">INVENTARIO ACTUAL</span><h2>Encuentra el modelo que encaja contigo.</h2></div>
          <p>{filtrados.length} resultado{filtrados.length === 1 ? "" : "s"}</p>
        </div>

        <div className="filterPanel">
          <label><span>Buscar</span><input value={busqueda} onChange={(e) => setBusqueda(e.target.value)} placeholder="Marca, modelo, año..." /></label>
          <label><span>Marca</span><select value={marca} onChange={(e) => setMarca(e.target.value)}>{marcas.map((item) => <option key={item}>{item}</option>)}</select></label>
          <label><span>Precio máximo</span><select value={precioMax} onChange={(e) => setPrecioMax(e.target.value)}><option value="Todos">Todos</option><option value="1000000">Hasta RD$ 1,000,000</option><option value="1500000">Hasta RD$ 1,500,000</option><option value="2000000">Hasta RD$ 2,000,000</option><option value="4000000">Hasta RD$ 4,000,000</option></select></label>
          <label><span>Ordenar</span><select value={orden} onChange={(e) => setOrden(e.target.value)}><option value="destacados">Destacados</option><option value="precio-asc">Menor precio</option><option value="precio-desc">Mayor precio</option><option value="anio">Más recientes</option></select></label>
        </div>

        {cargando ? (
          <p>Cargando inventario...</p>
        ) : errorCarga ? (
          <p className="successMessage">{errorCarga}</p>
        ) : filtrados.length > 0 ? (
          <div className="vehicleGrid">{filtrados.map((vehiculo) => <VehicleCard key={vehiculo.id} vehiculo={vehiculo} />)}</div>
        ) : (
          <div className="emptyState"><h3>No encontramos vehículos con esos filtros.</h3><button onClick={() => {setBusqueda(""); setMarca("Todas"); setPrecioMax("Todos");}}>Limpiar filtros</button></div>
        )}
      </section>

      <FinanceCalculator />

      <section className="whyUs sectionShell">
        <div className="whyContent">
          <span className="eyebrow">POR QUÉ AUTOPRIME</span>
          <h2>Una experiencia de compra seria, moderna y sin complicaciones.</h2>
          <div className="benefitList">
            <div><strong>01</strong><p><b>Información transparente</b><br/>Datos técnicos, precio y condiciones visibles desde el inicio.</p></div>
            <div><strong>02</strong><p><b>Acompañamiento real</b><br/>Un asesor te guía desde la cotización hasta la entrega.</p></div>
            <div><strong>03</strong><p><b>Proceso organizado</b><br/>Seguimiento de financiamiento, documentos y reserva.</p></div>
          </div>
        </div>
        <div className="whyImage"><div className="experienceBadge"><strong>+10</strong><span>modelos disponibles</span></div></div>
      </section>

      <section id="contacto" className="contact sectionShell">
        <div className="contactInfo">
          <span className="eyebrow">CONTACTO</span>
          <h2>Cuéntanos qué vehículo buscas.</h2>
          <p>Déjanos tus datos. Un asesor te contactará para orientarte sobre disponibilidad, inicial y financiamiento.</p>
          <div className="contactDetails"><span>☎ (809) 000-0000</span><span>✉ ventas@autoprime.do</span><span>⌖ República Dominicana</span></div>
        </div>
        <form onSubmit={handleEnviarContacto}>
          <div className="formRow">
            <input type="text" placeholder="Nombre completo" required value={nombreContacto} onChange={(e) => setNombreContacto(e.target.value)} />
            <input type="tel" placeholder="Teléfono" required value={telefonoContacto} onChange={(e) => setTelefonoContacto(e.target.value)} />
          </div>
          <input type="email" placeholder="Correo electrónico" value={correoContacto} onChange={(e) => setCorreoContacto(e.target.value)} />
          <input type="text" placeholder="Vehículo de interés" value={vehiculoInteres} onChange={(e) => setVehiculoInteres(e.target.value)} />
          <textarea placeholder="Mensaje o presupuesto aproximado" rows={4} value={mensajeContacto} onChange={(e) => setMensajeContacto(e.target.value)} />
          <button type="submit" disabled={enviandoContacto}>{enviandoContacto ? "Enviando..." : "Enviar solicitud"}</button>
          {mensajeEnviado && <p className="successMessage">Solicitud registrada. Te contactaremos próximamente.</p>}
          {errorContacto && <p className="successMessage">{errorContacto}</p>}
        </form>
      </section>

      <footer className="footer">
        <div><LinkBrand /><p>Vehículos seleccionados y atención profesional en República Dominicana.</p></div>
        <div><h4>Navegación</h4><a href="#vehiculos">Inventario</a><a href="#servicios">Servicios</a><a href="#financiamiento">Financiamiento</a></div>
        <div><h4>Contacto</h4><span>(809) 000-0000</span><span>ventas@autoprime.do</span><span>Lun–Sáb: 8:00 a.m.–6:00 p.m.</span></div>
        <div className="footerBottom">© {new Date().getFullYear()} AutoPrime RD. Todos los derechos reservados.</div>
      </footer>
      <a className="floatingWhatsapp" href="https://wa.me/18090000000" target="_blank" rel="noreferrer" aria-label="WhatsApp">WA</a>
    </main>
  );
}

function LinkBrand() {
  return <div className="footerBrand"><span className="brandMark">AP</span><strong>AutoPrime RD</strong></div>;
}

function FinanceCalculator() {
  const [precio, setPrecio] = useState(1500000);
  const [inicial, setInicial] = useState(300000);
  const [meses, setMeses] = useState(60);
  const tasaAnual = 16;
  const financiado = Math.max(precio - inicial, 0);
  const tasaMensual = tasaAnual / 100 / 12;
  const cuota = financiado > 0 ? (financiado * tasaMensual * Math.pow(1 + tasaMensual, meses)) / (Math.pow(1 + tasaMensual, meses) - 1) : 0;
  const moneda = (n: number) => new Intl.NumberFormat("es-DO", {style: "currency", currency: "DOP", maximumFractionDigits: 0}).format(n);

  return (
    <section id="financiamiento" className="finance sectionShell">
      <div className="sectionHeading"><span className="eyebrow">SIMULADOR DE FINANCIAMIENTO</span><h2>Estima tu cuota mensual.</h2><p>Una referencia rápida para ayudarte a planificar tu compra.</p></div>
      <div className="financeGrid">
        <div className="calculatorPanel">
          <label><span>Precio del vehículo</span><input type="number" value={precio} onChange={(e) => setPrecio(Number(e.target.value))} /></label>
          <label><span>Inicial</span><input type="number" value={inicial} onChange={(e) => setInicial(Number(e.target.value))} /></label>
          <label><span>Plazo</span><select value={meses} onChange={(e) => setMeses(Number(e.target.value))}><option value={24}>24 meses</option><option value={36}>36 meses</option><option value={48}>48 meses</option><option value={60}>60 meses</option><option value={72}>72 meses</option></select></label>
        </div>
        <div className="financeResult"><span>Cuota mensual estimada</span><strong>{moneda(cuota)}</strong><p>Monto a financiar: {moneda(financiado)}</p><p>Tasa referencial: {tasaAnual}% anual</p><a href="#contacto">Solicitar evaluación</a><small>*Cálculo orientativo. Sujeto a evaluación y condiciones de la entidad financiera.</small></div>
      </div>
    </section>
  );
}
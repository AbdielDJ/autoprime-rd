import { useEffect, useState, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../services/api";

function generarSlug(marca: string, modelo: string, anio: string) {
  const base = `${marca}-${modelo}-${anio}`;
  return base
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function NuevoVehiculo() {
  const navigate = useNavigate();
  const { id } = useParams();
  const esEdicion = Boolean(id);

  const [codigo, setCodigo] = useState("");
  const [marca, setMarca] = useState("");
  const [modelo, setModelo] = useState("");
  const [anio, setAnio] = useState("");
  const [precio, setPrecio] = useState("");
  const [kilometraje, setKilometraje] = useState("");
  const [transmision, setTransmision] = useState("Automática");
  const [combustible, setCombustible] = useState("Gasolina");
  const [motor, setMotor] = useState("");
  const [traccion, setTraccion] = useState("Delantera");
  const [colorExterior, setColorExterior] = useState("");
  const [colorInterior, setColorInterior] = useState("");
  const [pasajeros, setPasajeros] = useState("5");
  const [descripcion, setDescripcion] = useState("");
  const [estado, setEstado] = useState("0");
  const [imagenesTexto, setImagenesTexto] = useState("");
  const [caracteristicasTexto, setCaracteristicasTexto] = useState("");

  const [cargandoDatos, setCargandoDatos] = useState(esEdicion);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const slugPreview = generarSlug(marca, modelo, anio);

  useEffect(() => {
    if (!id) return;
    api.getVehiculo(Number(id)).then((v) => {
      setCodigo(v.codigo);
      setMarca(v.marca);
      setModelo(v.modelo);
      setAnio(String(v.anio));
      setPrecio(String(v.precio));
      setKilometraje(String(v.kilometraje));
      setTransmision(v.transmision ?? "Automática");
      setCombustible(v.combustible ?? "Gasolina");
      setMotor(v.motor ?? "");
      setTraccion(v.traccion ?? "Delantera");
      setColorExterior(v.colorExterior ?? "");
      setColorInterior(v.colorInterior ?? "");
      setPasajeros(String(v.pasajeros));
      setDescripcion(v.descripcion ?? "");
      setEstado(String(v.estado));
      setImagenesTexto((v.imagenes ?? []).join("\n"));
      setCaracteristicasTexto((v.caracteristicas ?? []).join("\n"));
      setCargandoDatos(false);
    });
  }, [id]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!codigo || !marca || !modelo || !anio || !precio) {
      setError("Completa al menos código, marca, modelo, año y precio.");
      return;
    }

    setCargando(true);
    try {
      const datos = {
        codigo,
        slug: slugPreview,
        marca,
        modelo,
        anio: Number(anio),
        kilometraje: Number(kilometraje) || 0,
        transmision,
        combustible,
        motor,
        traccion,
        colorExterior,
        colorInterior,
        pasajeros: Number(pasajeros) || 5,
        descripcion,
        precio: Number(precio),
        estado: Number(estado),
        imagenes: imagenesTexto.split("\n").map((l) => l.trim()).filter(Boolean),
        caracteristicas: caracteristicasTexto.split("\n").map((l) => l.trim()).filter(Boolean),
      };

      if (esEdicion) {
        await api.actualizarVehiculo(Number(id), { ...datos, id: Number(id) });
        navigate("/admin/vehiculos", { state: { actualizado: codigo } });
      } else {
        const nuevo = await api.crearVehiculo(datos);
        navigate("/admin/vehiculos", { state: { creado: nuevo.codigo } });
      }
    } catch (err: any) {
      setError(err.message ?? "No se pudo guardar el vehículo. Verifica que el código no esté repetido.");
    } finally {
      setCargando(false);
    }
  }

  if (cargandoDatos) return <p>Cargando vehículo...</p>;

  return (
    <div className="admin-factura-form">
      <h1>{esEdicion ? "Editar vehículo" : "Agregar vehículo"}</h1>

      {error && <div className="admin-error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <section className="admin-card admin-grid-2">
          <div>
            <label>Código *</label>
            <input value={codigo} onChange={(e) => setCodigo(e.target.value)} placeholder="AP-0011" />
          </div>
          <div>
            <label>Slug (autogenerado)</label>
            <input value={slugPreview} readOnly />
          </div>
          <div>
            <label>Marca *</label>
            <input value={marca} onChange={(e) => setMarca(e.target.value)} />
          </div>
          <div>
            <label>Modelo *</label>
            <input value={modelo} onChange={(e) => setModelo(e.target.value)} />
          </div>
          <div>
            <label>Año *</label>
            <input type="number" value={anio} onChange={(e) => setAnio(e.target.value)} />
          </div>
          <div>
            <label>Precio (RD$) *</label>
            <input type="number" value={precio} onChange={(e) => setPrecio(e.target.value)} />
          </div>
          <div>
            <label>Kilometraje</label>
            <input type="number" value={kilometraje} onChange={(e) => setKilometraje(e.target.value)} />
          </div>
          <div>
            <label>Pasajeros</label>
            <input type="number" value={pasajeros} onChange={(e) => setPasajeros(e.target.value)} />
          </div>
          <div>
            <label>Transmisión</label>
            <select value={transmision} onChange={(e) => setTransmision(e.target.value)}>
              <option>Automática</option>
              <option>Manual</option>
            </select>
          </div>
          <div>
            <label>Combustible</label>
            <select value={combustible} onChange={(e) => setCombustible(e.target.value)}>
              <option>Gasolina</option>
              <option>Diésel</option>
              <option>Híbrido</option>
              <option>Eléctrico</option>
            </select>
          </div>
          <div>
            <label>Motor</label>
            <input value={motor} onChange={(e) => setMotor(e.target.value)} placeholder="1.8 L, 4 cilindros" />
          </div>
          <div>
            <label>Tracción</label>
            <select value={traccion} onChange={(e) => setTraccion(e.target.value)}>
              <option>Delantera</option>
              <option>Trasera</option>
              <option>4x4</option>
              <option>AWD</option>
            </select>
          </div>
          <div>
            <label>Color exterior</label>
            <input value={colorExterior} onChange={(e) => setColorExterior(e.target.value)} />
          </div>
          <div>
            <label>Color interior</label>
            <input value={colorInterior} onChange={(e) => setColorInterior(e.target.value)} />
          </div>
          <div>
            <label>Estado</label>
            <select value={estado} onChange={(e) => setEstado(e.target.value)}>
              <option value="0">Disponible</option>
              <option value="1">Vendido</option>
              <option value="2">Reservado</option>
            </select>
          </div>
        </section>

        <section className="admin-card">
          <label>Descripción</label>
          <input value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
        </section>

        <section className="admin-card">
          <label>Imágenes (una URL por línea)</label>
          <textarea
            rows={4}
            style={{ width: "100%", background: "#0f1420", border: "1px solid #2a3142", borderRadius: 8, color: "#fff", padding: "8px 10px", fontSize: 14, fontFamily: "inherit" }}
            value={imagenesTexto}
            onChange={(e) => setImagenesTexto(e.target.value)}
            placeholder={"https://ejemplo.com/foto1.jpg\nhttps://ejemplo.com/foto2.jpg"}
          />
        </section>

        <section className="admin-card">
          <label>Características (una por línea)</label>
          <textarea
            rows={4}
            style={{ width: "100%", background: "#0f1420", border: "1px solid #2a3142", borderRadius: 8, color: "#fff", padding: "8px 10px", fontSize: 14, fontFamily: "inherit" }}
            value={caracteristicasTexto}
            onChange={(e) => setCaracteristicasTexto(e.target.value)}
            placeholder={"Cámara de reversa\nBluetooth\nApple CarPlay"}
          />
        </section>

        <button className="admin-btn-primario" type="submit" disabled={cargando}>
          {cargando ? "Guardando..." : esEdicion ? "Guardar cambios" : "Guardar vehículo"}
        </button>
      </form>
    </div>
  );
}
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, type Vehiculo, type Cliente } from "../services/api";



const ITBIS_PORCENTAJE = 0.18;

export default function NuevaFactura() {
  const navigate = useNavigate();

  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [vehiculoId, setVehiculoId] = useState<number | null>(null);
  const [clienteId, setClienteId] = useState<number | null>(null);

  const [mostrarNuevoCliente, setMostrarNuevoCliente] = useState(false);
  const [nuevoCliente, setNuevoCliente] = useState({
    nombre: "",
    cedulaORnc: "",
    telefono: "",
    correo: "",
    direccion: "",
  });

  const [vendedor, setVendedor] = useState("");
  const [descuento, setDescuento] = useState(0);
  const [metodoPago, setMetodoPago] = useState("Contado");
  const [observaciones, setObservaciones] = useState("");

  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.getVehiculosDisponibles().then(setVehiculos).catch(console.error);
    api.getClientes().then(setClientes).catch(console.error);
  }, []);

  const vehiculoSeleccionado = vehiculos.find((v) => v.id === vehiculoId);
  const clienteSeleccionado = clientes.find((c) => c.id === clienteId);

  function esRncValido(cedulaORnc: string) {
  const soloDigitos = cedulaORnc.replace(/\D/g, "");
  return soloDigitos.length === 9;
  }
  const subtotal = vehiculoSeleccionado?.precio ?? 0;
  const baseImponible = Math.max(subtotal - descuento, 0);
  const itbis = Math.round(baseImponible * ITBIS_PORCENTAJE * 100) / 100;
  const total = baseImponible + itbis;

  const formatearMoneda = (valor: number) =>
    `RD$${valor.toLocaleString("es-DO", { maximumFractionDigits: 0 })}`;

  async function handleCrearCliente() {
    try {
      const creado = await api.crearCliente(nuevoCliente);
      setClientes((prev) => [...prev, creado]);
      setClienteId(creado.id);
      setMostrarNuevoCliente(false);
    } catch (err) {
      setError("No se pudo crear el cliente.");
    }
  }

  async function handleEmitirFactura() {
    if (!vehiculoId || !clienteId) {
      setError("Selecciona un vehículo y un cliente.");
      return;
    }

    setCargando(true);
    setError(null);

    try {
      const factura = await api.crearFactura({
        clienteId,
        vehiculoId,
        vendedor,
        descuento,
        metodoPago,
        observaciones,
      });
      navigate(`/admin/facturas/${factura.id}`);
    } catch (err: any) {
      setError(err.message ?? "Error al emitir la factura.");
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="admin-factura-form">
      <h1>Nueva factura</h1>

      {error && <div className="admin-error">{error}</div>}

      <section className="admin-card">
        <label>Vehículo</label>
        <select
          value={vehiculoId ?? ""}
          onChange={(e) => setVehiculoId(Number(e.target.value) || null)}
        >
          <option value="">Selecciona un vehículo disponible</option>
          {vehiculos.map((v) => (
            <option key={v.id} value={v.id}>
              {v.marca} {v.modelo} {v.anio} · {v.codigo} — {formatearMoneda(v.precio)}
            </option>
          ))}
        </select>
      </section>

      <section className="admin-card">
        <label>Cliente</label>
        {!mostrarNuevoCliente ? (
          <>
            <select
              value={clienteId ?? ""}
              onChange={(e) => setClienteId(Number(e.target.value) || null)}
            >
              <option value="">Selecciona un cliente</option>
              {clientes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre} — {c.cedulaORnc}
                </option>
              ))}
            </select>
            <button type="button" onClick={() => setMostrarNuevoCliente(true)}>
              + Nuevo cliente
            </button>
          </>
        ) : (
          <div className="admin-nuevo-cliente">
            <input
              placeholder="Nombre completo"
              value={nuevoCliente.nombre}
              onChange={(e) => setNuevoCliente({ ...nuevoCliente, nombre: e.target.value })}
            />
            <input
              placeholder="Cédula o RNC"
              value={nuevoCliente.cedulaORnc}
              onChange={(e) => setNuevoCliente({ ...nuevoCliente, cedulaORnc: e.target.value })}
            />
            <input
              placeholder="Teléfono"
              value={nuevoCliente.telefono}
              onChange={(e) => setNuevoCliente({ ...nuevoCliente, telefono: e.target.value })}
            />
            <input
              placeholder="Correo"
              value={nuevoCliente.correo}
              onChange={(e) => setNuevoCliente({ ...nuevoCliente, correo: e.target.value })}
            />
            <input
              placeholder="Dirección"
              value={nuevoCliente.direccion}
              onChange={(e) => setNuevoCliente({ ...nuevoCliente, direccion: e.target.value })}
            />
            <div>
              <button type="button" onClick={handleCrearCliente}>
                Guardar cliente
              </button>
              <button type="button" onClick={() => setMostrarNuevoCliente(false)}>
                Cancelar
              </button>
            </div>
          </div>
        )}

               {clienteSeleccionado && (
          <p className="admin-label" style={{ marginTop: "8px" }}>
            Tipo de comprobante: <strong style={{ color: "#f5c451" }}>
              {esRncValido(clienteSeleccionado.cedulaORnc) ? "B01 - Crédito Fiscal" : "B02 - Consumidor Final"}
            </strong>
          </p>
        )}           

      </section>

      <section className="admin-card admin-grid-2">
        <div>
          <label>Vendedor</label>
          <input value={vendedor} onChange={(e) => setVendedor(e.target.value)} />
        </div>
        <div>
          <label>Descuento (RD$)</label>
          <input
            type="number"
            min={0}
            value={descuento}
            onChange={(e) => setDescuento(Number(e.target.value))}
          />
        </div>
        <div>
          <label>Método de pago</label>
          <select value={metodoPago} onChange={(e) => setMetodoPago(e.target.value)}>
            <option>Contado</option>
            <option>Financiamiento</option>
            <option>Tarjeta</option>
            <option>Transferencia</option>
          </select>
        </div>
        <div>
          <label>Observaciones</label>
          <input value={observaciones} onChange={(e) => setObservaciones(e.target.value)} />
        </div>
      </section>

      <section className="admin-card admin-resumen">
        <div className="admin-resumen-linea">
          <span>Subtotal</span>
          <span>{formatearMoneda(subtotal)}</span>
        </div>
        <div className="admin-resumen-linea">
          <span>Descuento</span>
          <span>{formatearMoneda(descuento)}</span>
        </div>
        <div className="admin-resumen-linea">
          <span>ITBIS (18%)</span>
          <span>{formatearMoneda(itbis)}</span>
        </div>
        <div className="admin-resumen-total">
          <span>Total</span>
          <span>{formatearMoneda(total)}</span>
        </div>
      </section>

      <button
        className="admin-btn-primario"
        onClick={handleEmitirFactura}
        disabled={cargando}
      >
        {cargando ? "Emitiendo..." : "Emitir factura"}
      </button>
    </div>
  );
}
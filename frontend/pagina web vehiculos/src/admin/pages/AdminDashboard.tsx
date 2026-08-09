import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { api, type Factura, type Vehiculo } from "../services/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function AdminDashboard() {
  const [facturas, setFacturas] = useState<Factura[]>([]);
  const [vehiculosDisponibles, setVehiculosDisponibles] = useState<Vehiculo[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    Promise.all([api.getFacturas(), api.getVehiculosDisponibles()])
      .then(([f, v]) => {
        setFacturas(f);
        setVehiculosDisponibles(v);
      })
      .finally(() => setCargando(false));
  }, []);

  const formatearMoneda = (valor: number) =>
    `RD$${valor.toLocaleString("es-DO", { maximumFractionDigits: 0 })}`;

  const facturasPagadas = facturas.filter((f) => f.estado === 0);
  const ingresosTotales = facturasPagadas.reduce((acc, f) => acc + f.total, 0);

  const inicioMes = new Date();
  inicioMes.setDate(1);
  inicioMes.setHours(0, 0, 0, 0);
  const facturasDelMes = facturasPagadas.filter((f) => new Date(f.fecha) >= inicioMes);

  const ultimasFacturas = [...facturas]
    .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
    .slice(0, 5);

  // Ventas por mes (últimos 6 meses)
  const ventasPorMes = useMemo(() => {
    const meses: { label: string; total: number }[] = [];
    const ahora = new Date();

    for (let i = 5; i >= 0; i--) {
      const fecha = new Date(ahora.getFullYear(), ahora.getMonth() - i, 1);
      const label = fecha.toLocaleDateString("es-DO", { month: "short" });
      const total = facturasPagadas
        .filter((f) => {
          const fFecha = new Date(f.fecha);
          return fFecha.getFullYear() === fecha.getFullYear() && fFecha.getMonth() === fecha.getMonth();
        })
        .reduce((acc, f) => acc + f.total, 0);
      meses.push({ label, total });
    }

    return meses;
  }, [facturasPagadas]);

  // Top marcas más vendidas
  const topMarcas = useMemo(() => {
    const conteo: Record<string, number> = {};
    facturasPagadas.forEach((f) => {
      const marca = f.vehiculo?.marca ?? "Desconocida";
      conteo[marca] = (conteo[marca] ?? 0) + 1;
    });
    return Object.entries(conteo)
      .map(([marca, cantidad]) => ({ marca, cantidad }))
      .sort((a, b) => b.cantidad - a.cantidad)
      .slice(0, 5);
  }, [facturasPagadas]);

  if (cargando) return <p>Cargando...</p>;

  return (
    <div className="admin-dashboard">
      <div className="admin-listado-header">
        <h1>Panel de facturación</h1>
        <Link to="/admin/facturar" className="admin-btn-primario">
          + Nueva factura
        </Link>
      </div>

      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <p className="admin-label">Vehículos disponibles</p>
          <p className="admin-stat-valor">{vehiculosDisponibles.length}</p>
        </div>
        <div className="admin-stat-card">
          <p className="admin-label">Facturas este mes</p>
          <p className="admin-stat-valor">{facturasDelMes.length}</p>
        </div>
        <div className="admin-stat-card">
          <p className="admin-label">Ingresos totales</p>
          <p className="admin-stat-valor">{formatearMoneda(ingresosTotales)}</p>
        </div>
        <div className="admin-stat-card">
          <p className="admin-label">Total de facturas</p>
          <p className="admin-stat-valor">{facturas.length}</p>
        </div>
      </div>

      <h2>Ventas de los últimos 6 meses</h2>
      <div className="admin-card" style={{ height: "260px", paddingTop: "1.5rem" }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={ventasPorMes}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a3142" />
            <XAxis dataKey="label" stroke="#9a9a95" fontSize={12} />
            <YAxis
              stroke="#9a9a95"
              fontSize={12}
              tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`}
            />
            <Tooltip
              formatter={(value: any) => formatearMoneda(Number(value))}
              contentStyle={{ background: "#171d2c", border: "1px solid #2a3142", borderRadius: "8px", color: "#fff" }}
            />
            <Bar dataKey="total" fill="#f5c451" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {topMarcas.length > 0 && (
        <>
          <h2>Marcas más vendidas</h2>
          <table className="admin-tabla" style={{ marginBottom: "1.5rem" }}>
            <thead>
              <tr>
                <th>Marca</th>
                <th>Unidades vendidas</th>
              </tr>
            </thead>
            <tbody>
              {topMarcas.map((item) => (
                <tr key={item.marca}>
                  <td>{item.marca}</td>
                  <td>{item.cantidad}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      <div className="admin-listado-header">
        <h2>Últimas facturas</h2>
        <Link to="/admin/facturas">Ver todas</Link>
      </div>

      <table className="admin-tabla">
        <thead>
          <tr>
            <th>Número</th>
            <th>Cliente</th>
            <th>Total</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {ultimasFacturas.length === 0 && (
            <tr>
              <td colSpan={4}>Aún no hay facturas.</td>
            </tr>
          )}
          {ultimasFacturas.map((f) => (
            <tr key={f.id}>
              <td>{f.numeroFactura}</td>
              <td>{f.cliente?.nombre}</td>
              <td>{formatearMoneda(f.total)}</td>
              <td>
                <Link to={`/admin/facturas/${f.id}`}>Ver</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
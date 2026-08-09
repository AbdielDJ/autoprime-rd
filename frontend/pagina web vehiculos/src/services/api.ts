import type { Vehiculo } from "../types/vehicle";

const API_URL = "https://localhost:7273/api";

export async function getVehiculos(): Promise<Vehiculo[]> {
  const res = await fetch(`${API_URL}/vehiculos`);
  if (!res.ok) throw new Error("No se pudieron cargar los vehículos.");
  return res.json();
}

export async function getVehiculoPorSlug(slug: string): Promise<Vehiculo | null> {
  const res = await fetch(`${API_URL}/vehiculos/slug/${slug}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("No se pudo cargar el vehículo.");
  return res.json();
}

export interface CrearCotizacionDto {
  nombre: string;
  telefono: string;
  correo?: string;
  vehiculoInteres?: string;
  vehiculoId?: number;
  mensaje?: string;
}

export async function crearCotizacion(dto: CrearCotizacionDto): Promise<void> {
  const res = await fetch(`${API_URL}/cotizaciones`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dto),
  });
  if (!res.ok) throw new Error("No se pudo enviar la solicitud.");
}
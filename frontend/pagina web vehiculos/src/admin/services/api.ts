const API_URL = import.meta.env.VITE_API_URL || "https://localhost:7273/api";

export interface UsuarioListado {
  id: number;
  nombreUsuario: string;
  nombre: string;
  rol: string;
  activo: boolean;
}

export interface CrearUsuarioDto {
  nombreUsuario: string;
  nombre: string;
  password: string;
  rol: number; // 0 = Administrador, 1 = Cajero
}

export interface ActualizarUsuarioDto {
  nombre: string;
  rol: number;
  activo: boolean;
  nuevaPassword?: string;
}

export interface Cliente {
  id: number;
  nombre: string;
  cedulaORnc: string;
  telefono?: string;
  correo?: string;
  direccion?: string;
}

export interface Vehiculo {
  id: number;
  codigo: string;
  slug: string;
  marca: string;
  modelo: string;
  anio: number;
  kilometraje: number;
  transmision?: string;
  combustible?: string;
  motor?: string;
  traccion?: string;
  colorExterior?: string;
  colorInterior?: string;
  pasajeros: number;
  descripcion?: string;
  precio: number;
  estado: number;
  imagenes: string[];
  caracteristicas: string[];
}

export interface CrearVehiculoDto {
  codigo: string;
  slug: string;
  marca: string;
  modelo: string;
  anio: number;
  kilometraje: number;
  transmision?: string;
  combustible?: string;
  motor?: string;
  traccion?: string;
  colorExterior?: string;
  colorInterior?: string;
  pasajeros: number;
  descripcion?: string;
  precio: number;
  estado: number;
  imagenes: string[];
  caracteristicas: string[];
}

export interface Factura {
  id: number;
  numeroFactura: string;
  ncf?: string;
  fecha: string;
  clienteId: number;
  cliente?: Cliente;
  vehiculoId: number;
  vehiculo?: Vehiculo;
  vendedor?: string;
  subtotal: number;
  descuento: number;
  itbis: number;
  total: number;
  metodoPago?: string;
  estado: number;
  observaciones?: string;
}

export interface CrearFacturaDto {
  clienteId: number;
  vehiculoId: number;
  vendedor?: string;
  descuento: number;
  metodoPago?: string;
  observaciones?: string;
}

export interface Cotizacion {
  id: number;
  nombre: string;
  telefono: string;
  correo?: string;
  vehiculoInteres?: string;
  vehiculoId?: number;
  vehiculo?: Vehiculo;
  mensaje?: string;
  fecha: string;
  estado: number;
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || `Error ${res.status}`);
  }
  return res.json();
}

export const api = {
  getVehiculosDisponibles: (): Promise<Vehiculo[]> =>
    fetch(`${API_URL}/vehiculos/disponibles`).then((r) => handleResponse(r)),

  getVehiculos: (): Promise<Vehiculo[]> =>
    fetch(`${API_URL}/vehiculos`).then((r) => handleResponse(r)),

  crearVehiculo: (vehiculo: CrearVehiculoDto): Promise<Vehiculo> =>
    fetch(`${API_URL}/vehiculos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(vehiculo),
    }).then((r) => handleResponse(r)),

  getClientes: (): Promise<Cliente[]> =>
    fetch(`${API_URL}/clientes`).then((r) => handleResponse(r)),

  crearCliente: (cliente: Omit<Cliente, "id">): Promise<Cliente> =>
    fetch(`${API_URL}/clientes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cliente),
    }).then((r) => handleResponse(r)),

  getFacturas: (): Promise<Factura[]> =>
    fetch(`${API_URL}/facturas`).then((r) => handleResponse(r)),

  getFactura: (id: number): Promise<Factura> =>
    fetch(`${API_URL}/facturas/${id}`).then((r) => handleResponse(r)),

  crearFactura: (dto: CrearFacturaDto): Promise<Factura> =>
    fetch(`${API_URL}/facturas`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dto),
    }).then((r) => handleResponse(r)),

  anularFactura: (id: number): Promise<void> =>
    fetch(`${API_URL}/facturas/${id}/anular`, { method: "PUT" }).then((r) => {
      if (!r.ok) throw new Error("Error al anular la factura");
    }),

  getCotizaciones: (): Promise<Cotizacion[]> =>
    fetch(`${API_URL}/cotizaciones`).then((r) => handleResponse(r)),

  actualizarEstadoCotizacion: (id: number, estado: number): Promise<void> =>
    fetch(`${API_URL}/cotizaciones/${id}/estado`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(estado),
    }).then((r) => {
      if (!r.ok) throw new Error("No se pudo actualizar el estado.");
    }),

  eliminarCotizacion: (id: number): Promise<void> =>
    fetch(`${API_URL}/cotizaciones/${id}`, { method: "DELETE" }).then((r) => {
      if (!r.ok) throw new Error("No se pudo eliminar la cotización.");
    }),

    eliminarVehiculo: (id: number): Promise<void> =>
    fetch(`${API_URL}/vehiculos/${id}`, { method: "DELETE" }).then((r) => {
      if (!r.ok) throw new Error("No se pudo eliminar. Es posible que este vehículo ya tenga facturas asociadas.");
    }),

    actualizarVehiculo: (id: number, vehiculo: CrearVehiculoDto & { id: number }): Promise<void> =>
    fetch(`${API_URL}/vehiculos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(vehiculo),
    }).then((r) => {
      if (!r.ok) throw new Error("No se pudo actualizar el vehículo.");
    }),

    getVehiculo: (id: number): Promise<Vehiculo> =>
    fetch(`${API_URL}/vehiculos/${id}`).then((r) => handleResponse(r)),

    actualizarCliente: (id: number, cliente: Cliente): Promise<void> =>
    fetch(`${API_URL}/clientes/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cliente),
    }).then((r) => {
      if (!r.ok) throw new Error("No se pudo actualizar el cliente.");
    }),

    eliminarCliente: (id: number): Promise<void> =>
      fetch(`${API_URL}/clientes/${id}`, { method: "DELETE" }).then((r) => {
      if (!r.ok) throw new Error("No se pudo eliminar. Es posible que este cliente tenga facturas asociadas.");
    }),

    getUsuarios: (): Promise<UsuarioListado[]> =>
    fetch(`${API_URL}/usuarios`).then((r) => handleResponse(r)),

    crearUsuario: (usuario: CrearUsuarioDto): Promise<void> =>
    fetch(`${API_URL}/usuarios`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(usuario),
    }).then((r) => {
      if (!r.ok) throw new Error("No se pudo crear el usuario. Verifica que el nombre no esté repetido.");
    }),

    actualizarUsuario: (id: number, usuario: ActualizarUsuarioDto): Promise<void> =>
    fetch(`${API_URL}/usuarios/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(usuario),
    }).then((r) => {
      if (!r.ok) throw new Error("No se pudo actualizar el usuario.");
    }),

    eliminarUsuario: (id: number): Promise<void> =>
    fetch(`${API_URL}/usuarios/${id}`, { method: "DELETE" }).then((r) => {
      if (!r.ok) throw new Error("No se pudo eliminar el usuario.");
    }),
};
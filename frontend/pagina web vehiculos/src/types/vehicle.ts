export type Vehiculo = {
  id: number;
  codigo: string;
  slug: string;
  marca: string;
  modelo: string;
  anio: number;
  precio: number;
  transmision: string;
  combustible: string;
  kilometraje: number;
  motor: string;
  traccion: string;
  colorExterior: string;
  colorInterior: string;
  pasajeros: number;
  descripcion: string;
  imagenes: string[];
  caracteristicas: string[];
  estado: number; // 0 = Disponible, 1 = Vendido, 2 = Reservado
};
import { Link } from "react-router-dom";
import type { Vehiculo } from "../types/vehicle";
import { formatearPrecio } from "../data/vehicles";

const ESTADO_TEXTO = ["Disponible", "Vendido", "Reservado"];

export default function VehicleCard({ vehiculo }: { vehiculo: Vehiculo }) {
  return (
    <article className="vehicleCard">
      <div className="vehicleMedia">
        <img src={vehiculo.imagenes[0]} alt={`${vehiculo.marca} ${vehiculo.modelo}`} loading="lazy" />
        <span className="vehicleStatus">{ESTADO_TEXTO[vehiculo.estado] ?? "Disponible"}</span>
        <span className="vehicleCode">{vehiculo.codigo}</span>
      </div>
      <div className="vehicleInfo">
        <div className="vehicleTitleRow">
          <div>
            <p className="eyebrow">{vehiculo.marca}</p>
            <h3>{vehiculo.modelo}</h3>
          </div>
          <span className="yearPill">{vehiculo.anio}</span>
        </div>
        <div className="vehicleMeta">
          <span>◉ {vehiculo.kilometraje.toLocaleString("es-DO")} km</span>
          <span>⚙ {vehiculo.transmision}</span>
          <span>⛽ {vehiculo.combustible}</span>
        </div>
        <strong className="cardPrice">{formatearPrecio(vehiculo.precio)}</strong>
        <Link className="detailButton" to={`/vehiculos/${vehiculo.slug}`}>Ver ficha completa <span>→</span></Link>
      </div>
    </article>
  );
}
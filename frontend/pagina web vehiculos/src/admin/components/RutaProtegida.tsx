import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
  soloAdmin?: boolean;
}

export default function RutaProtegida({ children, soloAdmin }: Props) {
  const { autenticado, usuario } = useAuth();
  const location = useLocation();

  if (!autenticado) {
    return <Navigate to="/admin/login" state={{ from: location.pathname }} replace />;
  }

  if (soloAdmin && usuario?.rol !== "Administrador") {
    return <Navigate to="/admin/facturar" replace />;
  }

  return <>{children}</>;
}
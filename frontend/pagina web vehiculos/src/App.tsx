import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import "./site-enhancements.css";
import "./admin/admin.css";
import Home from "./pages/Home";
import VehicleDetails from "./pages/VehicleDetails";
import AdminLayout from "./admin/components/AdminLayout";
import AdminDashboard from "./admin/pages/AdminDashboard";
import NuevaFactura from "./admin/pages/NuevaFactura";
import ListadoFacturas from "./admin/pages/ListadoFacturas";
import DetalleFactura from "./admin/pages/DetalleFactura";
import Cotizaciones from "./admin/pages/Cotizaciones";
import ListadoVehiculos from "./admin/pages/ListadoVehiculos";
import NuevoVehiculo from "./admin/pages/NuevoVehiculo";
import ListadoClientes from "./admin/pages/ListadoClientes";
import Usuarios from "./admin/pages/Usuarios";
import Login from "./admin/pages/Login";
import RutaProtegida from "./admin/components/RutaProtegida";
import { AuthProvider } from "./admin/context/AuthContext";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/vehiculos/:slug" element={<VehicleDetails />} />

          <Route path="/admin/login" element={<Login />} />

          <Route
            path="/admin"
            element={
              <RutaProtegida>
                <AdminLayout />
              </RutaProtegida>
            }
          >
            <Route
              index
              element={
                <RutaProtegida soloAdmin>
                  <AdminDashboard />
                </RutaProtegida>
              }
            />
            <Route path="facturar" element={<NuevaFactura />} />
            <Route path="facturas" element={<ListadoFacturas />} />
            <Route path="facturas/:id" element={<DetalleFactura />} />
            <Route path="clientes" element={<ListadoClientes />} />
            <Route
              path="cotizaciones"
              element={
                <RutaProtegida soloAdmin>
                  <Cotizaciones />
                </RutaProtegida>
              }
            />
            <Route
              path="vehiculos"
              element={
                <RutaProtegida soloAdmin>
                  <ListadoVehiculos />
                </RutaProtegida>
              }
            />
            <Route
              path="vehiculos/nuevo"
              element={
                <RutaProtegida soloAdmin>
                  <NuevoVehiculo />
                </RutaProtegida>
              }
            />
            <Route
              path="vehiculos/:id/editar"
              element={
                <RutaProtegida soloAdmin>
                  <NuevoVehiculo />
                </RutaProtegida>
              }
            />
            <Route
              path="usuarios"
              element={
                <RutaProtegida soloAdmin>
                  <Usuarios />
                </RutaProtegida>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
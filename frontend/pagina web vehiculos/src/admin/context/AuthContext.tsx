import { createContext, useContext, useState, type ReactNode } from "react";

const API_URL = "https://autoprime-api.onrender.com/api";

export interface UsuarioSesion {
  id: number;
  nombreUsuario: string;
  nombre: string;
  rol: "Administrador" | "Cajero";
}

interface AuthContextType {
  usuario: UsuarioSesion | null;
  autenticado: boolean;
  login: (nombreUsuario: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<UsuarioSesion | null>(() => {
    const guardado = sessionStorage.getItem("autoprime_admin_user");
    return guardado ? JSON.parse(guardado) : null;
  });

  async function login(nombreUsuario: string, password: string): Promise<boolean> {
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombreUsuario, password }),
      });

      if (!res.ok) return false;

      const data: UsuarioSesion = await res.json();
      sessionStorage.setItem("autoprime_admin_user", JSON.stringify(data));
      setUsuario(data);
      return true;
    } catch {
      return false;
    }
  }

  function logout() {
    sessionStorage.removeItem("autoprime_admin_user");
    setUsuario(null);
  }

  return (
    <AuthContext.Provider value={{ usuario, autenticado: !!usuario, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return context;
}
# AutoPrime RD

Sistema web de gestión y facturación para una agencia de vehículos en República Dominicana. Combina un sitio público con catálogo dinámico y un panel administrativo con facturación, control de inventario, clientes y cotizaciones — todo respaldado por una API en C# y una base de datos PostgreSQL.

**Sitio en vivo:** https://autoprime-rd.onrender.com
**API:** https://autoprime-api.onrender.com/api

> Proyecto académico individual — Análisis y Diseño de Sistemas, UFHEC.

---

## Tabla de contenido

- [Capturas](#capturas)
- [Características](#características)
- [Stack tecnológico](#stack-tecnológico)
- [Arquitectura](#arquitectura)
- [Estructura del repositorio](#estructura-del-repositorio)
- [Instalación local](#instalación-local)
- [Usuarios de prueba](#usuarios-de-prueba)
- [Roadmap](#roadmap)

---

## Características

### Sitio público
- Catálogo de vehículos con filtros por marca, precio y ordenamiento.
- Ficha individual por vehículo: galería de imágenes, ficha técnica, equipamiento.
- Formulario de cotización y contacto conectado a la base de datos.
- Contacto directo por WhatsApp.
- Diseño responsive (escritorio, tablet, móvil).

### Panel administrativo (`/admin`)
- **Autenticación real** con usuario y contraseña validados contra la base de datos (contraseñas encriptadas con BCrypt).
- **Control de acceso por roles:**
  - `Administrador` — acceso total: vehículos, clientes, facturas, cotizaciones, reportes y gestión de usuarios.
  - `Cajero` — acceso limitado a facturación y clientes.
- **Facturación** con cálculo automático de ITBIS (18%) y generación de **NCF** (Número de Comprobante Fiscal), detectando automáticamente si corresponde:
  - `B01` — Crédito Fiscal (cliente con RNC, 9 dígitos)
  - `B02` — Consumidor Final (cliente con cédula, 11 dígitos)
- **Inventario de vehículos**: alta, edición y baja, sincronizado en tiempo real con el catálogo público.
- **Gestión de clientes** y de **cotizaciones** recibidas desde el sitio.
- **Dashboard con reportes**: ventas por mes (gráfica) y marcas más vendidas.

---

## Stack tecnológico

**Backend**
- C# / .NET 8 — ASP.NET Core Web API
- Entity Framework Core
- PostgreSQL (producción) — SQLite (soportado para desarrollo local)
- BCrypt.Net para hash de contraseñas
- Swagger / OpenAPI

**Frontend**
- React 18 + TypeScript
- Vite
- React Router
- Recharts (gráficas del dashboard)

**Infraestructura**
- Render — backend como Web Service (Docker), frontend como Static Site, base de datos PostgreSQL administrada.
- GitHub para control de versiones.

---

## Arquitectura

```
┌─────────────────────┐        HTTPS / REST        ┌──────────────────────┐
│   Frontend (React)  │ ──────────────────────────▶ │   API (ASP.NET Core) │
│   Vite + TypeScript │ ◀────────────────────────── │   C# / EF Core       │
└─────────────────────┘                              └──────────┬───────────┘
                                                                  │
                                                                  ▼
                                                       ┌──────────────────────┐
                                                       │  PostgreSQL (Render) │
                                                       └──────────────────────┘
```

El sitio público y el panel administrativo son parte de la **misma aplicación React**, bajo rutas distintas (`/` para el catálogo, `/admin` para el panel). Ambos consumen la misma API.

---

## Estructura del repositorio

```
AutoPrimeRD/
├── backend/
│   └── AutoPrime.Facturacion/
│       ├── Controllers/       # Endpoints REST (Clientes, Vehiculos, Facturas, Cotizaciones, Usuarios, Auth)
│       ├── Models/             # Entidades (Cliente, Vehiculo, Factura, Cotizacion, Usuario)
│       ├── Data/                # DbContext de Entity Framework Core
│       ├── Services/            # Lógica de negocio (cálculo de ITBIS, NCF)
│       ├── Migrations/
│       └── Dockerfile
│
├── frontend/
│   └── pagina web vehiculos/
│       ├── src/
│       │   ├── admin/           # Panel administrativo (páginas, servicios, contexto de auth)
│       │   ├── components/      # Componentes del sitio público (Navbar, VehicleCard)
│       │   ├── pages/           # Home y ficha de vehículo
│       │   ├── services/        # Cliente API del sitio público
│       │   └── types/
│       └── .env.production
│
└── README.md
```

---

## Instalación local

### Requisitos
- [.NET 8 SDK](https://dotnet.microsoft.com/download)
- [Node.js 18+](https://nodejs.org)
- Una base de datos PostgreSQL (o SQLite para pruebas rápidas)

### Backend

```bash
cd backend/AutoPrime.Facturacion
dotnet restore
```

Configura la cadena de conexión en `appsettings.Development.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5432;Database=autoprime;Username=postgres;Password=tu_password"
  }
}
```

Aplica las migraciones y corre el proyecto:

```bash
dotnet ef database update
dotnet run
```

La API queda disponible en `https://localhost:7273` con Swagger en `/swagger`.

### Frontend

```bash
cd "frontend/pagina web vehiculos"
npm install
npm run dev
```

Crea un archivo `.env.development` si quieres apuntar a una API distinta a `https://localhost:7273/api`:

```
VITE_API_URL=https://localhost:7273/api
```

El sitio queda disponible en `http://localhost:5173`.

---

## Usuarios de prueba

| Usuario | Contraseña | Rol |
|---|---|---|
| `admin` | `autoprime2026` | Administrador |
| `cajero` | `cajero2026` | Cajero |

---

## Roadmap

- [ ] Autenticación basada en tokens (JWT) con expiración de sesión.
- [ ] Exportación de respaldos de la base de datos.
- [ ] Configuración del porcentaje de ITBIS desde el panel.
- [ ] Reportes financieros más detallados (utilidad por vehículo, comisiones).

---

## Autor

**Abdiel de Jesús** — Matrícula LR-2023-06049
Universidad Federico Henríquez y Carvajal (UFHEC)
Análisis y Diseño de Sistemas, 2026

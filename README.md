# 📦 CR.Pedidos — Sistema de Gestión de Pedidos (Fullstack Senior)

[![.NET 9](https://img.shields.io/badge/.NET-9.0-purple.svg)](https://dotnet.microsoft.com/)
[![React 18](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3-teal.svg)](https://tailwindcss.com/)
[![SQL Server](https://img.shields.io/badge/SQL%20Server-EF%20Core%209-red.svg)](https://www.microsoft.com/sql-server/)
[![Security: JWT](https://img.shields.io/badge/Security-JWT%20Bearer%20%2B%20BCrypt-green.svg)](https://jwt.io/)

> 📋 **Nota para el evaluador:** Este repositorio contiene la solución completa end-to-end para el reto técnico de **Desarrollador Fullstack Senior**. El enunciado, requisitos y criterios de evaluación originales se encuentran disponibles en [RETO_TECNICO.md](./RETO_TECNICO.md).

---

## 📑 Tabla de Contenidos
1. [Descripción General](#-descripción-general)
2. [Arquitectura y Buenas Prácticas](#-arquitectura-y-buenas-prácticas)
3. [Seguridad y Credenciales de Acceso](#-seguridad-y-credenciales-de-acceso)
4. [Requisitos Previos](#-requisitos-previos)
5. [Puesta en Marcha (Paso a Paso)](#-puesta-en-marcha-paso-a-paso)
6. [Catálogo de Endpoints (API REST)](#-catálogo-de-endpoints-api-rest)
7. [Pruebas Automatizadas y Colección Postman](#-pruebas-automatizadas-y-colección-postman)
8. [Estructura del Proyecto](#-estructura-del-proyecto)

---

## 🎯 Descripción General

Aplicación web Fullstack moderna para la gestión operativa y control de pedidos comerciales, desarrollada con arquitectura desacoplada, alta resiliencia y diseño enfocado en la experiencia del usuario (UX).

* **Backend:** API RESTful en **.NET 9** bajo **Clean Architecture**, con autenticación **JWT Bearer**, persistencia transaccional con **Entity Framework Core 9**, manejo global de excepciones y políticas de seguridad estrictas.
* **Frontend:** Single Page Application (SPA) desarrollada con **React 18**, **TypeScript**, **Vite** y estilos en **Tailwind CSS**, integrando un interceptor Axios para control de tokens, rutas protegidas y diseño responsive.

---

## 🏛️ Arquitectura y Buenas Prácticas

La solución implementa una **Arquitectura Limpia (Clean Architecture)** con estricta inversión de dependencias:

```
cr-backend/
├── Api/             # Presentación: Controladores (AuthController, PedidosController), Middlewares, Program.cs
├── Application/     # Casos de uso: DTOs, Mapeos, Interfaces de servicios (IAuthService, IPedidoService)
├── Domain/          # Núcleo del dominio: Entidades (Pedido, Usuario), Enums (EstadoPedido), Interfaces
├── Infrastructure/  # Implementaciones: EF Core AppDbContext, Repositorios, Servicios JWT, BCrypt
├── Scripts/         # Scripts SQL de inicialización e idempotencia (init.sql)
└── CR.PedidosApi.sln# Solución de backend
```

### Patrones y Principios Aplicados:
* **SOLID:** Responsabilidad única en cada servicio y controlador, interfaces segregadas e inyección de dependencias (`IServiceCollection`).
* **Repository & Unit of Work:** Abstracción del acceso a datos desacoplada de la lógica de negocio.
* **Manejo Global de Excepciones:** Middleware custom (`ExceptionMiddleware`) que captura errores no controlados y responde con estructura JSON estandarizada.
* **CORS Habilitado:** Política configurada para permitir integración fluida y segura con el cliente SPA.

---

## 🔐 Seguridad y Credenciales de Acceso

Siguiendo las mejores prácticas de ciberseguridad para perfiles Senior:
* **Cifrado de Contraseñas:** Algoritmo **BCrypt** con salt aleatorio (Work Factor 11).
* **Firma JWT:** Algoritmo **HMAC-SHA256** con claims de usuario (`sub`, `email`, `role`, `jti`) y expiración configurable.
* **Complejidad de Contraseñas de Prueba:** Contraseñas seguras y robustas de más de 20 caracteres (mayúsculas, minúsculas, números y símbolos especiales).

### 🔑 Usuarios Preconfigurados (Seed Data)

| Rol | Correo Electrónico | Contraseña Segura | Propósito |
|---|---|---|---|
| **Administrador** | `admin@test.com` | `Admin@SecurePedidos2025!` | Gestión completa y administración del sistema |
| **Usuario Estándar** | `user@email.com` | `User@SecurePedidos2025!` | Operación y registro diario de pedidos |

---

## ⚙️ Requisitos Previos

* [.NET 9.0 SDK](https://dotnet.microsoft.com/download/dotnet/9.0)
* [Node.js 18+ LTS](https://nodejs.org/) y npm
* [SQL Server 2019+](https://www.microsoft.com/sql-server/) (o LocalDB / SQL Server Express / Contenedor Docker)

---

## 🚀 Puesta en Marcha (Paso a Paso)

### 1️⃣ Base de Datos (SQL Server)

Tienes dos alternativas para inicializar la base de datos:

* **Alternativa A (Automática - Recomendada):** Al iniciar la API, el contexto de EF Core aplica las migraciones pendientes y el seeder de usuarios automáticamente (`db.Database.Migrate()`).
* **Alternativa B (Script SQL Idempotente):** Ejecutar en SQL Server Management Studio o Azure Data Studio el archivo:
  ```bash
  cr-backend/Scripts/init.sql
  ```

> **Cadena de conexión:** Modifica `cr-backend/Api/appsettings.json` según tu instancia de SQL Server local si es necesario.

### 2️⃣ Backend (.NET 9 Web API)

Compilar y ejecutar la solución:

```bash
# Desde la raíz del repositorio
dotnet restore
dotnet build

# Iniciar la API
cd cr-backend/Api
dotnet run
```

* **Swagger UI interactivo:** `https://localhost:7023/swagger` (o `http://localhost:5130/swagger`)

### 3️⃣ Frontend (React + Vite + Tailwind)

```bash
# Abrir una nueva terminal y navegar al frontend
cd cr-frontend
npm install
npm run dev
```

* **Aplicación Web:** `http://localhost:5173`

---

## 📡 Catálogo de Endpoints (API REST)

Todos los endpoints (excepto `/auth/login`) requieren la cabecera `Authorization: Bearer {token}`.

| Método | Endpoint | Descripción | Requiere Auth |
|---|---|---|:---:|
| `POST` | `/auth/login` o `/api/auth/login` | Inicia sesión y retorna token JWT + tiempo de expiración | ❌ No |
| `GET` | `/api/pedidos` | Obtiene el listado completo de pedidos registrados |  Sí |
| `GET` | `/api/pedidos/{id}` | Obtiene el detalle de un pedido por su identificador |  Sí |
| `POST` | `/api/pedidos` | Registra un nuevo pedido (valida total > 0 y número único) |  Sí |
| `PUT` | `/api/pedidos/{id}` | Actualiza datos y estado de un pedido existente |  Sí |
| `DELETE` | `/api/pedidos/{id}` | Elimina un pedido del sistema |  Sí |

---

## 🧪 Pruebas Automatizadas y Colección Postman

En la raíz del proyecto se incluye el archivo:
```
CR_PedidosApi.postman_collection.json
```

### Cómo ejecutar la colección:
1. Abrir Postman e importar el archivo `CR_PedidosApi.postman_collection.json`.
2. Ejecutar la petición **`Auth > Login (User)`** o **`Auth > Login (Admin)`**.
3. El token JWT se capturará y asignará automáticamente a la variable `{{authToken}}`.
4. Ejecutar el flujo de pedidos (**Listar**, **Crear**, **Actualizar**, **Eliminar**) con validación automática de estados HTTP.

---

## 📁 Estructura del Proyecto

```text
├── CR.PedidosApi.sln                    # Solución .NET 9 raíz
├── CR_PedidosApi.postman_collection.json # Colección Postman con scripts automáticos
├── README.md                           # Documentación oficial de entrega
├── RETO_TECNICO.md                     # Enunciado original de la prueba técnica
├── cr-backend/                         # Código fuente Backend (.NET 9)
│   ├── Api/                            # Capa Web API (Controllers, Program, Middleware)
│   ├── Application/                    # Capa Aplicación (DTOs, Interfaces)
│   ├── Domain/                         # Capa Dominio (Entidades, Interfaces núcleo)
│   ├── Infrastructure/                 # Capa Infraestructura (EF Core, JWT, BCrypt)
│   ├── Scripts/                        # Scripts SQL de migraciones (init.sql)
│   └── CR.PedidosApi.sln               # Solución de backend
└── cr-frontend/                        # Código fuente Frontend (React 18, Vite, Tailwind 3)
```

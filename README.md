# SISTEMA_SALES

Information System for Integral Management of Sales, Invoicing, Inventory and Supply Processes.

**Company:** SISTEMA_SALES S. A. (Quito, Ecuador)
**Institution:** Instituto Superior Tecnológico Japón (Ecuador)
**Career:** Tecnología Superior en Desarrollo de Software
**Author:** Shunayka G. Baquero
**Instructor:** Ing. Luis Calo

## Overview

SISTEMA_SALES is an academic practical case built with a hexagonal (ports and adapters)
architecture around a shared, framework-free domain core. The same core is consumed by
a REST API and by three client applications, all functional and delivered together:
desktop (Electron), web (React + Vite) and mobile (React Native + Expo).

## Tech Stack

- **Language:** TypeScript
- **REST API:** NestJS
- **Desktop:** Electron
- **Web:** React 18 + Vite
- **Mobile:** React Native + Expo
- **Database:** PostgreSQL 18 (see `docs/cambios-documento.md` Nota 1 regarding the documented version 16)
- **ORM:** Prisma 6
- **Monorepo:** npm workspaces
- **Testing:** Vitest

## Project Structure

```
sistema-sales/
├── packages/
│   ├── core/          # Hexagonal domain core (entities, value objects, ports, application services)
│   ├── persistence/    # Prisma schema, migrations, seed data and repository adapters
│   ├── api/             # NestJS REST API (JWT auth, Swagger docs)
│   ├── desktop/         # Electron shell hosting the web app
│   ├── web/              # React + Vite web client (shared UI, also used by desktop)
│   └── mobile/            # React Native + Expo mobile client
└── docs/
    ├── diagrams/    # UML diagrams (PDF)
    ├── sql/           # Raw SQL DDL for the academic annex
    ├── manual/         # User manual
    └── cambios-documento.md  # Log of deviations from the original academic document
```

## Prerequisites

- Node.js 20+ and npm
- PostgreSQL 18 (locally installed, no Docker), with `psql` reachable from a terminal
- For the mobile app: the Expo Go app on a phone, or an Android/iOS emulator, to actually
  run it visually (this repository was developed and verified without one — see
  `docs/cambios-documento.md` Nota 11)

## 1. Clone and install

```bash
git clone https://github.com/Shunnayka/sistema-SALES-S.A
cd sistema-SALES-S.A
npm install
```

This installs dependencies for every workspace (`packages/*`) in one step.

## 2. Create the database

```bash
psql -U postgres -h localhost -c "CREATE DATABASE sistema_sales;"
```

## 3. Configure environment variables

Three packages need their own `.env` file (each has a `.env.example` to copy from). None of
these files are committed to git.

**`packages/persistence/.env`**
```
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/sistema_sales?schema=public"
```

**`packages/api/.env`** (same `DATABASE_URL` as above, plus API-specific settings)
```
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/sistema_sales?schema=public"
JWT_SECRET="sistema-sales-dev-secret-change-in-production"
API_PORT=3000
ADMIN_USER="admin"
ADMIN_PASSWORD="admin1234"
```

**`packages/web/.env`** (no secrets, just the API location)
```
VITE_API_URL=http://localhost:3000
```

## 4. Build the domain core and persistence layer, run migrations and seed data

```bash
npm run build --workspace=@sistema-sales/core
npm run build --workspace=@sistema-sales/persistence

cd packages/persistence
npx prisma migrate dev
npx prisma db seed
cd ../..
```

`prisma migrate dev` applies two migrations: the initial schema (all 10 tables of the 3NF
model) and a second one adding the CHECK constraints from the data dictionary (see
`docs/cambios-documento.md` Nota 12). The seed script inserts the reference data described
in the "Seed data" section below.

## 5. Run the automated tests

```bash
npm run test --workspace=@sistema-sales/core         # 78 unit tests (entities, value objects, services)
npm run test --workspace=@sistema-sales/persistence  # 8 integration tests against the real database
```

## 6. Run the REST API

```bash
npm run build --workspace=@sistema-sales/api
npm run start --workspace=@sistema-sales/api
```

The API listens on `http://localhost:3000`. Swagger documentation is served at
`http://localhost:3000/docs`. Every endpoint except `POST /auth/login` requires a bearer
JWT token; obtain one with:

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin1234"}'
```

## 7. Run the web client

```bash
npm run build --workspace=@sistema-sales/web   # production build (packages/web/dist)
# or, for development with hot reload:
npm run dev --workspace=@sistema-sales/web     # http://localhost:5173
```

Log in with `admin` / `admin1234` (the same credentials as the API).

## 8. Run the desktop client (Electron)

The desktop app loads the same React app as the web client — see
`docs/cambios-documento.md` Nota 9 for why. Build the web app first (step 7), then:

```bash
npm run build --workspace=@sistema-sales/desktop
npm run start --workspace=@sistema-sales/desktop
```

For development with the Vite dev server instead of the static build:

```bash
npm run dev --workspace=@sistema-sales/web       # in one terminal
npm run dev --workspace=@sistema-sales/desktop   # in another terminal
```

To produce an installer, `packages/desktop` has an `electron-builder` configuration ready
(`npm run package --workspace=@sistema-sales/desktop`) — not generated in this delivery due
to the time constraint (Nota 10).

## 9. Run the mobile client (Expo)

The mobile client reads the API base URL from the `EXPO_PUBLIC_API_URL` environment
variable. If not set, it defaults to `http://localhost:3000`.

| Environment | Value |
|---|---|
| Expo Web (browser on the same machine) | `http://localhost:3000` (default) |
| iOS simulator | `http://localhost:3000` (default) |
| Android emulator | `http://10.0.2.2:3000` |
| Physical device (Expo Go) | `http://<your-machine's-LAN-IP>:3000` |

To start the mobile client:

```bash
cd packages/mobile
npm start
```

To override the default API URL, set the variable before starting Expo:

```bash
# PowerShell
$env:EXPO_PUBLIC_API_URL="http://10.0.2.2:3000"; npx expo start

# Bash / macOS / Linux
EXPO_PUBLIC_API_URL=http://10.0.2.2:3000 npx expo start
```

To run the mobile client in the browser (no emulator or physical device required):

```bash
npx expo install react-dom react-native-web @expo/metro-runtime
npx expo start --web   # opens http://localhost:8081
```
Log in with `admin` / `admin1234` (the same credentials as the API).

## Seed data

`packages/persistence/prisma/seed.ts` inserts:

- 3 distritos (Quito Norte, Quito Sur, Quito Centro)
- 2 clientes (one mayorista, one minorista)
- 2 proveedores
- 2 vendedores
- 5 productos with mixed stock levels (some above, some below their `stockMinimo`)
- 2 facturas with detalles (one pendiente, one cancelada)
- 2 órdenes de compra with detalles (one pendiente, one atendida)
- 3 abastecimientos (proveedor–producto–precio)

Re-running `npx prisma db seed` is safe — every record is upserted by its primary key.

## Architecture notes

- **Hexagonal core** (`packages/core`): pure TypeScript, zero framework dependencies. 9
  domain entities, 9 immutable ID value objects, 3 input ports, 3 output ports, 3
  application services (`VentaService`, `InventarioService`, `AbastecimientoService`).
- **Persistence** (`packages/persistence`): Prisma-backed adapters implementing the core's
  output ports, plus mapper classes that translate between domain Value Objects (including
  the composite `DetalleFacturaId`/`DetalleOrdenCompraId`) and Prisma's compound keys.
- **API** (`packages/api`): the `WebRestController` input adapter from the domain model.
  Producto/Factura/OrdenCompra route their business operations through the core's
  application services; Distrito/Cliente/Proveedor/Vendedor (which have no dedicated core
  ports in the original design) use Prisma directly for CRUD.
- **Desktop/Web/Mobile**: the `DesktopController`, `WebRestController`-facing web client,
  and `MobileController` input adapters, all consuming the same REST API.

Every deliberate deviation from the original academic document — version mismatches,
scope trade-offs made under the delivery deadline, and architectural clarifications — is
logged with its rationale in `docs/cambios-documento.md`.

## Conclusions

This implementation carries the hexagonal architecture from the academic document through
to a working, end-to-end system: a framework-free domain core that the REST API, desktop,
web and mobile clients all consume through the same ports, with automated tests covering
the domain layer (78 unit tests) and the persistence layer (8 integration tests against a
real PostgreSQL instance).

Under a same-day delivery deadline, three pragmatic decisions were made and documented
rather than silently absorbed: the desktop and web clients share one React codebase instead
of two independent UIs; JWT authentication uses a single environment-configured admin
credential rather than a full user-management module, since the domain model never defined
a `Usuario` entity; and the mobile app's two required modules (plus login and dashboard)
were verified through type-checking and a real Metro bundler export rather than on a
physical device or emulator, neither of which was available in the development environment.
None of these change the domain model, the database schema, or the REST contract — they are
scoped, reversible trade-offs that a future iteration can close out (a real user table with
hashed passwords, a generated desktop installer, an on-device mobile test pass) without
touching the architecture underneath.

The clearest sign the architecture held up under pressure: extending the REST API, then the
web client, then the Electron shell, then the mobile app, required no changes to
`packages/core` at all after Phase 1. Every new consumer was wired against the same ports.

## Recommendations

- Add a real `Usuario`/roles table before any non-academic use, replacing the single admin
  credential.
- Add NestJS-level tests (e2e with `@nestjs/testing` + Supertest) for the API layer, which
  currently relies on the core's unit tests, the persistence layer's integration tests, and
  manual endpoint verification.
- Run the mobile app on an actual device or emulator and capture screenshots for the defense.
- Generate the Electron installer (`npm run package --workspace=@sistema-sales/desktop`) ahead
  of the defense so a packaged build, not just `npm start`, can be demonstrated.

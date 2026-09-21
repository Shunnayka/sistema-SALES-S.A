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
a REST API, a desktop client, a web client and a mobile client.

## Tech Stack

- **Language:** TypeScript
- **REST API:** NestJS
- **Desktop:** Electron
- **Web:** React 18 + Vite
- **Mobile:** React Native + Expo
- **Database:** PostgreSQL 18
- **ORM:** Prisma 6
- **Monorepo:** npm workspaces
- **Testing:** Vitest

## Project Structure

```
sistema-sales/
├── packages/
│   ├── core/          # Hexagonal domain core (entities, ports, application services)
│   ├── persistence/    # Prisma schema, migrations and repository adapters
│   ├── api/             # NestJS REST API
│   ├── desktop/         # Electron desktop client
│   ├── web/              # React + Vite web client
│   └── mobile/            # React Native + Expo mobile client
└── docs/
    ├── diagrams/    # UML diagrams
    ├── sql/           # Database creation scripts
    └── manual/         # User manual
```

## Setup and Run Instructions

> This section will be completed progressively as each phase is implemented.

## Conclusions

> To be completed in Phase 7.

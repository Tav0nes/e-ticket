# e-ticket

  An internal Incident / Ticket Management system. A personal learning project that      
  mirrors
  the kind of tooling used by enterprise digital-transformation teams.

  ## Features (current)

  - **Ticket CRUD** — create, list, view, edit tickets with status (`OPEN`,
  `IN_PROGRESS`,
    `BLOCKED`, `RESOLVED`, `CLOSED`) and priority (`LOW`, `MEDIUM`, `HIGH`, `CRITICAL`)  
  - **Filter chips** on the list view for status and priority
  - **Comments** — append-only timeline per ticket
  - **Audit log** — automatic tracking of status and assignee changes via a TypeORM      
    subscriber (no audit calls in business logic)
  - **OpenAPI docs** — Swagger UI at `/api/docs`

  ## Stack

  | Layer     | Tech                                           |
  |-----------|------------------------------------------------|
  | Frontend  | Angular 21 (standalone components) + Material  |
  | Backend   | NestJS on Node.js 22                           |
  | Database  | PostgreSQL 16 via TypeORM                      |
  | Quality   | ESLint + Prettier + Jest                       |
  | Dev env   | Docker Compose (Postgres + backend)            |

  Authentication is planned for a later sprint (Keycloak / Auth0 / in-app JWT TBD).      

  ## Prerequisites

  - **Node.js 22+** and **npm 10+**
  - **Docker** (for Postgres, and optionally for the backend)

  ## Getting started

  ### 1. Clone and configure

  ```bash
  git clone https://github.com/<your-username>/e-ticket.git
  cd e-ticket
  cp .env.example .env

  The default .env values work out of the box for local dev.

  2. Start Postgres

  docker compose up -d postgres

  This starts Postgres on localhost:5432 with a persistent volume.

  3. Backend

  cd backend
  npm install
  npm run start:dev

  The API runs on http://localhost:3000.
  Swagger UI: http://localhost:3000/api/docs.

  4. Frontend

  In a second terminal:

  cd frontend
  npm install
  npx ng serve

  Open http://localhost:4200.

  Alternative: run the backend in Docker

  Instead of npm run start:dev, you can run the whole backend via Compose:

  docker compose up --build backend

  Project structure

  e-ticket/
  ├── backend/                 # NestJS API
  │   ├── src/
  │   │   ├── tickets/         # Ticket entity, CRUD, DTOs
  │   │   ├── comments/        # Comment entity, endpoints
  │   │   └── audit/           # Audit entity + TypeORM subscriber
  │   └── Dockerfile
  ├── frontend/                # Angular 21 SPA
  │   ├── src/app/features/
  │   │   ├── tickets/         # List, detail, form, edit
  │   │   ├── comments/        # Timeline component
  │   │   └── audit/           # Audit trail component
  │   └── Dockerfile
  ├── docker-compose.yml
  └── .env.example

  Running the tests

  cd backend
  npm test

  API overview

  ┌────────┬───────────────────────────┬─────────────────────────────────┐
  │ Method │         Endpoint          │           Description           │
  ├────────┼───────────────────────────┼─────────────────────────────────┤
  │ GET    │ /tickets                  │ List all tickets                │
  ├────────┼───────────────────────────┼─────────────────────────────────┤
  │ POST   │ /tickets                  │ Create a ticket                 │
  ├────────┼───────────────────────────┼─────────────────────────────────┤
  │ GET    │ /tickets/:id              │ Get a ticket                    │
  ├────────┼───────────────────────────┼─────────────────────────────────┤
  │ PATCH  │ /tickets/:id              │ Update a ticket (partial)       │
  ├────────┼───────────────────────────┼─────────────────────────────────┤
  │ DELETE │ /tickets/:id              │ Delete a ticket                 │
  ├────────┼───────────────────────────┼─────────────────────────────────┤
  │ GET    │ /comments?ticketId=<uuid> │ List comments for a ticket      │
  ├────────┼───────────────────────────┼─────────────────────────────────┤
  │ POST   │ /comments                 │ Add a comment                   │
  ├────────┼───────────────────────────┼─────────────────────────────────┤
  │ GET    │ /audit?ticketId=<uuid>    │ List audit entries for a ticket │
  └────────┴───────────────────────────┴─────────────────────────────────┘

  Roadmap

  - Sprint 4 — Authentication (Keycloak / Auth0 / in-app JWT)
  - Sprint 5 — Dashboard, admin page, polish

  License

  MIT.
# Phase 3: System Architecture & ERD

> **CRITICAL RULE:** This document is the blueprint for the Engineering Team. It must be finalized before any coding begins. It MUST include concrete Mermaid diagrams, field data types, external integration points, and version control strategies.

---

## 1. Technology Stack & Implementation Details
- **Frontend:** Next.js 14 (App Router) + React 18 + Tailwind CSS. Hosted on Vercel.
- **Backend:** FastAPI (Python 3.11). Hosted on Render / AWS ECS.
- **Database:** PostgreSQL (managed by Supabase) for relational data and Auth.
- **Storage:** Supabase Storage (S3-compatible) for image uploads.
- **Queue/Async:** Redis (Upstash) for simulating async generation jobs (and future AI worker integration).

## 2. System Architecture Diagram

```mermaid
graph TD
    A[Customer Web Client] -->|HTTPS / REST| B(Next.js App)
    A2[Brand Admin Portal] -->|HTTPS / REST| B
    B -->|API Calls| C(FastAPI Backend)
    B -->|Direct Upload/Auth| D(Supabase Auth & Storage)
    C -->|SQL / pg_bouncer| E[(Supabase PostgreSQL)]
    C -->|Simulate Delay| F[Mock Async Job Queue]
```

## 3. Database Entity Relationship Diagram (ERD)

```mermaid
erDiagram
    USERS {
        uuid id PK
        string email
        string role "admin, brand, customer"
        datetime created_at
    }
    BRANDS {
        uuid id PK
        uuid user_id FK
        string brand_name
        string website_url
        datetime created_at
    }
    CATALOG_ITEMS {
        uuid id PK
        uuid brand_id FK
        string item_name
        string category
        string image_url
        boolean is_active
    }
    GENERATIONS {
        uuid id PK
        uuid user_id FK
        uuid catalog_item_id FK
        string user_image_url
        string result_image_url
        string status "pending, processing, completed, failed"
        datetime created_at
    }

    USERS ||--o| BRANDS : "has profile"
    BRANDS ||--o{ CATALOG_ITEMS : "manages"
    USERS ||--o{ GENERATIONS : "requests"
    CATALOG_ITEMS ||--o{ GENERATIONS : "used in"
```

## 4. Core Tables Data Types
- **`users`**: Managed by Supabase Auth (`auth.users`).
- **`brands`**: `id` (UUID PK), `user_id` (UUID FK to `auth.users`), `brand_name` (VARCHAR 255), `website_url` (TEXT), `created_at` (TIMESTAMPZ).
- **`catalog_items`**: `id` (UUID PK), `brand_id` (UUID FK), `item_name` (VARCHAR 255), `category` (VARCHAR 100), `image_url` (TEXT), `is_active` (BOOLEAN DEFAULT TRUE).
- **`generations`**: `id` (UUID PK), `user_id` (UUID FK), `catalog_item_id` (UUID FK), `user_image_url` (TEXT), `result_image_url` (TEXT), `status` (VARCHAR 50), `created_at` (TIMESTAMPZ).

## 5. API Core Endpoints & Integrations
| Method | Endpoint | Description | Auth Required? |
|--------|----------|-------------|----------------|
| POST   | `/api/v1/catalog` | Add new item to catalog | Yes (Brand) |
| GET    | `/api/v1/catalog/{brand_id}` | List catalog items | No |
| POST   | `/api/v1/generate/request` | Submit try-on request | Yes (Customer) |
| GET    | `/api/v1/generate/status/{id}` | Poll generation status | Yes |

## 6. Integration Points & External APIs
- **Supabase API:** Authentication, PostgreSQL, Storage.
- **Future Integration (Plan 2):** Stripe API for brand subscriptions.

## 7. Scalability, Performance & Version Control
- **Version Control & CI/CD:** Git flow. `main` branch deployed to production automatically via Vercel GitHub integration. FastAPI deployed via Docker/Render.
- **Scalability Considerations:** Next.js handles high traffic via Edge caching. FastAPI scales horizontally. Supabase scales via connection pooling (pg_bouncer).

## 8. Detailed Security Mechanisms
- **SQL Injection Prevention:** Strict usage of SQLAlchemy ORM and Supabase Row Level Security (RLS) policies.
- **Data Protection:** Enforced TLS 1.3. User photos stored in secured Supabase buckets with strict CORS and access policies.
- **Authentication:** Supabase JWT tokens. Backend API verifies JWT signature before executing any catalog or generation mutations.

---
**Sign-off:**
- [x] Solution Architect (Antigravity)
- [x] Lead Developer
- [x] Client Approval

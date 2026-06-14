# Virtual Try-On SaaS Platform — Implementation Plan

## Overview

Build an enterprise-grade Virtual Try-On SaaS platform that enables clothing brands to let customers upload a photo and preview garments before purchasing. The system consists of a **Next.js web platform**, a **FastAPI backend**, an **AI try-on engine**, and an **embeddable widget (tryon-sdk.js)** for third-party stores.

This plan follows proper enterprise patterns observed in the reference SaaS app: layered architecture, comprehensive documentation (ADRs, API docs, Architecture docs, PRD, Deployment guide), CI/CD pipelines, database migrations, test infrastructure, monitoring, and analytics.

---

## Project Architecture

```
┌─────────────────────┐     ┌──────────────────────┐     ┌─────────────────────┐
│   Frontend (Web)    │────▶│   Backend (FastAPI)   │────▶│   PostgreSQL DB     │
│   Next.js + TW CSS  │     │   Python REST API     │     │   + Migrations      │
└─────────────────────┘     └──────────────────────┘     └─────────────────────┘
         │                           │                            │
         │                           ▼                            │
         │                  ┌──────────────────────┐              │
         │                  │   AI Engine Service   │              │
         │                  │   HR-VITON / PyTorch  │              │
         │                  │   MediaPipe Pose      │              │
         │                  └──────────────────────┘              │
         │                           │                            │
         ▼                           ▼                            ▼
┌─────────────────────┐     ┌──────────────────────┐     ┌─────────────────────┐
│   Admin Dashboard   │     │   Object Storage     │     │   Redis (Queue +    │
│   (React Web)       │     │   (S3 / MinIO)       │     │    Caching)         │
└─────────────────────┘     └──────────────────────┘     └─────────────────────┘
         │
         ▼
┌─────────────────────┐
│   Embeddable Widget │
│   tryon-sdk.js      │
└─────────────────────┘
```

---

## Proposed Folder Structure

```
tryon-system/
├── .github/
│   └── workflows/
│       ├── ci.yml                    # CI pipeline (lint, test, build)
│       └── deploy.yml                # Deployment pipeline
│
├── docs/
│   ├── ADR.md                        # Architecture Decision Records
│   ├── API.md                        # REST API documentation
│   ├── ARCHITECTURE.md               # System architecture documentation
│   └── DEPLOYMENT.md                 # Deployment & operations guide
│
├── instructions/
│   └── PRD.md                        # Product Requirements Document
│
├── frontend/                         # Next.js + Tailwind CSS
│   ├── public/
│   │   ├── favicon.ico
│   │   └── images/
│   ├── src/
│   │   ├── app/                      # Next.js App Router pages
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx              # Landing page (/)
│   │   │   ├── upload/
│   │   │   │   └── page.tsx          # Upload screen (/upload)
│   │   │   ├── catalog/
│   │   │   │   └── page.tsx          # Catalog screen (/catalog)
│   │   │   ├── result/
│   │   │   │   └── page.tsx          # Result screen (/result)
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx          # Brand dashboard (/dashboard)
│   │   │   ├── auth/
│   │   │   │   ├── login/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── register/
│   │   │   │       └── page.tsx
│   │   │   └── pricing/
│   │   │       └── page.tsx          # Pricing page (/pricing)
│   │   ├── components/
│   │   │   ├── ui/                   # Reusable UI primitives
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Input.tsx
│   │   │   │   ├── Card.tsx
│   │   │   │   ├── Modal.tsx
│   │   │   │   ├── Loader.tsx
│   │   │   │   └── Badge.tsx
│   │   │   ├── landing/              # Landing page components
│   │   │   │   ├── Hero.tsx
│   │   │   │   ├── Demo.tsx
│   │   │   │   ├── Features.tsx
│   │   │   │   ├── Pricing.tsx
│   │   │   │   └── Footer.tsx
│   │   │   ├── upload/               # Upload flow components
│   │   │   │   ├── DropZone.tsx
│   │   │   │   ├── ImagePreview.tsx
│   │   │   │   └── UploadProgress.tsx
│   │   │   ├── catalog/              # Catalog components
│   │   │   │   ├── ClothingGrid.tsx
│   │   │   │   ├── ClothingCard.tsx
│   │   │   │   └── Filters.tsx
│   │   │   ├── result/               # Result components
│   │   │   │   ├── ComparisonSlider.tsx
│   │   │   │   ├── ResultActions.tsx
│   │   │   │   └── GenerationProgress.tsx
│   │   │   └── dashboard/            # Brand dashboard components
│   │   │       ├── StatCard.tsx
│   │   │       ├── UsageChart.tsx
│   │   │       └── ApiKeyManager.tsx
│   │   ├── services/                 # API client layer
│   │   │   ├── api.ts                # Base API client (axios/fetch)
│   │   │   ├── auth.service.ts
│   │   │   ├── upload.service.ts
│   │   │   ├── catalog.service.ts
│   │   │   ├── generation.service.ts
│   │   │   └── dashboard.service.ts
│   │   ├── hooks/                    # Custom React hooks
│   │   │   ├── useAuth.ts
│   │   │   ├── useUpload.ts
│   │   │   ├── useCatalog.ts
│   │   │   ├── useGeneration.ts
│   │   │   └── useDashboard.ts
│   │   ├── types/                    # TypeScript type definitions
│   │   │   └── index.ts
│   │   ├── constants/                # App constants & config
│   │   │   └── index.ts
│   │   ├── utils/                    # Utility functions
│   │   │   ├── formatting.ts
│   │   │   └── validation.ts
│   │   └── config/                   # Configuration
│   │       └── api.ts
│   ├── .env.example
│   ├── next.config.js
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   └── package.json
│
├── backend/                          # FastAPI + Python
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py                   # FastAPI app entry point
│   │   ├── config.py                 # Settings / env vars
│   │   ├── api/
│   │   │   ├── __init__.py
│   │   │   ├── deps.py               # Dependency injection
│   │   │   └── v1/
│   │   │       ├── __init__.py
│   │   │       ├── router.py         # API router aggregator
│   │   │       ├── auth.py           # POST /auth/login, /auth/register
│   │   │       ├── upload.py         # POST /upload
│   │   │       ├── catalog.py        # GET /catalog, POST /catalog
│   │   │       ├── generate.py       # POST /generate, GET /generate/{id}
│   │   │       └── dashboard.py      # GET /dashboard/stats
│   │   ├── models/                   # SQLAlchemy ORM models
│   │   │   ├── __init__.py
│   │   │   ├── user.py
│   │   │   ├── clothing.py
│   │   │   ├── generation.py
│   │   │   └── api_key.py
│   │   ├── schemas/                  # Pydantic request/response schemas
│   │   │   ├── __init__.py
│   │   │   ├── user.py
│   │   │   ├── clothing.py
│   │   │   ├── generation.py
│   │   │   └── dashboard.py
│   │   ├── services/                 # Business logic layer
│   │   │   ├── __init__.py
│   │   │   ├── auth_service.py
│   │   │   ├── upload_service.py
│   │   │   ├── catalog_service.py
│   │   │   ├── generation_service.py
│   │   │   └── storage_service.py
│   │   ├── core/                     # Core infrastructure
│   │   │   ├── __init__.py
│   │   │   ├── security.py           # JWT, hashing, API key validation
│   │   │   ├── database.py           # DB session management
│   │   │   └── queue.py              # Redis task queue
│   │   └── utils/
│   │       ├── __init__.py
│   │       ├── image_processing.py   # Resize, validate, compress
│   │       └── validators.py
│   ├── alembic/                      # Database migrations
│   │   ├── env.py
│   │   ├── alembic.ini
│   │   └── versions/
│   │       └── 001_initial_schema.py
│   ├── tests/
│   │   ├── __init__.py
│   │   ├── conftest.py
│   │   ├── test_auth.py
│   │   ├── test_upload.py
│   │   ├── test_catalog.py
│   │   └── test_generation.py
│   ├── .env.example
│   ├── requirements.txt
│   ├── Dockerfile
│   └── pyproject.toml
│
├── ai-engine/                        # AI Virtual Try-On Engine
│   ├── engine/
│   │   ├── __init__.py
│   │   ├── pipeline.py               # Main try-on pipeline orchestrator
│   │   ├── body_detection.py         # MediaPipe Pose detection
│   │   ├── pose_estimation.py        # Keypoint extraction
│   │   ├── clothing_extraction.py    # Garment parsing/segmentation
│   │   ├── warping.py                # Clothing warping (TPS/flow)
│   │   └── rendering.py             # Final composite rendering
│   ├── models/                       # Pre-trained model weights (git-lfs)
│   │   └── .gitkeep
│   ├── tests/
│   │   ├── __init__.py
│   │   ├── test_pipeline.py
│   │   └── test_body_detection.py
│   ├── requirements.txt
│   ├── Dockerfile
│   └── README.md
│
├── widget/                           # Embeddable tryon-sdk.js
│   ├── src/
│   │   ├── index.ts                  # SDK entry point
│   │   ├── widget.ts                 # Widget UI rendering
│   │   ├── api.ts                    # API communication
│   │   ├── styles.ts                 # Injected CSS
│   │   └── types.ts
│   ├── examples/
│   │   └── demo-store.html           # Example integration
│   ├── rollup.config.js              # Bundle config
│   ├── tsconfig.json
│   ├── package.json
│   └── README.md
│
├── admin-panel/                      # Web admin dashboard
│   ├── src/
│   │   ├── index.html
│   │   ├── dashboard.js
│   │   └── styles.css
│   └── README.md
│
├── infrastructure/
│   ├── docker-compose.yml            # Local development stack
│   ├── docker-compose.prod.yml       # Production stack
│   └── nginx.conf                    # Reverse proxy config
│
├── scripts/
│   ├── seed-data.py                  # Database seeding script
│   ├── generate-types.sh             # Auto-gen TS types from API
│   └── setup-dev.sh                  # One-command dev setup
│
├── monitoring/
│   └── health-check.py               # Service health checks
│
├── analytics/
│   └── analytics-config.ts           # Event tracking configuration
│
├── .gitignore
├── .env.example
├── CHANGELOG.md
├── CONTRIBUTING.md
├── LICENSE
├── PRIVACY_POLICY.md
├── TERMS_OF_SERVICE.md
├── README.md
└── plan.md                           # Original plan (existing)
```

---

## Phased Execution Plan

### 🟢 Phase 1 — Foundation & Documentation (Current Sprint)

**Goal**: Set up the project skeleton, all documentation, folder structure, CI/CD, and configuration files. No application code yet — just the foundation.

#### Files to Create

##### Root-level Documentation
- **[NEW] README.md** — Project overview, architecture diagram, getting started, tech stack
- **[NEW] CONTRIBUTING.md** — Code of conduct, PR process, commit conventions, coding standards
- **[NEW] CHANGELOG.md** — Initial version entry
- **[NEW] LICENSE** — MIT License
- **[NEW] PRIVACY_POLICY.md** — Data handling for user photos, garment data, SaaS terms
- **[NEW] TERMS_OF_SERVICE.md** — SaaS usage terms, subscription tiers, data ownership
- **[NEW] .gitignore** — Node, Python, IDE, env, build artifacts
- **[NEW] .env.example** — All environment variable templates

##### Documentation Directory
- **[NEW] docs/ADR.md** — Architecture Decision Records:
  - ADR-001: Frontend Framework (Next.js + Tailwind CSS)
  - ADR-002: Backend Framework (FastAPI + Python)
  - ADR-003: Database (PostgreSQL + Alembic migrations)
  - ADR-004: AI Engine (HR-VITON + MediaPipe)
  - ADR-005: Object Storage (S3-compatible / MinIO)
  - ADR-006: Task Queue (Redis + Celery/RQ)
  - ADR-007: Widget Architecture (Vanilla JS bundle)
  - ADR-008: Authentication (JWT + API Keys for brands)
- **[NEW] docs/API.md** — Full REST API specification for all endpoints
- **[NEW] docs/ARCHITECTURE.md** — System overview, data flow, security, deployment topology
- **[NEW] docs/DEPLOYMENT.md** — Environment setup, Docker, CI/CD, rollback procedures

##### Product Requirements
- **[NEW] instructions/PRD.md** — Complete PRD adapted from plan.md with detailed feature specs

##### CI/CD
- **[NEW] .github/workflows/ci.yml** — Lint, type-check, test (frontend + backend + AI engine)
- **[NEW] .github/workflows/deploy.yml** — Staged deployment pipeline

##### Infrastructure
- **[NEW] infrastructure/docker-compose.yml** — PostgreSQL, Redis, MinIO, Backend, AI Engine
- **[NEW] infrastructure/nginx.conf** — Reverse proxy for API, frontend, admin

##### Scripts & Monitoring
- **[NEW] scripts/setup-dev.sh** — One-command developer environment setup
- **[NEW] monitoring/health-check.py** — Health check for all services
- **[NEW] analytics/analytics-config.ts** — Event tracking configuration

---

### 🔵 Phase 2 — Frontend Development (After Phase 1 approval)

**Goal**: Build the complete Next.js frontend with all pages, components, and mock data.

#### Components
- Initialize Next.js project with Tailwind CSS and TypeScript
- Create design system (colors, typography, spacing, components)
- Build all pages: Landing, Upload, Catalog, Result, Auth, Dashboard, Pricing
- Build all reusable components (Button, Input, Card, Modal, etc.)
- Create service layer (API clients with mock responses)
- Create custom hooks (useAuth, useUpload, useCatalog, useGeneration)
- Create type definitions and constants
- Add utility functions (formatting, validation)

> [!IMPORTANT]
> Frontend will work entirely with **mock data** during this phase. Real API integration happens in Phase 4.

---

### 🟡 Phase 3 — Backend Infrastructure (After Phase 2)

**Goal**: Build the complete FastAPI backend with database, auth, and file storage.

#### Components
- Initialize FastAPI project with proper structure
- Set up SQLAlchemy ORM models (Users, Clothing, Generations, ApiKeys)
- Create Alembic migration (initial schema)
- Implement Pydantic schemas for request/response validation
- Build all API endpoints (auth, upload, catalog, generate, dashboard)
- Implement JWT authentication + API key system for brands
- Set up file upload to S3-compatible storage
- Create Redis queue integration for async generation jobs
- Write unit tests with pytest
- Create seed data script

---

### 🟠 Phase 4 — Frontend-Backend Integration (After Phase 3)

**Goal**: Connect frontend to live backend, replace mock data.

#### Components
- Update frontend service layer to use real API endpoints
- Implement authentication flow (login, register, session management)
- Wire up file upload with progress tracking
- Connect catalog browsing to real data
- Implement generation polling/WebSocket for real-time progress
- Add error handling and loading states
- End-to-end integration testing

---

### 🔴 Phase 5 — AI Virtual Try-On Engine (After Phase 4)

**Goal**: Build the AI pipeline that generates realistic try-on previews.

#### Components
- Set up PyTorch + OpenCV environment with Docker
- Implement body detection (MediaPipe Pose)
- Implement pose estimation and keypoint extraction
- Implement clothing segmentation/extraction
- Implement garment warping (Thin-Plate Spline or flow-based)
- Implement final rendering/compositing
- Create orchestrator pipeline (input → output)
- Connect to backend via Redis queue
- Write tests for each pipeline stage
- Performance benchmarking (target: <15 seconds)

> [!WARNING]
> This phase requires **GPU infrastructure** for model inference. Ensure CUDA-compatible Docker setup or cloud GPU access (e.g., AWS EC2 with GPU, Google Cloud GPU, or RunPod).

---

### 🟣 Phase 6 — Performance & Optimization (After Phase 5)

**Goal**: Optimize generation speed, caching, and user experience.

#### Components
- Image compression before processing
- Redis result caching (repeat generations)
- Queue prioritization and concurrency limits
- Frontend optimistic UI updates
- Progressive image loading
- CDN configuration for static assets

**Target**: <10 seconds generation time

---

### ⚫ Phase 7 — Embeddable Widget (After Phase 6)

**Goal**: Build tryon-sdk.js for third-party store integration.

#### Components
- TypeScript SDK with Rollup bundling
- Widget UI (iframe-based or shadow DOM)
- API communication module
- CSS injection (scoped styles)
- Demo store HTML example
- Installation documentation

**Target**: <30 minutes integration time

---

### ⬛ Phase 8 — Testing & Admin Panel (After Phase 7)

**Goal**: Comprehensive testing and admin dashboard.

#### Components
- End-to-end test suite (various photos, clothing types, edge cases)
- Load testing with artillery/k6
- Admin panel for brand management, usage monitoring, analytics
- Error reporting and monitoring integration

---

## User Review Required

> [!IMPORTANT]
> **Tech Stack Confirmation**: The plan uses **Next.js + Tailwind CSS** (as specified in your plan.md) for frontend and **FastAPI + Python** for backend. Please confirm these choices, or specify alternatives.

> [!IMPORTANT]
> **Database Choice**: Plan specifies PostgreSQL. The reference app uses Supabase (hosted PostgreSQL). Would you prefer:
> - **Self-hosted PostgreSQL** with Docker (more control, no vendor lock-in)
> - **Supabase** as BaaS (faster setup, built-in auth, real-time, RLS)

> [!IMPORTANT]
> **Object Storage**: For storing user photos and generated results, would you prefer:
> - **MinIO** (self-hosted, S3-compatible, free)
> - **AWS S3** (managed, pay-per-use)
> - **Supabase Storage** (if using Supabase)

> [!IMPORTANT]
> **AI Model**: The plan specifies HR-VITON. This is a research model requiring GPU. Are you comfortable with:
> - Setting up local GPU development
> - Using a cloud GPU service (RunPod, AWS, etc.)
> - Starting with a simpler placeholder (e.g., basic image overlay) and upgrading later

## Open Questions

> [!IMPORTANT]
> 1. **Deployment Target**: Where do you plan to deploy? (Vercel for frontend, Railway/Render for backend, or all-Docker on a VPS?)
> 2. **Domain**: Do you have a domain name ready for the platform?
> 3. **Branding**: Do you have a brand name, logo, and color scheme, or should I design one?
> 4. **SaaS Pricing Tiers**: What pricing model do you envision? (Free tier + paid plans? Per-generation pricing?)
> 5. **Shall I proceed with Phase 1 (Foundation & Documentation) first?**

---

## Verification Plan

### Automated Tests
- **Frontend**: `npm run lint`, `npm run type-check`, `npm test`
- **Backend**: `pytest --cov=app tests/`
- **AI Engine**: `pytest tests/`
- **Widget**: `npm run build` (bundle verification)

### Manual Verification
- Docker Compose stack starts cleanly
- All pages render correctly in browser
- API endpoints return expected responses via Postman/Thunder Client
- Full user flow: Upload photo → Select clothing → Generate preview → View result
- Widget embeds correctly in a demo HTML page

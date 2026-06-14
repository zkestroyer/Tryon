# Virtual Try-On SaaS Platform — Implementation Plan

## Overview

Build an enterprise-grade Virtual Try-On SaaS platform that enables clothing brands to let customers preview garments. The system is designed with an **API-First, Mobile-Ready Architecture** to seamlessly support both the initial web platform and the future mobile application.

Development will follow an **Agile Methodology**, delivering functional value in iterative Sprints. This ensures we can validate the core AI technology early and adapt quickly based on real-world feedback, avoiding the pitfalls of a rigid waterfall process.

---

## Architecture: Mobile-Ready & Event-Driven

To support a future mobile app, the system must be completely decoupled. The frontend (Web/Mobile) should be "dumb," simply displaying data and sending requests to the central brain (the API).

```
┌─────────────────────┐     ┌──────────────────────┐     ┌─────────────────────┐
│   Web (Next.js)     │────▶│                      │    ╱│   PostgreSQL DB     │
├─────────────────────┤     │   API Gateway        │───▶ │   (Supabase)        │
│   Mobile (React     │────▶│   (FastAPI)          │    ╲└─────────────────────┘
│   Native - Future)  │     │                      │     
└─────────────────────┘     └──────────────────────┘     ┌─────────────────────┐
                                     │                   │   Object Storage    │
                                     ▼                   │   (Images/Results)  │
                            ┌──────────────────────┐     └─────────────────────┘
                            │   Redis Task Queue   │
                            └──────────────────────┘
                                     │
                                     ▼
                            ┌──────────────────────┐
                            │   AI GPU Workers     │
                            │   (Python / PyTorch) │
                            └──────────────────────┘
```

**Why this is perfect for your future mobile app:**
1. **API First:** The Next.js web app and future React Native mobile app will consume the exact same FastAPI endpoints.
2. **React Ecosystem:** Since Next.js and React Native both use React, we can share state management patterns, custom hooks, and utility functions across both codebases.

---

## Agile Sprint Plan

Instead of waiting 8 weeks for a finished product, we will deliver vertical slices of functionality every sprint.

### 🏃 Sprint 1: Foundation & The "Hello World" AI Pipe
**Goal**: Validate the core technology immediately before building complex UIs.
- Setup FastAPI backend and Supabase database.
- Create simple Python worker listening to a Redis queue.
- Implement a basic API endpoint: POST an image + garment -> get a placeholder/basic merged image back.
- **Value Delivered**: A working API that processes asynchronous AI jobs.

### 🏃 Sprint 2: Web MVP & User Auth
**Goal**: A usable interface for the Try-On feature.
- Setup Next.js web frontend with Tailwind CSS.
- Implement Supabase Authentication (login/register).
- Build the core Upload UI: User uploads photo -> waits for AI generation -> sees result.
- **Value Delivered**: Internal team can visually test the Try-On feature on the web.

### 🏃 Sprint 3: The AI Engine (Deep Dive)
**Goal**: Make the Try-On realistic.
- Setup GPU environment.
- Integrate MediaPipe Pose and the HR-VITON model into the AI workers.
- Tune the pipeline for garment extraction and warping.
- **Value Delivered**: High-quality, realistic Try-On generations.

### 🏃 Sprint 4: Brand Catalog & Dashboard
**Goal**: Multi-tenant features for brands.
- Build the Brand Admin Dashboard.
- Allow brands to upload and manage their clothing catalog.
- Track usage analytics (how many generations performed).
- **Value Delivered**: Brands can onboard and start adding their clothes.

### 🏃 Sprint 5: The Embeddable Widget
**Goal**: Third-party integration.
- Build `tryon-sdk.js`.
- Allow a Shopify/WooCommerce store to embed our "Try On" button.
- Button opens a modal overlay hitting our API.
- **Value Delivered**: Ready for external pilot testing with real clothing stores.

### 🏃 Sprint 6: Mobile App MVP (Future)
**Goal**: Native mobile experience.
- Spin up Expo React Native app (just like the reference `mobile-repair-app`).
- Connect to existing Supabase Auth and FastAPI backend.
- Reuse hooks and logic from the Next.js web app.

---

## Proposed Folder Structure

```
tryon-system/
├── .github/ workflows/       # CI/CD pipelines
├── docs/                     # ADRs, API specs, Architecture
├── frontend-web/             # Next.js + Tailwind (Current focus)
├── backend-api/              # FastAPI + Supabase integration
├── ai-workers/               # PyTorch + Redis queue listeners
├── widget-sdk/               # Embeddable vanilla JS widget
├── infrastructure/           # Docker compose, Nginx
└── frontend-mobile/          # React Native/Expo (Future Sprint)
```

---

## User Review Required

> [!IMPORTANT]
> **Tech Stack Confirmation**: 
> - **Web**: Next.js + Tailwind CSS
> - **Backend API**: FastAPI (Python)
> - **Database & Auth**: Supabase
> - **AI Engine**: PyTorch + Redis Workers
> Please confirm if you approve of this stack.

## Open Questions

> [!TIP]
> 1. Do you have a domain name or brand name chosen for the platform yet?
> 2. Are you ready to approve this Agile Plan so we can immediately begin **Sprint 1: Foundation & API Setup**?

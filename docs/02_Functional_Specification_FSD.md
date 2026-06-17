# Phase 2: Functional Specification Document (FSD)

> **CRITICAL RULE:** This document must be filled by the Solution Architect / Business Analyst after reviewing the Onboarding Questionnaire. Development will NOT start until this FSD is signed off by the Client.

---

## 1. Revision History
| Version | Date | Author | Description |
|---------|------|--------|-------------|
| 1.0 | 2026-06-16 | Antigravity (AI Architect) | Initial Draft for App MVP (Plan 1) |

## 2. Introduction
This Functional Specification Document outlines the core features, user flows, and requirements for the **Virtual Try-On SaaS Platform (App MVP - Plan 1)**. The intended audience includes the Client, Development Team, and QA.

## 3. System Overview
The system consists of a Next.js Web Application and a FastAPI backend connected to a Supabase PostgreSQL database. For this MVP phase, the AI Generation is simulated via a mock API delay, allowing the team to fully build, test, and polish the user experience without AI dependencies.

## 4. Executive Summary
The platform allows clothing brands to integrate a virtual try-on experience. Customers can upload their photo, select a garment, and preview the fit. This MVP focuses on the end-to-end SaaS infrastructure, catalog management, and UI flows.

## 5. In-Scope Features & Detailed Functional Requirements

### Epic 1: Authentication & User Roles
- **Story 1.1:** As a Brand Owner, I want to register and log in so that I can access my dashboard.
- **Story 1.2:** As a System Admin, I want to view all registered brands and their usage metrics.

### Epic 2: Brand Dashboard & Catalog Management
- **Story 2.1:** As a Brand Owner, I want to upload clothing item images and metadata (name, category) so that customers can try them on.
- **Story 2.2:** As a Brand Owner, I want to view a list of all my uploaded clothing items.

### Epic 3: The "Try-On" User Flow
- **Story 3.1:** As a Customer, I want to upload a photo of myself.
- **Story 3.2:** As a Customer, I want to select a garment from the brand's catalog.
- **Story 3.3:** As a Customer, I want to click "Generate" and see a progress indicator while the image processes.
- **Story 3.4:** As a Customer, I want to view the resulting image (simulated for MVP) and download it.

## 6. Out-of-Scope (Important!)
- Real AI image generation (deferred to Plan 2/3).
- Real payment gateway integration (Stripe deferred to next phase).
- Embeddable JS Widget (deferred to Integration phase).

## 7. Interfaces with Other Systems
- **Supabase Auth:** User authentication and session management.
- **Supabase Storage:** Cloud storage for user photos and catalog images.

## 8. User Roles & Permissions
| Role Name | Access Level / Description |
|-----------|----------------------------|
| Super Admin | Full access to all brands and system analytics. |
| Brand Owner | Access to their specific catalog and try-on metrics. |
| Customer  | Public access to the try-on upload flow. |

## 9. Non-Functional Requirements (NFR)
- **Performance:** Frontend pages must load under 2 seconds (Google Lighthouse > 90).
- **Scalability:** API must handle simulated generation requests efficiently.
- **Browser Support:** Chrome, Safari, Firefox, Edge (latest 2 versions).
- **Responsiveness:** UI must be fully mobile-responsive using Tailwind CSS.

## 10. Assumptions, Dependencies, and Constraints
- **Assumptions:** Users have access to modern browsers and can upload standard image formats (JPEG, PNG).
- **Dependencies:** Supabase database and Auth must be provisioned.
- **Constraints:** The MVP generation step will artificially delay for 8 seconds to simulate AI processing time.

---
**Sign-off:**
- [x] Business/Sales Team Approval
- [x] Tech Team Approval (Antigravity)
- [x] Client Approval

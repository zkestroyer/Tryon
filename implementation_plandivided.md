# Virtual Try-On SaaS — Triple Track Implementation Plan

Based on your team's strategy, we have split the project into **3 distinct, executable plans**. This allows your Web/App Developers and your AI Engineers to work in parallel without blocking each other.

---

## 📱 Plan 1: App MVP (Without AI Model)
**Goal:** Build the complete SaaS platform, user flows, and database. Simulate the AI generation so the app is 100% feature-complete and testable from a UX perspective.
**Team:** Web/App Developers

### 1. Core Infrastructure
- **Tech Stack:** Next.js (Frontend) + FastAPI (Backend) + Supabase (Database/Auth).
- Set up Supabase PostgreSQL tables: `Users`, `Brands`, `Catalog`, `Generations`.
- Implement user authentication (Brand login vs. Customer usage).

### 2. Catalog & Dashboard
- Build the Brand Dashboard where brands can upload their clothing catalog.
- Build the frontend grid to display the catalog to end-users.

### 3. The "Mock" Try-On Flow
- Build the user upload screen (Photo upload with drag-and-drop).
- **The Mock API:** When a user hits "Generate", the Next.js frontend calls the FastAPI backend. Instead of running an AI model, the API sleeps for 8 seconds (to simulate processing) and returns a pre-saved "dummy" image or a basic 2D overlay.
- Build the loading states, progress indicators, and the final Result Screen with "Download" or "Buy Now" buttons.

**Deliverable:** A fully clickable, functioning SaaS app that feels real but uses fake generation data.

---

## 🧠 Plan 3: AI Engine Development (Standalone)
**Goal:** Take an existing state-of-the-art open-source model, isolate the gaps you identified (realism, material integrity, body type adjustment), and build a superior custom pipeline.
**Team:** AI/ML Engineers

### 1. Base Model Selection & Setup
- Instead of HR-VITON, start with newer diffusion-based models like **IDM-VTON** or **OOTDiffusion**. These natively handle lighting and shadows much better than older GANs.
- Set up an isolated Python/PyTorch environment with a simple Gradio or FastAPI interface for rapid testing.

### 2. Gap 1: Body Type Adjustment
- **Problem:** Existing models often stretch clothes unnaturally or fail on non-standard body types.
- **Solution:** Integrate **DensePose** or **SMPL (Skinned Multi-Person Linear Model)** into the preprocessing pipeline. By generating a 3D mesh representation of the user's body first, the model understands the physical volume and shape of the user, allowing it to warp the clothing accurately around their specific body type rather than a flat 2D mask.

### 3. Gap 2: Material Integrity & Folds
- **Problem:** Silk looks like cotton; denim loses its rigidity; folds don't match the body's posture.
- **Solution:** Implement a **Normal Map / Depth Map** conditioning layer. By extracting the normal map of the original garment, the diffusion model can be guided to retain the structural ridges (folds) of the fabric. Additionally, fine-tune the model on a specialized dataset containing high-variance fabrics (e.g., DressCode dataset paired with material tags).

### 4. Standalone Output
- Wrap the improved model in a dedicated Docker container that exposes a single endpoint: `POST /generate` (accepts user image + garment image -> returns result image).

**Deliverable:** A standalone, highly accurate AI service running on a GPU that produces the best possible try-on images.

---

## 🔗 Plan 2: Integration & Scale (With Trained Model)
**Goal:** Merge the App MVP (Plan 1) with the finalized AI Engine (Plan 3) for the production launch.
**Team:** Full-Stack & DevOps

### 1. Async GPU Queue System
- The Web API (from Plan 1) can no longer just "sleep". It must now send the generation job to a **Redis Task Queue**.
- The AI Engine (from Plan 3) acts as a worker, pulling jobs from Redis, processing them on the GPU, and saving the result to Object Storage (AWS S3 / Supabase Storage).

### 2. Real-Time Web Updates
- Implement WebSockets or Supabase Realtime. When the AI worker finishes the image, it updates the database status to `completed`. The Next.js frontend instantly receives this event and reveals the actual image to the user.

### 3. The Embeddable Widget (tryon-sdk.js)
- Now that the core system works, build the JavaScript SDK.
- Allow third-party brands (e.g., Shopify stores) to drop a `<script>` tag on their site, which opens our app's Try-On flow in an iframe/modal, hits our real AI queue, and returns the result.

### 4. Production Deployment
- Deploy the Web App to Vercel/Railway.
- Deploy the AI Workers to a scalable GPU cloud provider (e.g., RunPod, AWS EC2 G4 instances, or Modal).

**Deliverable:** The final, production-ready Virtual Try-On SaaS platform.

---

## User Review Required

> [!IMPORTANT]
> **Open Source Base Model:** I proposed starting with **IDM-VTON** or **OOTDiffusion** rather than older models, as they use diffusion to create much better realism. Are your AI devs open to using these as the base?

> [!IMPORTANT]
> **AI Enhancements:** Using 3D body estimation (DensePose/SMPL) and texture conditioning (Normal Maps) is the standard way to fix the body type and material fold issues. This will require some dedicated ML engineering. Do your devs have access to a GPU environment (e.g., RTX 3090/4090 or cloud GPU) to begin testing this immediately for Plan 3?

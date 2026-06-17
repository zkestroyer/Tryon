# Digital Couture: AI Virtual Try-On Platform

Digital Couture is a Next-Generation AI Virtual Fitting Room SaaS platform. It allows users to upload a photo of themselves, select a garment from a curated catalog, and instantly see a highly realistic rendering of themselves wearing the selected item.

This repository currently contains **Plan 1 (The MVP)**, which establishes the foundational web architecture, user experience, and backend API connections, using a simulated mock AI engine for demonstration purposes.

## Architecture
- **Frontend:** Next.js 14 (App Router), Tailwind CSS, Framer Motion, TypeScript.
- **Backend:** Python Flask API. (Currently simulating PyTorch/DensePose inference).
- **Database:** Supabase PostgreSQL (Schema available in `backend/schema.sql`).

---

## 🚀 How to Run the Application

To run the application locally, you need to start both the Backend API and the Frontend Server in two separate terminal windows.

### 1. Start the Backend (Flask API)
The backend handles the (mocked) AI generation requests.

1. Open a terminal and navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Activate the Python Virtual Environment:
   - On Windows:
     ```bash
     .\venv\Scripts\activate
     ```
   - On Mac/Linux:
     ```bash
     source venv/bin/activate
     ```
3. Install dependencies (if you haven't already):
   ```bash
   pip install -r requirements.txt
   ```
4. Start the server:
   ```bash
   python main.py
   ```
   *The backend should now be running on `http://localhost:8000`.*

### 2. Start the Frontend (Next.js)
The frontend serves the user interface.

1. Open a **new, separate** terminal and navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   *The frontend should now be accessible at `http://localhost:3000`.*

---

## 🎭 Running the "Golden Path" Pitch Demo

For investor pitches and live demonstrations, the MVP has been configured with a flawless "Golden Path". This ensures the application returns a stunning, pre-generated photorealistic result instead of a mock placeholder.

**Demo Instructions:**
1. Ensure both servers are running.
2. Locate the demo model image at `frontend/public/assets/model.png` (Feel free to copy this to your Desktop for easy access during the pitch).
3. Open `http://localhost:3000` in your browser.
4. Drag and drop `model.png` into the **Upload Photo** zone.
5. In the **Pick a Style** catalog, select the **Leather Biker Jacket** (Item 01).
6. Click **Show Me The Fit!**.
7. *Talking Point:* While the 8-second loading spinner runs, explain that the AI is running DensePose analysis to map body structure and rendering realistic material physics.
8. After 8 seconds, the application will automatically reveal the stunning, pre-rendered image of the model wearing the leather jacket.

---

## Enterprise Governance Documentation
Full architectural blueprints, functional specifications, and phase gate sign-offs can be found in the `/docs` directory (in both Markdown and HTML formats) per company SOPs.

# AIRWISE AI — Architecture & Implementation Plan

**"Breathe smarter. Live better."**

---

### 1. Executive Product Vision & Identity
AirWise AI is an international-grade, climate-tech urban air intelligence platform designed to help families, students, working professionals, athletes, and seniors make informed daily decisions during severe smog and urban pollution.

#### Design Philosophy: Swiss Editorial meets Climate Minimalism
- **Visuals:** Oversized editorial typography, asymmetric layout grids, generous whitespace, natural earthy palette (Warm Cream, Sage, Forest Green, Electric Lime, Sky Blue, Deep Charcoal).
- **No generic AI tropes:** Zero cyberpunk neon, zero purple-pink gradients, zero clunky cards, zero emoji icons. Everything utilizes Lucide React icons, precise typography hierarchy, and data-rich visualizations.

---

### 2. Design System Tokens
| Role | Hex | Tailwind Utility | Purpose |
| :--- | :--- | :--- | :--- |
| **Primary Background** | `#F7F7F2` | `bg-warm-ivory` / `bg-[#F7F7F2]` | Page canvas, soft natural paper feel |
| **Primary Text** | `#20221F` | `text-charcoal` / `text-[#20221F]` | Deep editorial ink contrast |
| **Secondary Background** | `#E7EDE3` | `bg-sage-light` / `bg-[#E7EDE3]` | Section bands, active states, chip bg |
| **Accent** | `#C5F36B` | `bg-electric-lime` / `bg-[#C5F36B]` | Primary CTAs, high-priority highlights, tags |
| **Secondary Accent** | `#496B50` | `bg-forest-muted` / `bg-[#496B50]` | Deep environmental green for data & headers |
| **Supporting Color** | `#DCEAF0` | `bg-sky-soft` / `bg-[#DCEAF0]` | Atmospheric cards, humidity & weather info |
| **Card Surface** | `#FFFFFF` | `bg-white` | Elevated data cards with subtle borders |

#### Typography System
- **Headings:** `Space Grotesk` (700, 600, 500) — Distinctive, bold, editorial.
- **Body & Controls:** `DM Sans` (400, 500, 700) — Ultra-clean legibility.
- **Large Metrics / AQI:** `Manrope` (800, 700) — Strong numerical presentation.
- **Technical & Metadata:** `IBM Plex Mono` (400, 500) — Timestamps, coordinates, PM measurements.

---

### 3. Application Map & Features
- **Public Landing Page:** Editorial hero with live search & preview, How it works, Key features, AI preview, Pollution awareness, Environmental impact, Footer.
- **Authenticated Dashboard:** Real-time AQI Gauge, Pollutants breakdown, 24h trend & 7-day forecast, time-of-day greeting, vulnerability persona switcher.
- **AI Air Assistant:** Gemini AI integration with heuristic fallback, contextual health advisory, quick prompt accelerators.
- **Smart Daily Routine Planner:** Time-slotted recommendations, activity safety indicator, save & check-off system.
- **Indoor Air Quality Guide:** Window-opening advisor based on outdoor AQI, HEPA CADR calculator, interactive room-by-room checklist.
- **Eco-Friendly Commute & Impact:** Low-exposure route & commute planner, transparent CO2 savings model, personal clean air impact tracker.
- **Global AQI & Monitoring Map:** Interactive map with real AQI markers, location comparison, pollutant details.
- **User Profile & Settings:** Auth, preferences (lifestyle, household, commute), saved recommendations, history, privacy.

---

### 4. Technical Architecture
- **Frontend:** React 18 / 19 + TypeScript + Vite + Tailwind CSS + Framer Motion + Recharts + Leaflet + Lucide React.
- **Backend:** Java 21 + Spring Boot 3.3.x + Spring Security + JWT + Spring Data JPA + Bean Validation + Flyway + Swagger/OpenAPI 3.
- **Database:** PostgreSQL (with H2 switch for instant local verification & unit testing).
- **Real-Time Data Integration:** Real Global Air Quality API (Open-Meteo Air Quality Global API) delivering live PM2.5, PM10, NO2, O3, SO2, CO, and AQI for any coordinate or city worldwide; Global Geocoding API; Gemini API for AI.
- **Testing:** Vitest & React Testing Library (frontend) + JUnit 5, Mockito & MockMvc (backend).
- **Deployment:** Dockerfile for Backend, Dockerfile for Frontend, and unified Docker Compose configuration.

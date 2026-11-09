================================================================================
         Agro – FRONTEND COMPLETE DOCUMENTATION
    Intelligent Farm Operations Platform with Smart Agro Precision System
================================================================================

--------------------------------------------------------------------------------
1. HOW TO RUN THE FRONTEND
--------------------------------------------------------------------------------

REQUIREMENTS:
  - Node.js v18 or higher
  - npm v9 or higher
  - Backend Spring Boot running on http://localhost:8080

STEPS:
  1. Open terminal and navigate to the FrontEnd folder:
       cd FrontEnd

  2. Install dependencies (first time only):
       npm install

  3. Start the development server:
       npm run dev

  4. Open browser at:
       http://localhost:5173  (or whatever port Vite assigns)

OTHER COMMANDS:
  npm run build     → Build for production (outputs to /dist)
  npm run preview   → Preview the production build locally
  npm run lint      → Run oxlint linter

IMPORTANT:
  The backend MUST be running on http://localhost:8080 before using the app.
  If the backend is on a different port, update baseURL in:
    src/services/api.js  →  baseURL: 'http://localhost:8080'


--------------------------------------------------------------------------------
2. TECH STACK
--------------------------------------------------------------------------------

FRAMEWORK:
  - React 19          → UI library
  - Vite 8            → Build tool and dev server (fast HMR)

STYLING:
  - Tailwind CSS v4   → Utility-first CSS framework
  - Custom CSS        → index.css (dark mode, scrollbar, glassmorphism, skeleton)

ROUTING:
  - React Router DOM v7  → Client-side routing with BrowserRouter

HTTP CLIENT:
  - Axios v1.18       → All API calls to Spring Boot backend

ANIMATIONS:
  - Framer Motion v12 → Page transitions, modal animations, sidebar, hover effects

ICONS:
  - React Icons v5    → FiXxx (Feather icons), GiXxx (Game icons)
  - Lucide React      → Additional icon set

ALERTS:
  - SweetAlert2 v11   → All success/error/confirmation popups

STATE MANAGEMENT:
  - React Context API → AuthContext (auth state), ThemeContext (dark mode)
  - localStorage      → Persisting token, role, user, theme preference


--------------------------------------------------------------------------------
3. PROJECT FOLDER STRUCTURE
--------------------------------------------------------------------------------

FrontEnd/
├── public/                    → Static assets
├── src/
│   ├── assets/                → Images (hero.png, svgs)
│   ├── components/
│   │   ├── landing/           → Landing page sections
│   │   │   ├── Navbar.jsx     → Top navigation bar (landing)
│   │   │   ├── Hero.jsx       → Hero section with parallax
│   │   │   ├── About.jsx      → About section
│   │   │   ├── CTA.jsx        → Call to action section
│   │   │   └── Footer.jsx     → Footer
│   │   ├── ui/
│   │   │   └── Skeleton.jsx   → Skeleton loaders + PageSpinner
│   │   └── ProtectedRoute.jsx → Route guard (checks JWT token)
│   ├── context/
│   │   ├── AuthContext.jsx    → Auth state (user, token, role)
│   │   └── ThemeContext.jsx   → Dark/light mode toggle
│   ├── layouts/
│   │   └── DashboardLayout.jsx → Sidebar + Navbar shell for all dashboards
│   ├── pages/
│   │   ├── LandingPage.jsx    → Public home page
│   │   ├── LoginPage.jsx      → Login form
│   │   ├── RegisterPage.jsx   → Register form
│   │   ├── AdminDashboard.jsx → Admin home with stats
│   │   ├── AdminUsersPage.jsx → Full user CRUD table
│   │   ├── FarmDashboard.jsx  → Farm Manager home with farms table
│   │   ├── GuestDashboard.jsx → Guest view-only dashboard
│   │   ├── FarmsPage.jsx      → Full farms CRUD (Admin + Farm Manager)
│   │   ├── CropsPage.jsx      → Full crops CRUD (Admin + Farm Manager)
│   │   ├── GuestFarmsPage.jsx → View-only farms page for Guest
│   │   ├── GuestCropsPage.jsx → View-only crops page for Guest
│   │   ├── ProfilePage.jsx    → User profile with edit modal
│   │   └── NotFoundPage.jsx   → 404 page
│   ├── services/
│   │   ├── api.js             → Axios instance with interceptors
│   │   ├── farmService.js     → Farm API methods
│   │   └── cropService.js     → Crop API methods
│   ├── App.jsx                → Route definitions
│   ├── main.jsx               → App entry point with providers
│   └── index.css              → Global styles + dark mode + scrollbar
├── index.html                 → HTML entry point (Google Fonts loaded here)
├── package.json               → Dependencies and scripts
└── vite.config.js             → Vite + React + Tailwind plugin config


--------------------------------------------------------------------------------
4. CONTEXT PROVIDERS (Global State)
--------------------------------------------------------------------------------

A. AuthContext  (src/context/AuthContext.jsx)
─────────────────────────────────────────────
  Wraps the entire app. Provides:
    - user       → logged-in user object (id, username, email)
    - token      → JWT token string
    - role       → user role string (ADMIN / FARM_MANAGER / GUEST)
    - login()    → saves user+token+role to state AND localStorage
    - logout()   → clears state AND localStorage
    - isAuthenticated → boolean (true if token exists)

  localStorage keys used:
    - "token"  → JWT string
    - "role"   → role string
    - "user"   → JSON stringified user object

B. ThemeContext  (src/context/ThemeContext.jsx)
───────────────────────────────────────────────
  Wraps the entire app. Provides:
    - dark    → boolean (true = dark mode)
    - toggle  → function to switch between dark/light

  Adds/removes "dark" class on <html> element.
  Persists preference to localStorage key "theme".
  Tailwind dark mode uses class strategy (dark:xxx classes).


--------------------------------------------------------------------------------
5. API LAYER
--------------------------------------------------------------------------------

A. Axios Instance  (src/services/api.js)
─────────────────────────────────────────
  Base URL: http://localhost:8080
  Content-Type: application/json

  REQUEST INTERCEPTOR:
    - Checks if URL is public (/api/auth/login or /api/auth/register)
    - If NOT public → reads token from localStorage and adds:
        Authorization: Bearer <token>

  RESPONSE INTERCEPTOR (global error handling):
    - 401 → clears localStorage token/role → redirects to /login
    - 403 → logs "Access denied"
    - 404 → logs "Resource not found"
    - 500 → logs "Server error"

B. farmService  (src/services/farmService.js)
──────────────────────────────────────────────
  getAll()         → GET  /api/farms
  getById(id)      → GET  /api/farms/{id}
  create(data)     → POST /api/farms
  update(id, data) → PUT  /api/farms/{id}
  delete(id)       → DELETE /api/farms/{id}

C. cropService  (src/services/cropService.js)
──────────────────────────────────────────────
  getAll()         → GET  /api/crops
  getById(id)      → GET  /api/crops/{id}
  create(data)     → POST /api/crops
  update(id, data) → PUT  /api/crops/{id}
  delete(id)       → DELETE /api/crops/{id}


--------------------------------------------------------------------------------
6. ROUTING  (src/App.jsx)
--------------------------------------------------------------------------------

PUBLIC ROUTES (no auth required):
  /              → LandingPage
  /login         → LoginPage
  /register      → RegisterPage
  *              → NotFoundPage (404 catch-all)

PROTECTED ROUTES (JWT token required, else redirect to /login):
  /admin-dashboard  → AdminDashboard
  /admin-users      → AdminUsersPage
  /admin-farms      → FarmsPage      (with ADMIN_NAV)
  /admin-crops      → CropsPage      (with ADMIN_NAV)
  /farm-dashboard   → FarmDashboard
  /farms            → FarmsPage      (with FARM_MANAGER_NAV)
  /crops            → CropsPage      (with FARM_MANAGER_NAV)
  /guest-dashboard  → GuestDashboard
  /guest-farms      → GuestFarmsPage
  /guest-crops      → GuestCropsPage
  /profile          → ProfilePage

HOW PROTECTED ROUTES WORK:
  ProtectedRoute.jsx reads isAuthenticated from AuthContext.
  If true  → renders <Outlet /> (the child route)
  If false → <Navigate to="/login" replace />


--------------------------------------------------------------------------------
7. AUTHENTICATION FLOW
--------------------------------------------------------------------------------

REGISTER FLOW:
  1. User fills RegisterPage form (username, email, password, confirmPassword, role)
  2. Frontend validates all fields (required, email format, password match, min 6 chars)
  3. POST /api/auth/register  →  { username, email, password, role }
  4. Success → SweetAlert2 success popup → redirect to /login
  5. Error   → SweetAlert2 error popup with backend message

LOGIN FLOW:
  1. User fills LoginPage form (email, password)
  2. Frontend validates fields
  3. POST /api/auth/login  →  { email, password }
  4. Backend returns  →  { token, role, id, username, email, ... }
  5. Frontend calls AuthContext.login(userData, token, role)
     → saves to React state + localStorage
  6. SweetAlert2 auto-close success toast (1.8s)
  7. Role-based redirect:
       ADMIN        → /admin-dashboard
       FARM_MANAGER → /farm-dashboard
       GUEST        → /guest-dashboard

LOGOUT FLOW:
  1. User clicks "Sign Out" in sidebar (any dashboard)
  2. SweetAlert2 confirmation popup
  3. If confirmed → AuthContext.logout()
     → clears state + removes token/role/user from localStorage
  4. Redirect to /login

SESSION PERSISTENCE:
  On page refresh, AuthContext reads token/role/user from localStorage.
  If token exists → user stays logged in (isAuthenticated = true).
  If token is expired → backend returns 401 → interceptor clears storage → redirect /login.


--------------------------------------------------------------------------------
8. DASHBOARD LAYOUT  (src/layouts/DashboardLayout.jsx)
--------------------------------------------------------------------------------

Shared layout used by ALL dashboard pages. Accepts props:
  - children   → page content
  - title      → page title shown in navbar
  - nav        → navigation array (ADMIN_NAV / FARM_MANAGER_NAV / GUEST_NAV)
  - roleLabel  → role label shown in sidebar user pill

SIDEBAR:
  - Dark gradient background (gray-950 → gray-900 → gray-950)
  - Agro logo (click → go to landing page)
  - User pill with avatar initial, username, role, green online dot (glassmorphism)
  - Navigation links with animated active indicator (Framer Motion layoutId)
  - Icon scale animation on hover
  - Sign Out button (red hover, rotate icon animation)
  - Mobile: hidden by default, opens as animated slide-in overlay

NAVBAR (top bar):
  - Glassmorphism background (bg-white/80 backdrop-blur-xl)
  - Hamburger menu button (mobile only)
  - Page title
  - Notification bell with green dot
  - Dark mode toggle (animated sun/moon icon swap)
  - Avatar circle linking to /profile

NAVIGATION ARRAYS:
  ADMIN_NAV:        Dashboard, Users, Farms, Crops, Profile
  FARM_MANAGER_NAV: Dashboard, Farms, Crops, Profile
  GUEST_NAV:        Dashboard, View Farms, View Crops, Profile


--------------------------------------------------------------------------------
9. PAGES – DETAILED BREAKDOWN
--------------------------------------------------------------------------------

A. LandingPage  (/src/pages/LandingPage.jsx)
─────────────────────────────────────────────
  Sections: Navbar → Hero → About → CTA → Footer
  - Hero: parallax background image, animated heading, scroll indicator
  - About: split layout with farm image + text
  - CTA: gradient background with register/login buttons
  - Footer: logo, contact email, scroll-to-top button
  - No API calls. Fully static.

B. RegisterPage  (/register)
──────────────────────────────
  Fields: Username, Email, Password, Confirm Password, Role dropdown
  Validation: all required, email format, password min 6, passwords match
  API: POST /api/auth/register
  On success: SweetAlert2 → redirect /login
  On error: SweetAlert2 with backend message

C. LoginPage  (/login)
────────────────────────
  Fields: Email, Password (with show/hide toggle)
  Validation: required, email format
  API: POST /api/auth/login
  On success: saves to AuthContext + localStorage → role-based redirect
  On 401/403: "Invalid Credentials" alert
  On other error: backend message alert

D. AdminDashboard  (/admin-dashboard)
───────────────────────────────────────
  APIs called on mount: GET /api/users, GET /api/farms, GET /api/crops
  Displays:
    - Welcome banner with username
    - 3 stat cards: Total Users (violet), Total Farms (emerald), Total Crops (amber)
    - Quick action buttons: Manage Users, Manage Farms, Manage Crops
    - 3 clickable overview cards navigating to each management page

E. AdminUsersPage  (/admin-users)
───────────────────────────────────
  APIs: GET /api/users, POST /api/users, PUT /api/users/{id}, DELETE /api/users/{id}
  Features:
    - Search bar (filters by username, email, role in real time)
    - Users table: avatar initial, username, email, role badge, Edit + Delete buttons
    - Add User modal: Username, Email, Password, Role (all validated)
    - Edit User modal: same fields, password optional
    - Delete: SweetAlert2 red confirmation → DELETE /api/users/{id}
    - Role badges: violet=ADMIN, emerald=FARM_MANAGER, gray=GUEST

F. FarmDashboard  (/farm-dashboard)
─────────────────────────────────────
  APIs: GET /api/farms, GET /api/crops, POST /api/farms, PUT /api/farms/{id}
  Features:
    - 3 stat cards: My Farms, Crops count, Welcome username
    - Quick actions: Add Farm, Manage Crops
    - Farms table with Edit button (NO delete for Farm Manager)
    - Add/Edit farm modal (Name, Location, Size)
    - Filters farms by ownerId matching logged-in user (falls back to all)

G. GuestDashboard  (/guest-dashboard)
───────────────────────────────────────
  APIs: GET /api/farms, GET /api/crops
  Features:
    - Welcome banner
    - 2 stat cards: Total Farms, Total Crops
    - Tab switcher: Farms / Crops
    - Beautiful gradient cards (emerald for farms, amber for crops)
    - "View Only" badge on every card
    - NO add/edit/delete buttons anywhere

H. FarmsPage  (/farms and /admin-farms)
─────────────────────────────────────────
  APIs: GET /api/farms, POST /api/farms, PUT /api/farms/{id}, DELETE /api/farms/{id}
  Features:
    - Search bar with clear button
    - Pagination (6 farms per page) with Previous/Next/page number buttons
    - Table: #, Farm Name, Location, Area (ha), Owner ID, Actions
    - Add/Edit modal: Farm Name, Location, Area, Owner ID
    - Delete: SweetAlert2 confirmation
    - Role-aware: canWrite = ADMIN or FARM_MANAGER (shows action buttons)
    - Nav auto-selects ADMIN_NAV or FARM_MANAGER_NAV based on role

I. CropsPage  (/crops and /admin-crops)
─────────────────────────────────────────
  APIs: GET /api/crops, POST /api/crops, PUT /api/crops/{id}, DELETE /api/crops/{id}
  Features:
    - Search bar (filters by crop name or season)
    - Pagination (6 crops per page)
    - Table: #, Crop Name, Season badge (color-coded), Farm ID, Actions
    - Season badges: Spring=green, Summer=amber, Autumn=orange, Winter=blue
    - Add/Edit modal: Crop Name, Season dropdown, Farm ID
    - Delete: SweetAlert2 confirmation
    - Role-aware: canWrite = ADMIN or FARM_MANAGER

J. GuestFarmsPage  (/guest-farms)
───────────────────────────────────
  API: GET /api/farms
  Displays all farms as gradient cards. No actions. View Only badge.

K. GuestCropsPage  (/guest-crops)
───────────────────────────────────
  API: GET /api/crops
  Displays all crops as gradient cards. No actions. View Only badge.

L. ProfilePage  (/profile)
────────────────────────────
  API: GET /api/users/{id} (fetches full profile if createdAt missing)
       PUT /api/users/{id} (on edit save)
  Displays:
    - Gradient banner header
    - Avatar with initials (gradient circle)
    - Username, role badge
    - Info rows: Username, Email, Role, Member Since
    - Edit button → modal (Username, Email, New Password optional)
    - Logout button with SweetAlert2 confirmation
  On edit save: updates AuthContext + localStorage with new data
  Nav auto-selects correct nav based on role (Admin/Farm Manager/Guest)

M. NotFoundPage  (* catch-all)
────────────────────────────────
  Beautiful 404 page with:
    - Dark gradient background with dot grid
    - Animated emerald gradient "404" text
    - Go Back button (navigate(-1))
    - Back to Home button (navigate('/'))


--------------------------------------------------------------------------------
10. BACKEND API CONNECTIONS SUMMARY
--------------------------------------------------------------------------------

ENDPOINT                    METHOD   USED IN
─────────────────────────────────────────────────────────────────────────────
/api/auth/register          POST     RegisterPage
/api/auth/login             POST     LoginPage
/api/users                  GET      AdminDashboard, AdminUsersPage
/api/users/{id}             GET      ProfilePage
/api/users                  POST     AdminUsersPage (Add User modal)
/api/users/{id}             PUT      AdminUsersPage (Edit), ProfilePage (Edit)
/api/users/{id}             DELETE   AdminUsersPage
/api/farms                  GET      AdminDashboard, FarmDashboard,
                                     FarmsPage, GuestDashboard,
                                     GuestFarmsPage
/api/farms/{id}             GET      farmService.getById (available)
/api/farms                  POST     FarmsPage, FarmDashboard
/api/farms/{id}             PUT      FarmsPage, FarmDashboard
/api/farms/{id}             DELETE   FarmsPage (Admin/Farm Manager only)
/api/crops                  GET      AdminDashboard, FarmDashboard,
                                     CropsPage, GuestDashboard,
                                     GuestCropsPage
/api/crops/{id}             GET      cropService.getById (available)
/api/crops                  POST     CropsPage
/api/crops/{id}             PUT      CropsPage
/api/crops/{id}             DELETE   CropsPage (Admin/Farm Manager only)


--------------------------------------------------------------------------------
11. ROLE-BASED ACCESS CONTROL
--------------------------------------------------------------------------------

ROLE          CAN DO
──────────────────────────────────────────────────────────────────────────────
ADMIN         Full access: Users CRUD, Farms CRUD, Crops CRUD, Profile
              Sidebar: Dashboard, Users, Farms, Crops, Profile
              Redirected to: /admin-dashboard after login

FARM_MANAGER  Farms (no delete on dashboard, full CRUD on /farms page)
              Crops full CRUD, Profile edit
              Sidebar: Dashboard, Farms, Crops, Profile
              Redirected to: /farm-dashboard after login

GUEST         View only: can see farms and crops, cannot add/edit/delete
              Sidebar: Dashboard, View Farms, View Crops, Profile
              Redirected to: /guest-dashboard after login

UNAUTHENTICATED  Can only access: /, /login, /register
                 Any other route → redirect to /login


--------------------------------------------------------------------------------
12. UI FEATURES & DESIGN SYSTEM
--------------------------------------------------------------------------------

COLOR THEME:
  Primary:   Emerald (emerald-500, emerald-600, emerald-700)
  Secondary: Amber (amber-400, amber-500) for crops
  Admin:     Violet (violet-600, violet-700) for users
  Dark bg:   gray-900, gray-950
  Light bg:  gray-50, white

DARK MODE:
  Toggle button in navbar (sun/moon animated swap)
  Persisted to localStorage key "theme"
  Adds/removes "dark" class on <html>
  All pages support dark: variants for bg, text, border, table rows

ANIMATIONS (Framer Motion):
  - Page content: fade up on mount (opacity 0→1, y 10→0)
  - Sidebar: spring slide-in from left on mobile
  - Nav active indicator: shared layoutId animation
  - Modals: scale + opacity transition
  - Stat cards: staggered fade up with delay
  - Buttons: whileHover scale, whileTap scale down
  - Dark mode icon: rotate + fade swap animation
  - Landing hero: parallax scroll, zoom-in on load, staggered text

GLASSMORPHISM:
  - Sidebar user pill: glass class (bg rgba white/8, backdrop-blur)
  - Dashboard navbar: bg-white/80 backdrop-blur-xl
  - Mobile sidebar backdrop: bg-black/60 backdrop-blur-sm

SKELETON LOADING:
  Components in src/components/ui/Skeleton.jsx:
    - Skeleton       → single animated gray bar
    - SkeletonCard   → card with icon + text placeholders
    - SkeletonTable  → table with animated rows
    - PageSpinner    → centered spinning ring with "Loading..." text

FORMS:
  - All inputs have icon prefix (left-aligned)
  - Error state: red border + red background
  - Focus state: emerald border + white background
  - Password fields have show/hide toggle
  - All forms use noValidate + custom JS validation
  - Submit buttons show loading state with spinner

TABLES:
  - Rounded 2xl container with shadow
  - Sticky header with gray background
  - Hover row highlight
  - Animated rows (Framer Motion stagger)
  - Overflow-x-auto for mobile
  - Empty state with icon + message

MODALS:
  - Fixed overlay with backdrop blur
  - Scale + opacity animation (AnimatePresence)
  - Click outside to close
  - X button to close
  - Cancel + Submit button pair

ALERTS (SweetAlert2):
  - Success: green confirm button (#059669)
  - Error: red icon, green confirm button
  - Warning/Delete: red confirm button (#dc2626), gray cancel
  - Auto-close success toasts with timer progress bar


--------------------------------------------------------------------------------
13. COMPONENT DEPENDENCY MAP
--------------------------------------------------------------------------------

main.jsx
  └── ThemeProvider
        └── AuthProvider
              └── App.jsx
                    ├── LandingPage
                    │     ├── Navbar
                    │     ├── Hero
                    │     ├── About
                    │     ├── CTA
                    │     └── Footer
                    ├── LoginPage          → api.js → AuthContext
                    ├── RegisterPage       → api.js
                    ├── ProtectedRoute     → AuthContext
                    │     ├── AdminDashboard      → DashboardLayout → api.js
                    │     ├── AdminUsersPage      → DashboardLayout → api.js
                    │     ├── FarmDashboard       → DashboardLayout → api.js
                    │     ├── FarmsPage           → DashboardLayout → farmService
                    │     ├── CropsPage           → DashboardLayout → cropService
                    │     ├── GuestDashboard      → DashboardLayout → api.js
                    │     ├── GuestFarmsPage      → DashboardLayout → api.js
                    │     ├── GuestCropsPage      → DashboardLayout → api.js
                    │     └── ProfilePage         → DashboardLayout → api.js
                    └── NotFoundPage


--------------------------------------------------------------------------------
14. localStorage KEYS REFERENCE
--------------------------------------------------------------------------------

KEY       VALUE                    SET BY              CLEARED BY
────────────────────────────────────────────────────────────────────────────
token     JWT string               AuthContext.login   AuthContext.logout / 401
role      ADMIN/FARM_MANAGER/GUEST AuthContext.login   AuthContext.logout / 401
user      JSON string (user obj)   AuthContext.login   AuthContext.logout
theme     "dark" or "light"        ThemeContext        ThemeContext (on toggle)


================================================================================
END OF DOCUMENTATION
================================================================================

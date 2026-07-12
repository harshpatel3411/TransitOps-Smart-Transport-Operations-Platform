# TransitOps — Frontend

React (JS) + Vite + Tailwind v4 + react-router-dom + zustand + axios + react-toastify.

Runs on **http://localhost:5173** and talks to a backend expected on **http://localhost:3000/api**.

## 1. Install & run

```bash
npm install
npm run dev
```

The API base URL is set in `.env`:

```
VITE_API_BASE_URL=http://localhost:3000/api
```

Change this if your backend runs elsewhere.

## 2. Required backend CORS config (IMPORTANT)

Since the frontend (5173) and backend (3000) are on different origins, your Express
backend must explicitly allow the frontend's origin, or every request will fail with
a "Network Error" toast (browsers block cross-origin requests by default).

Install `cors` on the backend if you haven't:

```bash
npm install cors
```

Then in your Express app (before your routes):

```js
const cors = require("cors");

app.use(
  cors({
    origin: "http://localhost:5173", // frontend origin — exact match, no trailing slash
    credentials: true,               // only needed if you switch to cookie-based auth
  })
);
```

This app uses **JWT-in-header** auth (`Authorization: Bearer <token>`, stored in
`localStorage`), not cookies — so `credentials: true` isn't strictly required, but it
doesn't hurt if you add cookie auth later.

## 3. Login

Log in with a seeded user (see the backend's seed data) using one of the four roles:
`Fleet Manager`, `Driver`, `Safety Officer`, `Financial Analyst`. `Financial Analyst`
lands on **Reports**; everyone else lands on **Dashboard**.

## 4. Project structure

```
src/
  api/            axios instance (JWT header + global error toasts) + one file per resource
  auth/           ProtectedRoute (redirects to /login if not authenticated)
  store/          zustand stores — authStore (persisted to localStorage) +
                   one store per resource (vehicles, drivers, trips, maintenance,
                   fuel logs, expenses, dashboard). createResourceStore.js is a
                   small factory so simple CRUD stores don't repeat boilerplate.
  components/
    common/       DataTable, FormModal (field-schema-driven), Modal, ConfirmDialog,
                   StatusBadge, KPICard, FilterBar, RoleGuard, Navbar, Sidebar, EmptyState
  layouts/        AppLayout (sidebar + navbar shell)
  pages/          Login, Dashboard, Vehicles, Drivers, Trips, Maintenance,
                  FuelExpenses, Reports, NotFound
  utils/          roles.js (RBAC permission matrix), formatters.js
```

### Why fewer files than the original build-plan tree

`DataTable` + `FormModal` are generic and schema-driven (pass in `columns`/`fields`),
so Vehicles/Drivers/Maintenance/Fuel/Expenses don't need separate `VehicleForm.jsx`,
`DriverForm.jsx`, etc. — the field configuration lives at the top of each page file
instead. Trips needed custom logic (dispatch/complete/cancel + status-filtered
dropdowns) so it isn't fully generic.

## 5. RBAC

Permission matrix lives in `src/utils/roles.js`. `RoleGuard` wraps write actions
(buttons) so only allowed roles see them — this is a UI convenience only; your
backend must still enforce permissions server-side.

| Section | Write access |
|---|---|
| Vehicles | Fleet Manager |
| Drivers | Fleet Manager, Safety Officer |
| Trips (create/dispatch/complete/cancel) | Fleet Manager |
| Maintenance | Fleet Manager |
| Fuel & Expenses | Fleet Manager |

Adjust this matrix if your backend's actual role rules differ.

## 6. Error handling

Every API error (network failure, 4xx, 5xx) surfaces as a toast popup automatically
via the axios response interceptor in `src/api/axiosInstance.js` — no per-page
try/catch needed. A 401 also logs the user out and redirects to `/login`.

## 7. Assumed backend response shapes

- List endpoints: either a bare array `[...]` or `{ data: [...] }`.
- Create/update endpoints: either the bare object or `{ data: {...} }`.
- Login: `{ token, user: { id, name, email, role } }`.
- `/api/dashboard/kpis`: object with keys like `availableVehicles`/`available_vehicles`,
  `inMaintenance`/`in_maintenance`, etc. (both casings are handled — adjust
  `src/pages/Dashboard.jsx` if your backend uses different key names).
- Report endpoints: array of row objects — columns are generated from whatever keys
  are present, with currency/percentage formatting applied to recognized field names.

If your backend's actual field names differ from the schema in the build plan, the
places to adjust are: `src/pages/Dashboard.jsx` (KPI keys), `src/pages/Trips.jsx`
(`vehicle_registration`/`driver_name` display fields — falls back to raw IDs if your
backend doesn't join these), and `src/pages/Reports.jsx` (`knownRenderers` map).

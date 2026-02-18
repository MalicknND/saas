# Mignardise - Architecture & Technical Debt Prevention

## Overview

This vertical SaaS for homemade food sellers follows a **clean layered architecture** to ensure long-term maintainability, testability, and scalability.

---

## 1. Folder Structure

```
/app                 # Routes only — no business logic
  (dashboard)/       # Route group with shared layout
    dashboard/       # /dashboard
    orders/          # /orders, /orders/new, /orders/[id]
    expenses/        # /expenses
    customers/        # /customers
    debts/            # /debts

/components          # UI components only (no Supabase, no business rules)
  layout/
  ui/                # shadcn components

/features            # Feature modules (orders, expenses, customers)
  orders/
  expenses/
  customers/

/services            # Business logic — orchestration, validation rules
/repositories        # Database access — Supabase ONLY here
/lib                 # Clients, utilities (Supabase client, etc.)
/types               # Shared TypeScript types
/validators          # Zod schemas
/actions             # Server Actions — thin layer calling services

/supabase/
  migrations/        # SQL schema + RLS
```

---

## 2. Data Flow (Request → Response)

```
User Action
    → Server Action (thin: parse FormData, call service)
    → Service (business logic, workspace resolution)
    → Repository (Supabase queries)
    → Database (RLS enforced)
```

**Key rule:** React components **never** call Supabase directly. All database access goes through repositories.

---

## 3. How This Prevents Technical Debt

### 3.1 Single Responsibility

| Layer | Responsibility |
|-------|----------------|
| **App (routes)** | Routing, layout, loading/error states |
| **Features** | Feature-specific UI, forms, hooks |
| **Services** | Business rules, workspace scoping, orchestration |
| **Repositories** | Raw CRUD, always filtered by `workspace_id` |
| **Actions** | Parse input, validate with Zod, call services, revalidate |

### 3.2 No Database in Components

- **Problem:** Components that call Supabase become untestable, tightly coupled, and harder to refactor.
- **Solution:** Components only receive data as props or call server actions. All data fetching happens in server components or actions.

### 3.3 Workspace Isolation at Every Layer

- **Repository:** Every query includes `workspace_id`. RLS is the last line of defense.
- **Service:** `requireWorkspace()` resolves the user's current workspace before any repository call.
- **Never trust the frontend:** `workspace_id` is never read from the request body; it comes from the authenticated user's workspace membership.

### 3.4 Validation at the Edge

- Zod schemas in `/validators` ensure invalid data never reaches services.
- Server actions use `safeParse` and return structured errors to the client.

### 3.5 Type Safety End-to-End

- `types/database.ts` mirrors the Supabase schema.
- Repositories return typed entities.
- Services and actions preserve types through the stack.

### 3.6 Minimal State

- No Redux, no global store.
- Server state via Server Components + Server Actions.
- Client state limited to forms (React Hook Form optional) and transitions (useTransition).

### 3.7 Reusability

- Repositories can be reused by different services (e.g. customer repo used by order service).
- Features encapsulate UI that can be composed in different pages.

---

## 4. Multi-Tenancy

- Each user has **workspaces** (typically one for small sellers).
- All tables: `profiles`, `workspaces`, `customers`, `orders`, `order_payments`, `expenses` include `workspace_id` where applicable.
- **RLS policies** enforce: users only see data from workspaces they own or are members of.
- `get_user_workspace_ids()` function centralizes workspace resolution.

---

## 5. Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| Server Actions for mutations | No API route boilerplate, type-safe, works with forms |
| Repositories accept Supabase client | Enables dependency injection, easier testing |
| `requireWorkspace()` in services | Single place to enforce auth + workspace |
| Daily profit via date-range queries | Avoids full table scans; efficient for small datasets |
| Customer debt computed in repository | Complex aggregation isolated; could be moved to RPC later |

---

## 6. Future Enhancements (Without Major Refactors)

- **Add React Hook Form + Zod resolver** in feature forms for richer client-side validation.
- **Add an RPC** `get_daily_income` for more efficient daily summaries at scale.
- **Optimistic UI** via `useOptimistic` in forms.
- **Error boundaries** at route level for graceful failures.
- **PWA manifest** and service worker for offline support.

---

## 7. Testing Strategy

- **Repositories:** Mock Supabase client, assert correct queries.
- **Services:** Mock repositories, assert business logic.
- **Actions:** Mock services, assert validation and revalidation.
- **Components:** Render with mock props, no Supabase in tests.

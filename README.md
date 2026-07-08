# frontend-coding-test

Next.js + TypeScript. One app, two pages, for the 7solutions frontend challenge.

**Deploy:** https://xxx.vercel.app

## Pages

- **`/todo`** — Auto Delete Todo List (required). Click an item to move it into its category column (Fruit / Vegetable); it auto-returns to the main list after 5 seconds unless clicked again first to cancel immediately.
- **`/department-summary`** — Department Summary (optional bonus). Fetches `dummyjson.com/users` via `/api/departments`, groups by department, and shows counts, age range, and hair color breakdown per department.

## Run locally

```bash
npm install
npm run dev       # http://localhost:3000
```

## Run tests

```bash
npm test
```

## Build

```bash
npm run build
npm start
```

## Project structure

```
src/
├── pages/
│   ├── index.tsx                 # nav landing page
│   ├── todo.tsx                  # Todo List page
│   ├── department-summary.tsx    # Department Summary page
│   ├── api/departments.ts        # API route: fetch + transform, returns groupBy-department JSON
│   └── _app.tsx
├── components/todo/              # MainList, CategoryColumn, ItemButton
├── hooks/useTodoList.ts          # Todo List state + timer logic
├── constants/items.ts            # initial 11 items, 5s return delay
├── lib/
│   ├── fetchUsers.ts             # calls dummyjson (timeout + in-memory 60s cache)
│   └── transform.ts              # transformUsers - pure function, single-pass O(n)
├── types/todo.ts
├── types/user.ts
└── styles/globals.css
tests/
└── transform.test.ts             # unit tests (vitest) - 7 cases
```

## Design notes

**Todo List**

Timers are stored in a `useRef` map (`itemId -> timeoutId`), not in React state — a timer is a side effect, not render data. The cleanup effect that clears pending timers on unmount uses an empty dependency array (`[]`) deliberately: an earlier draft depended on `[activeItems]`, which fired the cleanup on every move and cancelled timers for items that hadn't reached 5 seconds yet.

**Department Summary**

- `transform.ts` is a pure function — it doesn't know about HTTP or `fetch`, so every test case runs against plain in-memory data with no network mocking.
- Single-pass, O(n) — one loop computes counts, min/max age, and address mapping together, instead of grouping first and looping per group again.
- `fetchUsers.ts` keeps an in-memory 60s cache, since `dummyjson` data is effectively static — repeated requests within the TTL skip the network call entirely.
- `?limit=0` fetches the full user list in one request instead of paginating.
- Known limitation (documented, not a bug): if two users share the same `firstName`+`lastName` within a department, the later one overwrites the earlier one's postal code in `addressUser`, since that field is keyed by name rather than user id — this matches the shape the assignment asked for.

## API

| Method | Path | Response |
|--------|------|----------|
| `GET` | `/api/departments` | `200` transformed data, or `502` `{"success": false, "error": {"code": "UPSTREAM_ERROR"}}` if `dummyjson` is unreachable |

## Deploy

```bash
npx vercel --prod
```
